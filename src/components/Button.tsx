import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    title?: string;
}

function Button({ children, onClick, disabled, title, className }: Readonly<ButtonProps>) {
    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </button>
    );
}

export default Button;
