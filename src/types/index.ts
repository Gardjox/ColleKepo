export type ProductType = 'Carte' | 'Scellé' | 'Carte Gradée' | 'Objet';

export interface InventoryItem {
    id: string;
    name: string;
    type: ProductType;
    photoUrl?: string;
    purchasePrice: number;
    potentialResalePrice: number;
    purchaseLocation: string;
    details: string;
    purchaseDate?: string;
    isSold: boolean;
    soldPrice?: number;
    soldDate?: string;
    lotId?: string;
    createdAt: number;
}

export interface BulkLot {
    id: string;
    name: string;
    purchasePrice: number;
    itemCount: number;
    breakEvenPrice: number;
    createdAt: number;
}
