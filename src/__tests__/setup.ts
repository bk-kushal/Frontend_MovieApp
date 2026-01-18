import { vi } from 'vitest'

// Mock fetch so tests never call your real backend
vi.stubGlobal(
  'fetch',
  vi.fn(async () => ({
    text: async () => 'Login successful',
  })) as any
)
