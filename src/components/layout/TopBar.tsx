import { Truck, RotateCcw, ShieldCheck } from "lucide-react"

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <span className="font-semibold">🔥 Fénix Legacy</span>
            <span className="hidden sm:inline opacity-90"> - Tu Outlet Deportivo Premium</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Entregas en Caracas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Calidad Original</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pago Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
