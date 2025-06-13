'use client';

import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import dynamic from 'next/dynamic';

// Importação dinâmica dos componentes
const Home = dynamic(() => import('../views/Home'), { ssr: false });
const Produtos = dynamic(() => import('../views/Produtos'), { ssr: false });
const Comunidade = dynamic(() => import('../views/Comunidade'), { ssr: false });
const Vender = dynamic(() => import('../views/Vender'), { ssr: false });
const Carrinhos = dynamic(() => import('../views/Carrinhos'), { ssr: false });
const Conta = dynamic(() => import('../views/Conta'), { ssr: false });
const Login = dynamic(() => import('../views/Login'), { ssr: false });
const ProdutoDetalhe = dynamic(() => import('../views/ProdutoDetalhe'), { ssr: false });

const ViewManager = () => {
  const { currentView } = useNavigation();
  const { user } = useAuth();

  // Páginas protegidas que requerem autenticação
  const protectedViews = ['comunidade', 'vender', 'carrinhos', 'conta'];

  // Se tentar acessar uma página protegida sem estar logado, redireciona para login
  if (protectedViews.includes(currentView) && !user) {
    return <Login />;
  }

  // Renderiza a view apropriada baseado no estado atual
  switch (currentView) {
    case 'home':
      return <Home />;
    case 'produtos':
      return <Produtos />;
    case 'comunidade':
      return <Comunidade />;
    case 'vender':
      return <Vender />;
    case 'carrinhos':
      return <Carrinhos />;
    case 'conta':
      return <Conta />;
    case 'login':
      return <Login />;
    case 'produto-detalhe':
      return <ProdutoDetalhe />;
    default:
      return <Home />;
  }
};

export default ViewManager; 