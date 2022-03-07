import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IsCardNotActionAndNotNull } from "../Card";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { DrawBoard } from "../helpers/DrawHelpers";
import { tavernsConfig } from "../Tavern";
import { ConfigNames, MoveNames } from "../typescript/enums";
import { DrawCard, DrawCoin } from "./ElementsUI";
import { AddCoinToPouchProfit, DiscardAnyCardFromPlayerBoardProfit, DiscardCardFromBoardProfit, DiscardCardProfit, DiscardSuitCardFromPlayerBoardProfit, ExplorerDistinctionProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./ProfitUI";
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
    const boardCells = [], campDeck = data.G.campDecks[data.G.campDecks.length - data.G.tierToEnd];
    if (campDeck !== undefined) {
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.G.campNum; j++) {
                const campCard = data.G.camp[j];
                if (campCard !== undefined) {
                    if (campCard === null) {
                        boardCells.push(_jsx("td", { className: "bg-yellow-200", children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }) }, `Camp ${j} icon`));
                    }
                    else {
                        DrawCard(data, boardCells, campCard, j, null, null, MoveNames.ClickCampCardMove, j);
                    }
                }
                else {
                    throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
                }
            }
        }
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.Camp(), className: "bg-top-camp-icon" }), _jsxs("span", { children: ["Camp ", data.G.campDecks.length - data.G.tierToEnd + 1 > data.G.campDecks.length ?
                                    data.G.campDecks.length : data.G.campDecks.length - data.G.tierToEnd + 1, "(", data.G.campDecks.length - data.G.tierToEnd !== 2 ? campDeck.length : 0, data.G.campDecks.length - data.G.tierToEnd === 0 ? `/` +
                                    data.G.campDecks.reduce((count, current) => count + current.length, 0) : ``, " cards left)"] })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else {
        throw new Error(`В массиве дек карт кэмпа отсутствует дека ${data.G.campDecks.length - data.G.tierToEnd}.`);
    }
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
export const DrawCurrentPlayerTurn = (data) => (_jsxs("b", { children: ["Current player: ", _jsxs("span", { className: "italic", children: ["Player ", Number(data.ctx.currentPlayer) + 1] }), " | Turn: ", _jsx("span", { className: "italic", children: data.ctx.turn })] }));
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
        let suit;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                boardCells.push(_jsx("td", { className: "bg-green-500 cursor-pointer", onClick: () => { var _a, _b; return (_b = (_a = data.moves).ClickDistinctionCardMove) === null || _b === void 0 ? void 0 : _b.call(_a, suit); }, title: suitsConfig[suit].distinction.description, children: _jsx("span", { style: Styles.Distinctions(suit), className: "bg-suit-distinction" }) }, `Distinction ${suit} card`));
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), " ", _jsx("span", { children: "Distinctions" })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
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
    var _a;
    const boardRows = [], drawData = DrawBoard(data.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, hero = data.G.heroes[increment];
            if (hero !== undefined) {
                DrawCard(data, boardCells, hero, increment, null, null, MoveNames.ClickHeroCardMove, increment);
            }
            else {
                throw new Error(`В массиве карт героев отсутствует герой ${increment}.`);
            }
            if (increment + 1 === data.G.heroes.length) {
                break;
            }
        }
        // TODO Check it "?"
        (_a = boardRows[i]) === null || _a === void 0 ? void 0 : _a.push(_jsx("tr", { children: boardCells }, `Heroes row ${i}`));
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.HeroBack(), className: "bg-top-hero-icon" }), " ", _jsxs("span", { children: ["Heroes (", data.G.heroes.length, " left)"] })] }), _jsx("tbody", { children: boardRows })] }));
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
    var _a;
    const boardRows = [], drawData = DrawBoard(data.G.marketCoinsUnique.length), countMarketCoins = CountMarketCoins(data.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j, marketCoin = data.G.marketCoinsUnique[increment];
            if (marketCoin !== undefined) {
                const tempCoinValue = marketCoin.value, coinClassName = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
                DrawCoin(data, boardCells, `market`, marketCoin, increment, null, coinClassName, countMarketCoins[tempCoinValue], MoveNames.ClickHandCoinMove, j);
                if (increment + 1 === data.G.marketCoinsUnique.length) {
                    break;
                }
            }
            else {
                throw new Error(`В массиве монет рынка героев отсутствует монета ${increment}.`);
            }
        }
        // TODO Check it "?"
        (_a = boardRows[i]) === null || _a === void 0 ? void 0 : _a.push(_jsx("tr", { children: boardCells }, `Market coins row ${i}`));
    }
    return (_jsxs("table", { children: [_jsx("caption", { children: _jsxs("span", { className: "block", children: [_jsx("span", { style: Styles.Exchange(), className: "bg-top-market-coin-icon" }), " Market coins (", data.G.marketCoins.length, " left)"] }) }), _jsx("tbody", { children: boardRows })] }));
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
    var _a;
    const boardCells = [], player = data.G.publicPlayers[Number(data.ctx.currentPlayer)];
    if (player !== undefined) {
        const config = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config, option = data.G.drawProfit;
        let caption = `Get `;
        if (option === ConfigNames.PlaceThrudHero || option === ConfigNames.PlaceYludHero
            || option === ConfigNames.PlaceOlwinCards) {
            if (config !== undefined) {
                caption += `suit to place ${player.actionsNum} ${config.drawName} ${player.actionsNum > 1 ? `s` : ``} to ${player.actionsNum > 1 ? `different` : `that`} suit.`;
                PlaceCardsProfit(data.G, data.ctx, data, boardCells);
            }
        }
        else if (option === ConfigNames.ExplorerDistinction) {
            caption += `one card to your board.`;
            ExplorerDistinctionProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.BonfurAction || option === ConfigNames.DagdaAction) {
            caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} to discard from your board.`;
            DiscardCardFromBoardProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.AndumiaAction || option === ConfigNames.BrisingamensAction) {
            caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} from discard pile to your board.`;
            PickDiscardCardProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.BrisingamensEndGameAction) {
            caption += `one card to discard from your board.`;
            DiscardAnyCardFromPlayerBoardProfit(data.G, data.ctx, data, boardCells);
        }
        else if (option === ConfigNames.HofudAction) {
            caption += `one warrior card to discard from your board.`;
            DiscardSuitCardFromPlayerBoardProfit(data.G, data.ctx, data, boardCells);
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
            caption += `suit to get Mjollnir profit from ranks on that suit.`;
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
            const card = player.pickedCard;
            if (card !== null) {
                caption += `suit to place ${card.name} to that suit.`;
                PlaceEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
            }
        }
        else if (option === ConfigNames.AddCoinToPouchVidofnirVedrfolnir) {
            caption += `${player.actionsNum} coin${player.actionsNum > 1 ? `s` : ``} to add to your pouch to fill it.`;
            AddCoinToPouchProfit(data.G, data.ctx, data, boardCells);
        }
        else {
            if (config !== undefined) {
                caption += `coin to upgrade up to ${config.value}.`;
                if (option === ConfigNames.VidofnirVedrfolnirAction) {
                    UpgradeCoinVidofnirVedrfolnirProfit(data.G, data.ctx, data, boardCells);
                }
                else if (option === ConfigNames.UpgradeCoin) {
                    UpgradeCoinProfit(data.G, data.ctx, data, boardCells);
                }
            }
        }
        return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }), " ", _jsx("span", { children: caption })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }));
    }
    else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
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
        const currentTavernConfig = tavernsConfig[t];
        if (currentTavernConfig !== undefined) {
            for (let i = 0; i < 1; i++) {
                const boardCells = [];
                for (let j = 0; j < data.G.drawSize; j++) {
                    const tavern = data.G.taverns[t];
                    if (tavern !== undefined) {
                        const tavernCard = tavern[j];
                        if (tavernCard !== undefined) {
                            if (tavernCard === null) {
                                boardCells.push(_jsx("td", { children: _jsx("span", { style: Styles.Taverns(t), className: "bg-tavern-icon" }) }, `${currentTavernConfig.name} ${j}`));
                            }
                            else {
                                let suit = null;
                                if (IsCardNotActionAndNotNull(tavernCard)) {
                                    suit = tavernCard.suit;
                                }
                                if (t === data.G.currentTavern) {
                                    DrawCard(data, boardCells, tavernCard, j, null, suit, MoveNames.ClickCardMove, j);
                                }
                                else {
                                    DrawCard(data, boardCells, tavernCard, j, null, suit);
                                }
                            }
                        }
                        else {
                            throw new Error(`В массиве карт таверны ${t} отсутствует карта ${j}.`);
                        }
                    }
                    else {
                        throw new Error(`В массиве таверн отсутствует таверна ${t}.`);
                    }
                }
                tavernsBoards.push(_jsxs("table", { className: `${gridClass} justify-self-center`, children: [_jsxs("caption", { className: "whitespace-nowrap", children: [_jsx("span", { style: Styles.Taverns(t), className: "bg-top-tavern-icon" }), " ", _jsx("b", { children: currentTavernConfig.name })] }), _jsx("tbody", { children: _jsx("tr", { children: boardCells }) })] }, `Tavern ${currentTavernConfig.name} board`));
            }
        }
        else {
            throw new Error(`Отсутствует конфиг таверны ${t}.`);
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
export const DrawTierCards = (data) => {
    const deck = data.G.decks[data.G.decks.length - data.G.tierToEnd];
    if (deck !== undefined) {
        return (_jsxs("b", { children: ["Tier: ", _jsxs("span", { className: "italic", children: [data.G.decks.length - data.G.tierToEnd + 1 > data.G.decks.length ? data.G.decks.length :
                            data.G.decks.length - data.G.tierToEnd + 1, "/", data.G.decks.length, "(", data.G.decks.length - data.G.tierToEnd !== 2 ? deck.length : 0, data.G.decks.length - data.G.tierToEnd === 0 ? `/`
                            + data.G.decks.reduce((count, current) => count + current.length, 0) : ``, " cards left)"] })] }));
    }
    else {
        throw new Error(`В массиве дек карт отсутствует дека ${data.G.decks.length - data.G.tierToEnd}.`);
    }
};
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
                const winnerIndex = data.G.winner[0];
                if (winnerIndex !== undefined) {
                    const winnerPlayer = data.G.publicPlayers[winnerIndex];
                    if (winnerPlayer !== undefined) {
                        winner = `Winner: Player ${winnerPlayer.nickname}`;
                    }
                    else {
                        throw new Error(`Отсутствует игрок победитель ${winnerIndex}.`);
                    }
                }
                else {
                    throw new Error(`Отсутствует индекс игрока победителя.`);
                }
            }
            else {
                winner = "Winners: ";
                data.G.winner.forEach((playerId, index) => {
                    const winnerPlayerI = data.G.publicPlayers[playerId];
                    if (winnerPlayerI !== undefined) {
                        winner += `${index + 1}) Player ${winnerPlayerI.nickname}; `;
                    }
                    else {
                        throw new Error(`Отсутствует игрок победитель ${playerId}.`);
                    }
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