/*
 * The picture behind the headline: broad folds of blue rising out of the
 * dark from the lower right, each lit along its crest. It is drawn, not a
 * photograph, so it stays sharp at any size and takes its colours from the
 * palette. The left and top stay dark, where the logo and the headline sit.
 */

/* Each fold: the crest it is cut along, and the line its light falls off across (from the crest, into the fold). */
const folds = [
  {
    id: "art-fold-a",
    crest: "M-60 905 C 240 850 600 640 1060 215",
    fall: { x1: 560, y1: 610, x2: 760, y2: 960 },
    stops: [
      { at: 0, color: "#3f6dff" },
      { at: 0.05, color: "#2b5cf0" },
      { at: 0.3, color: "#173a9c" },
      { at: 0.7, color: "#0c2157" },
      { at: 1, color: "#081737" },
    ],
  },
  {
    id: "art-fold-b",
    crest: "M250 1060 C 470 900 760 730 1060 520",
    fall: { x1: 700, y1: 760, x2: 830, y2: 1010 },
    stops: [
      { at: 0, color: "#5a83ff" },
      { at: 0.06, color: "#2f60f3" },
      { at: 0.4, color: "#1b43b4" },
      { at: 1, color: "#0c2259" },
    ],
  },
  {
    id: "art-fold-c",
    crest: "M600 1060 C 740 960 900 860 1060 780",
    fall: { x1: 850, y1: 890, x2: 920, y2: 1040 },
    stops: [
      { at: 0, color: "#86a7ff" },
      { at: 0.1, color: "#3a69f5" },
      { at: 1, color: "#1a40ae" },
    ],
  },
];

export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMax slice" className={className}>
      <defs>
        <linearGradient id="art-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-night)" />
          <stop offset="0.55" stopColor="#081a3d" />
          <stop offset="1" stopColor="#0d2660" />
        </linearGradient>
        <radialGradient id="art-glow" cx="0.78" cy="0.42" r="0.6">
          <stop offset="0" stopColor="var(--color-blue)" stopOpacity="0.34" />
          <stop offset="1" stopColor="var(--color-blue)" stopOpacity="0" />
        </radialGradient>
        {folds.map((f) => (
          <linearGradient key={f.id} id={f.id} gradientUnits="userSpaceOnUse" {...f.fall}>
            {f.stops.map((s) => (
              <stop key={s.at} offset={s.at} stopColor={s.color} />
            ))}
          </linearGradient>
        ))}
        <filter id="art-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="art-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.55" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="1000" height="1000" fill="url(#art-base)" />
      <rect width="1000" height="1000" fill="url(#art-glow)" />

      {folds.map((f) => (
        <g key={f.id}>
          {/* The shadow the fold throws on what lies behind it. */}
          <path d={f.crest} fill="none" stroke="var(--color-night)" strokeOpacity="0.55" strokeWidth="46" filter="url(#art-soft)" />
          <path d={`${f.crest} L1060 1060 L-60 1060 Z`} fill={`url(#${f.id})`} />
          {/* The light catching the crest. */}
          <path d={f.crest} fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
      ))}

      <rect width="1000" height="1000" filter="url(#art-grain)" opacity="0.22" style={{ mixBlendMode: "overlay" }} />
    </svg>
  );
}
