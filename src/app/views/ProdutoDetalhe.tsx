'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Button from "../components/button";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import SelectCartModal from "../components/SelectCardModal";
import Modal from '../components/Modal';

interface Product {
  id: number;
  nome: string;
  preco: number;
  nivel_sustentabilidade?: number;
  descricao?: string;
  imagem_url: string;
}

interface Cart {
  id: number;
  nome: string;
  proposito?: string | null;
}

export default function ProdutoDetalhe() {
  const { selectedProductId, setView } = useNavigation();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [userCarts, setUserCarts] = useState<Cart[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [comentarioLoading, setComentarioLoading] = useState(false);
  const comentarioInputRef = useRef<HTMLInputElement>(null);

  // Mapeamento fixo entre nome do produto e nome real do arquivo de imagem (igual homepage)
  const productImageMap: Record<string, string> = {
    'Ecobag de Algodão Orgânico': '/ecobag.png',
    'Kit Escovas de Dente de Bambu (4un)': '/escova.png',
    'Garrafa Térmica Inox Sustentável': '/garrafa.png',
    'Canudos de Inox Reutilizáveis (Kit)': '/canudo.png',
    'Vaso Auto Irrigável Pequeno': '/vaso.png',
    'Caderno Ecológico Reciclado': '/caderno.png',
    // Adicione outros produtos conforme necessário
  };

  function getProductImage(produto: Product) {
    if (productImageMap[produto.nome]) return productImageMap[produto.nome];
    return '/placeholder.png';
  }

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      if (!selectedProductId) {
        console.log('No product ID selected');
        setView('produtos');
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching product with ID:', selectedProductId);
        const url = `http://localhost:3001/api/products/${selectedProductId}`;
        console.log('API URL:', url);
        
        const res = await fetch(url);
        console.log('API Response status:', res.status);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          console.error('API Error Response:', errorData);
          throw new Error(errorData?.message || "Produto não encontrado");
        }
        
        const data = await res.json();
        console.log('Product data received:', data);
        
        if (!data || !data.id) {
          console.error('Invalid product data received:', data);
          throw new Error("Dados do produto inválidos");
        }

        // Log the price value and its type before conversion
        console.log('Price before conversion:', data.preco, 'Type:', typeof data.preco);
        
        // Ensure preco is a number
        const parsedPrice = parseFloat(data.preco);
        if (isNaN(parsedPrice)) {
          console.error('Invalid price value:', data.preco);
          throw new Error("Valor do preço inválido");
        }
        
        setProduct({
          ...data,
          preco: parsedPrice
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [selectedProductId, setView]);

  // Buscar comentários ao carregar produto
  useEffect(() => {
    async function fetchComentarios() {
      if (!product?.id) return;
      try {
        const res = await fetch(`http://localhost:3001/api/products/${product.id}/comentarios`);
        const data = await res.json();
        setComentarios(data);
      } catch (e) {
        setComentarios([]);
      }
    }
    if (product?.id) fetchComentarios();
  }, [product?.id]);

  const fetchUserCartsAndOpenModal = async () => {
    if (!user?.id) {
      setFeedbackMessage('Você precisa estar logado para adicionar produtos ao carrinho.');
      return;
    }

    setIsLoadingCarts(true);
    setFeedbackMessage(null);
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
      if (!response.ok) {
        throw new Error('Falha ao buscar seus carrinhos.');
      }
      const data = await response.json();
      setUserCarts(data);
      setIsCartModalOpen(true);
    } catch (error: any) {
      console.error("Erro ao buscar carrinhos:", error);
      setFeedbackMessage(`Erro ao buscar carrinhos: ${error.message}`);
      alert(`Erro ao buscar carrinhos: ${error.message}. Você precisa ter carrinhos para adicionar produtos.`);
    } finally {
      setIsLoadingCarts(false);
    }
  };

  const handleSelectCartAndAddProduct = async (selectedCartId: number) => {
    if (!product) return;
    
    setIsCartModalOpen(false);
    setFeedbackMessage('Adicionando ao carrinho...');

    try {
      const response = await fetch(`http://localhost:3001/api/carts/${selectedCartId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produto_id: product.id,
          quantidade: 1
        }),
      });

      const result = await response.json();
      console.log('Resposta da API:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Falha ao adicionar produto ao carrinho.');
      }
      
      // Recarrega os carrinhos após adicionar o produto
      if (user?.id) {
        const cartsResponse = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
        if (cartsResponse.ok) {
          const cartsData = await cartsResponse.json();
          setUserCarts(cartsData);
        }
      }
      
      setModalConfig({
        isOpen: true,
        title: 'Sucesso',
        message: result.message || 'Produto adicionado ao carrinho!',
        type: 'success'
      });

    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setFeedbackMessage(`Erro: ${error.message}`);
      alert(`Erro: ${error.message}`);
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Adicionar novo comentário
  async function handleAddComentario(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !comentarioTexto.trim()) return;
    setComentarioLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/products/${product?.id}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: user.id, texto: comentarioTexto })
      });
      if (!res.ok) throw new Error('Erro ao adicionar comentário');
      setComentarioTexto("");
      if (comentarioInputRef.current) comentarioInputRef.current.value = "";
      // Atualiza lista
      const updated = await fetch(`http://localhost:3001/api/products/${product?.id}/comentarios`).then(r => r.json());
      setComentarios(updated);
    } catch (e) {
      alert('Erro ao adicionar comentário');
    } finally {
      setComentarioLoading(false);
    }
  }

  if (loading) return <div className="text-center py-10">Carregando...</div>;
  if (!product) return <div className="text-center py-10 text-red-500">Produto não encontrado.</div>;

  return (
    <div className="min-h-screen bg-black/95 py-8 px-2 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Botão de voltar */}
        <button 
          onClick={() => setView('produtos')} 
          className="mb-6 flex items-center text-gray-300 hover:text-green-400 transition font-medium"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Card principal */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          {/* Imagem do produto */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-black rounded-xl border border-gray-800 p-4 w-full flex justify-center items-center">
              <Image
                src={getProductImage(product)}
                alt={product.nome}
                width={400}
                height={400}
                className="rounded-lg object-contain max-h-80 w-auto h-auto"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>

          {/* Infos do produto */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{product.nome}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-white bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-lg border border-gray-700">
                R$ {product.preco.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{product.descricao}</p>
            {typeof product.nivel_sustentabilidade === 'number' && (
              <div className="mb-4 flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-6 h-6 ${i < (product.nivel_sustentabilidade ?? 0) ? 'text-yellow-400' : 'text-gray-700'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-yellow-300 ml-2 text-sm">Nível sustentável</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button variant="primary" size="lg" className="flex-1">Comprar</Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="flex-1"
                onClick={fetchUserCartsAndOpenModal}
                disabled={isLoadingCarts}
              >
                {isLoadingCarts ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando...
                  </span>
                ) : (
                  'Adicionar ao Carrinho'
                )}
              </Button>
            </div>
            {feedbackMessage && (
              <div className="mt-4">
                <p className="text-sm text-center text-yellow-300 bg-yellow-900/20 py-2 px-3 rounded-lg">
                  {feedbackMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SelectCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onSelectCart={handleSelectCartAndAddProduct}
        productName={product.nome}
      />

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        type={modalConfig.type}
      >
        {modalConfig.message}
      </Modal>

      {/* Seção de comentários */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-white mb-4">Comentários</h2>
        {/* Formulário para adicionar comentário */}
        {user ? (
          <form onSubmit={handleAddComentario} className="flex gap-2 mb-6">
            <input
              ref={comentarioInputRef}
              type="text"
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Escreva um comentário..."
              value={comentarioTexto}
              onChange={e => setComentarioTexto(e.target.value)}
              disabled={comentarioLoading}
              maxLength={300}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-60"
              disabled={comentarioLoading || !comentarioTexto.trim()}
            >
              {comentarioLoading ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
        ) : (
          <div className="mb-6 text-gray-400">Faça login para comentar.</div>
        )}
        {/* Lista de comentários */}
        <div className="space-y-4">
          {comentarios.length === 0 && (
            <div className="text-gray-500">Nenhum comentário ainda.</div>
          )}
          {comentarios.map((c) => (
            <div key={c.id} className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-green-400">{c.usuario_nome || 'Usuário'}</span>
                <span className="text-xs text-gray-400">{new Date(c.data).toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-gray-200">{c.texto}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 