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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const playersBoards = [], playerHeaders = [], playerHeadersCount = [], playerRows = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const player = data.G.publicPlayers[p];
        if (player !== undefined) {
            playersBoards[p] = [];
            playerHeaders[p] = [];
            playerHeadersCount[p] = [];
            playerRows[p] = [];
            let suit;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    // TODO Check it "?"
                    (_a = playerHeaders[p]) === null || _a === void 0 ? void 0 : _a.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
                    // TODO Check it "?"
                    (_b = playerHeadersCount[p]) === null || _b === void 0 ? void 0 : _b.push(_jsx("th", { className: `${suitsConfig[suit].suitColor} text-white`, children: _jsx("b", { children: player.cards[suit].reduce(TotalRank, 0) }) }, `${player.nickname} ${suitsConfig[suit].suitName} count`));
                }
            }
            for (let s = 0; s < 1 + Number(data.G.expansions.thingvellir.active); s++) {
                if (s === 0) {
                    // TODO Check it "?"
                    (_c = playerHeaders[p]) === null || _c === void 0 ? void 0 : _c.push(_jsx("th", { className: "bg-gray-600", children: _jsx("span", { style: Styles.HeroBack(), className: "bg-hero-icon" }) }, `${player.nickname} hero icon`));
                    // TODO Check it "?"
                    (_d = playerHeadersCount[p]) === null || _d === void 0 ? void 0 : _d.push(_jsx("th", { className: "bg-gray-600 text-white", children: _jsx("b", { children: player.heroes.length }) }, `${player.nickname} hero count`));
                }
                else {
                    // TODO Check it "?"
                    (_e = playerHeaders[p]) === null || _e === void 0 ? void 0 : _e.push(_jsx("th", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }) }, `${player.nickname} camp icon`));
                    // TODO Check it "?"
                    (_f = playerHeadersCount[p]) === null || _f === void 0 ? void 0 : _f.push(_jsx("th", { className: "bg-yellow-200 text-white", children: _jsx("b", { children: player.campCards.length }) }, `${player.nickname} camp counts`));
                }
            }
            for (let i = 0;; i++) {
                // TODO Check it "!"
                playerRows[p][i] = [];
                const playerCells = [];
                let isDrawRow = false, id = 0, j = 0, suit;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        id = i + j;
                        const card = player.cards[suit][i];
                        if (card !== undefined) {
                            isDrawRow = true;
                            DrawCard(data, playerCells, card, id, player, suit);
                        }
                        else {
                            playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                        }
                        j++;
                    }
                }
                for (let k = 0; k < 1 + Number((_g = data.G.expansions.thingvellir) === null || _g === void 0 ? void 0 : _g.active); k++) {
                    id += k + 1;
                    if (k === 0) {
                        const playerCards = Object.values(player.cards).flat(), hero = player.heroes[i];
                        // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                        if (hero !== undefined && !hero.suit
                            && !((hero.name === HeroNames.Ylud
                                && playerCards.findIndex((card) => card.name === HeroNames.Ylud) !== -1)
                                || (hero.name === HeroNames.Thrud
                                    && playerCards.findIndex((card) => card.name === HeroNames.Thrud) !== -1))) {
                            isDrawRow = true;
                            DrawCard(data, playerCells, hero, id, player);
                        }
                        else {
                            playerCells.push(_jsx("td", {}, `${player.nickname} hero ${i}`));
                        }
                    }
                    else {
                        const campCard = player.campCards[i];
                        if (campCard !== undefined) {
                            isDrawRow = true;
                            DrawCard(data, playerCells, campCard, id, player);
                        }
                        else {
                            playerCells.push(_jsx("td", {}, `${player.nickname} camp card ${i}`));
                        }
                    }
                }
                if (isDrawRow) {
                    // TODO Check it "?"
                    (_j = (_h = playerRows[p]) === null || _h === void 0 ? void 0 : _h[i]) === null || _j === void 0 ? void 0 : _j.push(_jsx("tr", { children: playerCells }, `${player.nickname} board row ${i}`));
                }
                else {
                    break;
                }
            }
            // TODO Check it "?"
            (_k = playersBoards[p]) === null || _k === void 0 ? void 0 : _k.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") cards, ", data.G.winner.length ? `Final: ${data.G.totalScore[p]}` : CurrentScoring(player), " points"] }), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders[p] }), _jsx("tr", { children: playerHeadersCount[p] })] }), _jsx("tbody", { children: playerRows[p] })] }, `${player.nickname} board`));
        }
        else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
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
    var _a, _b, _c, _d, _e, _f, _g;
    // TODO Your coins always public for you only, others private, but you see previous/current tavern coins for all players (and your's transparent for non opened coins)
    const playersBoardsCoins = [], playerHeaders = [], playerFooters = [], playerRows = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const player = data.G.publicPlayers[p];
        if (player !== undefined) {
            let coinIndex = 0;
            playersBoardsCoins[p] = [];
            playerHeaders[p] = [];
            playerFooters[p] = [];
            playerRows[p] = [];
            for (let i = 0; i < 2; i++) {
                const playerCells = [];
                // TODO Check it "!"
                playerRows[p][i] = [];
                if (i === 0) {
                    for (let j = 0; j < data.G.tavernsNum; j++) {
                        const currentTavernConfig = tavernsConfig[j];
                        if (currentTavernConfig !== undefined) {
                            // TODO Check it "?"
                            (_a = playerHeaders[p]) === null || _a === void 0 ? void 0 : _a.push(_jsx("th", { children: _jsx("span", { style: Styles.Taverns(j), className: "bg-tavern-icon" }) }, `Tavern ${currentTavernConfig.name}`));
                        }
                        else {
                            throw new Error(`Отсутствует конфиг таверны ${j}.`);
                        }
                        const boardCoin = player.boardCoins[coinIndex];
                        if (boardCoin !== undefined) {
                            if (player.boardCoins[coinIndex] === null) {
                                if (Number(data.ctx.currentPlayer) === p
                                    && data.ctx.phase === Phases.PlaceCoins) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, boardCoin, coinIndex, player, null, j, MoveNames.ClickBoardCoinMove, j);
                                }
                                else {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, boardCoin, coinIndex, player, null, j);
                                }
                            }
                            else if (Number(data.ctx.currentPlayer) === p
                                && data.ctx.phase === Phases.PlaceCoins) {
                                DrawCoin(data, playerCells, `coin`, boardCoin, coinIndex, player, null, null, MoveNames.ClickBoardCoinMove, j);
                            }
                            else {
                                if (data.G.winner.length
                                    || (data.ctx.phase !== Phases.PlaceCoins && data.G.currentTavern >= j)) {
                                    DrawCoin(data, playerCells, `coin`, boardCoin, coinIndex, player);
                                }
                                else {
                                    DrawCoin(data, playerCells, `back`, boardCoin, coinIndex, player);
                                }
                            }
                            coinIndex++;
                        }
                        else {
                            throw new Error(`В массиве монет игрока на столе отсутствует монета ${coinIndex}.`);
                        }
                    }
                }
                else if (i === 1) {
                    for (let j = data.G.tavernsNum; j <= player.boardCoins.length; j++) {
                        if (j === player.boardCoins.length) {
                            // TODO Check it "?"
                            (_b = playerFooters[p]) === null || _b === void 0 ? void 0 : _b.push(_jsx("th", { children: _jsx("span", { style: Styles.Priority(), className: "bg-priority-icon" }) }, `${player.nickname} priority icon`));
                            playerCells.push(_jsx("td", { className: "bg-gray-300", children: _jsx("span", { style: Styles.Priorities(player.priority.value), className: "bg-priority" }) }, `${player.nickname} priority gem`));
                        }
                        else {
                            // TODO Check it "?"
                            (_c = playerFooters[p]) === null || _c === void 0 ? void 0 : _c.push(_jsx("th", { children: _jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }) }, `${player.nickname} exchange icon ${j}`));
                            const boardCoin = player.boardCoins[coinIndex];
                            if (boardCoin !== undefined) {
                                if (boardCoin === null) {
                                    if (Number(data.ctx.currentPlayer) === p
                                        && data.ctx.phase === Phases.PlaceCoins) {
                                        DrawCoin(data, playerCells, `back-small-market-coin`, boardCoin, coinIndex, player, null, null, MoveNames.ClickBoardCoinMove, j);
                                    }
                                    else {
                                        DrawCoin(data, playerCells, `back-small-market-coin`, boardCoin, coinIndex, player);
                                    }
                                }
                                else if (Number(data.ctx.currentPlayer) === p
                                    && data.ctx.phase === Phases.PlaceCoins) {
                                    DrawCoin(data, playerCells, `coin`, boardCoin, coinIndex, player, null, null, MoveNames.ClickBoardCoinMove, j);
                                }
                                else {
                                    if (data.G.winner.length || (data.ctx.phase !== Phases.PlaceCoins
                                        && Number(data.ctx.currentPlayer) === p
                                        && player.boardCoins[data.G.currentTavern] !== null
                                        && ((_d = player.boardCoins[data.G.currentTavern]) === null || _d === void 0 ? void 0 : _d.isTriggerTrading))) {
                                        DrawCoin(data, playerCells, `coin`, boardCoin, coinIndex, player);
                                    }
                                    else {
                                        DrawCoin(data, playerCells, `back`, boardCoin, coinIndex, player);
                                    }
                                }
                                coinIndex++;
                            }
                            else {
                                throw new Error(`В массиве монет игрока на столе отсутствует монета ${coinIndex}.`);
                            }
                        }
                    }
                }
                // TODO Check it "?"
                (_f = (_e = playerRows[p]) === null || _e === void 0 ? void 0 : _e[i]) === null || _f === void 0 ? void 0 : _f.push(_jsx("tr", { children: playerCells }, `${player.nickname} board coins row ${i}`));
            }
            // TODO Check it "?"
            (_g = playersBoardsCoins[p]) === null || _g === void 0 ? void 0 : _g.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") played coins"] }), _jsx("thead", { children: _jsx("tr", { children: playerHeaders[p] }) }), _jsx("tbody", { children: playerRows[p] }), _jsx("tfoot", { children: _jsx("tr", { children: playerFooters[p] }) })] }, `${player.nickname} board coins`));
        }
        else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
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
    var _a;
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
        const player = data.G.publicPlayers[p], playerCells = [];
        playersHandsCoins[p] = [];
        if (player !== undefined) {
            for (let i = 0; i < 1; i++) {
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (player.handCoins[j] === null) {
                        playerCells.push(_jsx("td", { className: "bg-yellow-300", children: _jsx("span", { className: "bg-coin bg-yellow-300 border-2" }) }, `${player.nickname} hand coin ${j} empty`));
                    }
                    else {
                        const handCoin = player.handCoins[j];
                        if (handCoin !== undefined) {
                            if (Number(data.ctx.currentPlayer) === p || data.G.winner.length) {
                                let coinClasses = `border-2`;
                                if (player.selectedCoin === j) {
                                    coinClasses = `border-2 border-green-400`;
                                }
                                if (!data.G.winner.length && (data.ctx.phase === Phases.PlaceCoins
                                    || data.ctx.phase === Phases.PlaceCoinsUline || (data.ctx.activePlayers
                                    && data.ctx.activePlayers[Number(data.ctx.currentPlayer)] ===
                                        Stages.PlaceTradingCoinsUline))) {
                                    DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses, null, moveName, j);
                                }
                                else {
                                    DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses);
                                }
                            }
                            else {
                                DrawCoin(data, playerCells, `back`, handCoin, j, player);
                            }
                        }
                        else {
                            throw new Error(`В массиве монет игрока в руке отсутствует монета ${j}.`);
                        }
                    }
                }
            }
            // TODO Check it "?"
            (_a = playersHandsCoins[p]) === null || _a === void 0 ? void 0 : _a.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") coins"] }), _jsx("tbody", { children: _jsx("tr", { children: playerCells }) })] }, `${player.nickname} hand coins`));
        }
        else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
    }
    return playersHandsCoins;
};
//# sourceMappingURL=PlayerUI.js.map