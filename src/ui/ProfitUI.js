import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsMercenaryCampCard } from "../Camp";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, CoinTypes, ConfigNames, DrawNames, MoveNames, MoveValidatorNames, RusCardTypes } from "../typescript/enums";
import { DrawButton, DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";
export const AddCoinToPouchProfit = (G, ctx, validatorName, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], moveMainArgs = [];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    for (let j = 0; j < player.handCoins.length; j++) {
        const handCoin = player.handCoins[j];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
        }
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && IsCoin(handCoin)) {
            if (data !== undefined && boardCells !== undefined) {
                DrawCoin(data, boardCells, `coin`, handCoin, j, player, `border-2`, null, MoveNames.AddCoinToPouchMove, j);
            }
            else if (validatorName === MoveValidatorNames.AddCoinToPouchMoveValidator) {
                moveMainArgs.push(j);
            }
            else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const DiscardCardFromBoardProfit = (G, ctx, validatorName, data, boardCells) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)], moveMainArgs = {};
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const configSuit = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.suit, pickedCard = player.pickedCard;
    if (configSuit === undefined) {
        throw new Error(`Отсутствует обязательный параметр 'stack[0].config.suit'.`);
    }
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (suit !== configSuit
                && !(G.drawProfit === ConfigNames.DagdaAction && player.actionsNum === 1 && pickedCard !== null
                    && `suit` in pickedCard && suit === pickedCard.suit)) {
                const last = player.cards[suit].length - 1;
                if (last !== -1) {
                    const card = player.cards[suit][last];
                    if (card === undefined) {
                        throw new Error(`В массиве карт фракции ${suit} отсутствует последняя карта ${last}.`);
                    }
                    if (!IsHeroCard(card)) {
                        if (data !== undefined && boardCells !== undefined) {
                            DrawCard(data, boardCells, card, last, player, suit, MoveNames.DiscardCardMove, suit, last);
                        }
                        else if (validatorName === MoveValidatorNames.DiscardCardMoveValidator) {
                            moveMainArgs[suit] = [];
                            const moveMainArgsFoSuit = moveMainArgs[suit];
                            if (moveMainArgsFoSuit !== undefined) {
                                moveMainArgsFoSuit.push(last);
                            }
                            else {
                                throw new Error(`Массив значений должен содержать фракцию ${suit}.`);
                            }
                        }
                        else {
                            throw new Error(`Функция должна иметь один из ключевых параметров.`);
                        }
                    }
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const DiscardAnyCardFromPlayerBoardProfit = (G, ctx, validatorName, data, boardCells) => {
    var _a;
    // TODO Discard cards must be hidden from others users?
    const player = G.publicPlayers[Number(ctx.currentPlayer)], moveMainArgs = {};
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const playerHeaders = [], playerRows = [];
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (data !== undefined) {
                playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon" }) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
            }
            else if (validatorName !== null) {
                moveMainArgs[suit] = [];
            }
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
                        if (data !== undefined && boardCells !== undefined) {
                            DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                        }
                        else if (validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                            (_a = moveMainArgs[suit]) === null || _a === void 0 ? void 0 : _a.push(i);
                        }
                    }
                    else {
                        if (data !== undefined) {
                            playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                        }
                    }
                }
                else {
                    if (data !== undefined) {
                        playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                    }
                }
                j++;
            }
        }
        if (isDrawRow) {
            if (data !== undefined) {
                playerRows.push(_jsx("tr", { children: playerCells }, `${player.nickname} board row ${i}`));
            }
        }
        if (isExit) {
            break;
        }
    }
    if (data !== undefined && boardCells !== undefined) {
        boardCells.push(_jsx("td", { children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playerHeaders }) }), _jsx("tbody", { children: playerRows })] }) }, `${player.nickname} discard card`));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
