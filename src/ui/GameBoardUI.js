import React from "react";
import {CountMarketCoins} from "../Coin";
import {suitsConfig} from "../data/SuitData.js";
import {tavernsConfig} from "../Tavern";
import {Styles} from "../data/StyleData";

const DrawBoard = (objectsSize) => {
    const boardRows = Math.floor(Math.sqrt(objectsSize)),
        boardCols = Math.ceil(objectsSize / boardRows),
        lastBoardCol = objectsSize % boardCols;

    return {boardRows, boardCols, lastBoardCol};
};

/**
 * Отрисовка игровой информации о текущей эпохе и количестве карт в деках.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawTierCards = (data) => {
    return (
        <b>Tier: <span className="italic">
            {data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length
                ? data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1}
            /{data.props.G.decks.length}
            ({data.props.G.decks.length - data.props.G.tierToEnd !== 2 ?
            data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0}
            {data.props.G.decks.length - data.props.G.tierToEnd === 0 ? "/"
                + data.props.G.decks.reduce((count, current) => count + current.length, 0) : ""} cards left)
        </span></b>
    );
};

/**
 * Отрисовка игровой информации о текущем игроке и текущем ходе.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawCurrentPlayerTurn = (data) => {
    return (
        <b>Current player: <span className="italic">Player {Number(data.props.ctx.currentPlayer) + 1}</span> |
            Turn: <span className="italic">{data.props.ctx.turn}</span></b>
    );
};

/**
 * Отрисовка игровой информации о текущем статусе игры.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawWinner = (data) => {
    let winner;
    if (data.props.ctx.gameover) {
        winner = data.props.ctx.gameover.winner !== null ?
            "Winner: Player " + (data.props.G.winner + 1) :
            "Draw!";
    } else {
        winner = "Game is started";
    }
    return (
        <b>Game status: <span className="italic">{winner}</span></b>
    );
};

/**
 * Отрисовка рынка монет.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawMarketCoins = (data) => {
    const boardRows = [],
        drawData = DrawBoard(data.props.G.marketCoinsUnique.length),
        countMarketCoins = CountMarketCoins(data.props.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j,
                tempCoinValue = data.props.G.marketCoinsUnique[increment].value;
            boardCells.push(
                <td className="bg-yellow-300" key={`Market coin ${tempCoinValue}`}>
                    <span style={Styles.Coin(tempCoinValue, false)} className="bg-market-coin">
                        <span className={countMarketCoins[tempCoinValue] === 0 ? "text-red-500" : "text-blue-500"}>
                            {countMarketCoins[tempCoinValue]}
                        </span>
                    </span>
                </td>
            );
            if (increment + 1 === data.props.G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows[i].push(
            <tr key={`Market coins row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption>
                <span className="block">
                    <span style={Styles.Exchange()} className="bg-top-market-coin-icon">

                    </span> Market coins ({data.props.G.marketCoins.length} left)</span>
            </caption>
            <tbody>
            {boardRows}
            </tbody>
        </table>
    );
};

/**
 * Отрисовка всех героев.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawHeroes = (data) => {
    const boardRows = [],
        drawData = DrawBoard(data.props.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j;
            if (data.props.G.heroes[increment].active) {
                boardCells.push(
                    <td className="bg-gray-600 cursor-pointer" key={`Hero ${data.props.G.heroes[increment].name} card`}
                        onClick={() => data.OnClickHeroCard(increment)}>
                        <span
                            style={Styles.Heroes(data.props.G.heroes[increment].game, data.props.G.heroes[increment].name)}
                            title={data.props.G.heroes[increment].description}
                            className="bg-hero">

                        </span>
                    </td>
                );
            } else {
                boardCells.push(
                    <td className="bg-gray-600" key={`Hero ${data.props.G.heroes[increment].name} card`}>
                        <span
                            style={Styles.Heroes(data.props.G.heroes[increment].game, data.props.G.heroes[increment].name)}
                            title={data.props.G.heroes[increment].description}
                            className="bg-hero-inactive">

                        </span>
                    </td>
                );
            }
            if (increment + 1 === data.props.G.heroes.length) {
                break;
            }
        }
        boardRows[i].push(
            <tr key={`Heroes row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption>
                <span style={Styles.HeroBack()} className="bg-top-hero-icon">

                </span> <span>Heroes ({data.props.G.heroes.length} left)</span>
            </caption>
            <tbody>
            {boardRows}
            </tbody>
        </table>
    );
};

/**
 * Отрисовка преимуществ в конце эпохи.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawDistinctions = (data) => {
    const boardCells = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.props.G.suitsNum; j++) {
            const suit = Object.keys(suitsConfig)[j];
            boardCells.push(
                <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                    onClick={() => data.OnClickDistinctionCard(j)}
                    title={suitsConfig[suit].distinction.description}>
                    <span style={Styles.Distinctions(suit)} className="bg-suit-distinction">

                    </span>
                </td>
            );
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.DistinctionsBack()} className="bg-top-distinctions-icon">

                </span> <span>Distinctions</span>
            </caption>
            <tbody>
            <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

/**
 * Отрисовка профита от карт и героев.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @param option Опция отрисовки конкретного профита.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawProfit = (data, option) => {
    const boardCells = [];
    let caption = "Get ";
    for (let i = 0; i < 1; i++) {
        if (option === "endTier") {
            caption += "suit to add Ylud to your board.";
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                // todo draw Ylud profit for every suit?
                boardCells.push(
                    <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                        key={`Place Ylud on ${suitsConfig[suit].suitName}`}>
                            <span style={Styles.Suits(suitsConfig[suit].suitName)} className="bg-suit-icon"
                                  onClick={() => data.OnClickSuitToPlaceYlud(j)}>

                            </span>
                    </td>
                );
            }
        } else if (option === "ThrudAction") {
            caption += "suit to add Thrud to your board.";
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                // todo draw Thrud profit for every suit?
                boardCells.push(
                    <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                        key={`Add Thrud on ${suitsConfig[suit].suitName}`}>
                        <span style={Styles.Suits(suitsConfig[suit].suitName)} className="bg-suit-icon"
                              onClick={() => data.OnClickSuitToPlaceThrud(j)}>

                        </span>
                    </td>
                );
            }
        } else if (option === "moveThrud") {
            caption += "suit to move Thrud to that suit.";
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                if (suit !== data.props.G.players[data.props.ctx.currentPlayer].pickedCard.suit) {
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Move Thrud on ${suitsConfig[suit].suitName}`}>
                        <span style={Styles.Suits(suitsConfig[suit].suitName)} className="bg-suit-icon"
                              onClick={() => data.OnClickSuitToMoveThrud(j)}>

                        </span>
                        </td>
                    );
                }
            }
        } else if (option === "explorerDistinction") {
            caption += "one card to your board.";
            const deck = [];
            for (let j = 0; j < 3; j++) {
                deck.push(data.props.G.decks[1][j]);
                if (data.props.G.decks[1][j].suit !== undefined) {
                    boardCells.push(
                        <td className={`${suitsConfig[data.props.G.decks[1][j].suit].suitColor} cursor-pointer`}
                            key={`Card ${j} to player board`}
                            onClick={() => data.OnClickCardToPickDistinction(j, deck)}>
                            <b>{deck[j].points}</b>
                        </td>
                    );
                } else if (data.props.G.decks[1][j].type === "улучшение монеты") {
                    boardCells.push(
                        <td className="cursor-pointer" key={`Card ${j} to player board`}
                            onClick={() => data.OnClickCardToPickDistinction(j, deck)}>
                            <b>{deck[j].value}</b>
                        </td>
                    );
                }
            }
        } else if (option === "BonfurAction" || option === "DagdaAction") {
            let suit = null;
            if (option === "BonfurAction") {
                caption += "one card to discard from your board.";
                suit = "blacksmith";
            } else if (option === "DagdaAction") {
                caption += "two card to discard from your board.";
                suit = "hunter";
            }
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                if (data.props.G.players[data.props.ctx.currentPlayer].cards[j][0] !== undefined &&
                    suitsConfig[data.props.G.players[data.props.ctx.currentPlayer].cards[j][0].suit].suit !== suit &&
                    !(option === "DagdaAction" && data.props.G.actionsNum === 1 &&
                        suitsConfig[data.props.G.players[data.props.ctx.currentPlayer].cards[j][0].suit].suit ===
                        data.props.G.players[data.props.ctx.currentPlayer].pickedCard?.suit)) {
                    const last = data.props.G.players[data.props.ctx.currentPlayer].cards[j].length - 1;
                    if (data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].type !== "герой") {
                        boardCells.push(
                            <td
                                className={`${suitsConfig[data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].suit].suitColor} cursor-pointer`}
                                key={`Discarded card ${j}`}
                                onClick={() => data.OnClickCardToDiscard(j, last, option.replace("Action", ""))}>
                                <b>{data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].points}</b>
                            </td>
                        );
                    }
                }
            }
        } else if (option === "OlwinAction") {
            caption += "two suits to add Olwin's doubles to your board.";
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                if (suit !== data.props.G.players[data.props.ctx.currentPlayer].pickedCard?.suit) {
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Place Olwin's double on ${suitsConfig[suit].suitName}`}>
                            <span style={Styles.Suits(suitsConfig[suit].suitName)} className="bg-suit-icon"
                                  onClick={() => data.OnClickSuitToPlaceCard(j)}>

                            </span>
                        </td>
                    );
                }
            }
        } else if (option === "AndumiaAction") {
            caption += "one card from discard pile to your board.";
            for (let j = 0; j < data.props.G.discardCardsDeck.length; j++) {
                if (data.props.G.discardCardsDeck[j].suit !== undefined) {
                    boardCells.push(
                        <td className={`${suitsConfig[data.props.G.discardCardsDeck[j].suit].suitColor} cursor-pointer`}
                            key={`Card ${j} from discard`} onClick={() => data.OnClickCardFromDiscard(j)}>
                            <b>{data.props.G.discardCardsDeck[j].points}</b>
                        </td>
                    );
                } else if (data.props.G.discardCardsDeck[j].type === "улучшение монеты") {
                    boardCells.push(
                        <td className="cursor-pointer" key={`Card ${j} from discard`}
                            onClick={() => data.OnClickCardFromDiscard(j)}>
                            <b>{data.props.G.discardCardsDeck[j].value}</b>
                        </td>
                    );
                }
            }
        } else if (option === "HoldaAction") {
            caption += "one card from camp to your board.";
            for (let j = 0; j < data.props.G.campNum; j++) {
                if (data.props.G.camp[j] !== null || data.props.G.camp[j] !== undefined) {
                    boardCells.push(
                        <td className="bg-yellow-200 cursor-pointer"
                            key={`Camp ${data.props.G.camp[j].name} card for hero pick`}
                            onClick={() => data.OnClickCampCardHolda(j)}>
                            <span style={Styles.CampCards(data.props.G.camp[j].tier, data.props.G.camp[j].name)}
                                  title={data.props.G.camp[j].description} className="bg-camp">

                            </span>
                        </td>
                    );
                }
            }
        } else if (option === "discardCard") {
            caption += "one card to discard from current tavern.";
            for (let j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[data.props.G.currentTavern][j].suit !== undefined) {
                    boardCells.push(
                        <td className={`${suitsConfig[data.props.G.taverns[data.props.G.currentTavern][j].suit].suitColor} cursor-pointer`}
                            onClick={() => data.OnClickCardToDiscard2Players(j)}
                            key={`Discard card ${j} from tavern`}>
                            <b>{data.props.G.taverns[data.props.G.currentTavern][j].points}</b>
                        </td>
                    );
                } else if (data.props.G.taverns[data.props.G.currentTavern][j].type === "улучшение монеты") {
                    boardCells.push(
                        <td className="cursor-pointer" onClick={() => data.OnClickCardToDiscard2Players(j)}
                            key={`Discard card ${j} from tavern`}>
                            <b>{data.props.G.taverns[data.props.G.currentTavern][j].value}</b>
                        </td>
                    );
                }
            }
        } else {
            caption += "coin to upgrade up to " + data.props.G.players[data.props.ctx.currentPlayer].pickedCard.action.config.value + ".";
            const handCoins = data.props.G.players[data.props.ctx.currentPlayer].handCoins.filter(coin => coin !== null);
            let handCoinIndex = -1;
            for (let j = 0; j < data.props.G.players[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                let drawData = "",
                    type = "board",
                    isInitial = false;
                if (data.props.G.players[data.props.ctx.currentPlayer].buffs?.["everyTurn"] === "Uline" &&
                    data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j] === null) {
                    handCoinIndex++;
                    isInitial = handCoins[handCoinIndex].isInitial;
                    const handCoinId = data.props.G.players[data.props.ctx.currentPlayer].handCoins
                        .findIndex(coin => coin?.value === handCoins[handCoinIndex].value && coin?.isInitial === handCoins[handCoinIndex].isInitial);
                    if (!data.props.G.players[data.props.ctx.currentPlayer].handCoins[handCoinId].isTriggerTrading) {
                        type = "hand";
                        isInitial = handCoins[handCoinIndex].isInitial;
                        drawData = (
                            <span
                                style={Styles.Coin(data.props.G.players[data.props.ctx.currentPlayer].handCoins[handCoinId].value,
                                    data.props.G.players[data.props.ctx.currentPlayer].handCoins[handCoinId].isInitial)}
                                className={`bg-coin border-2`}>

                            </span>
                        );
                    }
                } else if (!data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                    isInitial = data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isInitial;
                    drawData = (
                        <span
                            style={Styles.Coin(data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].value,
                                data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isInitial)}
                            className={`bg-coin border-2`}>

                        </span>
                    );
                }
                if (drawData !== "") {
                    if (option === "upgradeCoin") {
                        boardCells.push(
                            <td className="cursor-pointer" key={`Coin ${j} to upgrade`}
                                onClick={() => data.OnClickCoinToUpgrade(j, type, isInitial)}>
                                {drawData}
                            </td>
                        );
                    } else if (option === "upgradeCoinFromDiscard") {
                        boardCells.push(
                            <td className="cursor-pointer" key={`Coin ${j} to upgrade`}
                                onClick={() => data.OnClickCoinToUpgradeFromDiscard(j, type, isInitial)}>
                                {drawData}
                            </td>
                        );
                    } else if (option === "warriorDistinction") {
                        boardCells.push(
                            <td className="cursor-pointer" key={`Coin ${j} to upgrade`}
                                onClick={() => data.OnClickCoinToUpgradeDistinction(j, type, isInitial)}>
                                {drawData}
                            </td>
                        );
                    } else if (option === "upgradeCoinDistinction") {
                        boardCells.push(
                            <td className="cursor-pointer" key={`Coin ${j} to upgrade`}
                                onClick={() => data.OnClickCoinToUpgradeInDistinction(j, type, isInitial)}>
                                {drawData}
                            </td>
                        );
                    } else if (option === "GridAction") {
                        boardCells.push(
                            <td className="cursor-pointer" key={`Coin ${j} to upgrade`}
                                onClick={() => data.OnClickCoinToUpgradeGrid(j, type, isInitial)}>
                                {drawData}
                            </td>
                        );
                    }
                }
            }
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.DistinctionsBack()} className="bg-top-distinctions-icon">

                </span> <span>{caption}</span>
            </caption>
            <tbody>
            <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

/**
 * Отрисовка карт кэмпа.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawCamp = (data) => {
    const boardCells = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.props.G.campNum; j++) {
            if (data.props.G.camp[j] === null || data.props.G.camp[j] === undefined) {
                boardCells.push(
                    <td key={`Camp ${j} icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </td>
                );
            } else {
                boardCells.push(
                    <td className="bg-yellow-200 cursor-pointer" key={`Camp ${data.props.G.camp[j].name} card`}
                        onClick={() => data.OnClickCampCard(j)}>
                        <span style={Styles.CampCards(data.props.G.camp[j].tier, data.props.G.camp[j].name)}
                              title={data.props.G.camp[j].description} className="bg-camp">

                        </span>
                    </td>
                );
            }
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.Camp()} className="bg-top-camp-icon">

                </span>
                <span>Camp {data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length
                    ? data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1}
                    ({data.props.G.campDecks.length - data.props.G.tierToEnd !== 2 ?
                        data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd].length : 0}
                    {data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? "/"
                        + data.props.G.campDecks.reduce((count, current) => count + current.length, 0) : ""} cards left)</span>
            </caption>
            <tbody>
            <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

/**
 * Отрисовка карт таверн.
 * Применения:
 * 1) Отрисовка игрового поля.
 *
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns {*[]} Шаблон.
 * @constructor
 */
