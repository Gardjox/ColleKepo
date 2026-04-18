export interface PokemonSet {
    id: string;
    name: string;
    shortName: string;
}

export interface PokemonSeries {
    id: string;
    name: string;
    sets: PokemonSet[];
}

export const POKEMON_SERIES: PokemonSeries[] = [
    {
        id: 'mega-evolution',
        name: 'Méga-Évolution',
        sets: [
            { id: 'ME2.5', name: 'ME2.5 Héros Transcendants', shortName: 'ME2.5' },
            { id: 'ME2', name: 'ME2 Flammes Fantasmagoriques', shortName: 'ME2' },
            { id: 'ME1', name: 'ME1 Méga-Évolution', shortName: 'ME1' },
            { id: 'MEPromos', name: 'MEPromos', shortName: 'MEPromos' },
        ]
    },
    {
        id: 'ecarlate-violet',
        name: 'Écarlate et Violet',
        sets: [
            { id: 'EV10.5-BLK', name: 'EV10.5 BLK Foudre Noire', shortName: 'EV10.5 BLK' },
            { id: 'EV10.5-WHT', name: 'EV10.5 WHT Flamme Banche', shortName: 'EV10.5 WHT' },
            { id: 'EV10', name: 'EV10 Rivalités Destinées', shortName: 'EV10' },
            { id: 'EV9', name: 'EV9 Aventures Ensemble', shortName: 'EV9' },
            { id: 'EV8.5', name: 'EV8.5 Évolutions Prismatiques', shortName: 'EV8.5' },
            { id: 'EV8', name: 'EV8 Étincelles Déferlantes', shortName: 'EV8' },
            { id: 'EV7', name: 'EV7 Couronnes Stellaire', shortName: 'EV7' },
            { id: 'EV6.5', name: 'EV6.5 Fable Nébuleuse', shortName: 'EV6.5' },
            { id: 'EV6', name: 'EV6 Mascarade Crépusculaire', shortName: 'EV6' },
            { id: 'EV5', name: 'EV5 Forces Temporelles', shortName: 'EV5' },
            { id: 'EV4.5', name: 'EV4.5 Destinées de Paldea', shortName: 'EV4.5' },
            { id: 'EV4', name: 'EV4 Faille Paradoxe', shortName: 'EV4' },
            { id: 'EV3.5', name: 'EV3.5 151', shortName: 'EV3.5' },
            { id: 'EV3', name: 'EV3 Flammes Obsidiennes', shortName: 'EV3' },
            { id: 'EV2', name: 'EV2 Évolutions à Paldea', shortName: 'EV2' },
            { id: 'EV1', name: 'EV1 Écarlate et Violet de base', shortName: 'EV1' },
            { id: 'EVPromos', name: 'EVPromos', shortName: 'EVPromos' },
        ]
    },
    {
        id: 'epee-bouclier',
        name: 'Épée et Bouclier',
        sets: [
            { id: 'EB12.5', name: 'EB12.5 Zénith Suprême', shortName: 'EB12.5' },
            { id: 'EB12', name: 'EB12 Tempête Argentée', shortName: 'EB12' },
            { id: 'EB11', name: 'EB11 Origine Perdue', shortName: 'EB11' },
            { id: 'EB10.5', name: 'EB10.5 Pokémon GO', shortName: 'EB10.5' },
            { id: 'EB10', name: 'EB10 Astres Radieux', shortName: 'EB10' },
            { id: 'EB9', name: 'EB9 Stars Étincelantes', shortName: 'EB9' },
            { id: 'EB8', name: 'EB8 Poing de Fusion', shortName: 'EB8' },
            { id: 'EB7.5', name: 'EB7.5 Célébrations', shortName: 'EB7.5' },
            { id: 'EB7', name: 'EB7 Évolution Céleste', shortName: 'EB7' },
            { id: 'EB6', name: 'EB6 Règne de Glace', shortName: 'EB6' },
            { id: 'EB5', name: 'EB5 Styles de Combat', shortName: 'EB5' },
            { id: 'EB4.5', name: 'EB4.5 Destinées Radieuses', shortName: 'EB4.5' },
            { id: 'EB4', name: 'EB4 Voltage Éclatant', shortName: 'EB4' },
            { id: 'EB3.5', name: 'EB3.5 La Voie du Maître', shortName: 'EB3.5' },
            { id: 'EB3', name: 'EB3 Ténèbres Embrasées', shortName: 'EB3' },
            { id: 'EB2', name: 'EB2 Clash des Rebelles', shortName: 'EB2' },
            { id: 'EB1', name: 'EB1 Épée et Bouclier de base', shortName: 'EB1' },
            { id: 'EBPromos', name: 'EBPromos', shortName: 'EBPromos' },
        ]
    },
    {
        id: 'soleil-lune',
        name: 'Soleil et Lune',
        sets: [
            { id: 'SL12', name: 'SL12 Éclipse Cosmique', shortName: 'SL12' },
            { id: 'SL11.5', name: 'SL11.5 Destinées Occultes', shortName: 'SL11.5' },
            { id: 'SL11', name: 'SL11 Harmonie des Esprits', shortName: 'SL11' },
            { id: 'SL10', name: 'SL10 Alliance Infaillible', shortName: 'SL10' },
            { id: 'SL9', name: 'SL9 Duo de Choc', shortName: 'SL9' },
            { id: 'SL8', name: 'SL8 Tonnerre Perdu', shortName: 'SL8' },
            { id: 'SL7.5', name: 'SL7.5 Majesté des Dragons', shortName: 'SL7.5' },
            { id: 'SL7', name: 'SL7 Tempête Céleste', shortName: 'SL7' },
            { id: 'SL6', name: 'SL6 Lumière Interdite', shortName: 'SL6' },
            { id: 'SL5', name: 'SL5 Ultra Prisme', shortName: 'SL5' },
            { id: 'SL4', name: 'SL4 Invasion Carmin', shortName: 'SL4' },
            { id: 'SL3.5', name: 'SL3.5 Légendes Brillantes', shortName: 'SL3.5' },
            { id: 'SL3', name: 'SL3 Ombres Ardentes', shortName: 'SL3' },
            { id: 'SL2', name: 'SL2 Gardiens Ascendants', shortName: 'SL2' },
            { id: 'SL1', name: 'SL Soleil et Lune de base', shortName: 'SL' },
            { id: 'SLPromos', name: 'SLPromos', shortName: 'SLPromos' },
        ]
    },
    {
        id: 'xy',
        name: 'XY',
        sets: [
            { id: 'XYEvo', name: 'XYEvo Evolutions', shortName: 'XYEvo' },
            { id: 'XYOV', name: 'XYOV Offensive Vapeur', shortName: 'XYOV' },
            { id: 'XYIDD', name: 'XYIDD Impact des Destins', shortName: 'XYIDD' },
            { id: 'XYG', name: 'XYG Générations', shortName: 'XYG' },
            { id: 'XYRT', name: 'XYRT Rupture Turbo', shortName: 'XYRT' },
            { id: 'XYIT', name: 'XYIT Impulsion Turbo', shortName: 'XYIT' },
            { id: 'XYOA', name: 'XYOA Origines Antiques', shortName: 'XYOA' },
            { id: 'XYCR', name: 'XYCR Ciel Rugissant', shortName: 'XYCR' },
            { id: 'XYDD', name: 'XYDD Double Danger', shortName: 'XYDD' },
            { id: 'XYPC', name: 'XYPC Primo Choc', shortName: 'XYPC' },
            { id: 'XYVS', name: 'XYVS Vigueur Spectrale', shortName: 'XYVS' },
            { id: 'XYPF', name: 'XYPF Poings Furieux', shortName: 'XYPF' },
            { id: 'XYE', name: 'XYE Étincelles', shortName: 'XYE' },
            { id: 'XY', name: 'XY XY de base', shortName: 'XY' },
            { id: 'XYBVN', name: 'XYBVN Bienvenue à Kalos', shortName: 'XYBVN' },
            { id: 'XYPromos', name: 'XYPromos', shortName: 'XYPromos' },
        ]
    },
    {
        id: 'noir-blanc',
        name: 'Noir et Blanc',
        sets: [
            { id: 'NBLT', name: 'NBLT Legendary Treasures', shortName: 'NBLT' },
            { id: 'NBEP', name: 'NBEP Explosion Plasma', shortName: 'NBEP' },
            { id: 'NBGP', name: 'NBGP Glaciation Plasma', shortName: 'NBGP' },
            { id: 'NBTP', name: 'NBTP Tempête Plasma', shortName: 'NBTP' },
            { id: 'NBFF', name: 'NBFF Frontières Franchies', shortName: 'NBFF' },
            { id: 'CDD', name: 'CDD Coffre des Dragons', shortName: 'CDD' },
            { id: 'NBDE', name: 'NBDE Dragons Exaltés', shortName: 'NBDE' },
            { id: 'NBEO', name: 'NBEO Explorateurs Obscurs', shortName: 'NBEO' },
            { id: 'NBDF', name: 'NBDF Destinées Futures', shortName: 'NBDF' },
            { id: 'NBNV', name: 'NBNV Nobles Victoires', shortName: 'NBNV' },
            { id: 'NBPE', name: 'NBPE Pouvoirs Émergents', shortName: 'NBPE' },
            { id: 'NB', name: 'NB Noir et Blanc de base', shortName: 'NB' },
            { id: 'NBPromos', name: 'NBPromos', shortName: 'NBPromos' },
        ]
    },
    {
        id: 'appel-legendes',
        name: 'Appel des légendes',
        sets: [
            { id: 'ADL', name: 'ADL L\'appel des Légendes', shortName: 'ADL' },
        ]
    },
    {
        id: 'hgsold-soulsilver',
        name: 'HeartGold SoulSilver',
        sets: [
            { id: 'HST', name: 'HST Triomphe', shortName: 'HST' },
            { id: 'HSI', name: 'HSI Indomptable', shortName: 'HSI' },
            { id: 'HSD', name: 'HSD Déchainement', shortName: 'HSD' },
            { id: 'HGSS', name: 'HGSS HeartGold Soulsilver de base', shortName: 'HGSS' },
            { id: 'HGSSPromos', name: 'HGSSPromos', shortName: 'HGSSPromos' },
        ]
    },
    {
        id: 'platine',
        name: 'Platine',
        sets: [
            { id: 'PLA', name: 'PLA Arceus', shortName: 'PLA' },
            { id: 'PLVS', name: 'PLVS Vainqueurs Suprêmes', shortName: 'PLVS' },
            { id: 'PLRE', name: 'PLRE Rivaux Émergeants', shortName: 'PLRE' },
            { id: 'PL', name: 'PL Platine de base', shortName: 'PL' },
        ]
    },
    {
        id: 'diamant-perle',
        name: 'Diamant et Perle',
        sets: [
            { id: 'DPT', name: 'DPT Tempête', shortName: 'DPT' },
            { id: 'DPEDL', name: 'DPEDL Éveil des Légendes', shortName: 'DPEDL' },
            { id: 'DPAM', name: 'DPAM Aube Majestueuse', shortName: 'DPAM' },
            { id: 'DPDS', name: 'DPDS Duels au Sommets', shortName: 'DPDS' },
            { id: 'DPMS', name: 'DPMS Merveilles Secrètes', shortName: 'DPMS' },
            { id: 'DPTM', name: 'DPTM Trésors Mystérieux', shortName: 'DPTM' },
            { id: 'DP', name: 'DP Diamant et Perle de Base', shortName: 'DP' },
            { id: 'DPPromos', name: 'DPPromos', shortName: 'DPPromos' },
        ]
    },
    {
        id: 'ex',
        name: 'EX',
        sets: [
            { id: 'ExGDP', name: 'ExGDP Gardiens du Pouvoir', shortName: 'ExGDP' },
            { id: 'ExIDD', name: 'ExIDD Île des Dragons', shortName: 'ExIDD' },
            { id: 'ExGDC', name: 'ExGDC Gardiens de Cristal', shortName: 'ExGDC' },
            { id: 'ExFH', name: 'ExFH Fantômes Holon', shortName: 'ExFH' },
            { id: 'ExCDL', name: 'ExCDL Créateurs de légendes', shortName: 'ExCDL' },
            { id: 'ExED', name: 'ExED Espèces Delta', shortName: 'ExED' },
            { id: 'ExFC', name: 'ExFC Forces Cachées', shortName: 'ExFC' },
            { id: 'ExE', name: 'ExÉ Émeraude', shortName: 'ExÉ' },
            { id: 'ExDEO', name: 'ExDEO Deoxys', shortName: 'ExDEO' },
            { id: 'ExTRR', name: 'ExTRR Team Rocket Returns', shortName: 'ExTRR' },
            { id: 'ExRFVF', name: 'ExRFVF Rouge Feu Vert Feuille', shortName: 'ExRFVF' },
            { id: 'ExLO', name: 'ExLO Légendes Oubliées', shortName: 'ExLO' },
            { id: 'ExTMTA', name: 'ExTMTA Team Magma Team Aqua', shortName: 'ExTMTA' },
            { id: 'ExDRA', name: 'ExDRA Dragon', shortName: 'ExDRA' },
            { id: 'ExTDS', name: 'ExTDS Tempête de Sable', shortName: 'ExTDS' },
            { id: 'ExRS', name: 'ExRS Rubis et Saphir', shortName: 'ExRS' },
            { id: 'EXPromos', name: 'EXPromos', shortName: 'EXPromos' },
        ]
    },
    {
        id: 'wizards',
        name: 'Wizards',
        sets: [
            { id: 'Skyridge', name: 'Skyridge', shortName: 'Skyridge' },
            { id: 'Aquapolis', name: 'Aquapolis', shortName: 'Aquapolis' },
            { id: 'Expedition', name: 'Expedition', shortName: 'Expedition' },
            { id: 'Legendary-Collection', name: 'Legendary Collection', shortName: 'Legendary Collection' },
            { id: 'Neo-Destiny', name: 'Neo Destiny', shortName: 'Neo Destiny' },
            { id: 'Neo-Revelation', name: 'Neo Revelation', shortName: 'Neo Revelation' },
            { id: 'Neo-Discovery', name: 'Neo Discovery', shortName: 'Neo Discovery' },
            { id: 'Neo-Genesis', name: 'Neo Genesis', shortName: 'Neo Genesis' },
            { id: 'Gym-Challenge', name: 'Gym Challenge', shortName: 'Gym Challenge' },
            { id: 'Gym-Heroes', name: 'Gym Heroes', shortName: 'Gym Heroes' },
            { id: 'Team-Rocket', name: 'Team Rocket', shortName: 'Team Rocket' },
            { id: 'Set-de-Base-ed2', name: 'Set de Base ed2', shortName: 'Set de Base ed2' },
            { id: 'Fossile', name: 'Fossile', shortName: 'Fossile' },
            { id: 'Jungle', name: 'Jungle', shortName: 'Jungle' },
            { id: 'Set-de-Base-e1', name: 'Set de Base e1', shortName: 'Set de Base e1' },
            { id: 'WizardsPromos', name: 'WizardsPromos', shortName: 'WizardsPromos' },
        ]
    },
    {
        id: 'promos',
        name: 'Promos',
        sets: []
    }
];
