import { Shield, Flame } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        <Shield className="h-9 w-9 text-foreground" strokeWidth={1.5} />
        <Flame className="absolute h-4 w-4 text-foreground mb-1" strokeWidth={2} fill="currentColor" />
      </div>
      <div className="flex flex-col justify-center mt-1">
        <span className="text-2xl font-serif font-bold leading-none tracking-widest text-foreground">
          FENIX
        </span>
        <span className="text-[0.65rem] font-sans tracking-[0.3em] text-foreground opacity-90 mt-0.5">
          LEGACY
        </span>
      </div>
    </div>
  )
}
