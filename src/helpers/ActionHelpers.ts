import { AfterBasicPickCardActions } from "./MovesHelpers";
import { MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { IConfig } from "../Player";
import { AddDataToLog, LogTypes } from "../Logging";

/**
 * <h3>Завершение текущего экшена.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает после завершения каждого экшена.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 */
export const EndAction = (G: MyGameState, ctx: Ctx, isTrading: boolean): void => {
    AfterBasicPickCardActions(G, ctx, isTrading);
};

/**
 * <h3>Действия, связанные со стартом стэйджа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале экшенов, требующих старта стэйджа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns Стартанул ли стэйдж.
 */
export const IsStartActionStage = (G: MyGameState, ctx: Ctx, config: IConfig): boolean => {
    if (config.stageName !== undefined) {
        ctx.events!.setStage!(config.stageName);
        AddDataToLog(G, LogTypes.GAME, `Начало стэйджа ${config.stageName}.`);
        return true;
    }
    return false;
};
