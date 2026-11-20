/**
 * The MDX authoring barrel — one import line gives every post the full
 * component set:
 *
 *   import { Accordion, Callout, CodeTabs, FileTree, Steps, Tabs } from '../../components/mdx';
 *
 * (Paths are relative because MDX files live outside the src root alias.)
 */
export { default as Accordion } from './Accordion.astro';
export type { QA } from './Accordion.astro';
export { default as Badge } from './Badge.astro';
export { default as Button } from './Button.astro';
export { default as Callout } from './Callout.astro';
export { default as Cards } from './Cards.astro';
export type { CardItem } from './Cards.astro';
export { default as CodeTabs } from './CodeTabs.astro';
export type { CodeTab } from './CodeTabs.astro';
export { default as FileTree } from './FileTree.astro';
export { default as Icon } from './Icon.astro';
export type { FileTreeItem } from './FileTree.astro';
export { default as Steps } from './Steps.astro';
export type { Step } from './Steps.astro';
export { default as Tabs } from './Tabs.astro';
export type { TabItem } from './Tabs.astro';
export { default as Testimonial } from './Testimonial.astro';
