import { LogTypeNames } from "./typescript/enums";
import type { FnContext } from "./typescript/interfaces";

/**
 * <h3>Логирует данные.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в выводе данных логов на игровом поле.</li>
 * </ol>
 *
 * @param context
 * @param type Тип лога.
 * @param value Значение, заносимое в лог.
 * @returns
 */
export const AddDataToLog = ({ G }: FnContext, type: LogTypeNames, value: string): void => {
    G.logData.push({ type, value });
};
