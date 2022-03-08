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
    var _a;
    const playersBoards = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const playerRows = [], playerHeaders = [], playerHeadersCount = [], player = data.G.publicPlayers[p];
        if (player !== undefined) {
            let suit;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
                    playerHeadersCount.push(_jsx("th", { className: `${suitsConfig[suit].suitColor} text-white`, children: _jsx("b", { children: player.cards[suit].reduce(TotalRank, 0) }) }, `${player.nickname} ${suitsConfig[suit].suitName} count`));
                }
            }
            for (let s = 0; s < 1 + Number(data.G.expansions.thingvellir.active); s++) {
                if (s === 0) {
                    playerHeaders.push(_jsx("th", { className: "bg-gray-600", children: _jsx("span", { style: Styles.HeroBack(), className: "bg-hero-icon" }) }, `${player.nickname} hero icon`));
                    playerHeadersCount.push(_jsx("th", { className: "bg-gray-600 text-white", children: _jsx("b", { children: player.heroes.length }) }, `${player.nickname} hero count`));
                }
                else {
                    playerHeaders.push(_jsx("th", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }) }, `${player.nickname} camp icon`));
                    playerHeadersCount.push(_jsx("th", { className: "bg-yellow-200 text-white", children: _jsx("b", { children: player.campCards.length }) }, `${player.nickname} camp counts`));
                }
            }
            for (let i = 0;; i++) {
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
                for (let k = 0; k < 1 + Number((_a = data.G.expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active); k++) {
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
                    playerRows.push(_jsx("tr", { children: playerCells }, `${player.nickname} board row ${i}`));
                }
                else {
                    break;
                }
            }
            playersBoards.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") cards, ", data.G.winner.length ? `Final: ${data.G.totalScore[p]}` : CurrentScoring(player), " points"] }), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders }), _jsx("tr", { children: playerHeadersCount })] }), _jsx("tbody", { children: playerRows })] }, `${player.nickname} board`));
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
    // TODO Your coins always public for you only, others private, but you see previous/current tavern coins for all players (and your's transparent for non opened coins)
    const playersBoardsCoins = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const playerRows = [], playerHeaders = [], playerFooters = [], player = data.G.publicPlayers[p];
        if (player !== undefined) {
            let coinIndex = 0;
            for (let i = 0; i < 2; i++) {
                const playerCells = [];
                if (i === 0) {
                    for (let j = 0; j < data.G.tavernsNum; j++) {
                        const currentTavernConfig = tavernsConfig[j];
                        if (currentTavernConfig !== undefined) {
                            playerHeaders.push(_jsx("th", { children: _jsx("span", { style: Styles.Taverns(j), className: "bg-tavern-icon" }) }, `Tavern ${currentTavernConfig.name}`));
                        }
                        else {
                            throw new Error(`Отсутствует конфиг таверны ${j}.`);
                        }
                        const boardCoin = player.boardCoins[coinIndex];
                        if (boardCoin !== undefined) {
                            if (boardCoin === null) {
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
                            playerFooters.push(_jsx("th", { children: _jsx("span", { style: Styles.Priority(), className: "bg-priority-icon" }) }, `${player.nickname} priority icon`));
                            playerCells.push(_jsx("td", { className: "bg-gray-300", children: _jsx("span", { style: Styles.Priorities(player.priority.value), className: "bg-priority" }) }, `${player.nickname} priority gem`));
                        }
                        else {
                            playerFooters.push(_jsx("th", { children: _jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }) }, `${player.nickname} exchange icon ${j}`));
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
                                    const currentTavernBoardCoin = player.boardCoins[data.G.currentTavern];
                                    if (currentTavernBoardCoin !== undefined) {
                                        if (data.G.winner.length || (data.ctx.phase !== Phases.PlaceCoins
                                            && Number(data.ctx.currentPlayer) === p
                                            && (currentTavernBoardCoin === null || currentTavernBoardCoin === void 0 ? void 0 : currentTavernBoardCoin.isTriggerTrading))) {
                                            DrawCoin(data, playerCells, `coin`, boardCoin, coinIndex, player);
                                        }
                                        else {
                                            DrawCoin(data, playerCells, `back`, boardCoin, coinIndex, player);
                                        }
                                    }
                                    else {
                                        throw new Error(`В массиве монет игрока на столе отсутствует монета текущей таверны ${data.G.currentTavern}.`);
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
                playerRows.push(_jsx("tr", { children: playerCells }, `${player.nickname} board coins row ${i}`));
            }
            playersBoardsCoins.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") played coins"] }), _jsx("thead", { children: _jsx("tr", { children: playerHeaders }) }), _jsx("tbody", { children: playerRows }), _jsx("tfoot", { children: _jsx("tr", { children: playerFooters }) })] }, `${player.nickname} board coins`));
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
        if (player !== undefined) {
            for (let i = 0; i < 1; i++) {
                for (let j = 0; j < player.handCoins.length; j++) {
                    const handCoin = player.handCoins[j];
                    if (handCoin !== undefined) {
                        if (handCoin === null) {
                            playerCells.push(_jsx("td", { className: "bg-yellow-300", children: _jsx("span", { className: "bg-coin bg-yellow-300 border-2" }) }, `${player.nickname} hand coin ${j} empty`));
                        }
                        else {
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
                    }
                    else {
                        throw new Error(`В массиве монет игрока в руке отсутствует монета ${j}.`);
                    }
                }
            }
            playersHandsCoins.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") coins"] }), _jsx("tbody", { children: _jsx("tr", { children: playerCells }) })] }, `${player.nickname} hand coins`));
        }
        else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
    }
    return playersHandsCoins;
};
//# sourceMappingURL=PlayerUI.js.map