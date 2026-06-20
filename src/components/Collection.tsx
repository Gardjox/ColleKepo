import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Inventory from './Inventory';
import { Package, Sparkles, Wallet, ChevronRight } from 'lucide-react';
import type { ProductType } from '../types';

interface CollectionStats {
    itemCount: number;
    totalPurchaseValue: number;
    totalResaleValue: number;
}

const Collection: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<ProductType | 'Tous' | null>(null);
    const [stats, setStats] = useState<CollectionStats>({
        itemCount: 0,
        totalPurchaseValue: 0,
        totalResaleValue: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchCollectionStats = async () => {
        setLoadingStats(true);
        try {
            const { data, error } = await supabase
                .from('items')
                .select('purchase_price, potential_resale_price')
                .eq('is_personal', true);

            if (error) throw error;

            let count = 0;
            let purchase = 0;
            let resale = 0;

            (data || []).forEach((item: any) => {
                count++;
                purchase += Number(item.purchase_price) || 0;
                resale += Number(item.potential_resale_price) || 0;
            });

            setStats({
                itemCount: count,
                totalPurchaseValue: purchase,
                totalResaleValue: resale
            });
        } catch (err) {
            console.error('Error fetching collection stats:', err);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        if (selectedCategory === null) {
            fetchCollectionStats();
        }
    }, [selectedCategory]);

    const categories = [
        {
            id: 'Tous' as const,
            title: 'Toute la collection',
            img: '/images/ToutCollec.png',
            desc: 'Voir l\'ensemble des cartes et objets de la collection',
            color: 'from-purple-500/5 to-pink-500/5 border-purple-100 hover:border-purple-400 bg-white',
            textColor: 'text-purple-700',
            bgGlow: 'hover:shadow-purple-100/70 hover:shadow-2xl'
        },
        {
            id: 'Carte' as const,
            title: 'Cartes à l\'unité',
            img: '/images/Cartesunite.png',
            desc: 'Cartes individuelles, holographiques, secrètes, etc.',
            color: 'from-blue-500/5 to-indigo-500/5 border-blue-100 hover:border-blue-400 bg-white',
            textColor: 'text-blue-700',
            bgGlow: 'hover:shadow-blue-100/70 hover:shadow-2xl'
        },
        {
            id: 'Scellé' as const,
            title: 'Scellés',
            img: '/images/Scellé.png',
            desc: 'Coffrets, ETB, displays et boosters non ouverts',
            color: 'from-amber-500/5 to-orange-500/5 border-amber-100 hover:border-amber-400 bg-white',
            textColor: 'text-amber-700',
            bgGlow: 'hover:shadow-amber-100/70 hover:shadow-2xl'
        },
        {
            id: 'Carte Gradée' as const,
            title: 'Cartes gradées',
            img: '/images/grade.png',
            desc: 'Cartes certifiées et gradées (PSA, PCA, Beckett, etc.)',
            color: 'from-emerald-500/5 to-teal-500/5 border-emerald-100 hover:border-emerald-400 bg-white',
            textColor: 'text-emerald-700',
            bgGlow: 'hover:shadow-emerald-100/70 hover:shadow-2xl'
        }
    ];

    if (selectedCategory !== null) {
        return (
            <div className="space-y-6">
                <Inventory
                    isPersonal={true}
                    initialType={selectedCategory}
                    onBack={() => setSelectedCategory(null)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="premium-card p-4 sm:p-6 bg-white border border-slate-100 flex items-center justify-between shadow-lg shadow-slate-100/30 rounded-2xl">
                    <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nombre d'items</p>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                            {loadingStats ? '...' : stats.itemCount}
                        </h3>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-2xl">
                        <Package className="w-6 h-6 text-teal-600" />
                    </div>
                </div>

                <div className="premium-card p-4 sm:p-6 bg-white border border-slate-100 flex items-center justify-between shadow-lg shadow-slate-100/30 rounded-2xl">
                    <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Coût d'acquisition</p>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                            {loadingStats ? '...' : `${stats.totalPurchaseValue.toFixed(2)}€`}
                        </h3>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-2xl">
                        <Wallet className="w-6 h-6 text-indigo-600" />
                    </div>
                </div>

                <div className="premium-card p-4 sm:p-6 bg-white border border-slate-100 flex items-center justify-between shadow-lg shadow-slate-100/30 rounded-2xl">
                    <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Valeur estimée</p>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                            {loadingStats ? '...' : `${stats.totalResaleValue.toFixed(2)}€`}
                        </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                        <Sparkles className="w-6 h-6 text-emerald-600" />
                    </div>
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto pb-12">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-br p-6 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1 ${cat.bgGlow} ${cat.color}`}
                        style={{ height: '340px' }}
                    >
                        {/* Background subtle elements */}
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-slate-50/20 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                        {/* Title and Description */}
                        <div className="z-10 relative">
                            <span className="inline-block px-3 py-1 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm border border-slate-100">
                                Catégorie
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight mb-2 tracking-tight group-hover:text-teal-950 transition-colors">
                                {cat.title}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[70%]">
                                {cat.desc}
                            </p>
                        </div>

                        {/* Visual Image container */}
                        <div className="absolute right-4 bottom-4 w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 pointer-events-none">
                            <img
                                src={cat.img}
                                alt={cat.title}
                                className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] transition-all duration-300"
                            />
                        </div>

                        {/* Bottom action indicator */}
                        <div className="z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-800 mt-auto transition-colors">
                            <span>Ouvrir</span>
                            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Collection;
