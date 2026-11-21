/*
 * The picture behind a page's headline, drawn with WebGL.
 *
 * Twelve ribbons take three arrangements in turn. At rest they stand in the
 * page's own picture (its "look"), some with bars of light running along
 * them. As the film plays they unroll into straight strips, and then bend
 * again into the four sides of the Polaris star, three layers deep.
 *
 * Every arrangement lies flat in a plane facing +z, so a ribbon is described
 * by the heading of its centre line at each point along its length. Blending
 * the headings, and walking the line out again from its middle, bends a
 * ribbon from one shape into the next the way a strip of card would bend.
 */

/**
 * The picture the ribbons rest in. "hoops" is a row of standing hoops, for
 * the homepage. "wheel" is one ring cut into eight parts with a light passed
 * from part to part, for the ERP and its eight modules. "loop" is a figure of
 * eight that the light never leaves, for the agent that keeps a customer
 * coming back.
 */
export type HeroLook = "hoops" | "wheel" | "loop";

export type HeroScene = {
  resize(width: number, height: number, dpr: number): void;
  /**
   * `time` in seconds; `film` from 0 (the look at rest) to 1 (the star); `sway` is the pointer, -1 to 1 on each axis.
   * `home` from 0 to 1 takes the picture from wherever the film has left it straight back to the look at rest,
   * without passing through the rest of the film on the way.
   */
  render(time: number, film: number, swayX: number, swayY: number, home?: number): void;
  /** Milliseconds the picture at rest takes to draw at its present size, found by drawing it a few times and waiting for each to finish. */
  cost(): Promise<number>;
  /** Thins out the bloom, for a device that turns out to be slow. */
  simplify(): void;
  dispose(): void;
};

const SIDES = 4;
const LAYERS = 3;
const RIBBONS = SIDES * LAYERS;
const SEGMENTS = 128;
const RINGS = SEGMENTS + 1;
/* Each cross-section is a rectangle with two vertices to a face, so every face keeps its own flat normal. */
const RING_VERTS = 8;
const CAP_VERTS = 8;
const RIBBON_VERTS = RINGS * RING_VERTS + CAP_VERTS;
/* Position, normal, and the distance across the surface from the lit edge. */
const DYNAMIC = 7;
const TAU = Math.PI * 2;
const FAR_FROM_EDGE = 99;

/*
 * A ribbon at rest. `heading` is the direction of its centre line at each
 * cross-section, `length` how long the line is, and `middle` where its halfway
 * point stands. `lift` moves each cross-section forward or back, for a ribbon
 * that has to pass over itself. `hw` is half the width of the band and `ht`
 * half its thickness. `light` gives it bars of light: where the first one
 * starts and how far it travels a second, then half its length and the
 * distance to the next one, all measured in lengths of the ribbon.
 */
type Shape = {
  heading: Float32Array;
  length: number;
  middle: [number, number, number];
  lift?: Float32Array;
  hw: number;
  ht: number;
  light?: [number, number, number, number];
};
type Band = Pick<Shape, "hw" | "ht" | "light">;

/* Part of a circle around (x, y), or all of it: `sweep` is the angle it covers, and `at` where its middle sits, clockwise from the top. */
function arc(x: number, y: number, z: number, r: number, band: Band, sweep = TAU, at = 0): Shape {
  const heading = new Float32Array(RINGS);
  for (let n = 0; n < RINGS; n++) heading[n] = sweep * (0.5 - n / SEGMENTS) - at;
  return { heading, length: sweep * r, middle: [x + r * Math.sin(at), y + r * Math.cos(at), z], ...band };
}

/*
 * Any closed curve in the plane, given as a point for each `t` from 0 to 1.
 * It is walked at even steps of length, like the side of the star below.
 * `lift` gives how far forward the ribbon stands at each `t`.
 */
function trace(point: (t: number) => [number, number], z: number, lift: (t: number) => number, band: Band): Shape {
  const FINE = 4096;
  const travelled = new Float64Array(FINE + 1);
  let previous = point(0);
  for (let k = 1; k <= FINE; k++) {
    const p = point(k / FINE);
    travelled[k] = travelled[k - 1] + Math.hypot(p[0] - previous[0], p[1] - previous[1]);
    previous = p;
  }
  const length = travelled[FINE];

  const heading = new Float32Array(RINGS);
  const lifts = new Float32Array(RINGS);
  let middle = previous;
  let k = 0;
  let last = 0;
  for (let n = 0; n < RINGS; n++) {
    const target = (n / SEGMENTS) * length;
    while (k < FINE - 1 && travelled[k + 1] < target) k++;
    const t = (k + (target - travelled[k]) / (travelled[k + 1] - travelled[k])) / FINE;
    const [ax, ay] = point(t - 0.5 / FINE);
    const [bx, by] = point(t + 0.5 / FINE);
    // Each heading is kept within half a turn of the one before, so the line never spins on the spot.
    let h = Math.atan2(by - ay, bx - ax);
    if (n > 0) h -= TAU * Math.round((h - last) / TAU);
    heading[n] = last = h;
    lifts[n] = lift(t);
    if (n === SEGMENTS / 2) middle = point(t);
  }
  // Whole turns are taken off, so the middle of the line has the shortest way round to lie flat.
  const turns = TAU * Math.round(heading[SEGMENTS / 2] / TAU);
  for (let n = 0; n < RINGS; n++) heading[n] -= turns;
  return { heading, length, middle: [middle[0], middle[1], z], lift: lifts, ...band };
}

/*
 * The hoops. `x`, `y` and `z` place the centre, `r` is the radius, `hw` half
 * the width of the band and `ht` half its thickness. `light` gives a hoop
 * bars of light: where on the hoop the first one starts, how many turns they
 * make a second, and how many of them chase each other around, evenly spaced.
 */
