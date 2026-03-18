// =============================================================================
// Domain Types — ArchiLens MVP
// Source: 07_Domain_Model.md, 08_System_Context_and_Architecture.md
// =============================================================================

// ---------------------------------------------------------------------------
// Source types (from Architeezy)
// ---------------------------------------------------------------------------

/** Top-level ArchiMate model container */
export interface NormalizedModel {
  id: string;
  name: string;
  elements: NormalizedElement[];
  relationships: NormalizedRelationship[];
  diagrams: NormalizedDiagram[];
  warnings: LoadWarning[];
}

/** ArchiMate element (Application Component, Business Process, etc.) */
export interface NormalizedElement {
  id: string;
  name: string;
  type: string;
  diagramIds: string[];
}

/** Relationship between two ArchiMate elements */
export interface NormalizedRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
}

/** Diagram / View from the model */
export interface NormalizedDiagram {
  id: string;
  name: string;
  elementIds: string[];
}

/** Warning generated during data loading */
export interface LoadWarning {
  message: string;
  type: string;
  sourceId?: string;
  targetId?: string;
}

// ---------------------------------------------------------------------------
// Layer enum
// ---------------------------------------------------------------------------

/** ArchiMate 3.x layers */
export const Layer = {
  Strategy: 'Strategy',
  Business: 'Business',
  Application: 'Application',
  Technology: 'Technology',
  Physical: 'Physical',
  Motivation: 'Motivation',
  Implementation: 'Implementation',
  Other: 'Other',
} as const;

export type Layer = (typeof Layer)[keyof typeof Layer];

// ---------------------------------------------------------------------------
// Element type → Layer mapping (ArchiMate 3.x specification)
// ---------------------------------------------------------------------------

const ELEMENT_TYPE_TO_LAYER: Record<string, Layer> = {
  // Strategy
  Resource: Layer.Strategy,
  Capability: Layer.Strategy,
  ValueStream: Layer.Strategy,
  CourseOfAction: Layer.Strategy,

  // Business
  BusinessActor: Layer.Business,
  BusinessRole: Layer.Business,
  BusinessCollaboration: Layer.Business,
  BusinessInterface: Layer.Business,
  BusinessProcess: Layer.Business,
  BusinessFunction: Layer.Business,
  BusinessInteraction: Layer.Business,
  BusinessEvent: Layer.Business,
  BusinessService: Layer.Business,
  BusinessObject: Layer.Business,
  Contract: Layer.Business,
  Representation: Layer.Business,
  Product: Layer.Business,

  // Application
  ApplicationComponent: Layer.Application,
  ApplicationCollaboration: Layer.Application,
  ApplicationInterface: Layer.Application,
  ApplicationFunction: Layer.Application,
  ApplicationInteraction: Layer.Application,
  ApplicationProcess: Layer.Application,
  ApplicationEvent: Layer.Application,
  ApplicationService: Layer.Application,
  DataObject: Layer.Application,

  // Technology
  Node: Layer.Technology,
  Device: Layer.Technology,
  SystemSoftware: Layer.Technology,
  TechnologyCollaboration: Layer.Technology,
  TechnologyInterface: Layer.Technology,
  Path: Layer.Technology,
  CommunicationNetwork: Layer.Technology,
  TechnologyFunction: Layer.Technology,
  TechnologyProcess: Layer.Technology,
  TechnologyInteraction: Layer.Technology,
  TechnologyEvent: Layer.Technology,
  TechnologyService: Layer.Technology,
  Artifact: Layer.Technology,

  // Physical
  Equipment: Layer.Physical,
  Facility: Layer.Physical,
  DistributionNetwork: Layer.Physical,
  Material: Layer.Physical,

  // Motivation
  Stakeholder: Layer.Motivation,
  Driver: Layer.Motivation,
  Assessment: Layer.Motivation,
  Goal: Layer.Motivation,
  Outcome: Layer.Motivation,
  Principle: Layer.Motivation,
  Requirement: Layer.Motivation,
  Constraint: Layer.Motivation,
  Meaning: Layer.Motivation,
  Value: Layer.Motivation,

  // Implementation & Migration
  WorkPackage: Layer.Implementation,
  Deliverable: Layer.Implementation,
  ImplementationEvent: Layer.Implementation,
  Plateau: Layer.Implementation,
  Gap: Layer.Implementation,
};

/** Maps an ArchiMate element type string to its Layer. Unknown types → Other. */
export function elementTypeToLayer(type: string): Layer {
  return ELEMENT_TYPE_TO_LAYER[type] ?? Layer.Other;
}

// ---------------------------------------------------------------------------
// Derived types (computed by ArchiLens)
// ---------------------------------------------------------------------------

/** Graph node — Element wrapper with computed metrics */
export interface GraphNode {
  element: NormalizedElement;
  degree: number;
  inDegree: number;
  outDegree: number;
  diagramsCount: number;
  isOrphan: boolean;
}

/** Graph edge — Relationship wrapper with source/target node references */
export interface GraphEdge {
  relationship: NormalizedRelationship;
  source: GraphNode;
  target: GraphNode;
}

/** Full analysis graph with indexes for fast traversal */
export interface AnalysisGraph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  adjacencyOut: Map<string, string[]>;
  adjacencyIn: Map<string, string[]>;
}

// ---------------------------------------------------------------------------
// Impact analysis types
// ---------------------------------------------------------------------------

/** Element affected by impact analysis, with distance from source */
export interface AffectedElement {
  id: string;
  name: string;
  type: string;
  layer: Layer;
  distance: number;
}

/** Layer summary — layer name + count of affected elements */
export interface LayerSummary {
  layer: Layer;
  count: number;
}

/** Diagram reference — id + name */
export interface DiagramRef {
  id: string;
  name: string;
}

/** Impact analysis result (transient, not persisted) */
export interface ImpactResult {
  sourceElementId: string;
  depth: number;
  affectedElements: AffectedElement[];
  affectedLayers: LayerSummary[];
  affectedDiagrams: DiagramRef[];
}

// ---------------------------------------------------------------------------
// Coverage / quality types
// ---------------------------------------------------------------------------

/** Broken reference detected during graph construction */
export interface BrokenReference {
  sourceId: string;
  targetId: string;
  type: string;
  reason: string;
}

/** Coverage / hygiene report for the entire model */
export interface CoverageReport {
  totalElements: number;
  orphanCount: number;
  orphanPercent: number;
  orphanElements: NormalizedElement[];
  layerDistribution: LayerSummary[];
  brokenReferences: BrokenReference[];
}
