import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Save, Upload, Calendar, ChevronDown } from 'lucide-react';
import { POKEMON_SERIES } from '../data/pokemonSets';
import type { ProductType, InventoryItem } from '../types';
import { fetchCardsForSet } from '../utils/tcgdex';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: any, file: File | null) => void;
    initialData?: InventoryItem | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Carte' as ProductType,
        series: '',
        subSeries: '',
        purchasePrice: '',
        potentialResalePrice: '',
        purchaseLocation: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        details: '',
        language: 'FR',
        condition: 'Mint',
        cardFinish: 'Standard',
        cardNumber: '',
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [fetchedCards, setFetchedCards] = useState<{number: string, name: string}[] | null>(null);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (formData.type === 'Carte' && formData.subSeries) {
            const localSet = POKEMON_SERIES.find(s => s.id === formData.series)?.sets.find(s => s.id === formData.subSeries);
            if (localSet?.cards) {
                setFetchedCards(localSet.cards);
                return;
            }

            let isMounted = true;
            setFetchedCards(null);
            setIsLoadingCards(true);

            fetchCardsForSet(formData.subSeries).then(cards => {
                if (isMounted) {
                    if (cards.length > 0) {
                        setFetchedCards(cards);
                    } else {
                        setFetchedCards(null);
                    }
                    setIsLoadingCards(false);
                }
            });

            return () => { isMounted = false; };
        } else {
            setFetchedCards(null);
        }
    }, [formData.subSeries, formData.series, formData.type]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                type: initialData.type,
                series: initialData.series || '',
                subSeries: initialData.subSeries || '',
                purchasePrice: initialData.purchasePrice.toString(),
                potentialResalePrice: initialData.potentialResalePrice.toString(),
                purchaseLocation: initialData.purchaseLocation || '',
                purchaseDate: initialData.purchaseDate || new Date().toISOString().split('T')[0],
                details: initialData.details || '',
                language: initialData.language || 'FR',
                condition: initialData.condition || 'Mint',
                cardFinish: initialData.cardFinish || 'Standard',
                cardNumber: initialData.cardNumber || '',
            });
            setPreviewUrl(initialData.photoUrl || null);
        } else {
            setFormData({
                name: '',
                type: 'Carte',
                series: '',
                subSeries: '',
                purchasePrice: '',
                potentialResalePrice: '',
                purchaseLocation: '',
                purchaseDate: new Date().toISOString().split('T')[0],
                details: '',
                language: 'FR',
                condition: 'Mint',
                cardFinish: 'Standard',
                cardNumber: '',
            });
            setPreviewUrl(null);
        }
        setSelectedFile(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const selectedSeries = POKEMON_SERIES.find(s => s.id === formData.series);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        onSave(formData, selectedFile);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">
                        {initialData ? 'Modifier l\'Article' : 'Ajouter un Article'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-center mb-6">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={handlePhotoClick}
                            className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 group hover:border-teal-400 hover:bg-teal-50 transition-all cursor-pointer relative overflow-hidden shadow-inner mx-auto"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Camera className="w-8 h-8 mb-2 group-hover:text-teal-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Photo</span>
                                </>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="text-white w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Nom de l'article</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="Ex: Dracaufeu 1ère Edition"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Type</label>
                            <select
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType, series: '', subSeries: '' })}
                            >
                                <option>Carte</option>
                                <option>Scellé</option>
                                <option>Carte Gradée</option>
                                <option>Objet</option>
                            </select>
                        </div>

                        {formData.type === 'Carte' && (
                            <>
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Série</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                            value={formData.series}
                                            onChange={(e) => setFormData({ ...formData, series: e.target.value, subSeries: '' })}
                                        >
                                            <option value="">Sélectionner une série...</option>
                                            {POKEMON_SERIES.map(series => (
                                                <option key={series.id} value={series.id}>{series.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {formData.series && (
                                    <div className="w-full">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Sous-série</label>
                                        <div className="flex gap-2 relative">
                                            <div className="relative flex-1">
                                                <select
                                                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                                    value={formData.subSeries}
                                                    onChange={(e) => setFormData({ ...formData, subSeries: e.target.value })}
                                                >
                                                    <option value="">Sélectionner une sous-série...</option>
                                                    {selectedSeries?.sets.map(set => (
                                                        <option key={set.id} value={set.id}>
                                                            {isMobile ? set.shortName : set.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-1/3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                                placeholder="N° (ex: 12/165)"
                                                value={formData.cardNumber}
                                                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                            />
                                        </div>
                                        {isLoadingCards && (
                                            <div className="text-xs text-slate-500 mt-2">Chargement des cartes...</div>
                                        )}
                                        {!isLoadingCards && fetchedCards && (
                                            <div className="mt-2 space-y-2">
                                                <div className="relative">
                                                    <select
                                                        className="w-full appearance-none px-4 py-2 bg-teal-50 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-xs font-bold text-teal-700"
                                                        onChange={(e) => {
                                                            const card = fetchedCards.find(c => c.number === e.target.value);
                                                            if (card) {
                                                                setFormData({ ...formData, name: card.name, cardNumber: card.number });
                                                            }
                                                        }}
                                                        value=""
                                                    >
                                                        <option value="" disabled>⚡ Sélection rapide de carte...</option>
                                                        {fetchedCards.map(card => (
                                                            <option key={card.number} value={card.number}>
                                                                {isMobile ? card.number : `${card.name} ${card.number}`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-teal-500 pointer-events-none" />
                                                </div>
                                                {formData.name && (
                                                    <div className="flex justify-end">
                                                        <a
                                                            href={`https://www.cardmarket.com/fr/Pokemon/Products/Search?searchString=${encodeURIComponent(formData.name + (formData.cardNumber ? ' ' + formData.cardNumber : ''))}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-xl text-[10px] font-bold border border-sky-100 transition-colors shadow-sm"
                                                        >
                                                            🔍 Tcheker le prix (Cardmarket)
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="w-full sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Langue de la carte</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, language: 'FR' })}
                                            className={`flex-1 min-w-[60px] py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.language === 'FR' ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            🇫🇷 FR
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, language: 'JAP' })}
                                            className={`flex-1 min-w-[60px] py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.language === 'JAP' ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            🇯🇵 JAP
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, language: 'EN' })}
                                            className={`flex-1 min-w-[60px] py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.language === 'EN' ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            🇺🇸 EN
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, language: 'CHI' })}
                                            className={`flex-1 min-w-[60px] py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.language === 'CHI' ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            🇨🇳 CHI
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, language: 'KOR' })}
                                            className={`flex-1 min-w-[60px] py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.language === 'KOR' ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            🇰🇷 KOR
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="w-full sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">État de la carte</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                            value={formData.condition}
                                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        >
                                            <option value="Mint">Mint (M)</option>
                                            <option value="Near Mint">Near Mint (NM)</option>
                                            <option value="Excellent">Excellent (EX)</option>
                                            <option value="Good">Good (GD)</option>
                                            <option value="Light Played">Light Played (LP)</option>
                                            <option value="Played">Played (PL)</option>
                                            <option value="Poor">Poor (PR)</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                
                                <div className="w-full sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Finition de la carte</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, cardFinish: 'Standard' })}
                                            className={`flex-1 py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.cardFinish === 'Standard' ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            Standard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, cardFinish: 'Reverse' })}
                                            className={`flex-1 py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.cardFinish === 'Reverse' ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            ✨ Reverse
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, cardFinish: 'Holo' })}
                                            className={`flex-1 py-2.5 rounded-xl border transition-all text-sm font-bold flex items-center justify-center gap-2 ${formData.cardFinish === 'Holo' ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            🌟 Holo
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="w-full">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Lieu d'achat</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="Ex: Vinted"
                                value={formData.purchaseLocation}
                                onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Date d'achat</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium text-slate-700"
                                    value={formData.purchaseDate}
                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Prix d'achat (€)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="0.00"
                                value={formData.purchasePrice}
                                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                            />
                        </div>

                        <div className="w-full sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Potentiel Revente (€)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="0.00"
                                value={formData.potentialResalePrice}
                                onChange={(e) => setFormData({ ...formData, potentialResalePrice: e.target.value })}
                            />
                        </div>

                        <div className="w-full sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Détails / État</label>
                            <textarea
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all min-h-[80px] text-sm font-medium"
                                placeholder="État, langue, édition, etc."
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-sm active:scale-95"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {initialData ? 'Mettre à jour' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;
