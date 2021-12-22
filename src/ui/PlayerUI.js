import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { suitsConfig } from "../data/SuitData";
import { tavernsConfig } from "../Tavern";
import { CurrentScoring } from "../Score";
import { Styles } from "../data/StyleData";
import { DrawCard, DrawCoin, OnClickBoardCoin, OnClickHandCoin } from "../helpers/UIHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Игровые поля для планшета всех карт игрока.
 * @constructor
 */
export const DrawPlayersBoards = (data) => {
    const playersBoards = [], playerHeaders = [], playerHeadersCount = [], playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        for (const suit in suitsConfig) {
            if (suitsConfig.hasOwnProperty(suit)) {
                playerHeaders[p].push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }, void 0) }, `${data.props.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName}`));
                playerHeadersCount[p].push(_jsx("th", { className: `${suitsConfig[suit].suitColor} text-white`, children: _jsx("b", { children: data.props.G.publicPlayers[p].cards[suit].reduce(TotalRank, 0) }, void 0) }, `${data.props.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName} count`));
            }
        }
        for (let s = 0; s < 1 + Number(data.props.G.expansions.thingvellir.active); s++) {
            if (s === 0) {
                playerHeaders[p].push(_jsx("th", { className: "bg-gray-600", children: _jsx("span", { style: Styles.HeroBack(), className: "bg-hero-icon" }, void 0) }, `${data.props.G.publicPlayers[p].nickname} hero icon`));
                playerHeadersCount[p].push(_jsx("th", { className: "bg-gray-600 text-white", children: _jsx("b", { children: data.props.G.publicPlayers[p].heroes.length }, void 0) }, `${data.props.G.publicPlayers[p].nickname} hero count`));
            }
            else {
                playerHeaders[p].push(_jsx("th", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }, void 0) }, `${data.props.G.publicPlayers[p].nickname} camp icon`));
                playerHeadersCount[p].push(_jsx("th", { className: "bg-yellow-200 text-white", children: _jsx("b", { children: data.props.G.publicPlayers[p].campCards.length }, void 0) }, `${data.props.G.publicPlayers[p].nickname} camp counts`));
            }
        }
        for (let i = 0;; i++) {
            const playerCells = [];
            let isDrawRow = false, id = 0, j = 0;
            playerRows[p][i] = [];
            for (const suit in suitsConfig) {
                if (suitsConfig.hasOwnProperty(suit)) {
                    id = i + j;
                    if (data.props.G.publicPlayers[p].cards[suit][i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.props.G.publicPlayers[p].cards[suit][i], id, data.props.G.publicPlayers[p], suit);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${data.props.G.publicPlayers[p].nickname} empty card ${id}`));
                    }
                    j++;
                }
            }
            for (let k = 0; k < 1 + Number(data.props.G.expansions.thingvellir.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards = [];
                    for (const suit in suitsConfig) {
                        if (suitsConfig.hasOwnProperty(suit)) {
                            playerCards.concat(data.props.G.publicPlayers[p].cards[suit]);
                        }
                    }
                    // todo Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (data.props.G.publicPlayers[p].heroes[i] !== undefined &&
                        (!data.props.G.publicPlayers[p].heroes[i].suit &&
                            !((data.props.G.publicPlayers[p].heroes[i].name === `Ylud`
                                && playerCards.findIndex((card) => card.name === `Ylud`) !== -1)
                                || (data.props.G.publicPlayers[p].heroes[i].name === `Thrud`
                                    && playerCards.findIndex((card) => card.name === `Thrud`) !== -1)))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.props.G.publicPlayers[p].heroes[i], id, data.props.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${data.props.G.publicPlayers[p].nickname} hero ${i}`));
                    }
                }
                else {
                    if (data.props.G.publicPlayers[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.props.G.publicPlayers[p].campCards[i], id, data.props.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${data.props.G.publicPlayers[p].nickname} camp card ${i}`));
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(_jsx("tr", { children: playerCells }, `${data.props.G.publicPlayers[p].nickname} board row ${i}`));
            }
            else {
                break;
            }
        }
        playersBoards[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", data.props.G.publicPlayers[p].nickname, ") cards, ", data.props.G.winner.length ? `Final: ${data.props.G.totalScore[p]}` :
                            CurrentScoring(data.props.G.publicPlayers[p]), " points"] }, void 0), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders[p] }, void 0), _jsx("tr", { children: playerHeadersCount[p] }, void 0)] }, void 0), _jsx("tbody", { children: playerRows[p] }, void 0)] }, `${data.props.G.publicPlayers[p].nickname} board`));
    }
    return playersBoards;
};
/**
 * <h3>Отрисовка планшета монет, выложенных игроком на стол.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет на столе.
 * @constructor
 */
export const DrawPlayersBoardsCoins = (data) => {
    var _a;
    const playersBoardsCoins = [], playerHeaders = [], playerFooters = [], playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        let coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
        playerRows[p] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (let j = 0; j < data.props.G.tavernsNum; j++) {
                    playerHeaders[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Taverns(j), className: "bg-tavern-icon" }, void 0) }, `Tavern ${tavernsConfig[j].name}`));
                    if (data.props.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                        if ((Number(data.props.ctx.currentPlayer) === p && data.props.ctx.phase === `placeCoins`)
                            || (Number(data.props.ctx.currentPlayer) === p
                                && data.props.ctx.phase === `placeCoinsUline`
                                && j === data.props.G.currentTavern + 1)) {
                            DrawCoin(data, playerCells, `back-tavern-icon`, data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, j, OnClickBoardCoin.name, j);
                        }
                        else {
                            DrawCoin(data, playerCells, `back-tavern-icon`, data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, j);
                        }
                    }
                    else if (data.props.ctx.phase === `placeCoins`
                        && Number(data.props.ctx.currentPlayer) === p) {
                        DrawCoin(data, playerCells, `coin`, data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, null, OnClickBoardCoin.name, j);
                    }
                    else {
                        if (data.props.G.winner.length || (data.props.ctx.phase === `placeCoinsUline`
                            && data.props.G.currentTavern >= j - 1) || (data.props.ctx.phase !== `placeCoins`
                            && data.props.G.currentTavern >= j)) {
                            DrawCoin(data, playerCells, `coin`, data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                        }
                        else {
                            DrawCoin(data, playerCells, `back`, data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                        }
                    }
                    coinIndex++;
                }
            }
            else if (i === 1) {
                for (let j = data.props.G.tavernsNum; j <= data.props.G.publicPlayers[p].boardCoins.length; j++) {
                    if (j === data.props.G.publicPlayers[p].boardCoins.length) {
                        playerFooters[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Priority(), className: "bg-priority-icon" }, void 0) }, `${data.props.G.publicPlayers[p].nickname} priority icon`));
                        playerCells.push(_jsx("td", { className: "bg-gray-300", children: _jsx("span", { style: Styles.Priorities(data.props.G.publicPlayers[p].priority.value), className: "bg-priority" }, void 0) }, `${data.props.G.publicPlayers[p].nickname} priority gem`));
                    }
                    else {
                        playerFooters[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }, void 0) }, `${data.props.G.publicPlayers[p].nickname} exchange icon ${j}`));
                        const coin = data.props.G.publicPlayers[p].boardCoins[coinIndex];
                        if (coin === null) {
                            if (Number(data.props.ctx.currentPlayer) === p
                                && data.props.ctx.phase !== `placeCoinsUline` && (data.props.ctx.phase === `placeCoins`
                                || (data.props.ctx.activePlayers
                                    && data.props.ctx.activePlayers[Number(data.props.ctx.currentPlayer)]) ===
                                    `placeTradingCoinsUline`)) {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex, data.props.G.publicPlayers[p], null, null, OnClickBoardCoin.name, j);
                            }
                            else {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex, data.props.G.publicPlayers[p]);
                            }
                        }
                        else if (Number(data.props.ctx.currentPlayer) === p
                            && (data.props.ctx.phase === `placeCoins` || (data.props.ctx.activePlayers
                                && data.props.ctx.activePlayers[Number(data.props.ctx.currentPlayer)]) ===
                                `placeTradingCoinsUline`)) {
                            DrawCoin(data, playerCells, `coin`, coin, coinIndex, data.props.G.publicPlayers[p], null, null, OnClickBoardCoin.name, j);
                        }
                        else {
                            if (data.props.G.winner.length || (data.props.ctx.phase !== `placeCoins`
                                && Number(data.props.ctx.currentPlayer) === p
                                && data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern] !== null
                                && ((_a = data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading))) {
                                DrawCoin(data, playerCells, `coin`, coin, coinIndex, data.props.G.publicPlayers[p]);
                            }
                            else {
                                DrawCoin(data, playerCells, `back`, coin, coinIndex, data.props.G.publicPlayers[p]);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(_jsx("tr", { children: playerCells }, `${data.props.G.publicPlayers[p].nickname} board coins row ${i}`));
        }
        playersBoardsCoins[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", data.props.G.publicPlayers[p].nickname, ") played coins"] }, void 0), _jsx("thead", { children: _jsx("tr", { children: playerHeaders[p] }, void 0) }, void 0), _jsx("tbody", { children: playerRows[p] }, void 0), _jsx("tfoot", { children: _jsx("tr", { children: playerFooters[p] }, void 0) }, void 0)] }, `${data.props.G.publicPlayers[p].nickname} board coins`));
    }
    return playersBoardsCoins;
};
/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет в руке.
 * @constructor
 */
export const DrawPlayersHandsCoins = (data) => {
    const playersHandsCoins = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        const playerCells = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.props.G.publicPlayers[p].handCoins.length; j++) {
                if (data.props.G.publicPlayers[p].handCoins[j] === null) {
                    playerCells.push(_jsx("td", { className: "bg-yellow-300", children: _jsx("span", { className: "bg-coin bg-yellow-300 border-2" }, void 0) }, `${data.props.G.publicPlayers[p].nickname} hand coin ${j} empty`));
                }
                else {
                    if (Number(data.props.ctx.currentPlayer) === p || data.props.G.winner.length) {
                        let coinClasses = `border-2`;
                        if (data.props.G.publicPlayers[p].selectedCoin === j) {
                            coinClasses = `border-2 border-green-400`;
                        }
                        if (!data.props.G.winner.length && (data.props.ctx.phase === `placeCoins`
                            || data.props.ctx.phase === `placeCoinsUline` || (data.props.ctx.activePlayers
                            && data.props.ctx.activePlayers[Number(data.props.ctx.currentPlayer)]) ===
                            `placeTradingCoinsUline`)) {
                            DrawCoin(data, playerCells, `coin`, data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p], coinClasses, null, OnClickHandCoin.name, j);
                        }
                        else {
                            DrawCoin(data, playerCells, `coin`, data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p], coinClasses);
                        }
                    }
                    else {
                        DrawCoin(data, playerCells, `back`, data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p]);
                    }
                }
            }
        }
        playersHandsCoins[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", data.props.G.publicPlayers[p].nickname, ") coins"] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: playerCells }, void 0) }, void 0)] }, `${data.props.G.publicPlayers[p].nickname} hand coins`));
    }
    return playersHandsCoins;
};
