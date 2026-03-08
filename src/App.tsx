import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import BulkLots from './components/BulkLots';
import Auth from './components/Auth';
import { Settings } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
            Pour que l'application fonctionne, vous devez ajouter vos clés Supabase dans un fichier <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-600 font-mono">.env.local</code> à la racine du projet.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 text-left mb-6 overflow-x-auto">
            <code className="text-[11px] text-teal-400 block whitespace-pre">
              VITE_SUPABASE_URL=https://votre-id.supabase.co<br />
              VITE_SUPABASE_ANON_KEY=votre-cle-api-ici
            </code>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Une fois le fichier créé, redémarrez le terminal avec <code className="bg-slate-50 px-1 rounded">npm run dev</code>.
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
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && "Tableau de Bord"}
              {activeTab === 'inventory' && "Gestion de Stock"}
              {activeTab === 'lots' && "Achats en Volume"}
              {activeTab === 'profit' && "Analyse de Rentabilité"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Bienvenue, {session.user.email}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full border border-slate-100 shadow-sm overflow-hidden">
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
              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <section className="flex-1">
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'lots' && <BulkLots />}
        </section>
      </main>
    </div>
  );
}

export default App;
