// todo Add logging
import {DiscardCardIfCampCardPicked, RefillEmptyCampCards} from "../Camp";
import {CheckIfCurrentTavernEmpty, RefillTaverns} from "../Tavern";
import {RemoveThrudFromPlayerBoardAfterGameEnd} from "../Hero";
import {DiscardCardFromTavern} from "../Card";
import {AddActionsToStack, StartActionFromStackOrEndActions} from "./StackHelpers";
import {CheckAndStartUlineActionsOrContinue} from "./HeroHelpers";
import {ActivateTrading} from "./CoinHelpers";

/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения экшенов в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const CheckEndGameLastActions = (G, ctx) => {
    if (G.tierToEnd) {
        ctx.events.setPhase("getDistinctions");
    } else {
        if (ctx.phase !== "brisingamensEndGame" && ctx.phase !== "getMjollnirProfit") {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
        let isNewPhase = false;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== "brisingamensEndGame" && ctx.phase !== "getMjollnirProfit") {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.players[i].buffs["discardCardEndGame"]) {
                        isNewPhase = true;
                        G.playersOrder.push(i);
                        const stack = [
                            {
                                actionName: "DrawProfitAction",
                                playerId: G.playersOrder[0],
                                config: {
                                    name: "BrisingamensEndGameAction",
                                    drawName: "Brisingamens end game",
                                },
                            },
                            {
                                playerId: G.playersOrder[0],
                                actionName: "DiscardAnyCardFromPlayerBoard",
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = "BrisingamensEndGameAction";
                        ctx.events.setPhase("brisingamensEndGame");
                        break;
                    }
                }
            }
            if (ctx.phase !== "getMjollnirProfit" && !isNewPhase) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.players[i].buffs["getMjollnirProfit"]) {
                        isNewPhase = true;
                        G.playersOrder.push(i);
                        const stack = [
                            {
                                actionName: "DrawProfitAction",
                                playerId: G.playersOrder[0],
                                config: {
                                    name: "getMjollnirProfit",
                                    drawName: "Mjollnir",
                                },
                            },
                            {
                                playerId: G.playersOrder[0],
                                actionName: "GetMjollnirProfitAction",
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = "getMjollnirProfit";
                        ctx.events.setPhase("getMjollnirProfit");
                        break;
                    }
                }
            }
        }
        if (!isNewPhase) {
            ctx.events.endPhase();
            ctx.events.endGame();
        }
    }
}

/**
 * <h3>Выполняет основные действия после выбора базовых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выбора карты дворфа из таверны.</li>
 * <li>После выбора карты улучшения монеты из таверны.</li>
 * <li>После выбора карты из кэмпа.</li>
 * <li>После выбора героев.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
 */
export const AfterBasicPickCardActions = (G, ctx, isTrading) => {
    // todo rework it?
    G.players[ctx.currentPlayer].pickedCard = null;
    if (ctx.phase === "pickCards") {
        const isUlinePlaceTradingCoin = CheckAndStartUlineActionsOrContinue(G, ctx);
        if (isUlinePlaceTradingCoin !== "placeTradingCoinsUline" && isUlinePlaceTradingCoin !== "nextPlaceTradingCoinsUline") {
            let isTradingActivated = false;
            if (!isTrading) {
                isTradingActivated = ActivateTrading(G, ctx);
            }
            if (!isTradingActivated) {
                if (Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1]) &&
                    ctx.playOrder.length < Number(ctx.numPlayers)) {
                    const cardIndex = G.taverns[G.currentTavern].findIndex(card => card !== null);
                    DiscardCardFromTavern(G, cardIndex);
                }
                if (G.expansions.thingvellir.active && Number(ctx.currentPlayer) ===
                    Number(ctx.playOrder[ctx.playOrder.length - 1])) {
                    DiscardCardIfCampCardPicked(G);
                }
                const isLastTavern = G.tavernsNum - 1 === G.currentTavern,
                    isCurrentTavernEmpty = CheckIfCurrentTavernEmpty(G, ctx);
                if (isCurrentTavernEmpty && isLastTavern) {
                    AfterLastTavernEmptyActions(G, ctx);
                } else if (isCurrentTavernEmpty) {
                    const isPlaceCoinsUline = CheckAndStartUlineActionsOrContinue(G, ctx);
                    if (isPlaceCoinsUline !== "endPlaceTradingCoinsUline" && isPlaceCoinsUline !== "placeCoinsUline") {
                        ctx.events.setPhase("pickCards");
                    } else {
                        ctx.events.setPhase("placeCoinsUline");
                    }
                } else {
                    if (Number(ctx.currentPlayer) === Number(ctx.playOrder[0]) && G.campPicked &&
                        ctx.numPlayers === 2 && G.taverns[G.currentTavern].every(card => card !== null)) {
                        const stack = [
                            {
                                actionName: "DrawProfitAction",
                                config: {
                                    stageName: "discardCard",
                                    name: "discardCard",
                                    drawName: "Discard tavern card",
                                },
                            },
                            {
                                actionName: "DiscardCardFromTavernAction",
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        StartActionFromStackOrEndActions(G, ctx);
                    } else {
                        ctx.events.endTurn();
                    }
                }
            }
        }
    } else if (ctx.phase === "endTier" || ctx.phase === "brisingamensEndGame" || ctx.phase === "getMjollnirProfit") {
        CheckEndGameLastActions(G, ctx);
    } else if (ctx.phase === "getDistinctions") {
        ctx.events.endTurn();
    } else if (ctx.phase === "enlistmentMercenaries") {
        if (((ctx.playOrderPos === 0 && ctx.playOrder.length === 1) && Number(ctx.currentPlayer) ===
                Number(ctx.playOrder[ctx.playOrder.length - 1])) || ((ctx.playOrderPos !== 0 && ctx.playOrder.length > 1)
                && Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1])) ||
            (ctx.playOrder[ctx.playOrder.length - 2] !== undefined && (Number(ctx.currentPlayer) ===
                    Number(ctx.playOrder[ctx.playOrder.length - 2])) &&
                !G.players[ctx.playOrder[ctx.playOrder.length - 1]].campCards.filter(card => card.type === "наёмник").length)) {
            StartEndTierActions(G, ctx);
        } else {
            const stack = [
                {
                    actionName: "DrawProfitAction",
                    playerId: ctx.playOrder[ctx.playOrder.findIndex(playerIndex => Number(playerIndex) ===
                        Number(ctx.currentPlayer)) + 1],
                    config: {
                        name: "enlistmentMercenaries",
                        drawName: "Enlistment Mercenaries",
                    },
                },
            ];
            ctx.events.endTurn();
            AddActionsToStack(G, ctx, stack);
            G.drawProfit = "enlistmentMercenaries";
        }
    }
};

