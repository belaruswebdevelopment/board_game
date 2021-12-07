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
export var AddDataToLog = function (G, type, value) {
    G.logData.push({ type: type, value: value });
};
