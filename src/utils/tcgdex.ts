export interface TcgdexCard {
    id: string;
    localId: string;
    name: string;
    image?: string;
}

export function getTcgdexSetId(setId: string): string {
    const map: Record<string, string> = {
        'XYEvo': 'xy12',
        'XYOV': 'xy11',
        'SLPromos': 'smp',
        'EBPromos': 'swshp',
        'EVPromos': 'svp',
        'MEPromos': 'mep',
        'XYPromos': 'xyp',
        'BWPromos': 'bwp',
        'DPPromos': 'dpp',
        'HGSSPromos': 'hgssp',
        'SL11.5': 'sm115',
        'EV10.5-BLK': 'sv10.5b',
        'EV10.5-WHT': 'sv10.5w',
        'ME2.5': 'me02.5',
        'ME2': 'me02',
        'ME1': 'me01',
    };

    if (map[setId]) return map[setId];

    let lower = setId.toLowerCase();
    
    if (lower.startsWith('ev')) {
        let num = lower.substring(2);
        if (num.startsWith('10') || num.startsWith('11') || num.startsWith('12')) {
            return `sv${num}`;
        }
        return `sv0${num}`;
    }
    if (lower.startsWith('eb')) return `swsh${lower.substring(2)}`;
    if (lower.startsWith('sl')) return `sm${lower.substring(2)}`;
    if (lower.startsWith('xy')) return lower;
    if (lower.startsWith('dp')) return lower;
    if (lower.startsWith('bw')) return lower;
    if (lower.startsWith('hgss')) return lower;
    if (lower.startsWith('pl')) return lower;

    return lower;
}

export async function fetchCardsForSet(setId: string): Promise<{ number: string; name: string }[]> {
    try {
        const tcgdexId = getTcgdexSetId(setId);
        const response = await fetch(`https://api.tcgdex.net/v2/fr/sets/${tcgdexId}`);
        if (!response.ok) {
            console.error("Failed to fetch from TCGDex", response.statusText);
            return [];
        }
        const data = await response.json();
        if (data && data.cards) {
            const formatCardName = (name: string) => {
                if (!name) return '';
                return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            };

            return data.cards.map((card: TcgdexCard) => ({
                number: `${card.localId}/${data.cardCount.official}`,
                name: formatCardName(card.name)
            }));
        }
        return [];
    } catch (e) {
        console.error("Error fetching cards from TCGDex", e);
        return [];
    }
}
