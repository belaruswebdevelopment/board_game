import { Ctx } from "boardgame.io";
import { DiscardCardFromTavernAction, DrawProfitAction } from "../actions/Actions";
import { DrawProfitCampAction } from "../actions/CampActions";
import { DiscardCardIfCampCardPicked, RefillEmptyCampCards } from "../Camp";
import { CheckIfCurrentTavernEmpty, DiscardCardFromTavern, RefillTaverns } from "../Tavern";
import { CampDeckCardTypes, TavernCardTypes } from "../typescript/card_types";
import { ActionTypes, ConfigNames, DrawNames, Phases, RusCardTypes, Stages } from "../typescript/enums";
import { IStack, MyGameState } from "../typescript/interfaces";
import { StartActionFromStackOrEndActions } from "./ActionDispatcherHelpers";
import { CheckEndGameLastActions } from "./CampHelpers";
import { CheckAndStartUlineActionsOrContinue, StartEndTierActions } from "./HeroHelpers";
import { AddActionsToStack } from "./StackHelpers";
import { ActivateTrading } from "./TradingHelpers";

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
export const AfterBasicPickCardActions = (G: MyGameState, ctx: Ctx, isTrading: boolean): void => {
    // todo rework it?
    // todo Add LogTypes.ERROR ?
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
    if (ctx.phase === Phases.PickCards) {
        const isUlinePlaceTradingCoin: string | boolean = CheckAndStartUlineActionsOrContinue(G, ctx);
        if (isUlinePlaceTradingCoin !== Stages.PlaceTradingCoinsUline
            && isUlinePlaceTradingCoin !== `nextPlaceTradingCoinsUline`) {
            let isTradingActivated = false;
            if (!isTrading) {
                isTradingActivated = ActivateTrading(G, ctx);
            }
            if (!isTradingActivated) {
                if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && ctx.playOrder.length < ctx.numPlayers) {
                    const cardIndex: number = G.taverns[G.currentTavern]
                        .findIndex((card: TavernCardTypes): boolean => card !== null);
                    DiscardCardFromTavern(G, cardIndex);
                }
                if (G.expansions.thingvellir.active && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
                    DiscardCardIfCampCardPicked(G);
                }
                const isLastTavern: boolean = G.tavernsNum - 1 === G.currentTavern,
                    isCurrentTavernEmpty: boolean = CheckIfCurrentTavernEmpty(G, ctx);
                if (isCurrentTavernEmpty && isLastTavern) {
                    AfterLastTavernEmptyActions(G, ctx);
                } else if (isCurrentTavernEmpty) {
                    const isPlaceCoinsUline: string | boolean = CheckAndStartUlineActionsOrContinue(G, ctx);
                    if (isPlaceCoinsUline !== `endPlaceTradingCoinsUline`
                        && isPlaceCoinsUline !== Phases.PlaceCoinsUline) {
                        ctx.events?.setPhase(Phases.PickCards);
                    } else {
                        ctx.events?.setPhase(Phases.PlaceCoinsUline);
                    }
                } else {
                    if (ctx.currentPlayer === ctx.playOrder[0] && G.campPicked && ctx.numPlayers === 2
                        && G.taverns[G.currentTavern].every(card => card !== null)) {
                        const stack: IStack[] = [
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
                    } else {
                        ctx.events?.endTurn();
                    }
                }
            }
        }
    } else if (ctx.phase === Phases.EndTier || ctx.phase === Phases.BrisingamensEndGame
        || ctx.phase === Phases.GetMjollnirProfit) {
        CheckEndGameLastActions(G, ctx);
    } else if (ctx.phase === Phases.GetDistinctions) {
        ctx.events?.endTurn();
    } else if (ctx.phase === Phases.EnlistmentMercenaries) {
        if (((ctx.playOrderPos === 0 && ctx.playOrder.length === 1)
            && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || ((ctx.playOrderPos !== 0 && ctx.playOrder.length > 1)
                && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || (ctx.playOrder[ctx.playOrder.length - 2] !== undefined
                && (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 2])
                && !G.publicPlayers[Number(ctx.playOrder[ctx.playOrder.length - 1])].campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length)) {
            StartEndTierActions(G, ctx);
        } else {
            const stack: IStack[] = [
                {
                    action: {
                        name: DrawProfitCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    playerId: Number(ctx.playOrder[ctx.playOrder
                        .findIndex((playerIndex: string): boolean => playerIndex === ctx.currentPlayer) + 1]),
                    config: {
                        name: ConfigNames.EnlistmentMercenaries,
                        drawName: DrawNames.EnlistmentMercenaries,
                    },
                },
            ];
            ctx.events?.endTurn();
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
const AfterLastTavernEmptyActions = (G: MyGameState, ctx: Ctx): void => {
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
        ctx.events?.setPhase(Phases.PlaceCoins);
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
const CheckEnlistmentMercenaries = (G: MyGameState, ctx: Ctx): void => {
    let count = false;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY).length) {
            count = true;
            break;
        }
    }
    if (count) {
        G.drawProfit = ConfigNames.StartOrPassEnlistmentMercenaries;
        ctx.events?.setPhase(Phases.EnlistmentMercenaries);
    } else {
        StartEndTierActions(G, ctx);
    }
};
