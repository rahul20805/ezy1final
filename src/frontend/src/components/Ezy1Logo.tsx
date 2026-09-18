import React from "react";
import { Link } from "@tanstack/react-router";

export interface Ezy1LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
  asLink?: boolean;
  to?: string;
  variant?: "full" | "badge" | "horizontal";
}

/**
 * Ezy1 Icon Badge SVG
 * Features rich saffron gradient, glass highlight, and full bold "ezy1" brand mark.
 */
export function Ezy1IconBadge({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`ezyBadgeGrad_${size}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="50%" stopColor="#FF5100" />
          <stop offset="100%" stopColor="#E52E00" />
        </linearGradient>
        <linearGradient
          id={`ezyGoldGrad_${size}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
        <linearGradient
          id={`ezyGloss_${size}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={`ezyShadow_${size}`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#B71C1C"
            floodOpacity="0.25"
          />
        </filter>
      </defs>

      {/* Main squircle badge */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="24"
        fill={`url(#ezyBadgeGrad_${size})`}
        filter={`url(#ezyShadow_${size})`}
      />

      {/* Gloss border ring */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="23"
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="2"
      />

      {/* Subtle glossy top curve */}
      <path
        d="M 4 28 C 4 15, 15 4, 28 4 L 72 4 C 85 4, 96 15, 96 28 L 96 42 C 70 50, 30 42, 4 50 Z"
        fill={`url(#ezyGloss_${size})`}
      />

      {/* Bold "ezy1" brand mark */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="33"
        letterSpacing="-1.2"
      >
        <tspan fill="#FFFFFF">ezy</tspan>
        <tspan fill={`url(#ezyGoldGrad_${size})`} fontSize="36">
          1
        </tspan>
      </text>

      {/* Speed pill underline under ezy1 */}
      <rect
        x="28"
        y="67"
        width="36"
        height="4.5"
        rx="2.25"
        fill={`url(#ezyGoldGrad_${size})`}
      />
      <circle cx="22" cy="69.25" r="2.25" fill="#FFFFFF" />
      <circle cx="69" cy="69.25" r="2.25" fill={`url(#ezyGoldGrad_${size})`} />

      {/* Sparkle on top-right of 1 */}
      <path
        d="M 78 28 L 80 33 L 85 35 L 80 37 L 78 42 L 76 37 L 71 35 L 76 33 Z"
        fill={`url(#ezyGoldGrad_${size})`}
      />
    </svg>
  );
}

/**
 * Full Ezy1 Brand Logo Component
 * Combines the vibrant Ezy1 icon badge with crisp, accessible typography.
 * Supports linking to home page with smooth hover animations.
 */
export function Ezy1Logo({
  size = "md",
  showWordmark = true,
  subtitle,
  className = "",
  asLink = true,
  to = "/",
}: Ezy1LogoProps) {
  // Dimension configuration
  const config = {
    sm: {
      badgeSize: 28,
      textSize: "text-lg",
      oneSize: "text-lg",
      gap: "gap-1.5",
      subtitleSize: "text-[9px]",
    },
    md: {
      badgeSize: 34,
      textSize: "text-xl",
      oneSize: "text-xl",
      gap: "gap-2",
      subtitleSize: "text-[10px]",
    },
    lg: {
      badgeSize: 42,
      textSize: "text-2xl",
      oneSize: "text-2xl",
      gap: "gap-2.5",
      subtitleSize: "text-xs",
    },
    xl: {
      badgeSize: 52,
      textSize: "text-3xl",
      oneSize: "text-3xl",
      gap: "gap-3",
      subtitleSize: "text-xs",
    },
  }[size];

  const content = (
    <div
      className={`inline-flex items-center ${config.gap} group cursor-pointer select-none ${className}`}
      data-ocid="ezy1_logo"
    >
      {/* Icon Badge with hover transition */}
      <div className="relative transition-transform duration-200 group-hover:scale-105 group-active:scale-95 shadow-xs rounded-xl overflow-hidden">
        <Ezy1IconBadge size={config.badgeSize} />
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span
              className={`font-display font-black tracking-tight text-foreground ${config.textSize} transition-colors duration-200 group-hover:text-primary/95`}
            >
              ezy
            </span>
            <span
              className={`font-display font-black tracking-tight text-primary ${config.oneSize} ml-[1px]`}
            >
              1
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary ml-1 self-center animate-pulse" />
          </div>

          {subtitle ? (
            <span
              className={`${config.subtitleSize} font-semibold uppercase tracking-wider text-muted-foreground mt-0.5 truncate max-w-[180px]`}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        to={to}
        className="inline-flex items-center no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        data-ocid="nav.logo_link"
        aria-label="Ezy1 Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default Ezy1Logo;
