export interface TcgdexCard {
    id: string;
    localId: string;
    name: string;
    image?: string;
}

export function getTcgdexSetId(setId: string): string {
    const map: Record<string, string> = {
        // XY Series
        'XYEvo': 'xy12',
        'XYOV': 'xy11',
        'XYIDD': 'xy10',
        'XYG': 'g1',
        'XYRT': 'xy9',
        'XYIT': 'xy8',
        'XYOA': 'xy7',
        'XYCR': 'xy6',
        'XYDD': 'dc1',
        'XYPC': 'xy5',
        'XYVS': 'xy4',
        'XYPF': 'xy3',
        'XYE': 'xy2',
        'XY': 'xy1',
        'XYBVN': 'xy0',
        'XYPromos': 'xyp',

        // Black & White (Noir & Blanc) Series
        'NBPromos': 'bwp',
        'NB': 'bw1',
        'NBPE': 'bw2',
        'NBNV': 'bw3',
        'NBDF': 'bw4',
        'NBEO': 'bw5',
        'NBDE': 'bw6',
        'CDD': 'dv1',
        'NBFF': 'bw7',
        'NBTP': 'bw8',
        'NBGP': 'bw9',
        'NBEP': 'bw10',
        'NBLT': 'bw11',

        // Call of Legends (Appel des légendes)
        'ADL': 'col1',

        // HGSS Series
        'HGSSPromos': 'hgssp',
        'HGSS': 'hgss1',
        'HSD': 'hgss2',
        'HSI': 'hgss3',
        'HST': 'hgss4',

        // Platinum (Platine) Series
        'PL': 'pl1',
        'PLRE': 'pl2',
        'PLVS': 'pl3',
        'PLA': 'pl4',

        // Diamond & Pearl (Diamant & Perle) Series
        'DPPromos': 'dpp',
        'DP': 'dp1',
        'DPTM': 'dp2',
        'DPMS': 'dp3',
        'DPDS': 'dp4',
        'DPAM': 'dp5',
        'DPEDL': 'dp6',
        'DPT': 'dp7',

        // EX Series
        'EXPromos': 'np',
        'ExRS': 'ex1',
        'ExTDS': 'ex2',
        'ExDRA': 'ex3',
        'ExTMTA': 'ex4',
        'ExLO': 'ex5',
        'ExRFVF': 'ex6',
        'ExTRR': 'ex7',
        'ExDEO': 'ex8',
        'ExE': 'ex9',
        'ExFC': 'ex10',
        'ExED': 'ex11',
        'ExCDL': 'ex12',
        'ExFH': 'ex13',
        'ExGDC': 'ex14',
        'ExIDD': 'ex15',
        'ExGDP': 'ex16',

        // Wizards Series
        'WizardsPromos': 'basep',
        'Set-de-Base-e1': 'base1',
        'Jungle': 'base2',
        'Fossile': 'base3',
        'Team-Rocket': 'base5',
        'Neo-Genesis': 'neo1',
        'Neo-Discovery': 'neo2',
        'Neo-Revelation': 'neo3',
        'Neo-Destiny': 'neo4',
        'Expedition': 'ecard1',
        'Aquapolis': 'ecard2',

        // Promos & other standard ones
        'SLPromos': 'smp',
        'EBPromos': 'swshp',
        'EVPromos': 'svp',
        'MEPromos': 'mep',
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

    return lower;
}

export async function fetchCardsForSet(setId: string): Promise<{ number: string; name: string }[]> {
    try {
        const tcgdexId = getTcgdexSetId(setId);
        let response = await fetch(`https://api.tcgdex.net/v2/fr/sets/${tcgdexId}`);
        if (!response.ok) {
            // Fallback to English if French set is not available
            response = await fetch(`https://api.tcgdex.net/v2/en/sets/${tcgdexId}`);
        }
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

            const maxCards = data.cardCount?.official || data.cardCount?.total || data.cards.length;

            return data.cards.map((card: TcgdexCard) => ({
                number: `${card.localId}/${maxCards}`,
                name: formatCardName(card.name)
            }));
        }
        return [];
    } catch (e) {
        console.error("Error fetching cards from TCGDex", e);
        return [];
    }
}
