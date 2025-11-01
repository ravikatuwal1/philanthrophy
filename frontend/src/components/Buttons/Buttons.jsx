import React from 'react';
import { Link } from 'react-router-dom';
import './Buttons.css';

export default function Button({
  to,                // React Router path
  href,              // external/internal link
  onClick,
  children,
  variant = 'primary',      // e.g. 'primary' or 'outline-secondary'
  size,                      // 'sm' | 'lg'
  block = false,             // full width
  icon,                      // bootstrap-icons name, e.g. 'arrow-right-circle'
  className = '',
  type = 'button',
  newTab = false,            // open href in new tab
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,        // supports 'primary' or 'outline-*'
    size ? `btn-${size}` : '',
    block ? 'w-100' : '',
    className
  ].filter(Boolean).join(' ');

  const Icon = icon ? <i className={`bi bi-${icon} me-2`} aria-hidden="true" /> : null;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {Icon}{children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {Icon}{children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {Icon}{children}
    </button>
  );
}