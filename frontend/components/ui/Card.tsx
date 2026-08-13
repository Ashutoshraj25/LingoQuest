import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm transition-all duration-200",
        hoverable && "hover:border-duo-blue hover:shadow-duo cursor-pointer transform hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
};
