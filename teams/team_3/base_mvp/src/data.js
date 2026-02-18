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
    columnId: 'col-unassigned',
  },
];
