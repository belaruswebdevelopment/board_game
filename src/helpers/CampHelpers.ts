import { Ctx } from "boardgame.io";
import { DrawProfitCampAction, DiscardAnyCardFromPlayerBoardAction, GetMjollnirProfitAction } from "../actions/CampActions";
import { RemoveThrudFromPlayerBoardAfterGameEnd } from "../Hero";
import { IStack } from "../typescript/action_interfaces";
import { Phases, ActionTypes, ConfigNames, DrawNames } from "../typescript/enums";
import { MyGameState } from "../typescript/game_data_interfaces";
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
export const CheckEndGameLastActions = (G: MyGameState, ctx: Ctx): void => {
    if (G.tierToEnd) {
        ctx.events?.setPhase(Phases.GetDistinctions);
    } else {
        if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
        let isNewPhase = false;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.discardCardEndGame) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(String(i));
                        const stack: IStack[] = [
                            {
                                action: {
                                    name: DrawProfitCampAction.name,
                                    type: ActionTypes.Camp,
                                },
                                playerId: Number(G.publicPlayersOrder[0]),
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
                                playerId: Number(G.publicPlayersOrder[0]),
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = ConfigNames.BrisingamensEndGameAction;
                        ctx.events?.setPhase(Phases.BrisingamensEndGame);
                        break;
                    }
                }
            }
            if (ctx.phase !== Phases.GetMjollnirProfit && !isNewPhase) {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.getMjollnirProfit) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(String(i));
                        const stack: IStack[] = [
                            {
                                action: {
                                    name: DrawProfitCampAction.name,
                                    type: ActionTypes.Camp,
                                },
                                playerId: Number(G.publicPlayersOrder[0]),
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
                                playerId: Number(G.publicPlayersOrder[0]),
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = ConfigNames.GetMjollnirProfit;
                        ctx.events?.setPhase(Phases.GetMjollnirProfit);
                        break;
                    }
                }
            }
        }
        if (!isNewPhase) {
            ctx.events?.endPhase();
            ctx.events?.endGame();
        }
    }
};
