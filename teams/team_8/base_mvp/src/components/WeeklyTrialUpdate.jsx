import { useState } from 'react';
import { getMilestones } from '../data/trialContacts';
import './WeeklyTrialUpdate.css';

/**
 * Builds a Slack-ready weekly trial update message: who hit 1w/2w/3w and which owner to notify.
 */
function buildWeeklyUpdateMessage(contacts) {
  const at1w = contacts.filter((c) => getMilestones(c.startDate).week1);
  const at2w = contacts.filter((c) => getMilestones(c.startDate).week2);
  const at3w = contacts.filter((c) => getMilestones(c.startDate).week3);

  const lines = ['*Weekly trial follow-up*', ''];

  if (at1w.length > 0) {
    lines.push('*1-week marker (follow up):*');
    at1w.forEach((c) => lines.push(`• ${c.name} → owner: ${c.owner}`));
    lines.push('');
  }
  if (at2w.length > 0) {
    lines.push('*2-week marker (follow up):*');
    at2w.forEach((c) => lines.push(`• ${c.name} → owner: ${c.owner}`));
    lines.push('');
  }
  if (at3w.length > 0) {
    lines.push('*3-week marker (follow up):*');
    at3w.forEach((c) => lines.push(`• ${c.name} → owner: ${c.owner}`));
    lines.push('');
  }

  if (at1w.length === 0 && at2w.length === 0 && at3w.length === 0) {
    lines.push('No contacts at 1w/2w/3w this week.');
  } else {
    lines.push(`Total: ${at1w.length} at 1w, ${at2w.length} at 2w, ${at3w.length} at 3w`);
  }

  return lines.join('\n');
}

export default function WeeklyTrialUpdate({ contacts }) {
  const [copied, setCopied] = useState(false);
  const message = buildWeeklyUpdateMessage(contacts);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
      setCopied(false);
    }
  }

  return (
    <section className="weekly-trial-update">
      <h3 className="panel-title">Weekly trial update (for Slack)</h3>
      <p className="panel-hint">
        Copy this message and paste into Slack (or use Slack MCP when connected). Set a weekly
        reminder to run it.
      </p>
      <pre className="update-message">{message}</pre>
      <button type="button" className="btn-copy" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy to clipboard'}
      </button>
    </section>
  );
}
