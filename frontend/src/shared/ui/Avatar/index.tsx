import { useState } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
  onClick?: () => void;
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  status,
  className = '',
  onClick,
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    busy: 'bg-error',
    away: 'bg-warning',
  };
  
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };
  
  const clickableStyles = onClick ? 'cursor-pointer hover:opacity-80' : '';
  
  // Generate initials from name
  const getInitials = () => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Deterministic background color based on name or alt
  const getBackgroundColor = () => {
    const string = name || alt;
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  };
  
  return (
    <div className={`relative inline-flex ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeStyles[size]} rounded-full object-cover ${clickableStyles}`}
          onClick={onClick}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full flex items-center justify-center text-white ${clickableStyles}`}
          style={{ backgroundColor: getBackgroundColor() }}
          onClick={onClick}
        >
          {getInitials()}
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusColors[status]} ${statusSizes[size]} rounded-full border-2 border-white dark:border-gray-800`}
        />
      )}
    </div>
  );
}; 