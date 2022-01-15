import { Ctx } from "boardgame.io";
import { DiscardAnyCardFromPlayerBoardAction, DrawProfitCampAction, GetMjollnirProfitAction } from "../actions/CampActions";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern, tavernsConfig } from "../Tavern";
import { IStack } from "../typescript/action_interfaces";
import { TavernCardTypes } from "../typescript/card_types";
import { ActionTypes, ConfigNames, DrawNames, LogTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { AddActionsToStack } from "./StackHelpers";

/**
 * <h3>Добавляет экшены при старте хода в фазе 'brisingamensEndGame'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'brisingamensEndGame'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddBrisingamensEndGameActionsToStack = (G: IMyGameState, ctx: Ctx): void => {
    const stack: IStack[] = [
        {
            action: {
                name: DrawProfitCampAction.name,
                type: ActionTypes.Camp,
            },
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
        },
    ];
    AddActionsToStack(G, ctx, stack);
    G.drawProfit = ConfigNames.BrisingamensEndGameAction;
};

/**
 * <h3>Добавляет экшены при старте хода в фазе 'enlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'enlistmentMercenaries'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddEnlistmentMercenariesActionsToStack = (G: IMyGameState, ctx: Ctx): void => {
    let stack: IStack[] = [];
    if (ctx.playOrderPos === 0) {
        stack = [
            {
                action: {
                    name: DrawProfitCampAction.name,
                    type: ActionTypes.Camp,
                },
                config: {
                    name: ConfigNames.StartOrPassEnlistmentMercenaries,
                    drawName: DrawNames.StartOrPassEnlistmentMercenaries,
                },
            },
        ];
        G.drawProfit = ConfigNames.StartOrPassEnlistmentMercenaries;
    } else {
        stack = [
            {
                action: {
                    name: DrawProfitCampAction.name,
                    type: ActionTypes.Camp,
                },
                config: {
                    name: ConfigNames.EnlistmentMercenaries,
                    drawName: DrawNames.EnlistmentMercenaries,
                },
            },
        ];
        G.drawProfit = ConfigNames.EnlistmentMercenaries;
    }
    AddActionsToStack(G, ctx, stack);
};

/**
 * <h3>Добавляет экшены при старте фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddGetMjollnirProfitActionsToStack = (G: IMyGameState, ctx: Ctx): void => {
    const stack: IStack[] = [
        {
            action: {
                name: DrawProfitCampAction.name,
                type: ActionTypes.Camp,
            },
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
        },
    ];
    AddActionsToStack(G, ctx, stack);
    G.drawProfit = ConfigNames.GetMjollnirProfit;
};

/**
 * <h3>Убирает дополнительную карту из таверны в стопку сброса при пике артефакта Jarnglofi.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При пике артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns Сброшена ли карта из таверны.
 */
export const DiscardCardFromTavernJarnglofi = (G: IMyGameState): void => {
    const cardIndex: number = G.taverns[G.currentTavern]
        .findIndex((card: TavernCardTypes): boolean => card !== null);
    if (cardIndex !== -1) {
        AddDataToLog(G, LogTypes.GAME, `Дополнительная карта из таверны ${tavernsConfig[G.currentTavern].name} должна быть убрана в сброс из-за пика артефакта Jarnglofi.`);
        DiscardCardFromTavern(G, cardIndex);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось сбросить лишнюю карту из таверны при пике артефакта Jarnglofi.`);
    }
};