const HOOPS: { x: number; y: number; z: number; r: number; hw: number; ht: number; light?: [number, number, number] }[] = [
  { x: 0.3, y: -0.6, z: 3.0, r: 3.4, hw: 0.55, ht: 0.07, light: [0.36, 0.075, 3] },
  { x: 1.8, y: 0.4, z: 4.6, r: 3.0, hw: 0.4, ht: 0.06, light: [0.82, 0.092, 2] },
  { x: 0.8, y: -0.9, z: 0.8, r: 2.5, hw: 0.5, ht: 0.06 },
  { x: 2.5, y: 0.2, z: 6.2, r: 4.2, hw: 0.7, ht: 0.08, light: [0.1, 0.06, 3] },
  { x: 6.0, y: -0.5, z: -2.0, r: 5.5, hw: 0.8, ht: 0.08, light: [0.45, 0.05, 3] },
  { x: 3.0, y: -1.0, z: -4.5, r: 4.4, hw: 0.5, ht: 0.07 },
  { x: 1.6, y: 0.2, z: 3.4, r: 2.0, hw: 0.12, ht: 0.05 },
  { x: 2.4, y: -0.6, z: 5.2, r: 2.4, hw: 0.3, ht: 0.06, light: [0.2, 0.11, 2] },
  { x: 4.0, y: 0.0, z: 8.0, r: 5.0, hw: 0.6, ht: 0.08 },
  { x: 8.0, y: -1.5, z: -7.0, r: 7.0, hw: 0.9, ht: 0.09 },
  { x: 0.2, y: -1.4, z: 1.8, r: 3.0, hw: 0.1, ht: 0.05 },
  { x: 3.5, y: 0.3, z: -0.6, r: 3.6, hw: 0.45, ht: 0.07, light: [0.6, 0.068, 3] },
];

const hoops = () =>
  HOOPS.map(({ x, y, z, r, hw, ht, light }) =>
    arc(x, y, z, r, { hw, ht, light: light && [light[0], light[1], 1.4 / (TAU * r), 1 / light[2]] }),
  );

/*
 * The wheel. Eight flat plates make one ring, with a gap between each and
 * every other one set a little forward, so they read as separate pieces that
 * fit. Bars of light share the ring's rim, each handed from one plate to the
 * next. A hub and two fine rings stand inside it, and one more behind.
 */
const WHEEL = { x: 3.0, y: 1.5, r: 3.5, parts: 8, gap: 0.22, bars: 4, speed: 0.45 };
const wheel = () => {
  const { x, y, r, parts, gap, bars, speed } = WHEEL;
  const turn = TAU / parts;
  const ring = Array.from({ length: parts }, (_, k) =>
    arc(
      x,
      y,
      k % 2 ? 0.28 : 0,
      r,
      { hw: 0.15, ht: 0.46, light: [-k, speed, 0.42, parts / bars] },
      turn - gap / r,
      // Measured either way from the top, so no plate has more than half a turn to make when it unrolls.
      k * turn - (k > parts / 2 ? TAU : 0),
    ),
  );
  return [
    ...ring,
    arc(x, y, 0.1, 2.35, { hw: 0.3, ht: 0.05, light: [0.2, -0.085, 1.4 / (TAU * 2.35), 1 / 2] }),
    arc(x, y, 0.5, 0.95, { hw: 0.2, ht: 0.33, light: [0.6, 0.12, 1.2 / (TAU * 0.95), 1] }),
    arc(x, y, 0.2, 1.65, { hw: 0.06, ht: 0.05 }),
    arc(x, y, -1.5, 5.1, { hw: 0.12, ht: 0.05 }),
  ];
};

/*
 * The loop. A figure of eight lying a little off level, made of flat lanes
 * side by side like a running track, with two fine outlines of the same
 * figure standing behind it. Where the figure crosses itself one pass is
 * lifted and the other lowered, so the lanes go over and under like a road
 * at a bridge, and a bar of light can run the whole figure and never stop.
 *
 * For each lane, from one side of the track to the other: how wide it is,
 * how far forward it stands, and its bars of light, given as for a hoop.
 */
const LOOP = { x: 2.8, y: 1.7, half: 5.6, tilt: -0.14, bridge: 0.55, gap: 0, depth: 0.13 };
const LANES: { w: number; z: number; light?: [number, number, number] }[] = [
  { w: 0.26, z: 0, light: [0.1, 0.05, 3] },
  { w: 0.08, z: 0.3 },
  { w: 0.16, z: 0.1 },
  { w: 0.34, z: 0.2, light: [0.55, 0.062, 2] },
  { w: 0.08, z: 0 },
  { w: 0.22, z: 0.3, light: [0.3, 0.044, 3] },
  { w: 0.12, z: 0.1 },
  { w: 0.08, z: 0.25 },
  { w: 0.2, z: 0.05, light: [0.8, 0.07, 2] },
  { w: 0.1, z: 0.3 },
];
const ECHOES = [
  { scale: 1.24, z: -1.6, hw: 0.22 },
  { scale: 1.5, z: -3.2, hw: 0.1 },
];
const loop = () => {
  const { x, y, half, tilt, bridge, gap, depth } = LOOP;
  // The figure starts and ends at its left-hand tip, so the middle of each lane is the right-hand tip.
  const angle = (t: number) => Math.PI + TAU * t;
  const figure = (u: number) => {
    const s = Math.sin(u);
    const c = Math.cos(u);
    const k = half / (1 + s * s);
    return [k * c, k * s * c];
  };
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  /* The figure at `scale`, moved `d` to the left of the way it runs. */
  const lane = (d: number, scale: number, z: number, band: Band) =>
    trace(
      (t) => {
        const u = angle(t);
        const [px, py] = figure(u);
        const [ax, ay] = figure(u - 1e-4);
        const [bx, by] = figure(u + 1e-4);
        const run = Math.hypot(bx - ax, by - ay);
        const lx = px * scale - ((by - ay) / run) * d;
        const ly = py * scale + ((bx - ax) / run) * d;
        return [x + lx * cosT - ly * sinT, y + lx * sinT + ly * cosT];
      },
      z,
      (t) => bridge * scale * Math.sin(angle(t)),
      band,
    );

  let d = -(LANES.reduce((sum, l) => sum + l.w, 0) + gap * (LANES.length - 1)) / 2;
  const track = LANES.map(({ w, z, light }) => {
    const shape = lane(d + w / 2, 1, z, { hw: depth, ht: w / 2 });
    d += w + gap;
    if (light) shape.light = [light[0], light[1], 1.6 / shape.length, 1 / light[2]];
    return shape;
  });
  return [...track, ...ECHOES.map(({ scale, z, hw }) => lane(0, scale, z, { hw, ht: 0.05 }))];
};

/*
 * The camera's path through the film: how far along the film, then the
 * angle it has swung round from straight in front, its height as an angle,
 * its distance, the point it looks at, its roll, and its field of view.
 * Every look opens on its own shot and then joins the same path.
 */
const CAMERA = [
  [0.0, 58, 3, 12.0, 1.0, 1.4, 0.0, 0, 34],
  [0.22, 66, 8, 9.5, 1.5, 1.2, 0.5, -8, 36],
  [0.45, 74, 22, 7.5, 3.0, 0.2, 0.6, -28, 40],
  [0.62, 52, 26, 9.0, 2.0, 0.6, 0.6, -16, 38],
  [0.8, 24, 8, 10.5, 1.0, 1.3, 0.6, -4, 34],
  [1.0, 10, -3, 8.8, 1.0, 1.4, 0.6, 0, 32],
];

