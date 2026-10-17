import React from 'react';

export const RuinationMark: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
    <img
        src="/ruination-mark.svg"
        width={size}
        height={size}
        className={className}
        alt=""
        aria-hidden="true"
        draggable={false}
    />
);
