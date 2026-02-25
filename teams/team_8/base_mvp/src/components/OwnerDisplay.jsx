import './OwnerDisplay.css';

export default function OwnerDisplay({ owner }) {
  return (
    <span className="owner-display" title={`Follow-up alerts go to ${owner}`}>
      👤 {owner}
    </span>
  );
}
