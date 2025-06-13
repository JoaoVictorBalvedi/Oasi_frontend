// src/app/comunidade/page.tsx
'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import SectionTitle from '../components/SectionTitle';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ComunidadePage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<any | null>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [mensagemLoading, setMensagemLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAddEvento, setShowAddEvento] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ nome: '', data: '', hora: '', local: '', descricao: '' });
  const [addLoading, setAddLoading] = useState(false);

  // Buscar eventos ao carregar
  useEffect(() => {
    fetch('http://localhost:3001/api/eventos')
      .then(res => res.json())
      .then(setEventos);
    // Buscar usuário logado (ajuste para seu contexto de auth se necessário)
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  // Buscar mensagens do evento selecionado
  useEffect(() => {
    if (!selectedEvento) return;
    setChatLoading(true);
    fetch(`http://localhost:3001/api/eventos/${selectedEvento.id}/mensagens`)
      .then(res => res.json())
      .then(setMensagens)
      .finally(() => setChatLoading(false));
  }, [selectedEvento]);

  // Enviar nova mensagem
  async function handleEnviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !novaMensagem.trim() || !selectedEvento) return;
    setMensagemLoading(true);
    await fetch(`http://localhost:3001/api/eventos/${selectedEvento.id}/mensagens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: user.id, texto: novaMensagem })
    });
    setNovaMensagem('');
    // Atualiza mensagens
    const msgs = await fetch(`http://localhost:3001/api/eventos/${selectedEvento.id}/mensagens`).then(r => r.json());
    setMensagens(msgs);
    setMensagemLoading(false);
  }

  async function handleAddEvento(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    // Junta data e hora para o formato DATETIME
    const dataHora = novoEvento.data && novoEvento.hora ? `${novoEvento.data} ${novoEvento.hora}` : novoEvento.data;
    await fetch('http://localhost:3001/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...novoEvento, data: dataHora })
    });
    setShowAddEvento(false);
    setNovoEvento({ nome: '', data: '', hora: '', local: '', descricao: '' });
    // Atualiza lista
    const evs = await fetch('http://localhost:3001/api/eventos').then(r => r.json());
    setEventos(evs);
    setAddLoading(false);
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-2 sm:px-4 py-6 flex flex-col lg:flex-row gap-6 min-h-[70vh]">
        {/* Sidebar de eventos */}
        <div className="w-full lg:max-w-xs flex-shrink-0">
          <SectionTitle className="mb-4">Eventos</SectionTitle>
          <div className="bg-gray-800 rounded-lg p-2 space-y-2 h-64 lg:h-[60vh] overflow-y-auto">
            {eventos.length === 0 ? (
              <div className="text-gray-400 text-center my-8">
                Nenhum evento cadastrado ainda.<br />
                <button onClick={() => setShowAddEvento(true)} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition">Adicionar Evento</button>
              </div>
            ) : (
              eventos.map(ev => (
                <div
                  key={ev.id}
                  className={`p-3 rounded cursor-pointer transition flex flex-col border ${selectedEvento?.id === ev.id ? 'bg-green-900/40 border-green-500 text-green-300' : 'hover:bg-gray-700 border-transparent text-gray-200'}`}
                  onClick={() => setSelectedEvento(ev)}
                >
                  <span className="font-bold">{ev.nome}</span>
                  <span className="text-xs text-gray-400">{new Date(ev.data).toLocaleDateString('pt-BR')}</span>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Centro: chat do evento selecionado */}
        <div className="flex-1 min-w-0 flex flex-col">
          <SectionTitle className="mb-4">Comunidade Oasi</SectionTitle>
          {!selectedEvento ? (
            <div className="text-gray-400 text-center mt-12 lg:mt-24">Selecione um evento para ver detalhes e participar do chat.</div>
          ) : (
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-8 w-full relative flex flex-col h-full">
              {/* Chat do evento */}
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 max-h-64 sm:max-h-72 overflow-y-auto mb-4 flex-1">
                {chatLoading ? (
                  <div className="text-gray-400">Carregando mensagens...</div>
                ) : (
                  <div className="space-y-3">
                    {mensagens.length === 0 && <div className="text-gray-500">Nenhuma mensagem ainda.</div>}
                    {mensagens.map((m: any) => (
                      <div key={m.id} className="flex flex-col">
                        <span className="text-green-400 font-semibold text-sm">{m.usuario_nome || 'Usuário'}</span>
                        <span className="text-gray-300 text-sm break-words">{m.texto}</span>
                        <span className="text-xs text-gray-500">{new Date(m.data).toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Formulário de mensagem */}
              {user ? (
                <form onSubmit={handleEnviarMensagem} className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="text"
                    className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={e => setNovaMensagem(e.target.value)}
                    disabled={mensagemLoading}
                    maxLength={300}
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                    disabled={mensagemLoading || !novaMensagem.trim()}
                  >
                    {mensagemLoading ? 'Enviando...' : 'Enviar'}
                  </button>
                </form>
              ) : (
                <div className="text-gray-400 mt-2">Faça login para participar do chat.</div>
              )}
            </div>
          )}
        </div>
        {/* Sidebar direita: detalhes do evento e botão criar evento */}
        <div className="w-full lg:max-w-xs flex-shrink-0 mt-8 lg:mt-0">
          <div className="flex flex-col gap-4">
            <button onClick={() => setShowAddEvento(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition mb-2">Criar Novo Evento</button>
            {selectedEvento ? (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-400 mb-2">Detalhes do Evento</h3>
                <div className="mb-1"><span className="font-semibold text-gray-300">Nome:</span> {selectedEvento.nome}</div>
                <div className="mb-1"><span className="font-semibold text-gray-300">Data:</span> {new Date(selectedEvento.data).toLocaleString('pt-BR')}</div>
                <div className="mb-1"><span className="font-semibold text-gray-300">Local:</span> {selectedEvento.local}</div>
                <div className="mb-1"><span className="font-semibold text-gray-300">Descrição:</span> <span className="text-gray-400">{selectedEvento.descricao}</span></div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-4 text-gray-400 text-center">Selecione um evento para ver detalhes.</div>
            )}
          </div>
        </div>
        {/* Modal de adicionar evento */}
        {showAddEvento && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl" onClick={() => setShowAddEvento(false)}>&times;</button>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Adicionar Evento</h2>
              <form onSubmit={handleAddEvento} className="space-y-4">
                <input type="text" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" placeholder="Nome do evento" required value={novoEvento.nome} onChange={e => setNovoEvento({ ...novoEvento, nome: e.target.value })} />
                <div className="flex gap-2">
                  <input type="date" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" required value={novoEvento.data} onChange={e => setNovoEvento({ ...novoEvento, data: e.target.value })} />
                  <input type="time" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" required value={novoEvento.hora} onChange={e => setNovoEvento({ ...novoEvento, hora: e.target.value })} />
                </div>
                <input type="text" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" placeholder="Local" required value={novoEvento.local} onChange={e => setNovoEvento({ ...novoEvento, local: e.target.value })} />
                <textarea className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" placeholder="Descrição" required value={novoEvento.descricao} onChange={e => setNovoEvento({ ...novoEvento, descricao: e.target.value })} />
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition w-full" disabled={addLoading}>{addLoading ? 'Adicionando...' : 'Adicionar Evento'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}