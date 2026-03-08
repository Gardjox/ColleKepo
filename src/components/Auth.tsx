import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Chrome, ArrowRight, Github } from 'lucide-react';

const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Vérifiez votre email pour confirmer l\'inscription !');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
                            <Github className="text-white w-8 h-8" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
                        {isSignUp ? "Créer un compte" : "Bon retour parmi nous !"}
                    </h2>
                    <p className="text-center text-slate-500 text-sm mb-8">
                        Gérez votre collection Pokémon facilement.
                    </p>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="email"
                                    placeholder="exemple@pokemon.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 shadow-md shadow-teal-100 transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
                        >
                            {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="relative my-8 text-center text-xs">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <span className="relative px-4 bg-white text-slate-400 uppercase tracking-widest">Ou continuer avec</span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]"
                    >
                        <Chrome className="w-5 h-5" />
                        Google
                    </button>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        {isSignUp ? "Déjà un compte ?" : "Nouveau ici ?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-teal-600 font-bold hover:underline"
                        >
                            {isSignUp ? "Se connecter" : "Créer un compte"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
