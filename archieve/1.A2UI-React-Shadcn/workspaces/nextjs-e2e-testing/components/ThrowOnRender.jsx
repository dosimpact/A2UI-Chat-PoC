'use client';

export default function ThrowOnRender() {
  throw new Error('intentional crash for boundary verification');
}
