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
    <section className="mt-16 pt-12 border-t border-purple-100">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200">
          Suite Completa
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 tracking-tight">
          Capacidades y Herramientas del Gestor
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Control logístico, interacción con los asistentes y métricas financieras en una sola plataforma.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-slate-50/70 border border-purple-100/70 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <h3 className="text-base sm:text-lg font-black text-purple-950 mb-5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              {section.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.features.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-purple-300 hover:shadow-md hover:shadow-purple-900/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2.5 bg-purple-50 rounded-xl group-hover:scale-105 transition-transform">
                        {feat.icon}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{feat.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
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


