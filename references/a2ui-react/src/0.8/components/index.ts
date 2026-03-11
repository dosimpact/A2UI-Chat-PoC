/**
 * Barrel for all concrete A2UI component implementations.
 *
 * Maintainers usually arrive here after tracing `ComponentRenderer`. The
 * subfolders separate the library's component vocabulary into display, layout,
 * and interactive families that mirror the protocol's mental model.
 */

export { ComponentRenderer, registerComponent } from './ComponentRenderer'

// Display components
export * from './display'

// Layout components
export * from './layout'

// Interactive components
export * from './interactive'
