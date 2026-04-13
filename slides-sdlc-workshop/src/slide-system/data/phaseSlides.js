import { MASTER_NAMES, SLIDE_TYPES } from '../blockTypes.js'
import { makeSlide } from '../helpers.js'

const sdlcPhases = [
  { num: '01', name: 'Plan', tone: 'plan', tools: ['Jira', 'Linear', 'GitHub Issues', 'Notion', 'Confluence'] },
  { num: '02', name: 'Design', tone: 'design', tools: ['Figma', 'Adobe XD', 'Sketch', 'Storybook'] },
  {
    num: '03',
    name: 'Develop',
    tone: 'develop',
    subcategories: [
      { label: 'Source Code', tools: ['GitHub', 'GitLab'] },
      { label: 'IDE', tools: ['Cursor', 'VS Code', 'Windsurf'] },
      { label: 'Terminal', tools: ['Claude Code', 'Cursor CLI', 'Vim'] },
    ],
  },
  { num: '04', name: 'Test', tone: 'test', tools: ['GitHub Actions', 'Jenkins', 'CircleCI', 'Selenium'] },
  { num: '05', name: 'Review', tone: 'review', tools: ['GitHub PRs', 'CodeRabbit', 'Bugbot'] },
  { num: '06', name: 'Deploy', tone: 'deploy', tools: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Vercel'] },
]

const monitorPhase = {
  num: '07',
  name: 'Monitor',
  tone: 'monitor',
  tools: ['Datadog', 'New Relic', 'Dynatrace', 'Grafana'],
}

function makeHighlightSlide({ id, slug, highlight }) {
  return makeSlide({
    id,
    slug,
    sourceFile: 'SlideSdlcHighlight.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.sdlcHighlight,
    title: 'The Software Development Lifecycle',
    sdlcPhases,
    monitorPhase,
    highlight,
    footerText: 'Up next:',
  })
}

export const phaseSlides = [
  makeSlide({
    id: 4,
    slug: 'sdlc-overview',
    sourceFile: 'Slide04SdlcOverview.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.sdlcOverview,
    title: 'The Software Development Lifecycle',
    sdlcPhases,
    monitorPhase,
    footerCallout: 'Ask in discovery: what tools does your team use at each stage?',
  }),
  makeHighlightSlide({ id: 4.01, slug: 'sdlc-highlight-plan', highlight: 'Plan' }),
  makeSlide({
    id: 4.1,
    slug: 'plan-deep-dive',
    sourceFile: 'SlidePlanDeepDive.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.phaseDeepDive,
    phase: { number: '01', tone: 'plan', name: 'Plan' },
    title: 'Problem: Specs Take Weeks and Drift From Reality',
    subtitle:
      'How teams go from idea to actionable work, and where it breaks down',
    headerPill: { icon: '💡', text: 'Idea → Spec' },
    connectorLabel: 'surfaces these',
    discoveryQuestions: [
      'How do you turn a business request into a ticket or spec an engineer can act on?',
      'How long from "we want X" to an engineer writing code for X?',
      'Who writes specs / PRDs, and how much back-and-forth happens before engineering starts?',
      'How often does an engineer start building and realize the spec was unclear or incomplete?',
      'What planning tools does your team use? Where do requirements live?',
    ],
    painPoints: [
      {
        icon: '🐢',
        label: 'Slow spec handoff',
        description:
          'Weeks of meetings, docs, and Slack threads before a single line of code.',
      },
      {
        icon: '🔄',
        label: 'Ambiguous requirements',
        description:
          'PMs describe intent; engineers need precision. Context gets lost in translation.',
      },
      {
        icon: '📋',
        label: 'Ticket sprawl',
        description:
          'Stories and subtasks multiply, dependencies tangle, and nobody has the full picture.',
      },
      {
        icon: '🔁',
        label: 'Stale docs',
        description:
          'Specs in Confluence or Notion drift from reality within days of engineering starting.',
      },
      {
        icon: '⏳',
        label: 'Blocked engineers',
        description: 'They wait for PM clarification before they can write code.',
      },
    ],
    footerCallout:
      "Sound familiar? Every org hits these walls. The next slides show what's possible.",
  }),
  makeSlide({
    id: 4.11,
    slug: 'plan-prd-example',
    sourceFile: 'SlidePlanPrdExample.jsx',
    master: MASTER_NAMES.IMAGE_SLIDE,
    type: SLIDE_TYPES.mediaExample,
    phase: { number: '01', tone: 'plan', name: 'Plan' },
    title: 'Example: A Real PRD From the Cursor Team',
    link: {
      label: 'Real example from the Cursor team - Open in Notion',
      href: 'https://www.notion.so/Auto-Premium-Model-Routing',
    },
    media: {
      kind: 'image',
      asset: 'prdExampleNotion',
      fit: 'contain',
    },
  }),
  makeSlide({
    id: 4.12,
    slug: 'plan-tools',
    sourceFile: 'SlidePlanTools.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.twoColumnCycle,
    phase: { number: '01', tone: 'plan', name: 'Plan' },
    title: 'Real World: A PM Built This Entire App',
    leftTitle: 'The Planning Cycle',
    leftSubtitle:
      'Multiple stakeholders, multiple tools, multiple handoffs',
    cycleSteps: [
      {
        title: 'PM / stakeholder describes the idea',
        tools: ['Notion', 'Confluence', 'Google Docs'],
      },
      {
        title: 'Spec / PRD gets written',
        tools: ['Jira', 'Linear', 'GitHub Issues'],
      },
      {
        title: 'Engineer reads and clarifies',
        quotes: ['"What does this mean?"', '"What happens in edge cases?"'],
      },
      {
        title: 'Clarification goes back to PM',
        quotes: ['Spec updated, new questions, and more waiting'],
      },
    ],
    loopBanner: 'Repeat for days or weeks before code starts',
    media: {
      kind: 'video',
      asset: 'babyGlassDemo',
      title: 'PM Builds the Prototype',
      caption: 'A PM built this entire app - no engineer needed. Just Cursor + an idea.',
      href: 'https://baby-glass.anyweb.dev/',
    },
  }),
  makeSlide({
    id: 4.13,
    slug: 'plan-cursor-helps',
    sourceFile: 'SlidePlanCursorHelps.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.solutionImpact,
    phase: { number: '01', tone: 'plan', name: 'Plan' },
    title: 'Solution: Cursor Turns PMs into Builders',
    solution: {
      icon: '🧭',
      title: 'Planning via MCPs',
      steps: [
        'Use Notion / Linear / Jira MCPs to read the current spec and tasks.',
        'Let Cursor turn planning context into a working prototype.',
        'PMs iterate by showing instead of describing.',
        'Engineers receive a prototype plus the spec instead of a vague handoff.',
      ],
    },
    surfaceLabel: 'MCPs',
    surfaceItems: ['Notion MCP', 'Linear MCP', 'Jira MCP', 'GitHub MCP'],
    keyShift: 'PMs stop describing and start showing. The handoff becomes a working prototype.',
    impactCards: [
      { stat: 'Minutes', label: 'not weeks', body: 'Planning collapses from handoff theater into real artifacts.' },
      { stat: 'PMs', label: 'unblocked', body: 'They can prototype instead of waiting on engineering for every iteration.' },
      { stat: 'Engineers', label: 'freed', body: 'They spend less time decoding stale specs and more time shipping.' },
    ],
    bottomLine:
      'Cursor + MCPs compress planning. The artifact handed to engineering is a prototype, not a telephone game.',
  }),
  makeHighlightSlide({ id: 4.19, slug: 'sdlc-highlight-design', highlight: 'Design' }),
  makeSlide({
    id: 4.2,
    slug: 'design-deep-dive',
    sourceFile: 'SlideDesignDeepDive.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.phaseDeepDive,
    phase: { number: '02', tone: 'design', name: 'Design' },
    title: 'Problem: Design Handoffs Lose Fidelity',
    subtitle:
      'How visual design becomes working code - and why the handoff is so painful',
    headerPill: { icon: '🎨', text: 'Figma → Code' },
    connectorLabel: 'surfaces these',
    discoveryQuestions: [
      'How does design move from mockups into production code today?',
      'How many back-and-forth rounds usually happen before a feature looks right?',
      'Does the design system actually match the component library engineers use?',
      'Which design tools and frontend frameworks does the team use?',
      'Do designers ever push PRs or generate production-ready code today?',
    ],
    painPoints: [
      { icon: '↔', label: 'Design-to-code handoff', description: 'The mockup is precise, but the implementation path is fuzzy.' },
      { icon: '🛠', label: 'Rework everywhere', description: 'Both design and engineering repeat the same clarifications over and over.' },
      { icon: '📚', label: 'Design-system drift', description: 'Components and tokens in code no longer match what design expects.' },
      { icon: '🔁', label: 'Too many review rounds', description: 'Pixel fixes and spacing feedback stretch on for weeks.' },
      { icon: '❓', label: 'Designers rarely ship', description: 'They are blocked from contributing directly to production code.' },
    ],
    footerCallout:
      'Sound familiar? Design teams maintain a pixel-perfect source of truth, but the handoff usually breaks fidelity.',
  }),
  makeSlide({
    id: 4.21,
    slug: 'design-system-full',
    sourceFile: 'SlideDesignSystemFull.jsx',
    master: MASTER_NAMES.IMAGE_SLIDE,
    type: SLIDE_TYPES.mediaFullBleed,
    phase: { number: '02', tone: 'design', name: 'Design' },
    title: 'Example: A Design System in Figma',
    media: {
      kind: 'image',
      asset: 'figmaDesignSystem',
      fit: 'cover',
    },
  }),
  makeSlide({
    id: 4.22,
    slug: 'design-system-context',
    sourceFile: 'SlideDesignSystem.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.contextSplit,
    phase: { number: '02', tone: 'design', name: 'Design' },
    title: "Context: A Designer's Typical Day",
    subtitle:
      'A day in the life of a designer building and maintaining a design system',
    media: {
      kind: 'image',
      asset: 'figmaDesignSystem',
      fit: 'contain',
    },
    contextCards: [
      {
        label: 'Morning',
        body: 'Review requests against the current design system and component library.',
      },
      {
        label: 'Midday',
        body: 'Create new components, tokens, variants, and interactions in Figma.',
      },
      {
        label: 'Afternoon',
        body: 'Review implementation and compare what shipped against the mockup.',
      },
      {
        label: 'Repeat',
        body: 'Keep giving feedback like “move it 4px left” or “that border radius is off”.',
      },
    ],
    emphasis:
      'The gap: designers maintain the pixel-perfect source of truth, but handoff usually breaks fidelity.',
  }),
  makeSlide({
    id: 4.23,
    slug: 'design-video',
    sourceFile: 'SlideDesignVideo.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.twoColumnCycle,
    phase: { number: '02', tone: 'design', name: 'Design' },
    title: 'Real World: The Design-to-Code Cycle',
    leftTitle: 'The Design-to-Code Cycle',
    leftSubtitle: 'Multiple people, multiple tools, and multiple passes',
    cycleSteps: [
      { title: 'Designer hands off the mockup', tools: ['Figma', 'Sketch', 'Adobe XD'] },
      { title: 'Engineer translates it into code', tools: ['GitHub', 'GitLab'] },
      { title: 'Component docs and standards get checked', tools: ['Storybook', 'Confluence', 'Notion'] },
      { title: 'Feedback goes back to design', quotes: ['"Padding is off"', '"This does not match the prototype"'] },
    ],
    loopBanner: 'Repeat 5-10 times - weeks or months per feature',
    media: {
      kind: 'video',
      asset: 'designCustomerStory',
      title: 'Customer Story',
      caption: 'Malt - Design-to-code with Cursor + Figma MCP',
    },
  }),
  makeSlide({
    id: 4.24,
    slug: 'design-cursor-helps',
    sourceFile: 'SlideDesignCursorHelps.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.solutionImpact,
    phase: { number: '02', tone: 'design', name: 'Design' },
    title: 'Solution: Cursor Turns Designers into Builders',
    media: {
      kind: 'image',
      asset: 'figmaDesignSystem',
      fit: 'contain',
      variant: 'thumbnail',
    },
    solution: {
      icon: '🎯',
      title: 'Design-to-Code via MCPs',
      steps: [
        'Designers finalize the work in Figma.',
        'Cursor reads the file through the Figma MCP.',
        'It maps the design to real components and token-driven code.',
        'Engineers review and refine instead of rebuilding from scratch.',
      ],
    },
    keyShift:
      'The Figma file becomes a spec AI can read directly instead of something humans reinterpret by hand.',
    impactCards: [
      { stat: '5-10x', label: 'fewer revision cycles', body: 'The handoff starts much closer to the intended design.' },
      { stat: 'Designers', label: 'unblocked', body: 'They can directly influence implementation instead of waiting on translation.' },
      { stat: 'Engineers', label: 'freed', body: 'They focus on product logic and polish instead of repetitive visual rebuilding.' },
    ],
    bottomLine:
      'Designers become builders, engineers become reviewers, and the design-to-code loop gets dramatically shorter.',
  }),
  makeHighlightSlide({ id: 4.29, slug: 'sdlc-highlight-develop', highlight: 'Develop' }),
  makeSlide({
    id: 4.3,
    slug: 'develop-deep-dive',
    sourceFile: 'SlideDevelopDeepDive.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.phaseDeepDiveSplit,
    phase: { number: '03', tone: 'develop', name: 'Develop' },
    title: 'Problem: Engineers Spend 70% of Time Reading, Not Writing',
    subtitle:
      'Where the actual code gets written - and why understanding the codebase is the hard part',
    discoveryQuestions: [
      'How long does it take a new engineer to become productive in this codebase?',
      'What percentage of engineering time goes to writing code vs. understanding the system?',
      'How much work is just boilerplate, migrations, and repetitive changes?',
      'What AI tools do engineers use today, and where do they still fall short?',
    ],
    painPoints: [
      { icon: '🔀', label: 'Context switching', description: 'Engineers bounce between files, tools, tickets, and terminals all day.' },
      { icon: '🧠', label: 'Slow ramp-up', description: 'Reading unfamiliar code is slower and riskier than writing new code.' },
      { icon: '🧱', label: 'Boilerplate & toil', description: 'A huge slice of work is repetitive implementation glue.' },
    ],
    solution: {
      icon: '🤖',
      title: 'AI-Native IDE + Background Agents',
      steps: [
        'Use codebase-aware AI that understands the project instead of a single file.',
        'Let Agent Mode handle multi-file implementation work.',
        'Run Background Agents in parallel for long or independent tasks.',
        'Bring in Rules, context, and MCPs so the assistant works the way the team does.',
      ],
    },
    surfaceLabel: 'Tools today',
    surfaceItems: ['VS Code', 'GitHub Copilot', 'JetBrains', 'Windsurf'],
    bottomLine:
      'If 70% of the job is understanding the codebase, the biggest win is an AI partner with whole-repo context.',
  }),
  makeSlide({
    id: 4.31,
    slug: 'develop-video',
    sourceFile: 'SlideDevelopVideo.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.videoPlaceholder,
    phase: { number: '03', tone: 'develop', name: 'Develop' },
    title: 'Real World: Development With Cursor',
    placeholder: {
      icon: '🎬',
      title: 'Customer / SE Video: Development Workflow',
      description: 'Show an end-to-end feature being built with Agent Mode.',
    },
    outcome:
      'The real cost of development is understanding a codebase safely. Cursor acts like a senior teammate with the whole repo in mind.',
  }),
  makeHighlightSlide({ id: 4.39, slug: 'sdlc-highlight-test', highlight: 'Test' }),
  makeSlide({
    id: 4.4,
    slug: 'test-deep-dive',
    sourceFile: 'SlideTestDeepDive.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.phaseDeepDive,
    phase: { number: '04', tone: 'test', name: 'Test' },
    title: 'Problem: Everyone Agrees Tests Matter, Nobody Has Time',
    subtitle: 'Catching bugs before they ship is critical - but it is always under pressure',
    headerPill: { icon: '🧪', text: 'Code → Confidence' },
    connectorLabel: 'surfaces these',
    discoveryQuestions: [
      'What does test coverage look like today?',
      'Who writes tests - engineers, QA, or both?',
      'Which bugs keep showing up in production that tests should have caught?',
      'How long does CI take, and how often does it slow shipping down?',
      'When deadlines hit, do tests usually win or lose?',
    ],
    painPoints: [
      { icon: '📉', label: 'Low test coverage', description: 'Most teams live in the 20-40% range instead of the 70-90% they want.' },
      { icon: '🪵', label: 'Brittle tests', description: 'Tests fail for the wrong reasons and become something engineers distrust.' },
      { icon: '🐌', label: 'Slow CI', description: 'Test suites and pipelines stretch to 30-60 minutes.' },
      { icon: '🚨', label: 'Ship-it culture', description: 'Testing loses when deadlines get tight.' },
      { icon: '🧑‍🔧', label: 'Manual QA bottlenecks', description: 'Too much quality control depends on humans after the fact.' },
    ],
    footerCallout:
      'Sound familiar? Everyone knows tests matter; the challenge is making them happen without slowing the team down.',
  }),
  makeSlide({
    id: 4.41,
    slug: 'test-analogy',
    sourceFile: 'SlideTestAnalogy.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.workflowColumns,
    variant: 'analogyTimeline',
    phase: { number: '04', tone: 'test', name: 'Test' },
    title: 'Context: Why Testing Gets Skipped',
    subtitle: 'Two industries, same lesson: skip quality control, pay billions',
    timelineRows: [
      {
        label: 'Food Manufacturing',
        badge: '2010 - Wright County Egg Co.',
        steps: [
          { label: 'Source' },
          { label: 'Process' },
          { label: 'Package' },
          { label: 'Ship' },
          { label: '550M eggs recalled - salmonella', variant: 'danger' },
          { label: '$100M+ losses, criminal charges', variant: 'investment' },
          { label: 'Mandatory QC on every batch', variant: 'glow' },
        ],
      },
      {
        label: 'Software (SDLC)',
        badge: '2024 - CrowdStrike',
        steps: [
          { label: 'Plan' },
          { label: 'Design' },
          { label: 'Develop' },
          { label: 'Deploy' },
          { label: '8.5M machines crashed worldwide', variant: 'danger' },
          { label: '$5.4B in damages', variant: 'investment' },
          { label: 'Massive investment in testing', variant: 'glow' },
        ],
      },
    ],
    insightCards: [
      {
        label: 'The Pattern',
        body:
          'Both industries learned the same lesson the hard way: the cost of testing is a rounding error compared to the cost of not testing.',
      },
      {
        label: 'The Real Question',
        body:
          'Nobody asks “should we do QC?” anymore. The real question is how to check every batch without slowing down the line.',
      },
    ],
  }),
  makeSlide({
    id: 4.42,
    slug: 'test-cursor-helps',
    sourceFile: 'SlideTestCursorHelps.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.solutionImpact,
    phase: { number: '04', tone: 'test', name: 'Test' },
    title: 'Solution: Cursor Writes Tests Alongside Code',
    solution: {
      icon: '🧪',
      title: 'AI-Generated Tests + Inline Fixing',
      steps: [
        'Generate tests from the feature requirements and code that was just written.',
        'Fix failures inline instead of bouncing between test output and source files.',
        'Use Background Agents to expand coverage without blocking the engineer.',
        'Turn testing into a write / run / fix loop that happens automatically.',
      ],
    },
    keyShift: 'Testing becomes an automatic part of building every feature instead of a chore at the end.',
    impactCards: [
      { stat: '2-3x', label: 'higher coverage', body: 'Teams move from 20-40% to 70-90% much faster.' },
      { stat: 'Zero', label: 'excuses', body: 'The assistant can generate, run, and fix tests while momentum is high.' },
      { stat: 'Fewer', label: 'incidents', body: 'Bugs get caught earlier, before users or on-call engineers pay for them.' },
    ],
    bottomLine:
      'This is the software version of automated quality-control scanners on a factory line.',
  }),
  makeHighlightSlide({ id: 4.49, slug: 'sdlc-highlight-review', highlight: 'Review' }),
  makeSlide({
    id: 4.5,
    slug: 'review-deep-dive',
    sourceFile: 'SlideReviewDeepDive.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.phaseDeepDive,
    phase: { number: '05', tone: 'review', name: 'Review' },
    title: 'Problem: Code Review is the Biggest Queue',
    subtitle:
      'Code review is the quality gate - but it is also where work sits and waits',
    headerPill: { icon: '🔍', text: 'PR → Ship' },
    connectorLabel: 'surfaces these',
    discoveryQuestions: [
      'What does code-to-merge look like today?',
      'How long do PRs usually wait before someone reviews them?',
      'How are you reviewing AI-generated code today?',
      'Is this a monorepo or a platform-team-heavy workflow?',
      'What is the biggest pain in code review right now?',
    ],
    painPoints: [
      { icon: '⏳', label: 'Review bottleneck', description: 'The queue to merge is often measured in days, not minutes.' },
      { icon: '🔍', label: 'Shallow reviews', description: 'Large PRs and reviewer overload lead to lightweight checking.' },
      { icon: '🤖', label: 'AI outpaces review', description: 'More code gets generated than humans can reasonably inspect.' },
      { icon: '🔗', label: 'Serial workflow', description: 'Everything depends on one reviewer at a time.' },
      { icon: '💥', label: 'Broken main / merge pain', description: 'Monorepos and queue failures make review even riskier.' },
    ],
    footerCallout:
      'Sound familiar? Review is supposed to increase quality, but it often becomes the biggest source of delay.',
  }),
  makeSlide({
    id: 4.52,
    slug: 'review-workflow',
    sourceFile: 'SlideReviewWorkflow.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.workflowColumns,
    variant: 'threeColumnEvolution',
    phase: { number: '05', tone: 'review', name: 'Review' },
    title: 'Evolution: GitHub to Graphite to Cursor Review',
    subtitle:
      'How the review workflow evolves from serial and manual to parallel and agent-driven',
    workflowColumns: [
      {
        title: 'GitHub Today',
        subtitle: 'Serial - one PR at a time',
        tone: 'content',
        steps: ['Open PR', 'Wait for reviewer', 'Manual feedback', 'Approve + merge'],
        highlightStep: 1,
        footer: 'Avg 41 hours to merge',
      },
      {
        title: 'Graphite',
        subtitle: 'Parallel - stacked PRs + AI review',
        tone: 'plan',
        steps: ['Stacked diffs', 'AI first pass', 'Reviewer sees smaller diffs', 'Merge queue'],
        highlightStep: 1,
        footer: 'Smaller PRs → faster, deeper reviews',
      },
      {
        title: 'Cursor Review',
        subtitle: 'Massively parallel - agents create & iterate',
        tone: 'review',
        steps: [
          'Agent PR from ticket / Slack',
          'BugBot + agent self-heals CI',
          'Human + code tours',
          'Merge queue',
        ],
        highlightStep: 1,
        footer: 'Humans review, agents do everything else',
      },
    ],
    mainTakeaway:
      'Humans approve. Agents do everything else.',
  }),
  makeSlide({
    id: 4.53,
    slug: 'review-cursor-helps',
    sourceFile: 'SlideReviewCursorHelps.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.solutionImpact,
    phase: { number: '05', tone: 'review', name: 'Review' },
    title: 'Solution: BugBot + Cursor Review',
    solution: {
      icon: '🤖',
      title: 'BugBot + AI-Assisted Review',
      steps: [
        'Run BugBot on every PR.',
        'Use code tours to give humans the right context fast.',
        'Let Cloud Agents self-heal CI and iterate on review feedback.',
        'Keep diffs small with stacked changes and merge queues.',
      ],
    },
    surfaceLabel: 'Surfaces',
    surfaceItems: ['Stacking CLI', 'BugBot', 'Code Tours', 'Merge Queue', 'PR Inbox'],
    keyShift: 'Humans stop being the bottleneck and become the final approver.',
    impactCards: [
      { stat: '41h → hours', label: 'time-to-merge', body: 'Review gets dramatically faster.' },
      { stat: 'Seniors', label: 'unblocked', body: 'High-leverage reviewers stop drowning in routine inspection work.' },
      { stat: 'Scale', label: 'with AI', body: 'You can review more change safely because agents handle the heavy lifting.' },
    ],
    bottomLine:
      'Review becomes a fast, agent-powered quality gate where humans approve and agents do the repetitive work.',
  }),
  makeHighlightSlide({ id: 4.59, slug: 'sdlc-highlight-deploy', highlight: 'Deploy' }),
  makeSlide({
    id: 4.6,
    slug: 'deploy-deep-dive',
    sourceFile: 'SlideDeployDeepDive.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.phaseDeepDiveSplit,
    phase: { number: '06', tone: 'deploy', name: 'Deploy' },
    title: 'Problem: Deployment is Manual, Risky, and Slow',
    subtitle: 'Getting code to production is its own engineering problem',
    discoveryQuestions: [
      'How often do you deploy, and what gates that frequency?',
      'How much DevOps work is done by product engineers vs. a platform team?',
      'What does the deployment pipeline look like today - manual or automated?',
      'How do you handle rollbacks, canary deploys, and feature flags?',
    ],
    painPoints: [
      { icon: '🏗️', label: 'Infrastructure complexity', description: 'Terraform, Docker, K8s, CI/CD, and cloud config become a second application to maintain.' },
      { icon: '😨', label: 'Deploy fear', description: 'Risky releases mean bigger batches and even riskier failures.' },
      { icon: '🔧', label: 'Config drift', description: 'Environment differences create bugs that only appear in production.' },
    ],
    solution: {
      icon: '☁️',
      title: 'AI-Assisted DevOps + MCPs',
      steps: [
        'Generate and debug infrastructure-as-code faster.',
        'Use MCPs to inspect cloud and deployment state directly.',
        'Read failed deploy logs and have the assistant suggest concrete fixes.',
      ],
    },
    surfaceLabel: 'Tools today',
    surfaceItems: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Vercel'],
    bottomLine:
      'Infrastructure stops being a mysterious black box that only two people understand.',
  }),
  makeHighlightSlide({ id: 4.69, slug: 'sdlc-highlight-monitor', highlight: 'Monitor' }),
  makeSlide({
    id: 4.7,
    slug: 'monitor-deep-dive',
    sourceFile: 'SlideMonitorDeepDive.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.phaseDeepDive,
    phase: { number: '07', tone: 'monitor', name: 'Monitor' },
    title: 'Problem: Alert to Fix Takes Hours of Tool-Hopping',
    subtitle:
      'Production is where the real bugs live - and context is scattered across too many tools',
    headerPill: { icon: '🔔', text: 'Alert → Fix' },
    connectorLabel: 'surfaces these',
    discoveryQuestions: [
      'Which observability tools are in the stack today?',
      'What is the usual MTTR from alert to fix?',
      'How do bug reports move from user report to actual code fix?',
      'How much context-switching happens during incident response?',
      'Are the people on-call also the people who wrote the code?',
    ],
    painPoints: [
      { icon: '🔥', label: 'Slow incident response', description: 'It takes too long to move from alert to understanding.' },
      { icon: '🔍', label: 'Tool-hopping', description: 'On-call engineers bounce across 5+ tools to piece together a story.' },
      { icon: '🧠', label: 'Knowledge silos', description: 'The person debugging often did not write the code and lacks context.' },
      { icon: '📋', label: 'Bug report → fix gap', description: 'Reports, tickets, logs, traces, and code are all disconnected.' },
      { icon: '😴', label: 'On-call burnout', description: 'The work is stressful and repetitive even when the fix is simple.' },
    ],
    footerCallout:
      'Sound familiar? Production issues usually get worse because the debugging context is fragmented.',
  }),
  makeSlide({
    id: 4.72,
    slug: 'monitor-internal-use',
    sourceFile: 'SlideMonitorInternalUse.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.realWorldPanels,
    phase: { number: '07', tone: 'monitor', name: 'Monitor' },
    title: 'Real World: How We Use This at Cursor',
    subtitle: 'Two real workflows from alert / report to a concrete code fix',
    panels: [
      {
        title: 'Datadog MCP → Investigate → Fix',
        media: { kind: 'image', asset: 'monitorDatadogMcp', fit: 'contain' },
        steps: [
          'Query Datadog directly from Cursor through the MCP.',
          'Correlate the production signal with the codebase and propose the fix.',
        ],
      },
      {
        title: 'Slack Bug Report → Auto-Fix PR',
        media: { kind: 'image', asset: 'monitorSlackBugfix', fit: 'contain' },
        steps: [
          'Turn a Slack report into a Linear triage ticket.',
          'Let a Cloud Agent ship the fix within minutes.',
        ],
      },
    ],
    banner:
      'From “something is broken” to “fix is pushed” - without an engineer manually investigating everything.',
  }),
  makeSlide({
    id: 4.73,
    slug: 'monitor-cursor-helps',
    sourceFile: 'SlideMonitorCursorHelps.jsx',
    master: MASTER_NAMES.PHASE_SLIDE,
    type: SLIDE_TYPES.solutionImpact,
    phase: { number: '07', tone: 'monitor', name: 'Monitor' },
    title: 'Solution: Cursor Closes the SDLC Loop',
    solution: {
      icon: '🔔',
      title: 'Observe → Understand → Fix via MCPs',
      steps: [
        'Pull Datadog, Sentry, or PagerDuty context into Cursor with MCPs.',
        'Correlate production data with the codebase automatically.',
        'Use Cloud Agents to turn Slack / Linear reports into a working fix.',
        'Let BugBot, CI, and a human reviewer close the loop safely.',
      ],
    },
    surfaceLabel: 'MCPs',
    surfaceItems: ['Datadog MCP', 'Sentry MCP', 'PagerDuty MCP', 'Slack MCP'],
    keyShift:
      'The SDLC becomes a closed loop where production issues can move straight into a fix without all the manual context gathering.',
    impactCards: [
      { stat: 'MTTR → minutes', label: 'not hours', body: 'The system shortens the distance from alert to remediation.' },
      { stat: 'On-call', label: 'unblocked', body: 'Engineers spend less time gathering evidence and more time shipping fixes.' },
      { stat: 'Closed loop', label: 'delivery', body: 'Monitoring is connected directly to planning, coding, review, and deploy.' },
    ],
    bottomLine:
      'This is what it means for Cursor to close the SDLC loop: broken → understood → fixed → deployed in minutes.',
  }),
]
