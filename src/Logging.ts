import { LogTypeNames } from "./typescript/enums";
import type { IMyGameState } from "./typescript/interfaces";

/**
 * <h3>Логирует данные.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в выводе данных логов на игровом поле.</li>
 * </ol>
 *
 * @param G
 * @param type Тип лога.
 * @param value Значение, заносимое в лог.
 * @returns
 */
export const AddDataToLog = (G: IMyGameState, type: LogTypeNames, value: string): void => {
    G.logData.push({ type, value });
};
