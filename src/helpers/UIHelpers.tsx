import { BoardProps } from "boardgame.io/react";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { IDrawBoardOptions } from "../typescript/board_interfaces";
import { RusCardTypes } from "../typescript/enums";
import { MyGameState } from "../typescript/game_data_interfaces";
import { DiscardAnyCardFromPlayerBoardProfit } from "./ProfitHelpers";
import { DrawCard } from "./UIElementHelpers";

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
export const DrawBoard = (objectsSize: number): IDrawBoardOptions => {
    const boardRows: number = Math.floor(Math.sqrt(objectsSize)),
        boardCols: number = Math.ceil(objectsSize / boardRows),
        lastBoardCol: number = objectsSize % boardCols;
    return { boardRows, boardCols, lastBoardCol };
};

/**
 * <h3>Отрисовка планшета конкретного игрока для дискарда карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшета конкретного игрока для дискарда карты по действию артефакта Brisingamens.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле для вывода карт для дискарда.
 */
export const DrawPlayerBoardForCardDiscard = (data: BoardProps<MyGameState>): JSX.Element => {
    // todo Discard cards must be hidden from others users?
    const playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[][] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            playerHeaders.push(
                <th className={`${suitsConfig[suit].suitColor}`}
                    key={`${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} ${suitsConfig[suit].suitName}`}>
                    <span style={Styles.Suits(suit)} className="bg-suit-icon">

                    </span>
                </th>
            );
        }
    }
    DiscardAnyCardFromPlayerBoardProfit(data.G, data.ctx, data, playerRows);
    return (
        <table>
            <thead>
                <tr>{playerHeaders}</tr>
            </thead>
            <tbody>{playerRows}</tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка планшета конкретных игроков для дискарда карты конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшетов конкретных игроков для дискарда карты конкретной фракции по действию артефакта Hofud.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param suit Название фракции.
 * @returns Поле игрока для дискарда карты фракции.
 */
export const DrawPlayersBoardForSuitCardDiscard = (data: BoardProps<MyGameState>, suit: string): JSX.Element => {
    const playersHeaders: JSX.Element[] = [],
        playersRows: JSX.Element[][] = [];
    for (let p = 0; p < data.G.publicPlayers.length; p++) {
        if (p !== Number(data.ctx.currentPlayer)) {
            playersHeaders.push(
                <th className={`${suitsConfig[suit].suitColor} discard suit`}
                    key={`${data.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName}`}>
                    <span style={Styles.Suits(suit)} className="bg-suit-icon">
                        {p + 1}
                    </span>
                </th>
            );
        }
    }
    for (let i = 0; ; i++) {
        let isDrawRow = false,
            isExit = true;
        playersRows[i] = [];
        const playersCells: JSX.Element[] = [];
        for (let p = 0; p < data.G.publicPlayers.length; p++) {
            if (p !== Number(data.ctx.currentPlayer)) {
                if (data.G.publicPlayers[p].cards[suit][i] !== undefined) {
                    if (data.G.publicPlayers[p].cards[suit][i].type !== RusCardTypes.HERO) {
                        isExit = false;
                        isDrawRow = true;
                        DrawCard(data, playersCells,
                            data.G.publicPlayers[p].cards[suit][i], i,
                            data.G.publicPlayers[p], suit,
                            data.moves.DiscardSuitCardFromPlayerBoardMove.name, suit, p, i);
                    }
                } else {
                    playersCells.push(
                        <td key={`${data.G.publicPlayers[p].nickname} discard suit cardboard row ${i}`}>

                        </td>
                    );
                }
            }
        }
        if (isDrawRow) {
            playersRows[i].push(
                <tr key={`Discard suit cardboard row ${i}`}>
                    {playersCells}
                </tr>
            );
        }
        if (isExit) {
            break;
        }
    }
    return (
        <table>
            <thead>
                <tr>{playersHeaders}</tr>
            </thead>
            <tbody>{playersRows}</tbody>
        </table>
    );
};
