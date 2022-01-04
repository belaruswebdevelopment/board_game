import { LogTypes } from "./typescript/enums";
import { MyGameState } from "./typescript/game_data_interfaces";

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
 */
export const AddDataToLog = (G: MyGameState, type: LogTypes, value: string): void => {
    G.logData.push({ type, value });
};
