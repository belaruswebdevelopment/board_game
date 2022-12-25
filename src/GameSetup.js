import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildCoins } from "./Coin";
import { initialPlayerCoinsConfig, marketCoinsConfig } from "./data/CoinData";
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
export const SetupGame = ({ ctx, random }) => {
    // TODO Rework it!
    const mode = ctx.numPlayers === 2 ? GameModeNames.Solo : ctx.numPlayers === 3
        ? GameModeNames.SoloAndvari : ctx.numPlayers === 4 ? GameModeNames.Multiplayer : GameModeNames.Basic, suitsNum = 5, tierToEnd = 2, campNum = 5, round = -1, drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers, soloGameDifficultyLevel = null, soloGameAndvariStrategyLevel = null, soloGameAndvariStrategyVariantLevel = null, explorerDistinctionCardId = null, 
    // TODO Rework it!
    odroerirTheMythicCauldron = false, log = true, debug = false, tavernCardDiscarded2Players = false, drawProfit = null, expansions = {
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
    }, totalScore = [], logData = [], odroerirTheMythicCauldronCoins = [], specialCardsDeck = BuildSpecialCards(), configOptions = [], discardCardsDeck = [], explorerDistinctionCards = null, distinctions = {}, strategyForSoloBotAndvari = {}, secret = {
        campDecks: [[], []],
        decks: [[], []],
        mythologicalCreatureDeck: [],
        mythologicalCreatureNotInGameDeck: [],
    };
    let suit;
    for (suit in suitsConfig) {
        distinctions[suit] = null;
    }
    const winner = [], campPicked = false, mustDiscardTavernCardJarnglofi = null, discardCampCardsDeck = [], discardMythologicalCreaturesCards = [], discardMultiCards = [], discardSpecialCards = [], campDeckLength = [0, 0], camp = Array(campNum).fill(null), deckLength = [0, 0], mythologicalCreatureDeckForSkymir = null;
    for (let i = 0; i < tierToEnd; i++) {
        if (expansions.Thingvellir.active) {
            secret.campDecks[i] = BuildCampCards(i);
            let campDeck = secret.campDecks[i];
            campDeck = random.Shuffle(campDeck);
            secret.campDecks[i] = campDeck;
            campDeckLength[i] = campDeck.length;
            campDeckLength[0] = secret.campDecks[0].length;
        }
        secret.decks[i] = [];
        const data = {
            players: ctx.numPlayers,
            tier: i,
        }, dwarfDeck = BuildDwarfCards(data), royalOfferingDeck = BuildRoyalOfferingCards(data);
        let deck = secret.decks[i];
        deck = deck.concat(dwarfDeck, royalOfferingDeck);
        deckLength[i] = deck.length;
        secret.decks[i] = random.Shuffle(deck);
    }
    let expansion;
    for (expansion in expansions) {
        if (expansions[expansion].active) {
            configOptions.push(expansion);
        }
    }
    const [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel, heroesInitialForSoloGameForBotAndvari] = BuildHeroes(configOptions, mode), heroesForSoloGameForStrategyBotAndvari = null, multiCardsDeck = BuildMultiSuitCards(configOptions), taverns = [[], [], []], tavernsNum = 3, currentTavern = 0;
    deckLength[0] = secret.decks[0].length;
    let mythologicalCreatureDeckLength = 0, mythologicalCreatureNotInGameDeckLength = 0;
    if (expansions.Idavoll.active) {
        let mythologicalCreatureCardsDeck = BuildMythologicalCreatureCards();
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
    const players = {}, publicPlayers = {}, publicPlayersOrder = [], exchangeOrder = [], priorities = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers, mode === GameModeNames.Solo);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex = mode === GameModeNames.Solo ? 0 : Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        players[i] = BuildPlayer();
        const soloBot = (mode === GameModeNames.Solo || mode === GameModeNames.SoloAndvari) && i === 1;
        publicPlayers[i] =
            BuildPublicPlayer(soloBot ? `SoloBot` : `Dan${i}`, priority, soloBot || mode === GameModeNames.Multiplayer);
    }
    const marketCoinsUnique = [], marketCoins = BuildCoins(marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
    }), averageCards = {};
    for (suit in suitsConfig) {
        averageCards[suit] = GetAverageSuitCard(suitsConfig[suit], {
            players: ctx.numPlayers,
            tier: 0,
        });
    }
    const initHandCoinsId = Array(initialPlayerCoinsConfig.length).fill(undefined)
        .map((item, index) => index), initCoinsOrder = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder = [];
    for (let i = 0; i < initCoinsOrder.length; i++) {
        const coinsOrder = initCoinsOrder[i];
        if (coinsOrder === undefined) {
            throw new Error(`Отсутствует порядок выкладки монет ${i}.`);
        }
        allCoinsOrder = allCoinsOrder.concat(Permute(coinsOrder));
    }
    const botData = {
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
//# sourceMappingURL=GameSetup.js.map