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
export const AddDataToLog = ({ G }, type, value) => {
    G.logData.push({ type, text: value });
};
//# sourceMappingURL=Logging.js.map