import { MASTER_NAMES, SLIDE_TYPES, VISIBILITY } from '../blockTypes.js'
import { makeSlide } from '../helpers.js'

export const projectSlides = [
  makeSlide({
    id: 5,
    slug: 'git-workflow-diagram',
    sourceFile: 'SlideGitWorkflowDiagram.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.workflowCompare,
    title: 'Git in 60 Seconds: Local → PR → Merged',
    workflowRows: [
      {
        label: 'Git',
        tone: 'develop',
        steps: [
          {
            title: 'Local',
            subtitle: 'Only you can see it',
            bullets: ['Edit code, run tests', 'Commit checkpoints'],
          },
          {
            title: 'Pushed + PR',
            subtitle: 'Staged and ready for review',
            bullets: ['Others can see your branch', 'Automated checks can run'],
          },
          {
            title: 'Merged',
            subtitle: 'In main (and deployed)',
            bullets: ['Official source of truth', 'Goes live via CI/CD'],
          },
        ],
      },
      {
        label: 'Google Docs',
        tone: 'content',
        steps: [
          {
            title: 'Your draft',
            subtitle: 'Private copy',
            bullets: ['You type freely', 'No one else sees it yet'],
          },
          {
            title: 'Suggesting',
            subtitle: 'Ready to be accepted',
            bullets: ['Visible, reviewable', 'Not “in the doc” yet'],
          },
          {
            title: 'Accepted',
            subtitle: 'In the main doc',
            bullets: ['Becomes the official text', 'Everyone sees it'],
          },
        ],
      },
    ],
    emphasis: {
      label: 'Key point:',
      body:
        'The PR is the “suggesting changes” layer - visible, reviewable, and safe - but not live until it is merged.',
    },
  }),
  makeSlide({
    id: 7.5,
    slug: 'prd-example',
    sourceFile: 'SlidePrdExample.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.docPreview,
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Your Plan = a prd.md File',
    title: 'What Your PRD Looks Like',
    docLabel: 'prd.md',
    intro:
      'The plan lives in markdown at projects/<your-github-username>/prd.md.',
    docLines: [
      '# Product Requirements Document (PRD)',
      '',
      '## Project Overview',
      '- Project Name: Memory Card Match',
      '- One-line Description: A card-flipping memory game where you find matching pairs',
      '- Type: Web App',
      '',
      '## Base MVP',
      '- Grid of face-down cards',
      '- Click to flip, match two to keep them revealed',
      '- Win message when all pairs are found',
      '',
      '## Features',
      '- Feature 1: Move Counter',
      '  - Description: Track and display number of moves',
      '  - Files: src/components/MoveCounter.jsx',
      '- Feature 2: Timer',
      '  - Description: Countdown or elapsed-time timer',
      '  - Files: src/components/Timer.jsx',
      '- Feature 3: Win Animation',
      '  - Description: Confetti effect when the game is won',
      '  - Files: src/components/Confetti.jsx',
    ],
    emphasis: {
      tone: 'green',
      label: 'Your turn:',
      body:
        'There should already be a prd.md in projects/<your-github-username>/. Make sure it has your project idea, a base MVP, and at least 2-3 features.',
    },
  }),
  makeSlide({
    id: 8.5,
    slug: 'run-project',
    sourceFile: 'SlideRunProject.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.browserDemo,
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Phase 2: Design',
    title: 'Run It — See It In Your Browser',
    subtitle:
      'When you ask Cursor to run your project, you should see it live in your web browser:',
    browserMock: {
      variant: 'flappyBird',
      url: 'localhost:5173',
      score: '7',
    },
    emphasis: {
      tone: 'green',
      label: 'Ask Cursor:',
      body:
        '"How do I run this project?" — then open the URL it gives you. If something looks wrong, tell Cursor what you see!',
    },
  }),
  makeSlide({
    id: 13.5,
    slug: 'run-other-project',
    sourceFile: 'SlideRunOtherProject.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.browserDemo,
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: "Someone Else's App, Your Browser",
    title: "You're Running Their Project",
    subtitle:
      "You pulled the latest code, explored with Ask Mode, and now you have a classmate's app running locally:",
    browserMock: {
      variant: 'pacman',
      url: 'localhost:5173',
      score: '1280',
      highScore: '5000',
      lives: 3,
    },
    emphasis: {
      tone: 'orange',
      label: "You just onboarded to someone else's project in minutes.",
      body: 'In the real world, this can take days or weeks.',
    },
  }),
  makeSlide({
    id: 14,
    slug: 'section-2-add-feature',
    sourceFile: 'SlideS2AddFeature.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    variant: 'featureBuild',
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: 'Step 2: Add a Feature to Their App',
    title: 'Build Something New in Their Code',
    intro: {
      tone: 'section2',
      paragraphs: [
        "Now that you understand the project and have it running, your job is to add one feature to their app. Think small - something fun you can finish in a few minutes.",
      ],
    },
    exampleLabel: "Example: If it's a Pac-Man game...",
    tiles: [
      {
        icon: '⚡',
        title: 'Power-up: 2x Points',
        description: 'Eating a special pellet doubles your score for 10 seconds.',
      },
      {
        icon: '🎼',
        title: 'Sound Effects',
        description: 'Add a “waka waka” chomp sound when Pac-Man eats dots.',
      },
      {
        icon: '🏆',
        title: 'Win Screen',
        description: 'Show a celebration animation when the board is cleared.',
      },
    ],
    checklistGroups: [
      {
        tone: 'work',
        sectionTone: 'section2',
        label: 'In Cursor',
        items: [
          {
            title: 'Tell Cursor what feature to add',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Add a [feature] to this project. Look at the existing code to understand how it works first, then implement it.',
            ],
          },
          {
            title: 'Test it',
            detail: 'Run the app and make sure your feature works.',
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
              "Commit with message 'Add [feature] to [project]', push to my fork, and open a PR.",
            ],
          },
        ],
      },
    ],
  }),
  makeSlide({
    id: 14.5,
    slug: 'section-2-feature-result',
    sourceFile: 'SlideS2FeatureResult.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.browserDemo,
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: 'Your Feature, Their App',
    title: "You Just Shipped to Someone Else's Codebase",
    subtitle:
      'The 2x power-up is live - ghosts are scared, and points are doubled:',
    browserMock: {
      variant: 'pacmanPowerUp',
      url: 'localhost:5173',
      score: '2560',
      highScore: '5000',
      lives: 3,
      badge: '2x POINTS!',
      timer: '8 seconds left',
    },
    emphasis: {
      tone: 'orange',
      label: 'You just did what professional engineers do every day',
      body:
        'Read unfamiliar code, understand it, add value, and ship.',
    },
  }),
  makeSlide({
    id: 19,
    slug: 'transformation',
    sourceFile: 'Slide17Transformation.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.beforeAfter,
    section: { badge: 'Section 3', tone: 'section3' },
    phaseBadge: 'The Transformation',
    title: 'Before → After',
    beforeAfter: {
      before: {
        title: '😬 You Start With',
        tone: 'deploy',
        lines: [
          'LinkedOut',
          'Home | My Network | Jobs | Messaging (3)',
          'My Profile',
          '[PROFILE PHOTO]',
          'Sarah Chen',
          'Senior Engineer @ Acme Corp',
          'Connections: 512 | Followers: 234',
          'Feed',
          'Brian McCarthy - 1st',
          'New Hire | Father of Many',
          "Thrilled to announce I'm starting a new chapter...",
          '[Like] [Comment] [Repost] [Send]',
          'Post impressions: 2,103',
        ],
      },
      after: {
        title: '🎉 You Build',
        tone: 'review',
        media: {
          kind: 'image',
          asset: 'linkedoutHomepage',
          fit: 'contain',
        },
      },
    },
  }),
  makeSlide({
    id: 9,
    slug: 'phase-3-develop-library',
    sourceFile: 'Slide09Phase3Develop.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    includeInDeck: false,
    visibility: VISIBILITY.libraryOnly,
    section: { badge: 'Section 1', tone: 'section1' },
    phaseBadge: 'Phase 3: Develop • 20 min',
    title: 'Develop (Each person)',
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
        sectionTone: 'section1',
        label: 'In Cursor',
        items: [
          {
            title: 'Find your issue',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Find my GitHub issue assigned to me and read the prd.md to understand what I need to build.',
            ],
          },
          { title: 'Run the project first', detail: 'Make sure the base MVP works before you start.' },
          { title: 'Use Plan Mode to design your feature before writing code.' },
          { title: 'Implement your feature with Agent Mode.' },
          { title: 'Test it locally and verify the feature works.' },
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
              "Commit my changes with the message 'Add [feature]', push to my fork, and open a PR to the original repo.",
            ],
          },
        ],
      },
    ],
  }),
  makeSlide({
    id: 13.1,
    slug: 'section-2-step-2-library',
    sourceFile: 'Slide13Section2Step2.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    includeInDeck: false,
    visibility: VISIBILITY.libraryOnly,
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: 'Step 2: Plan • 10 min',
    title: 'Plan Your Improvements',
    scrollable: true,
    checklistGroups: [
      {
        tone: 'git',
        label: 'Git: Start',
        items: [
          {
            title: 'Create a planning branch',
            codeComment: 'Ask Cursor:',
            codeLines: ['Create a branch called [username]/planning'],
          },
        ],
      },
      {
        tone: 'work',
        sectionTone: 'section2',
        label: 'In Cursor',
        items: [
          {
            title: 'Create a Skill',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Create a Cursor Skill that generates feature improvement plans for existing codebases. It should suggest several features and output a structured plan.',
            ],
          },
          {
            title: 'Write your PRD to Notion',
            detail: 'Use the Notion MCP to create the page and capture several features to build.',
            codeComment: 'Ask Cursor:',
            codeLines: [
              "Use the Notion MCP to create a page titled '[SDLC Workshop] [your-username] - Improvements PRD'. Include several features to build and which files to touch.",
            ],
          },
          {
            title: 'Create GitHub issues',
            detail: 'One issue per feature, all assigned to your GitHub username.',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Create a GitHub issue for each feature in my Notion PRD. Assign each to my GitHub username and link back to the Notion page.',
            ],
          },
        ],
      },
      {
        tone: 'git',
        label: 'Git: Finish',
        items: [
          {
            title: 'Commit and push the planning work',
            codeComment: 'Ask Cursor:',
            codeLines: ["Commit with message '[username] - Feature plan', push and open a PR"],
          },
        ],
      },
    ],
  }),
  makeSlide({
    id: 13.2,
    slug: 'section-2-step-3-library',
    sourceFile: 'Slide14Section2Step3.jsx',
    master: MASTER_NAMES.CONTENT_SLIDE,
    type: SLIDE_TYPES.checklist,
    includeInDeck: false,
    visibility: VISIBILITY.libraryOnly,
    section: { badge: 'Section 2', tone: 'section2' },
    phaseBadge: 'Step 3: Build Your Feature • 10 min',
    title: 'Implement & Ship',
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
        sectionTone: 'section2',
        label: 'In Cursor',
        items: [
          {
            title: 'Create a Hook',
            detail: 'Automate commit-message validation.',
            codeComment: 'Ask Cursor:',
            codeLines: [
              "Create a Cursor Hook that runs before git commit and validates the commit message starts with my username (for example 'username:').",
            ],
          },
          {
            title: 'Pull requirements from Notion',
            codeComment: 'Ask Cursor:',
            codeLines: [
              'Search Notion for my SDLC Workshop PRD and find the feature assigned to me ([your GitHub username]). What do I need to build?',
            ],
          },
          { title: 'Use Plan Mode first', detail: 'Design your approach before writing code.' },
          { title: 'Implement with Agent Mode.' },
          { title: 'Test it before committing.' },
        ],
      },
      {
        tone: 'git',
        label: 'Git: Finish',
        items: [
          {
            title: 'Commit, push, and open a PR',
            codeComment: 'Ask Cursor:',
            codeLines: ["Commit with message 'Add [feature]', push and open a PR"],
          },
        ],
      },
    ],
    emphasis: {
      tone: 'orange',
      label: 'Section 2 Complete',
      body:
        'You explored unfamiliar code, created your own Rule, Skill, and Hook, then planned and shipped improvements. You did not just use Cursor - you customized it.',
    },
  }),
]
