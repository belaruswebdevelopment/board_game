import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildAdditionalCards, BuildCards } from "./Card";
import { BuildCoins } from "./Coin";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { initialPlayerCoinsConfig, marketCoinsConfig } from "./data/CoinData";
import { heroesConfig } from "./data/HeroData";
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
    var _a;
    const suitsNum = 5, tierToEnd = 2, campNum = 5, multiplayer = true, odroerirTheMythicCauldron = false, log = true, debug = false, tavernCardDiscarded2Players = false, drawProfit = ``, expansions = {
        thingvellir: {
            active: true,
        },
    }, totalScore = [], logData = [], odroerirTheMythicCauldronCoins = [], additionalCardsDeck = BuildAdditionalCards(), discardCardsDeck = [], explorerDistinctionCards = [], distinctions = {};
    let suit;
    const secret = {
        campDecks: [],
        decks: [],
    };
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            distinctions[suit] = null;
        }
    }
    const winner = [], campPicked = false, mustDiscardTavernCardJarnglofi = null, discardCampCardsDeck = [];
    let camp = [];
    const campDeckLength = [0, 0];
    if ((_a = expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active) {
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
        // TODO Deck cards must be hidden from users?
        secret.decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
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
        if (Object.prototype.hasOwnProperty.call(expansions, expansion)) {
            if (expansions[expansion].active) {
                heroesConfigOptions.push(expansion);
            }
        }
    }
    const heroes = BuildHeroes(heroesConfigOptions, heroesConfig), taverns = [], tavernsNum = 3, currentTavern = -1, drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        // TODO Taverns cards must be hidden from users?
        const deck0 = secret.decks[0];
        if (deck0 === undefined) {
            throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
        }
        taverns[i] = deck0.splice(0, drawSize);
        deckLength[0] = deck0.length;
    }
    const players = {}, publicPlayers = {}, publicPlayersOrder = [], exchangeOrder = [], priorities = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex = Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        if (multiplayer) {
            players[i] = BuildPlayer();
        }
        publicPlayers[i] = BuildPublicPlayer(`Dan` + i, priority, multiplayer);
    }
    const marketCoinsUnique = [], marketCoins = BuildCoins(marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
        isInitial: false,
        isTriggerTrading: false,
    });
    const averageCards = {};
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            averageCards[suit] = GetAverageSuitCard(suitsConfig[suit], {
                players: ctx.numPlayers,
                tier: 0,
            });
        }
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
        odroerirTheMythicCauldron,
        tavernCardDiscarded2Players,
        averageCards: averageCards,
        botData,
        odroerirTheMythicCauldronCoins,
        camp,
        explorerDistinctionCards,
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
        log,
        logData,
        marketCoins,
        marketCoinsUnique,
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