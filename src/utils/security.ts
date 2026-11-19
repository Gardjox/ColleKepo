/**
 * Utilitaires de sécurité pour ColleKepo
 * Validation des fichiers, assainissement des entrées et protection contre les abus.
 */

const ALLOWED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
];

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
    if (!file) {
        return { valid: false, error: 'Aucun fichier sélectionné.' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `Le fichier est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)} Mo). La taille maximale autorisée est de 5 Mo.`
        };
    }

    if (file.size === 0) {
        return { valid: false, error: 'Le fichier est vide.' };
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
        return {
            valid: false,
            error: `Type de fichier non autorisé (${file.type || 'inconnu'}). Seuls les formats JPEG, PNG, WebP et GIF sont acceptés.`
        };
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
        return {
            valid: false,
            error: `Extension non autorisée (.${ext || ''}). Seules les images (.jpg, .png, .webp, .gif) sont acceptées.`
        };
    }

    return { valid: true };
}

export function getSafeStoragePath(userId: string, originalFileName: string): string {
    const rawExt = originalFileName.split('.').pop()?.toLowerCase() || 'jpg';
    const ext = ALLOWED_IMAGE_EXTENSIONS.includes(rawExt) ? rawExt : 'jpg';
    const cleanUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    return `${cleanUserId}/${uniqueId}.${ext}`;
}

export function parseSafePrice(value: any, defaultValue: number = 0): number {
    if (typeof value === 'number') {
        return isFinite(value) && value >= 0 ? value : defaultValue;
    }
    if (typeof value === 'string') {
        const cleaned = value.replace(',', '.').trim();
        const parsed = parseFloat(cleaned);
        return isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
    }
    return defaultValue;
}
