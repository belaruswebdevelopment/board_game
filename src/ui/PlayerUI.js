import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { BuffNames, CoinTypeNames, ErrorNames, GameModeNames, HeroNames, MoveNames, MoveValidatorNames, MultiSuitCardNames, PhaseNames, RusCardTypeNames, StageNames, SuitNames } from "../typescript/enums";
import { DrawCard, DrawCoin, DrawSuit } from "./ElementsUI";
// TODO Check Solo Bot & multiplayer actions!
// TODO Move strings coins names to enum!
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
 */
export const DrawPlayersBoards = (G, ctx, validatorName, playerId = null, data) => {
    var _a, _b, _c, _d, _e;
    const playersBoards = [];
    let moveMainArgs;
    if (validatorName !== null) {
        switch (validatorName) {
            case MoveValidatorNames.PlaceThrudHeroMoveValidator:
            case MoveValidatorNames.PlaceYludHeroMoveValidator:
            case MoveValidatorNames.PlaceMultiSuitCardMoveValidator:
            case MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetEnlistmentMercenariesMoveValidator:
            case MoveValidatorNames.GetMjollnirProfitMoveValidator:
            case MoveValidatorNames.UseGodPowerMoveValidator:
                moveMainArgs = [];
                break;
            case MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator:
            case MoveValidatorNames.DiscardCardMoveValidator:
                moveMainArgs = {};
                break;
            case MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator:
                if (playerId === null) {
                    throw new Error(`Отсутствует обязательный параметр '${playerId}'.`);
                }
                moveMainArgs = {
                    playerId,
                    cards: [],
                };
                break;
            default:
                throw new Error(`Не существует валидатора '${validatorName}'.`);
        }
    }
    for (let p = 0; p < ctx.numPlayers; p++) {
        const playerRows = [], playerHeaders = [], playerHeadersCount = [], player = G.publicPlayers[p], stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[p];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
        }
        const stack = player.stack[0];
        let suitTop;
        // TODO Draw Giant Capture token on suit if needed!
        for (suitTop in suitsConfig) {
            if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer))
                && p === Number(ctx.currentPlayer)
                && validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                if (player.cards[suitTop].length) {
                    if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                        || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                        throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suitTop}'.`);
                    }
                    moveMainArgs[suitTop] = [];
                }
            }
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                && p === Number(ctx.currentPlayer) && ctx.phase === PhaseNames.GetMjollnirProfit) {
                if (data !== undefined) {
                    DrawSuit(data, playerHeaders, suitTop, player, MoveNames.GetMjollnirProfitMove);
                }
                else if (validatorName === MoveValidatorNames.GetMjollnirProfitMoveValidator) {
                    if (!Array.isArray(moveMainArgs)) {
                        throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом`);
                    }
                    moveMainArgs.push(suitTop);
                }
            }
            else {
                if (data !== undefined) {
                    DrawSuit(data, playerHeaders, suitTop, player);
                }
            }
            if (data !== undefined) {
                playerHeadersCount.push(_jsx("th", { className: `${suitsConfig[suitTop].suitColor} text-white`, children: _jsx("b", { children: player.cards[suitTop].reduce(TotalRank, 0) }) }, `${player.nickname} ${suitsConfig[suitTop].suitName} count`));
            }
        }
        if (data !== undefined) {
            for (let s = 0; s < 1 + Number(G.expansions.thingvellir.active); s++) {
                if (s === 0) {
                    playerHeaders.push(_jsx("th", { className: "bg-gray-600", children: _jsx("span", { style: Styles.HeroBack(), className: "bg-hero-icon" }) }, `${player.nickname} hero icon`));
                    playerHeadersCount.push(_jsx("th", { className: "bg-gray-600 text-white", children: _jsx("b", { children: player.heroes.length }) }, `${player.nickname} hero count`));
                }
                else if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) {
                    playerHeaders.push(_jsx("th", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }) }, `${player.nickname} camp icon`));
                    playerHeadersCount.push(_jsx("th", { className: "bg-yellow-200 text-white", children: _jsx("b", { children: player.campCards.length }) }, `${player.nickname} camp counts`));
                }
            }
        }
        for (let i = 0;; i++) {
            const playerCells = [];
            let isDrawRow = false, id = 0, j = 0, suit;
            for (suit in suitsConfig) {
                id = i + j;
                const card = player.cards[suit][i], last = player.cards[suit].length - 1;
                if (card !== undefined) {
                    isDrawRow = true;
                    if (p !== Number(ctx.currentPlayer) && stage === StageNames.discardSuitCard
                        && suit === SuitNames.warrior && card.type !== RusCardTypeNames.Hero_Player_Card) {
                        if (data !== undefined) {
                            DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardSuitCardFromPlayerBoardMove, i);
                        }
                        else if (validatorName === MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator
                            && p === playerId) {
                            if (moveMainArgs === undefined || !(`cards` in moveMainArgs)) {
                                throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем 'cards'.`);
                            }
                            moveMainArgs.cards.push(i);
                        }
                    }
                    else if (p === Number(ctx.currentPlayer) && last === i
                        && stage === StageNames.discardBoardCard && card.type !== RusCardTypeNames.Hero_Player_Card) {
                        // TODO Does it need more then 1 checking?
                        if (stack === undefined) {
                            return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
                        }
                        const stackSuit = stack.suit;
                        if (suit !== stackSuit && suit !== stack.pickedSuit) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardCardMove, suit, last);
                            }
                            else if (validatorName === MoveValidatorNames.DiscardCardMoveValidator) {
                                if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                    || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suit}'.`);
                                }
                                moveMainArgs[suit] = [];
                                const moveMainArgsFoSuit = moveMainArgs[suit];
                                if (moveMainArgsFoSuit === undefined) {
                                    throw new Error(`Массив значений должен содержать фракцию '${suit}'.`);
                                }
                                moveMainArgsFoSuit.push(last);
                            }
                        }
                    }
                    else if (p === Number(ctx.currentPlayer) && ctx.phase === PhaseNames.BrisingamensEndGame
                        && card.type !== RusCardTypeNames.Hero_Player_Card) {
                        if (data !== undefined) {
                            DrawCard(data, playerCells, card, id, player, suit, MoveNames.DiscardCardFromPlayerBoardMove, suit, i);
                        }
                        else if (validatorName === MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) {
                            if (moveMainArgs === undefined || typeof moveMainArgs !== `object`
                                || Array.isArray(moveMainArgs) || `cards` in moveMainArgs) {
                                throw new Error(`Аргумент валидатора '${validatorName}' должен быть объектом с полем '${suit}'.`);
                            }
                            const moveMainArgsFoSuit = moveMainArgs[suit];
                            if (moveMainArgsFoSuit === undefined) {
                                throw new Error(`Массив значений должен содержать фракцию '${suit}'.`);
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
                else if (p === Number(ctx.currentPlayer) && (last + 1) === i
                    && ((((ctx.phase === PhaseNames.PlaceYlud && ctx.activePlayers === null)
                        || ctx.phase === PhaseNames.EnlistmentMercenaries
                            && ((_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)]) ===
                                StageNames.placeEnlistmentMercenaries)) || stage === StageNames.placeThrudHero
                        || stage === StageNames.placeMultiSuitsCards)) {
                    if (stack === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
                    }
                    let cardVariants;
                    if (ctx.phase === PhaseNames.EnlistmentMercenaries
                        && ((_c = ctx.activePlayers) === null || _c === void 0 ? void 0 : _c[Number(ctx.currentPlayer)]) ===
                            StageNames.placeEnlistmentMercenaries) {
                        cardVariants = (_d = stack.card) === null || _d === void 0 ? void 0 : _d.variants[suit];
                        if (cardVariants !== undefined && cardVariants.suit !== suit) {
                            throw new Error(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
                        }
                    }
                    if (data !== undefined) {
                        // TODO Draw heroes with more then one ranks no after the last card but when last rank of this hero card placed!?
                        // TODO Can Ylud be placed in old place because of "suit !== pickedCard.suit"? Thrud can be placed same suit in solo game!
                        let action;
                        if (((G.mode === GameModeNames.Solo1 && ctx.currentPlayer === `1`)
                            || G.mode === GameModeNames.SoloAndvari
                            || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                                && (stack.name !== MultiSuitCardNames.OlwinsDouble
                                    || (stack.name === MultiSuitCardNames.OlwinsDouble && suit !== stack.pickedSuit))))
                            || (cardVariants !== undefined && suit === cardVariants.suit)) {
                            switch (stack.name) {
                                case HeroNames.Thrud:
                                    action = data.moves.PlaceThrudHeroMove;
                                    break;
                                case HeroNames.Ylud:
                                    action = data.moves.PlaceYludHeroMove;
                                    break;
                                case MultiSuitCardNames.OlwinsDouble:
                                case MultiSuitCardNames.Gullinbursti:
                                    action = data.moves.PlaceMultiSuitCardMove;
                                    break;
                                default:
                                    if (((_e = ctx.activePlayers) === null || _e === void 0 ? void 0 : _e[Number(ctx.currentPlayer)]) ===
                                        StageNames.placeEnlistmentMercenaries
                                        && Number(ctx.currentPlayer) === p) {
                                        action = data.moves.PlaceEnlistmentMercenariesMove;
                                        break;
                                    }
                                    else {
                                        throw new Error(`Нет такого мува.`);
                                    }
                            }
                            isDrawRow = true;
                            // TODO Move to DrawSuit
                            playerCells.push(_jsx("td", { onClick: () => action === null || action === void 0 ? void 0 : action(suit), className: "cursor-pointer" }, `${player.nickname} place card ${stack.name} to ${suit}`));
                        }
                        else {
                            playerCells.push(_jsx("td", {}, `${player.nickname} empty card ${id}`));
                        }
                    }
                    else if (validatorName === MoveValidatorNames.PlaceThrudHeroMoveValidator
                        || validatorName === MoveValidatorNames.PlaceYludHeroMoveValidator
                        || validatorName === MoveValidatorNames.PlaceMultiSuitCardMoveValidator
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
            for (let k = 0; k < 1; k++) {
                id += k + 1;
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
            if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) {
                for (let t = 0; t < 0 + Number(G.expansions.thingvellir.active); t++) {
                    id += t + 1;
                    const campCard = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        if (campCard.type === RusCardTypeNames.Mercenary_Card
                            && ctx.phase === PhaseNames.EnlistmentMercenaries
                            && ctx.activePlayers === null && Number(ctx.currentPlayer) === p) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, campCard, id, player, null, MoveNames.GetEnlistmentMercenariesMove, i);
                            }
                            else if (validatorName === MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) {
                                if (!Array.isArray(moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом.`);
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
                for (let m = 0; m < 0 + Number(G.expansions.idavoll.active); m++) {
                    id += m + 1;
                    const mythologicalCreatureCommandZoneCard = player.mythologicalCreatureCards[i];
                    if (mythologicalCreatureCommandZoneCard !== undefined) {
                        isDrawRow = true;
                        if (mythologicalCreatureCommandZoneCard.type === RusCardTypeNames.God_Card
                            && Number(ctx.currentPlayer) === p) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, mythologicalCreatureCommandZoneCard, id, player, null, MoveNames.UseGodPowerMove, i);
                            }
                            else if (validatorName === MoveValidatorNames.UseGodPowerMoveValidator) {
                                if (!Array.isArray(moveMainArgs)) {
                                    throw new Error(`Аргумент валидатора '${validatorName}' должен быть массивом.`);
                                }
                                moveMainArgs.push(i);
                            }
                        }
                        else {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, mythologicalCreatureCommandZoneCard, id, player, null);
                            }
                        }
                    }
                    else {
                        if (data !== undefined) {
                            playerCells.push(_jsx("td", {}, `${player.nickname} mythological creature command zone card ${i}`));
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
            playersBoards.push(_jsxs("table", { className: "mx-auto", children: [_jsxs("caption", { children: ["Player ", p + 1, " (", player.nickname, ") cards, ", G.winner.length ? `Final: ${G.totalScore[p]}` : CurrentScoring(G, player), " points"] }), _jsxs("thead", { children: [_jsx("tr", { children: playerHeaders }), _jsx("tr", { children: playerHeadersCount })] }), _jsx("tbody", { children: playerRows })] }, `${player.nickname} board`));
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
// TODO Check all solo bot coins opened during Troop Evaluation phase to upgrade coin!
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
 */
export const DrawPlayersBoardsCoins = (G, ctx, validatorName, data) => {
    var _a, _b, _c, _d;
    const playersBoardsCoins = [], moveMainArgs = [];
    let moveName;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[p];
        switch (ctx.phase) {
            case PhaseNames.Bids:
                moveName = MoveNames.ClickBoardCoinMove;
                break;
            default:
                if (stage === StageNames.upgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                }
                else if (stage === StageNames.pickConcreteCoinToUpgrade) {
                    moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                }
                else if (stage === StageNames.upgradeVidofnirVedrfolnirCoin) {
                    moveName = MoveNames.UpgradeCoinVidofnirVedrfolnirMove;
                }
                else {
                    moveName = undefined;
                }
                break;
        }
        const player = G.publicPlayers[p], privatePlayer = G.players[p];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
        }
        const playerRows = [], playerHeaders = [], playerFooters = [];
        for (let i = 0; i < 2; i++) {
            const playerCells = [];
            for (let t = 0; t < G.tavernsNum; t++) {
                if (data !== undefined) {
                    if (i === 0) {
                        const currentTavernConfig = tavernsConfig[t];
                        playerHeaders.push(_jsx("th", { children: _jsx("span", { style: Styles.Tavern(t), className: "bg-tavern-icon" }) }, `Tavern ${currentTavernConfig.name}`));
                    }
                    else {
                        if (t === G.tavernsNum - 1) {
                            playerFooters.push(_jsx("th", { children: _jsx("span", { style: Styles.Priority(), className: "bg-priority-icon" }) }, `${player.nickname} priority icon`));
                            playerCells.push(_jsx("td", { className: "bg-gray-300", children: _jsx("span", { style: player.priority.value > 0 ?
                                        Styles.Priorities(player.priority.value) : undefined, className: "bg-priority" }) }, `${player.nickname} priority gem`));
                        }
                        else {
                            if (data !== undefined) {
                                playerFooters.push(_jsx("th", { children: _jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }) }, `${player.nickname} exchange icon ${t}`));
                            }
                        }
                    }
                }
                if (i === 0 || (i === 1 && t !== G.tavernsNum - 1)) {
                    const id = t + G.tavernsNum * i, publicBoardCoin = player.boardCoins[id], privateBoardCoin = privatePlayer === null || privatePlayer === void 0 ? void 0 : privatePlayer.boardCoins[id];
                    if (publicBoardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на столе отсутствует монета с id '${id}'.`);
                    }
                    if (publicBoardCoin !== null) {
                        if (ctx.phase === PhaseNames.Bids && Number(ctx.currentPlayer) === p
                            && ((G.mode === GameModeNames.Multiplayer && privateBoardCoin !== undefined)
                                || (G.mode === GameModeNames.Basic && publicBoardCoin !== undefined))) {
                            if (data !== undefined) {
                                if (G.mode === GameModeNames.Multiplayer && privateBoardCoin === undefined) {
                                    throw new Error(`Монета с id '${id}' на столе текущего приватного игрока не может отсутствовать.`);
                                }
                                // TODO Add errors!
                                if (G.mode === GameModeNames.Basic && !IsCoin(publicBoardCoin)
                                    || (G.mode === GameModeNames.Multiplayer && privateBoardCoin !== undefined
                                        && !IsCoin(privateBoardCoin))) {
                                    throw new Error(`Монета с id '${id}' на столе текущего игрока не может быть закрытой для него.`);
                                }
                                DrawCoin(data, playerCells, `coin`, privateBoardCoin !== null && privateBoardCoin !== void 0 ? privateBoardCoin : publicBoardCoin, id, player, null, null, moveName, id);
                            }
                            else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                moveMainArgs.push(id);
                            }
                        }
                        else if (Number(ctx.currentPlayer) === p && IsCoin(publicBoardCoin)
                            && !publicBoardCoin.isTriggerTrading && ((stage === StageNames.upgradeCoin)
                            || (stage === StageNames.pickConcreteCoinToUpgrade
                                && ((_b = player.stack[0]) === null || _b === void 0 ? void 0 : _b.coinValue) === publicBoardCoin.value)
                            || (stage === StageNames.upgradeVidofnirVedrfolnirCoin
                                && ((_c = player.stack[0]) === null || _c === void 0 ? void 0 : _c.coinId) !== id && id >= G.tavernsNum))) {
                            if (data !== undefined) {
                                if (G.mode === GameModeNames.Multiplayer && !publicBoardCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока на столе не может быть закрыта ранее открытая монета с id '${id}'.`);
                                }
                                DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player, `border-2`, null, moveName, id, CoinTypeNames.Board);
                            }
                            else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator
                                || validatorName === MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) {
                                moveMainArgs.push({
                                    coinId: id,
                                    type: CoinTypeNames.Board,
                                });
                            }
                        }
                        else {
                            if (G.winner.length || (G.mode === GameModeNames.Solo1 && p === 0)
                                || (G.mode === GameModeNames.SoloAndvari && p === 0)
                                || (ctx.phase !== PhaseNames.Bids && i === 0 && G.currentTavern >= t)) {
                                if (data !== undefined) {
                                    if (!IsCoin(publicBoardCoin)) {
                                        throw new Error(`Монета с id '${id}' на столе текущего игрока не может быть закрытой для него.`);
                                    }
                                    if (!publicBoardCoin.isOpened) {
                                        throw new Error(`В массиве монет игрока на столе не может быть закрыта для других игроков ранее открытая монета с id '${id}'.`);
                                    }
                                    DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player);
                                }
                            }
                            else {
                                if (G.mode === GameModeNames.Multiplayer && privateBoardCoin !== undefined) {
                                    if (IsCoin(publicBoardCoin)) {
                                        if (!publicBoardCoin.isOpened) {
                                            throw new Error(`В массиве монет игрока на столе не может быть закрыта для других игроков ранее открытая монета с id '${id}'.`);
                                        }
                                        if (data !== undefined) {
                                            if (ctx.phase !== PhaseNames.Bids && i === 0 && G.currentTavern < t) {
                                                DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player);
                                            }
                                            else {
                                                DrawCoin(data, playerCells, `hidden-coin`, publicBoardCoin, id, player, `bg-small-coin`);
                                            }
                                        }
                                    }
                                    else {
                                        if (Number(ctx.currentPlayer) === p && IsCoin(privateBoardCoin)
                                            && !privateBoardCoin.isTriggerTrading && ((stage === StageNames.upgradeCoin)
                                            || (stage === StageNames.pickConcreteCoinToUpgrade
                                                && ((_d = player.stack[0]) === null || _d === void 0 ? void 0 : _d.coinValue) ===
                                                    privateBoardCoin.value))) {
                                            if (data !== undefined) {
                                                DrawCoin(data, playerCells, `hidden-coin`, privateBoardCoin, id, player, `bg-small-coin`, null, moveName, id, CoinTypeNames.Board);
                                            }
                                            else if (validatorName ===
                                                MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                                                || validatorName ===
                                                    MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) {
                                                moveMainArgs
                                                    .push({
                                                    coinId: id,
                                                    type: CoinTypeNames.Board,
                                                });
                                            }
                                        }
                                        else {
                                            if (data !== undefined) {
                                                if (!IsCoin(privateBoardCoin)) {
                                                    throw new Error(`Монета с id '${id}' на столе текущего приватного игрока не может отсутствовать.`);
                                                }
                                                DrawCoin(data, playerCells, `hidden-coin`, privateBoardCoin, id, player, `bg-small-coin`);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (data !== undefined) {
                                        if (!IsCoin(publicBoardCoin) || !publicBoardCoin.isOpened) {
                                            DrawCoin(data, playerCells, `back`, publicBoardCoin, id, player);
                                        }
                                        else if (publicBoardCoin.isOpened) {
                                            DrawCoin(data, playerCells, `hidden-coin`, publicBoardCoin, id, player, `bg-small-coin`);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (ctx.phase === PhaseNames.Bids && player.selectedCoin !== null
                            && ((G.mode === GameModeNames.Basic && (Number(ctx.currentPlayer) === p))
                                || (G.mode === GameModeNames.Multiplayer
                                    && (Number(ctx.currentPlayer) === p)))) {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, publicBoardCoin, id, player, null, id, moveName, id);
                                }
                                else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, publicBoardCoin, id, player, null, null, moveName, id);
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
 */
export const DrawPlayersHandsCoins = (G, ctx, validatorName, data) => {
    var _a, _b;
    const playersHandsCoins = [], moveMainArgs = [];
    let moveName;
    for (let p = 0; p < ctx.numPlayers; p++) {
        const stage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[p];
        switch (ctx.phase) {
            case PhaseNames.Bids:
                moveName = MoveNames.ClickHandCoinMove;
                break;
            case PhaseNames.BidUline:
                moveName = MoveNames.ClickHandCoinUlineMove;
                break;
            default:
                if (stage === StageNames.upgradeCoin) {
                    moveName = MoveNames.ClickCoinToUpgradeMove;
                }
                else if (stage === StageNames.placeTradingCoinsUline) {
                    moveName = MoveNames.ClickHandTradingCoinUlineMove;
                }
                else if (stage === StageNames.pickConcreteCoinToUpgrade) {
                    moveName = MoveNames.ClickConcreteCoinToUpgradeMove;
                }
                else if (stage === StageNames.addCoinToPouch) {
                    moveName = MoveNames.AddCoinToPouchMove;
                }
                else {
                    moveName = undefined;
                }
                break;
        }
        const player = G.publicPlayers[p], privatePlayer = G.players[p], playerCells = [];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
        }
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 5; j++) {
                const publicHandCoin = player.handCoins[j], privateHandCoin = privatePlayer === null || privatePlayer === void 0 ? void 0 : privatePlayer.handCoins[j];
                if (publicHandCoin === undefined) {
                    throw new Error(`В массиве монет игрока в руке отсутствует монета с id '${j}'.`);
                }
                if ((G.mode === GameModeNames.Multiplayer && privateHandCoin !== undefined
                    && IsCoin(privateHandCoin))
                    || (((G.mode === GameModeNames.Basic && Number(ctx.currentPlayer) === p)
                        || ((G.mode === GameModeNames.Solo1 || G.mode === GameModeNames.SoloAndvari)
                            && (p === 0 || ctx.phase === PhaseNames.ChooseDifficultySoloMode)))
                        && IsCoin(publicHandCoin))) {
                    let coinClasses = `border-2`;
                    if (player.selectedCoin === j) {
                        coinClasses = `border-2 border-green-400`;
                    }
                    const handCoin = privateHandCoin !== null && privateHandCoin !== void 0 ? privateHandCoin : publicHandCoin;
                    if (!IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока в руке должна быть открыта монета с id '${j}'.`);
                    }
                    if (Number(ctx.currentPlayer) === p
                        && (ctx.phase === PhaseNames.Bids || ctx.phase === PhaseNames.BidUline
                            || (stage === StageNames.placeTradingCoinsUline)
                            || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                                && stage === StageNames.addCoinToPouch
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
                    else if ((((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                        && Number(ctx.currentPlayer) === p
                        && CheckPlayerHasBuff(player, BuffNames.EveryTurn))
                        || ((G.mode === GameModeNames.Solo1 || G.mode === GameModeNames.SoloAndvari)
                            && Number(ctx.currentPlayer) === p && ctx.currentPlayer === `1`
                            && ctx.phase === PhaseNames.ChooseDifficultySoloMode))
                        && (stage === StageNames.upgradeCoin || (stage === StageNames.pickConcreteCoinToUpgrade
                            && ((_b = player.stack[0]) === null || _b === void 0 ? void 0 : _b.coinValue) === handCoin.value))) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses, null, moveName, j, CoinTypeNames.Hand);
                        }
                        else if (validatorName === MoveValidatorNames.ClickCoinToUpgradeMoveValidator
                            || validatorName === MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) {
                            moveMainArgs.push({
                                coinId: j,
                                type: CoinTypeNames.Hand,
                            });
                        }
                    }
                    else {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses);
                        }
                    }
                }
                else if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Solo1
                    || G.mode === GameModeNames.SoloAndvari)
                    || (G.mode === GameModeNames.Multiplayer && privateHandCoin === undefined))
                    && IsCoin(publicHandCoin) && publicHandCoin.isOpened) {
                    if (data !== undefined) {
                        DrawCoin(data, playerCells, `hidden-coin`, publicHandCoin, j, player, `bg-small-coin`);
                    }
                }
                else {
                    // TODO Add Throw errors to all UI files
                    if (G.mode === GameModeNames.Basic && IsCoin(publicHandCoin) && !publicHandCoin.isOpened) {
                        if (data !== undefined) {
                            const handCoin = privateHandCoin !== null && privateHandCoin !== void 0 ? privateHandCoin : publicHandCoin;
                            if (!IsCoin(handCoin)) {
                                throw new Error(`В массиве монет игрока в руке должна быть открыта для текущего игрока с id '${p}' монета с id '${j}'.`);
                            }
                            DrawCoin(data, playerCells, `back`, handCoin, j, player);
                        }
                    }
                    else if ((G.mode === GameModeNames.Solo1 || G.mode === GameModeNames.SoloAndvari)
                        && p === 1 && !IsCoin(publicHandCoin) && publicHandCoin !== null) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `back`, publicHandCoin, j, player);
                        }
                        else if (validatorName === MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator
                            || validatorName === MoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator) {
                            let moveMainArg = moveMainArgs[0];
                            if (moveMainArg === undefined) {
                                moveMainArg = [];
                            }
                            else {
                                moveMainArg.push(j);
                            }
                        }
                    }
                    else if (G.mode === GameModeNames.Multiplayer && privateHandCoin === undefined) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `back`, null, j, player);
                        }
                    }
                    else {
                        if (data !== undefined) {
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