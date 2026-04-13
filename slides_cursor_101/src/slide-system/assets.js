function imageAsset(fileName, alt) {
  return {
    kind: 'image',
    browserSrc: `/images/${fileName}`,
    filePath: `../../../public/images/${fileName}`,
    alt,
  }
}

export const assets = {
  googleDocsPlaceholder: imageAsset(
    'google-docs-screenshot.png',
    'Google Docs business plan screenshot',
  ),
  microsoftWordPlaceholder: imageAsset(
    'microsoft-word-screenshot.png',
    'Microsoft Word blank document screenshot',
  ),
  applePagesPlaceholder: imageAsset(
    'apple-pages-screenshot.png',
    'Apple Pages blank document screenshot',
  ),
  cliSurfacePlaceholder: imageAsset(
    'cli-surface-screenshot.png',
    'Cursor CLI screenshot showing an agent session in the terminal',
  ),
  ideSurfacePlaceholder: imageAsset(
    'ide-surface-screenshot.png',
    'Cursor IDE screenshot showing the editor, slide preview, and agent chat',
  ),
  cloudSurfacePlaceholder: imageAsset(
    'cloud-surface-screenshot.png',
    'Cursor cloud agents screenshot in the browser',
  ),
  marketplacePlaceholder: imageAsset(
    'marketplace-placeholder.svg',
    'Placeholder for a Cursor marketplace screenshot with team-pinned plugins',
  ),
  claudePluginPlaceholder: imageAsset(
    'claude-plugin-placeholder.svg',
    'Placeholder for a Claude Code plugin discovery terminal screenshot',
  ),
}

export function getAsset(key) {
  return assets[key]
}
