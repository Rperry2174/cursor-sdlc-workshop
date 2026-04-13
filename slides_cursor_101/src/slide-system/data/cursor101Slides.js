import { MASTER_NAMES, SLIDE_TYPES } from '../blockTypes.js'
import { makeSlide } from '../helpers.js'

export const cursor101Slides = [
  makeSlide({
    id: 1,
    slug: 'title-hero',
    sourceFile: 'Cursor101Title',
    className: 'title-slide',
    master: MASTER_NAMES.TITLE_SLIDE,
    type: SLIDE_TYPES.titleHero,
    badge: 'GTM Onboarding',
    titleParts: ['Cursor', '101', 'Surfaces'],
    tagline: 'From terminal to cloud - where Cursor lives and why customers care',
    pills: [
      { icon: ' layers ', text: 'CLI -> IDE -> Cloud' },
      { icon: ' team ', text: 'Who uses what' },
      { icon: ' cube ', text: 'Products by surface' },
    ],
  }),
  makeSlide({
    id: 2,
    slug: 'switching-tools-is-hard',
    sourceFile: 'Cursor101WordEditors',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.realWorldPanels,
    tone: 'monitor',
    title: 'Switching Tools Is Hard',
    subtitle:
      'Getting someone to abandon their default editor is more like changing word processors than swapping browser tabs.',
    panels: [
      {
        title: 'Google Docs',
        media: { kind: 'image', asset: 'googleDocsPlaceholder', fit: 'contain' },
        steps: [
          'Simple, collaborative, and familiar. Once it becomes the default, people defend it.',
        ],
      },
      {
        title: 'Microsoft Word',
        media: { kind: 'image', asset: 'microsoftWordPlaceholder', fit: 'contain' },
        steps: [
          'Still powerful and deeply embedded in many workflows, especially in larger organizations.',
        ],
      },
      {
        title: 'Apple Pages',
        media: { kind: 'image', asset: 'applePagesPlaceholder', fit: 'contain' },
        steps: [
          'Another strong option with loyal users who resist switching habits.',
        ],
      },
    ],
    banner:
      'Engineers feel the same loyalty to VS Code, JetBrains, Vim, or Claude Code. Cursor has to earn the switch.',
  }),
  makeSlide({
    id: 3,
    slug: 'three-surfaces-one-platform',
    sourceFile: 'Cursor101SurfaceOverview',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.takeaway,
    title: 'Three Surfaces, One Platform',
    hero: {
      lead: 'Start with the ',
      highlight: 'CLI',
      tail: ', add the IDE for guardrails, then add the Cloud for async work.',
    },
    tiles: [
      {
        label: 'CLI',
        tone: 'deploy',
        title: 'The foundation',
        media: { kind: 'image', asset: 'cliSurfacePlaceholder', fit: 'cover' },
        description: 'The most portable surface. If a machine has a terminal, Cursor can live there.',
        bullets: ['Best for power users', 'Best for scripting and automation'],
      },
      {
        label: 'IDE',
        tone: 'develop',
        title: 'The core product',
        media: { kind: 'image', asset: 'ideSurfacePlaceholder', fit: 'cover' },
        description: 'The CLI wrapped in visual context, discoverability, and day-to-day developer ergonomics.',
        bullets: ['Best for most engineers', 'Best for building and reviewing code'],
      },
      {
        label: 'Cloud',
        tone: 'plan',
        title: 'The highest abstraction',
        media: { kind: 'image', asset: 'cloudSurfacePlaceholder', fit: 'cover' },
        description: 'Agents run remotely, so the user no longer needs local setup or even a laptop open.',
        bullets: ['Best for async workflows', 'Best for PMs, AEs, and cross-functional teams'],
      },
    ],
    emphasis: {
      tone: 'green',
      label: 'Framing:',
      body: 'These are not separate products. They are different layers of abstraction on top of the same platform.',
    },
  }),
  makeSlide({
    id: 4,
    slug: 'cli-surface',
    sourceFile: 'Cursor101CliSurface',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.contextSplit,
    phase: { number: '01', tone: 'deploy', name: 'CLI' },
    title: 'The CLI: The Portable Primitive',
    subtitle:
      'Everything above it is a friendlier shell around the same core capabilities.',
    media: { kind: 'image', asset: 'cliSurfacePlaceholder', fit: 'contain' },
    contextHeading: 'At a glance',
    contextCards: [
      {
        label: 'What',
        body: 'Terminal-first Cursor access through `agent` and shell commands.',
      },
      {
        label: 'Who',
        body: 'Power users, multi-repo engineers, CI/CD owners, and text-first builders.',
      },
      {
        label: 'When',
        body: 'Headless servers, automation, multi-repo sessions, and lean setups.',
      },
      {
        label: 'Products',
        body: 'Cursor CLI, Terminal Cmd+K, `/model`, and scriptable agent flows.',
      },
    ],
    emphasis: {
      tone: 'orange',
      label: 'Key insight:',
      body: 'Because every server has a terminal, the CLI is the easiest surface to automate and run in the background.',
    },
  }),
  makeSlide({
    id: 5,
    slug: 'ide-surface',
    sourceFile: 'Cursor101IdeSurface',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.contextSplit,
    phase: { number: '02', tone: 'develop', name: 'IDE' },
    title: "The IDE: Cursor's Core Product",
    subtitle:
      'The CLI plus visual context, guardrails, and discoverability.',
    media: { kind: 'image', asset: 'ideSurfacePlaceholder', fit: 'contain' },
    contextHeading: 'At a glance',
    contextCards: [
      {
        label: 'What',
        body: 'A fork of VS Code with files, editor, chat, browser, and terminal together.',
      },
      {
        label: 'Who',
        body: 'Most engineers who want visual feedback, diffs, previews, and guardrails.',
      },
      {
        label: 'When',
        body: 'Daily development, debugging, browser preview, and design-to-code.',
      },
      {
        label: 'Products',
        body: 'Tab, Inline Edit, Chat/Agent, Ask/Plan, Rules, and MCPs.',
      },
    ],
    emphasis: {
      tone: 'green',
      label: 'Why it wins:',
      body: 'The IDE makes the same capabilities usable by far more people because the interface teaches you what is possible.',
    },
  }),
  makeSlide({
    id: 6,
    slug: 'cloud-surface',
    sourceFile: 'Cursor101CloudSurface',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.contextSplit,
    phase: { number: '03', tone: 'plan', name: 'Cloud' },
    title: 'The Cloud: Agents Without the Laptop',
    subtitle:
      'The next abstraction layer is removing local setup altogether.',
    media: { kind: 'image', asset: 'cloudSurfacePlaceholder', fit: 'contain' },
    contextHeading: 'At a glance',
    contextCards: [
      {
        label: 'What',
        body: 'Remote agents triggered from the web, Slack, or other tools.',
      },
      {
        label: 'Who',
        body: 'PMs, AEs, non-engineers, and enterprise teams that need async work.',
      },
      {
        label: 'When',
        body: 'Async requests, scheduled docs, and cross-repo work without setup.',
      },
      {
        label: 'Products',
        body: 'Cloud Agents, Automations, Self-hosted Cloud Agents, and BugBot.',
      },
    ],
    emphasis: {
      tone: 'purple',
      label: 'Why it matters:',
      body: 'This is how Cursor expands beyond developers into company workflows where the work matters most.',
    },
  }),
  makeSlide({
    id: 7,
    slug: 'choosing-the-right-surface',
    sourceFile: 'Cursor101ChooseSurface',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.workflowColumns,
    variant: 'threeColumnEvolution',
    phase: { number: '04', tone: 'monitor', name: 'Choose' },
    title: 'Choosing the Right Surface',
    subtitle:
      'The surfaces are complementary: pick the one that matches the job, then move up or down as needed.',
    workflowColumns: [
      {
        title: 'CLI',
        subtitle: 'Lowest abstraction - maximum portability',
        tone: 'deploy',
        steps: [
          'Lives in any terminal',
          'Great for multi-repo work',
          'Runs headless on servers',
          'Best for power users and automation',
        ],
        highlightStep: 2,
        footer: 'Portable, scriptable, and light on memory.',
      },
      {
        title: 'IDE',
        subtitle: 'Middle layer - richest daily workspace',
        tone: 'develop',
        steps: [
          'Shows files, code, chat, and browser together',
          'Great for editing and debugging',
          'Teaches features through the UI',
          'Best for most developers day to day',
        ],
        highlightStep: 1,
        footer: 'The default home base for most engineering work.',
      },
      {
        title: 'Cloud',
        subtitle: 'Highest abstraction - async by default',
        tone: 'plan',
        steps: [
          'Runs without local setup',
          'Great for long-running or scheduled tasks',
          'Works for PMs and cross-functional teams',
          'Best for remote, parallel workflows',
        ],
        highlightStep: 0,
        footer: 'Ideal when the outcome matters more than the local environment.',
      },
    ],
    mainTakeaway:
      'Most teams will mix all three: CLI for automation, IDE for daily building, and Cloud for async work.',
  }),
  makeSlide({
    id: 8,
    slug: 'enterprise-angle',
    sourceFile: 'Cursor101Enterprise',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.realWorldPanels,
    phase: { number: '05', tone: 'review', name: 'Enterprise' },
    title: 'Why Surface Diversity Matters in Enterprise',
    subtitle:
      'This is where Cursor starts to separate from CLI-only tools.',
    panels: [
      {
        title: 'Cursor Marketplace + Admin Control',
        media: { kind: 'image', asset: 'marketplacePlaceholder', fit: 'contain' },
        steps: [
          'Pin team plugins and skills so each persona gets the right guardrails by default.',
          'Restrict models and behavior by role instead of teaching everyone text commands.',
        ],
      },
      {
        title: 'CLI Plugin Flow',
        media: { kind: 'image', asset: 'claudePluginPlaceholder', fit: 'contain' },
        steps: [
          'Flows like `/plugin discover` work well for experts, not wider teams.',
          'That gap matters when admins, enablement, and PMs need it too.',
        ],
      },
    ],
    banner:
      'A platform with multiple surfaces can support both expert workflows and enterprise governance.',
  }),
  makeSlide({
    id: 9,
    slug: 'key-takeaways',
    sourceFile: 'Cursor101Takeaways',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.takeaway,
    title: 'Key Takeaways',
    hero: {
      lead: 'The right question is not ',
      highlight: '"Which surface is best?"',
      tail: ' but "Which surface fits this job?"',
    },
    tiles: [
      {
        label: 'CLI',
        tone: 'deploy',
        title: 'Foundation',
        description: 'The portable primitive that can run anywhere and power automation.',
      },
      {
        label: 'IDE',
        tone: 'develop',
        title: 'Core product',
        description: 'Where most engineers spend their time because the UX removes friction and teaches the workflow.',
      },
      {
        label: 'Cloud',
        tone: 'plan',
        title: 'Growth frontier',
        description: 'Async agents and automations open Cursor to PMs, AEs, and broader company use cases.',
      },
    ],
    emphasis: {
      tone: 'green',
      label: 'Bottom line:',
      body: 'Cursor is not one interface. It is a platform that meets technical and non-technical users at different layers of abstraction.',
    },
  }),
  makeSlide({
    id: 10,
    slug: 'closing',
    sourceFile: 'Cursor101Closing',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.closing,
    title: 'Questions?',
  }),
]
