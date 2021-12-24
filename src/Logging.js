/**
 * <h3>Перечисление для типов логов.</h3>
 */
export var LogTypes;
(function (LogTypes) {
    LogTypes["ERROR"] = "error";
    LogTypes["GAME"] = "game";
    LogTypes["PRIVATE"] = "private";
    LogTypes["PUBLIC"] = "public";
})(LogTypes || (LogTypes = {}));
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
export const AddDataToLog = (G, type, value) => {
    G.logData.push({ type, value });
};
