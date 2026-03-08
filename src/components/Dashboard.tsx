import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertCircle, CheckCircle2, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
    totalArticles: number;
    realProfit: number;
    potentialProfit: number;
    soldCount: number;
    recentActivities: any[];
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalArticles: 0,
        realProfit: 0,
        potentialProfit: 0,
        soldCount: 0,
        recentActivities: []
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Récupérer tous les articles
            const { data: items, error: itemsError } = await supabase
                .from('items')
                .select('*')
                .order('created_at', { ascending: false });

            if (itemsError) throw itemsError;

            // 2. Calculer les statistiques
            let realProfit = 0;
            let potentialProfit = 0;
            let soldCount = 0;

            (items || []).forEach(item => {
                if (item.is_sold) {
                    soldCount++;
                    realProfit += (item.sold_price || 0) - (item.purchase_price || 0);
                } else {
                    potentialProfit += (item.potential_resale_price || 0) - (item.purchase_price || 0);
                }
            });

            setStats({
                totalArticles: items?.length || 0,
                realProfit,
                potentialProfit,
                soldCount,
                recentActivities: (items || []).slice(0, 3)
            });
        } catch (error: any) {
            console.error('Erreur dashboard:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: 'Total Articles',
            value: stats.totalArticles,
            unit: '',
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            description: 'En collection'
        },
        {
            title: 'Rentabilité Réelle',
            value: stats.realProfit.toFixed(2),
            unit: '€',
            icon: TrendingUp,
            color: stats.realProfit >= 0 ? 'text-emerald-600' : 'text-red-600',
            bg: stats.realProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50',
            description: 'Sur les ventes'
        },
        {
            title: 'Plus-value Latente',
            value: stats.potentialProfit.toFixed(2),
            unit: '€',
            icon: AlertCircle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            description: 'Estimation stock'
        },
        {
            title: 'Articles Vendus',
            value: stats.soldCount,
            unit: '',
            icon: CheckCircle2,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            description: 'Cycle terminé'
        },
    ];

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-600" />
                <p className="font-bold text-sm uppercase tracking-widest">Analyse de vos données...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="premium-card p-6 flex items-start justify-between group hover:border-teal-100 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                        <div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70">{stat.title}</p>
                            <h3 className="text-2xl font-black text-slate-800">
                                {stat.value}{stat.unit}
                            </h3>
                            <div className="flex items-center gap-1 mt-2">
                                {typeof stat.value === 'string' && parseFloat(stat.value) >= 0 ?
                                    <ArrowUpRight className="w-3 h-3 text-emerald-500" /> :
                                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                                }
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.description}</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* Dernières Activités */}
                <div className="lg:col-span-2 premium-card overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                        <h4 className="text-lg font-black text-slate-800 tracking-tight">Dernières Activités</h4>
                        <button className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-all border border-teal-100">
                            Voir Tout
                        </button>
                    </div>

                    <div className="p-2">
                        {stats.recentActivities.length === 0 ? (
                            <div className="py-20 text-center text-slate-400">
                                <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-widest">Aucune activité</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {stats.recentActivities.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                        <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden shrink-0">
                                            {item.photo_url ? (
                                                <img src={item.photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-800 truncate mb-0.5">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                {item.purchase_location || 'Lieu inconnu'} • {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-800">{item.purchase_price.toFixed(2)}€</p>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.is_sold ? 'bg-slate-100 text-slate-500' : 'bg-teal-50 text-teal-600'
                                                }`}>
                                                {item.is_sold ? 'Vendu' : 'En Stock'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Score de Rentabilité */}
                <div className="premium-card p-6 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-teal-50 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700" />

                    <div>
                        <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Score de Stock</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Performance Globale</p>

                        <div className="relative flex items-center justify-center py-4">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle
                                    className="text-slate-100"
                                    strokeWidth="12"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                />
                                <circle
                                    className="text-teal-500"
                                    strokeWidth="12"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * Math.min(stats.totalArticles / 50, 1))}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-black text-slate-800">{stats.totalArticles}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Cartes</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-6">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ratio Ventes</span>
                            <span className="text-xs font-black text-slate-800">
                                {stats.totalArticles > 0 ? ((stats.soldCount / stats.totalArticles) * 100).toFixed(0) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-teal-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${stats.totalArticles > 0 ? (stats.soldCount / stats.totalArticles) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
