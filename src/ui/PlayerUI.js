import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { TotalRank } from "../helpers/ScoreHelpers";
import { DrawCard, DrawCoin } from "../helpers/UIElementHelpers";
import { CurrentScoring } from "../Score";
import { tavernsConfig } from "../Tavern";
import { HeroNames, MoveNames, Phases, Stages } from "../typescript/enums";
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
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                playerHeaders[p].push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }, void 0) }, `${data.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName}`));
                playerHeadersCount[p].push(_jsx("th", { className: `${suitsConfig[suit].suitColor} text-white`, children: _jsx("b", { children: data.G.publicPlayers[p].cards[suit].reduce(TotalRank, 0) }, void 0) }, `${data.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName} count`));
            }
        }
        for (let s = 0; s < 1 + Number(data.G.expansions.thingvellir.active); s++) {
            if (s === 0) {
                playerHeaders[p].push(_jsx("th", { className: "bg-gray-600", children: _jsx("span", { style: Styles.HeroBack(), className: "bg-hero-icon" }, void 0) }, `${data.G.publicPlayers[p].nickname} hero icon`));
                playerHeadersCount[p].push(_jsx("th", { className: "bg-gray-600 text-white", children: _jsx("b", { children: data.G.publicPlayers[p].heroes.length }, void 0) }, `${data.G.publicPlayers[p].nickname} hero count`));
            }
            else {
                playerHeaders[p].push(_jsx("th", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }, void 0) }, `${data.G.publicPlayers[p].nickname} camp icon`));
                playerHeadersCount[p].push(_jsx("th", { className: "bg-yellow-200 text-white", children: _jsx("b", { children: data.G.publicPlayers[p].campCards.length }, void 0) }, `${data.G.publicPlayers[p].nickname} camp counts`));
            }
        }
        for (let i = 0;; i++) {
            const playerCells = [];
            let isDrawRow = false, id = 0, j = 0;
            playerRows[p][i] = [];
            for (const suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    if (data.G.publicPlayers[p].cards[suit][i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.G.publicPlayers[p].cards[suit][i], id, data.G.publicPlayers[p], suit);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${data.G.publicPlayers[p].nickname} empty card ${id}`));
                    }
                    j++;
                }
            }
            for (let k = 0; k < 1 + Number(data.G.expansions.thingvellir.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards = Object.values(data.G.publicPlayers[p].cards).flat();
                    // todo Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (data.G.publicPlayers[p].heroes[i] !== undefined && (!data.G.publicPlayers[p].heroes[i].suit
                        && !((data.G.publicPlayers[p].heroes[i].name === HeroNames.Ylud
                            && playerCards.findIndex((card) => card.name === HeroNames.Ylud) !== -1)
                            || (data.G.publicPlayers[p].heroes[i].name === HeroNames.Thrud
                                && playerCards.findIndex((card) => card.name === HeroNames.Thrud) !== -1)))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.G.publicPlayers[p].heroes[i], id, data.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${data.G.publicPlayers[p].nickname} hero ${i}`));
                    }
                }
                else {
                    if (data.G.publicPlayers[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.G.publicPlayers[p].campCards[i], id, data.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${data.G.publicPlayers[p].nickname} camp card ${i}`));
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(_jsx("tr", { children: playerCells }, `${data.G.publicPlayers[p].nickname} board row ${i}`));
            }
            else {
                break;
            }
        }
        playersBoards[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", data.G.publicPlayers[p].nickname, ") cards, ", data.G.winner.length ? `Final: ${data.G.totalScore[p]}` : CurrentScoring(data.G.publicPlayers[p]), " points"] }, void 0), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders[p] }, void 0), _jsx("tr", { children: playerHeadersCount[p] }, void 0)] }, void 0), _jsx("tbody", { children: playerRows[p] }, void 0)] }, `${data.G.publicPlayers[p].nickname} board`));
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
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        let coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
        playerRows[p] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (let j = 0; j < data.G.tavernsNum; j++) {
                    playerHeaders[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Taverns(j), className: "bg-tavern-icon" }, void 0) }, `Tavern ${tavernsConfig[j].name}`));
                    if (data.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                        if ((Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins)
                            || (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoinsUline
                                && j === data.G.currentTavern + 1)) {
                            DrawCoin(data, playerCells, `back-tavern-icon`, data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.G.publicPlayers[p], null, j, MoveNames.ClickBoardCoinMove, j);
                        }
                        else {
                            DrawCoin(data, playerCells, `back-tavern-icon`, data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.G.publicPlayers[p], null, j);
                        }
                    }
                    else if (data.ctx.phase === Phases.PlaceCoins && Number(data.ctx.currentPlayer) === p) {
                        DrawCoin(data, playerCells, `coin`, data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.G.publicPlayers[p], null, null, MoveNames.ClickBoardCoinMove, j);
                    }
                    else {
                        if (data.G.winner.length || (data.ctx.phase === Phases.PlaceCoinsUline
                            && data.G.currentTavern >= j - 1) || (data.ctx.phase !== Phases.PlaceCoins
                            && data.G.currentTavern >= j)) {
                            DrawCoin(data, playerCells, `coin`, data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.G.publicPlayers[p]);
                        }
                        else {
                            DrawCoin(data, playerCells, `back`, data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.G.publicPlayers[p]);
                        }
                    }
                    coinIndex++;
                }
            }
            else if (i === 1) {
                for (let j = data.G.tavernsNum; j <= data.G.publicPlayers[p].boardCoins.length; j++) {
                    if (j === data.G.publicPlayers[p].boardCoins.length) {
                        playerFooters[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Priority(), className: "bg-priority-icon" }, void 0) }, `${data.G.publicPlayers[p].nickname} priority icon`));
                        playerCells.push(_jsx("td", { className: "bg-gray-300", children: _jsx("span", { style: Styles.Priorities(data.G.publicPlayers[p].priority.value), className: "bg-priority" }, void 0) }, `${data.G.publicPlayers[p].nickname} priority gem`));
                    }
                    else {
                        playerFooters[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }, void 0) }, `${data.G.publicPlayers[p].nickname} exchange icon ${j}`));
                        const coin = data.G.publicPlayers[p].boardCoins[coinIndex];
                        if (coin === null) {
                            if (Number(data.ctx.currentPlayer) === p && data.ctx.phase !== Phases.PlaceCoinsUline
                                && (data.ctx.phase === Phases.PlaceCoins || (data.ctx.activePlayers
                                    && data.ctx.activePlayers[Number(data.ctx.currentPlayer)]) ===
                                    Stages.PlaceTradingCoinsUline)) {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex, data.G.publicPlayers[p], null, null, MoveNames.ClickBoardCoinMove, j);
                            }
                            else {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex, data.G.publicPlayers[p]);
                            }
                        }
                        else if (Number(data.ctx.currentPlayer) === p
                            && (data.ctx.phase === Phases.PlaceCoins || (data.ctx.activePlayers
                                && data.ctx.activePlayers[Number(data.ctx.currentPlayer)]) ===
                                Stages.PlaceTradingCoinsUline)) {
                            DrawCoin(data, playerCells, `coin`, coin, coinIndex, data.G.publicPlayers[p], null, null, MoveNames.ClickBoardCoinMove, j);
                        }
                        else {
                            if (data.G.winner.length || (data.ctx.phase !== Phases.PlaceCoins
                                && Number(data.ctx.currentPlayer) === p
                                && data.G.publicPlayers[p].boardCoins[data.G.currentTavern] !== null
                                && ((_a = data.G.publicPlayers[p].boardCoins[data.G.currentTavern]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading))) {
                                DrawCoin(data, playerCells, `coin`, coin, coinIndex, data.G.publicPlayers[p]);
                            }
                            else {
                                DrawCoin(data, playerCells, `back`, coin, coinIndex, data.G.publicPlayers[p]);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(_jsx("tr", { children: playerCells }, `${data.G.publicPlayers[p].nickname} board coins row ${i}`));
        }
        playersBoardsCoins[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", data.G.publicPlayers[p].nickname, ") played coins"] }, void 0), _jsx("thead", { children: _jsx("tr", { children: playerHeaders[p] }, void 0) }, void 0), _jsx("tbody", { children: playerRows[p] }, void 0), _jsx("tfoot", { children: _jsx("tr", { children: playerFooters[p] }, void 0) }, void 0)] }, `${data.G.publicPlayers[p].nickname} board coins`));
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
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const playerCells = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.G.publicPlayers[p].handCoins.length; j++) {
                if (data.G.publicPlayers[p].handCoins[j] === null) {
                    playerCells.push(_jsx("td", { className: "bg-yellow-300", children: _jsx("span", { className: "bg-coin bg-yellow-300 border-2" }, void 0) }, `${data.G.publicPlayers[p].nickname} hand coin ${j} empty`));
                }
                else {
                    if (Number(data.ctx.currentPlayer) === p || data.G.winner.length) {
                        let coinClasses = `border-2`;
                        if (data.G.publicPlayers[p].selectedCoin === j) {
                            coinClasses = `border-2 border-green-400`;
                        }
                        if (!data.G.winner.length && (data.ctx.phase === Phases.PlaceCoins
                            || data.ctx.phase === Phases.PlaceCoinsUline || (data.ctx.activePlayers
                            && data.ctx.activePlayers[Number(data.ctx.currentPlayer)]) ===
                            Stages.PlaceTradingCoinsUline)) {
                            DrawCoin(data, playerCells, `coin`, data.G.publicPlayers[p].handCoins[j], j, data.G.publicPlayers[p], coinClasses, null, MoveNames.ClickHandCoinMove, j);
                        }
                        else {
                            DrawCoin(data, playerCells, `coin`, data.G.publicPlayers[p].handCoins[j], j, data.G.publicPlayers[p], coinClasses);
                        }
                    }
                    else {
                        DrawCoin(data, playerCells, `back`, data.G.publicPlayers[p].handCoins[j], j, data.G.publicPlayers[p]);
                    }
                }
            }
        }
        playersHandsCoins[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", data.G.publicPlayers[p].nickname, ") coins"] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: playerCells }, void 0) }, void 0)] }, `${data.G.publicPlayers[p].nickname} hand coins`));
    }
    return playersHandsCoins;
};
