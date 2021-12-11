import { AfterBasicPickCardActions } from "./MovesHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
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
export var EndAction = function (G, ctx, isTrading) {
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
export var IsStartActionStage = function (G, ctx, config) {
    if (config !== undefined) {
        if (config.stageName !== undefined) {
            ctx.events.setStage(config.stageName);
            AddDataToLog(G, LogTypes.GAME, "\u041D\u0430\u0447\u0430\u043B\u043E \u0444\u0430\u0437\u044B ".concat(config.stageName, "."));
            return true;
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'config.stageName'.");
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'config'.");
    }
    return false;
};