/*
 * For each look: its ribbons at rest, its opening shot, and where on the
 * screen the glow behind it sits. `fit` is how far back the camera stands
 * for a tall, narrow screen: 1 keeps the whole width of the picture in view,
 * and less lets it run off the sides. The hoops may; a figure has to be seen whole.
 */
const LOOKS: Record<HeroLook, { shapes: () => Shape[]; shot: number[]; glow: [number, number]; fit: number }> = {
  hoops: { shapes: hoops, shot: CAMERA[0], glow: [0.74, 0.5], fit: 0.55 },
  wheel: { shapes: wheel, shot: [0.0, 32, 6, 14.5, 0.3, 1.25, 0.0, 0, 34], glow: [0.66, 0.55], fit: 1 },
  loop: { shapes: loop, shot: [0.0, 28, 10, 15.0, 1.0, 1.0, 0.0, 0, 34], glow: [0.62, 0.55], fit: 1.15 },
};

/* The strips run along x, side by side like the lanes of a road, in the same order front to back as the ribbons at rest. */
const STRIP_LENGTH = 46;
const STRIP_GAP = 0.2;
function layStrips(shapes: Shape[]) {
  const order = shapes.map((_, i) => i).sort((a, b) => shapes[a].middle[2] - shapes[b].middle[2]);
  // A strip is as wide as its ribbon is at rest, measured whichever way the ribbon is broader, and never thick.
  const lanes = shapes.map((s) => ({
    x: 0,
    y: 0,
    z: 0,
    hw: Math.max(0.09, Math.max(s.hw, s.ht) * 0.8),
    ht: Math.min(s.ht, s.hw, 0.09),
  }));
  let z = 0;
  order.forEach((i, rank) => {
    const lane = lanes[i];
    lane.z = z + lane.hw;
    z += lane.hw * 2 + STRIP_GAP;
    lane.x = 3 + ((rank * 5) % 4) - 1.5;
    lane.y = 0.3 + (((rank * 7) % 5) - 2) * 0.16;
  });
  for (const lane of lanes) lane.z -= z / 2 - 0.6;
  return lanes;
}
type Strip = ReturnType<typeof layStrips>[number];

/* The star: where it stands, the distance from its centre to a point, and how its three layers are cut and stepped. */
const STAR = { x: 1.0, y: 1.4, z: 0.6, size: 2.1, band: 0.125, gap: 0.03, back: 0.3, front: 0.12, step: 0.2 };

/*
 * One side of the star in the logo, from the top point to the right-hand
 * one, in a unit square. For each cross-section along it: the heading of the
 * curve, and how much room there is behind it before the star's own axes,
 * which is where a layer has to stop so the sides meet without overlapping.
 */
function measureStarSide() {
  const P = [0, 1, 0.0643, 0.4786, 0.4786, 0.0643, 1, 0];
  const at = (t: number) => {
    const s = 1 - t;
    const a = s * s * s;
    const b = 3 * s * s * t;
    const c = 3 * s * t * t;
    const d = t * t * t;
    return [a * P[0] + b * P[2] + c * P[4] + d * P[6], a * P[1] + b * P[3] + c * P[5] + d * P[7]];
  };
  const slope = (t: number) => {
    const s = 1 - t;
    const a = 3 * s * s;
    const b = 6 * s * t;
    const c = 3 * t * t;
    return [
      a * (P[2] - P[0]) + b * (P[4] - P[2]) + c * (P[6] - P[4]),
      a * (P[3] - P[1]) + b * (P[5] - P[3]) + c * (P[7] - P[5]),
    ];
  };

  // The curve is walked at even steps of length, not of its parameter, so a ribbon keeps an even speed along it.
  const FINE = 2048;
  const travelled = new Float64Array(FINE + 1);
  let previous = at(0);
  for (let k = 1; k <= FINE; k++) {
    const p = at(k / FINE);
    travelled[k] = travelled[k - 1] + Math.hypot(p[0] - previous[0], p[1] - previous[1]);
    previous = p;
  }
  const length = travelled[FINE];

  const heading = new Float32Array(RINGS);
  const room = new Float32Array(RINGS);
  let k = 0;
  for (let n = 0; n < RINGS; n++) {
    const target = (n / SEGMENTS) * length;
    while (k < FINE - 1 && travelled[k + 1] < target) k++;
    const t = Math.min(1, (k + (target - travelled[k]) / (travelled[k + 1] - travelled[k])) / FINE);
    const [dx, dy] = slope(t);
    const [x, y] = at(t);
    heading[n] = Math.atan2(dy, dx);
    const outX = -Math.sin(heading[n]);
    const outY = Math.cos(heading[n]);
    room[n] = Math.max(0, Math.min(outX > 1e-4 ? x / outX : Infinity, outY > 1e-4 ? y / outY : Infinity));
  }
  return { heading, room, length, middle: at(0.5) };
}

/* Everything about a ribbon that does not change from frame to frame. */
type Ribbon = {
  rest: Shape;
  strip: Strip;
  starMiddle: [number, number, number];
  /* Natural logs, so a ribbon's length changes by even proportions as it moves between shapes. */
  logLength: [number, number, number];
  starHeading: Float32Array;
  starOuter: Float32Array;
  starInner: Float32Array;
  /* How much room each cross-section of the star has to spare (none or less where the layer has run out), and the layer's half depth. */
  starSpare: Float32Array;
  starHalfDepth: number;
  /* Two different delays, so the ribbons leave each arrangement one after another. */
  delay: [number, number];
};

