import { elementTypeToLayer, Layer } from '../../../engine/types';

/** ArchiMate layer → background colour (pastel palette from spec). */
const LAYER_COLORS: Record<string, string> = {
  [Layer.Strategy]: '#FFB5B5',
  [Layer.Business]: '#FFFFB5',
  [Layer.Application]: '#B5FFFF',
  [Layer.Technology]: '#B5FFB5',
  [Layer.Physical]: '#C9E7CB',
  [Layer.Motivation]: '#CCCCFF',
  [Layer.Implementation]: '#FFD4B5',
  [Layer.Other]: '#E0E0E0',
};

/** Returns the background colour for a given element type string. */
export function colorForType(type: string): string {
  const layer = elementTypeToLayer(type);
  return LAYER_COLORS[layer] ?? LAYER_COLORS[Layer.Other];
}

/** Returns the background colour for a given layer. */
export function colorForLayer(layer: string): string {
  return LAYER_COLORS[layer] ?? LAYER_COLORS[Layer.Other];
}
