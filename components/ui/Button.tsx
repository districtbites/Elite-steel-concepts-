import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    "inline-flex items-center justify-center font-black uppercase tracking-[0.2em] transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none border border-transparent";

  const variants = {
    primary:
      "bg-primary text-black border-primary hover:bg-black hover:text-primary hover:border-black",
    secondary:
      "bg-black text-white border-black hover:bg-primary hover:text-black hover:border-primary",
    outline:
      "bg-transparent border-black text-black hover:bg-black hover:text-white",
    white:
      "bg-white text-black border-white hover:bg-black hover:text-white hover:border-black",
  };

  const sizes = {
    sm: "text-[10px] px-6 py-3",
    md: "text-[10px] px-8 py-4",
    lg: "text-xs px-12 py-5",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="ml-3 w-4 h-4" />}
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
