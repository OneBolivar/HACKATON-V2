export function EventFeaturesHub() {
  const sections = [
    {
      category: 'Gestión y Logística del Evento',
      features: [
        {
          title: 'Registro y venta de entradas',
          desc: 'Emite boletos digitales con códigos QR verificables y procesa pagos seguros en línea.',
          icon: '🎟️',
          badge: 'Ticketing',
        },
        {
          title: 'Control de acceso y aforo',
          desc: 'Herramientas de escaneo móvil para validar la entrada de asistentes de forma rápida en la puerta.',
          icon: '📱',
          badge: 'Check-in',
        },
        {
          title: 'Agenda y programación',
          desc: 'Visualiza actividades, talleres, ponencias y horarios actualizados minuto a minuto.',
          icon: '📅',
          badge: 'Timeline',
        },
        {
          title: 'Gestión de presupuestos y tareas',
          desc: 'Integra control de gastos, listas de tareas operativas y órdenes de servicio para el equipo.',
          icon: '📋',
          badge: 'Operación',
        },
      ],
    },
    {
      category: 'Comunicación e Interacción',
      features: [
        {
          title: 'Notificaciones push',
          desc: 'Envía avisos importantes o cambios de última hora directamente al dispositivo del asistente.',
          icon: '🔔',
          badge: 'En vivo',
        },
        {
          title: 'Espacios de networking',
          desc: 'Facilita chats y conexiones directas entre los participantes para enriquecer su experiencia.',
          icon: '💬',
          badge: 'Social',
        },
        {
          title: 'Encuestas en directo',
          desc: 'Realiza votaciones interactivas y recopila opiniones en tiempo real durante las sesiones.',
          icon: '📊',
          badge: 'Feedback',
        },
      ],
    },
    {
      category: 'Análisis y Reportes',
      features: [
        {
          title: 'Métricas de asistencia',
          desc: 'Recopila datos sobre la concurrencia a cada actividad y el flujo general en el recinto.',
          icon: '📈',
          badge: 'Analytics',
        },
        {
          title: 'Informes de rendimiento',
          desc: 'Evalúa el retorno de inversión (ROI) contrastando el presupuesto estimado con el gasto real.',
          icon: '📑',
          badge: 'Finanzas',
        },
      ],
    },
  ];

  return (
    <section className="mt-16 border-t border-white/10 pt-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-200">
          Suite Completa
        </span>
        <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
          Capacidades y Herramientas del Gestor
        </h2>
        <p className="mt-2 text-sm text-white/55">
          Control logístico, interacción con los asistentes y métricas financieras en una sola plataforma.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.category}
            className="border-b border-white/[0.08] py-6 last:border-b-0"
          >
            <h3 className="mb-5 flex items-center gap-2 text-base font-black text-white sm:text-lg">
              <span className="size-2.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
              {section.category}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.features.map((feat) => (
                <div
                  key={feat.title}
                  className="group flex flex-col justify-between rounded-xl border border-white/[0.09] bg-white/[0.035] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-white/[0.06]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-xl border border-violet-300/10 bg-violet-300/10 p-2.5 text-2xl transition-transform group-hover:scale-105">
                        {feat.icon}
                      </span>
                      <span className="rounded-md border border-cyan-200/10 bg-cyan-200/[0.06] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-cyan-100/80">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-white/90">{feat.title}</h4>
                    <p className="text-xs leading-relaxed text-white/50">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}






