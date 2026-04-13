export const assets = {
  linkedoutHomepage: {
    kind: 'image',
    browserSrc: new URL('../assets/linkedout_homepage.png', import.meta.url).href,
    fileUrl: new URL('../assets/linkedout_homepage.png', import.meta.url),
    alt: 'LinkedOut homepage',
  },
  figmaDesignSystem: {
    kind: 'image',
    browserSrc: '/images/figma-design-system.png',
    fileUrl: new URL('../../public/images/figma-design-system.png', import.meta.url),
    alt: 'Figma design system with components, pages, and prototype connections',
  },
  prdExampleNotion: {
    kind: 'image',
    browserSrc: '/images/prd-example-notion.png',
    fileUrl: new URL('../../public/images/prd-example-notion.png', import.meta.url),
    alt: 'PRD example in Notion - Auto Premium Model Routing',
  },
  monitorDatadogMcp: {
    kind: 'image',
    browserSrc: '/images/monitor-datadog-mcp.png',
    fileUrl: new URL('../../public/images/monitor-datadog-mcp.png', import.meta.url),
    alt: 'Cursor incident workflow using Datadog MCP',
  },
  monitorSlackBugfix: {
    kind: 'image',
    browserSrc: '/images/monitor-slack-bugfix.png',
    fileUrl: new URL('../../public/images/monitor-slack-bugfix.png', import.meta.url),
    alt: 'Slack bug report to auto-fix PR workflow',
  },
  babyGlassDemo: {
    kind: 'video',
    browserSrc: '/videos/baby-glass-demo.mov',
    fileUrl: new URL('../../public/videos/baby-glass-demo.mov', import.meta.url),
  },
  designCustomerStory: {
    kind: 'video',
    browserSrc: '/videos/design-customer-story.mp4',
    fileUrl: new URL('../../public/videos/design-customer-story.mp4', import.meta.url),
  },
}

export function getAsset(key) {
  return assets[key]
}
