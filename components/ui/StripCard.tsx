/* The coloured band across the top of each card, in rotation. */
const strips = ["bg-line", "bg-navy", "bg-blue"];

/**
 * A card with a coloured band across its top, which the body overlaps with
 * rounded corners. On hover the card lifts slightly and its icon turns to the
 * accent. The body opens with the icon in a circle; pass the rest as children.
 */
export function StripCard({
  index,
  icon,
  onSurface = false,
  children,
}: {
  /** Position in the list, which picks the colour of the band. */
  index: number;
  icon: React.ReactNode;
  /** The section behind the card is "surface", so the card itself is white. */
  onSurface?: boolean;
  children: React.ReactNode;
}) {
  const fill = onSurface ? "bg-white" : "bg-surface";
  const strip = strips[index % strips.length];

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-md transition-transform duration-500 ease-swift hover:scale-[1.03] ${fill}`}
    >
      {/* On a white card the pale band would disappear, so it takes the mist tone instead. */}
      <span aria-hidden className={`h-10 shrink-0 ${onSurface && strip === "bg-line" ? "bg-mist" : strip}`} />
      <div className={`-mt-4 flex flex-1 flex-col items-start rounded-t-md p-6 ${fill}`}>
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-line text-navy transition-[background-color,color,scale] duration-500 ease-swift group-hover:scale-108 group-hover:bg-blue group-hover:text-white">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
