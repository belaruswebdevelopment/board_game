import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { DrawBoard } from "../helpers/DrawHelpers";
import { tavernsConfig } from "../Tavern";
import { ConfigNames, ErrorNames, MoveNames, MoveValidatorNames, PhaseNames, RusCardTypeNames, RusPhaseNames, RusStageNames, StageNames } from "../typescript/enums";
import { DrawCard, DrawCoin } from "./ElementsUI";
import { ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit, StartEnlistmentMercenariesProfit } from "./ProfitUI";
// TODO Check Solo Bot & multiplayer actions!
/**
 * <h3>Отрисовка карт лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле лагеря | данные для списка доступных аргументов мува.
 */
export const DrawCamp = (G, ctx, validatorName, data) => {
    var _a, _b, _c;
    const boardCells = [], moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.campNum; j++) {
            const campCard = G.camp[j];
            if (campCard === undefined) {
                throw new Error(`В массиве карт лагеря отсутствует карта с id '${j}'.`);
            }
            if (campCard === null) {
                if (data !== undefined) {
                    boardCells.push(_jsx("td", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }) }, `Camp ${j} icon`));
                }
            }
            else {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                }
                let suit = null;
                if (campCard.type === RusCardTypeNames.Artefact_Player_Card) {
                    suit = campCard.suit;
                }
                if ((ctx.phase === PhaseNames.TavernsResolution && ctx.activePlayers === null)
                    || (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === StageNames.pickCampCardHolda)) {
                    if (data !== undefined) {
                        const stage = (_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)];
                        let moveName;
                        switch (stage) {
                            case StageNames.pickCampCardHolda:
                                moveName = MoveNames.ClickCampCardHoldaMove;
                                break;
                            case undefined:
                                if (ctx.activePlayers === null) {
                                    moveName = MoveNames.ClickCampCardMove;
                                    break;
                                }
                                else {
                                    throw new Error(`Нет такого мува '1'.`);
                                }
                            default:
                                throw new Error(`Нет такого мува '2'.`);
                        }
                        DrawCard(data, boardCells, campCard, j, player, suit, moveName, j);
                    }
                    else if (validatorName === MoveValidatorNames.ClickCampCardMoveValidator
                        || validatorName === MoveValidatorNames.ClickCampCardHoldaMoveValidator) {
                        moveMainArgs.push(j);
                    }
                }
                else {
                    if (data !== undefined) {
                        DrawCard(data, boardCells, campCard, j, player, suit);
                    }
                }
            }
        }
    }
    if (data !== undefined) {
        const tier = G.campDeckLength.length - G.tierToEnd + 1 > G.campDeckLength.length ?
            1 : G.campDeckLength.length - G.tierToEnd;
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.Camp(), className: "bg-top-camp-icon" }), _jsxs("span", { children: [_jsx("span", { style: Styles.CampBack(tier), className: "bg-top-card-back-icon" }), "Camp (", (_c = G.campDeckLength[G.campDeckLength.length - G.tierToEnd]) !== null && _c !== void 0 ? _c : 0, (G.campDeckLength.length - G.tierToEnd === 0 ? `/` +
                                    (G.campDeckLength[0] + G.campDeckLength[1]) : ``), " cards)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
/**
 * <h3>Отрисовка фазы и стадии игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка фазы и стадии игры на игровом поле.</li>
 * </ol>
 *
 * @param ctx
 * @returns Поле информации о текущей фазе и стадии игры.
 */
export const DrawCurrentPhaseStage = (ctx) => {
    var _a, _b, _c;
    return (_jsxs("b", { children: ["Phase: ", _jsx("span", { className: "italic", children: (_a = RusPhaseNames[ctx.phase]) !== null && _a !== void 0 ? _a : `none` }), "(Stage: ", _jsx("span", { className: "italic", children: (_c = RusStageNames[(_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)]]) !== null && _c !== void 0 ? _c : `none` }), ")"] }));
};
/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param ctx
 * @returns Поле информации о текущем ходу.
 */
export const DrawCurrentPlayerTurn = (ctx) => (_jsxs("b", { children: [_jsxs("span", { className: "italic", children: ["Player ", Number(ctx.currentPlayer) + 1] }), " | Turn: ", _jsx("span", { className: "italic", children: ctx.turn })] }));
/**
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
 */
export const DrawDistinctions = (G, ctx, validatorName, data) => {
    const boardCells = [], moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        let suit, currentDistinctionSuit;
        for (suit in G.distinctions) {
            if (G.distinctions[suit] !== undefined) {
                currentDistinctionSuit = suit;
                break;
            }
        }
        for (suit in suitsConfig) {
            if (ctx.phase === PhaseNames.TroopEvaluation && ctx.activePlayers === null
                && G.distinctions[suit] === ctx.currentPlayer && currentDistinctionSuit === suit) {
                if (data !== undefined) {
                    // TODO Move to DrawDistinction
                    boardCells.push(_jsx("td", { className: "bg-green-500 cursor-pointer", onClick: () => { var _a, _b; return (_b = (_a = data.moves).ClickDistinctionCardMove) === null || _b === void 0 ? void 0 : _b.call(_a, suit); }, title: suitsConfig[suit].distinction.description, children: _jsx("span", { style: Styles.Distinction(suit), className: "bg-suit-distinction" }) }, `Distinction ${suit} card`));
                }
                else if (validatorName === MoveValidatorNames.ClickDistinctionCardMoveValidator) {
                    moveMainArgs.push(suit);
                }
            }
            else {
                if (data !== undefined) {
                    // TODO Move to DrawDistinction
                    boardCells.push(_jsx("td", { className: "bg-green-500", title: suitsConfig[suit].distinction.description, children: _jsx("span", { style: Styles.Distinction(suit), className: "bg-suit-distinction" }) }, `Distinction ${suit} card`));
                }
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), _jsx("span", { children: "Distinctions" })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
/**
 * <h3>Отрисовка колоды сброса карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле колоды сброса карт.
 */
export const DrawDiscardedCards = (G, ctx, validatorName, data) => {
    var _a;
    const boardCells = [], moveMainArgs = [];
    for (let j = 0; j < G.discardCardsDeck.length; j++) {
        const card = G.discardCardsDeck[j];
        if (card === undefined) {
            throw new Error(`В массиве колоды сброса карт отсутствует карта с id '${j}'.`);
        }
        let suit = null;
        if (card.type === RusCardTypeNames.Dwarf_Card) {
            suit = card.suit;
        }
        if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === StageNames.pickDiscardCard) {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            if (data !== undefined) {
                DrawCard(data, boardCells, card, j, player, suit, MoveNames.PickDiscardCardMove, j);
            }
            else if (validatorName === MoveValidatorNames.PickDiscardCardMoveValidator) {
                moveMainArgs.push(j);
            }
        }
        else {
            if (data !== undefined) {
                DrawCard(data, boardCells, card, j, null, suit);
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { className: "whitespace-nowrap", children: [_jsx("span", { style: Styles.CardBack(0), className: "bg-top-card-back-icon" }), _jsx("span", { style: Styles.CardBack(1), className: "bg-top-card-back-icon" }), _jsxs("span", { children: ["Discard cards (", G.discardCardsDeck.length, " cards)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
/**
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = (G, ctx, validatorName, data) => {
    var _a;
    const boardRows = [], drawData = DrawBoard(G.heroes.length), moveMainArgs = [];
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, hero = G.heroes[increment];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${increment}'.`);
            }
            const suit = hero.suit;
            if (hero.active && ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === StageNames.pickHero) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined) {
                    DrawCard(data, boardCells, hero, increment, player, suit, MoveNames.ClickHeroCardMove, increment);
                }
                else if (validatorName === MoveValidatorNames.ClickHeroCardMoveValidator && hero.active) {
                    moveMainArgs.push(increment);
                }
            }
            else {
                if (data !== undefined) {
                    DrawCard(data, boardCells, hero, increment, null, suit);
                }
            }
            if (increment + 1 === G.heroes.length) {
                break;
            }
        }
        if (data !== undefined) {
            boardRows.push(_jsx("tr", { children: boardCells }, `Heroes row ${i}`));
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.HeroBack(), className: "bg-top-hero-icon" }), _jsxs("span", { children: ["Heroes (", G.heroes.length, " cards)"] })] }), _jsx("tbody", { children: boardRows })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
/**
 * <h3>Отрисовка всех героев для выбора соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев для соло бота.
 */
export const DrawHeroesForSoloBotUI = (G, ctx, validatorName, data) => {
    var _a;
    const boardCells = [], moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.heroesForSoloBot.length; j++) {
            const hero = G.heroesForSoloBot[j];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${j}'.`);
            }
            if (hero.active && Number(ctx.currentPlayer) === 1
                && ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === StageNames.pickHeroSoloBot) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                }
                if (data !== undefined) {
                    DrawCard(data, boardCells, hero, j, player, null, MoveNames.SoloBotClickHeroCardMove, j);
                }
                else if (validatorName === MoveValidatorNames.SoloBotClickHeroCardMoveValidator && hero.active) {
                    moveMainArgs.push(j);
                }
            }
            else {
                if (data !== undefined) {
                    DrawCard(data, boardCells, hero, j, null, null);
                }
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.HeroBack(), className: "bg-top-hero-icon" }), _jsxs("span", { children: ["Bot heroes (", G.heroesForSoloBot.length, " cards)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, `Heroes row 0`) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param data Глобальные параметры.
 * @returns Поле рынка монет.
 */
export const DrawMarketCoins = (G, data) => {
    const boardRows = [], drawData = DrawBoard(G.marketCoinsUnique.length), countMarketCoins = CountMarketCoins(G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, marketCoin = G.marketCoinsUnique[increment];
            if (marketCoin === undefined) {
                throw new Error(`В массиве монет рынка героев отсутствует монета с id '${increment}'.`);
            }
            const tempCoinValue = marketCoin.value, coinClassName = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin(data, boardCells, `market`, marketCoin, increment, null, coinClassName, countMarketCoins[tempCoinValue]);
            if (increment + 1 === G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows.push(_jsx("tr", { children: boardCells }, `Market coins row ${i}`));
    }
    return (_jsxs("table", { children: [_jsx("caption", { children: _jsxs("span", { className: "block", children: [_jsx("span", { style: Styles.Exchange(), className: "bg-top-market-coin-icon" }), "Market coins (", G.marketCoins.length, " coins)"] }) }), _jsx("tbody", { children: boardRows })] }));
};
/**
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @returns Поле профита.
 */
export const DrawProfit = (G, ctx, data) => {
    const boardCells = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const option = G.drawProfit;
    let caption = ``;
    switch (option) {
        case ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade:
            caption += `Get value of coin upgrade.`;
            ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.ExplorerDistinction:
            caption += `Get one card to your board.`;
            ExplorerDistinctionProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.GetDifficultyLevelForSoloMode:
            caption += `Get difficulty level for Solo mode.`;
            ChooseDifficultyLevelForSoloModeProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.GetHeroesForSoloMode:
            caption += `Get ${G.soloGameDifficultyLevel} hero${G.soloGameDifficultyLevel === 1 ? `` : `es`} to Solo Bot.`;
            PickHeroesForSoloModeProfit(G, ctx, null, data, boardCells);
            break;
        case ConfigNames.StartOrPassEnlistmentMercenaries:
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartEnlistmentMercenariesProfit(G, ctx, data, boardCells);
            break;
        default:
            throw new Error(`Не задан обязательный параметр 'drawProfit'.`);
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), _jsx("span", { children: caption })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
};
/**
 * <h3>Отрисовка карт таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = (G, ctx, validatorName, data, gridClass) => {
    var _a, _b;
    const tavernsBoards = [], moveMainArgs = [];
    for (let t = 0; t < G.tavernsNum; t++) {
        const currentTavernConfig = tavernsConfig[t];
        if (currentTavernConfig === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.TavernConfigWithCurrentIdIsUndefined, t);
        }
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < G.drawSize; j++) {
                const tavern = G.taverns[t];
                if (tavern === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.TavernWithCurrentIdIsUndefined, t);
                }
                const tavernCard = tavern[j];
                if (G.round !== -1 && tavernCard === undefined) {
                    throw new Error(`В массиве карт таверны с id '${t}' отсутствует карта с id '${j}'.`);
                }
                if (tavernCard === undefined || tavernCard === null) {
                    if (data !== undefined) {
                        boardCells.push(_jsx("td", { children: _jsx("span", { style: Styles.Tavern(t), className: "bg-tavern-icon" }) }, `${currentTavernConfig.name} ${j}`));
                    }
                }
                else {
                    let suit = null;
                    if (`suit` in tavernCard) {
                        suit = tavernCard.suit;
                    }
                    const player = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
                    }
                    if (t === G.currentTavern && ctx.phase === PhaseNames.TavernsResolution
                        && ((ctx.activePlayers === null)
                            || (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) === StageNames.discardCard))) {
                        if (data !== undefined) {
                            const stage = (_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)];
                            let moveName;
                            switch (stage) {
                                case StageNames.discardCard:
                                    moveName = MoveNames.DiscardCard2PlayersMove;
                                    break;
                                case undefined:
                                    if (ctx.activePlayers === null) {
                                        moveName = MoveNames.ClickCardMove;
                                        break;
                                    }
                                    else {
                                        throw new Error(`Нет такого мува '1'.`);
                                    }
                                default:
                                    throw new Error(`Нет такого мува '2'.`);
                            }
                            DrawCard(data, boardCells, tavernCard, j, player, suit, moveName, j);
                        }
                        else if (validatorName === MoveValidatorNames.ClickCardMoveValidator
                            || validatorName === MoveValidatorNames.DiscardCard2PlayersMoveValidator) {
                            moveMainArgs.push(j);
                        }
                    }
                    else {
                        if (data !== undefined) {
                            DrawCard(data, boardCells, tavernCard, j, null, suit);
                        }
                    }
                }
            }
            if (data !== undefined) {
                tavernsBoards.push(_jsxs("table", { className: `${gridClass} justify-self-center`, children: [_jsxs("caption", { className: "whitespace-nowrap", children: [_jsx("span", { style: Styles.Tavern(t), className: "bg-top-tavern-icon" }), _jsx("b", { children: currentTavernConfig.name })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }, `Tavern ${currentTavernConfig.name} board`));
            }
        }
    }
    if (data !== undefined) {
        return tavernsBoards;
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @returns Поле информации о количестве карт по эпохам.
 */
export const DrawTierCards = (G) => {
    var _a;
    return (_jsxs("b", { children: ["Tier: ", _jsxs("span", { className: "italic", children: [G.deckLength.length - G.tierToEnd + 1 > G.deckLength.length ? G.deckLength.length :
                        G.deckLength.length - G.tierToEnd + 1, "/", G.deckLength.length, "(", (_a = G.deckLength[G.deckLength.length - G.tierToEnd]) !== null && _a !== void 0 ? _a : 0, G.deckLength.length - G.tierToEnd === 0 ? `/`
                        + (G.deckLength[0] + G.deckLength[1]) : ``, " cards)"] })] }));
};
/**
 * <h3>Отрисовка игровой информации о текущем статусе игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Поле информации о ходе/победителях игры.
 */
export const DrawWinner = (G, ctx) => {
    let winner;
    if (ctx.gameover !== undefined) {
        if (G.winner !== undefined) {
            if (G.winner.length === 1) {
                const winnerIndex = G.winner[0];
                if (winnerIndex === undefined) {
                    throw new Error(`Отсутствует индекс игрока победителя.`);
                }
                const winnerPlayer = G.publicPlayers[winnerIndex];
                if (winnerPlayer === undefined) {
                    throw new Error(`Отсутствует игрок победитель с id '${winnerIndex}'.`);
                }
                winner = `Winner: Player ${winnerPlayer.nickname}`;
            }
            else {
                winner = "Winners: ";
                G.winner.forEach((playerId, index) => {
                    const winnerPlayerI = G.publicPlayers[playerId];
                    if (winnerPlayerI === undefined) {
                        throw new Error(`Отсутствует игрок победитель с id '${playerId}'.`);
                    }
                    winner += `${index + 1}) Player '${winnerPlayerI.nickname}'; `;
                });
            }
        }
        else {
            winner = `Draw!`;
        }
    }
    else {
        winner = `Game is started`;
    }
    return (_jsxs("b", { children: ["Game status: ", _jsx("span", { className: "italic", children: winner.trim() })] }));
};
//# sourceMappingURL=GameBoardUI.js.map