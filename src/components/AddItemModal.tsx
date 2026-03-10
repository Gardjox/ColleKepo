import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Save, Upload, Calendar } from 'lucide-react';
import type { ProductType, InventoryItem } from '../types';

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
        purchasePrice: '',
        potentialResalePrice: '',
        purchaseLocation: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        details: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                type: initialData.type,
                purchasePrice: initialData.purchasePrice.toString(),
                potentialResalePrice: initialData.potentialResalePrice.toString(),
                purchaseLocation: initialData.purchaseLocation || '',
                purchaseDate: initialData.purchaseDate || new Date().toISOString().split('T')[0],
                details: initialData.details || '',
            });
            setPreviewUrl(initialData.photoUrl || null);
        } else {
            setFormData({
                name: '',
                type: 'Carte',
                purchasePrice: '',
                potentialResalePrice: '',
                purchaseLocation: '',
                purchaseDate: new Date().toISOString().split('T')[0],
                details: '',
            });
            setPreviewUrl(null);
        }
        setSelectedFile(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Nom de l'article</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="Ex: Dracaufeu 1ère Edition"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Type</label>
                            <select
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
                            >
                                <option>Carte</option>
                                <option>Scellé</option>
                                <option>Carte Gradée</option>
                                <option>Objet</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Lieu d'achat</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="Ex: Vinted"
                                value={formData.purchaseLocation}
                                onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none italic">Date d'achat</label>
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

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Prix d'achat (€)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="0.00"
                                value={formData.purchasePrice}
                                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 leading-none">Potentiel Revente (€)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                                placeholder="0.00"
                                value={formData.potentialResalePrice}
                                onChange={(e) => setFormData({ ...formData, potentialResalePrice: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
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
