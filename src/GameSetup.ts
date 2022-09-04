import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildCoins } from "./Coin";
import { initialPlayerCoinsConfig, marketCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { BuildDwarfCards } from "./Dwarf";
import { BuildHeroes } from "./Hero";
import { BuildMultiSuitCards } from "./MultiSuitCard";
import { BuildMythologicalCreatureCards } from "./MythologicalCreature";
import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { BuildRoyalOfferingCards } from "./RoyalOffering";
import { BuildSpecialCards } from "./SpecialCard";
import { GameModeNames } from "./typescript/enums";
import type { BuildHeroesArraysType, CampDeckCardType, CanBeUndefType, Ctx, DeckCardType, DistinctionType, DrawSizeType, ExpansionsType, GameNamesKeyofTypeofType, IBotData, ICoin, IDwarfCard, ILogData, IMultiSuitCard, IMultiSuitPlayerCard, IMyGameState, IndexOf, IPlayers, IPlayersNumberTierCardData, IPriority, IPublicPlayers, IRoyalOfferingCard, ISecret, ISpecialCard, IStrategyForSoloBotAndvari, MythologicalCreatureDeckCardType, NumPlayersType, SecretCampDecksType, SecretDecksType, SuitNamesKeyofTypeofType, SuitPropertyType, TavernsType, TierType } from "./typescript/interfaces";

/**
 * <h3>Инициализация игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Данные используются в игре.</li>
 * </ol>
 *
 * @param ctx
 * @returns Данные игры.
 */
export const SetupGame = (ctx: Ctx): IMyGameState => {
    // TODO Rework it!
    const mode: GameModeNames = ctx.numPlayers === 2 ? GameModeNames.Solo1 : ctx.numPlayers === 3
        ? GameModeNames.SoloAndvari : ctx.numPlayers === 4 ? GameModeNames.Multiplayer : GameModeNames.Basic,
        suitsNum = 5,
        tierToEnd = 2,
        campNum = 5,
        round = -1,
        drawSize: DrawSizeType = ctx.numPlayers === 2 ? 3 : ctx.numPlayers,
        soloGameDifficultyLevel = null,
        soloGameAndvariStrategyLevel = null,
        soloGameAndvariStrategyVariantLevel = null,
        explorerDistinctionCardId = null,
        // TODO Rework it!
        odroerirTheMythicCauldron = false,
        log = true,
        debug = false,
        tavernCardDiscarded2Players = false,
        drawProfit = null,
        expansions: ExpansionsType = {
            basic: {
                active: true,
            },
            thingvellir: {
                active: mode === GameModeNames.Solo1 || mode === GameModeNames.SoloAndvari ? false : true,
            },
            // TODO Fix me to "true" after expansion finished
            idavoll: {
                active: mode === GameModeNames.Solo1 || mode === GameModeNames.SoloAndvari ? false : false,
            },
        },
        totalScore: number[] = [],
        logData: ILogData[] = [],
        odroerirTheMythicCauldronCoins: ICoin[] = [],
        specialCardsDeck: ISpecialCard[] = BuildSpecialCards(),
        configOptions: GameNamesKeyofTypeofType[] = [],
        discardCardsDeck: DeckCardType[] = [],
        explorerDistinctionCards = null,
        distinctions: SuitPropertyType<DistinctionType> = {} as SuitPropertyType<DistinctionType>,
        strategyForSoloBotAndvari: IStrategyForSoloBotAndvari = {} as IStrategyForSoloBotAndvari,
        secret: ISecret = {
            campDecks: [[], []],
            decks: [[], []],
            mythologicalCreatureDecks: [],
        };
    let suit: SuitNamesKeyofTypeofType;
    for (suit in suitsConfig) {
        distinctions[suit] = null;
    }
    const winner: number[] = [],
        campPicked = false,
        mustDiscardTavernCardJarnglofi = null,
        discardCampCardsDeck: CampDeckCardType[] = [],
        discardMythologicalCreaturesCards: MythologicalCreatureDeckCardType[] = [],
        discardMultiCards: IMultiSuitPlayerCard[] = [],
        discardSpecialCards: ISpecialCard[] = [],
        campDeckLength: [number, number] = [0, 0],
        camp: CampDeckCardType[] = Array(campNum).fill(null),
        deckLength: [number, number] = [0, 0];
    for (let i = 0; i < tierToEnd; i++) {
        if (expansions.thingvellir.active) {
            secret.campDecks[i] = BuildCampCards(i as TierType);
            let campDeck: CampDeckCardType[] = secret.campDecks[i as IndexOf<SecretCampDecksType>];
            campDeck = ctx.random!.Shuffle(campDeck);
            secret.campDecks[i] = campDeck;
            campDeckLength[i] = campDeck.length;
            campDeckLength[0] = secret.campDecks[0].length;
        }
        secret.decks[i] = [];
        const data: IPlayersNumberTierCardData = {
            players: ctx.numPlayers,
            tier: i as TierType,
        },
            dwarfDeck: IDwarfCard[] = BuildDwarfCards(data),
            royalOfferingDeck: IRoyalOfferingCard[] = BuildRoyalOfferingCards(data);
        let deck: DeckCardType[] = secret.decks[i as IndexOf<SecretDecksType>];
        deck = deck.concat(dwarfDeck, royalOfferingDeck);
        deckLength[i] = deck.length;
        secret.decks[i] = ctx.random!.Shuffle(deck);
    }
    let expansion: GameNamesKeyofTypeofType;
    for (expansion in expansions) {
        if (expansions[expansion].active) {
            configOptions.push(expansion);
        }
    }
    const [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel, heroesInitialForSoloGameForBotAndvari]:
        BuildHeroesArraysType = BuildHeroes(configOptions, mode),
        heroesForSoloGameForStrategyBotAndvari = null,
        multiCardsDeck: IMultiSuitCard[] = BuildMultiSuitCards(configOptions),
        taverns: TavernsType = [[], [], []],
        tavernsNum = 3,
        currentTavern = 0;
    deckLength[0] = secret.decks[0].length;
    let mythologicalCreatureDeckLength = 0;
    if (expansions.idavoll.active) {
        secret.mythologicalCreatureDecks = BuildMythologicalCreatureCards();
        secret.mythologicalCreatureDecks = ctx.random!.Shuffle(secret.mythologicalCreatureDecks);
        // TODO Add Idavoll deck length info on main page?
        mythologicalCreatureDeckLength = secret.mythologicalCreatureDecks.length;
    }
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = Array(drawSize).fill(null);
    }
    const players: IPlayers = {},
        publicPlayers: IPublicPlayers = {},
        publicPlayersOrder: string[] = [],
        exchangeOrder: number[] = [],
        priorities: IPriority[] = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers as NumPlayersType,
            mode === GameModeNames.Solo1);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex: number =
            mode === GameModeNames.Solo1 ? 0 : Math.floor(Math.random() * priorities.length),
            priority: CanBeUndefType<IPriority> = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        players[i] = BuildPlayer();
        const soloBot: boolean = (mode === GameModeNames.Solo1 || mode === GameModeNames.SoloAndvari) && i === 1;
        publicPlayers[i] =
            BuildPublicPlayer(soloBot ? `SoloBot` : `Dan${i}`, priority,
                soloBot || mode === GameModeNames.Multiplayer);
    }
    const marketCoinsUnique: ICoin[] = [],
        marketCoins: ICoin[] = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
        }),
        averageCards: SuitPropertyType<IDwarfCard> = {} as SuitPropertyType<IDwarfCard>;
    for (suit in suitsConfig) {
        averageCards[suit] = GetAverageSuitCard(suitsConfig[suit], {
            players: ctx.numPlayers,
            tier: 0,
        });
    }
    const initHandCoinsId: number[] = Array(initialPlayerCoinsConfig.length).fill(undefined)
        .map((item: undefined, index: number): number => index),
        initCoinsOrder: number[][] = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder: number[][] = [];
    for (let i = 0; i < initCoinsOrder.length; i++) {
        const coinsOrder: CanBeUndefType<number[]> = initCoinsOrder[i];
        if (coinsOrder === undefined) {
            throw new Error(`Отсутствует порядок выкладки монет ${i}.`);
        }
        allCoinsOrder = allCoinsOrder.concat(Permute(coinsOrder));
    }
    const botData: IBotData = {
        allCoinsOrder,
        allPicks: GetAllPicks(tavernsNum, ctx.numPlayers),
        maxIter: 1000,
        deckLength: secret.decks[0].length,
    };
    return {
        mode,
        soloGameDifficultyLevel,
        soloGameAndvariStrategyLevel,
        soloGameAndvariStrategyVariantLevel,
        odroerirTheMythicCauldron,
        tavernCardDiscarded2Players,
        averageCards,
        botData,
        odroerirTheMythicCauldronCoins,
        camp,
        explorerDistinctionCards,
        explorerDistinctionCardId,
        deckLength,
        campDeckLength,
        mythologicalCreatureDeckLength,
        secret,
        campNum,
        campPicked,
        mustDiscardTavernCardJarnglofi,
        currentTavern,
        debug,
        multiCardsDeck,
        specialCardsDeck,
        discardCampCardsDeck,
        discardCardsDeck,
        discardMythologicalCreaturesCards,
        discardMultiCards,
        discardSpecialCards,
        distinctions,
        drawProfit,
        drawSize,
        exchangeOrder,
        expansions,
        heroes,
        heroesForSoloBot,
        heroesForSoloGameDifficultyLevel,
        heroesInitialForSoloGameForBotAndvari,
        heroesForSoloGameForStrategyBotAndvari,
        strategyForSoloBotAndvari,
        log,
        logData,
        marketCoins,
        marketCoinsUnique,
        round,
        suitsNum,
        taverns,
        tavernsNum,
        tierToEnd,
        totalScore,
        players,
        publicPlayers,
        publicPlayersOrder,
        winner,
    };
};
