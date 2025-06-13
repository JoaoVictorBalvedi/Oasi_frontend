"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../../components/button";

interface Product {
  id: number;
  nome: string;
  preco: number;
  nivel_sustentabilidade?: number;
  descricao?: string;
  imagem_url: string;
}

export default function ProdutoDetalhePage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/products/${id}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

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

  if (loading) return <div className="text-center py-10">Carregando...</div>;
  if (!product) return <div className="text-center py-10 text-red-500">Produto não encontrado.</div>;

  return (
    <div className="min-h-screen bg-black/95 py-8 px-2 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Debug temporário */}
        <div className="mb-4 p-2 bg-yellow-100 text-black rounded text-xs">
          <strong>DEBUG:</strong><br />
          Produto: <b>{product.nome}</b><br />
          Imagem buscada: <b>{getProductImage(product)}</b><br />
          Chaves do mapeamento:<br />
          <ul>{Object.keys(productImageMap).map((k) => <li key={k}>{k}</li>)}</ul>
        </div>
        {/* Botão de voltar */}
        <button onClick={() => router.back()} className="mb-6 flex items-center text-gray-300 hover:text-green-400 transition font-medium">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
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
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
              />
            </div>
          </div>
          {/* Infos do produto */}
          <div className="flex-1 w-full md:w-1/2 flex flex-col justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{product.nome}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-white bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-lg border border-gray-700">R$ {product.preco.toFixed(2)}</span>
            </div>
            <p className="text-gray-300 mb-4">{product.descricao}</p>
            {typeof product.nivel_sustentabilidade === 'number' && (
              <div className="mb-4 flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-6 h-6 ${i < (product.nivel_sustentabilidade ?? 0) ? 'text-yellow-400' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-yellow-300 ml-2 text-sm">Nível sustentável</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button variant="primary" size="lg" className="flex-1">Comprar</Button>
              <Button variant="secondary" size="lg" className="flex-1">Adicionar ao Carrinho</Button>
            </div>
          </div>
        </div>
        {/* Produtos similares */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Produtos Similares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Aqui você pode mapear produtos similares reais */}
            <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-lg mb-2" />
              <span className="text-white text-sm font-semibold">Produto 1</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-lg mb-2" />
              <span className="text-white text-sm font-semibold">Produto 2</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-lg mb-2" />
              <span className="text-white text-sm font-semibold">Produto 3</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-lg mb-2" />
              <span className="text-white text-sm font-semibold">Produto 4</span>
            </div>
          </div>
        </div>
        {/* Avaliações */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Avaliações</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Aqui você pode mapear avaliações reais */}
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-start">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
                <span className="text-white font-semibold">Nome Usuário</span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm">Avaliação do usuário</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-start">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
                <span className="text-white font-semibold">Nome Usuário</span>
              </div>
              <div className="flex mb-2">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm">Avaliação do usuário</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-start">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
                <span className="text-white font-semibold">Nome Usuário</span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm">Avaliação do usuário</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 