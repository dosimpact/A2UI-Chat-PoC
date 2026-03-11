/**
 * Shared utility layer for framework-agnostic helpers.
 *
 * Today this file only hosts `cn`, the class merging helper used by the UI
 * primitive wrappers. It deliberately sits outside `src/0.8` because it
 * supports presentation concerns, not the A2UI protocol runtime.
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
