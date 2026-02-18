export const UNASSIGNED_COLUMN_ID = 'col-unassigned';

export const DEFAULT_COLUMNS = [
  {
    id: 'col-unassigned',
    name: 'Unassigned',
    context: 'Newly created agents land here. Drag them into a workflow column to get them started.',
  },
  {
    id: 'col-researching',
    name: 'Researching',
    context: 'Agents in this stage are gathering information, reading documentation, and analyzing requirements before taking action.',
  },
  {
    id: 'col-designing',
    name: 'Designing',
    context: 'Agents here are planning architecture, drafting schemas, wireframing solutions, and making key decisions.',
  },
  {
    id: 'col-building',
    name: 'Building',
    context: 'Agents are actively writing code, generating outputs, and executing the core work of their task.',
  },
  {
    id: 'col-testing',
    name: 'Testing',
    context: 'Agents are validating outputs, running checks, identifying bugs, and ensuring quality before release.',
  },
  {
    id: 'col-deploying',
    name: 'Deploying',
    context: 'Agents are packaging and releasing work to production or handing off final deliverables.',
  },
];

export const DEFAULT_AGENTS = [
  {
    id: 'agent-1',
    name: 'Atlas',
    personality: 'Methodical and thorough. Always cites sources. Prefers structured formats and bullet points. Never skips steps.',
    columnId: 'col-researching',
  },
  {
    id: 'agent-2',
    name: 'Nova',
    personality: 'Creative and fast-moving. Generates multiple options before converging. Loves diagrams and visual thinking.',
    columnId: 'col-designing',
  },
  {
    id: 'agent-3',
    name: 'Forge',
    personality: 'Direct and efficient. Ships working code fast. Prefers simplicity over cleverness. Always adds comments.',
    columnId: 'col-building',
  },
  {
    id: 'agent-4',
    name: 'Prism',
    personality: 'Skeptical and precise. Finds edge cases others miss. Writes detailed test cases. Never assumes happy path.',
    columnId: 'col-testing',
  },
  {
    id: 'agent-5',
    name: 'Echo',
    personality: 'Calm and systematic. Follows runbooks exactly. Communicates clearly during deployments. Always rolls back safely.',
    columnId: 'col-deploying',
  },
  {
    id: 'agent-6',
    name: 'Drift',
    personality: 'Exploratory and curious. Great at discovering unknown unknowns. Often finds better approaches mid-task.',
    columnId: 'col-researching',
  },
  {
    id: 'agent-7',
    name: 'Sable',
    personality: 'Security-first mindset. Flags risks early. Prefers defensive patterns and always asks about threat models.',
    columnId: 'col-building',
  },
];
