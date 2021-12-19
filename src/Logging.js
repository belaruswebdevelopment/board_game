/**
 * <h3>Перечисление для типов логов.</h3>
 */
export var LogTypes;
(function (LogTypes) {
    LogTypes["PUBLIC"] = "public";
    LogTypes["PRIVATE"] = "private";
    LogTypes["GAME"] = "game";
    LogTypes["ERROR"] = "error";
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
export var AddDataToLog = function (G, type, value) {
    G.logData.push({ type: type, value: value });
};
