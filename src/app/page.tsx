import ViewManager from './components/ViewManager';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <ViewManager />
      </div>
    </main>
  );
}