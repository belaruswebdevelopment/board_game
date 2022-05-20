import { BuildAdditionalCards } from "./AdditionalCard";
import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildCards } from "./Card";
import { BuildCoins } from "./Coin";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { initialPlayerCoinsConfig, marketCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { BuildHeroes } from "./Hero";
import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
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
    const suitsNum = 5, tierToEnd = 2, campNum = 5, round = 0, soloGameDifficultyLevel = null, explorerDistinctionCardId = null, multiplayer = false, solo = ctx.numPlayers === 1, odroerirTheMythicCauldron = false, log = true, debug = false, tavernCardDiscarded2Players = false, drawProfit = ``, expansions = {
        thingvellir: {
            active: solo ? false : true,
        },
        // TODO Fix me to "true" after expansion finished
        idavoll: {
            active: solo ? false : false,
        },
    }, totalScore = [], logData = [], odroerirTheMythicCauldronCoins = [], additionalCardsDeck = BuildAdditionalCards(), discardCardsDeck = [], explorerDistinctionCards = [], distinctions = {}, secret = {
        campDecks: [],
        decks: [],
        // TODO Add Idavoll deck length info on main page?
        // TODO Idavoll
        idavollDecks: [],
    };
    if (solo && multiplayer) {
        throw new Error(`Не может быть одновременно режим мультиплеера и соло игры.`);
    }
    let suit;
    for (suit in suitsConfig) {
        distinctions[suit] = null;
    }
    const winner = [], campPicked = false, mustDiscardTavernCardJarnglofi = null, discardCampCardsDeck = [], campDeckLength = [0, 0];
    let camp = [];
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            secret.campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
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
        camp = campDeck0.splice(0, campNum);
        campDeckLength[0] = campDeck0.length;
    }
    const deckLength = [0, 0];
    for (let i = 0; i < tierToEnd; i++) {
        secret.decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray,
        }, {
            players: ctx.numPlayers,
            tier: i,
        });
        const deck = secret.decks[i];
        if (deck === undefined) {
            throw new Error(`Колода карт ${i} эпохи не может отсутствовать.`);
        }
        deckLength[i] = deck.length;
        secret.decks[i] = ctx.random.Shuffle(deck);
    }
    const heroesConfigOptions = [GameNames.Basic];
    let expansion;
    for (expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigOptions.push(expansion);
        }
    }
    const [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel] = BuildHeroes(heroesConfigOptions, solo), taverns = [], tavernsNum = 3, currentTavern = -1, drawSize = (solo || ctx.numPlayers === 2) ? 3 : ctx.numPlayers, deck0 = secret.decks[0];
    if (deck0 === undefined) {
        throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
    }
    for (let i = 0; i < tavernsNum; i++) {
        if (expansions.idavoll.active && i === 1) {
            secret.idavollDecks = ctx.random.Shuffle(secret.idavollDecks);
            taverns[1] = secret.idavollDecks.splice(0, drawSize);
        }
        else {
            taverns[i] = deck0.splice(0, drawSize);
        }
        deckLength[0] = deck0.length;
    }
    const players = {}, publicPlayers = {}, publicPlayersOrder = [], exchangeOrder = [], priorities = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (let i = 0; i < ctx.numPlayers + Number(solo); i++) {
        const randomPriorityIndex = solo ? i : Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        players[i] = BuildPlayer();
        publicPlayers[i] = BuildPublicPlayer(solo && i === 1 ? `SoloBot` : `Dan` + i, priority, multiplayer);
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
        averageCards: averageCards,
        botData,
        odroerirTheMythicCauldronCoins,
        camp,
        explorerDistinctionCards,
        explorerDistinctionCardId,
        deckLength,
        campDeckLength,
        secret,
        campNum,
        campPicked,
        mustDiscardTavernCardJarnglofi,
        currentTavern,
        debug,
        additionalCardsDeck,
        discardCampCardsDeck,
        discardCardsDeck,
        distinctions: distinctions,
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