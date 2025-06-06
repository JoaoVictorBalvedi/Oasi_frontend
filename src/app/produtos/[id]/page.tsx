"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

  if (loading) return <div className="text-center py-10">Carregando...</div>;
  if (!product) return <div className="text-center py-10 text-red-500">Produto não encontrado.</div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
        <Image
          src={product.imagem_url}
          alt={product.nome}
          width={350}
          height={350}
          className="rounded-lg mb-6"
          style={{ objectFit: "cover" }}
        />
        <h1 className="text-2xl font-bold text-white mb-2">{product.nome}</h1>
        <p className="text-lg text-green-400 font-semibold mb-2">R$ {product.preco.toFixed(2)}</p>
        {product.nivel_sustentabilidade && (
          <p className="text-yellow-300 mb-2">Sustentabilidade: {product.nivel_sustentabilidade} / 5</p>
        )}
        <p className="text-gray-300 mb-4">{product.descricao}</p>
        <Button variant="primary" size="md">Adicionar ao Carrinho</Button>
      </div>
    </div>
  );
} 