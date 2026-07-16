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
    Maximize2,
    LayoutGrid,
    List,
    ChevronLeft,
    QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import type { InventoryItem, ProductType } from '../types';
import { POKEMON_SERIES } from '../data/pokemonSets';
import AddItemModal from './AddItemModal';

type SortOption = 'created_at' | 'purchase_newest' | 'purchase_oldest' | 'sold_newest' | 'sold_oldest' | 'price_high' | 'price_low';

interface InventoryProps {
    isPersonal?: boolean;
    initialType?: ProductType | 'Tous';
    onBack?: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ isPersonal = false, initialType = 'Tous', onBack }) => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState<ProductType | 'Tous'>(initialType);
    const [activeStatus, setActiveStatus] = useState<'Tous' | 'En Stock' | 'Vendu'>('Tous');
    const [sortBy, setSortBy] = useState<SortOption>('created_at');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setActiveType(initialType);
    }, [initialType]);
    
    const [viewMode, setViewMode] = useState<'list' | 'gallery'>(() => {
        return (localStorage.getItem('inventoryViewMode') as 'list' | 'gallery') || 'list';
    });

    useEffect(() => {
        localStorage.setItem('inventoryViewMode', viewMode);
    }, [viewMode]);
    
    // Nouveaux filtres Spécial Cartes
    const [filterLanguage, setFilterLanguage] = useState<string>('Tous');
    const [filterCondition, setFilterCondition] = useState<string>('Tous');
    const [filterFinish, setFilterFinish] = useState<string>('Tous');
    const [filterSeries, setFilterSeries] = useState<string>('Toutes');
    const [filterSubSeries, setFilterSubSeries] = useState<string>('Toutes');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [zoomItem, setZoomItem] = useState<InventoryItem | null>(null);
    const [qrItem, setQrItem] = useState<InventoryItem | null>(null);
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
                .eq('is_personal', isPersonal)
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
                condition: dbItem.condition,
                cardFinish: dbItem.card_finish,
                cardNumber: dbItem.card_number,
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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const markSoldId = params.get('markSold');
        if (markSoldId && items.length > 0) {
            const item = items.find(i => i.id === markSoldId);
            if (item) {
                if (item.isSold) {
                    alert(`L'article "${item.name}" est déjà marqué comme vendu.`);
                } else {
                    handleMarkAsSold(item.id);
                }
                // Nettoyer l'URL
                const url = new URL(window.location.href);
                url.searchParams.delete('markSold');
                window.history.replaceState({}, document.title, url.pathname + url.search);
            }
        }
    }, [items]);

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
                condition: newItem.condition || null,
                card_finish: newItem.cardFinish || null,
                card_number: newItem.cardNumber || null,
                purchase_price: parseFloat(newItem.purchasePrice) || 0,
                potential_resale_price: parseFloat(newItem.potentialResalePrice) || 0,
                purchase_location: newItem.purchaseLocation,
                purchase_date: newItem.purchaseDate,
                details: newItem.details,
                photo_url: photoUrl,
                user_id: user.id,
                is_personal: isPersonal
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

    const normalizeString = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';

    const filteredItems = items
        .filter(item => {
            const normalizedSearchTerm = normalizeString(searchTerm);
            const matchesSearch = normalizeString(item.name).includes(normalizedSearchTerm) ||
                normalizeString(item.purchaseLocation || '').includes(normalizedSearchTerm);
            const matchesType = activeType === 'Tous' || item.type === activeType;
            const matchesStatus = activeStatus === 'Tous' ||
                (activeStatus === 'En Stock' && !item.isSold) ||
                (activeStatus === 'Vendu' && item.isSold);
                
            const matchesLanguage = filterLanguage === 'Tous' || item.language === filterLanguage;
            const matchesCondition = filterCondition === 'Tous' || item.condition === filterCondition;
            const matchesFinish = filterFinish === 'Tous' || item.cardFinish === filterFinish;
            const matchesSeries = filterSeries === 'Toutes' || item.series === filterSeries;
            const matchesSubSeries = filterSubSeries === 'Toutes' || item.subSeries === filterSubSeries;

            return matchesSearch && matchesType && matchesStatus && matchesLanguage && matchesCondition && matchesFinish && matchesSeries && matchesSubSeries;
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
            {onBack && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-xs uppercase tracking-widest bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm self-start w-fit hover:border-teal-400"
                >
                    <ChevronLeft className="w-4 h-4 text-teal-600" />
                    Retour aux Catégories
                </button>
            )}
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
                        <div className="flex items-center bg-slate-50 border border-slate-100 p-1 rounded-xl mr-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn("p-1.5 rounded-lg transition-all text-slate-400 hover:text-slate-600", viewMode === 'list' && "bg-white shadow-sm text-teal-600")}
                                title="Vue Liste"
                            >
                                <List className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode('gallery')}
                                className={cn("p-1.5 rounded-lg transition-all text-slate-400 hover:text-slate-600", viewMode === 'gallery' && "bg-white shadow-sm text-teal-600")}
                                title="Vue Galerie"
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 border rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                                showFilters || activeType !== 'Tous' || activeStatus !== 'Tous' || sortBy !== 'created_at' || filterLanguage !== 'Tous' || filterCondition !== 'Tous' || filterFinish !== 'Tous' || filterSeries !== 'Toutes' || filterSubSeries !== 'Toutes'
                                    ? "bg-teal-50 border-teal-200 text-teal-600 shadow-sm shadow-teal-50"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            {activeType !== 'Tous' || activeStatus !== 'Tous' || sortBy !== 'created_at' || filterLanguage !== 'Tous' || filterCondition !== 'Tous' || filterFinish !== 'Tous' || filterSeries !== 'Toutes' || filterSubSeries !== 'Toutes' ? 'Filtres actifs' : 'Filtres'}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                                "px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border",
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
                                                "px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border",
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
                            
                            {/* Spécial Cartes */}
                            {activeType === 'Carte' || activeType === 'Tous' ? (
                                <div className="flex flex-col gap-3">
                                    <h5 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                                        Filtres Cartes
                                        {(filterLanguage !== 'Tous' || filterCondition !== 'Tous' || filterFinish !== 'Tous' || filterSeries !== 'Toutes' || filterSubSeries !== 'Toutes') && (
                                            <button onClick={() => { setFilterLanguage('Tous'); setFilterCondition('Tous'); setFilterFinish('Tous'); setFilterSeries('Toutes'); setFilterSubSeries('Toutes'); }} className="text-teal-500 hover:text-teal-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                Reset <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </h5>
                                    
                                    <select value={filterSeries} onChange={(e) => { setFilterSeries(e.target.value); setFilterSubSeries('Toutes'); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all">
                                        <option value="Toutes">Série: Toutes</option>
                                        {POKEMON_SERIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>

                                    {filterSeries !== 'Toutes' && (
                                        <select value={filterSubSeries} onChange={(e) => setFilterSubSeries(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all">
                                            <option value="Toutes">Sous-série: Toutes</option>
                                            {POKEMON_SERIES.find(s => s.id === filterSeries)?.sets.map(s => (
                                                <option key={s.id} value={s.id}>{s.shortName}</option>
                                            ))}
                                        </select>
                                    )}

                                    <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all">
                                        <option value="Tous">Langue: Toutes</option>
                                        <option value="FR">🇫🇷 FR</option>
                                        <option value="JAP">🇯🇵 JAP</option>
                                        <option value="EN">🇺🇸 EN</option>
                                        <option value="CHI">🇨🇳 CHI</option>
                                        <option value="KOR">🇰🇷 KOR</option>
                                    </select>
                                    <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all">
                                        <option value="Tous">État: Tous</option>
                                        <option value="Mint">Mint (M)</option>
                                        <option value="Near Mint">Near Mint (NM)</option>
                                        <option value="Excellent">Excellent (EX)</option>
                                        <option value="Good">Good (GD)</option>
                                        <option value="Light Played">Light Played (LP)</option>
                                        <option value="Played">Played (PL)</option>
                                        <option value="Poor">Poor (PR)</option>
                                    </select>
                                    <select value={filterFinish} onChange={(e) => setFilterFinish(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all">
                                        <option value="Tous">Finition: Toutes</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Reverse">✨ Reverse</option>
                                        <option value="Holo">🌟 Holo</option>
                                    </select>
                                </div>
                            ) : <div></div>}

                            {/* Sort Filter */}
                            <div className="flex flex-col">
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

            {/* Modal QR Code */}
            <AnimatePresence>
                {qrItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                        onClick={() => setQrItem(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-100 flex flex-col items-center"
                        >
                            <div className="flex justify-between items-center w-full mb-4">
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Vente rapide QR Code</h3>
                                <button
                                    onClick={() => setQrItem(null)}
                                    className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 flex items-center justify-center">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                        window.location.origin + '/?markSold=' + qrItem.id
                                    )}`}
                                    alt="QR Code de vente"
                                    className="w-48 h-48 rounded-xl object-contain shadow-inner"
                                />
                            </div>
                            <p className="font-black text-slate-800 text-center text-sm mb-1">{qrItem.name}</p>
                            {qrItem.cardNumber && (
                                <p className="text-xs font-bold text-slate-400 mb-3">N°{qrItem.cardNumber}</p>
                            )}
                            <p className="text-slate-500 text-[11px] leading-relaxed text-center font-medium bg-slate-50 rounded-xl p-3 border border-slate-100">
                                Scannez ce code avec votre smartphone pour marquer instantanément cet article comme vendu depuis votre mobile.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                {searchTerm || activeType !== 'Tous' || activeStatus !== 'Tous' || filterLanguage !== 'Tous' || filterCondition !== 'Tous' || filterFinish !== 'Tous' ? <Filter className="w-6 h-6 text-slate-300" /> : <Plus className="w-6 h-6 text-slate-300" />}
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">
                                {searchTerm || activeType !== 'Tous' || activeStatus !== 'Tous' || filterLanguage !== 'Tous' || filterCondition !== 'Tous' || filterFinish !== 'Tous'
                                    ? "Aucun résultat pour ces filtres"
                                    : "Votre collection est vide"}
                            </p>
                            {(searchTerm || activeType !== 'Tous' || activeStatus !== 'Tous' || sortBy !== 'created_at' || filterLanguage !== 'Tous' || filterCondition !== 'Tous' || filterFinish !== 'Tous') && (
                                <button
                                    onClick={() => { setSearchTerm(''); setActiveType('Tous'); setActiveStatus('Tous'); setSortBy('created_at'); setFilterLanguage('Tous'); setFilterCondition('Tous'); setFilterFinish('Tous'); }}
                                    className="mt-4 text-[10px] font-black uppercase tracking-widest text-teal-600 hover:underline"
                                >
                                    Effacer tout
                                </button>
                            )}
                        </div>
                    ) : viewMode === 'list' ? (
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
                                                    <p className="text-sm sm:text-base font-black text-slate-800 leading-tight mb-1 truncate max-w-[100px] sm:max-w-none">
                                                        {item.name} 
                                                        {item.type === 'Carte' && item.cardNumber && (
                                                            <span className="text-slate-400 font-bold ml-1.5 text-xs sm:text-sm">N°{item.cardNumber}</span>
                                                        )}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest",
                                                            item.type === 'Carte' && "bg-blue-50 text-blue-600",
                                                            item.type === 'Scellé' && "bg-purple-50 text-purple-600",
                                                            item.type === 'Carte Gradée' && "bg-amber-50 text-amber-600",
                                                            item.type === 'Objet' && "bg-slate-100 text-slate-600"
                                                        )}>
                                                            {item.type}
                                                        </span>
                                                        {item.type === 'Carte' && item.subSeries && (
                                                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                                                {(() => {
                                                                    const series = POKEMON_SERIES.find(s => s.id === item.series);
                                                                    const set = series?.sets.find(s => s.id === item.subSeries);
                                                                    if (!set) return item.subSeries;
                                                                    return isMobile ? set.shortName : set.name;
                                                                })()}
                                                            </span>
                                                        )}
                                                        {item.type === 'Carte' && item.language && (
                                                            <span className="text-[11px] sm:text-sm" title={`Langue: ${item.language}`}>
                                                                {item.language === 'FR' ? '🇫🇷' : item.language === 'JAP' ? '🇯🇵' : item.language === 'EN' ? '🇺🇸' : item.language}
                                                            </span>
                                                        )}
                                                        {item.type === 'Carte' && item.condition && (
                                                            <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${
                                                                item.condition === 'Mint' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                item.condition === 'Near Mint' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                                                                item.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                                item.condition === 'Good' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                                item.condition === 'Light Played' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                                item.condition === 'Played' ? 'bg-red-100 text-red-600 border-red-200' :
                                                                item.condition === 'Poor' ? 'bg-slate-600 text-white border-slate-700 shadow-sm' :
                                                                'bg-stone-100 text-stone-600 border-stone-200'
                                                            }`}>
                                                                {item.condition}
                                                            </span>
                                                        )}
                                                        {item.type === 'Carte' && item.cardFinish && item.cardFinish !== 'Standard' && (
                                                            <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                                                                item.cardFinish === 'Reverse' 
                                                                    ? 'bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 shadow-sm border border-amber-300' 
                                                                    : 'bg-gradient-to-r from-fuchsia-300 to-purple-500 text-white shadow-sm border border-purple-400'
                                                            }`}>
                                                                {item.cardFinish === 'Reverse' ? '✨' : '🌟'}
                                                            </span>
                                                        )}
                                                        {item.purchaseLocation && (
                                                            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[60px] sm:max-w-[80px]">{item.purchaseLocation}</span>
                                                        )}
                                                    </div>
                                                    {item.type === 'Carte' && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            <a href={`https://www.vinted.fr/catalog?search_text=${encodeURIComponent(item.name + (item.cardNumber ? ' ' + item.cardNumber : ''))}`} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-md text-[9px] sm:text-[10px] font-bold border border-teal-100 hover:bg-teal-100 transition-colors">Vinted</a>
                                                            <a href={`https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(item.name + (item.cardNumber ? ' ' + item.cardNumber : ''))}`} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] sm:text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors">eBay</a>
                                                            <a href={`https://www.cardmarket.com/fr/Pokemon/Products/Search?searchString=${encodeURIComponent(item.name + (item.cardNumber ? ' ' + item.cardNumber : ''))}`} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-md text-[9px] sm:text-[10px] font-bold border border-sky-100 hover:bg-sky-100 transition-colors">Cardmarket</a>
                                                        </div>
                                                    )}
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
                                                    <>
                                                        <button
                                                            onClick={() => setQrItem(item)}
                                                            className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg sm:rounded-xl transition-all"
                                                            title="QR Code Vente"
                                                        >
                                                            <QrCode className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleMarkAsSold(item.id)}
                                                            className="p-1.5 sm:p-2 text-teal-600 hover:bg-teal-50 rounded-lg sm:rounded-xl transition-all"
                                                            title="Vendu"
                                                        >
                                                            <DollarSign className="w-4 h-4" />
                                                        </button>
                                                    </>
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
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 p-4 sm:p-6 bg-slate-50/30">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div 
                                        className="relative w-full aspect-[3/4] bg-slate-50 cursor-pointer overflow-hidden border-b border-slate-100 flex items-center justify-center p-2"
                                        onClick={() => setZoomItem(item)}
                                    >
                                        {item.photoUrl ? (
                                            <img
                                                src={item.photoUrl}
                                                alt={item.name}
                                                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
                                                <span className="text-[10px] font-bold uppercase">Sans image</span>
                                            </div>
                                        )}
                                        {item.isSold && (
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 shadow-sm">
                                                Vendu
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                                        <div className="mb-2">
                                            <h3 className="font-black text-slate-800 text-sm sm:text-base leading-tight line-clamp-2 mb-1 cursor-pointer hover:text-teal-600 transition-colors" onClick={() => handleOpenModal(item)}>
                                                {item.name}
                                            </h3>
                                            {(item.series || item.cardNumber) && (
                                                <p className="text-[11px] sm:text-xs font-bold text-slate-400 truncate">
                                                    {(() => {
                                                        const series = POKEMON_SERIES.find(s => s.id === item.series);
                                                        const set = series?.sets.find(s => s.id === item.subSeries);
                                                        const setName = set ? (isMobile ? set.shortName : set.name) : item.subSeries;
                                                        if (setName && item.cardNumber) return `${setName} • N°${item.cardNumber}`;
                                                        if (setName) return setName;
                                                        if (item.cardNumber) return `N°${item.cardNumber}`;
                                                        return '';
                                                    })()}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                            {item.language && (
                                                <span className="text-[11px] sm:text-sm" title={`Langue: ${item.language}`}>
                                                    {item.language === 'FR' ? '🇫🇷' : item.language === 'JAP' ? '🇯🇵' : item.language === 'EN' ? '🇺🇸' : item.language}
                                                </span>
                                            )}
                                            {item.condition && (
                                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${
                                                    item.condition === 'Mint' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                    item.condition === 'Near Mint' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                                                    item.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                    item.condition === 'Good' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                    item.condition === 'Light Played' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    item.condition === 'Played' ? 'bg-red-100 text-red-600 border-red-200' :
                                                    item.condition === 'Poor' ? 'bg-slate-600 text-white border-slate-700 shadow-sm' :
                                                    'bg-stone-100 text-stone-600 border-stone-200'
                                                }`}>
                                                    {item.condition}
                                                </span>
                                            )}
                                            {item.cardFinish && item.cardFinish !== 'Standard' && (
                                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                                                    item.cardFinish === 'Reverse' 
                                                        ? 'bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 border border-amber-300' 
                                                        : 'bg-gradient-to-r from-fuchsia-300 to-purple-500 text-white border border-purple-400'
                                                }`}>
                                                    {item.cardFinish === 'Reverse' ? '✨' : '🌟'}
                                                </span>
                                            )}
                                        </div>

                                        {item.type === 'Carte' && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                <a href={`https://www.vinted.fr/catalog?search_text=${encodeURIComponent(item.name + (item.cardNumber ? ' ' + item.cardNumber : ''))}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-1 py-1 bg-teal-50 text-teal-600 rounded-md text-[9px] font-bold border border-teal-100 hover:bg-teal-100 transition-colors">Vinted</a>
                                                <a href={`https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(item.name + (item.cardNumber ? ' ' + item.cardNumber : ''))}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-1 py-1 bg-blue-50 text-blue-600 rounded-md text-[9px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors">eBay</a>
                                                <a href={`https://www.cardmarket.com/fr/Pokemon/Products/Search?searchString=${encodeURIComponent(item.name + (item.cardNumber ? ' ' + item.cardNumber : ''))}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-1 py-1 bg-sky-50 text-sky-600 rounded-md text-[9px] font-bold border border-sky-100 hover:bg-sky-100 transition-colors">Cardmarket</a>
                                            </div>
                                        )}

                                        <div className="mt-auto flex items-end justify-between pt-2 border-t border-slate-50">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Achat</p>
                                                <p className="font-black text-slate-700 text-sm">{item.purchasePrice}€</p>
                                            </div>
                                            {item.isSold && item.soldPrice ? (
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-teal-500 uppercase tracking-widest mb-0.5">Vendu</p>
                                                    <p className="font-black text-teal-600 text-sm">{item.soldPrice}€</p>
                                                </div>
                                            ) : item.potentialResalePrice && item.potentialResalePrice > 0 ? (
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Côte</p>
                                                    <p className="font-black text-slate-500 text-sm">{item.potentialResalePrice}€</p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Action Buttons Overlay (Desktop only) */}
                                    <div className="absolute top-2 left-2 opacity-0 lg:group-hover:opacity-100 transition-opacity hidden lg:flex flex-col gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }} className="p-2 bg-white/90 backdrop-blur hover:bg-white text-slate-600 rounded-lg shadow-sm border border-slate-100 transition-colors" title="Modifier">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        {!item.isSold && (
                                            <>
                                                <button onClick={(e) => { e.stopPropagation(); setQrItem(item); }} className="p-2 bg-white/90 backdrop-blur hover:bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100 transition-colors" title="QR Code Vente">
                                                    <QrCode className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleMarkAsSold(item.id); }} className="p-2 bg-white/90 backdrop-blur hover:bg-white text-teal-600 rounded-lg shadow-sm border border-slate-100 transition-colors" title="Marquer comme vendu">
                                                    <DollarSign className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 bg-white/90 backdrop-blur hover:bg-red-50 text-red-500 rounded-lg shadow-sm border border-slate-100 transition-colors" title="Supprimer">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    
                                    {/* Action Buttons Bottom (Mobile only) */}
                                    <div className={cn(
                                        "grid divide-x divide-slate-100 border-t border-slate-100 bg-slate-50 lg:hidden",
                                        !item.isSold ? "grid-cols-4" : "grid-cols-3"
                                    )}>
                                        <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-500 hover:text-slate-800 flex justify-center transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {!item.isSold && (
                                            <button onClick={() => setQrItem(item)} className="p-2 text-indigo-600 hover:text-indigo-800 flex justify-center transition-colors">
                                                <QrCode className="w-4 h-4" />
                                            </button>
                                        )}
                                        {!item.isSold ? (
                                            <button onClick={() => handleMarkAsSold(item.id)} className="p-2 text-teal-600 hover:text-teal-800 flex justify-center transition-colors">
                                                <DollarSign className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <div className="p-2 flex justify-center text-slate-300">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                        )}
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 flex justify-center transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
