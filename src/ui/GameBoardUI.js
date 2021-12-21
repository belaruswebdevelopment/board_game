import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CountMarketCoins } from "../Coin";
import { suitsConfig } from "../data/SuitData";
import { tavernsConfig } from "../Tavern";
import { Styles } from "../data/StyleData";
import { DrawBoard, DrawCard, DrawCoin, DrawPlayerBoardForCardDiscard, DrawPlayersBoardForSuitCardDiscard, OnClickCampCard, OnClickCard, OnClickCardToPickDistinction, OnClickCoinToUpgrade, OnClickHandCoin, OnClickHeroCard } from "../helpers/UIHelpers";
import { isCardNotAction } from "../Card";
import { AddCoinToPouchProfit, DiscardCardFromBoardProfit, DiscardCardProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "../helpers/ProfitHelpers";
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
        for (let j = 0; j < data.props.G.campNum; j++) {
            const campCard = data.props.G.camp[j];
            if (campCard === null || data.props.G.camp[j] === undefined) {
                boardCells.push(_jsx("td", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }, void 0) }, `Camp ${j} icon`));
            }
            else {
                DrawCard(data, boardCells, campCard, j, null, null, OnClickCampCard.name, j);
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.Camp(), className: "bg-top-camp-icon" }, void 0), _jsxs("span", { children: ["Camp ", data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length ?
                                data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1, "(", data.props.G.campDecks.length - data.props.G.tierToEnd !== 2 ?
                                data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd].length : 0, data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? `/`
                                + data.props.G.campDecks
                                    .reduce((count, current) => count + current.length, 0) : "", " cards left)"] }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
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
export const DrawCurrentPlayerTurn = (data) => (_jsxs("b", { children: ["Current player: ", _jsxs("span", { className: "italic", children: ["Player ", Number(data.props.ctx.currentPlayer) + 1] }, void 0), " | Turn: ", _jsx("span", { className: "italic", children: data.props.ctx.turn }, void 0)] }, void 0));
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
        for (let j = 0; j < data.props.G.suitsNum; j++) {
            const suit = Object.keys(suitsConfig)[j];
            boardCells.push(_jsx("td", { className: "bg-green-500 cursor-pointer", onClick: () => data.OnClickDistinctionCard(j), title: suitsConfig[suit].distinction.description, children: _jsx("span", { style: Styles.Distinctions(suit), className: "bg-suit-distinction" }, void 0) }, `Distinction ${suit} card`));
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
    const boardRows = [], drawData = DrawBoard(data.props.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j;
            DrawCard(data, boardCells, data.props.G.heroes[increment], increment, null, null, OnClickHeroCard.name, increment);
            if (increment + 1 === data.props.G.heroes.length) {
                break;
            }
        }
        boardRows[i].push(_jsx("tr", { children: boardCells }, `Heroes row ${i}`));
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.HeroBack(), className: "bg-top-hero-icon" }, void 0), " ", _jsxs("span", { children: ["Heroes (", data.props.G.heroes.length, " left)"] }, void 0)] }, void 0), _jsx("tbody", { children: boardRows }, void 0)] }, void 0));
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
    const boardRows = [], drawData = DrawBoard(data.props.G.marketCoinsUnique.length), countMarketCoins = CountMarketCoins(data.props.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, tempCoinValue = data.props.G.marketCoinsUnique[increment].value, coinClassName = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin(data, boardCells, `market`, data.props.G.marketCoinsUnique[increment], increment, null, coinClassName, countMarketCoins[tempCoinValue], OnClickHandCoin.name, j);
            if (increment + 1 === data.props.G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows[i].push(_jsx("tr", { children: boardCells }, `Market coins row ${i}`));
    }
    return (_jsxs("table", { children: [_jsx("caption", { children: _jsxs("span", { className: "block", children: [_jsx("span", { style: Styles.Exchange(), className: "bg-top-market-coin-icon" }, void 0), " Market coins (", data.props.G.marketCoins.length, " left)"] }, void 0) }, void 0), _jsx("tbody", { children: boardRows }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param option Опция отрисовки конкретного профита.
 * @returns Поле профита.
 */
export const DrawProfit = (data, option) => {
    var _a, _b, _c, _d, _e;
    const boardCells = [], config = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].stack[0].config;
    let caption = "Get ";
    for (let i = 0; i < 1; i++) {
        if (option === "placeCards") {
            if (config !== undefined) {
                caption += `suit to place ${(_a = data.props.G.actionsNum) !== null && _a !== void 0 ? _a : 1} ${config.drawName} ${data.props.G.actionsNum > 1 ? `s` : ``} to ${data.props.G.actionsNum > 1 ? `different` : `that`} suit.`;
                PlaceCardsProfit(data.props.G, data.props.ctx, data, boardCells);
            }
        }
        else if (option === `explorerDistinction`) {
            caption += `one card to your board.`;
            // todo Move to ProfitHelpers and add logic for bot or just use standard pick cards / upgrade coins
            for (let j = 0; j < 3; j++) {
                const card = data.props.G.decks[1][j];
                let suit = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, data.props.G.decks[1][j], j, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)], suit, OnClickCardToPickDistinction.name, j);
            }
        }
        else if (option === `BonfurAction` || option === `DagdaAction`) {
            caption += `${data.props.G.actionsNum} card${data.props.G.actionsNum > 1 ? `s` : ``} to discard from your board.`;
            DiscardCardFromBoardProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === `AndumiaAction` || option === `BrisingamensAction`) {
            caption += `${data.props.G.actionsNum} card${data.props.G.actionsNum > 1 ? "s" : ""} from discard pile to your board.`;
            PickDiscardCardProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === `BrisingamensEndGameAction`) {
            caption += `one card to discard from your board.`;
            boardCells.push(_jsx("td", { children: DrawPlayerBoardForCardDiscard(data) }, `${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} discard card`));
        }
        else if (option === `HofudAction`) {
            caption += `one warrior card to discard from your board.`;
            if (config !== undefined && config.suit !== undefined) {
                boardCells.push(_jsx("td", { children: DrawPlayersBoardForSuitCardDiscard(data, config.suit) }, `Discard ${config.suit} suit cardboard`));
            }
        }
        else if (option === `HoldaAction`) {
            caption += `one card from camp to your board.`;
            PickCampCardHoldaProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === `discardCard`) {
            caption += `one card to discard from current tavern.`;
            DiscardCardProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === `getMjollnirProfit`) {
            caption += `suit to get Mjöllnir profit from ranks on that suit.`;
            GetMjollnirProfitProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === `startOrPassEnlistmentMercenaries`) {
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === `enlistmentMercenaries`) {
            caption += `mercenary to place it to your player board.`;
            GetEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === `placeEnlistmentMercenaries`) {
            const card = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].pickedCard;
            if (card !== null) {
                caption += `suit to place ${card.name} to that suit.`;
                PlaceEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
            }
        }
        else if (option === `AddCoinToPouchVidofnirVedrfolnir`) {
            caption += `${data.props.G.actionsNum} coin${data.props.G.actionsNum > 1 ? "s" : ""} to add to your pouch to fill it.`;
            AddCoinToPouchProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else {
            if (config !== undefined) {
                caption += `coin to upgrade up to ${config.value}.`;
                if (option === `VidofnirVedrfolnirAction`) {
                    UpgradeCoinVidofnirVedrfolnirProfit(data.props.G, data.props.ctx, data, boardCells);
                }
                else if (option === `upgradeCoin`) {
                    // todo Move to ProfitHelpers and add logic for bot or just use standard upgrade coins
                    const handCoins = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].handCoins
                        .filter((coin) => coin !== null);
                    let handCoinIndex = -1;
                    for (let j = 0; j <
                        data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins.length; j++) {
                        // todo Check .? for all coins!!! and delete AS
                        if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].buffs.everyTurn ===
                            `Uline` && data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]
                            === null) {
                            handCoinIndex++;
                            const handCoinId = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .handCoins.findIndex((coin) => {
                                var _a, _b;
                                return (coin === null || coin === void 0 ? void 0 : coin.value) === ((_a = handCoins[handCoinIndex]) === null || _a === void 0 ? void 0 : _a.value)
                                    && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === ((_b = handCoins[handCoinIndex]) === null || _b === void 0 ? void 0 : _b.isInitial);
                            });
                            if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .handCoins[handCoinId]
                                && !((_b = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .handCoins[handCoinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
                                DrawCoin(data, boardCells, `coin`, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .handCoins[handCoinId], j, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)], `border-2`, null, OnClickCoinToUpgrade.name, j, `hand`, (_c = handCoins[handCoinIndex]) === null || _c === void 0 ? void 0 : _c.isInitial);
                            }
                        }
                        else if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]
                            && !((_d = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]) === null || _d === void 0 ? void 0 : _d.isTriggerTrading)) {
                            DrawCoin(data, boardCells, `coin`, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .boardCoins[j], j, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)], `border-2`, null, OnClickCoinToUpgrade.name, j, `board`, (_e = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .boardCoins[j]) === null || _e === void 0 ? void 0 : _e.isInitial);
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
    for (let t = 0; t < data.props.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < data.props.G.drawSize; j++) {
                const tavernCard = data.props.G.taverns[t][j];
                if (tavernCard === null) {
                    boardCells.push(_jsx("td", { children: _jsx("span", { style: Styles.Taverns(t), className: "bg-tavern-icon" }, void 0) }, `${tavernsConfig[t].name} ${j}`));
                }
                else {
                    let tavernCardSuit = null;
                    if (isCardNotAction(tavernCard)) {
                        tavernCardSuit = tavernCard.suit;
                    }
                    if (t === data.props.G.currentTavern) {
                        DrawCard(data, boardCells, tavernCard, j, null, tavernCardSuit, OnClickCard.name, j);
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
export const DrawTierCards = (data) => (_jsxs("b", { children: ["Tier: ", _jsxs("span", { className: "italic", children: [data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length ?
                    data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1, "/", data.props.G.decks.length, " (", data.props.G.decks.length - data.props.G.tierToEnd !== 2 ?
                    data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0, data.props.G.decks.length - data.props.G.tierToEnd === 0 ? `/`
                    + data.props.G.decks.reduce((count, current) => count + current.length, 0) : ``, " cards left)"] }, void 0)] }, void 0));
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
    if (data.props.ctx.gameover !== undefined) {
        if (data.props.G.winner !== undefined) {
            if (data.props.G.winner.length === 1) {
                winner = `Winner: Player ${data.props.G.publicPlayers[data.props.G.winner[0]].nickname}`;
            }
            else {
                winner = "Winners: ";
                data.props.G.winner.forEach((playerId, index) => {
                    winner += `${index + 1}) Player ${data.props.G.publicPlayers[playerId].nickname}; `;
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
