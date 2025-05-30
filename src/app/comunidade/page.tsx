// src/app/comunidade/page.tsx
import SectionTitle from "../components/SectionTitle"; // Ajuste o caminho se necessário

export default function ComunidadePage() {
  // Mock data para mensagens do chat (apenas visual)
  const mockMessages = [
    { id: 1, user: "Ana L.", text: "Adorei os novos produtos sustentáveis! Chegaram super rápido.", time: "10:30 AM", own: false },
    { id: 2, user: "Você", text: "Que bom que gostou, Ana! Estamos sempre buscando o melhor.", time: "10:32 AM", own: true },
    { id: 3, user: "Carlos P.", text: "Alguém sabe se a loja física abre aos sábados?", time: "11:15 AM", own: false },
  ];

  // Mock data para eventos (apenas visual)
  const mockEvents = [
    { id: 1, name: "Workshop de Compostagem", date: "15/06", imageUrl: "/images/event-placeholder-1.jpg" },
    { id: 2, name: "Feira de Produtos Orgânicos", date: "22/06", imageUrl: "/images/event-placeholder-2.jpg" },
  ];
  // CRIE as imagens placeholder em public/images/ (ex: event-placeholder-1.jpg)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <SectionTitle>Comunidade Oasi</SectionTitle>

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {/* Coluna Principal: Chat */}
        <div className="flex-grow md:w-2/3 bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-green-400 mb-4">Espaço Cliente/Vendedor</h2>

          {/* Área de Mensagens */}
          <div className="space-y-4 h-96 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.own ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    msg.own
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  {!msg.own && <p className="text-xs text-green-300 font-semibold">{msg.user}</p>}
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.own ? 'text-green-200' : 'text-gray-400'} text-right`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de Mensagem (não funcional) */}
          <div className="mt-auto">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              disabled // Desabilitado pois não é funcional
            />
            <button
              className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              disabled // Desabilitado
            >
              Enviar
            </button>
          </div>
        </div>

        {/* Barra Lateral: Eventos */}
        <aside className="md:w-1/3 bg-gray-800 p-6 rounded-lg shadow-xl h-fit">
          <h2 className="text-xl font-semibold text-green-400 mb-4">Eventos</h2>
          <div className="space-y-4">
            {mockEvents.map(event => (
              <div key={event.id} className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3 hover:bg-gray-600 transition-colors">
                {/* Idealmente, usar next/image aqui se as imagens forem locais */}
                <img src={event.imageUrl} alt={event.name} className="w-16 h-16 rounded object-cover" />
                <div>
                  <h3 className="font-semibold text-white">{event.name}</h3>
                  <p className="text-sm text-gray-300">{event.date}</p>
                </div>
              </div>
            ))}
            {mockEvents.length === 0 && (
                <p className="text-gray-400">Nenhum evento programado.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}