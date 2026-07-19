import React from "react"

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield Outline */}
      <path 
        d="M 40 90 L 40 40 L 100 20 L 160 40 L 160 90 C 160 140 100 180 100 180 C 100 180 40 140 40 90 Z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="6"
      />
      
      {/* Phoenix Wings / Flame */}
      <path 
        d="M 100 40 C 70 40 50 80 40 110 C 65 90 85 95 95 70 C 95 100 105 100 105 70 C 115 95 135 90 160 110 C 150 80 130 40 100 40 Z" 
        fill="currentColor" 
      />
      
      {/* Background Cutout for Text */}
      <rect x="20" y="105" width="160" height="40" fill="hsl(var(--background))" />
      
      {/* Text: FENIX */}
      <text 
        x="100" 
        y="135" 
        fontFamily="serif" 
        fontSize="44" 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="currentColor"
      >
        FENIX
      </text>
      
      {/* Text: LEGACY */}
      <text 
        x="100" 
        y="160" 
        fontFamily="sans-serif" 
        fontSize="16" 
        letterSpacing="4" 
        textAnchor="middle" 
        fill="currentColor"
      >
        LEGACY
      </text>
    </svg>
  )
}
