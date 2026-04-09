/**
 * Workshop-aligned SDLC quiz. correctIndex is 0-based into choices.
 */
export const questions = [
  {
    id: 'q1',
    prompt: 'Which SDLC stage is primarily about defining requirements and breaking work into tasks?',
    choices: ['Plan', 'Design', 'Develop', 'Deploy'],
    correctIndex: 0,
  },
  {
    id: 'q2',
    prompt: 'Cursor’s BugBot is most closely associated with which SDLC stage?',
    choices: ['Test', 'Review', 'Plan', 'Design'],
    correctIndex: 1,
  },
  {
    id: 'q3',
    prompt: 'Plan Mode in Cursor maps best to which part of the SDLC?',
    choices: ['Develop', 'Plan', 'Deploy', 'Test'],
    correctIndex: 1,
  },
  {
    id: 'q4',
    prompt: 'Running automated checks in GitHub Actions is most aligned with which stage?',
    choices: ['Review', 'Test', 'Plan', 'Design'],
    correctIndex: 1,
  },
  {
    id: 'q5',
    prompt: 'The workshop’s “Git Sandwich” emphasizes productive work wrapped in what?',
    choices: [
      'Only writing code in the IDE',
      'Git flow: sync → branch → work → commit → PR',
      'Skipping code review',
      'Deploying without tests',
    ],
    correctIndex: 1,
  },
  {
    id: 'q6',
    prompt: 'Tools like Figma and Storybook are most associated with which SDLC stage?',
    choices: ['Develop', 'Design', 'Deploy', 'Review'],
    correctIndex: 1,
  },
  {
    id: 'q7',
    prompt: 'Shipping a build to production fits which SDLC stage?',
    choices: ['Test', 'Review', 'Deploy', 'Plan'],
    correctIndex: 2,
  },
  {
    id: 'q8',
    prompt: 'Day-to-day coding in an IDE (e.g. Cursor Agent, Tab) is mainly which stage?',
    choices: ['Plan', 'Design', 'Develop', 'Review'],
    correctIndex: 2,
  },
]
