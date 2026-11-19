/**
 * A rectangular toggle: a label wrapping a visually hidden radio or checkbox.
 * Unchecked it is white with an ink border; hover snaps it to blue, and
 * checked inverts it to ink. The state is read from the input itself.
 */
export const chipClass =
  "inline-flex min-h-11 cursor-pointer items-center gap-2.5 border-2 border-ink bg-white px-4 py-2 text-label uppercase text-ink transition-colors duration-150 ease-linear hover:border-blue hover:bg-blue hover:text-white has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue";
