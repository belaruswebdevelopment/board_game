import {AfterBasicPickCardActions} from "./MovesHelpers";
import {MyGameState} from "../GameSetup";
import {Ctx} from "boardgame.io";
import {IConfig} from "../Player";
import {AddDataToLog, LogTypes} from "../Logging";

/**
 * <h3>Завершение текущего экшена.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает после завершения каждого экшена.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {boolean} isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig | undefined} config Конфиг действий героя.
 * @returns {boolean} Стартанул ли стэйдж.
 * @constructor
 */
export const IsStartActionStage = (G: MyGameState, ctx: Ctx, config: IConfig | undefined): boolean => {
    if (config !== undefined) {
        if (config.stageName !== undefined) {
            ctx.events!.setStage!(config.stageName);
            AddDataToLog(G, LogTypes.GAME, `Начало фазы ${config.stageName}.`);
            return true;
        } else {
            AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'config.stageName'.");
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'config'.");
    }
    return false;
};
