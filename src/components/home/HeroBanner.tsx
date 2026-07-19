"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    id: 1,
    badge: "Nueva Colección",
    title: "Ropa de Entrenamiento",
    subtitle: "Rendimiento Máximo",
    description: "Franelas y shorts originales diseñados para llevar tu rutina al siguiente nivel.",
    cta: "Ver Ropa",
    href: "/products?category=camisetas",
    gradient: "from-slate-900 via-gray-900 to-black",
    image: "/hero-training.jpg",
  },
  {
    id: 2,
    badge: "Hasta 40% OFF",
    title: "Zapatillas Running",
    subtitle: "Comodidad Absoluta",
    description: "Amortiguación perfecta y diseño ligero para acumular kilómetros sin esfuerzo.",
    cta: "Ver Zapatillas",
    href: "/products?category=zapatillas",
    gradient: "from-blue-900 via-slate-900 to-black",
    image: "/hero-running.jpg",
  },
  {
    id: 3,
    badge: "Estilo Urbano",
    title: "Hoodies y Sweaters",
    subtitle: "Look Casual",
    description: "Las mejores sudaderas de la marca para mantener el estilo en cualquier ocasión.",
    cta: "Explorar",
    href: "/products?category=hoodies",
    gradient: "from-stone-900 via-neutral-900 to-black",
    image: "/hero-casual.jpg",
  },
]

export function HeroBanner() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient}`}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                    {/* Text Content */}
                    <div className="max-w-xl text-center lg:text-left">
                      <span className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white mb-3">
                        {slide.badge}
                      </span>
                      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {slide.title}
                        <span className="block text-white mt-1 opacity-90 font-medium">{slide.subtitle}</span>
                      </h2>
                      <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-md mx-auto lg:mx-0">
                        {slide.description}
                      </p>
                      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <Button asChild size="default">
                          <Link href={slide.href}>{slide.cta}</Link>
                        </Button>
                        <Button asChild variant="outline" className="bg-transparent border-slate-500 text-white hover:bg-slate-800 hover:text-white">
                          <Link href="/products">Ver Todo</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative w-72 h-52 sm:w-96 sm:h-72 lg:w-[500px] lg:h-80">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full" />
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 hidden sm:flex" />
        <CarouselNext className="right-4 hidden sm:flex" />

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-1.5 w-6 rounded-full bg-white/30 transition-colors"
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
