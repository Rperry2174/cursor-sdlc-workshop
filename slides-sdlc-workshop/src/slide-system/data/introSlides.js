import { MASTER_NAMES, SLIDE_TYPES, VISIBILITY } from '../blockTypes.js'
import { makeSlide } from '../helpers.js'

export const introSlides = [
  makeSlide({
    id: 1,
    slug: 'title-hero',
    sourceFile: 'Slide01Title.jsx',
    className: 'title-slide',
    master: MASTER_NAMES.TITLE_SLIDE,
    type: SLIDE_TYPES.titleHero,
    badge: 'Interactive Workshop',
    titleParts: ['Cursor', '&', 'SDLC'],
    tagline: 'Experience the Software Development Lifecycle Firsthand',
    pills: [
      { icon: '⏱', text: '2 Hours' },
      { icon: '👥', text: 'Individual & Teams' },
      { icon: '🚀', text: 'Hands-On' },
    ],
  }),
  makeSlide({
    id: 2,
    slug: 'purpose',
    sourceFile: 'Slide02Purpose.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.takeaway,
    variant: 'purpose',
    title: "What You'll Experience",
    hero: {
      lead: "By the end, you'll be able to ",
      highlight: 'speak more authentically',
      tail: ' about developer pain points because you felt them yourself.',
    },
    tiles: [
      {
        label: 'Model Neutrality',
        tone: 'develop',
        titleHighlight: 'Switch models freely',
        description:
          'Experience why customers should never be locked into a single vendor',
      },
      {
        label: 'Best Time to Value',
        tone: 'develop',
        titleHighlight: 'Be productive immediately',
        description:
          'No setup sprawl - just open Cursor and start building',
      },
      {
        label: 'Platform, Not Just a Tool',
        tone: 'develop',
        titleHighlight: 'Plan, Build, Test, Review',
        description:
          'See how Cursor touches every part of the software development lifecycle',
      },
    ],
    emphasis: {
      tone: 'content',
      label: 'Note for ADMs & FEs:',
      body:
        "AEs are less technical than most customers - that's the point. Watch for friction that developers take for granted.",
    },
  }),
  makeSlide({
    id: 3,
    slug: 'agenda',
    sourceFile: 'Slide03Agenda.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.agenda,
    title: 'Agenda',
    timelineItems: [
      {
        number: '0',
        numberVariant: 'gray',
        title: 'Pre-Work Setup',
        description: 'Get Cursor, Terminal, and Git ready',
        duration: '10 min',
      },
      {
        number: '1',
        numberVariant: 'green',
        title: 'Greenfield Project',
        description: 'Build something new from scratch individually',
        duration: '25 min',
      },
      {
        number: '2',
        numberVariant: 'orange',
        title: 'Legacy Codebase',
        description: 'Jump into unfamiliar code and add features',
        duration: '25 min',
      },
      {
        number: '3',
        numberVariant: 'purple',
        title: 'Real-World Chaos',
        description:
          'Compete to build the best LinkedIn clone from a Figma design',
        duration: '35 min',
      },
    ],
  }),
  makeSlide({
    id: 5.5,
    slug: 'prework-setup',
    sourceFile: 'Slide05PreWork.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    section: { badge: 'Pre-Work', tone: 'prework' },
    phaseBadge: 'Environment Setup • 10 min',
    title: 'Get Set Up',
    checklistGroups: [
      {
        tone: 'plain',
        items: [
          {
            title: 'Download & Install Cursor',
            detail: 'should already be on your machine',
          },
          {
            title: 'Open Terminal',
            codeLines: ['Cmd+Space → type "Terminal" → Enter'],
          },
          {
            title: 'Copy the setup script from GitHub',
            codeLines: [
              'cd ~/Desktop',
              'curl -L -o setup-cursor-agent.sh https://raw.githubusercontent.com/Rperry2174/cursor-sdlc-workshop/main/setup-cursor-agent.sh',
            ],
          },
          {
            title: 'Run the setup script',
            detail:
              'installs everything (Homebrew, Git, GitHub CLI, Node.js, Cursor CLI)',
            codeLines: ['bash setup-cursor-agent.sh'],
          },
          {
            title: 'Verify it worked',
            codeLines: ['git --version', 'cursor --version'],
          },
        ],
      },
    ],
    emphasis: {
      label: 'The script handles everything:',
      body:
        'Homebrew, Git, GitHub CLI, Node.js, and the Cursor CLI - all in one command.',
    },
  }),
  makeSlide({
    id: 6,
    slug: 'section-1-intro',
    sourceFile: 'Slide06Section1Intro.jsx',
    master: MASTER_NAMES.SECTION_INTRO,
    type: SLIDE_TYPES.sectionIntro,
    variant: 'projectPicker',
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Greenfield Project • 25 min • Individual',
    title: 'Build Something From Scratch',
    intro: {
      tone: 'section1',
      paragraphs: [
        "In this section, you'll experience the complete software development lifecycle - from planning to testing - while learning how Cursor can assist at each stage.",
        "You'll also practice git workflow in an individual setting, just like real engineers do every day.",
      ],
    },
    objectiveTiles: [
      {
        number: '01',
        tone: 'cyan',
        title: 'Experience the ',
        titleHighlight: 'complete SDLC',
      },
      {
        number: '02',
        tone: 'cyan',
        title: 'Learn how ',
        titleHighlight: 'Cursor assists',
        titleTail: ' at each stage',
      },
      {
        number: '03',
        tone: 'cyan',
        title: 'Practice ',
        titleHighlight: 'git workflow',
      },
    ],
    sideHeading: 'Pick a project (splits into planned features):',
    projectCategories: [
      {
        label: 'Chrome Extensions',
        ideas: [
          {
            icon: '📖',
            name: 'Dictionary',
            features: 'lookup, translation, flashcards, favorites, word of the day',
          },
          {
            icon: '📸',
            name: 'Screenshot Tool',
            features: 'capture area, crop, annotate/draw, download, copy',
          },
          {
            icon: '🔖',
            name: 'Save for Later',
            features: 'save page, reading list, tags, search, mark as read',
          },
        ],
      },
      {
        label: 'Web Apps',
        ideas: [
          {
            icon: '✅',
            name: 'Todo List',
            features: 'add tasks, check off, delete, categories, due dates',
          },
          {
            icon: '🌤️',
            name: 'Weather Dashboard',
            features: 'current, forecast, cities, backgrounds, units',
          },
          {
            icon: '📈',
            name: 'Odds / Line Converter',
            features: 'American ↔ decimal, implied probability, breakeven %',
          },
        ],
      },
      {
        label: 'Games',
        ideas: [
          {
            icon: '🟩',
            name: 'Wordle Clone',
            features: 'daily puzzle, keyboard, share, stats/streaks',
          },
          {
            icon: '🐦',
            name: 'Flappy Bird Clone',
            features: 'physics, pipes, difficulty ramp, high scores, skins',
          },
          {
            icon: '🐍',
            name: 'Snake',
            features: 'movement, food, speed ramp, modes, high scores',
          },
          {
            icon: '🏈',
            name: 'Super Bowl Squares',
            features: '10×10 board, random digits, payouts, lock at kickoff',
          },
        ],
      },
    ],
    buildYourOwn: {
      icon: '✨',
      title: 'Build Your Own!',
      description: 'pitch your idea - needs splittable features',
    },
  }),
  makeSlide({
    id: 7,
    slug: 'phase-1-plan',
    sourceFile: 'Slide07Phase1Plan.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Phase 1: Plan / Design • 10 min',
    title: 'Plan / Design',
    scrollable: true,
    checklistGroups: [
      {
        tone: 'git',
        label: 'Git: Start',
        items: [
          {
            title: 'Tell Cursor to fork and clone the repo',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Fork https://github.com/Rperry2174/cursor-sdlc-workshop to my GitHub account and clone my fork locally.',
            ],
          },
        ],
      },
      {
        tone: 'work',
        sectionTone: 'section1',
        label: 'Tell Cursor',
        items: [
          {
            title: 'Create your project folder',
            codeComment: 'Ask Cursor:',
            codeLines: [
              "Create my project under projects/[my-github-username]/ and scaffold the initial structure there.",
            ],
          },
          {
            title: 'Create your PRD with planned features',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Read the prd.md template and help me fill it out with my project idea, a base MVP, and 2-3 planned features.',
            ],
          },
        ],
      },
      {
        tone: 'git',
        label: 'Git: Finish',
        items: [
          {
            title: 'Commit, push, and open your first PR',
            codeComment: 'Ask Cursor:',
            codeLines: [
              "Commit with message '[username] - Initial setup and PRD', push to my fork, and open a PR to the original repo.",
            ],
          },
        ],
      },
    ],
  }),
  makeSlide({
    id: 8,
    slug: 'phase-2-design',
    sourceFile: 'Slide08Phase2Design.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Phase 2: Develop • 10 min',
    title: 'Develop',
    scrollable: true,
    checklistGroups: [
      {
        tone: 'work',
        sectionTone: 'section1',
        label: 'In Cursor',
        items: [
          {
            title: 'Build the base MVP from your PRD',
            detail:
              'Read prd.md, keep it minimal, and put the scaffold in base_mvp/.',
          },
          {
            title: 'Run it locally',
            codeComment: 'Ask Cursor:',
            codeLines: ['How do I run this project?'],
          },
          {
            title: 'Verify the base MVP works before moving on',
          },
        ],
      },
      {
        tone: 'git',
        label: 'Git: Finish',
        items: [
          {
            title: 'Commit your scaffolded MVP',
            codeComment: 'Ask Cursor:',
            codeLines: ["Commit with message '[username] - Base MVP scaffold'"],
          },
        ],
      },
    ],
  }),
  makeSlide({
    id: 10,
    slug: 'phase-4-test',
    sourceFile: 'Slide10Phase4Test.jsx',
    master: MASTER_NAMES.SECTION_INTRO,
    type: SLIDE_TYPES.sectionIntro,
    variant: 'skipInfo',
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Phase 4: Test',
    title: 'Test',
    skipBanner: {
      title: "We're skipping this phase today",
      subtitle: "But here's what normally happens at this stage:",
    },
    tiles: [
      {
        tone: 'cyan',
        title: 'Write automated tests',
        bullets: [
          'Make sure features match the PRD',
          'Cover unit and integration behavior',
          'Let Cursor generate tests from your PRD and code',
        ],
      },
      {
        tone: 'cyan',
        title: 'Catch bugs before users do',
        bullets: [
          'Run tests automatically on every push',
          'Flag regressions before they hit main',
          'Ship with confidence as the codebase grows',
        ],
      },
    ],
    emphasis: {
      tone: 'green',
      label: 'The big idea:',
      body: 'Testing proves software works before users think it works.',
    },
  }),
  makeSlide({
    id: 11,
    slug: 'section-1-takeaway',
    sourceFile: 'SlideSection1Takeaway.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.takeaway,
    variant: 'sectionTakeaway',
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Takeaway',
    title: 'What Just Happened',
    hero: {
      lead: 'You went from ',
      highlight: 'zero to working software',
      tail: " in 25 minutes - and you're not developers.",
    },
    tiles: [
      {
        label: "It's Not Just About Code",
        tone: 'section1',
        titleHighlight: 'Cursor helped you think, not just type',
        bullets: [
          'You used PRDs, tasks, and issues before writing code',
          'Cursor starts helping as soon as you start thinking',
        ],
      },
      {
        label: 'The Speed Is Real',
        tone: 'section1',
        titleHighlight: 'You built the foundation and shipped features',
        bullets: [
          'You moved from idea to something showable in minutes',
          'That speed changes how teams experiment',
        ],
      },
      {
        label: 'The Boring Stuff Disappeared',
        tone: 'section1',
        titleHighlight: 'You did real git workflow without learning git',
        bullets: [
          'You handled fork, branch, commit, push, and PR through conversation',
          "You didn't have to memorize commands to follow the workflow",
        ],
      },
    ],
    discovery: {
      label: 'Ask in discovery: what do you use for planning and development?',
      groups: [
        { label: 'Plan', items: ['Jira', 'Linear', 'GitHub Issues', 'Notion'] },
        { label: 'Source Code', items: ['GitHub', 'GitLab'] },
        { label: 'IDE', items: ['Cursor', 'VS Code', 'Windsurf'] },
      ],
    },
    emphasis: {
      tone: 'green',
      label: 'Big takeaway:',
      body:
        "Cursor is not just a Copilot-style coding assistant - it's a platform that shows up across the full SDLC.",
    },
  }),
  makeSlide({
    id: 12,
    slug: 'section-2-intro',
    sourceFile: 'Slide11Section2Intro.jsx',
    master: MASTER_NAMES.SECTION_INTRO,
    type: SLIDE_TYPES.sectionIntro,
    variant: 'threeTiles',
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: 'Legacy Codebase • 25 min • Individual',
    title: 'Work With Unfamiliar Code',
    intro: {
      tone: 'section2',
      paragraphs: [
        "Most software engineering happens in unfamiliar code, not greenfield projects. In this section you'll do the same SDLC again - but on someone else's project.",
      ],
      stat: '90%',
    },
    tiles: [
      {
        number: '01',
        tone: 'orange',
        title: 'Understand',
        titleHighlight: 'Use Ask Mode to explore unfamiliar code',
      },
      {
        number: '02',
        tone: 'orange',
        title: 'Plan',
        titleHighlight: 'Create a planning doc with features to build',
      },
      {
        number: '03',
        tone: 'orange',
        title: 'Build & ship',
        titleHighlight: 'Implement your feature(s) and open a PR',
      },
    ],
  }),
  makeSlide({
    id: 13,
    slug: 'section-2-step-1',
    sourceFile: 'Slide12Section2Step1.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: "Step 1: Get Someone Else's Project Running",
    title: 'Pull & Explore',
    scrollable: true,
    checklistGroups: [
      {
        tone: 'git',
        label: 'Git: Start',
        items: [
          {
            title: 'Pull the latest main branch',
            codeComment: 'Ask Cursor:',
            codeLines: ['Pull the latest main branch with everyone’s projects.'],
          },
        ],
      },
      {
        tone: 'work',
        sectionTone: 'section2',
        label: 'In Cursor',
        items: [
          {
            title: 'Pick another project under projects/',
          },
          {
            title: 'Use Ask Mode to explore it',
            codeComment: 'Ask Cursor:',
            codeLines: ['What does this project do?', 'How is it structured?'],
          },
          {
            title: 'Run it locally',
            codeComment: 'Ask Cursor:',
            codeLines: ['How do I run this project locally?'],
          },
          {
            title: 'See it live in the browser',
          },
        ],
      },
    ],
    emphasis: {
      tone: 'orange',
      label: 'Key insight:',
      body:
        "Ask Mode helps you learn fast without breaking anything - which is what 90% of real engineering feels like.",
    },
  }),
  makeSlide({
    id: 15,
    slug: 'section-2-takeaway',
    sourceFile: 'SlideSection2Takeaway.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.takeaway,
    variant: 'sectionTakeaway',
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: 'Takeaway',
    title: 'It Was Working For You the Whole Time',
    hero: {
      lead: 'Section 1 taught you how to ',
      highlight: 'use',
      tail: ' Cursor. Section 2 taught Cursor how you work.',
    },
    tiles: [
      {
        label: 'Remember Being Lost?',
        tone: 'section2',
        titleHighlight: "You understood a stranger's code",
        bullets: [
          'You started with zero context',
          'Ask Mode got you oriented in minutes',
          'That changes onboarding and maintenance work',
        ],
      },
      {
        label: 'The Invisible Helpers',
        tone: 'section2',
        titleHighlight: 'Skills, Hooks, and Agents compound over time',
        bullets: [
          'You automated repeated tasks instead of re-explaining them',
          'This is what an AI-native workflow looks like',
        ],
      },
      {
        label: 'You Leveled Up',
        tone: 'section2',
        titleHighlight: 'You taught Cursor how your team works',
        bullets: [
          'Rule, Skill, and Hook customizations carry senior knowledge forward',
          'The assistant gets better every time the team encodes its standards',
        ],
      },
    ],
    discovery: {
      label: 'Ask in discovery: what do you use for code review and testing?',
      groups: [
        { label: 'Review', items: ['GitHub PRs', 'CodeRabbit', 'Bugbot'] },
        { label: 'Test', items: ['GitHub Actions', 'Jenkins', 'CircleCI', 'Selenium'] },
      ],
    },
    emphasis: {
      tone: 'orange',
      label: 'Big takeaway:',
      body:
        'Any AI can generate code. Cursor becomes much more valuable when it learns the way your team works.',
    },
  }),
  makeSlide({
    id: 17,
    slug: 'section-3-intro',
    sourceFile: 'Slide15Section3Intro.jsx',
    master: MASTER_NAMES.SECTION_INTRO,
    type: SLIDE_TYPES.sectionIntro,
    variant: 'bigQuote',
    section: { badge: 'Section 3', tone: 'section3' },
    phaseBadge: 'Design-to-Code • 35 min • Teams of 20+',
    title: 'LinkedOut Clash 🏆',
    quoteLines: [
      '5 teams. Same ugly website. One Figma design.',
      'Who builds the best LinkedIn clone?',
    ],
    quoteHighlightLine: 1,
  }),
  makeSlide({
    id: 18,
    slug: 'section-3-rules',
    sourceFile: 'Slide16Section3Rules.jsx',
    master: MASTER_NAMES.SECTION_INTRO,
    type: SLIDE_TYPES.sectionIntro,
    variant: 'rules',
    section: { badge: 'Section 3', tone: 'section3' },
    phaseBadge: 'The Rules',
    title: 'The Challenge',
    intro: {
      tone: 'section3',
      paragraphs: [
        "Multiple engineers will be hitting the same codebase at once. Good process saves you from merge conflicts and coordination chaos. You can do this the easy way or the hard way.",
      ],
    },
    tiles: [
      {
        number: '01',
        tone: 'purple',
        title: 'Get as many people contributing as possible',
        description: 'Most of your team should ship at least one change.',
      },
      {
        number: '02',
        tone: 'purple',
        title: 'Live deploy to the big screen',
        description: 'Watch merged PRs turn into visible progress in real time.',
      },
    ],
    emphasis: {
      tone: 'purple',
      label: 'The Question:',
      body: 'Will your team win through process, or drown in chaos?',
    },
  }),
  makeSlide({
    id: 20,
    slug: 'section-3-step-1',
    sourceFile: 'SlideSection3Step1.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    section: { badge: 'Section 3', tone: 'section3' },
    phaseBadge: 'Step 1: Setup & Plan • 10 min',
    title: 'Connect Figma, Join Your Team, Build Your PRD',
    scrollable: true,
    checklistGroups: [
      {
        tone: 'work',
        sectionTone: 'section3',
        label: 'In Cursor',
        items: [
          {
            title: 'Add the Figma MCP',
            codeLines: ['Cursor Settings → MCP → Add Figma'],
          },
          {
            title: 'Navigate into your team folder',
            codeComment: 'Ask Cursor:',
            codeLines: ['Take me to linkedout/team_X/ so I can work with my team.'],
          },
          {
            title: 'Add your team member file',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Create a file for me with my name and GitHub username so the team knows who I am.',
            ],
          },
          {
            title: 'Pull the Figma breakdown',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Read https://www.figma.com/design/jXTg8QTUoESBYL5x0KHZvD/LinkedOut-Design, use get_metadata, and list the frames we need to implement.',
            ],
          },
          {
            title: 'Generate your PRD',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Use the Figma breakdown to create a team PRD in prd.md and, if useful, mirror it in Notion or GitHub Issues.',
            ],
          },
        ],
      },
    ],
    emphasis: {
      tone: 'purple',
      label: 'Key idea:',
      body:
        'Designer Figma → AI reads it → PRD → divided work. What normally takes days can happen in minutes.',
    },
  }),
  makeSlide({
    id: 21,
    slug: 'section-3-step-2',
    sourceFile: 'SlideSection3Step2.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    section: { badge: 'Section 3', tone: 'section3' },
    phaseBadge: 'Step 2: Build & Ship • 25 min',
    title: 'Pick a Task, Build It, Ship It',
    scrollable: true,
    checklistGroups: [
      {
        tone: 'git',
        label: 'Git: Start',
        items: [
          {
            title: 'Sync your fork with upstream',
            codeComment: 'Ask Cursor:',
            codeLines: ['Sync my fork with upstream and pull the latest changes.'],
          },
        ],
      },
      {
        tone: 'work',
        sectionTone: 'section3',
        label: 'In Cursor',
        items: [
          {
            title: 'Pull design context for your frame',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Use get_design_context on my assigned LinkedOut frame and tell me exactly what I need to build.',
            ],
          },
          {
            title: 'Install and run the project',
            codeLines: ['npm install', 'npm run dev'],
          },
          {
            title: 'Use Agent Mode to implement your assigned work',
          },
          {
            title: 'Test the feature in the browser before you open a PR',
          },
        ],
      },
      {
        tone: 'git',
        label: 'Git: Finish',
        items: [
          {
            title: 'Commit, push, and open a PR',
            codeComment: 'Ask Cursor:',
            codeLines: [
              "Commit with message 'Add [feature]', push to my fork, and open a PR.",
            ],
          },
        ],
      },
    ],
    emphasis: {
      tone: 'purple',
      label: 'Team rules:',
      body:
        'Stay in your team folder, keep PRs under 500 lines when you can, and make sure everyone lands at least one merged change.',
    },
  }),
  makeSlide({
    id: 22,
    slug: 'section-3-takeaway',
    sourceFile: 'SlideSection3Takeaway.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.takeaway,
    variant: 'sectionTakeaway',
    section: { badge: 'Section 3', tone: 'section3' },
    phaseBadge: 'Takeaway',
    title: 'This Is Why Process Matters',
    hero: {
      lead: '20+ people hit the same codebase at once - and ',
      highlight: 'some teams thrived while others did not',
      tail: '.',
    },
    tiles: [
      {
        label: 'Chaos or Coordination',
        tone: 'section3',
        titleHighlight: 'Process shipped more, faster',
        bullets: [
          'Every team had the same tools',
          'Coordination, small PRs, and branching discipline created the difference',
        ],
      },
      {
        label: 'A Platform, Not Just a Tool',
        tone: 'section3',
        titleHighlight: 'Customization is the enterprise story',
        bullets: [
          'Rules, Skills, Hooks, BugBot, and GitHub workflows all mattered',
          'Being model agnostic is part of that platform value',
        ],
      },
      {
        label: 'You Lived the Whole Platform',
        tone: 'section3',
        titleHighlight: 'Every feature has a customer story behind it',
        bullets: [
          'Plan, Ask, Agent, Rules, Skills, Hooks, BugBot, and GitHub all showed up',
          'You felt the pressure and tradeoffs customers deal with',
        ],
      },
    ],
    discovery: {
      label: 'Ask in discovery: what does your team use for design and deployment?',
      groups: [
        { label: 'Design', items: ['Figma', 'Adobe XD', 'Sketch', 'Storybook'] },
        { label: 'Deploy', items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Vercel'] },
      ],
    },
    emphasis: {
      tone: 'purple',
      label: 'Big takeaway:',
      body:
        'The struggles you felt today become more authentic customer conversations tomorrow.',
    },
  }),
  makeSlide({
    id: 23,
    slug: 'story-to-tell',
    sourceFile: 'Slide19Story.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.quote,
    title: 'The Story to Tell',
    quoteLines: [
      "Cursor isn't just a code editor -",
      "it's an engineering force multiplier",
      'across the entire SDLC.',
    ],
    quoteHighlightLines: [1, 2],
    supportingLines: [
      'From planning to deployment. From greenfield to legacy.',
      'From small teams to enterprise scale.',
    ],
  }),
  makeSlide({
    id: 24,
    slug: 'questions',
    sourceFile: 'Slide20Go.jsx',
    className: 'title-slide',
    master: MASTER_NAMES.TITLE_SLIDE,
    type: SLIDE_TYPES.closing,
    title: 'Questions?',
  }),
  makeSlide({
    id: 18.5,
    slug: 'key-takeaways-library',
    sourceFile: 'Slide18KeyTakeaways.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.takeaway,
    variant: 'purpose',
    includeInDeck: false,
    visibility: VISIBILITY.libraryOnly,
    title: 'Key Takeaways',
    hero: {
      lead: 'You can now ',
      highlight: 'speak more authentically',
      tail: ' about developer pain points because you felt them yourself.',
    },
    tiles: [
      {
        label: 'Model Neutrality',
        tone: 'develop',
        titleHighlight: 'You switched models freely',
        description:
          'Your customers should always have access to the best model, not be locked into one vendor.',
      },
      {
        label: 'Best Time to Value',
        tone: 'develop',
        titleHighlight: 'You were productive immediately',
        description:
          'No custom scripts or config sprawl - just works out of the box for the whole org.',
      },
      {
        label: 'Platform, Not Just a Tool',
        tone: 'develop',
        titleHighlight: 'You used Plan, Build, Test, Review',
        description:
          'Cursor touches every part of the SDLC, not just code generation.',
      },
    ],
    emphasis: {
      label: 'Key takeaway:',
      body:
        'Your struggles today become authentic customer conversations tomorrow.',
    },
  }),
]
