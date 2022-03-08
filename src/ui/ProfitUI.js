import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsMercenaryCampCard } from "../Camp";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ConfigNames, DrawNames, MoveNames, RusCardTypes } from "../typescript/enums";
import { DrawButton, DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";
// TODO Add functions dock blocks and Errors!
export const AddCoinToPouchProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        for (let j = 0; j < player.handCoins.length; j++) {
            const handCoin = player.handCoins[j];
            if (handCoin !== undefined) {
                if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && handCoin !== null) {
                    DrawCoin(data, boardCells, `coin`, handCoin, j, player, `border-2`, null, MoveNames.AddCoinToPouchMove, j);
                }
            }
            else {
                throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
            }
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
export const DiscardCardFromBoardProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const configSuit = (_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.suit, pickedCard = player.pickedCard;
        if (configSuit !== undefined) {
            let suit;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    if (suit !== configSuit
                        && !(G.drawProfit === ConfigNames.DagdaAction && player.actionsNum === 1 && pickedCard !== null
                            && `suit` in pickedCard && suit === pickedCard.suit)) {
                        const last = player.cards[suit].length - 1;
                        if (last !== -1 && !IsHeroCard(player.cards[suit][last])) {
                            const card = player.cards[suit][last];
                            if (card !== undefined) {
                                DrawCard(data, boardCells, card, last, player, suit, MoveNames.DiscardCardMove, suit, last);
                            }
                            else {
                                throw new Error(`В массиве карт фракции ${suit} отсутствует последняя карта ${last}.`);
                            }
                        }
                    }
                }
            }
        }
        else {
            throw new Error(`Отсутствует обязательный параметр 'stack[0].config.suit'.`);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
export const DiscardAnyCardFromPlayerBoardProfit = (G, ctx, data, boardCells) => {
    // TODO Discard cards must be hidden from others users?
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const playerHeaders = [], playerRows = [];
        let suit;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
            }
        }
        for (let i = 0;; i++) {
            const playerCells = [];
            let isDrawRow = false, isExit = true, id = 0;
            let j = 0;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    const card = player.cards[suit][i];
                    if (card !== undefined) {
                        isExit = false;
                        if (!IsHeroCard(card)) {
                            isDrawRow = true;
                            DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
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
                playerRows.push(_jsx("tr", { children: playerCells }, `${player.nickname} board row ${i}`));
            }
            if (isExit) {
                break;
            }
        }
        boardCells.push(_jsx("td", { children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playerHeaders }) }), _jsx("tbody", { children: playerRows })] }) }, `${player.nickname} discard card`));
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
export const DiscardCardProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.drawSize; j++) {
        const currentTavern = G.taverns[G.currentTavern];
        if (currentTavern !== undefined) {
            const card = currentTavern[j];
            if (card !== undefined) {
                if (card !== null) {
                    let suit = null;
                    if (IsCardNotActionAndNotNull(card)) {
                        suit = card.suit;
                    }
                    const player = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player !== undefined) {
                        DrawCard(data, boardCells, card, j, player, suit, MoveNames.DiscardCard2PlayersMove, j);
                    }
                    else {
                        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                    }
                }
            }
            else {
                throw new Error(`В массиве карт текущей таверны отсутствует карта ${j}.`);
            }
        }
        else {
            throw new Error(`В массиве таверн отсутствует текущая таверна.`);
        }
    }
};
export const DiscardSuitCardFromPlayerBoardProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const playersHeaders = [], playersRows = [], suit = (_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.suit;
        if (suit !== undefined) {
            for (let p = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer)) {
                    const playerP1 = G.publicPlayers[p];
                    if (playerP1 !== undefined) {
                        playersHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor} discard suit`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: p + 1 }) }, `${playerP1.nickname} ${suitsConfig[suit].suitName}`));
                    }
                    else {
                        throw new Error(`В массиве игроков отсутствует игрок 1 ${p}.`);
                    }
                }
            }
            for (let i = 0;; i++) {
                let isDrawRow = false, isExit = true;
                const playersCells = [];
                for (let p = 0; p < G.publicPlayers.length; p++) {
                    if (p !== Number(ctx.currentPlayer)) {
                        const playerP2 = G.publicPlayers[p];
                        if (playerP2 !== undefined) {
                            const card = playerP2.cards[suit][i];
                            if (card !== undefined) {
                                if (!IsHeroCard(card)) {
                                    isExit = false;
                                    isDrawRow = true;
                                    DrawCard(data, playersCells, card, i, playerP2, suit, MoveNames.DiscardSuitCardFromPlayerBoardMove, suit, p, i);
                                }
                            }
                            else {
                                playersCells.push(_jsx("td", {}, `${playerP2.nickname} discard suit cardboard row ${i}`));
                            }
                        }
                        else {
                            throw new Error(`В массиве игроков отсутствует игрок 2 ${p}.`);
                        }
                    }
                }
                if (isDrawRow) {
                    playersRows.push(_jsx("tr", { children: playersCells }, `Discard suit cardboard row ${i}`));
                }
                if (isExit) {
                    break;
                }
            }
            boardCells.push(_jsx("td", { children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playersHeaders }) }), _jsx("tbody", { children: playersRows })] }) }, `Discard ${suit} suit cardboard`));
        }
        else {
            throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.suit'.`);
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
export const ExplorerDistinctionProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 3; j++) {
        const deck1 = G.decks[1];
        if (deck1 !== undefined) {
            const card = deck1[j];
            if (card !== undefined) {
                let suit = null;
                if (IsCardNotActionAndNotNull(card)) {
                    suit = card.suit;
                }
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    DrawCard(data, boardCells, card, j, player, suit, MoveNames.ClickCardToPickDistinctionMove, j);
                }
                else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
            }
            else {
                throw new Error(`В массиве карт 2 эпохи отсутствует карта ${j}.`);
            }
        }
        else {
            throw new Error(`В массиве дек карт отсутствует дека 1 эпохи.`);
        }
    }
};
export const GetEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const mercenaries = player.campCards.filter((card) => IsMercenaryCampCard(card));
        for (let j = 0; j < mercenaries.length; j++) {
            const card = mercenaries[j];
            if (card !== undefined) {
                DrawCard(data, boardCells, card, j, player, null, MoveNames.GetEnlistmentMercenariesMove, j);
            }
            else {
                throw new Error(`В массиве карт кэмпа игрока отсутствует карта наёмника ${j}.`);
            }
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
export const GetMjollnirProfitProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                if (player.cards[suit].length) {
                    const drawName = (_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.drawName;
                    if (drawName !== undefined) {
                        const value = player.cards[suit].reduce(TotalRank, 0) * 2;
                        DrawSuit(data, boardCells, suit, drawName, value, player, MoveNames.GetMjollnirProfitMove);
                    }
                    else {
                        throw new Error(`Отсутствует обязательный параметр 'player.stack[0].config.drawName'.`);
                    }
                }
            }
            else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        }
    }
};
export const PickCampCardHoldaProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.campNum; j++) {
        const card = G.camp[j];
        if (card !== undefined) {
            if (card !== null) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    DrawCard(data, boardCells, card, j, player, null, MoveNames.ClickCampCardHoldaMove, j);
                }
                else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
            }
        }
        else {
            throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
        }
    }
};
export const PickDiscardCardProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card = G.discardCardsDeck[j];
        if (card !== undefined) {
            let suit = null;
            if (!IsActionCard(card)) {
                suit = card.suit;
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                DrawCard(data, boardCells, card, j, player, suit, MoveNames.PickDiscardCardMove, j);
            }
            else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        }
        else {
            throw new Error(`В массиве карт сброса отсутствует карта ${j}.`);
        }
    }
};
export const PlaceCardsProfit = (G, ctx, data, boardCells) => {
    var _a, _b, _c, _d, _e;
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                const pickedCard = player.pickedCard;
                if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                    const drawName = (_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.drawName;
                    if (drawName !== undefined) {
                        let moveName;
                        switch (drawName) {
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
                        const value = (_e = (_d = (_c = player.stack[0]) === null || _c === void 0 ? void 0 : _c.variants) === null || _d === void 0 ? void 0 : _d[suit].points) !== null && _e !== void 0 ? _e : ``;
                        DrawSuit(data, boardCells, suit, drawName, value, player, moveName);
                    }
                    else {
                        throw new Error(`Отсутствует обязательный параметр 'player.stack[0].config.drawName'.`);
                    }
                }
            }
            else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        }
    }
};
export const PlaceEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    var _a, _b, _c, _d;
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player !== undefined) {
                const card = player.pickedCard;
                if (card !== null && `variants` in card) {
                    if (card.variants !== undefined) {
                        const drawName = (_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.drawName;
                        if (drawName !== undefined) {
                            if (suit === ((_c = card.variants[suit]) === null || _c === void 0 ? void 0 : _c.suit)) {
                                const cardVariants = card.variants[suit];
                                if (cardVariants !== undefined) {
                                    const value = (_d = cardVariants.points) !== null && _d !== void 0 ? _d : ``;
                                    DrawSuit(data, boardCells, suit, drawName, value, player, MoveNames.PlaceEnlistmentMercenariesMove);
                                }
                                else {
                                    throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                                }
                            }
                        }
                        else {
                            throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.drawName'.`);
                        }
                    }
                    else {
                        throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants'.`);
                    }
                }
                else {
                    throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
                }
            }
            else {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
        }
    }
};
export const StartEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 2; j++) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player !== undefined) {
            if (j === 0) {
                // TODO Add Enums for ALL text here
                DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`, player, MoveNames.StartEnlistmentMercenariesMove);
            }
            else if (G.publicPlayersOrder.length > 1) {
                DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`, player, MoveNames.PassEnlistmentMercenariesMove);
            }
        }
        else {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
    }
};
export const UpgradeCoinProfit = (G, ctx, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const handCoins = player.handCoins.filter((coin) => IsCoin(coin));
        let handCoinIndex = -1;
        for (let j = 0; j < player.boardCoins.length; j++) {
            const boardCoin = player.boardCoins[j];
            if (boardCoin !== undefined) {
                if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && boardCoin === null) {
                    handCoinIndex++;
                    const handCoinNotNull = handCoins[handCoinIndex];
                    if (handCoinNotNull !== undefined) {
                        const handCoinId = player.handCoins.findIndex((coin) => IsCoin(handCoinNotNull) && (coin === null || coin === void 0 ? void 0 : coin.value) === handCoinNotNull.value
                            && coin.isInitial === handCoinNotNull.isInitial);
                        if (handCoinId !== -1) {
                            const handCoin = player.handCoins[handCoinId];
                            if (handCoin !== undefined) {
                                if (IsCoin(handCoin) && !handCoin.isTriggerTrading) {
                                    DrawCoin(data, boardCells, `coin`, handCoin, j, player, `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `hand`, handCoin.isInitial);
                                }
                            }
                            else {
                                throw new Error(`В массиве монет игрока в руке 2 отсутствует монета ${handCoinId}.`);
                            }
                        }
                        else {
                            // TODO Is it need Error!?
                            console.log(`Test me!`);
                        }
                    }
                    else {
                        throw new Error(`В массиве монет игрока в руке 1 отсутствует монета ${handCoinIndex}.`);
                    }
                }
                else if (IsCoin(boardCoin) && !boardCoin.isTriggerTrading) {
                    DrawCoin(data, boardCells, `coin`, boardCoin, j, player, `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `board`, boardCoin.isInitial);
                }
            }
            else {
                throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
            }
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
export const UpgradeCoinVidofnirVedrfolnirProfit = (G, ctx, data, boardCells) => {
    var _a, _b;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
            const boardCoin = player.boardCoins[j];
            if (boardCoin !== undefined) {
                if (IsCoin(boardCoin)) {
                    if (!boardCoin.isTriggerTrading && ((_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.coinId) !== j) {
                        DrawCoin(data, boardCells, `coin`, boardCoin, j, player, `border-2`, null, MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, `board`, boardCoin.isInitial);
                    }
                }
            }
            else {
                throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
            }
        }
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};
//# sourceMappingURL=ProfitUI.js.map