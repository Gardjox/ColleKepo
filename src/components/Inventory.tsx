import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Image as ImageIcon,
    Loader2,
    DollarSign,
    Calendar,
    ChevronDown,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    X,
    Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import type { InventoryItem, ProductType } from '../types';
import { POKEMON_SERIES } from '../data/pokemonSets';
import AddItemModal from './AddItemModal';

type SortOption = 'created_at' | 'purchase_newest' | 'purchase_oldest' | 'sold_newest' | 'sold_oldest' | 'price_high' | 'price_low';

const Inventory: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState<ProductType | 'Tous'>('Tous');
    const [activeStatus, setActiveStatus] = useState<'Tous' | 'En Stock' | 'Vendu'>('Tous');
    const [sortBy, setSortBy] = useState<SortOption>('created_at');
    const [showFilters, setShowFilters] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [zoomItem, setZoomItem] = useState<InventoryItem | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedItems: InventoryItem[] = (data || []).map((dbItem: any) => ({
                id: dbItem.id,
                name: dbItem.name,
                type: dbItem.type as any,
                purchasePrice: dbItem.purchase_price,
                potentialResalePrice: dbItem.potential_resale_price,
                purchaseLocation: dbItem.purchase_location,
                purchaseDate: dbItem.purchase_date,
                details: dbItem.details,
                isSold: dbItem.is_sold,
                soldPrice: dbItem.sold_price,
                soldDate: dbItem.sold_date,
                photoUrl: dbItem.photo_url,
                series: dbItem.series,
                subSeries: dbItem.sub_series,
                language: dbItem.language,
                lotId: dbItem.lot_id,
                createdAt: new Date(dbItem.created_at).getTime()
            }));

            setItems(mappedItems);
        } catch (error: any) {
            console.error('Erreur lors du chargement des articles:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleOpenModal = (item: InventoryItem | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = async (newItem: any, file: File | null) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let photoUrl = editingItem?.photoUrl || '';

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('items')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('items')
                    .getPublicUrl(filePath);

                photoUrl = publicUrl;
            }

            const itemData = {
                name: newItem.name,
                type: newItem.type,
                series: newItem.series || null,
                sub_series: newItem.subSeries || null,
                language: newItem.language || null,
                purchase_price: parseFloat(newItem.purchasePrice) || 0,
                potential_resale_price: parseFloat(newItem.potentialResalePrice) || 0,
                purchase_location: newItem.purchaseLocation,
                purchase_date: newItem.purchaseDate,
                details: newItem.details,
                photo_url: photoUrl,
                user_id: user.id,
            };

            if (editingItem) {
                const { error } = await supabase
                    .from('items')
                    .update(itemData)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('items')
                    .insert([{ ...itemData, is_sold: false }]);
                if (error) throw error;
            }

            handleCloseModal();
            fetchItems();
        } catch (error: any) {
            alert('Erreur lors de la sauvegarde : ' + error.message);
        }
    };

    const handleMarkAsSold = async (id: string) => {
        const soldPrice = prompt('Quel est le prix de vente final (€) ?');
        if (soldPrice === null || isNaN(parseFloat(soldPrice))) return;

        const today = new Date().toISOString().split('T')[0];

        try {
            const { error } = await supabase
                .from('items')
                .update({
                    is_sold: true,
                    sold_price: parseFloat(soldPrice),
                    sold_date: today
                })
                .eq('id', id);

            if (error) throw error;
            fetchItems();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cet article ?')) return;
        try {
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchItems();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const filteredItems = items
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.purchaseLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesType = activeType === 'Tous' || item.type === activeType;
            const matchesStatus = activeStatus === 'Tous' ||
                (activeStatus === 'En Stock' && !item.isSold) ||
                (activeStatus === 'Vendu' && item.isSold);

            return matchesSearch && matchesType && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'created_at') return b.createdAt - a.createdAt;
            if (sortBy === 'purchase_newest') {
                const dateA = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0;
                const dateB = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0;
                return dateB - dateA;
            }
            if (sortBy === 'purchase_oldest') {
                const dateA = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 9999999999999;
                const dateB = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 9999999999999;
                return dateA - dateB;
            }
            if (sortBy === 'sold_newest') {
                const dateA = a.soldDate ? new Date(a.soldDate).getTime() : 0;
                const dateB = b.soldDate ? new Date(b.soldDate).getTime() : 0;
                return dateB - dateA;
            }
            if (sortBy === 'sold_oldest') {
                const dateA = a.soldDate ? new Date(a.soldDate).getTime() : 9999999999999;
                const dateB = b.soldDate ? new Date(b.soldDate).getTime() : 9999999999999;
                return dateA - dateB;
            }
            if (sortBy === 'price_high') return b.purchasePrice - a.purchasePrice;
            if (sortBy === 'price_low') return a.purchasePrice - b.purchasePrice;
            return 0;
        });

    const types: (ProductType | 'Tous')[] = ['Tous', 'Carte', 'Scellé', 'Carte Gradée', 'Objet'];
    const statuses: ('Tous' | 'En Stock' | 'Vendu')[] = ['Tous', 'En Stock', 'Vendu'];
    const sortOptions: { value: SortOption, label: string }[] = [
        { value: 'created_at', label: 'Plus récent (ajouté)' },
        { value: 'purchase_newest', label: 'Achat : Nouveau → Ancien' },
        { value: 'purchase_oldest', label: 'Achat : Ancien → Nouveau' },
        { value: 'sold_newest', label: 'Vente : Nouveau → Ancien' },
        { value: 'sold_oldest', label: 'Vente : Ancien → Nouveau' },
        { value: 'price_high', label: 'Prix : Décroissant' },
        { value: 'price_low', label: 'Prix : Croissant' },
    ];

    return (
        <div className="space-y-6">
            {/* Image Zoom Overlay/Lightbox with Framer Motion */}
            <AnimatePresence>
                {zoomItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 cursor-zoom-out"
                        onClick={() => setZoomItem(null)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/10"
                            onClick={() => setZoomItem(null)}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>
                        <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
                            <motion.img
                                layoutId={`img-${zoomItem.id}`}
                                src={zoomItem.photoUrl}
                                alt={zoomItem.name}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                className="w-full h-full object-contain rounded-2xl shadow-2xl"
                                style={{ borderRadius: '1.5rem' }}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-4 text-center"
                            >
                                <p className="text-white text-lg font-black mb-1">{zoomItem.name}</p>
                                <p className="text-white/50 text-[10px] uppercase font-black tracking-[0.2em]">Cliquez n'importe où pour fermer</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou lieu..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 border rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                                showFilters || activeType !== 'Tous' || activeStatus !== 'Tous' || sortBy !== 'created_at'
                                    ? "bg-teal-50 border-teal-200 text-teal-600 shadow-sm shadow-teal-50"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            {activeType !== 'Tous' || activeStatus !== 'Tous' || sortBy !== 'created_at' ? 'Filtres actifs' : 'Filtres'}
                            <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
                        </button>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-teal-700 shadow-md shadow-teal-100 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="premium-card p-6 animate-in fade-in slide-in-from-top-2 duration-200 bg-white/90 backdrop-blur-md border-teal-100/50 shadow-xl shadow-slate-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Category Filter */}
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                    Catégorie
                                    {activeType !== 'Tous' && (
                                        <button onClick={() => setActiveType('Tous')} className="text-teal-500 hover:text-teal-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                            Reset <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {types.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setActiveType(type)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                activeType === type
                                                    ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-100"
                                                    : "bg-white border-slate-100 text-slate-500 hover:border-teal-200 hover:text-teal-600"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                    Statut marchand
                                    {activeStatus !== 'Tous' && (
                                        <button onClick={() => setActiveStatus('Tous')} className="text-teal-500 hover:text-teal-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                            Reset <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {statuses.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setActiveStatus(status)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                activeStatus === status
                                                    ? "bg-slate-800 border-slate-800 text-white shadow-md shadow-slate-200"
                                                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                                            )}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                    Trier par date / prix
                                    <ArrowUpDown className="w-3 h-3 text-slate-300" />
                                </h5>
                                <select
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                >
                                    {sortOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AddItemModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveItem}
                initialData={editingItem}
            />

            <div className="premium-card overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-teal-500" />
                            <p className="text-sm font-medium tracking-tight">Analyse de vos données...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                                {searchTerm || activeType !== 'Tous' || activeStatus !== 'Tous' ? <Filter className="w-6 h-6 text-slate-300" /> : <Plus className="w-6 h-6 text-slate-300" />}
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">
                                {searchTerm || activeType !== 'Tous' || activeStatus !== 'Tous'
                                    ? "Aucun résultat pour ces filtres"
                                    : "Votre collection est vide"}
                            </p>
                            {(searchTerm || activeType !== 'Tous' || activeStatus !== 'Tous' || sortBy !== 'created_at') && (
                                <button
                                    onClick={() => { setSearchTerm(''); setActiveType('Tous'); setActiveStatus('Tous'); setSortBy('created_at'); }}
                                    className="mt-4 text-[10px] font-black uppercase tracking-widest text-teal-600 hover:underline"
                                >
                                    Effacer tout
                                </button>
                            )}
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Article</th>
                                    <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            Achat
                                            {sortBy.startsWith('purchase') && (sortBy === 'purchase_newest' ? <ArrowDown className="w-2.5 h-2.5 text-teal-500" /> : <ArrowUp className="w-2.5 h-2.5 text-teal-500" />)}
                                        </div>
                                    </th>
                                    <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Potentiel</th>
                                    <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            Statut
                                            {sortBy.startsWith('sold') && (sortBy === 'sold_newest' ? <ArrowDown className="w-2.5 h-2.5 text-emerald-500" /> : <ArrowUp className="w-2.5 h-2.5 text-emerald-500" />)}
                                        </div>
                                    </th>
                                    <th className="px-3 sm:px-6 py-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-white transition-colors group">
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div
                                                    className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden shadow-sm cursor-zoom-in group/img relative"
                                                    onClick={() => item.photoUrl && setZoomItem(item)}
                                                >
                                                    {item.photoUrl ? (
                                                        <>
                                                            <motion.img
                                                                layoutId={`img-${item.id}`}
                                                                src={item.photoUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                                                                <Maximize2 className="text-white w-4 h-4 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <ImageIcon className="text-slate-200 w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm font-black text-slate-800 leading-tight mb-1 truncate max-w-[100px] sm:max-w-none">{item.name}</p>
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded-md text-[7px] sm:text-[8px] font-black uppercase tracking-widest",
                                                            item.type === 'Carte' && "bg-blue-50 text-blue-600",
                                                            item.type === 'Scellé' && "bg-purple-50 text-purple-600",
                                                            item.type === 'Carte Gradée' && "bg-amber-50 text-amber-600",
                                                            item.type === 'Objet' && "bg-slate-100 text-slate-600"
                                                        )}>
                                                            {item.type}
                                                        </span>
                                                        {item.type === 'Carte' && item.subSeries && (
                                                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
                                                                {(() => {
                                                                    const series = POKEMON_SERIES.find(s => s.id === item.series);
                                                                    const set = series?.sets.find(s => s.id === item.subSeries);
                                                                    if (!set) return item.subSeries;
                                                                    return isMobile ? set.shortName : set.name;
                                                                })()}
                                                            </span>
                                                        )}
                                                        {item.type === 'Carte' && item.language && (
                                                            <span className="text-[10px] sm:text-xs" title={`Langue: ${item.language}`}>
                                                                {item.language === 'FR' ? '🇫🇷' : item.language === 'JAP' ? '🇯🇵' : item.language === 'EN' ? '🇺🇸' : item.language}
                                                            </span>
                                                        )}
                                                        {item.purchaseLocation && (
                                                            <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[60px] sm:max-w-[80px]">{item.purchaseLocation}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs sm:text-sm font-black text-slate-700">{Number(item.purchasePrice).toFixed(2)}€</span>
                                                <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                                    <Calendar className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
                                                    {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-black text-emerald-600 font-mono text-right">
                                            {Number(item.potentialResalePrice).toFixed(2)}€
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center">
                                            {item.isSold ? (
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-[9px] sm:text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-emerald-100 shadow-sm shadow-emerald-50">+{item.soldPrice?.toFixed(2)}€</span>
                                                </div>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1.5 text-teal-600 text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-teal-50/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-teal-100/50">
                                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                                    Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!item.isSold && (
                                                    <button
                                                        onClick={() => handleMarkAsSold(item.id)}
                                                        className="p-1.5 sm:p-2 text-teal-600 hover:bg-teal-50 rounded-lg sm:rounded-xl transition-all"
                                                        title="Vendu"
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg sm:rounded-xl transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
