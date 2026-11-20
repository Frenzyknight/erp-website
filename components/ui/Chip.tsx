/**
 * A pill toggle: a label wrapping a visually hidden radio or checkbox.
 * Unchecked it is a quiet grey pill that darkens on hover; checked it fills
 * with navy. The state is read from the input itself.
 */
export const chipClass =
  "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-line px-5 py-2 text-caption font-semibold text-ink transition-colors duration-200 ease-out hover:bg-mist has-[:checked]:bg-navy has-[:checked]:text-white has-[:checked]:hover:bg-blue has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue";

/** A static pill for lists of features and modules. Set the colours where it is used. */
export const tagClass = "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-caption font-semibold";
