import {heroesConfig} from "../data/HeroData";
import {GetSuitIndexByName} from "./SuitHelpers";
import {AddActionsToStackAfterCurrent} from "./StackHelpers";

/**
 * Вычисляет индекс указанного героя.
 * Применения:
 * 1) Используется повсеместно в проекте для вычисления индекса конкретного героя.
 *
 * @param heroName Название героя.
 * @returns {number} Индекс героя.
 * @constructor
 */
export const GetHeroIndexByName = (heroName) => Object.keys(heroesConfig).indexOf(heroName);

/**
 * Проверяет нужно ли перемещать героя Труд.
 * Применения:
 * 1) При любых действия, когда пикается карта на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns {boolean} Нужно ли перемещать героя Труд.
 * @constructor
 */
export const CheckAndMoveThrud = (G, ctx, card) => {
    if (card.suit) {
        const suitId = GetSuitIndexByName(card.suit),
            index = G.players[ctx.currentPlayer].cards[suitId].findIndex(card => card.name === "Thrud");
        if (index !== -1) {
            G.players[ctx.currentPlayer].cards[suitId].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};

/**
 * Перемещение героя Труд.
 * Применения:
 * 1) При любых действия, когда пикается карта на планшет игрока и требуется переместить героя Труд.
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @constructor
 */
export const StartThrudMoving = (G, ctx, card) => {
    const variants = {
            blacksmith: {
                suit: "blacksmith",
                rank: 1,
                points: null,
            },
            hunter: {
                suit: "hunter",
                rank: 1,
                points: null,
            },
            explorer: {
                suit: "explorer",
                rank: 1,
                points: null,
            },
            warrior: {
                suit: "warrior",
                rank: 1,
                points: null,
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: null,
            },
        },
        stack = [
            {
                actionName: "DrawProfitAction",
                variants,
                config: {
                    drawName: "Thrud",
                    name: "placeCards",
                    stageName: "placeCards",
                    suit: card.suit,
                },
            },
            {
                actionName: "PlaceThrudAction",
                variants,
            },
        ];
    AddActionsToStackAfterCurrent(G, ctx, stack);
};

/**
 * Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.
 * Применения:
 * 1) При наличии героя Улина.
 *
 * @param G
 * @param ctx
 * @returns {string|boolean}
 * @constructor
 */
export const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    // todo Rework it all!
    const ulinePlayerIndex = G.players.findIndex(player => player.buffs?.["everyTurn"] === "Uline");
    if (ulinePlayerIndex !== -1) {
        if (ctx.activePlayers?.[ctx.currentPlayer] !== "placeTradingCoinsUline" && ulinePlayerIndex === Number(ctx.currentPlayer) &&
            G.players[ctx.currentPlayer].boardCoins[G.currentTavern]?.isTriggerTrading) {
            if (G.players[ctx.currentPlayer].boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null)) {
                G.actionsNum = G.suitsNum - G.tavernsNum;
                ctx.events.setStage("placeTradingCoinsUline");
                return "placeTradingCoinsUline";
            }
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline" && !G.actionsNum) {
            ctx.events.endStage();
            return "endPlaceTradingCoinsUline";
        } else if (ctx.activePlayers?.[ctx.currentPlayer] === "placeTradingCoinsUline" && G.actionsNum) {
            return "nextPlaceTradingCoinsUline";
        } else {
            return "placeCoinsUline";
        }
    } else if (ctx.phase !== "pickCards") {
        ctx.events.setPhase("pickCards");
    }
    return false;
};
