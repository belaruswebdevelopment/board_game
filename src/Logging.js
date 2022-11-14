import { LogTypeNames } from "./typescript/enums";
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
export const AddDataToLog = ({ G }, type, value) => {
    G.logData.push({ type, value });
};
//# sourceMappingURL=Logging.js.map