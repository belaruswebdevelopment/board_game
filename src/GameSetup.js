import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { BuildCards, GetAverageSuitCard } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { marketCoinsConfig } from "./data/CoinData";
import { BuildCoins } from "./Coin";
import { GetAllPicks, k_combinations, Permute } from "./BotConfig";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { BuildHeroes } from "./Hero";
import { BuildCampCards } from "./Camp";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { heroesConfig } from "./data/HeroData";
/**
 * <h3>Сетап игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Данные используются в игре.</li>
 * </ol>
 *
 * @param ctx
 * @returns Данные игры.
 */
export const SetupGame = (ctx) => {
    const suitsNum = 5, tierToEnd = 2, campNum = 5, actionsNum = 0, log = true, debug = false, drawProfit = ``, suitIdForMjollnir = null, expansions = {
        thingvellir: {
            active: true,
        },
    }, totalScore = [], logData = [], decks = [], discardCardsDeck = [], campDecks = [], distinctions = Array(suitsNum).fill(null);
    let winner = [], campPicked = false, camp = [], discardCampCardsDeck = [];
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            // todo Camp cards must be hidden from users?
            campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            campDecks[i] = ctx.random.Shuffle(campDecks[i]);
        }
        camp = campDecks[0].splice(0, campNum);
    }
    for (let i = 0; i < tierToEnd; i++) {
        // todo Deck cards must be hidden from users?
        decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
        }, {
            players: ctx.numPlayers,
            tier: i,
        });
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    const heroesConfigOptions = ["base"];
    for (const expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigOptions.push(expansion);
        }
    }
    const heroes = BuildHeroes(heroesConfigOptions, heroesConfig), taverns = [], tavernsNum = 3, currentTavern = -1, drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        // todo Taverns cards must be hidden from users?
        taverns[i] = decks[0].splice(0, drawSize);
    }
    const players = {}, publicPlayers = [], publicPlayersOrder = [], exchangeOrder = [];
    let priorities = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex = Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        players[i] = BuildPlayer();
        publicPlayers[i] = BuildPublicPlayer(ctx.numPlayers, suitsNum, "Dan" + i, priority);
    }
    const marketCoinsUnique = [], marketCoins = BuildCoins(marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
        isInitial: false,
        isTriggerTrading: false,
    });
    const averageCards = [], initHandCoinsId = Array(players[0].boardCoins.length).fill(undefined)
        .map((item, index) => index), initCoinsOrder = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder = [];
    for (const suit in suitsConfig) {
        averageCards[GetSuitIndexByName(suit)] = GetAverageSuitCard(suitsConfig[suit], {
            players: ctx.numPlayers,
            tier: 0,
        });
    }
    for (let i = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat(Permute(initCoinsOrder[i]));
    }
    const botData = {
        allCoinsOrder,
        allPicks: GetAllPicks({ tavernsNum, playersNum: ctx.numPlayers }),
        maxIter: 1000,
        deckLength: decks[0].length,
    };
    return {
        actionsNum,
        averageCards,
        botData,
        camp,
        campDecks,
        campNum,
        campPicked,
        currentTavern,
        debug,
        decks,
        discardCampCardsDeck,
        discardCardsDeck,
        distinctions,
        drawProfit,
        drawSize,
        exchangeOrder,
        expansions,
        heroes,
        log,
        logData,
        marketCoins,
        marketCoinsUnique,
        suitIdForMjollnir,
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