export const DrawTaverns = (data, gridClass) => {
    const tavernsBoards = [];
    for (let t = 0; t < data.props.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells.push(
                        <td key={`${tavernsConfig[t].name} ${j}`}>
                            <span style={Styles.Taverns(t)} className="bg-tavern-icon">

                            </span>
                        </td>
                    );
                } else {
                    if (data.props.G.taverns[t][j].suit !== undefined) {
                        boardCells.push(
                            <td className={`${suitsConfig[data.props.G.taverns[t][j].suit].suitColor} cursor-pointer`}
                                key={`${tavernsConfig[t].name} card ${j}`}
                                onClick={() => data.OnClickCard(j)}>
                                <b>{data.props.G.taverns[t][j].points}</b>
                            </td>
                        );
                    } else if (data.props.G.taverns[t][j].type === "улучшение монеты") {
                        boardCells.push(
                            <td className="cursor-pointer"
                                key={`${tavernsConfig[t].name} card ${j}`}
                                onClick={() => data.OnClickCard(j)}>
                                <b>{data.props.G.taverns[t][j].value}</b>
                            </td>
                        );
                    }
                }
            }
            tavernsBoards.push(
                <table className={`${gridClass} justify-self-center`} key={`Tavern ${tavernsConfig[t].name} board`}>
                    <caption>
                        <span style={Styles.Taverns(t)} className="bg-tavern-icon">

                        </span>
                    </caption>
                    <tbody>
                    <tr>{boardCells}</tr>
                    </tbody>
                </table>
            );
        }
    }
    return tavernsBoards;
};
