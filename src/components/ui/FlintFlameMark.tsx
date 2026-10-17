import React from 'react';

/**
 * The Ruination crown mark. Inline SVG keeps the mark responsive to the active theme.
 */
export const RuinationCrownMark: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className={className}
        aria-hidden="true"
        style={{ display: 'block' }}
    >
        <path
            d="M8 18 19 28 27 10 36 28 49 15 53 39 12 39Z"
            fill="var(--accent-primary)"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <path d="M13 45H52L48 51H17Z" fill="currentColor" opacity=".82" />
        <path d="M19 34 27 17 35 34" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".65" />
        <circle cx="31" cy="28" r="3" fill="currentColor" />
    </svg>
);
