/**
 * Логирует данные.
 * Применения:
 * 1) Используется в выоде данных логов на игровом поле.
 *
 * @param G
 * @param type Тип лога.
 * @param value Значение, заносимое в лог.
 * @constructor
 */
export const AddDataToLog = (G, type, value) => {
    G.logData.push({
        type,
        value,
    });
};
