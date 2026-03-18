import type {
  NormalizedModel,
  NormalizedElement,
  NormalizedRelationship,
  NormalizedDiagram,
  LoadWarning,
} from '../../engine/types';

// ---------------------------------------------------------------------------
// Raw API shapes (from M0-01 spike)
// ---------------------------------------------------------------------------

interface RawElement {
  id: string;
  eClass: string;
  data: {
    name?: string;
    id?: string;
    source?: string;
    target?: string;
    viewpoint?: string;
    archimateElement?: string;
    children?: RawElement[];
  };
}

interface RawFolder {
  id?: string;
  eClass?: string;
  data?: {
    name?: string;
    type?: string;
    folders?: RawFolder[];
    elements?: RawElement[];
  };
}

interface RawModelContent {
  content: Array<{
    id: string;
    eClass: string;
    data: {
      name?: string;
      folders?: RawFolder[];
      elements?: RawElement[];
    };
  }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripPrefix(eClass: string): string {
  return eClass.replace(/^archimate:/, '');
}

function isRelationship(eClass: string): boolean {
  return eClass.includes('Relationship');
}

function isDiagram(eClass: string): boolean {
  return eClass === 'archimate:ArchimateDiagramModel';
}

/** Recursively collect all elements from the folder tree */
function collectElements(folders: RawFolder[]): RawElement[] {
  const result: RawElement[] = [];

  function walk(items: RawFolder[]): void {
    for (const folder of items) {
      if (folder.data?.elements) {
        result.push(...folder.data.elements);
      }
      if (folder.data?.folders) {
        walk(folder.data.folders);
      }
    }
  }

  walk(folders);
  return result;
}

/** Extract element IDs referenced by a diagram's children (recursive) */
function extractDiagramElementIds(children: RawElement[]): string[] {
  const ids: string[] = [];

  function walk(items: RawElement[]): void {
    for (const child of items) {
      if (child.data?.archimateElement) {
        ids.push(child.data.archimateElement);
      }
      if (child.data?.children) {
        walk(child.data.children);
      }
    }
  }

  walk(children);
  return ids;
}

// ---------------------------------------------------------------------------
// Main normalizer
// ---------------------------------------------------------------------------

export function normalizeModelContent(
  modelId: string,
  modelName: string,
  raw: RawModelContent,
): NormalizedModel {
  const warnings: LoadWarning[] = [];
  const root = raw.content?.[0];

  if (!root?.data?.folders) {
    return {
      id: modelId,
      name: modelName || 'Unknown Model',
      elements: [],
      relationships: [],
      diagrams: [],
      warnings: [{ message: 'Empty model: no folders found in response', type: 'empty_model' }],
    };
  }

  const allRawElements = collectElements(root.data.folders);

  const elements: NormalizedElement[] = [];
  const relationships: NormalizedRelationship[] = [];
  const diagrams: NormalizedDiagram[] = [];
  const elementIdSet = new Set<string>();

  // First pass: separate elements, relationships, diagrams
  for (const raw of allRawElements) {
    if (!raw.id) {
      warnings.push({ message: 'Skipped element without id', type: 'missing_id' });
      continue;
    }

    if (isDiagram(raw.eClass)) {
      const elementIds = raw.data?.children ? extractDiagramElementIds(raw.data.children) : [];
      diagrams.push({
        id: raw.id,
        name: raw.data?.name || raw.id,
        elementIds,
      });
    } else if (isRelationship(raw.eClass)) {
      const sourceId = raw.data?.source;
      const targetId = raw.data?.target;
      if (sourceId && targetId) {
        relationships.push({
          id: raw.id,
          sourceId,
          targetId,
          type: stripPrefix(raw.eClass),
        });
      } else {
        warnings.push({
          message: `Relationship ${raw.id} missing source or target`,
          type: 'incomplete_relationship',
          sourceId: sourceId,
          targetId: targetId,
        });
      }
    } else {
      elementIdSet.add(raw.id);
      elements.push({
        id: raw.id,
        name: raw.data?.name || raw.id,
        type: stripPrefix(raw.eClass),
        diagramIds: [],
      });
    }
  }

  // Second pass: populate diagramIds on elements
  for (const diagram of diagrams) {
    for (const eid of diagram.elementIds) {
      const el = elements.find((e) => e.id === eid);
      if (el) {
        el.diagramIds.push(diagram.id);
      }
    }
  }

  // Third pass: check for broken references in relationships
  for (const rel of relationships) {
    if (!elementIdSet.has(rel.sourceId)) {
      warnings.push({
        message: `Relationship ${rel.id}: source ${rel.sourceId} not found in elements`,
        type: 'broken_reference',
        sourceId: rel.sourceId,
        targetId: rel.targetId,
      });
    }
    if (!elementIdSet.has(rel.targetId)) {
      warnings.push({
        message: `Relationship ${rel.id}: target ${rel.targetId} not found in elements`,
        type: 'broken_reference',
        sourceId: rel.sourceId,
        targetId: rel.targetId,
      });
    }
  }

  return {
    id: modelId,
    name: modelName || root.data?.name || 'Unknown Model',
    elements,
    relationships,
    diagrams,
    warnings,
  };
}
