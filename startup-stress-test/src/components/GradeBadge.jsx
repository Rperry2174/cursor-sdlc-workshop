import { gradeToColor } from '../data/scoringModel';

/**
 * Reusable letter-grade pill component
 * Displays a colored badge with the letter grade
 */
export default function GradeBadge({ grade, size = 'medium' }) {
  const color = gradeToColor(grade);
  
  const sizeClasses = {
    small: 'grade-badge-small',
    medium: 'grade-badge-medium',
    large: 'grade-badge-large',
  };

  return (
    <span
      className={`grade-badge ${sizeClasses[size]}`}
      style={{
        backgroundColor: color,
        color: grade === 'C' ? '#1a1a1a' : '#ffffff',
      }}
    >
      {grade}
    </span>
  );
}
