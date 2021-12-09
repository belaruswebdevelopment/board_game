import { heroesConfig } from "../data/HeroData";
import { GetSuitIndexByName } from "./SuitHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
import { SuitNames } from "../data/SuitData";
/**
 * <h3>Вычисляет индекс указанного героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретного героя.</li>
 * </ol>
 *
 * @param {string} heroName Название героя.
 * @returns {number} Индекс героя.
 * @constructor
 */
export var GetHeroIndexByName = function (heroName) { return Object.keys(heroesConfig).indexOf(heroName); };
/**
 * <h3>Проверяет нужно ли перемещать героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда пикается карта на планшет игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {PlayerCardsType} card Карта.
 * @returns {boolean} Нужно ли перемещать героя Труд.
 * @constructor
 */
export var CheckAndMoveThrud = function (G, ctx, card) {
    if (card.suit !== null) {
        var suitId = GetSuitIndexByName(card.suit), index = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
            .findIndex(function (card) { return card.name === "Thrud"; });
        if (index !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};
/**
 * <h3>Перемещение героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда пикается карта на планшет игрока и требуется переместить героя Труд.</li>
 * </ol>
 я
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {PlayerCardsType} card Карта.
 * @constructor
 */
export var StartThrudMoving = function (G, ctx, card) {
    if (card.suit !== null) {
        var variants = {
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: null,
            },
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: null,
            },
        }, stack = [
            {
                actionName: "DrawProfitAction",
                variants: variants,
                config: {
                    drawName: "Thrud",
                    name: "placeCards",
                    stageName: "placeCards",
                    suit: card.suit,
                },
            },
            {
                actionName: "PlaceThrudAction",
                variants: variants,
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
};
/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {string | boolean} Проверяет нужно ли начать действия по наличию героя Улина.
 * @constructor
 */
export var CheckAndStartUlineActionsOrContinue = function (G, ctx) {
    // todo Rework it all!
    var ulinePlayerIndex = G.publicPlayers.findIndex(function (player) { return player.buffs.everyTurn === "Uline"; });
    if (ulinePlayerIndex !== -1) {
        if (ctx.activePlayers[ctx.currentPlayer] !== "placeTradingCoinsUline"
            && ulinePlayerIndex === Number(ctx.currentPlayer)) {
            var coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern];
            if (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) {
                if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                    .filter(function (coin, index) { return index >= G.tavernsNum && coin === null; })) {
                    G.actionsNum = G.suitsNum - G.tavernsNum;
                    ctx.events.setStage("placeTradingCoinsUline");
                    return "placeTradingCoinsUline";
                }
            }
        }
        else if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline"
            && !G.actionsNum) {
            ctx.events.endStage();
            return "endPlaceTradingCoinsUline";
        }
        else if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline"
            && G.actionsNum) {
            return "nextPlaceTradingCoinsUline";
        }
        else {
            return "placeCoinsUline";
        }
    }
    else if (ctx.phase !== "pickCards") {
        ctx.events.setPhase("pickCards");
    }
    return false;
};
