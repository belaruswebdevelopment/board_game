import { DrawProfitCampAction, DiscardAnyCardFromPlayerBoardAction, GetMjollnirProfitAction } from "../actions/CampActions";
import { RemoveThrudFromPlayerBoardAfterGameEnd } from "../Hero";
import { Phases, ActionTypes, ConfigNames, DrawNames } from "../typescript/enums";
import { AddActionsToStack } from "./StackHelpers";
/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения экшенов в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndGameLastActions = (G, ctx) => {
    var _a, _b, _c, _d, _e;
    if (G.tierToEnd) {
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setPhase(Phases.GetDistinctions);
    }
    else {
        if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
        let isNewPhase = false;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.discardCardEndGame) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        const stack = [
                            {
                                action: {
                                    name: DrawProfitCampAction.name,
                                    type: ActionTypes.Camp,
                                },
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: ConfigNames.BrisingamensEndGameAction,
                                    drawName: DrawNames.BrisingamensEndGame,
                                },
                            },
                            {
                                action: {
                                    name: DiscardAnyCardFromPlayerBoardAction.name,
                                    type: ActionTypes.Camp,
                                },
                                playerId: G.publicPlayersOrder[0],
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = ConfigNames.BrisingamensEndGameAction;
                        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.setPhase(Phases.BrisingamensEndGame);
                        break;
                    }
                }
            }
            if (ctx.phase !== Phases.GetMjollnirProfit && !isNewPhase) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.getMjollnirProfit) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        const stack = [
                            {
                                action: {
                                    name: DrawProfitCampAction.name,
                                    type: ActionTypes.Camp,
                                },
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: ConfigNames.GetMjollnirProfit,
                                    drawName: DrawNames.Mjollnir,
                                },
                            },
                            {
                                action: {
                                    name: GetMjollnirProfitAction.name,
                                    type: ActionTypes.Camp,
                                },
                                playerId: G.publicPlayersOrder[0],
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = ConfigNames.GetMjollnirProfit;
                        (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.setPhase(Phases.GetMjollnirProfit);
                        break;
                    }
                }
            }
        }
        if (!isNewPhase) {
            (_d = ctx.events) === null || _d === void 0 ? void 0 : _d.endPhase();
            (_e = ctx.events) === null || _e === void 0 ? void 0 : _e.endGame();
        }
    }
};
