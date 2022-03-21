import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { HeroNames, MoveNames, MoveValidatorNames, Phases, Stages } from "../typescript/enums";
import { DrawCard, DrawCoin } from "./ElementsUI";
/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @returns Игровые поля для планшета всех карт игрока.
 * @constructor
 */
export const DrawPlayersBoards = (G, ctx, data) => {
    var _a;
    const playersBoards = [];
    for (let p = 0; p < ctx.numPlayers; p++) {
        const playerRows = [], playerHeaders = [], playerHeadersCount = [], player = G.publicPlayers[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${p}.`);
        }
        let suit;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
                playerHeadersCount.push(_jsx("th", { className: `${suitsConfig[suit].suitColor} text-white`, children: _jsx("b", { children: player.cards[suit].reduce(TotalRank, 0) }) }, `${player.nickname} ${suitsConfig[suit].suitName} count`));
            }
        }
        for (let s = 0; s < 1 + Number(G.expansions.thingvellir.active); s++) {
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
            for (let k = 0; k < 1 + Number((_a = G.expansions.thingvellir) === null || _a === void 0 ? void 0 : _a.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards = Object.values(player.cards).flat(), hero = player.heroes[i];
                    // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (hero !== undefined && !hero.suit && !((hero.name === HeroNames.Ylud
                        && playerCards.findIndex((card) => card.name === HeroNames.Ylud) !== -1) || (hero.name === HeroNames.Thrud
                        && playerCards.findIndex((card) => card.name === HeroNames.Thrud) !== -1))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, hero, id, player, null);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${player.nickname} hero ${i}`));
                    }
                }
                else {
                    const campCard = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, campCard, id, player, null);
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
        playersBoards.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") cards, ", G.winner.length ? `Final: ${G.totalScore[p]}` : CurrentScoring(player), " points"] }), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders }), _jsx("tr", { children: playerHeadersCount })] }), _jsx("tbody", { children: playerRows })] }, `${player.nickname} board`));
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
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет на столе | данные для списка доступных аргументов мува.
 * @constructor
 */
