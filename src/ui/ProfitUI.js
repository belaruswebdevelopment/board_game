import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsMercenaryCampCard } from "../Camp";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { isCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { ConfigNames, DrawNames, MoveNames } from "../typescript/enums";
import { DrawButton, DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";
// TODO Add functions dock blocks and Errors!
export const AddCoinToPouchProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    for (let j = 0; j < player.handCoins.length; j++) {
        if (player.buffs.find((buff) => buff.everyTurn !== undefined)
            && player.handCoins[j] !== null) {
            DrawCoin(data, boardCells, `coin`, player.handCoins[j], j, player, `border-2`, null, MoveNames.AddCoinToPouchMove, j);
        }
    }
};
export const DiscardCardFromBoardProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], config = player.stack[0].config, pickedCard = player.pickedCard;
    if (config !== undefined) {
        let suit;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (suit !== config.suit
                    && !(G.drawProfit === ConfigNames.DagdaAction && player.actionsNum === 1 && pickedCard !== null
                        && `suit` in pickedCard && suit === pickedCard.suit)) {
                    const last = player.cards[suit].length - 1;
                    if (last !== -1 && !IsHeroCard(player.cards[suit][last])) {
                        DrawCard(data, boardCells, player.cards[suit][last], last, player, suit, MoveNames.DiscardCardMove, suit, last);
                    }
                }
            }
        }
    }
};
export const DiscardAnyCardFromPlayerBoardProfit = (G, ctx, data, boardCells) => {
    // TODO Discard cards must be hidden from others users?
    const player = G.publicPlayers[Number(ctx.currentPlayer)], playerHeaders = [], playerRows = [];
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }, void 0) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
        }
    }
    for (let i = 0;; i++) {
        const playerCells = [];
        let isDrawRow = false;
        let isExit = true, id = 0;
        if (!Array.isArray(data) && playerRows !== undefined) {
            playerRows[i] = [];
        }
        let j = 0;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                id = i + j;
                if (player.cards[suit][i] !== undefined) {
                    isExit = false;
                    if (Array.isArray(data)) {
                        isDrawRow = true;
                    }
                    if (!IsHeroCard(player.cards[suit][i])) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.cards[suit][i], id, player, suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                    }
                    else {
                        playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                    }
                }
                else {
                    playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                }
                j++;
            }
        }
        if (isDrawRow) {
            playerRows[i].push(_jsx("tr", { children: playerCells }, `${player.nickname} board row ${i}`));
        }
        if (isExit) {
            break;
        }
    }
    boardCells.push(_jsx("td", { children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playerHeaders }, void 0) }, void 0), _jsx("tbody", { children: playerRows }, void 0)] }, void 0) }, `${player.nickname} discard card`));
};
export const DiscardCardProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.drawSize; j++) {
        const card = G.taverns[G.currentTavern][j];
        if (card !== null) {
            let suit = null;
            if (IsCardNotActionAndNotNull(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.DiscardCard2PlayersMove, j);
        }
    }
};
export const DiscardSuitCardFromPlayerBoardProfit = (G, ctx, data, boardCells) => {
    var _a;
    const playersHeaders = [], playersRows = [], config = (_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) === null || _a === void 0 ? void 0 : _a.config;
    if (config !== undefined && config.suit !== undefined) {
        for (let p = 0; p < G.publicPlayers.length; p++) {
            if (p !== Number(ctx.currentPlayer)) {
                playersHeaders.push(_jsx("th", { className: `${suitsConfig[config.suit].suitColor} discard suit`, children: _jsx("span", { style: Styles.Suits(config.suit), className: "bg-suit-icon", children: p + 1 }, void 0) }, `${G.publicPlayers[p].nickname} ${suitsConfig[config.suit].suitName}`));
            }
        }
        for (let i = 0;; i++) {
            let isDrawRow = false, isExit = true;
            playersRows[i] = [];
            const playersCells = [];
            for (let p = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer)) {
                    const player = G.publicPlayers[p];
                    if (player.cards[config.suit][i] !== undefined) {
                        if (!IsHeroCard(player.cards[config.suit][i])) {
                            isExit = false;
                            isDrawRow = true;
                            DrawCard(data, playersCells, player.cards[config.suit][i], i, player, config.suit, MoveNames.DiscardSuitCardFromPlayerBoardMove, config.suit, p, i);
                        }
                    }
                    else {
                        playersCells.push(_jsx("td", {}, `${player.nickname} discard suit cardboard row ${i}`));
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
        boardCells.push(_jsx("td", { children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playersHeaders }, void 0) }, void 0), _jsx("tbody", { children: playersRows }, void 0)] }, void 0) }, `Discard ${config.suit} suit cardboard`));
    }
    else {
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config' и/или 'stack[0].config.suit'.`);
    }
};
export const ExplorerDistinctionProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 3; j++) {
        const card = G.decks[1][j];
        let suit = null;
        if (IsCardNotActionAndNotNull(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, G.decks[1][j], j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.ClickCardToPickDistinctionMove, j);
    }
};
export const GetEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], mercenaries = player.campCards.filter((card) => IsMercenaryCampCard(card));
    for (let j = 0; j < mercenaries.length; j++) {
        DrawCard(data, boardCells, mercenaries[j], j, player, null, MoveNames.GetEnlistmentMercenariesMove, j);
    }
};
export const GetMjollnirProfitProfit = (G, ctx, data, boardCells) => {
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player.cards[suit].length) {
                const config = player.stack[0].config;
                if (config !== undefined && config.drawName !== undefined) {
                    const value = player.cards[suit].reduce(TotalRank, 0) * 2;
                    DrawSuit(data, boardCells, suit, config.drawName, value, player, MoveNames.GetMjollnirProfitMove);
                }
            }
        }
    }
};
export const PickCampCardHoldaProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.campNum; j++) {
        const card = G.camp[j];
        if (card !== null) {
            DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], null, MoveNames.ClickCampCardHoldaMove, j);
        }
    }
};
export const PickDiscardCardProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card = G.discardCardsDeck[j];
        let suit = null;
        if (!IsActionCard(card)) {
            suit = card.suit;
        }
        DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, MoveNames.PickDiscardCardMove, j);
    }
};
export const PlaceCardsProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)], pickedCard = player.pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const config = player.stack[0].config;
                let moveName;
                if (config !== undefined && config.drawName !== undefined) {
                    switch (config.drawName) {
                        case DrawNames.Thrud:
                            moveName = MoveNames.PlaceThrudHeroMove;
                            break;
                        case DrawNames.Ylud:
                            moveName = MoveNames.PlaceYludHeroMove;
                            break;
                        case DrawNames.Olwin:
                            moveName = MoveNames.PlaceOlwinCardMove;
                            break;
                        default:
                            throw new Error(`Нет такого мува.`);
                    }
                    const value = (_b = (_a = player.stack[0].variants) === null || _a === void 0 ? void 0 : _a[suit].points) !== null && _b !== void 0 ? _b : ``;
                    DrawSuit(data, boardCells, suit, config.drawName, value, player, moveName);
                }
            }
        }
    }
};
export const PlaceEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    let suit;
    for (suit in suitsConfig) {
        // TODO Add all Errors for hasOwnProperty!!!!!!!!!!!!!!!!!!!?
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)], card = player.pickedCard;
            if (card !== null && `variants` in card) {
                if (card.variants !== undefined) {
                    const config = player.stack[0].config;
                    if (config !== undefined && config.drawName !== undefined) {
                        if (suit === ((_a = card.variants[suit]) === null || _a === void 0 ? void 0 : _a.suit)) {
                            const cardVariants = card.variants[suit];
                            if (cardVariants !== undefined) {
                                const value = (_b = cardVariants.points) !== null && _b !== void 0 ? _b : ``;
                                DrawSuit(data, boardCells, suit, config.drawName, value, player, MoveNames.PlaceEnlistmentMercenariesMove);
                            }
                            else {
                                throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                            }
                        }
                    }
                    else {
                        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config' и/или 'stack[0].config.drawName'.`);
                    }
                }
                else {
                    throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants'.`);
                }
            }
            else {
                throw new Error(`Выбранная карта должна быть с типом 'наёмник'.`);
            }
        }
    }
};
export const StartEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 2; j++) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (j === 0) {
            // TODO Add Enums for ALL text here
            DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`, player, MoveNames.StartEnlistmentMercenariesMove);
        }
        else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`, player, MoveNames.PassEnlistmentMercenariesMove);
        }
    }
};
export const UpgradeCoinProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], handCoins = player.handCoins.filter((coin) => isCoin(coin));
    let handCoinIndex = -1;
    for (let j = 0; j < player.boardCoins.length; j++) {
        const boardCoin = player.boardCoins[j];
        if (player.buffs.find((buff) => buff.everyTurn !== undefined) !== undefined
            && boardCoin === null) {
            handCoinIndex++;
            const handCoinNotNull = handCoins[handCoinIndex], handCoinId = player.handCoins.findIndex((coin) => isCoin(handCoinNotNull) && (coin === null || coin === void 0 ? void 0 : coin.value) === handCoinNotNull.value
                && coin.isInitial === handCoinNotNull.isInitial);
            if (handCoinId !== -1) {
                const handCoin = player.handCoins[handCoinId];
                if (isCoin(handCoin) && !handCoin.isTriggerTrading) {
                    DrawCoin(data, boardCells, `coin`, handCoin, j, player, `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `hand`, handCoin.isInitial);
                }
            }
            else {
                // TODO Is it need Error!?
            }
        }
        else if (isCoin(boardCoin) && !boardCoin.isTriggerTrading) {
            DrawCoin(data, boardCells, `coin`, boardCoin, j, player, `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `board`, boardCoin.isInitial);
        }
    }
};
export const UpgradeCoinVidofnirVedrfolnirProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], config = player.stack[0].config;
    if (config !== undefined) {
        for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
            const coin = player.boardCoins[j];
            if (isCoin(coin)) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    DrawCoin(data, boardCells, `coin`, coin, j, player, `border-2`, null, MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, `board`, coin.isInitial);
                }
            }
        }
    }
    else {
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config'.`);
    }
};
//# sourceMappingURL=ProfitUI.js.map