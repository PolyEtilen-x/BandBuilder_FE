import "./Skeleton.css";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: "text" | "rect" | "circle";
}

export default function Skeleton({
  className = "",
  width,
  height,
  borderRadius,
  variant = "rect",
}: SkeletonProps) {
  const styles: React.CSSProperties = {
    width,
    height,
    borderRadius: variant === "circle" ? "50%" : borderRadius,
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={styles}
    />
  );
}
