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
import { GameNames } from "./typescript/enums";
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
export const SetupGame = (ctx) => {
    const suitsNum = 5, tierToEnd = 2, campNum = 5, round = -1, soloGameDifficultyLevel = null, explorerDistinctionCardId = null, multiplayer = false, 
    // TODO Rework it!
    solo = ctx.numPlayers === 2, odroerirTheMythicCauldron = false, log = true, debug = false, tavernCardDiscarded2Players = false, drawProfit = ``, expansions = {
        thingvellir: {
            active: solo ? false : true,
        },
        // TODO Fix me to "true" after expansion finished
        idavoll: {
            active: solo ? false : false,
        },
    }, totalScore = [], logData = [], odroerirTheMythicCauldronCoins = [], specialCardsDeck = BuildSpecialCards(), configOptions = [GameNames.Basic], discardCardsDeck = [], explorerDistinctionCards = [], distinctions = {}, secret = {
        campDecks: [],
        decks: [],
        // TODO Add Idavoll deck length info on main page?
        mythologicalCreatureDecks: [],
    };
    if (solo && multiplayer) {
        throw new Error(`Не может быть одновременно режим мультиплеера и соло игры.`);
    }
    let suit;
    for (suit in suitsConfig) {
        distinctions[suit] = null;
    }
    const winner = [], campPicked = false, mustDiscardTavernCardJarnglofi = null, discardCampCardsDeck = [], discardMythologicalCreaturesCards = [], discardMultiCards = [], discardSpecialCards = [], campDeckLength = [0, 0], camp = Array(campNum).fill(null);
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            secret.campDecks[i] = BuildCampCards(i);
            let campDeck = secret.campDecks[i];
            if (campDeck === undefined) {
                throw new Error(`Колода карт лагеря ${i} эпохи не может отсутствовать.`);
            }
            campDeck = ctx.random.Shuffle(campDeck);
            secret.campDecks[i] = campDeck;
            campDeckLength[i] = campDeck.length;
        }
        const campDeck0 = secret.campDecks[0];
        if (campDeck0 === undefined) {
            throw new Error(`Колода карт лагеря 1 эпохи не может отсутствовать.`);
        }
        campDeckLength[0] = campDeck0.length;
    }
    const deckLength = [0, 0];
    for (let i = 0; i < tierToEnd; i++) {
        secret.decks[i] = [];
        const data = {
            players: ctx.numPlayers,
            tier: i,
        }, dwarfDeck = BuildDwarfCards(data), royalOfferingDeck = BuildRoyalOfferingCards(data);
        let deck = secret.decks[i];
        if (deck === undefined) {
            throw new Error(`Колода карт ${i} эпохи не может отсутствовать.`);
        }
        deck = deck.concat(dwarfDeck, royalOfferingDeck);
        deckLength[i] = deck.length;
        secret.decks[i] = ctx.random.Shuffle(deck);
    }
    let expansion;
    for (expansion in expansions) {
        if (expansions[expansion].active) {
            configOptions.push(expansion);
        }
    }
    const [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel] = BuildHeroes(configOptions, solo), multiCardsDeck = BuildMultiSuitCards(configOptions), taverns = [], tavernsNum = 3, currentTavern = -1, drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers, deck0 = secret.decks[0];
    if (deck0 === undefined) {
        throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
    }
    let mythologicalCreatureDeckLength = 0;
    if (expansions.idavoll.active) {
        secret.mythologicalCreatureDecks = BuildMythologicalCreatureCards();
        secret.mythologicalCreatureDecks = ctx.random.Shuffle(secret.mythologicalCreatureDecks);
        mythologicalCreatureDeckLength = secret.mythologicalCreatureDecks.length;
    }
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = [];
        deckLength[0] = deck0.length;
    }
    const players = {}, publicPlayers = {}, publicPlayersOrder = [], exchangeOrder = [], priorities = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers, solo);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex = solo ? 0 : Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        players[i] = BuildPlayer();
        const soloBot = solo && i === 1;
        publicPlayers[i] =
            BuildPublicPlayer(soloBot ? `SoloBot` : `Dan` + i, priority, multiplayer);
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
    const cardDeck0 = secret.decks[0];
    if (cardDeck0 === undefined) {
        throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
    }
    const botData = {
        allCoinsOrder,
        allPicks: GetAllPicks(tavernsNum, ctx.numPlayers),
        maxIter: 1000,
        deckLength: cardDeck0.length,
    };
    return {
        multiplayer,
        solo,
        soloGameDifficultyLevel,
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