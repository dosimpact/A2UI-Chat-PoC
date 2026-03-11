import { z } from 'zod';

/**
 * A definition of a UI component's API.
 * This interface defines the contract for a component's capabilities and properties,
 * independent of any specific rendering implementation.
 */
export interface ComponentApi {
  /** The name of the component as it appears in the A2UI JSON (e.g., 'Button'). */
  name: string;

  /**
   * The Zod schema describing the **properties** of this component.
   * 
   * - MUST include catalog-specific common properties (e.g. 'weight', 'accessibility').
   * - MUST NOT include 'component' or 'id' as those are handled by the framework/envelope.
   */
  readonly schema: z.ZodType<any>;

  /**
   * Compatibility contract for this component definition.
   * Defaults to non-breaking compatibility when omitted.
   */
  compatibility?: ComponentCompatibility;
}

export type CompatibilityClassification =
  | 'breaking'
  | 'non-breaking'
  | 'deprecated';

export interface ComponentCompatibility {
  /**
   * Explicit compatibility class:
   * - breaking: incompatible change
   * - non-breaking: additive/backward-compatible change
   * - deprecated: still supported but on migration path
   */
  classification: CompatibilityClassification;

  /**
   * Explicit booleans used by consuming pipelines for simple policy checks.
   */
  breaking: boolean;
  deprecated: boolean;

  /**
   * Human-readable migration guidance for consumers.
   */
  migrationHints: string[];

  /**
   * Optional component name replacement for deprecation migrations.
   */
  replacementComponent?: string;

  /**
   * Optional version marker (for docs/changelog linkage).
   */
  sinceVersion?: string;
}

export class Catalog<T extends ComponentApi> {
  readonly id: string;

  /** 
   * A map of available components. 
   * This is readonly to encourage immutable extension patterns.
   */
  readonly components: ReadonlyMap<string, T>;

  constructor(id: string, components: T[]) {
    this.id = id;
    const map = new Map<string, T>();
    for (const comp of components) {
      map.set(comp.name, {
        ...comp,
        compatibility: normalizeCompatibility(comp.compatibility),
      });
    }
    this.components = map;
  }
}

export function normalizeCompatibility(
  compatibility?: ComponentCompatibility
): ComponentCompatibility {
  if (!compatibility) {
    return {
      classification: 'non-breaking',
      breaking: false,
      deprecated: false,
      migrationHints: [],
    };
  }

  const classification = compatibility.classification;
  const breaking =
    compatibility.breaking ?? compatibility.classification === 'breaking';
  const deprecated =
    compatibility.deprecated ?? compatibility.classification === 'deprecated';

  return {
    ...compatibility,
    classification,
    breaking,
    deprecated,
    migrationHints: compatibility.migrationHints ?? [],
  };
}
