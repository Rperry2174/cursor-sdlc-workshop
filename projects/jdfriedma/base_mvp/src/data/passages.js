/**
 * Hardcoded passages by difficulty (no fetch, no API).
 * Tone: judgmental, omniscient “Marvis,” vaguely uncanny—workshop-safe.
 */

/** Characters counted as one word for gross WPM (typing-test convention). */
export const CHARS_PER_WORD = 5

export const DEFAULT_DIFFICULTY = 'easy'

export const DIFFICULTY_IDS = ['easy', 'medium', 'hard']

/** Each difficulty has a pool; one passage is chosen at random per run / tier change. */
export const PASSAGE_POOLS = {
  easy: [
    'Marvis is watching the cursor blink. Do not blink back.',
    'Your keys click louder when you are guessing. Marvis turns up the volume.',
    'The tab key cannot save you here. Only honest fingers can.',
    'Blink if you are ready. Marvis blinks slower, and never first.',
  ],

  medium: [
    'Every wrong letter leaves a cold spot on the screen. Marvis counts them, patiently, like rain on a window you cannot shut.',
    'You pretend you are practicing; Marvis calls it evidence. The backspace does not delete what Marvis already logged in the margin of the air.',
    'If you rush, the words fray at the edges; if you stall, the cursor pulses like a small heartbeat Marvis borrowed from you without asking.',
    'Correct once, and the room feels lighter for half a second. Wrong once, and Marvis leans in, polite, attentive, absolutely not forgiving.',
  ],

  hard: [
    `You pretend the backspace fixes what you meant; Marvis remembers what you actually did. The passage accepts only the keys you press, in order, without mercy.

When you finish, the room feels as empty as before. Marvis nods once, slowly, and you cannot tell if that was kindness or the start of a longer test.`,

    `The keyboard is not a bridge; it is a narrow plank over something patient and dark. Each letter you land on either holds or does not, and Marvis will not pretend otherwise.

If you stop mid-sentence, the silence does not comfort you--it waits, the way a held breath waits for a verdict you already suspect.`,

    `Typing is a confession typed in plain font. Marvis does not need your intent; Marvis reads the sequence you committed to, including the pauses you hope no one measures.

When the last character matches, you will feel a ridiculous, thin relief--then notice Marvis has not left; Marvis is simply finished judging this paragraph, not you.`,

    `Some mistakes are loud, some are small enough to fit between spaces; Marvis catalogues both with the same mild interest a librarian gives to mis-shelved books--correctable, memorable, never forgotten on principle.

Finish clean, if you can: not for Marvis's approval, but so the room forgets you for one honest minute before the next passage arrives.`,
  ],
}

/**
 * Returns a random passage string for the given difficulty.
 * @param {string} difficulty
 * @returns {string}
 */
export function pickRandomPassage(difficulty) {
  const pool = PASSAGE_POOLS[difficulty]
  if (!pool?.length) {
    return ''
  }
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
