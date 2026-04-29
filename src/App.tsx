import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import BulkLots from './components/BulkLots';
import Auth from './components/Auth';
import { Settings, Menu, LogOut } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setSession(session);
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="text-amber-600 w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-4">Configuration Requise</h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Pour que l'application fonctionne, vous devez ajouter vos clés Supabase dans les variables d'environnement de votre plateforme de déploiement (Vercel/Netlify).
          </p>
          <div className="bg-slate-900 rounded-xl p-4 text-left mb-6 overflow-x-auto">
            <code className="text-[11px] text-teal-400 block whitespace-pre">
              VITE_SUPABASE_URL=votre-url-ici<br />
              VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-ici
            </code>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Consultez le guide de déploiement pour plus d'informations.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative overflow-x-hidden">
      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="flex justify-between items-center p-4 sm:p-6 lg:p-8 bg-white/50 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 lg:bg-transparent lg:border-none lg:p-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 lg:hidden bg-white rounded-xl border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                {activeTab === 'dashboard' && "Tableau de Bord"}
                {activeTab === 'inventory' && "Gestion de Stock"}
                {activeTab === 'lots' && "Achats en Volume"}
                {activeTab === 'perso' && "Collection Perso"}
              </h2>
              <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5 truncate max-w-[150px] sm:max-w-none">
                Bienvenue, {session.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white p-2 rounded-full border border-slate-100 shadow-sm overflow-hidden">
              {session.user.user_metadata?.avatar_url ? (
                <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold">
                  {session.user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-[10px] sm:text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-white sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg border border-slate-200 sm:border-none"
            >
              <LogOut className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        <section className="flex-1 p-4 sm:p-6 lg:p-8 pt-0">
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'lots' && <BulkLots />}
          {activeTab === 'perso' && <Inventory isPersonal={true} />}
        </section>
      </main>
    </div>
  );
}

export default App;
