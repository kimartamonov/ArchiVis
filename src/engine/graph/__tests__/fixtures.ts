import type {
  NormalizedElement,
  NormalizedRelationship,
  NormalizedDiagram,
  NormalizedModel,
} from '../../types';

/** Create a minimal NormalizedElement. */
export function makeElement(
  id: string,
  name: string = id,
  type: string = 'ApplicationComponent',
  diagramIds: string[] = [],
): NormalizedElement {
  return { id, name, type, diagramIds };
}

/** Create a minimal NormalizedRelationship. */
export function makeRelationship(
  id: string,
  sourceId: string,
  targetId: string,
  type: string = 'ServingRelationship',
): NormalizedRelationship {
  return { id, sourceId, targetId, type };
}

/** Assemble a NormalizedModel from parts. */
export function makeModel(
  elements: NormalizedElement[],
  relationships: NormalizedRelationship[] = [],
  diagrams: NormalizedDiagram[] = [],
): NormalizedModel {
  return {
    id: 'test-model',
    name: 'Test Model',
    elements,
    relationships,
    diagrams,
    warnings: [],
  };
}
