"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface AccordionItem {
  id: number
  title: string
  content: React.ReactNode
}

const terms: AccordionItem[] = [
  {
    id: 1,
    title: "Quiénes Somos",
    content: (
      <div className="space-y-3">
        <p>
          Fénix Legacy es una tienda virtual independiente con sede en Caracas, Venezuela, especializada en la comercialización de ropa y accesorios outlet originales de la marca Adidas.
        </p>
        <p>
          <strong>Aclaratoria de marca:</strong> <em>Fénix Legacy</em> opera como un comercializador independiente y no es un distribuidor oficial, franquicia o agente directo de Adidas. Todos los logotipos y marcas registradas mostrados pertenecen a sus respectivos dueños y se utilizan únicamente con fines descriptivos para identificar los productos.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    title: "Políticas de Compra",
    content: (
      <div className="space-y-3">
        <p>
          <strong>Disponibilidad de Inventario:</strong> Al tratarse de mercancía outlet, nuestro inventario es limitado. Añadir un artículo al carrito de compras no garantiza su reserva. El producto solo queda apartado una vez que el pago ha sido reportado y confirmado por nuestro equipo.
        </p>
        <p>
          <strong>Precios:</strong> Todos los precios publicados están expresados en USD y son precios finales. Si deseas pagar en moneda nacional (Bolívares), el cálculo se realizará en base a la tasa de cambio del día del BCV.
        </p>
        <p>
          <strong>Métodos de Pago:</strong> Aceptamos los siguientes métodos de pago: (Lo que vayamos a poner, aquí, pago movil, transferencia, etc)
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title: "Políticas de Envío y Entregas (Caracas)",
    content: (
      <div className="space-y-3">
        <p>
          Actualmente, Fénix Legacy opera exclusivamente con entregas dentro del Área Metropolitana de Caracas. Ofrecemos las siguientes modalidades:
        </p>
        <p>
          <strong>Entregas Personales (Pick-up):</strong> Las entregas personales gratuitas se realizan previo acuerdo en [Indicar puntos de entrega, ej. Plaza Venezuela, estaciones de metro céntricas, o una dirección específica], en el horario de [Días y horas de atención].
        </p>
        <p>
          <strong>Servicio de Delivery:</strong> Contamos con servicio de entrega a domicilio (delivery) con un costo adicional que varía según la zona de Caracas. El costo exacto del delivery será informado al cliente antes de finalizar la compra.
        </p>
        <p>
          <strong>Responsabilidad de Entrega:</strong> Si el cliente selecciona la opción de delivery, Fénix Legacy garantiza la integridad del producto hasta el momento en que es entregado en la dirección indicada. Es responsabilidad del cliente revisar que la mercancía esté en perfectas condiciones al momento de recibirla.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: "Políticas de Cambios y Devoluciones",
    content: (
      <div className="space-y-3">
        <p>
          Nuestra prioridad es tu satisfacción, pero debido a la naturaleza de los productos (Outlet), manejamos normativas estrictas para los cambios:
        </p>
        <p>
          <strong>Plazo para reportes:</strong> Si deseas solicitar un cambio (por talla o defecto de fábrica no advertido), debes notificarlo a nuestro equipo de atención en un plazo máximo de [Ej. 24 a 48 horas] desde el momento en que recibiste la prenda. No se aceptarán reclamos fuera de este período.
        </p>
        <p>
          <strong>Condiciones de la prenda:</strong> Para que un cambio sea aprobado, la ropa debe estar en las mismas condiciones en las que fue entregada: nueva, sin uso, sin lavar, sin olores (perfume o humo) y con absolutamente todas sus etiquetas originales adheridas.
        </p>
        <p>
          <strong>Gastos de logística por cambio:</strong> Si el cambio se debe a un error del cliente (ej. elección incorrecta de talla), los costos de delivery para el cambio correrán por cuenta del comprador. Si el error fue de Fénix Legacy (enviamos un modelo o talla distinta a la facturada), nosotros cubriremos los gastos de traslado.
        </p>
        <p>
          <strong>Reembolsos:</strong> [Decide tu política aquí, ej. En Fénix Legacy no realizamos devoluciones de dinero. Los cambios solo se efectuarán por otra prenda de igual o mayor valor (pagando la diferencia), o se emitirá una nota de crédito a favor del cliente].
        </p>
      </div>
    ),
  }
]

function AccordionSection({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-bold uppercase tracking-wide">
          {item.title}
        </span>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="pb-6 text-sm text-muted-foreground leading-relaxed space-y-3">
          {item.content}
        </div>
      )}
    </div>
  )
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Términos y Condiciones
          </h1>
          <p className="mt-3 text-muted-foreground">
            Última actualización: 18/7/2026
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-muted-foreground">
            Bienvenido a Fénix Legacy. Al acceder, navegar y realizar una compra en nuestro sitio web o a través de nuestros canales de atención, aceptas los siguientes Términos y Condiciones. Te invitamos a leerlos detenidamente antes de concretar tu pedido.
          </p>
        </div>
      </section>

      {/* Accordion Content */}
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <div className="divide-y divide-border rounded-lg border bg-card shadow-sm">
          {terms.map((term) => (
            <div key={term.id} className="px-6">
              <AccordionSection item={term} />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          ¿Tienes preguntas? Escríbenos a{" "}
          <a href="mailto:ventas@fenixlegacy.com" className="underline text-primary">
            ventas@fenixlegacy.com
          </a>
        </p>
      </section>
    </main>
  )
}
