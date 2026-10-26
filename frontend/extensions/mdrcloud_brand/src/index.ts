import type { MantineColorsTuple } from '@mantine/core';
import { Extension } from 'shared';
import '@fontsource-variable/comfortaa';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/plus-jakarta-sans';

// Values mirror mdrcloud-brand tokens/brand.css (src/brand.css is a copy of it).
const mdr: MantineColorsTuple = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
];

// Mantine dark scale: [6] = surfaces (--mdr-bg-surface), [7] = page background (--mdr-bg-root).
const dark: MantineColorsTuple = [
  '#f8fafc',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#334155',
  '#1a2036',
  '#0a0d18',
  '#02040a',
  '#010207',
  '#000104',
];

class MdrCloudBrand extends Extension {
  public initializeMantineTheme() {
    return {
      colors: { mdr, dark },
      primaryColor: 'mdr',
      primaryShade: { light: 6 as const, dark: 5 as const },
      fontFamily: "'Plus Jakarta Sans Variable', system-ui, -apple-system, sans-serif",
      fontFamilyMonospace: "'JetBrains Mono Variable', 'Fira Code', monospace",
      headings: { fontFamily: "'Comfortaa Variable', 'Plus Jakarta Sans Variable', system-ui, sans-serif" },
    };
  }
}

export default new MdrCloudBrand();
