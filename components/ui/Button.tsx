import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  icon = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-sm";

  const variants = {
    primary:
      "bg-primary hover:bg-orange-600 text-white focus:ring-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    secondary:
      "bg-secondary hover:bg-gray-900 text-white focus:ring-secondary shadow-md hover:shadow-lg",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    white:
      "bg-white text-secondary hover:bg-gray-100 focus:ring-white shadow-md hover:shadow-lg",
  };

  const sizes = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {icon && <MoveRight className="ml-2 w-4 h-4" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
};

export default Button;