/**
 * <h3>Начало экшенов в фазе EndTier.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы EndTier.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
const StartEndTierActions = (G, ctx) => {
    G.playersOrder = [];
    let ylud = false,
        index = -1;
    for (let i = 0; i < G.players.length; i++) {
        index = G.players[i].heroes.findIndex(hero => hero.name === "Ylud");
        if (index !== -1) {
            ylud = true;
            G.playersOrder.push(i);
        }
    }
    if (!ylud) {
        for (let i = 0; i < G.players.length; i++) {
            for (let j = 0; j < G.suitsNum; j++) {
                index = G.players[i].cards[j].findIndex(card => card.name === "Ylud");
                if (index !== -1) {
                    G.players[ctx.currentPlayer].cards[i].splice(index, 1);
                    G.playersOrder.push(i);
                    ylud = true;
                }
            }
        }
    }
    if (ylud) {
        ctx.events.setPhase("endTier");
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
                points: 11,
            },
            warrior: {
                suit: "warrior",
                rank: 1,
                points: 7,
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: 1,
            },
        };
        const stack = [
            {
                playerId: G.playersOrder[0],
                actionName: "DrawProfitAction",
                variants,
                config: {
                    stageName: "placeCards",
                    drawName: "Ylud",
                    name: "placeCard",
                },
            },
            {
                playerId: G.playersOrder[0],
                actionName: "PlaceYludAction",
                variants,
            },
        ];
        AddActionsToStack(G, ctx, stack);
        G.drawProfit = "placeCards";
    } else {
        CheckEndGameLastActions(G, ctx);
    }
};

/**
 * <h3>Проверяет есть ли у игроков наёмники для начала их вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии у игроков наёмников в конце текущей эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
const CheckEnlistmentMercenaries = (G, ctx) => {
    let count = false;
    for (let i = 0; i < G.players.length; i++) {
        if (G.players[i].campCards.filter(card => card.type === "наёмник").length) {
            count = true;
            break;
        }
    }
    if (count) {
        G.drawProfit = "startOrPassEnlistmentMercenaries";
        ctx.events.setPhase("enlistmentMercenaries");
    } else {
        StartEndTierActions(G, ctx);
    }
};

/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @todo Refill taverns only on the beginning of the round (Add phase Round?)!
 * @param G
 * @param ctx
 * @constructor
 */
const AfterLastTavernEmptyActions = (G, ctx) => {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        G.tierToEnd--;
        if (G.expansions.thingvellir.active) {
            CheckEnlistmentMercenaries(G, ctx);
        } else {
            StartEndTierActions(G, ctx);
        }
    } else {
        if (G.expansions.thingvellir.active) {
            RefillEmptyCampCards(G);
        }
        RefillTaverns(G);
        ctx.events.setPhase("placeCoins");
    }
};
