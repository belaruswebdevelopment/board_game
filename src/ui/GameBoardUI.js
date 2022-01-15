import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isCardNotAction } from "../Card";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { AddCoinToPouchProfit, DiscardCardFromBoardProfit, DiscardCardProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "../helpers/ProfitHelpers";
import { DrawCard, DrawCoin } from "../helpers/UIElementHelpers";
import { DrawBoard, DrawPlayerBoardForCardDiscard, DrawPlayersBoardForSuitCardDiscard } from "../helpers/UIHelpers";
import { tavernsConfig } from "../Tavern";
import { ConfigNames, HeroNames, MoveNames } from "../typescript/enums";
/**
 * <h3>Отрисовка карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле кэмпа.
 */
export const DrawCamp = (data) => {
    const boardCells = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.G.campNum; j++) {
            const campCard = data.G.camp[j];
            if (campCard === null || data.G.camp[j] === undefined) {
                boardCells.push(_jsx("td", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }, void 0) }, `Camp ${j} icon`));
            }
            else {
                DrawCard(data, boardCells, campCard, j, null, null, MoveNames.ClickCampCardMove, j);
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.Camp(), className: "bg-top-camp-icon" }, void 0), _jsxs("span", { children: ["Camp ", data.G.campDecks.length - data.G.tierToEnd + 1 > data.G.campDecks.length ?
                                data.G.campDecks.length : data.G.campDecks.length - data.G.tierToEnd + 1, "(", data.G.campDecks.length - data.G.tierToEnd !== 2 ?
                                data.G.campDecks[data.G.campDecks.length - data.G.tierToEnd].length : 0, data.G.campDecks.length - data.G.tierToEnd === 0 ? `/` +
                                data.G.campDecks.reduce((count, current) => count + current.length, 0) : ``, " cards left)"] }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле информации о текущем ходу.
 */
export const DrawCurrentPlayerTurn = (data) => (_jsxs("b", { children: ["Current player: ", _jsxs("span", { className: "italic", children: ["Player ", Number(data.ctx.currentPlayer) + 1] }, void 0), " | Turn: ", _jsx("span", { className: "italic", children: data.ctx.turn }, void 0)] }, void 0));
/**
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
 */
export const DrawDistinctions = (data) => {
    const boardCells = [];
    for (let i = 0; i < 1; i++) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                boardCells.push(_jsx("td", { className: "bg-green-500 cursor-pointer", onClick: () => data.moves.ClickDistinctionCardMove(suit), title: suitsConfig[suit].distinction.description, children: _jsx("span", { style: Styles.Distinctions(suit), className: "bg-suit-distinction" }, void 0) }, `Distinction ${suit} card`));
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }, void 0), " ", _jsx("span", { children: "Distinctions" }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = (data) => {
    const boardRows = [], drawData = DrawBoard(data.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j;
            DrawCard(data, boardCells, data.G.heroes[increment], increment, null, null, MoveNames.ClickHeroCardMove, increment);
            if (increment + 1 === data.G.heroes.length) {
                break;
            }
        }
        boardRows[i].push(_jsx("tr", { children: boardCells }, `Heroes row ${i}`));
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.HeroBack(), className: "bg-top-hero-icon" }, void 0), " ", _jsxs("span", { children: ["Heroes (", data.G.heroes.length, " left)"] }, void 0)] }, void 0), _jsx("tbody", { children: boardRows }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле рынка монет.
 */
export const DrawMarketCoins = (data) => {
    const boardRows = [], drawData = DrawBoard(data.G.marketCoinsUnique.length), countMarketCoins = CountMarketCoins(data.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, tempCoinValue = data.G.marketCoinsUnique[increment].value, coinClassName = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin(data, boardCells, `market`, data.G.marketCoinsUnique[increment], increment, null, coinClassName, countMarketCoins[tempCoinValue], MoveNames.ClickHandCoinMove, j);
            if (increment + 1 === data.G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows[i].push(_jsx("tr", { children: boardCells }, `Market coins row ${i}`));
    }
    return (_jsxs("table", { children: [_jsx("caption", { children: _jsxs("span", { className: "block", children: [_jsx("span", { style: Styles.Exchange(), className: "bg-top-market-coin-icon" }, void 0), " Market coins (", data.G.marketCoins.length, " left)"] }, void 0) }, void 0), _jsx("tbody", { children: boardRows }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле профита.
 */
export const DrawProfit = (data) => {
    var _a, _b, _c, _d, _e;
    const boardCells = [], config = data.G.publicPlayers[Number(data.ctx.currentPlayer)].stack[0].config, option = data.G.drawProfit;
    let caption = `Get `;
    for (let i = 0; i < 1; i++) {
        if (option === ConfigNames.PlaceCards) {
            if (config !== undefined) {
                caption += `suit to place ${(_a = data.G.actionsNum) !== null && _a !== void 0 ? _a : 1} ${config.drawName} ${data.G.actionsNum > 1 ? `s` : ``} to ${data.G.actionsNum > 1 ? `different` : `that`} suit.`;
                PlaceCardsProfit(data.G, data.ctx, data, boardCells);
            }
        }
        else if (option === ConfigNames.ExplorerDistinction) {
            caption += `one card to your board.`;
            // TODO Move to ProfitHelpers and add logic for bot or just use standard pick cards / upgrade coins
            for (let j = 0; j < 3; j++) {
                const card = data.G.decks[1][j];
                let suit = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, data.G.decks[1][j], j, data.G.publicPlayers[Number(data.ctx.currentPlayer)], suit, MoveNames.ClickCardToPickDistinctionMove, j);
            }
        }
        else if (option === ConfigNames.BonfurAction || option === ConfigNames.DagdaAction) {
            caption += `${data.G.actionsNum} card${data.G.actionsNum > 1 ? `s` : ``} to discard from your board.`;
            DiscardCardFromBoardProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.AndumiaAction || option === ConfigNames.BrisingamensAction) {
            caption += `${data.G.actionsNum} card${data.G.actionsNum > 1 ? `s` : ``} from discard pile to your board.`;
            PickDiscardCardProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.BrisingamensEndGameAction) {
            caption += `one card to discard from your board.`;
            boardCells.push(_jsx("td", { children: DrawPlayerBoardForCardDiscard(data) }, `${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} discard card`));
        }
        else if (option === ConfigNames.HofudAction) {
            caption += `one warrior card to discard from your board.`;
            if (config !== undefined && config.suit !== undefined) {
                boardCells.push(_jsx("td", { children: DrawPlayersBoardForSuitCardDiscard(data, config.suit) }, `Discard ${config.suit} suit cardboard`));
            }
        }
        else if (option === ConfigNames.HoldaAction) {
            caption += `one card from camp to your board.`;
            PickCampCardHoldaProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.DiscardCard) {
            caption += `one card to discard from current tavern.`;
            DiscardCardProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.GetMjollnirProfit) {
            caption += `suit to get Mjöllnir profit from ranks on that suit.`;
            GetMjollnirProfitProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.StartOrPassEnlistmentMercenaries) {
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.EnlistmentMercenaries) {
            caption += `mercenary to place it to your player board.`;
            GetEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.PlaceEnlistmentMercenaries) {
            const card = data.G.publicPlayers[Number(data.ctx.currentPlayer)].pickedCard;
            if (card !== null) {
                caption += `suit to place ${card.name} to that suit.`;
                PlaceEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
            }
        }
        else if (option === ConfigNames.AddCoinToPouchVidofnirVedrfolnir) {
            caption += `${data.G.actionsNum} coin${data.G.actionsNum > 1 ? `s` : ``} to add to your pouch to fill it.`;
            AddCoinToPouchProfit(data.G, data.ctx, data, boardCells);
        }
        else {
            if (config !== undefined) {
                caption += `coin to upgrade up to ${config.value}.`;
                if (option === ConfigNames.VidofnirVedrfolnirAction) {
                    UpgradeCoinVidofnirVedrfolnirProfit(data.G, data.ctx, data, boardCells);
                }
                else if (option === ConfigNames.UpgradeCoin) {
                    // TODO Move to ProfitHelpers and add logic for bot or just use standard upgrade coins
                    const handCoins = data.G.publicPlayers[Number(data.ctx.currentPlayer)].handCoins
                        .filter((coin) => coin !== null);
                    let handCoinIndex = -1;
                    for (let j = 0; j < data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins.length; j++) {
                        // TODO Check .? for all coins!!! and delete AS
                        if (data.G.publicPlayers[Number(data.ctx.currentPlayer)].buffs.everyTurn ===
                            HeroNames.Uline
                            && data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j] === null) {
                            handCoinIndex++;
                            const handCoinId = data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                .handCoins.findIndex((coin) => {
                                var _a, _b;
                                return (coin === null || coin === void 0 ? void 0 : coin.value) === ((_a = handCoins[handCoinIndex]) === null || _a === void 0 ? void 0 : _a.value)
                                    && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === ((_b = handCoins[handCoinIndex]) === null || _b === void 0 ? void 0 : _b.isInitial);
                            });
                            if (data.G.publicPlayers[Number(data.ctx.currentPlayer)].handCoins[handCoinId]
                                && !((_b = data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                    .handCoins[handCoinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
                                DrawCoin(data, boardCells, `coin`, data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                    .handCoins[handCoinId], j, data.G.publicPlayers[Number(data.ctx.currentPlayer)], `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `hand`, (_c = handCoins[handCoinIndex]) === null || _c === void 0 ? void 0 : _c.isInitial);
                            }
                        }
                        else if (data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j]
                            && !((_d = data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j]) === null || _d === void 0 ? void 0 : _d.isTriggerTrading)) {
                            DrawCoin(data, boardCells, `coin`, data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j], j, data.G.publicPlayers[Number(data.ctx.currentPlayer)], `border-2`, null, MoveNames.ClickCoinToUpgradeMove, j, `board`, (_e = data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j]) === null || _e === void 0 ? void 0 : _e.isInitial);
                        }
                    }
                }
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }, void 0), " ", _jsx("span", { children: caption }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка карт таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = (data, gridClass) => {
    const tavernsBoards = [];
    for (let t = 0; t < data.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < data.G.drawSize; j++) {
                const tavernCard = data.G.taverns[t][j];
                if (tavernCard === null) {
                    boardCells.push(_jsx("td", { children: _jsx("span", { style: Styles.Taverns(t), className: "bg-tavern-icon" }, void 0) }, `${tavernsConfig[t].name} ${j}`));
                }
                else {
                    let tavernCardSuit = null;
                    if (isCardNotAction(tavernCard)) {
                        tavernCardSuit = tavernCard.suit;
                    }
                    if (t === data.G.currentTavern) {
                        DrawCard(data, boardCells, tavernCard, j, null, tavernCardSuit, MoveNames.ClickCardMove, j);
                    }
                    else {
                        DrawCard(data, boardCells, tavernCard, j, null, tavernCardSuit);
                    }
                }
            }
            tavernsBoards.push(_jsxs("table", { className: `${gridClass} justify-self-center`, children: [_jsxs("caption", { className: "whitespace-nowrap", children: [_jsx("span", { style: Styles.Taverns(t), className: "bg-top-tavern-icon" }, void 0), " ", _jsx("b", { children: tavernsConfig[t].name }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, `Tavern ${tavernsConfig[t].name} board`));
        }
    }
    return tavernsBoards;
};
/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле информации о количестве карт по эпохам.
 */
export const DrawTierCards = (data) => (_jsxs("b", { children: ["Tier: ", _jsxs("span", { className: "italic", children: [data.G.decks.length - data.G.tierToEnd + 1 > data.G.decks.length ? data.G.decks.length :
                    data.G.decks.length - data.G.tierToEnd + 1, "/", data.G.decks.length, " (", data.G.decks.length - data.G.tierToEnd
                    !== 2 ? data.G.decks[data.G.decks.length - data.G.tierToEnd].length : 0, data.G.decks.length - data.G.tierToEnd === 0 ? `/`
                    + data.G.decks.reduce((count, current) => count + current.length, 0) : ``, " cards left)"] }, void 0)] }, void 0));
/**
 * <h3>Отрисовка игровой информации о текущем статусе игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле информации о ходе/победителях игры.
 */
export const DrawWinner = (data) => {
    let winner;
    if (data.ctx.gameover !== undefined) {
        if (data.G.winner !== undefined) {
            if (data.G.winner.length === 1) {
                winner = `Winner: Player ${data.G.publicPlayers[data.G.winner[0]].nickname}`;
            }
            else {
                winner = "Winners: ";
                data.G.winner.forEach((playerId, index) => {
                    winner += `${index + 1}) Player ${data.G.publicPlayers[playerId].nickname}; `;
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
    return (_jsxs("b", { children: ["Game status: ", _jsx("span", { className: "italic", children: winner.trim() }, void 0)] }, void 0));
};
//# sourceMappingURL=GameBoardUI.js.map