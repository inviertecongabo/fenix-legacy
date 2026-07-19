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
    title: "Información general que recopilamos",
    content: (
      <p>
        La información general que recopilamos cuando visita nuestro sitio web incluye el dominio desde el que accede a Internet, la dirección de protocolo de Internet ("Dirección IP") del dispositivo que está utilizando y la fecha y hora en que ingresó a nuestra página. Esta información se recopila automáticamente de forma anónima para administrar nuestro sitio, analizar tendencias y mejorar continuamente su experiencia de navegación en nuestra tienda.
      </p>
    ),
  },
  {
    id: 2,
    title: "Información personal que recopilamos",
    content: (
      <div className="space-y-3">
        <p>
          Para brindarle el mejor servicio y procesar la compra de sus artículos, recopilamos información personal únicamente cuando usted nos la proporciona de manera directa y voluntaria (por ejemplo, al crear una cuenta, realizar una compra o contactarnos). Esta información puede incluir:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Nombre y apellido.</li>
          <li>Número de Cédula de Identidad (requerido para facturación).</li>
          <li>Dirección de correo electrónico y número de teléfono.</li>
          <li>Dirección de envío detallada para el servicio de delivery en la ciudad de Caracas, o la selección del punto de entrega.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    title: "Cómo utilizamos la información personal",
    content: (
      <p>
        Fénix Legacy utiliza su información personal para identificarlo, procesar sus pedidos de ropa, responder a sus solicitudes de atención al cliente, registrarlo para ciertas actividades en el sitio web y confirmar dicho registro, y para ayudar a identificarlo en caso de que pierda su contraseña de acceso a nuestra tienda. Si usted nos otorga su consentimiento, también podremos utilizar esta información para enviarle comunicaciones sobre nuevos ingresos de mercancía, reposición de inventario (restock) u ofertas exclusivas de nuestra tienda.
      </p>
    ),
  },
  {
    id: 4,
    title: "Empresas contratadas y terceros",
    content: (
      <div className="space-y-3">
        <p>
          Fénix Legacy puede contratar empresas o personal independiente para ayudar a entregar productos o servicios, como una empresa de mensajería o servicio de delivery encargado de entregarle su paquete. En esos casos, es estrictamente necesario compartir su información personal (nombre, teléfono y dirección de entrega) con estas empresas contratadas.
        </p>
        <p>
          <strong>Nota importante:</strong> Todas las empresas o personas contratadas para la logística están obligadas contractualmente a mantener la confidencialidad y estricta seguridad de toda la Información Personal. A excepción de este fin logístico indispensable, Fenix Legacy no vende, alquila ni comercializa su información personal con otras empresas.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    title: "Enlaces a otros sitios web y aclaratoria de marca",
    content: (
      <div className="space-y-3">
        <p>
          Nuestra Política de Privacidad no aborda la información, las prácticas o las políticas de privacidad y seguridad de ningún otro sitio web.
        </p>
        <p>
          Aunque en Fenix Legacy comercializamos indumentaria y accesorios originales de la marca Adidas, operamos como un comercio local independiente. Esta política no cubre la recopilación de datos que puedan realizar terceros, ni vincula sus datos personales con las plataformas oficiales o bases de datos de Adidas.
        </p>
      </div>
    ),
  },
  {
    id: 6,
    title: "Seguridad de la información",
    content: (
      <p>
        Hemos implementado medidas de seguridad administrativas y técnicas razonables para proteger su información contra pérdida, uso indebido o alteración. Si desea actualizar, corregir o eliminar su información personal de nuestra base de datos, o si desea darse de baja de nuestras comunicaciones promocionales, puede comunicarse con nosotros en cualquier momento a través de [Número de ws de aiberson].
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