function describeRibbons(shapes: Shape[]): Ribbon[] {
  const side = measureStarSide();
  const strips = layStrips(shapes);
  return shapes.map((rest, i) => {
    const strip = strips[i];
    const turn = i % SIDES;
    const layer = Math.floor(i / SIDES);
    const last = layer === LAYERS - 1;
    const offset = layer * (STAR.band + STAR.gap);
    const front = STAR.front + layer * STAR.step;

    // Each side is the first one turned a quarter clockwise. The headings are kept near zero, so a strip takes the short way round.
    const starHeading = new Float32Array(RINGS);
    const starOuter = new Float32Array(RINGS);
    const starInner = new Float32Array(RINGS);
    const starSpare = new Float32Array(RINGS);
    for (let n = 0; n < RINGS; n++) {
      starHeading[n] = side.heading[n] - (turn * Math.PI) / 2 + (turn >= 2 ? TAU : 0);
      const room = side.room[n];
      const fits = room > offset + 1e-3;
      // The innermost layer runs all the way in, so the star has no hole at its centre.
      const inner = !fits ? offset : last ? room : Math.min(offset + STAR.band, room);
      starOuter[n] = -offset * STAR.size;
      starInner[n] = inner * STAR.size;
      starSpare[n] = room - offset;
    }

    let [mx, my] = side.middle;
    for (let q = 0; q < turn; q++) [mx, my] = [my, -mx];

    return {
      rest,
      strip,
      starMiddle: [STAR.x + mx * STAR.size, STAR.y + my * STAR.size, STAR.z + (front - STAR.back) / 2],
      logLength: [Math.log(rest.length), Math.log(STRIP_LENGTH), Math.log(side.length * STAR.size)],
      starHeading,
      starOuter,
      starInner,
      starSpare,
      starHalfDepth: (front + STAR.back) / 2,
      delay: [((i * 7) % RIBBONS) / RIBBONS, ((i * 5 + 3) % RIBBONS) / RIBBONS],
    };
  });
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => {
  const t = clamp01(x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/* How far the film has taken the ribbons out of their look and into strips, and out of strips and into the star. */
const UNROLL = [0.07, 0.46];
const GATHER = [0.5, 0.9];
const STAGGER = 0.42;

/* A smooth curve through the camera's stops, so it never halts at one. */
function follow(keys: number[][], p: number, out: number[]) {
  let k = 0;
  while (k < keys.length - 2 && p > keys[k + 1][0]) k++;
  const a = keys[k];
  const b = keys[k + 1];
  const before = keys[Math.max(0, k - 1)];
  const after = keys[Math.min(keys.length - 1, k + 2)];
  const span = b[0] - a[0];
  const t = clamp01((p - a[0]) / span);
  const t2 = t * t;
  const t3 = t2 * t;
  for (let c = 1; c < a.length; c++) {
    const inSlope = ((b[c] - before[c]) / (b[0] - before[0])) * span;
    const outSlope = ((after[c] - a[c]) / (after[0] - a[0])) * span;
    out[c - 1] =
      (2 * t3 - 3 * t2 + 1) * a[c] + (t3 - 2 * t2 + t) * inSlope + (3 * t2 - 2 * t3) * b[c] + (t3 - t2) * outSlope;
  }
}

/* The backdrop sits at the very back, so it is drawn after the ribbons and only where none of them is in front of it. */
const BACKDROP_VERTEX = `#version 300 es
in vec2 aCorner;
out vec2 vAt;
void main() {
  vAt = aCorner * 0.5 + 0.5;
  gl_Position = vec4(aCorner, 1.0, 1.0);
}`;

/* Night blue, lifted by one soft glow, under a sparse grid of dots and a little grain. */
const BACKDROP_FRAGMENT = `#version 300 es
precision highp float;
in vec2 vAt;
uniform vec2 uSize;
uniform vec3 uGlow;
out vec4 outColor;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 from = (vAt - uGlow.xy) * vec2(uSize.x / uSize.y, 1.0);
  float glow = exp(-dot(from, from) * 2.6) * uGlow.z;
  vec3 color = mix(vec3(0.016, 0.043, 0.094), vec3(0.027, 0.075, 0.176), vAt.x * 0.6 + (1.0 - vAt.y) * 0.25);
  color += vec3(0.055, 0.14, 0.42) * glow;
  float unit = max(1.0, uSize.y / 900.0);
  vec2 cell = mod(gl_FragCoord.xy, 40.0 * unit) - 1.5 * unit;
  color += vec3(0.5, 0.62, 1.0) * 0.1 * (1.0 - smoothstep(0.6 * unit, 1.6 * unit, length(cell)));
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.014;
  outColor = vec4(color, 1.0);
}`;

const RIBBON_VERTEX = `#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in float aEdge;
layout(location = 3) in vec2 aAlong;
uniform mat4 uCamera;
uniform vec4 uBars[${RIBBONS * 3}];
uniform vec3 uMix[${RIBBONS}];
out vec3 vPosition;
out vec3 vNormal;
out float vEdge;
out float vAlong;
flat out vec4 vBarHoop;
flat out vec4 vBarStrip;
flat out vec4 vBarStar;
flat out vec3 vGain;
flat out float vStar;
flat out float vTone;
flat out float vFacet;
void main() {
  int ribbon = int(aAlong.y + 0.5);
  vec3 mixed = uMix[ribbon];
  vPosition = aPosition;
  vNormal = aNormal;
  vEdge = aEdge;
  vAlong = aAlong.x;
  vBarHoop = uBars[ribbon];
  vBarStrip = uBars[ribbon + ${RIBBONS}];
  vBarStar = uBars[ribbon + ${RIBBONS * 2}];
  // A bar shows only while its ribbon is close to the arrangement it belongs to, so the three never smear together.
  vGain = mixed * mixed * mixed * mixed;
  vStar = mixed.z;
  // Loose ribbons each have their own shade. In the star the layers lighten towards the centre,
  // and neighbouring sides differ a little, like the facets of a cut stone.
  vTone = mix(0.82, 1.08, fract(float(ribbon) * 0.618));
  vFacet = float(ribbon / ${SIDES}) * 0.085 + (ribbon % 2 == 0 ? 0.03 : -0.03);
  gl_Position = uCamera * vec4(aPosition, 1.0);
}`;

/*
 * A matt surface in the palette's blues: the brightness of each point picks
 * a colour from night blue up to sky. The bar of light is a white line along
 * one edge, with a pool of blue spreading from it over the two faces it touches.
 */
const RIBBON_FRAGMENT = `#version 300 es
precision highp float;
in vec3 vPosition;
in vec3 vNormal;
in float vEdge;
in float vAlong;
flat in vec4 vBarHoop;
flat in vec4 vBarStrip;
flat in vec4 vBarStar;
flat in vec3 vGain;
flat in float vStar;
flat in float vTone;
flat in float vFacet;
uniform vec3 uEye;
uniform vec3 uKey;
uniform vec3 uHaze;
uniform vec2 uFade;
uniform float uGround;
out vec4 outColor;

vec3 blues(float t) {
  vec3 c = mix(vec3(0.020, 0.055, 0.118), vec3(0.043, 0.122, 0.314), smoothstep(0.0, 0.3, t));
  c = mix(c, vec3(0.110, 0.275, 0.729), smoothstep(0.3, 0.58, t));
  c = mix(c, vec3(0.169, 0.361, 0.941), smoothstep(0.58, 0.8, t));
  return mix(c, vec3(0.553, 0.690, 1.0), smoothstep(0.8, 1.1, t));
}

/* x is the bar itself, y the longer, fainter reach of its light. Each is given as centre, half length, repeat, strength. */
vec2 bar(vec4 b) {
  float d = vAlong - b.x;
  d -= b.z * floor(d / b.z + 0.5);
  float x = abs(d) / b.y;
  return b.w * vec2(1.0 - smoothstep(0.5, 1.0, x), exp(-x * x * 0.9));
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec3 toEye = uEye - vPosition;
  float range = length(toEye);
  vec3 view = toEye / range;
  vec3 normal = normalize(vNormal);
  if (dot(normal, view) < 0.0) normal = -normal;

  float lit = max(dot(normal, normalize(uKey - vPosition)), 0.0);
  float sky = 0.5 + 0.5 * normal.y;
  float rim = pow(1.0 - max(dot(normal, view), 0.0), 3.0);
  // Loose ribbons are dim and sink into the dark at their feet. The star is brighter, and lit evenly from top to bottom.
  float ground = mix(1.0, smoothstep(-2.8, 3.0, vPosition.y), uGround);
  float loose = (0.05 + 0.6 * lit + 0.1 * sky + 0.14 * rim) * vTone * ground;
  float cut = 0.3 + 0.58 * lit + 0.1 * rim + vFacet;
  vec3 color = blues(mix(loose, cut, vStar));

  vec2 glow = vGain.x * bar(vBarHoop) + vGain.y * bar(vBarStrip) + vGain.z * bar(vBarStar);
  float core = 1.0 - smoothstep(0.026, 0.026 + max(fwidth(vEdge) * 1.5, 0.008), vEdge);
  float pool = exp(-vEdge * 4.0);
  vec3 shine = glow.x * core * vec3(1.5) + (glow.x * 0.6 + glow.y * 0.3) * pool * vec3(0.4, 0.58, 1.0);
  shine *= ground * ground;

  float haze = 1.0 - exp(-max(range - uFade.x, 0.0) * uFade.y);
  color = mix(color + shine, uHaze, haze);
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.014;
  outColor = vec4(color, 1.0);
}`;

/* Soft discs that always face the camera: the bloom around each bar of light, and the dust in the air. */
const SPRITE_VERTEX = `#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aCentre;
layout(location = 2) in vec4 aColor;
uniform mat4 uView;
uniform mat4 uLens;
out vec2 vAt;
out vec4 vColor;
void main() {
  vec4 p = uView * vec4(aCentre.xyz, 1.0);
  // Each disc is brought forward by its own radius, so the surface its light sits on does not cut it in two.
  p.xyz += vec3(aCorner, 1.0) * aCentre.w;
  vAt = aCorner;
  vColor = aColor;
  gl_Position = uLens * p;
}`;

const SPRITE_FRAGMENT = `#version 300 es
precision highp float;
in vec2 vAt;
in vec4 vColor;
out vec4 outColor;
void main() {
  float d = dot(vAt, vAt);
  float soft = max(exp(-d * vColor.a) - exp(-vColor.a), 0.0);
  outColor = vec4(vColor.rgb * soft, 1.0);
}`;

const MAX_SPRITES = 2048;
const SPRITE = 8;
const DUST = 70;

function compile(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Hero picture: shader failed to build.", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/**
 * Sets the picture up on `canvas`, in the given look. `lite` is for a slow device: edges are not smoothed and
 * the bloom is thinner. Returns null where WebGL 2 is not available, so the caller can show a still instead.
 */
export function createHeroScene(canvas: HTMLCanvasElement, look: HeroLook = "hoops", lite = false): HeroScene | null {
  const gl = canvas.getContext("webgl2", {
    antialias: !lite,
    alpha: false,
    powerPreference: lite ? "default" : "high-performance",
  });
  if (!gl) return null;

  const backdrop = compile(gl, BACKDROP_VERTEX, BACKDROP_FRAGMENT);
  const ribbon = compile(gl, RIBBON_VERTEX, RIBBON_FRAGMENT);
  const sprite = compile(gl, SPRITE_VERTEX, SPRITE_FRAGMENT);
  if (!backdrop || !ribbon || !sprite) return null;

  const uniforms = <T extends string>(program: WebGLProgram, names: T[]) =>
    Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(program, n)])) as Record<T, WebGLUniformLocation | null>;
  const backdropAt = uniforms(backdrop, ["uSize", "uGlow"]);
  const ribbonAt = uniforms(ribbon, ["uCamera", "uBars", "uMix", "uEye", "uKey", "uHaze", "uFade", "uGround"]);
  const spriteAt = uniforms(sprite, ["uView", "uLens"]);

  const { shapes, shot: opening, glow, fit } = LOOKS[look];
  const ribbons = describeRibbons(shapes());
  const path = [opening, ...CAMERA.slice(1)];
  const vertexCount = RIBBONS * RIBBON_VERTS;

  /* What never changes: how far along its ribbon each vertex is, and which ribbon that is. */
  const fixed = new Float32Array(vertexCount * 2);
  const indices = new Uint16Array(RIBBONS * (SEGMENTS * 4 * 6 + 12));
  let at = 0;
  for (let i = 0; i < RIBBONS; i++) {
    const base = i * RIBBON_VERTS;
    for (let n = 0; n < RINGS; n++) {
      for (let v = 0; v < RING_VERTS; v++) {
        fixed[(base + n * RING_VERTS + v) * 2] = n / SEGMENTS;
        fixed[(base + n * RING_VERTS + v) * 2 + 1] = i;
      }
      if (n === SEGMENTS) continue;
      for (let face = 0; face < 4; face++) {
        const a = base + n * RING_VERTS + face * 2;
        const b = a + RING_VERTS;
        indices.set([a, a + 1, b, a + 1, b + 1, b], at);
        at += 6;
      }
    }
    const caps = base + RINGS * RING_VERTS;
    for (let end = 0; end < 2; end++) {
      const c = caps + end * 4;
      for (let v = 0; v < 4; v++) {
        fixed[(c + v) * 2] = end;
        fixed[(c + v) * 2 + 1] = i;
      }
      indices.set([c, c + 1, c + 2, c + 1, c + 3, c + 2], at);
      at += 6;
    }
  }

  const shape = new Float32Array(vertexCount * DYNAMIC);
  /* The lit edge of every cross-section, kept so the bloom can be placed along it. */
  const edges = new Float32Array(RIBBONS * RINGS * 3);
  const mix = new Float32Array(RIBBONS * 3);

  const ribbonArray = gl.createVertexArray();
  gl.bindVertexArray(ribbonArray);
  const shapeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, shape.byteLength, gl.DYNAMIC_DRAW);
  const stride = DYNAMIC * 4;
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 12);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 24);
  const fixedBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, fixedBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, fixed, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, 0);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const corners = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const cornerBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, corners, gl.STATIC_DRAW);

  const backdropArray = gl.createVertexArray();
  gl.bindVertexArray(backdropArray);
  const backdropCorner = gl.getAttribLocation(backdrop, "aCorner");
  gl.enableVertexAttribArray(backdropCorner);
  gl.vertexAttribPointer(backdropCorner, 2, gl.FLOAT, false, 0, 0);

  const sprites = new Float32Array(MAX_SPRITES * SPRITE);
  const spriteArray = gl.createVertexArray();
  gl.bindVertexArray(spriteArray);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const spriteBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sprites.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, SPRITE * 4, 0);
  gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 4, gl.FLOAT, false, SPRITE * 4, 16);
  gl.vertexAttribDivisor(2, 1);
  gl.bindVertexArray(null);

  /* Dust: a fixed scatter of motes around the ribbons, each with its own size, brightness and drift. */
  const dust = new Float32Array(DUST * 6);
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let d = 0; d < DUST; d++) {
    dust.set([random() * 22 - 9, random() * 9 - 3, random() * 18 - 9, 0.012 + random() * 0.03, 0.15 + random() * 0.5, random() * TAU], d * 6);
  }

  const heading = new Float32Array(RINGS);
  const lineX = new Float32Array(RINGS);
  const lineY = new Float32Array(RINGS);

  /* Lays every ribbon out for the given blend of the three arrangements, and for how far home it has been brought. */
  let builtUnroll = -1;
  let builtGather = -1;
  let builtHome = -1;
  function build(unroll: number, gather: number, home: number) {
    builtUnroll = unroll;
    builtGather = gather;
    builtHome = home;
    for (let i = 0; i < RIBBONS; i++) {
      const r = ribbons[i];
      const { rest, strip } = r;
      // Going home, each ribbon bends from the shape it is in straight to its shape at rest, one after another.
      const away = 1 - ease((home - r.delay[0] * STAGGER) / (1 - STAGGER));
      const toStrip = ease((unroll - r.delay[0] * STAGGER) / (1 - STAGGER)) * away;
      const toStar = ease((gather - r.delay[1] * STAGGER) / (1 - STAGGER));
      const atRest = 1 - toStrip;
      const asStrip = toStrip * (1 - toStar);
      const asStar = toStrip * toStar;
      mix.set([atRest, asStrip, asStar], i * 3);

      const length = Math.exp(atRest * r.logLength[0] + asStrip * r.logLength[1] + asStar * r.logLength[2]);
      const step = length / SEGMENTS;
      for (let n = 0; n < RINGS; n++) {
        heading[n] = atRest * rest.heading[n] + asStar * r.starHeading[n];
      }

      // Walk the centre line out from its middle, a step at a time along the blended heading.
      const middle = SEGMENTS / 2;
      lineX[middle] = atRest * rest.middle[0] + asStrip * strip.x + asStar * r.starMiddle[0];
      lineY[middle] = atRest * rest.middle[1] + asStrip * strip.y + asStar * r.starMiddle[1];
      for (let n = middle + 1; n < RINGS; n++) {
        const h = (heading[n - 1] + heading[n]) / 2;
        lineX[n] = lineX[n - 1] + Math.cos(h) * step;
        lineY[n] = lineY[n - 1] + Math.sin(h) * step;
      }
      for (let n = middle - 1; n >= 0; n--) {
        const h = (heading[n + 1] + heading[n]) / 2;
        lineX[n] = lineX[n + 1] - Math.cos(h) * step;
        lineY[n] = lineY[n + 1] - Math.sin(h) * step;
      }
      const level = atRest * rest.middle[2] + asStrip * strip.z + asStar * r.starMiddle[2];
      const flatThickness = atRest * rest.ht + asStrip * strip.ht;
      const flatWidth = atRest * rest.hw + asStrip * strip.hw;
      // In the star a layer stops dead where it runs out of room. On the way there its depth tapers off instead, so no step shows.
      const taper = 0.004 + 0.3 * (1 - asStar);

      let o = i * RIBBON_VERTS * DYNAMIC;
      const put = (x: number, y: number, pz: number, nx: number, ny: number, nz: number, edge: number) => {
        shape[o] = x;
        shape[o + 1] = y;
        shape[o + 2] = pz;
        shape[o + 3] = nx;
        shape[o + 4] = ny;
        shape[o + 5] = nz;
        shape[o + 6] = edge;
        o += DYNAMIC;
      };

      for (let n = 0; n < RINGS; n++) {
        const tx = Math.cos(heading[n]);
        const ty = Math.sin(heading[n]);
        // "Out" is to the left of the direction of travel: the outside of a hoop, the top of a strip, the outside of the star.
        const outX = -ty;
        const outY = tx;
        const outer = flatThickness + asStar * r.starOuter[n];
        const inner = flatThickness + asStar * r.starInner[n];
        const hw = flatWidth + asStar * r.starHalfDepth * ease(r.starSpare[n] / taper);
        const z = rest.lift ? level + atRest * rest.lift[n] : level;
        const ox = lineX[n] + outX * outer;
        const oy = lineY[n] + outY * outer;
        const ix = lineX[n] - outX * inner;
        const iy = lineY[n] - outY * inner;
        const across = outer + inner;

        put(ox, oy, z - hw, outX, outY, 0, hw * 2);
        put(ox, oy, z + hw, outX, outY, 0, 0);
        put(ox, oy, z + hw, 0, 0, 1, 0);
        put(ix, iy, z + hw, 0, 0, 1, across);
        put(ix, iy, z + hw, -outX, -outY, 0, FAR_FROM_EDGE);
        put(ix, iy, z - hw, -outX, -outY, 0, FAR_FROM_EDGE);
        put(ix, iy, z - hw, 0, 0, -1, FAR_FROM_EDGE);
        put(ox, oy, z - hw, 0, 0, -1, FAR_FROM_EDGE);

        const e = (i * RINGS + n) * 3;
        edges[e] = ox;
        edges[e + 1] = oy;
        edges[e + 2] = z + hw;

        if (n === 0 || n === SEGMENTS) {
          const facing = n === 0 ? -1 : 1;
          const cap = (i * RIBBON_VERTS + RINGS * RING_VERTS + (n === 0 ? 0 : 4)) * DYNAMIC;
          const ring = o;
          o = cap;
          put(ox, oy, z - hw, tx * facing, ty * facing, 0, FAR_FROM_EDGE);
          put(ox, oy, z + hw, tx * facing, ty * facing, 0, FAR_FROM_EDGE);
          put(ix, iy, z - hw, tx * facing, ty * facing, 0, FAR_FROM_EDGE);
          put(ix, iy, z + hw, tx * facing, ty * facing, 0, FAR_FROM_EDGE);
          o = ring;
        }
      }
    }
    gl!.bindBuffer(gl!.ARRAY_BUFFER, shapeBuffer);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, shape);
  }

  /*
   * The bars of light. Each ribbon has one description for each arrangement:
   * the bar's centre, half its length and how often it repeats, all as
   * fractions of the ribbon's length, and then its strength. A hoop's bars
   * divide a turn evenly, so they run round and round. A strip carries several.
   * The four outer sides of the star (the first four ribbons) share one bar,
   * which repeats every four sides and so runs right around the star.
   */
  /* These run every frame, so they write straight into their arrays and leave nothing behind for the browser to clear up. */
  const bars = new Float32Array(RIBBONS * 3 * 4);
  const gain = new Float32Array(RIBBONS * 3);
  function placeBar(at: number, centre: number, half: number, repeat: number, strength: number) {
    bars[at] = centre;
    bars[at + 1] = half;
    bars[at + 2] = repeat;
    bars[at + 3] = strength;
  }
  function placeBars(time: number) {
    for (let i = 0; i < RIBBONS; i++) {
      const light = ribbons[i].rest.light;
      if (light) placeBar(i * 4, light[0] + time * light[1], light[2], light[3], 1);
      else placeBar(i * 4, 0, 1, 1, 0);
      placeBar(
        (RIBBONS + i) * 4,
        i * 0.37 + time * (0.1 + (i % 5) * 0.018),
        1.5 / STRIP_LENGTH,
        0.3 + (i % 3) * 0.06,
        i % 3 === 1 ? 0 : 1,
      );
      if (i < SIDES) placeBar((RIBBONS * 2 + i) * 4, time * 0.42 - i, 0.2, SIDES, 1);
      else placeBar((RIBBONS * 2 + i) * 4, 0, 1, 1, 0);
      // The same fourth power as in the shader, so the bloom fades with the bar it belongs to.
      for (let s = 0; s < 3; s++) gain[i * 3 + s] = Math.pow(mix[i * 3 + s], 4);
    }
  }

  function placeSprite(at: number, x: number, y: number, z: number, size: number, bright: number, green: number, fall: number) {
    const o = at * SPRITE;
    sprites[o] = x;
    sprites[o + 1] = y;
    sprites[o + 2] = z;
    sprites[o + 3] = size;
    sprites[o + 4] = 0.45 * bright;
    sprites[o + 5] = green * bright;
    sprites[o + 6] = bright;
    sprites[o + 7] = fall;
  }

  /*
   * Bloom: a string of soft discs along each bar that is in view. Returns how many discs it placed.
   * The discs lie over one another, which is costly to draw, so a slow device gets fewer of them, each brighter.
   */
  const FULL_BLOOM = 9;
  let samples = lite ? 6 : FULL_BLOOM;
  function placeBloom(count: number) {
    const each = (FULL_BLOOM / samples) * 0.1;
    for (let i = 0; i < RIBBONS; i++) {
      for (let s = 0; s < 3; s++) {
        const b = (s * RIBBONS + i) * 4;
        const strength = bars[b + 3] * gain[i * 3 + s];
        if (strength < 0.02) continue;
        const centre = bars[b];
        const half = bars[b + 1];
        const repeat = bars[b + 2];
        const first = Math.ceil((-half - centre) / repeat);
        const lastCopy = Math.floor((1 + half - centre) / repeat);
        for (let copy = first; copy <= lastCopy; copy++) {
          for (let k = 0; k < samples; k++) {
            const reach = (k / (samples - 1)) * 2 - 1;
            const along = centre + copy * repeat + reach * half;
            if (along < 0 || along > 1 || count >= MAX_SPRITES) continue;
            const ring = Math.min(SEGMENTS - 1, Math.floor(along * SEGMENTS));
            const part = along * SEGMENTS - ring;
            const e = (i * RINGS + ring) * 3;
            placeSprite(
              count,
              edges[e] + (edges[e + 3] - edges[e]) * part,
              edges[e + 1] + (edges[e + 4] - edges[e + 1]) * part,
              edges[e + 2] + (edges[e + 5] - edges[e + 2]) * part,
              0.7,
              strength * (1 - reach * reach * 0.6) * each,
              0.62,
              4.5,
            );
            count++;
          }
        }
      }
    }
    return count;
  }

  function placeDust(time: number) {
    for (let d = 0; d < DUST; d++) {
      const o = d * 6;
      const phase = dust[o + 5];
      placeSprite(
        d,
        dust[o] + Math.sin(time * 0.11 + phase) * 0.5,
        dust[o + 1] + Math.sin(time * 0.07 + phase * 2.3) * 0.4,
        dust[o + 2] + Math.cos(time * 0.09 + phase) * 0.5,
        dust[o + 3],
        dust[o + 4],
        0.6,
        3,
      );
    }
    return DUST;
  }

  const view = new Float32Array(16);
  const lens = new Float32Array(16);
  const camera = new Float32Array(16);
  const shot = new Array<number>(8).fill(0);
  let aspect = 1;

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.blendFunc(gl.ONE, gl.ONE);

  /*
   * Resolves once everything drawn so far is really on the screen's side of the graphics chip. A browser only
   * queues what it is asked to draw, so a marker is left at the end of the queue and looked for between tasks
   * until the chip has passed it. It gives up after a second, as it must if the context is lost meanwhile.
   */
  function drawn() {
    return new Promise<void>((resolve) => {
      const marker = gl!.fenceSync(gl!.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl!.flush();
      const from = performance.now();
      const { port1, port2 } = new MessageChannel();
      port1.onmessage = () => {
        const waiting = marker !== null && gl!.clientWaitSync(marker, 0, 0) === gl!.TIMEOUT_EXPIRED;
        if (waiting && performance.now() - from < 1000) return port2.postMessage(0);
        gl!.deleteSync(marker);
        port1.close();
        resolve();
      };
      port2.postMessage(0);
    });
  }

  let disposed = false;

  const scene: HeroScene = {
    resize(width, height, dpr) {
      const w = Math.max(1, Math.round(width * dpr));
      const h = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      aspect = w / h;
      gl.viewport(0, 0, w, h);
    },

    render(time, film, swayX, swayY, home = 0) {
      if (disposed) return;
      const unroll = clamp01((film - UNROLL[0]) / (UNROLL[1] - UNROLL[0]));
      const gather = clamp01((film - GATHER[0]) / (GATHER[1] - GATHER[0]));
      if (unroll !== builtUnroll || gather !== builtGather || home !== builtHome) build(unroll, gather, home);
      placeBars(time);

      // How much of what the film has done still stands. Going home, the camera swings from its
      // place in the film straight to the opening shot, and the light and the glow go with it.
      const stay = 1 - ease(home);
      follow(path, film, shot);
      for (let c = 0; c < shot.length; c++) shot[c] = opening[c + 1] + (shot[c] - opening[c + 1]) * stay;
      const [swing, lift, reach, tx, height, tz, roll, field] = shot;
      const rad = Math.PI / 180;
      const around = (swing + swayX * 2.4 + Math.sin(time * 0.21) * 1.1) * rad;
      const above = (lift - swayY * 1.4 + Math.sin(time * 0.17) * 0.5) * rad;
      // A tall, narrow screen sees less to either side, so the camera stands further back: all the way for
      // the star, which has to fit, and part of the way before that, where the ribbons may run off the sides.
      // It also aims lower at rest, which lifts the hoops clear of the text stacked at the foot of the screen.
      const settle = ease((film - 0.6) / 0.4) * stay;
      const narrow = Math.max(1, 1.15 / aspect);
      const stand = Math.pow(narrow, fit + (1 - fit) * settle);
      const back = reach * stand;
      const ty = height - (stand - 1) * 2.2 * (1 - ease(film / 0.3) * stay);
      const ex = tx - Math.sin(around) * Math.cos(above) * back;
      const ey = ty + Math.sin(above) * back;
      const ez = tz + Math.cos(around) * Math.cos(above) * back;

      // The camera's own axes: z points back at the viewer, x to the right, y up, turned by the roll.
      let zx = ex - tx;
      let zy = ey - ty;
      let zz = ez - tz;
      const zl = Math.hypot(zx, zy, zz);
      zx /= zl;
      zy /= zl;
      zz /= zl;
      let xx = zz;
      let xz = -zx;
      const xl = Math.hypot(xx, xz);
      xx /= xl;
      xz /= xl;
      let yx = zy * xz;
      let yy = zz * xx - zx * xz;
      let yz = -zy * xx;
      const cr = Math.cos(roll * rad);
      const sr = Math.sin(roll * rad);
      const rxx = xx * cr + yx * sr;
      const rxy = yy * sr;
      const rxz = xz * cr + yz * sr;
      yx = yx * cr - xx * sr;
      yy = yy * cr;
      yz = yz * cr - xz * sr;
      view.set([
        rxx, yx, zx, 0,
        rxy, yy, zy, 0,
        rxz, yz, zz, 0,
        -(rxx * ex + rxy * ey + rxz * ez), -(yx * ex + yy * ey + yz * ez), -(zx * ex + zy * ey + zz * ez), 1,
      ]);
      const near = 0.1;
      const far = 140;
      const f = 1 / Math.tan((field * rad) / 2);
      lens.fill(0);
      lens[0] = f / aspect;
      lens[5] = f;
      lens[10] = (far + near) / (near - far);
      lens[11] = -1;
      lens[14] = (2 * far * near) / (near - far);
      for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 4; r++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) sum += lens[k * 4 + r] * view[c * 4 + k];
          camera[c * 4 + r] = sum;
        }
      }

      gl.clear(gl.DEPTH_BUFFER_BIT);

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.useProgram(ribbon);
      gl.bindVertexArray(ribbonArray);
      gl.uniformMatrix4fv(ribbonAt.uCamera, false, camera);
      gl.uniform4fv(ribbonAt.uBars, bars);
      gl.uniform3fv(ribbonAt.uMix, mix);
      gl.uniform3f(ribbonAt.uEye, ex, ey, ez);
      // The key light travels with the camera, above it and to its right.
      gl.uniform3f(
        ribbonAt.uKey,
        ex + (rxx * 7 + yx * 8 - zx * 2) * stand,
        ey + (rxy * 7 + yy * 8 - zy * 2) * stand,
        ez + (rxz * 7 + yz * 8 - zz * 2) * stand,
      );
      gl.uniform3f(ribbonAt.uHaze, 0.018, 0.05, 0.11);
      // Ribbons fade into the dark with distance, measured from wherever the camera has had to stand.
      gl.uniform2f(ribbonAt.uFade, 6.5 * stand, 0.095 / stand);
      // At rest the hoops sink into the dark at their feet. The star is lit evenly.
      gl.uniform1f(ribbonAt.uGround, 1 - ease(film / 0.5) * stay);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      // The backdrop fills what the ribbons have left, so no part of the screen is shaded twice.
      gl.depthMask(false);
      gl.useProgram(backdrop);
      gl.bindVertexArray(backdropArray);
      gl.uniform2f(backdropAt.uSize, canvas.width, canvas.height);
      // The glow sits behind the ribbons at rest, and moves to the middle to stand behind the star.
      gl.uniform3f(backdropAt.uGlow, glow[0] + (0.5 - glow[0]) * settle, glow[1] + (0.5 - glow[1]) * settle, 1 - 0.4 * settle);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const count = placeBloom(placeDust(time));
      gl.enable(gl.BLEND);
      gl.useProgram(sprite);
      gl.bindVertexArray(spriteArray);
      gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprites, 0, count * SPRITE);
      gl.uniformMatrix4fv(spriteAt.uView, false, view);
      gl.uniformMatrix4fv(spriteAt.uLens, false, lens);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
      gl.bindVertexArray(null);
    },

    async cost() {
      // The first frame also builds the shaders and fills the buffers, so it is drawn and not counted.
      // The quickest of the rest is taken, since anything else the page is doing can only add to a time.
      scene.render(20, 0, 0, 0);
      await drawn();
      let quickest = Infinity;
      for (let f = 1; f <= 3; f++) {
        const from = performance.now();
        scene.render(20 + f / 60, 0, 0, 0);
        await drawn();
        quickest = Math.min(quickest, performance.now() - from);
      }
      return quickest;
    },

    simplify() {
      samples = 6;
    },

    dispose() {
      disposed = true;
      for (const buffer of [shapeBuffer, fixedBuffer, indexBuffer, cornerBuffer, spriteBuffer]) gl.deleteBuffer(buffer);
      for (const array of [ribbonArray, backdropArray, spriteArray]) gl.deleteVertexArray(array);
      for (const program of [backdrop, ribbon, sprite]) gl.deleteProgram(program);
    },
  };
  return scene;
}
