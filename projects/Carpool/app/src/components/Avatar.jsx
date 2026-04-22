export function Avatar({ name, color = 'gray', size = 'md' }) {
  const initials = (name || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const sizeClass = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : '';
  return <span className={`avatar avatar-${color} ${sizeClass}`}>{initials}</span>;
}
