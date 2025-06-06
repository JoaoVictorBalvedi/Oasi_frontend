// src/app/comunidade/page.tsx
'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import SectionTitle from '../components/SectionTitle';

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
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <SectionTitle>Comunidade Oasi</SectionTitle>
        <div className="mt-8 grid gap-6">
          {/* Conteúdo da página de comunidade aqui */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              Bem-vindo à Comunidade Oasi!
            </h2>
            <p className="text-gray-300">
              Este é um espaço para conectar pessoas comprometidas com a sustentabilidade.
              Compartilhe experiências, aprenda com outros membros e faça parte desta
              comunidade em crescimento.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}