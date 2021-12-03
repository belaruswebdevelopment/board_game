"use strict";
exports.__esModule = true;
exports.AddDataToLog = void 0;
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
 * @constructor
 */
var AddDataToLog = function (G, type, value) {
    G.logData.push({ type: type, value: value });
};
exports.AddDataToLog = AddDataToLog;
