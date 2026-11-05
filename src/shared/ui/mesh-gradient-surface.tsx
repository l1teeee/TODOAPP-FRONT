"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { useTheme } from "@/shared/theme/use-theme";

// Hex values here are shader inputs, not CSS, so they live outside globals.css.
const MESH_LIGHT_COLORS = ["#EDF2FE", "#DCE8FF", "#FDECEF", "#FFF1E6", "#E7F8F0"];
const MESH_DARK_COLORS = ["#1E2026", "#1F2733", "#3A2530", "#25282F"];

const MESH_SPEED = 0.4;

export interface MeshGradientSurfaceProps {
  className?: string;
}

interface Size {
  width: number;
  height: number;
}

export function MeshGradientSurface({
  className,
}: MeshGradientSurfaceProps) {
  const { resolved } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });
    intersectionObserver.observe(container);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotion = () => setReducedMotion(motionQuery.matches);
    handleMotion();
    motionQuery.addEventListener("change", handleMotion);

    const handleVisibility = () => setTabVisible(!document.hidden);
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotion);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const palette = resolved === "dark" ? MESH_DARK_COLORS : MESH_LIGHT_COLORS;
  const animate = !reducedMotion && inView && tabVisible;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {size && size.width > 0 && size.height > 0 ? (
        <MeshGradient
          width={size.width}
          height={size.height}
          colors={palette}
          speed={animate ? MESH_SPEED : 0}
          distortion={0.8}
          swirl={0.6}
          grainMixer={0}
          grainOverlay={0}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0",
          resolved === "dark" ? "bg-black/30" : "bg-white/15",
        )}
      />
    </div>
  );
}
