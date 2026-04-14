/**
 * Anthropic "A" logo rendered as an inline SVG.
 * Used to mark mines on the board.
 */
export default function AnthropicLogo({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mine (Anthropic logo)"
    >
      <path
        d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.604L16.744 20.48h-3.603L6.57 3.52zM0 20.48h3.603l1.085-2.803h5.408l.704 1.814H14.403L7.825 3.52H4.222L0 20.48zm5.9-5.317 1.488-3.842 1.488 3.842H5.9z"
        fill="#d97757"
      />
    </svg>
  );
}
