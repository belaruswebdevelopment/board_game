import type { DrawBoardOptions } from "../typescript/interfaces";

/**
 * h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns Параметры для отрисовки сегмента игрового поля.
 */
export const DrawBoard = (objectsSize: number): DrawBoardOptions => {
    const boardRows: number = Math.floor(Math.sqrt(objectsSize)),
        boardCols: number = Math.ceil(objectsSize / boardRows),
        lastBoardCol: number = objectsSize % boardCols;
    return {
        boardRows,
        boardCols,
        lastBoardCol,
    };
};
