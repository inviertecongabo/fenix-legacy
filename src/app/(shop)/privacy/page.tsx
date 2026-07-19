"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface AccordionItem {
  id: number
  title: string
  content: React.ReactNode
}

const sections: AccordionItem[] = [
  {
    id: 1,
    title: "¿Quién es responsable de tus datos?",
    content: (
      <div className="space-y-3">
        <p>
          El responsable del tratamiento de tus datos personales es <strong>Fénix Legacy</strong>, tienda
          virtual independiente con sede en Caracas, Venezuela.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Correo electrónico: ventas@fenixlegacy.com</li>
          <li>Teléfono: +58 412 1234567</li>
          <li>Ubicación: Sabana Grande, Caracas, Venezuela</li>
        </ul>
      </div>
    ),
  },
  {
    id: 2,
    title: "¿Qué información recopilamos?",
    content: (
      <div className="space-y-3">
        <p>Al interactuar con Fénix Legacy, podemos recopilar los siguientes datos:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Datos de identificación:</strong> nombre y apellido.</li>
          <li><strong>Datos de contacto:</strong> número de teléfono y correo electrónico.</li>
          <li><strong>Datos de entrega:</strong> dirección de envío dentro del Área Metropolitana de Caracas.</li>
          <li><strong>Datos de la compra:</strong> productos adquiridos, montos y método de pago utilizado.</li>
          <li><strong>Datos de navegación:</strong> información técnica básica recopilada automáticamente al usar nuestra página web (tipo de dispositivo, navegador, páginas visitadas).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    title: "¿Para qué usamos tu información?",
    content: (
      <div className="space-y-3">
        <p>Utilizamos tus datos personales exclusivamente para las siguientes finalidades:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Procesar y gestionar tu pedido de compra.</li>
          <li>Coordinar la entrega o el pick-up de tus productos.</li>
          <li>Confirmarte el pago y el estado de tu orden.</li>
          <li>Atender tus solicitudes de cambio o reclamos posventa.</li>
          <li>Enviarte información sobre nuevas colecciones u ofertas, si has dado tu consentimiento expreso.</li>
        </ul>
        <p>
          No utilizamos tus datos para ningún otro fin no indicado en esta política sin tu autorización previa.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: "¿Compartimos tus datos con terceros?",
    content: (
      <div className="space-y-3">
        <p>
          Fénix Legacy <strong>no vende, alquila ni cede</strong> tus datos personales a terceros.
          Únicamente compartimos información estrictamente necesaria con:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Servicios de delivery:</strong> el nombre, teléfono y dirección de entrega son compartidos con el proveedor logístico para efectuar la entrega de tu pedido.</li>
          <li><strong>Plataformas de pago:</strong> los datos requeridos para confirmar la transacción (comprobante de pago) son manejados directamente por las plataformas que utilizamos (Pago Móvil, Zelle, etc.).</li>
        </ul>
        <p>
          Todos estos terceros están obligados a mantener la confidencialidad de tu información y a utilizarla
          solo para el fin para el que fue compartida.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    title: "¿Por cuánto tiempo guardamos tus datos?",
    content: (
      <p>
        Conservamos tus datos personales durante el tiempo necesario para gestionar tu relación comercial
        con nosotros y cumplir con las obligaciones legales aplicables. Una vez finalizado ese período, o
        si solicitas la eliminación de tu información, procederemos a eliminarla de forma segura de nuestros
        registros.
      </p>
    ),
  },
  {
    id: 6,
    title: "¿Cuáles son tus derechos?",
    content: (
      <div className="space-y-3">
        <p>Como titular de tus datos personales, tienes derecho a:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Acceder</strong> a la información que tenemos sobre ti.</li>
          <li><strong>Rectificar</strong> datos incorrectos o desactualizados.</li>
          <li><strong>Eliminar</strong> tus datos de nuestras bases de datos.</li>
          <li><strong>Revocar tu consentimiento</strong> para el envío de comunicaciones comerciales en cualquier momento.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, escríbenos a{" "}
          <a href="mailto:ventas@fenixlegacy.com" className="underline text-primary">
            ventas@fenixlegacy.com
          </a>{" "}
          indicando tu nombre y la solicitud específica. Te responderemos a la brevedad posible.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    title: "Uso de Cookies",
    content: (
      <div className="space-y-3">
        <p>
          Nuestra página web puede utilizar cookies y tecnologías similares para mejorar tu experiencia de
          navegación, recordar tus preferencias y analizar el tráfico del sitio de forma anónima.
        </p>
        <p>
          Puedes configurar tu navegador para rechazar las cookies o para que te avise cuando se envíe una.
          Ten en cuenta que algunas funciones del sitio pueden no operar correctamente si deshabilitas
          las cookies.
        </p>
        <p>
          Para más detalles, consulta nuestra{" "}
          <a href="/cookies" className="underline text-primary">Política de Cookies</a>.
        </p>
      </div>
    ),
  },
  {
    id: 8,
    title: "Seguridad de tu información",
    content: (
      <p>
        Fénix Legacy aplica medidas de seguridad razonables para proteger tus datos personales contra
        accesos no autorizados, pérdida o divulgación indebida. Sin embargo, ninguna transmisión de datos
        por Internet puede garantizarse como 100% segura. Te recomendamos no compartir información
        sensible (como contraseñas o datos bancarios) a través de canales no seguros.
      </p>
    ),
  },
  {
    id: 9,
    title: "Cambios a esta Política de Privacidad",
    content: (
      <p>
        Fénix Legacy se reserva el derecho de actualizar esta Política de Privacidad en cualquier momento.
        Te notificaremos cualquier cambio relevante publicando la versión actualizada en esta página con
        la nueva fecha de vigencia. Te recomendamos revisarla periódicamente.
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Política de Privacidad
          </h1>
          <p className="mt-3 text-muted-foreground">
            Última actualización: 18/7/2026
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-muted-foreground">
            En Fénix Legacy valoramos y respetamos tu privacidad. Esta política describe cómo recopilamos,
            usamos y protegemos la información personal que nos proporcionas al interactuar con nuestra
            tienda online. Al usar nuestro sitio web, aceptas las prácticas descritas a continuación.
          </p>
        </div>
      </section>

      {/* Accordion Content */}
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <div className="divide-y divide-border rounded-lg border bg-card shadow-sm">
          {sections.map((section) => (
            <div key={section.id} className="px-6">
              <AccordionSection item={section} />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          ¿Tienes preguntas sobre el manejo de tus datos? Escríbenos a{" "}
          <a href="mailto:ventas@fenixlegacy.com" className="underline text-primary">
            ventas@fenixlegacy.com
          </a>
        </p>
      </section>
    </main>
  )
}