export const DiscardCardProfit = (G, ctx, validatorName, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.drawSize; j++) {
        const currentTavern = G.taverns[G.currentTavern];
        if (currentTavern === undefined) {
            throw new Error(`В массиве таверн отсутствует текущая таверна.`);
        }
        const card = currentTavern[j];
        if (card === undefined) {
            throw new Error(`В массиве карт текущей таверны отсутствует карта ${j}.`);
        }
        if (card !== null) {
            let suit = null;
            if (IsCardNotActionAndNotNull(card)) {
                suit = card.suit;
            }
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            if (data !== undefined && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j, player, suit, MoveNames.DiscardCard2PlayersMove, j);
            }
            else if (validatorName === MoveValidatorNames.DiscardCard2PlayersMoveValidator) {
                moveMainArgs.push(j);
            }
            else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const DiscardSuitCardFromPlayerBoardProfit = (G, ctx, validatorName, playerId, data, boardCells) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const playersHeaders = [], playersRows = [];
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const suit = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.suit;
    if (suit === undefined) {
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.suit'.`);
    }
    let moveMainArgs = {
        playerId: undefined,
        suit,
        cards: [],
    };
    if (validatorName !== null) {
        if (playerId === null) {
            throw new Error(`Отсутствует обязательный параметр 'playerId'.`);
        }
        moveMainArgs = {
            playerId,
            suit,
            cards: [],
        };
    }
    for (let p = 0; p < G.publicPlayers.length; p++) {
        if (p !== Number(ctx.currentPlayer)) {
            const playerP1 = G.publicPlayers[p];
            if (playerP1 === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок 1 ${p}.`);
            }
            if (data !== undefined) {
                playersHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor} discard suit`, children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: p + 1 }) }, `${playerP1.nickname} ${suitsConfig[suit].suitName}`));
            }
        }
    }
    for (let i = 0;; i++) {
        let isDrawRow = false, isExit = true;
        const playersCells = [];
        for (let p = 0; p < G.publicPlayers.length; p++) {
            if (p !== Number(ctx.currentPlayer)) {
                const playerP2 = G.publicPlayers[p];
                if (playerP2 === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок 2 ${p}.`);
                }
                const card = playerP2.cards[suit][i];
                if (card !== undefined) {
                    if (!IsHeroCard(card)) {
                        isExit = false;
                        isDrawRow = true;
                        if (data !== undefined) {
                            DrawCard(data, playersCells, card, i, playerP2, suit, MoveNames.DiscardSuitCardFromPlayerBoardMove, suit, p, i);
                        }
                        else if (p === playerId && validatorName ===
                            MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator) {
                            if (moveMainArgs.cards === undefined) {
                                throw new Error(`Отсутствует параметр 'cards'.`);
                            }
                            moveMainArgs.cards.push(i);
                        }
                    }
                }
                else {
                    if (data !== undefined) {
                        playersCells.push(_jsx("td", {}, `${playerP2.nickname} discard suit cardboard row ${i}`));
                    }
                }
            }
        }
        if (isDrawRow) {
            if (data !== undefined) {
                playersRows.push(_jsx("tr", { children: playersCells }, `Discard suit cardboard row ${i}`));
            }
        }
        if (isExit) {
            break;
        }
    }
    if (data !== undefined && boardCells !== undefined) {
        boardCells.push(_jsx("td", { children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playersHeaders }) }), _jsx("tbody", { children: playersRows })] }) }, `Discard ${suit} suit cardboard`));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
export const ExplorerDistinctionProfit = (G, ctx, validatorName, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < 3; j++) {
        const deck1 = G.decks[1];
        if (deck1 === undefined) {
            throw new Error(`В массиве дек карт отсутствует дека 1 эпохи.`);
        }
        const card = deck1[j];
        if (card === undefined) {
            throw new Error(`В массиве карт 2 эпохи отсутствует карта ${j}.`);
        }
        let suit = null;
        if (IsCardNotActionAndNotNull(card)) {
            suit = card.suit;
        }
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, suit, MoveNames.ClickCardToPickDistinctionMove, j);
        }
        else if (validatorName === MoveValidatorNames.ClickCardToPickDistinctionMoveValidator) {
            moveMainArgs.push(j);
        }
        else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const GetEnlistmentMercenariesProfit = (G, ctx, validatorName, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], moveMainArgs = [];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const mercenaries = player.campCards.filter((card) => IsMercenaryCampCard(card));
    for (let j = 0; j < mercenaries.length; j++) {
        const card = mercenaries[j];
        if (card === undefined) {
            throw new Error(`В массиве карт кэмпа игрока отсутствует карта наёмника ${j}.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, null, MoveNames.GetEnlistmentMercenariesMove, j);
        }
        else if (validatorName === MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) {
            moveMainArgs.push(j);
        }
        else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const GetMjollnirProfitProfit = (G, ctx, validatorName, data, boardCells) => {
    var _a;
    const moveMainArgs = [];
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            if (player.cards[suit].length) {
                const stack = player.stack[0];
                if (stack === undefined) {
                    throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
                }
                const drawName = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.drawName;
                if (drawName === undefined) {
                    throw new Error(`Отсутствует обязательный параметр 'config.drawName'.`);
                }
                if (data !== undefined && boardCells !== undefined) {
                    const value = player.cards[suit].reduce(TotalRank, 0) * 2;
                    DrawSuit(data, boardCells, suit, drawName, value, player, MoveNames.GetMjollnirProfitMove);
                }
                else if (validatorName === MoveValidatorNames.GetMjollnirProfitMoveValidator) {
                    moveMainArgs.push(suit);
                }
                else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const PickCampCardHoldaProfit = (G, ctx, validatorName, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.campNum; j++) {
        const card = G.camp[j];
        if (card === undefined) {
            throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
        }
        if (card !== null) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            if (data !== undefined && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j, player, null, MoveNames.ClickCampCardHoldaMove, j);
            }
            else if (validatorName === MoveValidatorNames.ClickCampCardHoldaMoveValidator) {
                moveMainArgs.push(j);
            }
            else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const PickDiscardCardProfit = (G, ctx, validatorName, data, boardCells) => {
    const moveMainArgs = [];
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card = G.discardCardsDeck[j];
        if (card === undefined) {
            throw new Error(`В массиве карт сброса отсутствует карта ${j}.`);
        }
        let suit = null;
        if (!IsActionCard(card)) {
            suit = card.suit;
        }
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (data !== undefined && boardCells !== undefined) {
            DrawCard(data, boardCells, card, j, player, suit, MoveNames.PickDiscardCardMove, j);
        }
        else if (validatorName === MoveValidatorNames.PickDiscardCardMoveValidator) {
            moveMainArgs.push(j);
        }
        else {
            throw new Error(`Функция должна иметь один из ключевых параметров.`);
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const PlaceCardsProfit = (G, ctx, validatorName, data, boardCells) => {
    var _a, _b, _c;
    const moveMainArgs = [];
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            const pickedCard = player.pickedCard;
            if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                const stack = player.stack[0];
                if (stack === undefined) {
                    throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
                }
                const drawName = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.drawName;
                if (drawName === undefined) {
                    throw new Error(`Отсутствует обязательный параметр 'config.drawName'.`);
                }
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
                if (data !== undefined && boardCells !== undefined) {
                    const value = (_c = (_b = stack.variants) === null || _b === void 0 ? void 0 : _b[suit].points) !== null && _c !== void 0 ? _c : ``;
                    DrawSuit(data, boardCells, suit, drawName, value, player, moveName);
                }
                else if (validatorName === MoveValidatorNames.PlaceThrudHeroMoveValidator
                    || validatorName === MoveValidatorNames.PlaceOlwinCardMoveValidator
                    || validatorName === MoveValidatorNames.PlaceYludHeroMoveValidator) {
                    moveMainArgs.push(suit);
                }
                else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const PlaceEnlistmentMercenariesProfit = (G, ctx, validatorName, data, boardCells) => {
    var _a, _b;
    const moveMainArgs = [];
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
            }
            const card = player.pickedCard;
            if (card === null || !IsMercenaryCampCard(card)) {
                throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
            }
            const stack = player.stack[0];
            if (stack === undefined) {
                throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
            }
            const drawName = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.drawName;
            if (drawName === undefined) {
                throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.drawName'.`);
            }
            const cardVariants = card.variants[suit];
            if (cardVariants === undefined) {
                throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
            }
            if (suit === cardVariants.suit) {
                if (data !== undefined && boardCells !== undefined) {
                    const value = (_b = cardVariants.points) !== null && _b !== void 0 ? _b : ``;
                    DrawSuit(data, boardCells, suit, drawName, value, player, MoveNames.PlaceEnlistmentMercenariesMove);
                }
                else if (validatorName ===
                    MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator) {
                    moveMainArgs.push(suit);
                }
                else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const StartEnlistmentMercenariesProfit = (G, ctx, data, boardCells) => {
    for (let j = 0; j < 2; j++) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (j === 0) {
            // TODO Add Enums for ALL text here
            DrawButton(data, boardCells, `start Enlistment Mercenaries`, `Start`, player, MoveNames.StartEnlistmentMercenariesMove);
        }
        else if (G.publicPlayersOrder.length > 1) {
            DrawButton(data, boardCells, `pass Enlistment Mercenaries`, `Pass`, player, MoveNames.PassEnlistmentMercenariesMove);
        }
    }
};
export const UpgradeCoinProfit = (G, ctx, validatorName, data, boardCells) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], moveMainArgs = [];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const handCoins = player.handCoins.filter((coin) => IsCoin(coin));
    let handCoinIndex = -1;
    for (let j = 0; j < player.boardCoins.length; j++) {
        const boardCoin = player.boardCoins[j];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
        }
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && boardCoin === null) {
            handCoinIndex++;
            const handCoinNotNull = handCoins[handCoinIndex];
            if (handCoinNotNull === undefined) {
                throw new Error(`В массиве монет игрока в руке 1 отсутствует монета ${handCoinIndex}.`);
            }
            const handCoinId = player.handCoins.findIndex((coin) => IsCoin(handCoinNotNull) && (coin === null || coin === void 0 ? void 0 : coin.value) === handCoinNotNull.value
                && coin.isInitial === handCoinNotNull.isInitial);
            if (handCoinId === -1) {
                throw new Error(`В массиве монет игрока в руке отсутствует нужная монета.`);
            }
            const handCoin = player.handCoins[handCoinId];
            if (handCoin === undefined) {
                throw new Error(`В массиве монет игрока в руке 2 отсутствует монета ${handCoinId}.`);
            }
            if (IsCoin(handCoin) && !handCoin.isTriggerTrading) {
                if (data !== undefined && boardCells !== undefined) {
                    DrawCoin(data, boardCells, `coin`, handCoin, j, player, `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, CoinTypes.Hand, handCoin.isInitial);
                }
                else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator) {
                    moveMainArgs.push({
                        coinId: j,
                        type: CoinTypes.Hand,
                        isInitial: handCoin.isInitial,
                    });
                }
                else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
        else if (IsCoin(boardCoin) && !boardCoin.isTriggerTrading) {
            if (data !== undefined && boardCells !== undefined) {
                DrawCoin(data, boardCells, `coin`, boardCoin, j, player, `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, CoinTypes.Board, boardCoin.isInitial);
            }
            else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator) {
                moveMainArgs.push({
                    coinId: j,
                    type: CoinTypes.Board,
                    isInitial: boardCoin.isInitial,
                });
            }
            else {
                throw new Error(`Функция должна иметь один из ключевых параметров.`);
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
export const UpgradeCoinVidofnirVedrfolnirProfit = (G, ctx, validatorName, data, boardCells) => {
    var _a, _b;
    const player = G.publicPlayers[Number(ctx.currentPlayer)], moveMainArgs = [];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
        const boardCoin = player.boardCoins[j];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
        }
        if (IsCoin(boardCoin)) {
            if (!boardCoin.isTriggerTrading && ((_b = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.coinId) !== j) {
                if (data !== undefined && boardCells !== undefined) {
                    DrawCoin(data, boardCells, `coin`, boardCoin, j, player, `border-2`, null, MoveNames.UpgradeCoinVidofnirVedrfolnirMove, j, CoinTypes.Board, boardCoin.isInitial);
                }
                else if (validatorName === MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) {
                    moveMainArgs.push({
                        coinId: j,
                        type: CoinTypes.Board,
                        isInitial: boardCoin.isInitial,
                    });
                }
                else {
                    throw new Error(`Функция должна иметь один из ключевых параметров.`);
                }
            }
        }
    }
    if (validatorName !== null) {
        return moveMainArgs;
    }
};
//# sourceMappingURL=ProfitUI.js.map