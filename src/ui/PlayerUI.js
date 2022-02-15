import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { HeroNames, MoveNames, Phases, Stages } from "../typescript/enums";
import { DrawCard, DrawCoin } from "./ElementsUI";
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
        const player = data.G.publicPlayers[p];
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                playerHeaders[p].push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }, void 0) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
                playerHeadersCount[p].push(_jsx("th", { className: `${suitsConfig[suit].suitColor} text-white`, children: _jsx("b", { children: player.cards[suit].reduce(TotalRank, 0) }, void 0) }, `${player.nickname} ${suitsConfig[suit].suitName} count`));
            }
        }
        for (let s = 0; s < 1 + Number(data.G.expansions.thingvellir.active); s++) {
            if (s === 0) {
                playerHeaders[p].push(_jsx("th", { className: "bg-gray-600", children: _jsx("span", { style: Styles.HeroBack(), className: "bg-hero-icon" }, void 0) }, `${player.nickname} hero icon`));
                playerHeadersCount[p].push(_jsx("th", { className: "bg-gray-600 text-white", children: _jsx("b", { children: player.heroes.length }, void 0) }, `${player.nickname} hero count`));
            }
            else {
                playerHeaders[p].push(_jsx("th", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }, void 0) }, `${player.nickname} camp icon`));
                playerHeadersCount[p].push(_jsx("th", { className: "bg-yellow-200 text-white", children: _jsx("b", { children: player.campCards.length }, void 0) }, `${player.nickname} camp counts`));
            }
        }
        for (let i = 0;; i++) {
            const playerCells = [];
            let isDrawRow = false, id = 0, j = 0;
            playerRows[p][i] = [];
            for (const suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    if (player.cards[suit][i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.cards[suit][i], id, player, suit);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                    }
                    j++;
                }
            }
            for (let k = 0; k < 1 + Number(data.G.expansions.thingvellir.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards = Object.values(player.cards).flat();
                    // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (player.heroes[i] !== undefined && (!player.heroes[i].suit
                        && !((player.heroes[i].name === HeroNames.Ylud
                            && playerCards.findIndex((card) => card.name === HeroNames.Ylud) !== -1)
                            || (player.heroes[i].name === HeroNames.Thrud
                                && playerCards.findIndex((card) => card.name === HeroNames.Thrud) !== -1)))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.heroes[i], id, player);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${player.nickname} hero ${i}`));
                    }
                }
                else {
                    if (player.campCards[i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.campCards[i], id, player);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${player.nickname} camp card ${i}`));
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(_jsx("tr", { children: playerCells }, `${player.nickname} board row ${i}`));
            }
            else {
                break;
            }
        }
        playersBoards[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") cards, ", data.G.winner.length ? `Final: ${data.G.totalScore[p]}` : CurrentScoring(player), " points"] }, void 0), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders[p] }, void 0), _jsx("tr", { children: playerHeadersCount[p] }, void 0)] }, void 0), _jsx("tbody", { children: playerRows[p] }, void 0)] }, `${player.nickname} board`));
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
    // TODO Your coins always public for you only, others private, but you see previous/current tavern coins for all players (and your's transparent for non opened coins)
    const playersBoardsCoins = [], playerHeaders = [], playerFooters = [], playerRows = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const player = data.G.publicPlayers[p];
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
                    if (player.boardCoins[coinIndex] === null) {
                        if (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins) {
                            DrawCoin(data, playerCells, `back-tavern-icon`, player.boardCoins[coinIndex], coinIndex, player, null, j, MoveNames.ClickBoardCoinMove, j);
                        }
                        else {
                            DrawCoin(data, playerCells, `back-tavern-icon`, player.boardCoins[coinIndex], coinIndex, player, null, j);
                        }
                    }
                    else if (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins) {
                        DrawCoin(data, playerCells, `coin`, player.boardCoins[coinIndex], coinIndex, player, null, null, MoveNames.ClickBoardCoinMove, j);
                    }
                    else {
                        if (data.G.winner.length
                            || (data.ctx.phase !== Phases.PlaceCoins && data.G.currentTavern >= j)) {
                            DrawCoin(data, playerCells, `coin`, player.boardCoins[coinIndex], coinIndex, player);
                        }
                        else {
                            DrawCoin(data, playerCells, `back`, player.boardCoins[coinIndex], coinIndex, player);
                        }
                    }
                    coinIndex++;
                }
            }
            else if (i === 1) {
                for (let j = data.G.tavernsNum; j <= player.boardCoins.length; j++) {
                    if (j === player.boardCoins.length) {
                        playerFooters[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Priority(), className: "bg-priority-icon" }, void 0) }, `${player.nickname} priority icon`));
                        playerCells.push(_jsx("td", { className: "bg-gray-300", children: _jsx("span", { style: Styles.Priorities(player.priority.value), className: "bg-priority" }, void 0) }, `${player.nickname} priority gem`));
                    }
                    else {
                        playerFooters[p].push(_jsx("th", { children: _jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }, void 0) }, `${player.nickname} exchange icon ${j}`));
                        const coin = player.boardCoins[coinIndex];
                        if (coin === null) {
                            if (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins) {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex, player, null, null, MoveNames.ClickBoardCoinMove, j);
                            }
                            else {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex, player);
                            }
                        }
                        else if (Number(data.ctx.currentPlayer) === p
                            && data.ctx.phase === Phases.PlaceCoins) {
                            DrawCoin(data, playerCells, `coin`, coin, coinIndex, player, null, null, MoveNames.ClickBoardCoinMove, j);
                        }
                        else {
                            if (data.G.winner.length || (data.ctx.phase !== Phases.PlaceCoins
                                && Number(data.ctx.currentPlayer) === p
                                && player.boardCoins[data.G.currentTavern] !== null
                                && ((_a = player.boardCoins[data.G.currentTavern]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading))) {
                                DrawCoin(data, playerCells, `coin`, coin, coinIndex, player);
                            }
                            else {
                                DrawCoin(data, playerCells, `back`, coin, coinIndex, player);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(_jsx("tr", { children: playerCells }, `${player.nickname} board coins row ${i}`));
        }
        playersBoardsCoins[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") played coins"] }, void 0), _jsx("thead", { children: _jsx("tr", { children: playerHeaders[p] }, void 0) }, void 0), _jsx("tbody", { children: playerRows[p] }, void 0), _jsx("tfoot", { children: _jsx("tr", { children: playerFooters[p] }, void 0) }, void 0)] }, `${player.nickname} board coins`));
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
    // TODO Your coins always public for you only, others always private!
    const playersHandsCoins = [];
    let moveName;
    switch (data.ctx.phase) {
        case Phases.PlaceCoins:
            moveName = MoveNames.ClickHandCoinMove;
            break;
        case Phases.PlaceCoinsUline:
            moveName = MoveNames.ClickHandCoinUlineMove;
            break;
        case Phases.PickCards:
            moveName = MoveNames.ClickHandTradingCoinUlineMove;
            break;
        default:
            moveName = undefined;
            break;
    }
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const player = data.G.publicPlayers[p];
        const playerCells = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < player.handCoins.length; j++) {
                if (player.handCoins[j] === null) {
                    playerCells.push(_jsx("td", { className: "bg-yellow-300", children: _jsx("span", { className: "bg-coin bg-yellow-300 border-2" }, void 0) }, `${player.nickname} hand coin ${j} empty`));
                }
                else {
                    if (Number(data.ctx.currentPlayer) === p || data.G.winner.length) {
                        let coinClasses = `border-2`;
                        if (data.G.publicPlayers[p].selectedCoin === j) {
                            coinClasses = `border-2 border-green-400`;
                        }
                        if (!data.G.winner.length && (data.ctx.phase === Phases.PlaceCoins
                            || data.ctx.phase === Phases.PlaceCoinsUline || (data.ctx.activePlayers
                            && data.ctx.activePlayers[Number(data.ctx.currentPlayer)] ===
                                Stages.PlaceTradingCoinsUline))) {
                            DrawCoin(data, playerCells, `coin`, player.handCoins[j], j, player, coinClasses, null, moveName, j);
                        }
                        else {
                            DrawCoin(data, playerCells, `coin`, player.handCoins[j], j, player, coinClasses);
                        }
                    }
                    else {
                        DrawCoin(data, playerCells, `back`, player.handCoins[j], j, player);
                    }
                }
            }
        }
        playersHandsCoins[p].push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") coins"] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: playerCells }, void 0) }, void 0)] }, `${player.nickname} hand coins`));
    }
    return playersHandsCoins;
};
//# sourceMappingURL=PlayerUI.js.map