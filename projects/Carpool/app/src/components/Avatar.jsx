export function Avatar({ name, color = 'gray', size = 'md', photo = null }) {
  const initials = (name || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const sizeClass = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : '';

  if (photo) {
    return (
      <span
        className={`avatar avatar-photo ${sizeClass}`}
        style={{ backgroundImage: `url(${photo})` }}
        aria-label={name || 'avatar'}
      />
    );
  }

  return <span className={`avatar avatar-${color} ${sizeClass}`}>{initials}</span>;
}
