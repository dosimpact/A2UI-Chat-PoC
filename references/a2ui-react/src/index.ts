/**
 * Workspace entrypoint that exposes versioned renderer APIs.
 *
 * The actual runtime lives under `src/0.8`. Keeping the root export thin makes
 * it obvious where maintainers should work when the protocol evolves or when a
 * future version needs to coexist with `0.8`.
 */
export * as v0_8 from './0.8'
