import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "blue" | "yellow" | "red" | "purple" | "white" | "ghost";
  size?: "sm" | "md" | "lg" | "full";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "green",
  size = "md",
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    green: "btn-duo-green",
    blue: "btn-duo-blue",
    yellow: "btn-duo-yellow",
    red: "btn-duo-red",
    purple: "btn-duo-purple",
    white: "btn-duo-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 border-none shadow-none",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-xl font-bold uppercase tracking-wider",
    md: "px-6 py-3 text-base rounded-2xl font-bold uppercase tracking-wider",
    lg: "px-8 py-4 text-lg rounded-2xl font-extrabold uppercase tracking-wider",
    full: "w-full py-3.5 text-base rounded-2xl font-bold uppercase tracking-wider",
  };

  return (
    <button
      className={clsx(
        "relative inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
