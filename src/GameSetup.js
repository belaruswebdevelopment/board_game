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
    var _a, _b, _c;
    const suitsNum = 5, tierToEnd = 2, campNum = 5, log = true, debug = false, drawProfit = ``, expansions = {
        thingvellir: {
            active: true,
        },
    }, totalScore = [], logData = [], decks = [], additionalCardsDeck = BuildAdditionalCards(), 
    // TODO Discard cards must be hidden from users?
    discardCardsDeck = [], campDecks = [], distinctions = {};
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            distinctions[suit] = null;
        }
    }
    const winner = [], campPicked = false, mustDiscardTavernCardJarnglofi = null, discardCampCardsDeck = [];
    let camp = [];
    if ((_a = expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active) {
        for (let i = 0; i < tierToEnd; i++) {
            // TODO Camp cards must be hidden from users?
            campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            const campDeck = campDecks[i];
            if (campDeck !== undefined) {
                campDecks[i] = ctx.random.Shuffle(campDeck);
            }
            else {
                throw new Error(`Колода карт кэмпа ${i} эпохи не может отсутствовать.`);
            }
        }
        const campDeck0 = (_b = campDecks[0]) === null || _b === void 0 ? void 0 : _b.splice(0, campNum);
        if (campDeck0 !== undefined) {
            camp = campDeck0;
        }
        else {
            throw new Error(`Колода карт кэмпа 1 эпохи не может отсутствовать.`);
        }
    }
    for (let i = 0; i < tierToEnd; i++) {
        // TODO Deck cards must be hidden from users?
        decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
        }, {
            players: ctx.numPlayers,
            tier: i,
        });
        const deck = decks[i];
        if (deck !== undefined) {
            decks[i] = ctx.random.Shuffle(deck);
        }
        else {
            throw new Error(`Колода карт ${i} эпохи не может отсутствовать.`);
        }
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
        const deck0 = (_c = decks[0]) === null || _c === void 0 ? void 0 : _c.splice(0, drawSize);
        if (deck0 !== undefined) {
            taverns[i] = deck0;
        }
        else {
            throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
        }
    }
    const players = {}, publicPlayers = [], publicPlayersOrder = [], exchangeOrder = [], priorities = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex = Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority !== undefined) {
            players[i] = BuildPlayer();
            publicPlayers[i] = BuildPublicPlayer(`Dan` + i, priority);
        }
        else {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
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
        if (coinsOrder !== undefined) {
            allCoinsOrder = allCoinsOrder.concat(Permute(coinsOrder));
        }
        else {
            throw new Error(`Отсутствует порядок выкладки монет ${i}.`);
        }
    }
    const cardDeck0 = decks[0];
    let length;
    if (cardDeck0 !== undefined) {
        length = cardDeck0.length;
    }
    else {
        throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
    }
    const botData = {
        allCoinsOrder,
        allPicks: GetAllPicks(tavernsNum, ctx.numPlayers),
        maxIter: 1000,
        deckLength: length,
    };
    return {
        averageCards: averageCards,
        botData,
        camp,
        campDecks,
        campNum,
        campPicked,
        mustDiscardTavernCardJarnglofi,
        currentTavern,
        debug,
        decks,
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