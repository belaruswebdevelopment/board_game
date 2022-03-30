import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsMercenaryCampCard } from "../Camp";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { IsHeroCard } from "../Hero";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { BuffNames, CardNames, CoinTypes, HeroNames, MoveNames, MoveValidatorNames, Phases, RusCardTypes, Stages, SuitNames } from "../typescript/enums";
import { DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";
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
export const DrawPlayersBoards = (G, ctx, validatorName, playerId, data) => {
    var _a, _b, _c;
    const playersBoards = [];
    let moveMainArgs;
    if (validatorName !== null) {
        switch (validatorName) {
            case MoveValidatorNames.PlaceThrudHeroMoveValidator:
            case MoveValidatorNames.PlaceYludHeroMoveValidator:
            case MoveValidatorNames.PlaceOlwinCardMoveValidator:
            case MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetMjollnirProfitMoveValidator:
                moveMainArgs = [];
                break;
            case MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator:
            case MoveValidatorNames.DiscardCardMoveValidator:
                moveMainArgs = {};
                break;
            case MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator:
                if (playerId === null) {
                    throw new Error(`Отсутствует обязательный параметр ${playerId}.`);
                }
                moveMainArgs = {
                    playerId,
                    cards: [],
                };
                break;
            default:
                throw new Error(`Не существует валидатора ${validatorName}.`);
        }
    }
    for (let p = 0; p < ctx.numPlayers; p++) {
        const playerRows = [], playerHeaders = [], playerHeadersCount = [], player = G.publicPlayers[p], stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${p}.`);
        }
        const pickedCard = player.pickedCard;
        let suitTop;
        for (suitTop in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suitTop)) {
                if (p === Number(ctx.currentPlayer)
                    && validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                    if (player.cards[suitTop].length) {
                        if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                            || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                            throw new Error(`Аргумент валидатора ${validatorName} должен быть объектом с полем ${suitTop}.`);
                        }
                        moveMainArgs[suitTop] = [];
                    }
                }
                if (p === Number(ctx.currentPlayer) && ctx.phase === Phases.GetMjollnirProfit) {
                    if (data !== undefined) {
                        const suitArg = suitTop;
                        DrawSuit(data, playerHeaders, suitArg, player, MoveNames.GetMjollnirProfitMove);
                    }
                    else if (validatorName === MoveValidatorNames.GetMjollnirProfitMoveValidator) {
                        if (!Array.isArray(moveMainArgs)) {
                            throw new Error(`Аргумент валидатора ${validatorName} должен быть массивом`);
                        }
                        moveMainArgs.push(suitTop);
                    }
                }
                else {
                    if (data !== undefined) {
                        DrawSuit(data, playerHeaders, suitTop, player, null);
                    }
                }
                if (data !== undefined) {
                    playerHeadersCount.push(_jsx("th", { className: `${suitsConfig[suitTop].suitColor} text-white`, children: _jsx("b", { children: player.cards[suitTop].reduce(TotalRank, 0) }) }, `${player.nickname} ${suitsConfig[suitTop].suitName} count`));
                }
            }
        }
        if (data !== undefined) {
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
        }
        for (let i = 0;; i++) {
            const playerCells = [];
            let isDrawRow = false, id = 0, j = 0, suit;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    const card = player.cards[suit][i], last = player.cards[suit].length - 1;
                    if (card !== undefined) {
                        isDrawRow = true;
                        if (p !== Number(ctx.currentPlayer) && stage === Stages.DiscardSuitCard
                            && suit === SuitNames.WARRIOR && !IsHeroCard(card)) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardSuitCardFromPlayerBoardMove, i);
                            }
                            else if (validatorName === MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator
                                && p === playerId) {
                                if (moveMainArgs === undefined || !(`cards` in moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора ${validatorName} должен быть объектом с полем 'cards'.`);
                                }
                                moveMainArgs.cards.push(i);
                            }
                        }
                        else if (p === Number(ctx.currentPlayer) && last === i
                            && stage === Stages.DiscardBoardCard && !IsHeroCard(card)) {
                            const stack = player.stack[0];
                            if (stack === undefined) {
                                throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
                            }
                            const configSuit = (_b = stack.config) === null || _b === void 0 ? void 0 : _b.suit, pickedCard = player.pickedCard;
                            if (suit !== configSuit
                                && !(configSuit === SuitNames.HUNTER && player.actionsNum === 1
                                    && pickedCard !== null && `suit` in pickedCard && suit === pickedCard.suit)) {
                                if (data !== undefined) {
                                    DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardCardMove, suit, last);
                                }
                                else if (validatorName === MoveValidatorNames.DiscardCardMoveValidator) {
                                    if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                        || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                        throw new Error(`Аргумент валидатора ${validatorName} должен быть объектом с полем ${suit}.`);
                                    }
                                    moveMainArgs[suit] = [];
                                    const moveMainArgsFoSuit = moveMainArgs[suit];
                                    if (moveMainArgsFoSuit === undefined) {
                                        throw new Error(`Массив значений должен содержать фракцию ${suit}.`);
                                    }
                                    moveMainArgsFoSuit.push(last);
                                }
                            }
                        }
                        else if (p === Number(ctx.currentPlayer)
                            && ctx.phase === Phases.BrisingamensEndGame && !IsHeroCard(card)) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                            }
                            else if (validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                                if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                    || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                    throw new Error(`Аргумент валидатора ${validatorName} должен быть объектом с полем ${suit}.`);
                                }
                                const moveMainArgsFoSuit = moveMainArgs[suit];
                                if (moveMainArgsFoSuit === undefined) {
                                    throw new Error(`Массив значений должен содержать фракцию ${suit}.`);
                                }
                                moveMainArgsFoSuit.push(i);
                            }
                        }
                        else {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, card, id, player, suit);
                            }
                        }
                    }
                    else if (p === Number(ctx.currentPlayer) && (last + 1) === i && pickedCard !== null
                        && (((ctx.phase === Phases.EndTier || ctx.phase === Phases.EnlistmentMercenaries)
                            && ctx.activePlayers === null) || stage === Stages.PlaceThrudHero
                            || stage === Stages.PlaceOlwinCards)) {
                        let cardVariants = undefined;
                        if (ctx.phase === Phases.EnlistmentMercenaries && ctx.activePlayers === null) {
                            if (!IsMercenaryCampCard(pickedCard)) {
                                throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
                            }
                            cardVariants = pickedCard.variants[suit];
                            if (cardVariants !== undefined && cardVariants.suit !== suit) {
                                throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                            }
                        }
                        else {
                            if (!("suit" in pickedCard)) {
                                throw new Error(`У выбранной карты отсутствует обязательный параметр 'suit'.`);
                            }
                        }
                        if (data !== undefined) {
                            let action;
                            if ((!IsMercenaryCampCard(pickedCard) && suit !== pickedCard.suit)
                                || (IsMercenaryCampCard(pickedCard) && cardVariants !== undefined
                                    && suit === cardVariants.suit)) {
                                switch (pickedCard.name) {
                                    case HeroNames.Thrud:
                                        action = data.moves.PlaceThrudHeroMove;
                                        break;
                                    case HeroNames.Ylud:
                                        action = data.moves.PlaceYludHeroMove;
                                        break;
                                    case CardNames.OlwinsDouble:
                                        action = data.moves.PlaceOlwinCardMove;
                                        break;
                                    default:
                                        if (ctx.phase === Phases.EnlistmentMercenaries && ctx.activePlayers === null) {
                                            action = data.moves.PlaceEnlistmentMercenariesMove;
                                            break;
                                        }
                                        else {
                                            throw new Error(`Нет такого мува.`);
                                        }
                                }
                                isDrawRow = true;
                                const suitArg = suit;
                                playerCells.push(_jsx("td", { onClick: () => action === null || action === void 0 ? void 0 : action(suitArg), className: "cursor-pointer" }, `${player.nickname} place card ${pickedCard.name} to ${suit}`));
                            }
                            else {
                                playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                            }
                        }
                        else if (validatorName === MoveValidatorNames.PlaceThrudHeroMoveValidator
                            || validatorName === MoveValidatorNames.PlaceYludHeroMoveValidator
                            || validatorName === MoveValidatorNames.PlaceOlwinCardMoveValidator
                            || (validatorName === MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator
                                && cardVariants !== undefined && suit === cardVariants.suit)) {
                            moveMainArgs.push(suit);
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
            for (let k = 0; k < 1 + Number((_c = G.expansions.thingvellir) === null || _c === void 0 ? void 0 : _c.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards = Object.values(player.cards).flat(), hero = player.heroes[i];
                    // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (hero !== undefined && !hero.suit && !((hero.name === HeroNames.Ylud
                        && playerCards.findIndex((card) => card.name === HeroNames.Ylud) !== -1) || (hero.name === HeroNames.Thrud
                        && playerCards.findIndex((card) => card.name === HeroNames.Thrud) !== -1))) {
                        isDrawRow = true;
                        if (data !== undefined) {
                            DrawCard(data, playerCells, hero, id, player, null);
                        }
                    }
                    else {
                        if (data !== undefined) {
                            playerCells.push(_jsx("td", {}, `${player.nickname} hero ${i}`));
                        }
                    }
                }
                else {
                    const campCard = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        if (IsMercenaryCampCard(campCard) && ctx.phase === Phases.EnlistmentMercenaries
                            && ctx.activePlayers === null && Number(ctx.currentPlayer) === p
                            && pickedCard === null) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, campCard, id, player, null, MoveNames.GetEnlistmentMercenariesMove, i);
                            }
                            else if (validatorName === MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) {
                                if (!Array.isArray(moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора ${validatorName} должен быть массивом.`);
                                }
                                moveMainArgs.push(i);
                            }
                        }
                        else {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, campCard, id, player, null);
                            }
                        }
                    }
                    else {
                        if (data !== undefined) {
                            playerCells.push(_jsx("td", {}, `${player.nickname} camp card ${i}`));
                        }
                    }
                }
            }
            if (isDrawRow) {
                if (data !== undefined) {
                    playerRows.push(_jsx("tr", { children: playerCells }, `${player.nickname} board row ${i}`));
                }
            }
            else {
                break;
            }
        }
        if (data !== undefined) {
            playersBoards.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") cards, ", G.winner.length ? `Final: ${G.totalScore[p]}` : CurrentScoring(player), " points"] }), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders }), _jsx("tr", { children: playerHeadersCount })] }), _jsx("tbody", { children: playerRows })] }, `${player.nickname} board`));
        }
    }
    if (data !== undefined) {
        return playersBoards;
    }
    else if (validatorName !== null && moveMainArgs !== undefined) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
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
    var _a, _b, _c, _d, _e, _f, _g;
    const multiplayer = IsMultiplayer(G), playersBoardsCoins = [], moveMainArgs = [];
    for (let p = 0; p < ctx.numPlayers; p++) {
        const player = G.publicPlayers[p], privatePlayer = G.players[p], stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[p];
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
                        else if (Number(ctx.currentPlayer) === p && IsCoin(publicBoardCoin)
                            && !publicBoardCoin.isTriggerTrading && ((stage === Stages.UpgradeCoin)
                            || (stage === Stages.PickConcreteCoinToUpgrade
                                && ((_c = (_b = player.stack[0]) === null || _b === void 0 ? void 0 : _b.config) === null || _c === void 0 ? void 0 : _c.coinValue) === publicBoardCoin.value)
                            || (stage === Stages.UpgradeVidofnirVedrfolnirCoin
                                && ((_e = (_d = player.stack[0]) === null || _d === void 0 ? void 0 : _d.config) === null || _e === void 0 ? void 0 : _e.coinId) !== id && id >= G.tavernsNum))) {
                            if (data !== undefined) {
                                let moveName;
                                switch (stage) {
                                    case Stages.UpgradeCoin:
                                        moveName = MoveNames.ClickCoinToUpgradeMove;
                                        break;
                                    case Stages.PickConcreteCoinToUpgrade:
                                        moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                                        break;
                                    case Stages.UpgradeVidofnirVedrfolnirCoin:
                                        moveName = MoveNames.UpgradeCoinVidofnirVedrfolnirMove;
                                        break;
                                    default:
                                        throw new Error(`Нет такого мува.`);
                                }
                                DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player, `border-2`, null, moveName, id, CoinTypes.Board, publicBoardCoin.isInitial);
                            }
                            else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) {
                                moveMainArgs.push({
                                    coinId: id,
                                    type: CoinTypes.Board,
                                    isInitial: publicBoardCoin.isInitial,
                                });
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
                                            if (Number(ctx.currentPlayer) === p && IsCoin(privateBoardCoin)
                                                && !privateBoardCoin.isTriggerTrading
                                                && ((stage === Stages.UpgradeCoin)
                                                    || (stage === Stages.PickConcreteCoinToUpgrade
                                                        && ((_g = (_f = player.stack[0]) === null || _f === void 0 ? void 0 : _f.config) === null || _g === void 0 ? void 0 : _g.coinValue) ===
                                                            privateBoardCoin.value))) {
                                                if (data !== undefined) {
                                                    let moveName;
                                                    switch (stage) {
                                                        case Stages.UpgradeCoin:
                                                            moveName = MoveNames.ClickCoinToUpgradeMove;
                                                            break;
                                                        case Stages.PickConcreteCoinToUpgrade:
                                                            moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                                                            break;
                                                        default:
                                                            throw new Error(`Нет такого мува.`);
                                                    }
                                                    DrawCoin(data, playerCells, `hidden-coin`, privateBoardCoin, id, player, `bg-small-coin`, null, moveName, id, CoinTypes.Board, privateBoardCoin.isInitial);
                                                }
                                                else if (validatorName ===
                                                    MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                                    || validatorName ===
                                                        MoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) {
                                                    moveMainArgs
                                                        .push({
                                                        coinId: id,
                                                        type: CoinTypes.Board,
                                                        isInitial: privateBoardCoin.isInitial,
                                                    });
                                                }
                                            }
                                            else {
                                                DrawCoin(data, playerCells, `hidden-coin`, privateBoardCoin, id, player, `bg-small-coin`);
                                            }
                                        }
                                    }
                                    else {
                                        // TODO Check it and delete!
                                        // if (IsCoin(publicBoardCoin)) {
                                        //     DrawCoin(data, playerCells, `coin`, publicBoardCoin, id,
                                        //         player);
                                        // } else {
                                        DrawCoin(data, playerCells, `back`, publicBoardCoin, id, player);
                                        // }
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
    var _a, _b, _c, _d;
    const multiplayer = IsMultiplayer(G), playersHandsCoins = [], moveMainArgs = [];
    let moveName;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[p];
        switch (ctx.phase) {
            case Phases.PlaceCoins:
                moveName = MoveNames.ClickHandCoinMove;
                break;
            case Phases.PlaceCoinsUline:
                moveName = MoveNames.ClickHandCoinUlineMove;
                break;
            case Phases.PickCards:
                if (stage === Stages.UpgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                }
                else if (stage === Stages.PlaceTradingCoinsUline) {
                    moveName = MoveNames.ClickHandTradingCoinUlineMove;
                }
                else if (stage === Stages.AddCoinToPouch) {
                    moveName = MoveNames.AddCoinToPouchMove;
                }
                break;
            default:
                if (stage === Stages.UpgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                }
                else if (stage === Stages.AddCoinToPouch) {
                    moveName = MoveNames.AddCoinToPouchMove;
                }
                else {
                    moveName = undefined;
                }
                break;
        }
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
                            || (stage === Stages.PlaceTradingCoinsUline) || (stage === Stages.AddCoinToPouch
                            && CheckPlayerHasBuff(player, BuffNames.EveryTurn)))) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses, null, moveName, j);
                        }
                        else if (validatorName === MoveValidatorNames.ClickHandCoinMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandCoinUlineMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator
                            || validatorName === MoveValidatorNames.AddCoinToPouchMoveValidator) {
                            moveMainArgs.push(j);
                        }
                    }
                    else if (Number(ctx.currentPlayer) === p
                        && CheckPlayerHasBuff(player, BuffNames.EveryTurn)
                        && (stage === Stages.UpgradeCoin || (stage === Stages.PickConcreteCoinToUpgrade
                            && ((_c = (_b = player.stack[0]) === null || _b === void 0 ? void 0 : _b.config) === null || _c === void 0 ? void 0 : _c.coinValue) === handCoin.value))) {
                        if (data !== undefined) {
                            switch ((_d = ctx.activePlayers) === null || _d === void 0 ? void 0 : _d[Number(ctx.currentPlayer)]) {
                                case Stages.UpgradeCoin:
                                    moveName = MoveNames.ClickCoinToUpgradeMove;
                                    break;
                                case Stages.PickConcreteCoinToUpgrade:
                                    moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                                    break;
                                default:
                                    throw new Error(`Нет такого мува.`);
                            }
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses, null, moveName, j, CoinTypes.Hand, handCoin.isInitial);
                        }
                        else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                            || validatorName === MoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) {
                            moveMainArgs.push({
                                coinId: j,
                                type: CoinTypes.Hand,
                                isInitial: handCoin.isInitial,
                            });
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