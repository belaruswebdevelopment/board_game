import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildRoyalCoins } from "./Coin";
import { initialCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { BuildDwarfCards } from "./Dwarf";
import { BuildHeroes } from "./Hero";
import { BuildMultiSuitCards } from "./MultiSuitCard";
import { BuildMythologicalCreatureCards, BuildMythologicalCreatureDecks } from "./MythologicalCreature";
import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { BuildRoyalOfferingCards } from "./RoyalOffering";
import { BuildSpecialCards } from "./SpecialCard";
import { GameModeNames, SuitNames } from "./typescript/enums";
import type { AIBotData, AllSecretData, BuildHeroesArray, CampCardArray, CampDecksLength, CanBeUndefType, DiscardCampCardType, DiscardDeckCardType, DiscardMythologicalCreatureCardType, Distinctions, DrawSizeType, DwarfCard, DwarfDecksLength, ExpansionsType, GameNamesKeyofTypeofType, GameSetupDataType, IndexOf, LogData, MultiSuitCard, MultiSuitPlayerCard, MyGameState, MythologicalCreatureCardType, PlayerID, Players, PlayersNumberTierCardData, Priority, PublicPlayers, RoyalCoin, RoyalOfferingCard, SecretAllCampDecks, SecretAllDwarfDecks, SecretCampDeckType, SecretDwarfDeckType, SpecialCard, SpecialPlayerCard, StrategyForSoloBotAndvari, SuitPropertyType, TavernsType, TierType } from "./typescript/interfaces";

/**
 * <h3>Инициализация игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Данные используются в игре.</li>
 * </ol>
 *
 * @param context
 * @returns Данные игры.
 */
export const SetupGame = ({ ctx, random }: GameSetupDataType): MyGameState => {
    // TODO Rework it!
    const mode: GameModeNames = ctx.numPlayers === 2 ? GameModeNames.Solo : ctx.numPlayers === 3
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
            Basic: {
                active: true,
            },
            Thingvellir: {
                active: mode === GameModeNames.Solo || mode === GameModeNames.SoloAndvari ? false : true,
            },
            // TODO Fix me to "true" after expansion finished
            Idavoll: {
                active: mode === GameModeNames.Solo || mode === GameModeNames.SoloAndvari ? false : false,
            },
        },
        totalScore: number[] = [],
        logData: LogData[] = [],
        odroerirTheMythicCauldronCoins: RoyalCoin[] = [],
        specialCardsDeck: SpecialCard[] = BuildSpecialCards(),
        configOptions: GameNamesKeyofTypeofType[] = [],
        discardCardsDeck: DiscardDeckCardType[] = [],
        explorerDistinctionCards = null,
        distinctions: SuitPropertyType<Distinctions> = {} as SuitPropertyType<Distinctions>,
        strategyForSoloBotAndvari: StrategyForSoloBotAndvari = {} as StrategyForSoloBotAndvari,
        secret: AllSecretData = {
            campDecks: [[], []],
            decks: [[], []],
            mythologicalCreatureDeck: [],
            mythologicalCreatureNotInGameDeck: [],
        };
    let suit: SuitNames;
    for (suit in suitsConfig) {
        distinctions[suit] = null;
    }
    const winner: number[] = [],
        campPicked = false,
        mustDiscardTavernCardJarnglofi = null,
        discardCampCardsDeck: DiscardCampCardType[] = [],
        discardMythologicalCreaturesCards: DiscardMythologicalCreatureCardType[] = [],
        discardMultiCards: MultiSuitPlayerCard[] = [],
        discardSpecialCards: SpecialPlayerCard[] = [],
        campDecksLength: CampDecksLength = [0, 0],
        camp: CampCardArray = Array(campNum).fill(null) as CampCardArray,
        // TODO DecksLength
        decksLength: DwarfDecksLength = [0, 0],
        mythologicalCreatureDeckForSkymir = null;
    for (let i = 0; i < tierToEnd; i++) {
        if (expansions.Thingvellir.active) {
            secret.campDecks[i] = BuildCampCards(i as TierType);
            let campDeck: SecretCampDeckType = secret.campDecks[i as IndexOf<SecretAllCampDecks>];
            campDeck = random.Shuffle(campDeck);
            secret.campDecks[i] = campDeck;
            campDecksLength[i] = campDeck.length;
            campDecksLength[0] = secret.campDecks[0].length;
        }
        secret.decks[i] = [];
        const data: PlayersNumberTierCardData = {
            players: ctx.numPlayers,
            tier: i as TierType,
        },
            dwarfDeck: DwarfCard[] = BuildDwarfCards(data),
            royalOfferingDeck: RoyalOfferingCard[] = BuildRoyalOfferingCards(data);
        let deck: SecretDwarfDeckType = secret.decks[i as IndexOf<SecretAllDwarfDecks>];
        deck = deck.concat(dwarfDeck, royalOfferingDeck);
        decksLength[i] = deck.length;
        secret.decks[i] = random.Shuffle(deck);
    }
    let expansion: GameNamesKeyofTypeofType;
    for (expansion in expansions) {
        if (expansions[expansion].active) {
            configOptions.push(expansion);
        }
    }
    const [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel, heroesInitialForSoloGameForBotAndvari]:
        BuildHeroesArray = BuildHeroes(configOptions, mode),
        heroesForSoloGameForStrategyBotAndvari = null,
        multiCardsDeck: MultiSuitCard[] = BuildMultiSuitCards(configOptions),
        taverns: TavernsType = [[], [], []],
        tavernsNum = 3,
        currentTavern = 0;
    decksLength[0] = secret.decks[0].length;
    let mythologicalCreatureDeckLength = 0,
        mythologicalCreatureNotInGameDeckLength = 0;
    if (expansions.Idavoll.active) {
        let mythologicalCreatureCardsDeck: MythologicalCreatureCardType[] = BuildMythologicalCreatureCards();
        mythologicalCreatureCardsDeck = random.Shuffle(mythologicalCreatureCardsDeck);
        [secret.mythologicalCreatureDeck, secret.mythologicalCreatureNotInGameDeck] =
            BuildMythologicalCreatureDecks(mythologicalCreatureCardsDeck, ctx.numPlayers);
        // TODO Add Idavoll decks length info on main page?
        mythologicalCreatureDeckLength = secret.mythologicalCreatureDeck.length;
        mythologicalCreatureNotInGameDeckLength = secret.mythologicalCreatureNotInGameDeck.length;
    }
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = Array(drawSize).fill(null);
    }
    const players: Players = {},
        publicPlayers: PublicPlayers = {},
        publicPlayersOrder: PlayerID[] = [],
        exchangeOrder: number[] = [],
        priorities: Priority[] = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers, mode === GameModeNames.Solo);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex: number =
            mode === GameModeNames.Solo ? 0 : Math.floor(Math.random() * priorities.length),
            priority: CanBeUndefType<Priority> = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        players[i] = BuildPlayer();
        const soloBot: boolean = (mode === GameModeNames.Solo || mode === GameModeNames.SoloAndvari) && i === 1;
        publicPlayers[i] =
            BuildPublicPlayer(soloBot ? `SoloBot` : `Dan${i}`, priority,
                soloBot || mode === GameModeNames.Multiplayer);
    }
    const royalCoinsUnique: RoyalCoin[] = [],
        royalCoins: RoyalCoin[] = BuildRoyalCoins({
            count: royalCoinsUnique,
            players: ctx.numPlayers,
        }),
        averageCards: SuitPropertyType<DwarfCard> = {} as SuitPropertyType<DwarfCard>;
    for (suit in suitsConfig) {
        averageCards[suit] = GetAverageSuitCard(suit, {
            players: ctx.numPlayers,
            tier: 0,
        });
    }
    const initHandCoinsId: number[] = Array(initialCoinsConfig.length).fill(undefined)
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
    const botData: AIBotData = {
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
        decksLength,
        campDecksLength,
        mythologicalCreatureDeckLength,
        mythologicalCreatureNotInGameDeckLength,
        mythologicalCreatureDeckForSkymir,
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
        royalCoins,
        royalCoinsUnique,
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
