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
        sets: [
            { id: 'ToT2024', name: 'Trick or Trade 2024', shortName: 'ToT2024' },
            { id: 'ToT2023', name: 'Trick or Trade 2023', shortName: 'ToT2023' },
            { id: 'ToT2022', name: 'Trick or Trade 2022', shortName: 'ToT2022' },
            { id: 'CLB', name: 'Classic Blastoise & Suicune', shortName: 'CLB' },
            { id: 'CLC', name: 'Classic Charizard & Ho-Oh', shortName: 'CLC' },
            { id: 'CLV', name: 'Classic Venusaur & Lugia', shortName: 'CLV' },
            { id: 'DetecP', name: 'Détective Pikachu', shortName: 'DetecP' },
            { id: 'Futsal', name: 'Futsal', shortName: 'Futsal' },
            { id: 'ProAl', name: 'Promos Alternative', shortName: 'ProAl' },
            { id: 'Rumble', name: 'Rumble', shortName: 'Rumble' },
            { id: 'Creator', name: 'PokéCard Creator Pack', shortName: 'Creator' },
            { id: 'South', name: 'Southern Island Collection', shortName: 'South' },
            { id: 'NoNum', name: 'Promos Non Numérotées', shortName: 'NoNum' },
            { id: 'BestPro', name: 'Wizards Best Promo', shortName: 'BestPro' },
            { id: 'BoxTop', name: 'Box Topper', shortName: 'BoxTop' }
        ]
    },
    {
        id: 'ligue-pokemon',
        name: 'Ligue Pokémon',
        sets: [
            { id: 'Recomp', name: 'Pack Récompense', shortName: 'Récomp' },
            { id: 'Pop9', name: 'Pop9', shortName: 'Pop9' },
            { id: 'Pop8', name: 'Pop8', shortName: 'Pop8' },
            { id: 'Pop7', name: 'Pop7', shortName: 'Pop7' },
            { id: 'Pop6', name: 'Pop6', shortName: 'Pop6' },
            { id: 'Pop5', name: 'Pop5', shortName: 'Pop5' },
            { id: 'Pop4', name: 'Pop4', shortName: 'Pop4' },
            { id: 'Pop3', name: 'Pop3', shortName: 'Pop3' },
            { id: 'Pop2', name: 'Pop2', shortName: 'Pop2' },
            { id: 'Pop1', name: 'Pop1', shortName: 'Pop1' }
        ]
    },
    {
        id: 'jumbo',
        name: 'Jumbo',
        sets: [
            { id: 'Jumbo', name: 'Jumbo', shortName: 'Jumbo' }
        ]
    },
    {
        id: 'kit-dresseur',
        name: 'Kit du Dresseur',
        sets: [
            { id: 'Dark', name: 'Académie de Combat Darkrai', shortName: 'Dark' },
            { id: 'Pika24', name: 'Académie de Combat Pikachu 2024', shortName: 'Pika24' },
            { id: 'Carma', name: 'Académie de Combat Carmadura', shortName: 'Carma' },
            { id: 'Evoli', name: 'Académie de Combat Évoli', shortName: 'évoli' },
            { id: 'Pika22', name: 'Académie de Combat Pikachu 2022', shortName: 'Pika22' },
            { id: 'Pyro', name: 'Académie de Combat Pyrobut', shortName: 'Pyro' },
            { id: 'MewTwo', name: 'Académie de Combat Mewtwo', shortName: 'MewTwo' },
            { id: 'Pika20', name: 'Académie de Combat Pikachu 2020', shortName: 'Pika20' },
            { id: 'Drac', name: 'Académie de Combat Dracaufeu', shortName: 'Drac' },
            { id: 'KDSabl', name: 'Kit Dresseur Sablaireau D\'Alola', shortName: 'KDSabl' },
            { id: 'KDFeuna', name: 'Kit Dresseur Feunard D\'Alola', shortName: 'KDFeuna' },
            { id: 'KDRaich', name: 'Kit Dresseur Raichu D\'Alola', shortName: 'KDRaich' },
            { id: 'KDLouga', name: 'Kit Dresseur Lougaroc', shortName: 'KDLouga' },
            { id: 'KDSuicu', name: 'Kit Dresseur Suicune', shortName: 'KDSuicu' },
            { id: 'KDPika', name: 'Kit Dresseur Pikachu Catcheur', shortName: 'KDPika' },
            { id: 'Tios15', name: 'Kit Dresseur Latios 2015', shortName: 'Tios15' },
            { id: 'Tias15', name: 'Kit Dresseur Latias 2015', shortName: 'Tias15' },
            { id: 'Gdoudou', name: 'Kit Dresseur Grodoudou', shortName: 'Gdoudou' },
            { id: 'Sclp', name: 'Kit Dresseur Scalproie', shortName: 'Sclp' },
            { id: 'Bruyv', name: 'Kit Dresseur Bruyverne', shortName: 'Bruyv' },
            { id: 'Nymph', name: 'Kit Dresseur Nymphali', shortName: 'Nymph' },
            { id: 'Taupe', name: 'Kit Dresseur Minotaupe', shortName: 'Taupe' },
            { id: 'Zoroa', name: 'Kit Dresseur Zoroark', shortName: 'Zoroa' },
            { id: 'Raich', name: 'Kit Dresseur Raichu', shortName: 'Raich' },
            { id: 'Leviat', name: 'Kit Dresseur Léviator', shortName: 'Léviat' },
            { id: 'Manaph', name: 'Kit Dresseur Manaphy', shortName: 'Manaph' },
            { id: 'Lucar', name: 'Kit Dresseur Lucario', shortName: 'Lucar' },
            { id: 'Posip', name: 'Kit Dresseur Posipi', shortName: 'Posip' },
            { id: 'Negap', name: 'Kit Dresseur Négapi', shortName: 'Négap' },
            { id: 'Tios06', name: 'Kit Dresseur Latios 2006', shortName: 'Tios06' },
            { id: 'Tias06', name: 'Kit Dresseur Latias 2006', shortName: 'Tias06' }
        ]
    },
    {
        id: 'world-championships',
        name: 'World Championships',
        sets: [
            { id: 'WCS24', name: 'World Championships 2024', shortName: 'WCS24' },
            { id: 'WCS23', name: 'World Championships 2023', shortName: 'WCS23' },
            { id: 'WCS22', name: 'World Championships 2022', shortName: 'WCS22' },
            { id: 'WCS19', name: 'World Championships 2019', shortName: 'WCS19' },
            { id: 'WCS18', name: 'World Championships 2018', shortName: 'WCS18' },
            { id: 'WCS17', name: 'World Championships 2017', shortName: 'WCS17' },
            { id: 'WCS16', name: 'World Championships 2016', shortName: 'WCS16' },
            { id: 'WCS15', name: 'World Championships 2015', shortName: 'WCS15' },
            { id: 'WCS14', name: 'World Championships 2014', shortName: 'WCS14' },
            { id: 'WCS13', name: 'World Championships 2013', shortName: 'WCS13' },
            { id: 'WCS12', name: 'World Championships 2012', shortName: 'WCS12' },
            { id: 'WCS11', name: 'World Championships 2011', shortName: 'WCS11' },
            { id: 'WCS10', name: 'World Championships 2010', shortName: 'WCS10' },
            { id: 'WCS09', name: 'World Championships 2009', shortName: 'WCS09' },
            { id: 'WCS08', name: 'World Championships 2008', shortName: 'WCS08' },
            { id: 'WCS07', name: 'World Championships 2007', shortName: 'WCS07' },
            { id: 'WCS06', name: 'World Championships 2006', shortName: 'WCS06' },
            { id: 'WCS05', name: 'World Championships 2005', shortName: 'WCS05' },
            { id: 'WCS04', name: 'World Championships 2004', shortName: 'WCS04' }
        ]
    },
    {
        id: 'mcdonalds',
        name: 'Mcdonald\'s',
        sets: [
            { id: 'Mcdo24', name: 'Promo McDonald\'s 2024', shortName: 'Mcdo24' },
            { id: 'Mcdo23', name: 'Promo McDonald\'s 2023', shortName: 'Mcdo23' },
            { id: 'Mcdo22', name: 'Promo McDonald\'s 2022', shortName: 'Mcdo22' },
            { id: 'Mcdo21', name: 'Promo McDonald\'s 2021', shortName: 'Mcdo21' },
            { id: 'Mcdo19', name: 'Promo McDonald\'s 2019', shortName: 'Mcdo19' },
            { id: 'Mcdo19USA', name: 'Promo McDonald\'s 2019USA', shortName: 'Mcdo19USA' },
            { id: 'Mcdo18', name: 'Promo McDonald\'s 2018', shortName: 'Mcdo18' },
            { id: 'Mcdo18USA', name: 'Promo McDonald\'s 2018USA', shortName: 'Mcdo18USA' },
            { id: 'Mcdo17', name: 'Promo McDonald\'s 2017', shortName: 'Mcdo17' },
            { id: 'Mcdo16', name: 'Promo McDonald\'s 2016', shortName: 'Mcdo16' },
            { id: 'Mcdo15', name: 'Promo McDonald\'s 2015', shortName: 'Mcdo15' },
            { id: 'Mcdo14', name: 'Promo McDonald\'s 2014', shortName: 'Mcdo14' },
            { id: 'Mcdo13', name: 'Promo McDonald\'s 2013', shortName: 'Mcdo13' },
            { id: 'Mcdo12', name: 'Promo McDonald\'s 2012', shortName: 'Mcdo12' },
            { id: 'Mcdo11', name: 'Promo McDonald\'s 2011', shortName: 'Mcdo11' }
        ]
    },
    {
        id: 'divers',
        name: 'Divers',
        sets: [
            { id: 'Fetes25', name: 'Calendrier des fêtes 2025', shortName: 'Fêtes25' },
            { id: 'Fetes24', name: 'Calendrier des fêtes 2024', shortName: 'Fêtes24' },
            { id: 'Fetes23', name: 'Calendrier des fêtes 2023', shortName: 'Fêtes23' },
            { id: 'Fetes22', name: 'Calendrier des fêtes 2022', shortName: 'Fêtes22' },
            { id: 'Fetes10', name: 'Calendrier de l\'avent Pokémon 2010 Uberraschungskalender', shortName: 'Fêtes10' },
            { id: 'Fetes09', name: 'Calendrier de l\'avent Pokémon 2009', shortName: 'Fêtes09' },
            { id: 'Energy', name: 'Énergies', shortName: 'Energy' },
            { id: 'Art', name: 'Pokémon Art Academy', shortName: 'Art' },
            { id: 'Defi', name: 'Le Premier Défi', shortName: 'Défi' },
            { id: 'PikaWC2000', name: 'Pikachu World Collection', shortName: 'PikaWC2000' },
            { id: 'Topps', name: 'Topps', shortName: 'opps' },
            { id: 'PikaWC10', name: 'Pikachu World Collection 2010', shortName: 'PikaWC10' },
            { id: 'Lamin06', name: 'LaminCards 2006', shortName: 'Lamin06' },
            { id: 'Lamin05', name: 'LaminCards 2005', shortName: 'Lamin05' }
        ]
    }
];
