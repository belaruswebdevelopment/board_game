import { DiscardCardFromTavernAction, DrawProfitAction } from "../actions/Actions";
import { DrawProfitCampAction } from "../actions/CampActions";
import { DiscardCardIfCampCardPicked, RefillEmptyCampCards } from "../Camp";
import { CheckIfCurrentTavernEmpty, DiscardCardFromTavern, RefillTaverns } from "../Tavern";
import { ActionTypes, ConfigNames, DrawNames, Phases, RusCardTypes, Stages } from "../typescript/enums";
import { StartActionFromStackOrEndActions } from "./ActionDispatcherHelpers";
import { CheckEndGameLastActions } from "./CampHelpers";
import { ActivateTrading } from "./CoinHelpers";
import { CheckAndStartUlineActionsOrContinue, StartEndTierActions } from "./HeroHelpers";
import { AddActionsToStack } from "./StackHelpers";
// todo Add logging
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
 */
export const AfterBasicPickCardActions = (G, ctx, isTrading) => {
    var _a, _b, _c, _d, _e;
    // todo rework it?
    // todo Add LogTypes.ERROR ?
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
    if (ctx.phase === Phases.PickCards) {
        const isUlinePlaceTradingCoin = CheckAndStartUlineActionsOrContinue(G, ctx);
        if (isUlinePlaceTradingCoin !== Stages.PlaceTradingCoinsUline
            && isUlinePlaceTradingCoin !== `nextPlaceTradingCoinsUline`) {
            let isTradingActivated = false;
            if (!isTrading) {
                isTradingActivated = ActivateTrading(G, ctx);
            }
            if (!isTradingActivated) {
                if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && ctx.playOrder.length < ctx.numPlayers) {
                    const cardIndex = G.taverns[G.currentTavern]
                        .findIndex((card) => card !== null);
                    DiscardCardFromTavern(G, cardIndex);
                }
                if (G.expansions.thingvellir.active && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
                    DiscardCardIfCampCardPicked(G);
                }
                const isLastTavern = G.tavernsNum - 1 === G.currentTavern, isCurrentTavernEmpty = CheckIfCurrentTavernEmpty(G, ctx);
                if (isCurrentTavernEmpty && isLastTavern) {
                    AfterLastTavernEmptyActions(G, ctx);
                }
                else if (isCurrentTavernEmpty) {
                    const isPlaceCoinsUline = CheckAndStartUlineActionsOrContinue(G, ctx);
                    if (isPlaceCoinsUline !== `endPlaceTradingCoinsUline`
                        && isPlaceCoinsUline !== Phases.PlaceCoinsUline) {
                        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setPhase(Phases.PickCards);
                    }
                    else {
                        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.setPhase(Phases.PlaceCoinsUline);
                    }
                }
                else {
                    if (ctx.currentPlayer === ctx.playOrder[0] && G.campPicked && ctx.numPlayers === 2
                        && G.taverns[G.currentTavern].every(card => card !== null)) {
                        const stack = [
                            {
                                action: {
                                    name: DrawProfitAction.name,
                                    type: ActionTypes.Action,
                                },
                                config: {
                                    stageName: Stages.DiscardCard,
                                    name: ConfigNames.DiscardCard,
                                    drawName: DrawNames.DiscardTavernCard,
                                },
                            },
                            {
                                action: {
                                    name: DiscardCardFromTavernAction.name,
                                    type: ActionTypes.Action,
                                },
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        StartActionFromStackOrEndActions(G, ctx, false);
                    }
                    else {
                        (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.endTurn();
                    }
                }
            }
        }
    }
    else if (ctx.phase === Phases.EndTier || ctx.phase === Phases.BrisingamensEndGame
        || ctx.phase === Phases.GetMjollnirProfit) {
        CheckEndGameLastActions(G, ctx);
    }
    else if (ctx.phase === Phases.GetDistinctions) {
        (_d = ctx.events) === null || _d === void 0 ? void 0 : _d.endTurn();
    }
    else if (ctx.phase === Phases.EnlistmentMercenaries) {
        if (((ctx.playOrderPos === 0 && ctx.playOrder.length === 1)
            && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || ((ctx.playOrderPos !== 0 && ctx.playOrder.length > 1)
                && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || (ctx.playOrder[ctx.playOrder.length - 2] !== undefined
                && (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 2])
                && !G.publicPlayers[Number(ctx.playOrder[ctx.playOrder.length - 1])].campCards
                    .filter((card) => card.type === RusCardTypes.MERCENARY).length)) {
            StartEndTierActions(G, ctx);
        }
        else {
            const stack = [
                {
                    action: {
                        name: DrawProfitCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    playerId: Number(ctx.playOrder[ctx.playOrder
                        .findIndex((playerIndex) => playerIndex === ctx.currentPlayer) + 1]),
                    config: {
                        name: ConfigNames.EnlistmentMercenaries,
                        drawName: DrawNames.EnlistmentMercenaries,
                    },
                },
            ];
            (_e = ctx.events) === null || _e === void 0 ? void 0 : _e.endTurn();
            AddActionsToStack(G, ctx, stack);
            G.drawProfit = ConfigNames.EnlistmentMercenaries;
        }
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
 */
const AfterLastTavernEmptyActions = (G, ctx) => {
    var _a;
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        G.tierToEnd--;
        if (G.expansions.thingvellir.active) {
            CheckEnlistmentMercenaries(G, ctx);
        }
        else {
            StartEndTierActions(G, ctx);
        }
    }
    else {
        if (G.expansions.thingvellir.active) {
            RefillEmptyCampCards(G);
        }
        RefillTaverns(G);
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setPhase(Phases.PlaceCoins);
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
 */
const CheckEnlistmentMercenaries = (G, ctx) => {
    var _a;
    let count = false;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards
            .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
            count = true;
            break;
        }
    }
    if (count) {
        G.drawProfit = ConfigNames.StartOrPassEnlistmentMercenaries;
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setPhase(Phases.EnlistmentMercenaries);
    }
    else {
        StartEndTierActions(G, ctx);
    }
};
