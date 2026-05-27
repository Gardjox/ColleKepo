import React, { useState, useEffect, useRef } from 'react';
import { Layers, Calculator, Info, Plus, Trash2, Loader2, Calendar, Camera, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { POKEMON_SERIES } from '../data/pokemonSets';

interface Lot {
    id: string;
    name: string;
    purchase_price: number;
    item_count: number;
    break_even_price: number;
    created_at: string;
}

const BulkLots: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [lots, setLots] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(true);
    const [lotName, setLotName] = useState<string>('');
    const [lotPrice, setLotPrice] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingLotId, setEditingLotId] = useState<string | null>(null);

    // Nouvel état pour la composition du lot
    const [composedItems, setComposedItems] = useState<{ 
        id?: string, name: string, type: string, quantity: number, photo: File | null, previewUrl?: string,
        series?: string, subSeries?: string, language?: string, condition?: string, cardFinish?: string, cardNumber?: string, potentialResalePrice?: number 
    }[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemType, setNewItemType] = useState('Carte');
    const [newItemQty, setNewItemQty] = useState<number>(1);
    const [newItemPhoto, setNewItemPhoto] = useState<File | null>(null);
    const [newItemPreview, setNewItemPreview] = useState<string | null>(null);
    const [newItemPotentialPrice, setNewItemPotentialPrice] = useState<string>('');
    
    // Nouveaux états de détails (Carte)
    const [newItemSeries, setNewItemSeries] = useState('');
    const [newItemSubSeries, setNewItemSubSeries] = useState('');
    const [newItemNumber, setNewItemNumber] = useState('');
    const [newItemLanguage, setNewItemLanguage] = useState('FR');
    const [newItemCondition, setNewItemCondition] = useState('Mint');
    const [newItemFinish, setNewItemFinish] = useState('Standard');

    const itemCount = composedItems.reduce((acc, item) => acc + item.quantity, 0);
    const parsedLotPrice = parseFloat(lotPrice) || 0;
    const breakEven = itemCount > 0 ? (parsedLotPrice / itemCount).toFixed(2) : '0.00';

    const fetchLots = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('lots')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLots(data || []);
        } catch (error: any) {
            console.error('Erreur lots:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLots();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewItemPhoto(file);
            const url = URL.createObjectURL(file);
            setNewItemPreview(url);
        }
    };

    const addItemToComposition = () => {
        if (!newItemName || newItemQty <= 0) return;
        setComposedItems([...composedItems, {
            name: newItemName,
            type: newItemType,
            quantity: newItemQty,
            photo: newItemPhoto,
            previewUrl: newItemPreview || undefined,
            potentialResalePrice: parseFloat(newItemPotentialPrice) || 0,
            series: newItemType === 'Carte' ? newItemSeries : undefined,
            subSeries: newItemType === 'Carte' ? newItemSubSeries : undefined,
            cardNumber: newItemType === 'Carte' ? newItemNumber : undefined,
            language: newItemType === 'Carte' ? newItemLanguage : undefined,
            condition: newItemType === 'Carte' ? newItemCondition : undefined,
            cardFinish: newItemType === 'Carte' ? newItemFinish : undefined,
        }]);
        setNewItemName('');
        setNewItemQty(1);
        setNewItemPhoto(null);
        setNewItemPreview(null);
        setNewItemPotentialPrice('');
        setNewItemSeries('');
        setNewItemSubSeries('');
        setNewItemNumber('');
    };

    const removeItemFromComposition = (index: number) => {
        setComposedItems(composedItems.filter((_, i) => i !== index));
    };

    const handleEditLot = async (lot: Lot) => {
        setLoading(true);
        try {
            setEditingLotId(lot.id);
            setLotName(lot.name);
            setLotPrice(lot.purchase_price.toString());

            const { data: dbItems, error } = await supabase
                .from('items')
                .select('*')
                .eq('lot_id', lot.id);

            if (error) throw error;

            if (dbItems) {
                const mappedItems = dbItems.map((dbItem: any) => ({
                    id: dbItem.id,
                    name: dbItem.name,
                    type: dbItem.type,
                    quantity: 1,
                    photo: null, 
                    previewUrl: dbItem.photo_url || undefined,
                    series: dbItem.series || undefined,
                    subSeries: dbItem.sub_series || undefined,
                    language: dbItem.language || undefined,
                    condition: dbItem.condition || undefined,
                    cardFinish: dbItem.card_finish || undefined,
                    cardNumber: dbItem.card_number || undefined,
                    potentialResalePrice: dbItem.potential_resale_price || 0,
                }));
                setComposedItems(mappedItems);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            alert("Erreur lors du chargement des articles : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLot = async () => {
        const finalLotPrice = parseFloat(lotPrice) || 0;
        
        if (!lotName || finalLotPrice < 0 || composedItems.length === 0) {
            alert('Veuillez remplir le nom, un prix valide et ajouter au moins un article au lot.');
            return;
        }

        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let currentLotId = editingLotId;
            let currentBreakEven = parseFloat(breakEven);

            if (editingLotId) {
                const { error: lotError } = await supabase
                    .from('lots')
                    .update({
                        name: lotName,
                        purchase_price: finalLotPrice,
                        item_count: itemCount,
                        break_even_price: currentBreakEven
                    })
                    .eq('id', editingLotId);

                if (lotError) throw lotError;

                const { data: originalItems, error: fetchError } = await supabase
                    .from('items')
                    .select('id')
                    .eq('lot_id', editingLotId);

                if (fetchError) throw fetchError;

                const composedIds = composedItems.map(i => i.id).filter(id => id);
                const originalIds = originalItems.map((i: any) => i.id);
                const idsToDelete = originalIds.filter((id: string) => !composedIds.includes(id));

                if (idsToDelete.length > 0) {
                    const { error: deleteError } = await supabase
                        .from('items')
                        .delete()
                        .in('id', idsToDelete);
                    if (deleteError) throw deleteError;
                }
            } else {
                const { data: lotData, error: lotError } = await supabase
                    .from('lots')
                    .insert([{
                        user_id: user.id,
                        name: lotName,
                        purchase_price: finalLotPrice,
                        item_count: itemCount,
                        break_even_price: currentBreakEven
                    }])
                    .select()
                    .single();

                if (lotError) throw lotError;
                currentLotId = lotData.id;
            }

            const itemsToInsert: any[] = [];

            for (const item of composedItems) {
                let photoUrl = item.previewUrl || '';

                if (item.photo) {
                    const fileExt = item.photo.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `${user.id}/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('items')
                        .upload(filePath, item.photo);

                    if (!uploadError) {
                        const { data: { publicUrl } } = supabase.storage
                            .from('items')
                            .getPublicUrl(filePath);
                        photoUrl = publicUrl;
                    }
                }

                if (item.id) {
                    const { error: updateError } = await supabase
                        .from('items')
                        .update({
                            name: item.name,
                            type: item.type,
                            series: item.series || null,
                            sub_series: item.subSeries || null,
                            language: item.language || null,
                            condition: item.condition || null,
                            card_finish: item.cardFinish || null,
                            card_number: item.cardNumber || null,
                            purchase_price: currentBreakEven,
                            potential_resale_price: item.potentialResalePrice || 0,
                            purchase_location: lotName,
                            photo_url: photoUrl
                        })
                        .eq('id', item.id);
                        
                    if (updateError) throw updateError;
                } else {
                    for (let i = 0; i < item.quantity; i++) {
                        itemsToInsert.push({
                            user_id: user.id,
                            lot_id: currentLotId,
                            name: item.quantity > 1 ? `${item.name} (${i + 1}/${item.quantity})` : item.name,
                            type: item.type,
                            series: item.series || null,
                            sub_series: item.subSeries || null,
                            language: item.language || null,
                            condition: item.condition || null,
                            card_finish: item.cardFinish || null,
                            card_number: item.cardNumber || null,
                            purchase_price: currentBreakEven,
                            potential_resale_price: item.potentialResalePrice || 0,
                            purchase_location: lotName,
                            photo_url: photoUrl,
                            is_sold: false
                        });
                    }
                }
            }

            if (itemsToInsert.length > 0) {
                const { error: itemsError } = await supabase
                    .from('items')
                    .insert(itemsToInsert);
                if (itemsError) throw itemsError;
            }

            // Success
            setLotName('');
            setLotPrice('');
            setComposedItems([]);
            setEditingLotId(null);
            fetchLots();
            alert(editingLotId ? 'Lot mis à jour avec succès !' : `Lot et ${itemCount} articles enregistrés avec succès !`);
        } catch (error: any) {
            alert('Erreur lors de la sauvegarde : ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLot = async (id: string) => {
        if (!confirm('Attention : Supprimer ce lot supprimera également DÉFINITIVEMENT tous les articles qui y sont rattachés dans votre inventaire. Voulez-vous continuer ?')) return;
        try {
            // 1. Supprimer les articles rattachés au lot d'abord
            const { error: itemsDeleteError } = await supabase
                .from('items')
                .delete()
                .eq('lot_id', id);

            if (itemsDeleteError) throw itemsDeleteError;

            // 2. Supprimer le lot
            const { error } = await supabase
                .from('lots')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchLots();
        } catch (error: any) {
            alert("Erreur lors de la suppression : " + error.message);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calculateur de rentabilité */}
                <div className="lg:col-span-1 premium-card p-6 bg-teal-600 border-none text-white overflow-hidden relative shadow-xl shadow-teal-100/50">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Calculator className="w-24 h-24" />
                    </div>

                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Calculateur de Seuil
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-teal-100 mb-1.5 opacity-80">Nom du lot</label>
                            <input
                                type="text"
                                className="w-full bg-teal-500 border border-teal-400 rounded-xl px-4 py-2.5 text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                                placeholder="Ex: Lot Vinted Pikachu"
                                value={lotName}
                                onChange={(e) => setLotName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-teal-100 mb-1.5 opacity-80">Prix total du lot (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-full bg-teal-500 border border-teal-400 rounded-xl px-4 py-2.5 text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                                    placeholder="0.00"
                                    value={lotPrice}
                                    onChange={(e) => setLotPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Interface de composition */}
                        <div className="pt-4 mt-4 border-t border-teal-500">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-teal-100 mb-3 opacity-80">📦 Contenu du lot ({itemCount})</label>

                            <div className="flex flex-col gap-3 mb-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div className="w-full space-y-2">
                                    <div className="flex gap-2">
                                        <div className="flex-[3]">
                                            <input
                                                type="text"
                                                className="w-full bg-teal-700/30 border border-teal-400/50 rounded-lg px-3 py-2 text-xs text-white placeholder-teal-300 focus:outline-none"
                                                placeholder="Nom de l'article..."
                                                value={newItemName}
                                                onChange={(e) => setNewItemName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addItemToComposition()}
                                            />
                                        </div>
                                        <div className="w-14">
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full bg-teal-700/30 border border-teal-400/50 rounded-lg px-2 py-2 text-xs text-white placeholder-teal-300 focus:outline-none"
                                                placeholder="Qté"
                                                value={newItemQty}
                                                onChange={(e) => setNewItemQty(Number(e.target.value))}
                                                onKeyDown={(e) => e.key === 'Enter' && addItemToComposition()}
                                            />
                                        </div>
                                        <div className="w-20">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-full bg-teal-700/30 border border-teal-400/50 rounded-lg px-2 py-2 text-xs text-white placeholder-teal-300 focus:outline-none"
                                                placeholder="Cote €"
                                                value={newItemPotentialPrice}
                                                onChange={(e) => setNewItemPotentialPrice(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addItemToComposition()}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 bg-teal-700/30 border border-teal-400/50 rounded-lg px-2 py-2 text-[10px] text-white focus:outline-none"
                                            value={newItemType}
                                            onChange={(e) => setNewItemType(e.target.value)}
                                        >
                                            <option value="Carte">Carte</option>
                                            <option value="Scellé">Scellé</option>
                                            <option value="Carte Gradée">Carte Gradée</option>
                                            <option value="Objet">Objet</option>
                                        </select>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`p-2 rounded-lg transition-all flex items-center justify-center border ${newItemPreview ? 'bg-white text-teal-600 border-white' : 'bg-teal-700/30 text-teal-200 border-teal-400/50 hover:bg-teal-700/50'}`}
                                            title="Ajouter une photo"
                                        >
                                            {newItemPreview ? (
                                                <div className="w-4 h-4 rounded overflow-hidden">
                                                    <img src={newItemPreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <Camera className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    {newItemType === 'Carte' && (
                                        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-teal-500/30">
                                            <div className="flex gap-2">
                                                <select 
                                                    value={newItemSeries} 
                                                    onChange={(e) => { setNewItemSeries(e.target.value); setNewItemSubSeries(''); }} 
                                                    className="flex-1 bg-teal-700/30 border border-teal-400/50 rounded-lg px-2 py-2 text-[10px] text-white focus:outline-none"
                                                >
                                                    <option value="">Série...</option>
                                                    {POKEMON_SERIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </select>
                                                {newItemSeries && (
                                                    <select 
                                                        value={newItemSubSeries} 
                                                        onChange={(e) => setNewItemSubSeries(e.target.value)} 
                                                        className="flex-1 bg-teal-700/30 border border-teal-400/50 rounded-lg px-2 py-2 text-[10px] text-white focus:outline-none"
                                                    >
                                                        <option value="">Sous-série...</option>
                                                        {POKEMON_SERIES.find(s => s.id === newItemSeries)?.sets.map(s => (
                                                            <option key={s.id} value={s.id}>{s.shortName}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                <input 
                                                    type="text" 
                                                    value={newItemNumber} 
                                                    onChange={(e) => setNewItemNumber(e.target.value)} 
                                                    placeholder="N°" 
                                                    className="w-14 bg-teal-700/30 border border-teal-400/50 rounded-lg px-2 py-2 text-[10px] text-white placeholder-teal-300 focus:outline-none" 
                                                />
                                            </div>
                                            {POKEMON_SERIES.find(s => s.id === newItemSeries)?.sets.find(s => s.id === newItemSubSeries)?.cards && (
                                                <div className="flex">
                                                    <select
                                                        className="flex-1 bg-teal-600/30 border border-teal-400/50 rounded-lg px-2 py-2 text-[10px] font-bold text-teal-100 focus:outline-none"
                                                        onChange={(e) => {
                                                            const card = POKEMON_SERIES.find(s => s.id === newItemSeries)?.sets.find(s => s.id === newItemSubSeries)?.cards?.find(c => c.number === e.target.value);
                                                            if (card) {
                                                                setNewItemName(card.name);
                                                                setNewItemNumber(card.number);
                                                            }
                                                        }}
                                                        value=""
                                                    >
                                                        <option value="" disabled>⚡ Sélection rapide de carte...</option>
                                                        {POKEMON_SERIES.find(s => s.id === newItemSeries)?.sets.find(s => s.id === newItemSubSeries)?.cards?.map(card => (
                                                            <option key={card.number} value={card.number}>
                                                                {card.number} - {card.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <select value={newItemLanguage} onChange={(e) => setNewItemLanguage(e.target.value)} className="flex-1 bg-teal-700/30 border border-teal-400/50 rounded-lg px-1 py-2 text-[9px] text-white focus:outline-none">
                                                    <option value="FR">🇫🇷 FR</option>
                                                    <option value="JAP">🇯🇵 JAP</option>
                                                    <option value="EN">🇺🇸 EN</option>
                                                    <option value="CHI">🇨🇳 CHI</option>
                                                    <option value="KOR">🇰🇷 KOR</option>
                                                </select>
                                                <select value={newItemCondition} onChange={(e) => setNewItemCondition(e.target.value)} className="flex-[1.5] bg-teal-700/30 border border-teal-400/50 rounded-lg px-1 py-2 text-[9px] text-white focus:outline-none">
                                                    <option value="Mint">Mint (M)</option>
                                                    <option value="Near Mint">Near Mint (NM)</option>
                                                    <option value="Excellent">Excellent (EX)</option>
                                                    <option value="Good">Good (GD)</option>
                                                    <option value="Light Played">Light Played (LP)</option>
                                                    <option value="Played">Played (PL)</option>
                                                    <option value="Poor">Poor (PR)</option>
                                                </select>
                                                <select value={newItemFinish} onChange={(e) => setNewItemFinish(e.target.value)} className="flex-1 bg-teal-700/30 border border-teal-400/50 rounded-lg px-1 py-2 text-[9px] text-white focus:outline-none">
                                                    <option value="Standard">Standard</option>
                                                    <option value="Reverse">✨ Rev.</option>
                                                    <option value="Holo">🌟 Holo</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={addItemToComposition}
                                    className="w-full mt-2 py-3 bg-white text-teal-600 rounded-xl hover:bg-teal-50 transition-colors flex items-center justify-center shadow-lg font-bold text-[11px] uppercase tracking-widest active:scale-95"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> Ajouter la carte
                                </button>
                            </div>

                            <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                {composedItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between bg-teal-700/40 p-2 rounded-lg border border-teal-400/20 group animate-in slide-in-from-left-2 duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {item.previewUrl ? (
                                                    <div className="w-8 h-8 rounded bg-teal-800/50 border border-white/20 overflow-hidden shadow-inner">
                                                        <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded bg-teal-800/30 border border-teal-400/20 flex items-center justify-center italic text-[8px] text-teal-300">
                                                        Ø
                                                    </div>
                                                )}
                                                <div className="absolute -top-1 -left-1 w-4 h-4 bg-white text-teal-700 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white leading-tight">
                                                    {item.name}
                                                    {item.potentialResalePrice ? <span className="ml-2 text-amber-300 font-black">({item.potentialResalePrice}€)</span> : null}
                                                </span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-teal-200 opacity-70">
                                                    {item.type} 
                                                    {item.type === 'Carte' && (
                                                        <>
                                                            {item.cardNumber && ` • N°${item.cardNumber}`}
                                                            {item.language && ` • ${item.language}`}
                                                            {item.condition && ` • ${item.condition}`}
                                                            {item.cardFinish && item.cardFinish !== 'Standard' && ` • ${item.cardFinish}`}
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItemFromComposition(index)}
                                            className="p-1 text-teal-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                {composedItems.length === 0 && (
                                    <div className="text-center py-4 border-2 border-dashed border-teal-400/30 rounded-xl">
                                        <p className="text-[10px] text-teal-200 font-medium italic">Aucun article ajouté</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-teal-500">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200 mb-1 opacity-80">Prix de revient / article</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black">{breakEven}€</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200 mb-1 opacity-80">Total articles</p>
                                    <span className="text-xl font-black">{itemCount}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3 p-3 bg-teal-700/40 rounded-xl text-[10px] leading-snug border border-teal-500/30">
                                <Info className="w-4 h-4 shrink-0 text-teal-300" />
                                <p className="text-teal-100 font-medium italic">Vendre au-dessus de ce prix pour réaliser un bénéfice sur chaque carte du lot.</p>
                            </div>

                            <div className="flex flex-col gap-2 mt-6">
                                <button
                                    onClick={handleSaveLot}
                                    disabled={isSaving}
                                    className="w-full py-3 bg-white text-teal-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-50 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingLotId ? "Mettre à jour le lot" : "Enregistrer ce lot")}
                                </button>
                                {editingLotId && (
                                    <button
                                        onClick={() => {
                                            setEditingLotId(null);
                                            setLotName('');
                                            setLotPrice('');
                                            setComposedItems([]);
                                        }}
                                        className="w-full py-2 bg-transparent text-teal-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
                                    >
                                        Annuler la modification
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historique des lots */}
                <div className="lg:col-span-2 premium-card overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-teal-600" />
                            Historique des Lots
                        </h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {lots.length} Lot{lots.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-4 text-teal-500" />
                                <p className="text-sm font-medium">Récupération des données...</p>
                            </div>
                        ) : lots.length === 0 ? (
                            <div className="space-y-4 text-center py-20 bg-slate-50/30">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                    <Layers className="text-slate-300 w-8 h-8" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium px-10">Vous n'avez pas encore enregistré de lots pour le moment.</p>
                                <p className="text-slate-300 text-[11px] uppercase tracking-wider font-bold">Commencez par utiliser le calculateur</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {lots.map((lot) => (
                                    <div key={lot.id} className="p-5 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                                {lot.item_count}
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-800">{lot.name}</h5>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(lot.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span className="text-[10px] text-teal-600 font-bold uppercase">
                                                            P.R.U : {lot.break_even_price.toFixed(2)}€
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-800">{lot.purchase_price.toFixed(2)}€</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</p>
                                            </div>
                                            <div className="flex gap-2 opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleEditLot(lot)}
                                                    className="flex items-center gap-2 px-3 py-2 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-all text-[11px] font-bold uppercase tracking-widest"
                                                    title="Modifier"
                                                >
                                                    <Edit2 className="w-4 h-4" /> <span className="hidden sm:inline">Modifier</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLot(lot.id)}
                                                    className="p-2 text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkLots;