export const DrawPlayersBoardsCoins = (G, ctx, validatorName, data) => {
    // TODO Your coins always public for you only, others private, but you see previous/current tavern coins for all players (and your's transparent for non opened coins)
    const multiplayer = IsMultiplayer(G), playersBoardsCoins = [], moveMainArgs = [];
    for (let p = 0; p < ctx.numPlayers; p++) {
        const player = G.publicPlayers[p], privatePlayer = G.players[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${p}.`);
        }
        const playerRows = [], playerHeaders = [], playerFooters = [];
        for (let i = 0; i < 2; i++) {
            const playerCells = [];
            for (let j = 0; j < G.tavernsNum; j++) {
                if (data !== undefined) {
                    if (i === 0) {
                        const currentTavernConfig = tavernsConfig[j];
                        if (currentTavernConfig === undefined) {
                            throw new Error(`Отсутствует конфиг таверны ${j}.`);
                        }
                        playerHeaders.push(_jsx("th", { children: _jsx("span", { style: Styles.Taverns(j), className: "bg-tavern-icon" }) }, `Tavern ${currentTavernConfig.name}`));
                    }
                    else {
                        if (j === G.tavernsNum - 1) {
                            playerFooters.push(_jsx("th", { children: _jsx("span", { style: Styles.Priority(), className: "bg-priority-icon" }) }, `${player.nickname} priority icon`));
                            playerCells.push(_jsx("td", { className: "bg-gray-300", children: _jsx("span", { style: Styles.Priorities(player.priority.value), className: "bg-priority" }) }, `${player.nickname} priority gem`));
                        }
                        else {
                            if (data !== undefined) {
                                playerFooters.push(_jsx("th", { children: _jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }) }, `${player.nickname} exchange icon ${j}`));
                            }
                        }
                    }
                }
                if (i === 0 || (i === 1 && j !== G.tavernsNum - 1)) {
                    const id = j + G.tavernsNum * i, publicBoardCoin = player.boardCoins[id], privateBoardCoin = privatePlayer === null || privatePlayer === void 0 ? void 0 : privatePlayer.boardCoins[id];
                    if (publicBoardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
                    }
                    if (publicBoardCoin !== null) {
                        if (ctx.phase === Phases.PlaceCoins && Number(ctx.currentPlayer) === p
                            && ((multiplayer && privateBoardCoin !== undefined)
                                || (!multiplayer && publicBoardCoin !== undefined))) {
                            if (data !== undefined) {
                                if (!multiplayer && !IsCoin(publicBoardCoin)
                                    || (multiplayer && !IsCoin(privateBoardCoin))) {
                                    throw new Error(`Монета на столе текущего игрока не может быть закрытой для него.`);
                                }
                                DrawCoin(data, playerCells, `coin`, privateBoardCoin !== null && privateBoardCoin !== void 0 ? privateBoardCoin : publicBoardCoin, id, player, null, null, MoveNames.ClickBoardCoinMove, id);
                            }
                            else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                moveMainArgs.push(id);
                            }
                        }
                        else {
                            if (data !== undefined) {
                                const currentTavernBoardCoin = player.boardCoins[G.currentTavern];
                                if ((G.winner.length || (ctx.phase !== Phases.PlaceCoins
                                    && ((i === 0 && G.currentTavern >= j)
                                        || (i === 1 && Number(ctx.currentPlayer) === p
                                            && IsCoin(publicBoardCoin)
                                            && (currentTavernBoardCoin === null || currentTavernBoardCoin === void 0 ? void 0 : currentTavernBoardCoin.isTriggerTrading)))))) {
                                    DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player);
                                }
                                else {
                                    if (multiplayer && privateBoardCoin !== undefined) {
                                        if (IsCoin(publicBoardCoin)) {
                                            DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player);
                                        }
                                        else {
                                            DrawCoin(data, playerCells, `hidden-coin`, privateBoardCoin, id, player, `bg-small-coin`);
                                        }
                                    }
                                    else {
                                        if (IsCoin(publicBoardCoin)) {
                                            DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player);
                                        }
                                        else {
                                            DrawCoin(data, playerCells, `back`, publicBoardCoin, id, player);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (ctx.phase === Phases.PlaceCoins && player.selectedCoin !== null
                            && ((!multiplayer && (Number(ctx.currentPlayer) === p))
                                || (multiplayer && (Number(ctx.currentPlayer) === p)))) {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, publicBoardCoin, id, player, null, id, MoveNames.ClickBoardCoinMove, id);
                                }
                                else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, publicBoardCoin, id, player, null, null, MoveNames.ClickBoardCoinMove, id);
                                }
                            }
                            else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                moveMainArgs.push(id);
                            }
                        }
                        else {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, publicBoardCoin, id, player, null, id);
                                }
                                else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, publicBoardCoin, id, player);
                                }
                            }
                        }
                    }
                }
            }
            if (data !== undefined) {
                playerRows.push(_jsx("tr", { children: playerCells }, `${player.nickname} board coins row ${i}`));
            }
        }
        if (data !== undefined) {
            playersBoardsCoins.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") played coins"] }), _jsx("thead", { children: _jsx("tr", { children: playerHeaders }) }), _jsx("tbody", { children: playerRows }), _jsx("tfoot", { children: _jsx("tr", { children: playerFooters }) })] }, `${player.nickname} board coins`));
        }
    }
    if (data !== undefined) {
        return playersBoardsCoins;
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет в руке.
 * @constructor
 */
export const DrawPlayersHandsCoins = (G, ctx, validatorName, data) => {
    const multiplayer = IsMultiplayer(G), playersHandsCoins = [], moveMainArgs = [];
    let moveName;
    switch (ctx.phase) {
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
    for (let p = 0; p < ctx.numPlayers; p++) {
        const player = G.publicPlayers[p], privatePlayer = G.players[p], playerCells = [];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${p}.`);
        }
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 5; j++) {
                let handCoin;
                if (multiplayer) {
                    handCoin = privatePlayer === null || privatePlayer === void 0 ? void 0 : privatePlayer.handCoins[j];
                }
                else {
                    handCoin = player.handCoins[j];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока в руке отсутствует монета ${j}.`);
                    }
                }
                if (handCoin !== undefined && IsCoin(handCoin)
                    && ((!multiplayer && Number(ctx.currentPlayer) === p) || multiplayer)) {
                    let coinClasses = `border-2`;
                    if (player.selectedCoin === j) {
                        coinClasses = `border-2 border-green-400`;
                    }
                    if (Number(ctx.currentPlayer) === p
                        && (ctx.phase === Phases.PlaceCoins || ctx.phase === Phases.PlaceCoinsUline
                            || (ctx.activePlayers && ctx.activePlayers[Number(ctx.currentPlayer)] ===
                                Stages.PlaceTradingCoinsUline))) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses, null, moveName, j);
                        }
                        else if (validatorName === MoveValidatorNames.ClickHandCoinMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandCoinUlineMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator) {
                            moveMainArgs.push(j);
                        }
                    }
                    else {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses);
                        }
                    }
                }
                else {
                    if (data !== undefined) {
                        const boardCoinsLength = player.boardCoins.filter((coin) => coin !== null).length;
                        if (handCoin !== undefined && IsCoin(handCoin)) {
                            DrawCoin(data, playerCells, `back`, handCoin, j, player);
                        }
                        else if (handCoin === undefined && (j < (5 - boardCoinsLength))) {
                            DrawCoin(data, playerCells, `back`, null, j, player);
                        }
                        else {
                            playerCells.push(_jsx("td", { className: "bg-yellow-300", children: _jsx("span", { className: "bg-coin bg-yellow-300 border-2" }) }, `${player.nickname} hand coin ${j} empty`));
                        }
                    }
                }
            }
        }
        if (data !== undefined) {
            playersHandsCoins.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") coins"] }), _jsx("tbody", { children: _jsx("tr", { children: playerCells }) })] }, `${player.nickname} hand coins`));
        }
    }
    if (data !== undefined) {
        return playersHandsCoins;
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
//# sourceMappingURL=PlayerUI.js.map