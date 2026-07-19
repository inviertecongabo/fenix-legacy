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
    title: "¿CUÁNDO SE APLICAN ESTOS TÉRMINOS Y CONDICIONES?",
    content: (
      <p>
        Estos Términos y Condiciones se aplican a todas las ofertas, compras y contratos de venta relacionados
        con la comercialización y suministro de productos por parte de Fénix Legacy a través de fenixlegacy.com
        (en adelante, la &ldquo;página web&rdquo;). Al comprar cualquier producto a través de la página web,
        tu aceptación de estos Términos y Condiciones durante el proceso de pedido implica que aceptas su
        aplicación y te obligas conforme a su contenido. Cualquier excepción o modificación a estos Términos
        y Condiciones requerirá aceptación previa y por escrito de Fénix Legacy.
      </p>
    ),
  },
  {
    id: 2,
    title: "INFORMACIÓN SOBRE FÉNIX LEGACY",
    content: (
      <div className="space-y-3">
        <p>
          Fénix Legacy es una tienda online dedicada a la venta de ropa deportiva importada de marcas
          reconocidas como Adidas, Nike, Puma y Under Armour, al mejor precio de Venezuela.
        </p>
        <p>
          Para cualquier consulta, puedes contactarnos a través de:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Correo electrónico: ventas@fenixlegacy.com</li>
          <li>Teléfono: +58 412 1234567</li>
          <li>Dirección: Sabana Grande, Caracas, Venezuela</li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    title: "NUESTROS PRODUCTOS Y PRECIOS",
    content: (
      <div className="space-y-3">
        <p>
          Todos los precios mostrados en la página web incluyen los impuestos aplicables según la legislación
          venezolana vigente. Los precios están expresados en dólares americanos (USD) y se calculan con la
          tasa oficial del Banco Central de Venezuela (BCV) para pagos en bolívares.
        </p>
        <p>
          Fénix Legacy se reserva el derecho de modificar los precios en cualquier momento sin previo aviso.
          Sin embargo, el precio aplicable a tu pedido será el vigente en el momento de la confirmación de
          la compra.
        </p>
        <p>
          Las imágenes de los productos son ilustrativas. Los colores reales pueden variar ligeramente según
          la configuración de tu pantalla. Nos esforzamos por garantizar que las descripciones y
          especificaciones sean lo más precisas posible.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: "¿CÓMO SE FORMALIZA EL CONTRATO DE COMPRA?",
    content: (
      <div className="space-y-3">
        <p>
          El contrato de compra entre el cliente y Fénix Legacy se formaliza en el momento en que recibes
          la confirmación de tu pedido por correo electrónico. Dicha confirmación constituye la aceptación
          formal de tu orden.
        </p>
        <p>
          El proceso de compra es el siguiente:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Seleccionas los productos de tu interés y los agregas al carrito.</li>
          <li>Procedes al pago completando la información de entrega.</li>
          <li>Confirmas y realizas el pago por el método seleccionado.</li>
          <li>Recibes un correo de confirmación con los detalles de tu pedido.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 5,
    title: "DISPONIBILIDAD DE PRODUCTOS Y GESTIÓN DE INVENTARIO",
    content: (
      <div className="space-y-3">
        <p>
          La disponibilidad de los productos mostrada en la página web refleja el inventario en tiempo real.
          En caso de que un producto que hayas comprado no esté disponible, te contactaremos de inmediato
          para ofrecerte una alternativa o proceder con el reembolso correspondiente.
        </p>
        <p>
          Fénix Legacy gestiona un sistema de inventario por talla y color para cada prenda. Es
          responsabilidad del cliente verificar la disponibilidad de la variante exacta (talla y color)
          antes de confirmar la compra.
        </p>
      </div>
    ),
  },
  {
    id: 6,
    title: "MÉTODOS DE PAGO",
    content: (
      <div className="space-y-3">
        <p>Fénix Legacy acepta los siguientes métodos de pago:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Transferencia bancaria en bolívares (Bs.) según tasa BCV del día</li>
          <li>Pago móvil (Pago Móvil Interbancario)</li>
          <li>Divisas (dólares americanos en efectivo o transferencia)</li>
          <li>Zelle</li>
          <li>Binance Pay (USDT)</li>
        </ul>
        <p>
          Una vez realizado el pago, deberás enviar el comprobante a través de los canales indicados
          durante el proceso de compra para confirmar tu pedido.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    title: "ENTREGA Y ENVÍOS",
    content: (
      <div className="space-y-3">
        <p>
          Realizamos envíos a todo el territorio venezolano a través de servicios de encomiendas nacionales
          de confianza. Los tiempos estimados de entrega son:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Caracas: 1 a 2 días hábiles</li>
          <li>Interior del país: 2 a 5 días hábiles</li>
        </ul>
        <p>
          El costo de envío se calcula según el destino y el peso del paquete. Los pedidos superiores a
          $200 tienen envío gratuito a nivel nacional.
        </p>
        <p>
          Fénix Legacy no se hace responsable por retrasos causados por circunstancias fuera de nuestro
          control (huelgas, desastres naturales, problemas del operador logístico, etc.).
        </p>
      </div>
    ),
  },
  {
    id: 8,
    title: "DEVOLUCIONES Y CAMBIOS",
    content: (
      <div className="space-y-3">
        <p>
          Aceptamos devoluciones y cambios dentro de los <strong>30 días</strong> posteriores a la recepción
          del producto, siempre que se cumplan las siguientes condiciones:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>El producto debe estar en su estado original, sin uso y con todas las etiquetas intactas.</li>
          <li>Debe contar con el empaque original.</li>
          <li>Se debe presentar el comprobante de compra.</li>
        </ul>
        <p>
          No se aceptan devoluciones de productos que hayan sido usados, lavados o dañados por el
          cliente. Los gastos de envío para devoluciones o cambios serán cubiertos por Fénix Legacy en
          caso de que el producto presente un defecto de fabricación.
        </p>
        <p>
          Para iniciar un proceso de devolución o cambio, contáctanos a ventas@fenixlegacy.com indicando
          tu número de pedido y el motivo de la devolución.
        </p>
      </div>
    ),
  },
  {
    id: 9,
    title: "GARANTÍA DE LOS PRODUCTOS",
    content: (
      <p>
        Todos nuestros productos cuentan con garantía de <strong>30 días</strong> contra defectos de
        fabricación. En caso de identificar un defecto, deberás contactarnos dentro de ese lapso con
        fotografías del producto y descripción del problema. Fénix Legacy evaluará el caso y ofrecerá
        reemplazo, reparación o reembolso según corresponda, a su criterio.
      </p>
    ),
  },
  {
    id: 10,
    title: "POLÍTICA DE CANCELACIÓN DE PEDIDOS",
    content: (
      <div className="space-y-3">
        <p>
          Podrás cancelar tu pedido sin costo alguno siempre que la solicitud se realice antes de que el
          pedido haya sido despachado. Una vez despachado, no será posible cancelar la orden y deberá
          iniciarse un proceso de devolución.
        </p>
        <p>
          Para cancelar un pedido, escríbenos de inmediato a ventas@fenixlegacy.com con tu número de
          pedido. Te confirmaremos la cancelación por la misma vía.
        </p>
      </div>
    ),
  },
  {
    id: 11,
    title: "PROTECCIÓN DE DATOS PERSONALES",
    content: (
      <div className="space-y-3">
        <p>
          Fénix Legacy recopila y procesa tus datos personales (nombre, dirección, correo electrónico,
          teléfono) exclusivamente para gestionar tu pedido y brindarte una experiencia de compra
          personalizada.
        </p>
        <p>
          No compartimos tus datos personales con terceros, salvo con los operadores logísticos necesarios
          para la entrega de tu pedido. Puedes solicitar la eliminación de tus datos en cualquier momento
          escribiéndonos a ventas@fenixlegacy.com.
        </p>
        <p>
          Para más información, consulta nuestra <a href="/privacy" className="underline text-primary">Política de Privacidad</a>.
        </p>
      </div>
    ),
  },
  {
    id: 12,
    title: "CONDUCTA FRAUDULENTA O ABUSIVA",
    content: (
      <p>
        Fénix Legacy se reserva el derecho de cancelar pedidos y bloquear cuentas en caso de detectar
        actividad fraudulenta, abusiva o que contravenga estos Términos y Condiciones. Esto incluye,
        entre otros, el uso de información de pago falsa, intentos de eludir el sistema de inventario
        o cualquier otra conducta que afecte la operación normal de la tienda o los derechos de otros
        clientes.
      </p>
    ),
  },
  {
    id: 13,
    title: "MODIFICACIONES A LOS TÉRMINOS Y CONDICIONES",
    content: (
      <p>
        Fénix Legacy se reserva el derecho de actualizar o modificar estos Términos y Condiciones en
        cualquier momento. Los cambios entrarán en vigor desde el momento de su publicación en la página
        web. Es responsabilidad del cliente revisar periódicamente estos términos. El uso continuado de
        la página web después de cualquier modificación constituye la aceptación de los nuevos términos.
      </p>
    ),
  },
  {
    id: 14,
    title: "DERECHO APLICABLE Y JURISDICCIÓN",
    content: (
      <p>
        Estos Términos y Condiciones se rigen por la legislación de la República Bolivariana de Venezuela.
        Cualquier controversia derivada de su interpretación o aplicación será sometida a los tribunales
        competentes de la ciudad de Caracas, Venezuela, renunciando expresamente a cualquier otro fuero
        que pudiera corresponder.
      </p>
    ),
  },
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
