import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { MoveNames, RusCardTypes } from "../typescript/enums";
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
export const DrawBoard = (objectsSize) => {
    const boardRows = Math.floor(Math.sqrt(objectsSize)), boardCols = Math.ceil(objectsSize / boardRows), lastBoardCol = objectsSize % boardCols;
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
export const DrawPlayerBoardForCardDiscard = (data) => {
    // todo Discard cards must be hidden from others users?
    const playerHeaders = [], playerRows = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }, void 0) }, `${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} ${suitsConfig[suit].suitName}`));
        }
    }
    DiscardAnyCardFromPlayerBoardProfit(data.G, data.ctx, data, playerRows);
    return (_jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playerHeaders }, void 0) }, void 0), _jsx("tbody", { children: playerRows }, void 0)] }, void 0));
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
export const DrawPlayersBoardForSuitCardDiscard = (data, suit) => {
    const playersHeaders = [], playersRows = [];
    for (let p = 0; p < data.G.publicPlayers.length; p++) {
        if (p !== Number(data.ctx.currentPlayer)) {
            playersHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor} discard suit`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: p + 1 }, void 0) }, `${data.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName}`));
        }
    }
    for (let i = 0;; i++) {
        let isDrawRow = false, isExit = true;
        playersRows[i] = [];
        const playersCells = [];
        for (let p = 0; p < data.G.publicPlayers.length; p++) {
            if (p !== Number(data.ctx.currentPlayer)) {
                if (data.G.publicPlayers[p].cards[suit][i] !== undefined) {
                    if (data.G.publicPlayers[p].cards[suit][i].type !== RusCardTypes.HERO) {
                        isExit = false;
                        isDrawRow = true;
                        DrawCard(data, playersCells, data.G.publicPlayers[p].cards[suit][i], i, data.G.publicPlayers[p], suit, MoveNames.DiscardSuitCardFromPlayerBoardMove, suit, p, i);
                    }
                }
                else {
                    playersCells.push(_jsx("td", {}, `${data.G.publicPlayers[p].nickname} discard suit cardboard row ${i}`));
                }
            }
        }
        if (isDrawRow) {
            playersRows[i].push(_jsx("tr", { children: playersCells }, `Discard suit cardboard row ${i}`));
        }
        if (isExit) {
            break;
        }
    }
    return (_jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playersHeaders }, void 0) }, void 0), _jsx("tbody", { children: playersRows }, void 0)] }, void 0));
};
