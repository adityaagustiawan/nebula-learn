import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

interface NebulaLogoProps {
  /** Size in pixels for the icon portion */
  size?: "sm" | "md" | "lg";
  /** Whether to show the text beside the icon */
  showText?: boolean;
  /** Whether to render as a link to "/" */
  asLink?: boolean;
  className?: string;
}

const sizes = {
  sm: { img: "h-7 w-7", text: "text-base" },
  md: { img: "h-9 w-9", text: "text-lg" },
  lg: { img: "h-14 w-14", text: "text-2xl" },
};

function LogoContent({ size = "md", showText = true }: NebulaLogoProps) {
  const s = sizes[size];

  return (
    <span className="flex items-center gap-2 select-none">
      {/* Icon wrapper — float + glow pulse */}
      <span
        className={[
          s.img,
          "relative flex-shrink-0 grid place-items-center rounded-lg gradient-primary shadow-glow",
          "nebula-logo-icon",
        ].join(" ")}
        aria-hidden="true"
      >
        <Sparkles className="w-2/3 h-2/3 text-primary-foreground" />
        {/* Sparkle overlay */}
        <span className="absolute inset-0 nebula-logo-shimmer rounded-lg pointer-events-none" />
      </span>

      {showText && (
        <span
          className={[
            s.text,
            "font-display font-bold tracking-tight nebula-logo-text",
          ].join(" ")}
        >
          Nebula<span className="text-gradient">Learn</span>
        </span>
      )}
    </span>
  );
}

export function NebulaLogo(props: NebulaLogoProps) {
  if (props.asLink === false) {
    return <LogoContent {...props} />;
  }
  return (
    <Link to="/" className={props.className}>
      <LogoContent {...props} />
    </Link>
  );
}
