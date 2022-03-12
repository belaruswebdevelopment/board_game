import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsCardNotActionAndNotNull } from "../Card";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { DrawBoard } from "../helpers/DrawHelpers";
import { tavernsConfig } from "../Tavern";
import { ConfigNames, MoveNames, MoveValidatorNames } from "../typescript/enums";
import { DrawCard, DrawCoin } from "./ElementsUI";
import { AddCoinToPouchProfit, DiscardAnyCardFromPlayerBoardProfit, DiscardCardFromBoardProfit, DiscardCardProfit, DiscardSuitCardFromPlayerBoardProfit, ExplorerDistinctionProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./ProfitUI";
/**
 * <h3>Отрисовка карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле кэмпа | данные для списка доступных аргументов мува.
 */
export const DrawCamp = (G, validatorName, data) => {
    const boardCells = [], campDeck = G.campDecks[G.campDecks.length - G.tierToEnd], moveMainArgs = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.campNum; j++) {
            const campCard = G.camp[j];
            if (campCard === undefined) {
                throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
            }
            if (campCard === null) {
                if (data !== undefined) {
                    boardCells.push(_jsx("td", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }) }, `Camp ${j} icon`));
                }
            }
            else {
                if (data !== undefined) {
                    DrawCard(data, boardCells, campCard, j, null, null, MoveNames.ClickCampCardMove, j);
                }
                else if (validatorName === MoveValidatorNames.ClickCampCardMoveValidator) {
                    moveMainArgs.push(j);
                }
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.Camp(), className: "bg-top-camp-icon" }), _jsxs("span", { children: ["Camp ", G.campDecks.length - G.tierToEnd + 1 > G.campDecks.length ?
                                    G.campDecks.length : G.campDecks.length - G.tierToEnd + 1, "(", campDeck !== undefined ? campDeck.length : 0, G.campDecks.length - G.tierToEnd === 0 ? `/` +
                                    G.campDecks.reduce((count, current) => count + current.length, 0) : ``, " cards left)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else if (validatorName !== null) {
        return moveMainArgs;
    }
    else {
        throw new Error(`Функция должна возвращать значение.`);
    }
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
export const DrawCurrentPlayerTurn = (ctx) => (_jsxs("b", { children: ["Current player: ", _jsxs("span", { className: "italic", children: ["Player ", Number(ctx.currentPlayer) + 1] }), " | Turn: ", _jsx("span", { className: "italic", children: ctx.turn })] }));
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
        let suit;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (G.distinctions[suit] === ctx.currentPlayer
                    && ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos]) {
                    if (data !== undefined) {
                        boardCells.push(_jsx("td", { className: "bg-green-500 cursor-pointer", onClick: () => { var _a, _b; return (_b = (_a = data.moves).ClickDistinctionCardMove) === null || _b === void 0 ? void 0 : _b.call(_a, suit); }, title: suitsConfig[suit].distinction.description, children: _jsx("span", { style: Styles.Distinctions(suit), className: "bg-suit-distinction" }) }, `Distinction ${suit} card`));
                    }
                    else if (validatorName === MoveValidatorNames.ClickDistinctionCardMoveValidator) {
                        moveMainArgs.push(suit);
                    }
                }
                else {
                    if (data !== undefined) {
                        boardCells.push(_jsx("td", { className: "bg-green-500", title: suitsConfig[suit].distinction.description, children: _jsx("span", { style: Styles.Distinctions(suit), className: "bg-suit-distinction" }) }, `Distinction ${suit} card`));
                    }
                }
            }
        }
    }
    if (data !== undefined) {
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), " ", _jsx("span", { children: "Distinctions" })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
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
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = (G, validatorName, data) => {
    const boardRows = [], drawData = DrawBoard(G.heroes.length), moveMainArgs = [];
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, hero = G.heroes[increment];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой ${increment}.`);
            }
            if (data !== undefined) {
                if (hero.active) {
                    DrawCard(data, boardCells, hero, increment, null, null, MoveNames.ClickHeroCardMove, increment);
                }
                else {
                    DrawCard(data, boardCells, hero, increment, null);
                }
            }
            else if (validatorName === MoveValidatorNames.ClickHeroCardMoveValidator && hero.active) {
                moveMainArgs.push(increment);
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
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.HeroBack(), className: "bg-top-hero-icon" }), " ", _jsxs("span", { children: ["Heroes (", G.heroes.length, " left)"] })] }), _jsx("tbody", { children: boardRows })] }));
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
                throw new Error(`В массиве монет рынка героев отсутствует монета ${increment}.`);
            }
            const tempCoinValue = marketCoin.value, coinClassName = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin(data, boardCells, `market`, marketCoin, increment, null, coinClassName, countMarketCoins[tempCoinValue], MoveNames.ClickHandCoinMove, j);
            if (increment + 1 === G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows.push(_jsx("tr", { children: boardCells }, `Market coins row ${i}`));
    }
    return (_jsxs("table", { children: [_jsx("caption", { children: _jsxs("span", { className: "block", children: [_jsx("span", { style: Styles.Exchange(), className: "bg-top-market-coin-icon" }), " Market coins (", G.marketCoins.length, " left)"] }) }), _jsx("tbody", { children: boardRows })] }));
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
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const config = stack.config, option = G.drawProfit;
    let caption = `Get `;
    if (option === ConfigNames.PlaceThrudHero || option === ConfigNames.PlaceYludHero
        || option === ConfigNames.PlaceOlwinCards) {
        if (config !== undefined) {
            caption += `suit to place ${player.actionsNum} ${config.drawName} ${player.actionsNum > 1 ? `s` : ``} to ${player.actionsNum > 1 ? `different` : `that`} suit.`;
            PlaceCardsProfit(G, ctx, null, data, boardCells);
        }
    }
    else if (option === ConfigNames.ExplorerDistinction) {
        caption += `one card to your board.`;
        ExplorerDistinctionProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.BonfurAction || option === ConfigNames.DagdaAction) {
        caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} to discard from your board.`;
        DiscardCardFromBoardProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.AndumiaAction || option === ConfigNames.BrisingamensAction) {
        caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} from discard pile to your board.`;
        PickDiscardCardProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.BrisingamensEndGameAction) {
        caption += `one card to discard from your board.`;
        DiscardAnyCardFromPlayerBoardProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.HofudAction) {
        caption += `one warrior card to discard from your board.`;
        DiscardSuitCardFromPlayerBoardProfit(G, ctx, null, null, data, boardCells);
    }
    else if (option === ConfigNames.HoldaAction) {
        caption += `one card from camp to your board.`;
        PickCampCardHoldaProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.DiscardCard) {
        caption += `one card to discard from current tavern.`;
        DiscardCardProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.GetMjollnirProfit) {
        caption += `suit to get Mjollnir profit from ranks on that suit.`;
        GetMjollnirProfitProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.StartOrPassEnlistmentMercenaries) {
        caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
        StartEnlistmentMercenariesProfit(G, ctx, data, boardCells);
    }
    else if (option === ConfigNames.EnlistmentMercenaries) {
        caption += `mercenary to place it to your player board.`;
        GetEnlistmentMercenariesProfit(G, ctx, null, data, boardCells);
    }
    else if (option === ConfigNames.PlaceEnlistmentMercenaries) {
        const card = player.pickedCard;
        if (card !== null) {
            caption += `suit to place ${card.name} to that suit.`;
            PlaceEnlistmentMercenariesProfit(G, ctx, null, data, boardCells);
        }
    }
    else if (option === ConfigNames.AddCoinToPouchVidofnirVedrfolnir) {
        caption += `${player.actionsNum} coin${player.actionsNum > 1 ? `s` : ``} to add to your pouch to fill it.`;
        AddCoinToPouchProfit(G, ctx, null, data, boardCells);
    }
    else {
        if (config !== undefined) {
            caption += `coin to upgrade up to ${config.value}.`;
            if (option === ConfigNames.VidofnirVedrfolnirAction) {
                UpgradeCoinVidofnirVedrfolnirProfit(G, ctx, null, data, boardCells);
            }
            else if (option === ConfigNames.UpgradeCoin) {
                UpgradeCoinProfit(G, ctx, null, data, boardCells);
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), " ", _jsx("span", { children: caption })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
};
/**
 * <h3>Отрисовка карт таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = (G, validatorName, data, gridClass) => {
    const tavernsBoards = [], moveMainArgs = [];
    for (let t = 0; t < G.tavernsNum; t++) {
        const currentTavernConfig = tavernsConfig[t];
        if (currentTavernConfig === undefined) {
            throw new Error(`Отсутствует конфиг таверны ${t}.`);
        }
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < G.drawSize; j++) {
                const tavern = G.taverns[t];
                if (tavern === undefined) {
                    throw new Error(`В массиве таверн отсутствует таверна ${t}.`);
                }
                const tavernCard = tavern[j];
                if (tavernCard === undefined) {
                    throw new Error(`В массиве карт таверны ${t} отсутствует карта ${j}.`);
                }
                if (tavernCard === null) {
                    if (data !== undefined) {
                        boardCells.push(_jsx("td", { children: _jsx("span", { style: Styles.Taverns(t), className: "bg-tavern-icon" }) }, `${currentTavernConfig.name} ${j}`));
                    }
                }
                else {
                    let suit = null;
                    if (IsCardNotActionAndNotNull(tavernCard)) {
                        suit = tavernCard.suit;
                    }
                    if (t === G.currentTavern) {
                        if (data !== undefined) {
                            DrawCard(data, boardCells, tavernCard, j, null, suit, MoveNames.ClickCardMove, j);
                        }
                        else if (validatorName === MoveValidatorNames.ClickCardMoveValidator) {
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
                tavernsBoards.push(_jsxs("table", { className: `${gridClass} justify-self-center`, children: [_jsxs("caption", { className: "whitespace-nowrap", children: [_jsx("span", { style: Styles.Taverns(t), className: "bg-top-tavern-icon" }), " ", _jsx("b", { children: currentTavernConfig.name })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }, `Tavern ${currentTavernConfig.name} board`));
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
    const deck = G.decks[G.decks.length - G.tierToEnd];
    return (_jsxs("b", { children: ["Tier: ", _jsxs("span", { className: "italic", children: [G.decks.length - G.tierToEnd + 1 > G.decks.length ? G.decks.length :
                        G.decks.length - G.tierToEnd + 1, "/", G.decks.length, "(", deck !== undefined ? deck.length : 0, G.decks.length - G.tierToEnd === 0 ? `/`
                        + G.decks.reduce((count, current) => count + current.length, 0) : ``, " cards left)"] })] }));
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
                    throw new Error(`Отсутствует игрок победитель ${winnerIndex}.`);
                }
                winner = `Winner: Player ${winnerPlayer.nickname}`;
            }
            else {
                winner = "Winners: ";
                G.winner.forEach((playerId, index) => {
                    const winnerPlayerI = G.publicPlayers[playerId];
                    if (winnerPlayerI === undefined) {
                        throw new Error(`Отсутствует игрок победитель ${playerId}.`);
                    }
                    winner += `${index + 1}) Player ${winnerPlayerI.nickname}; `;
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