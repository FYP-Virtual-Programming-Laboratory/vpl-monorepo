import { TinyColor } from "@ctrl/tinycolor";

/**
 * Check if a colour is considered light or dark.
 * @param colour Hex colour code
 * @returns true if the colour is considered light, false otherwise
 */
export function isLightColour(colour: string) {
  const _colour = new TinyColor(colour);
  return _colour.isLight();
}
