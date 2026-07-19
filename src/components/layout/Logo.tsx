"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Before mount, show nothing to avoid hydration mismatch
  if (!mounted) {
    return <div className={className} />
  }

  return (
    <Image
      src="/logo.jpg"
      alt="Fénix Legacy"
      width={160}
      height={48}
      className={`object-contain ${className} ${
        resolvedTheme === "dark"
          ? "brightness-0 invert"       // dark mode: make white
          : "brightness-0"              // light mode: make black
      }`}
      style={{ transition: "filter 0.2s ease" }}
      priority
    />
  )
}
