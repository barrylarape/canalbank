"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Institutional Animated Number
 * Uses en-IE locale for Euro (€) formatting to preserve dot-separated decimals.
 */
export function AnimatedNumber({ value, className, size = "md" }: AnimatedNumberProps) {
  const count = useMotionValue(0);
  
  const integerPart = useTransform(count, (latest) => 
    new Intl.NumberFormat("en-IE", { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(Math.floor(latest))
  );

  const decimalPart = useTransform(count, (latest) => {
    const val = latest.toFixed(2);
    const parts = val.split(".");
    return `.${parts[1] || "00"}`;
  });

  const [intDisplay, setIntDisplay] = useState("0");
  const [decDisplay, setDecDisplay] = useState(".00");

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "circOut" });
    return controls.stop;
  }, [value, count]);

  useEffect(() => {
    const unsubscribeInt = integerPart.on("change", (latest) => setIntDisplay(latest));
    const unsubscribeDec = decimalPart.on("change", (latest) => setDecDisplay(latest));
    return () => {
      unsubscribeInt();
      unsubscribeDec();
    };
  }, [integerPart, decimalPart]);

  const sizes = {
    sm: { int: "text-base", dec: "text-[10px]" },
    md: { int: "text-xl", dec: "text-xs" },
    lg: { int: "text-2xl", dec: "text-base" },
    xl: { int: "text-[30px]", dec: "text-[18px]" },
  };

  const currentSize = sizes[size];

  return (
    <span className={cn("inline-flex items-baseline font-mono tracking-tighter", className)}>
      <span className={cn("font-bold leading-none", currentSize.int)}>{intDisplay}</span>
      <span className={cn("font-medium opacity-40 leading-none", currentSize.dec)}>{decDisplay}</span>
    </span>
  );
}