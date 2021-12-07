import {MyGameState} from "./GameSetup";

/**
 * <h3>Перечисление для типов логов.</h3>
 */
export const enum LogTypes {
    PUBLIC = "public",
    PRIVATE = "private",
    GAME = "game",
    ERROR = "error",
}

/**
 * <h3>Интерфейс для логирования данных.</h3>
 */
export interface ILogData {
    type: LogTypes,
    value: string,
}

/**
 * <h3>Логирует данные.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в выводе данных логов на игровом поле.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {LogTypes} type Тип лога.
 * @param {string} value Значение, заносимое в лог.
 * @constructor
 */
export const AddDataToLog = (G: MyGameState, type: LogTypes, value: string): void => {
    G.logData.push({type, value});
};
