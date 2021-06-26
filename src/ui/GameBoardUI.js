import React from "react";
import {CountMarketCoins} from "../Coin";
import {suitsConfig} from "../data/SuitData.js";
import {tavernsConfig} from "../Tavern";
import {Styles} from "../data/StyleData";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";

/**
 * Отрисовка сегмента игрового поля по указанным данным.
 * Применения:
 * 1) Используется для отрисовски некоторых сегментов игрового поля.
 *
 * @param objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns {{boardCols: number, lastBoardCol: number, boardRows: number}} Параметры для отрисовки сегмента игрового поля.
 * @constructor
 */
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
        if (data.props.G.winner !== undefined) {
            if (data.props.G.winner.length === 1) {
                winner = `Winner: Player ${data.props.G.players[data.props.G.winner[0]].nickname}`;
            } else {
                winner = "Winners: ";
                data.props.G.winner.forEach((playerId, index) => {
                    winner += `${index + 1}) Player ${data.props.G.players[playerId].nickname}; `;
                });
            }
        } else {
            winner = "Draw!";
        }
    } else {
        winner = "Game is started";
    }
    return (
        <b>Game status: <span className="italic">{winner.trim()}</span></b>
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
 * Отрисовка планшета конкретного игрока для дискарда карты.
 * Применения:
 * 1) Отрисовка планшета конкретного игрока для дискарда карты по действию артефакта Brisingamens.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
const DrawPlayerBoardForCardDiscard = (data) => {
    const playerHeaders = [],
        playerRows = [];
    for (const suit in suitsConfig) {
        playerHeaders.push(
            <th className={`${suitsConfig[suit].suitColor}`}
                key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} ${suitsConfig[suit].suitName}`}>
                <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">

                </span>
            </th>
        );
    }
    for (let i = 0; ; i++) {
        const playerCells = [];
        let isDrawRow = false,
            id = 0;
        playerRows[i] = [];
        for (let j = 0; j < data.props.G.suitsNum; j++) {
            const suit = Object.keys(suitsConfig)[j];
            id = i + j;
            if (data.props.G.players[data.props.ctx.currentPlayer].cards[j] !== undefined &&
                data.props.G.players[data.props.ctx.currentPlayer].cards[j][i] !== undefined) {
                isDrawRow = true;
                if (data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].type !== "герой") {
                    if (data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].type === "наёмник" ||
                        data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].type === "артефакт") {
                        playerCells.push(
                            <td key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} camp card ${id}`}
                                onClick={() => data.OnClickDiscardCardFromPlayerBoard(j, i)}
                                className={suitsConfig[suit].suitColor}>
                                <span
                                    style={Styles.CampCards(data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].tier,
                                        data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].path)}
                                    title={data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].name}
                                    className="bg-camp">
                                    <b>{data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].points}</b>
                                </span>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} card ${id}`}
                                onClick={() => data.OnClickDiscardCardFromPlayerBoard(j, i)}
                                className={suitsConfig[suit].suitColor}>
                            <span
                                style={Styles.Cards(data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].suit,
                                    data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].points,
                                    data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].name)}
                                title={data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].name}
                                className="bg-card">
                                <b>{data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].points}</b>
                            </span>
                            </td>
                        );
                    }
                }
            }
        }
        if (isDrawRow) {
            playerRows[i].push(
                <tr key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} board row ${i}`}>{playerCells}</tr>
            );
        } else {
            break;
        }
    }
    return (
        <table>
            <thead>
            <tr>{playerHeaders}</tr>
            </thead>
            <tbody>{playerRows}</tbody>
        </table>
    );
};

/**
 * Отрисовка планшета конкретного игрока для дискарда карты конкретной фракции.
 * Применения:
 * 1) Отрисовка планшета конкретного игрока для дискарда карты конкретной фракции по действию артефакта Hofud.
 *
 * @param data Глобальные параметры.
 * @param suitName Фракция.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
const DrawPlayerBoardForSuitCardDiscard = (data, suitName) => {
    const playerHeaders = [],
        playerRows = [],
        suitId = GetSuitIndexByName(suitName);
    playerHeaders.push(
        <th className={`${suitsConfig[suitName].suitColor} discard suit`}
            key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} ${suitsConfig[suitName].suitName}`}>
            <span style={Styles.Suits(suitsConfig[suitName].suitName)} className="bg-suit-icon">

            </span>
        </th>
    );
    for (let i = 0; data.props.G.players[data.props.ctx.currentPlayer].cards[suitId].length; i++) {
        for (let j = 0; j < 1; j++) {
            if (data.props.G.players[data.props.ctx.currentPlayer].cards[suitId] !== undefined &&
                data.props.G.players[data.props.ctx.currentPlayer].cards[suitId][i] !== undefined) {
                if (data.props.G.players[data.props.ctx.currentPlayer].cards[suitId][i].type !== "герой") {
                    playerRows[i] = [];
                    if (data.props.G.players[data.props.ctx.currentPlayer].type === "наёмник" ||
                        data.props.G.players[data.props.ctx.currentPlayer].type === "артефакт") {
                        playerRows[i].push(
                            <tr key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} discard suit card board row ${i}`}>
                                <td onClick={() => data.OnClickDiscardSuitCardFromPlayerBoard(suitId, i)}
                                    className={`${suitsConfig[suitName].suitColor}  cursor-pointer`}>
                                <span
                                    style={Styles.CampCards(data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].tier,
                                        data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].path)}
                                    title={data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].name}
                                    className="bg-camp">
                                    <b>{data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].points}</b>
                                </span>
                                </td>
                            </tr>
                        );
                    } else {
                        playerRows[i].push(
                            <tr key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} discard suit card board row ${i}`}>
                                <td onClick={() => data.OnClickDiscardSuitCardFromPlayerBoard(suitId, i)}
                                    className={`${suitsConfig[suitName].suitColor}  cursor-pointer`}>
                                <span
                                    style={Styles.Cards(data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].suit,
                                        data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].points,
                                        data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].name)}
                                    title={data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].name}
                                    className="bg-card">
                                    <b>{data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].points}</b>
                                </span>
                                </td>
                            </tr>
                        );
                    }
                }
            }
        }
    }
    return (
        <table>
            <thead>
            <tr>{playerHeaders}</tr>
            </thead>
            <tbody>{playerRows}</tbody>
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
        if (option === "placeCards") {
            caption += `suit to place ${data.props.G.stack[data.props.ctx.currentPlayer][0].stack.config.hero} to that suit.`;
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                if (suit !== data.props.G.players[data.props.ctx.currentPlayer].pickedCard?.suit) {
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Place ${data.props.G.stack[data.props.ctx.currentPlayer][0].stack.config.hero} on ${suitsConfig[suit].suitName}`}>
                            <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon"
                                  onClick={() => data.OnClickSuitToPlaceCard(j)}>

                            </span>
                        </td>
                    );
                }
            }
        } else if (option === "explorerDistinction") {
            caption += "one card to your board.";
            for (let j = 0; j < 3; j++) {
                boardCells.push(
                    <td className={`${suitsConfig[data.props.G.decks[1][j].suit].suitColor} cursor-pointer`}
                        key={`Card ${j} to player board`}
                        onClick={() => data.OnClickCardToPickDistinction(j)}>
                        <span
                            style={Styles.Cards(data.props.G.decks[1][j].suit, data.props.G.decks[1][j].points,
                                data.props.G.decks[1][j].name)}
                            title={data.props.G.decks[1][j].name}
                            className="bg-card">
                            <b>{data.props.G.decks[1][j].points ??
                            data.props.G.decks[1][j].value}</b>
                        </span>
                    </td>
                );
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
                        if (data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].type === "наёмник" ||
                            data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].type === "артефакт") {
                            boardCells.push(
                                <td
                                    className={`${suitsConfig[data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].suit].suitColor} cursor-pointer`}
                                    key={`Discarded card ${data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].name} ${j}`}
                                    onClick={() => data.OnClickCardToDiscard(j, last)}>
                                    <span
                                        style={Styles.CampCards(data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].tier,
                                            data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].path)}
                                        title={data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].name}
                                        className="bg-camp">
                                        <b>{data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].points}</b>
                                    </span>
                                </td>
                            );
                        } else {
                            boardCells.push(
                                <td
                                    className={`${suitsConfig[data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].suit].suitColor} cursor-pointer`}
                                    key={`Discarded card data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].name ${j}`}
                                    onClick={() => data.OnClickCardToDiscard(j, last)}>
                                <span
                                    style={Styles.Cards(data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].suit,
                                        data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].points,
                                        data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].name)}
                                    title={data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].name}
                                    className="bg-card">
                                    <b>{data.props.G.players[data.props.ctx.currentPlayer].cards[j][last].points}</b>
                                </span>
                                </td>
                            );
                        }
                    }
                }
            }
        } else if (option === "AndumiaAction" || option === "BrisingamensAction") {
            let count = data.props.G.stack[data.props.ctx.currentPlayer][0].stack.config.number === 1 ? "one" : "two";
            if (option === "BrisingamensAction" && data.props.G.discardCardsDeck.length === 1) {
                count = "one";
            }
            caption += `${count} card from discard pile to your board.`;
            for (let j = 0; j < data.props.G.discardCardsDeck.length; j++) {
                boardCells.push(
                    <td className={`${suitsConfig[data.props.G.discardCardsDeck[j].suit].suitColor} cursor-pointer`}
                        key={`Card ${j} from discard`} onClick={() => data.OnClickCardFromDiscard(j)}>
                        <span
                            style={Styles.Cards(data.props.G.discardCardsDeck[j].suit, data.props.G.discardCardsDeck[j].points,
                                data.props.G.discardCardsDeck[j].name)}
                            title={data.props.G.discardCardsDeck[j].name}
                            className="bg-card">
                            <b>{data.props.G.discardCardsDeck[j].points ??
                            data.props.G.discardCardsDeck[j].value}</b>
                        </span>
                    </td>
                );
            }
        } else if (option === "BrisingamensEndGameAction") {
            caption += "one card to discard from your board.";
            boardCells.push(
                <td key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} discard card NUMBER`}>
                    {DrawPlayerBoardForCardDiscard(data)}
                </td>
            );
        } else if (option === "HofudAction") {
            caption += "one warrior card to discard from your board.";
            boardCells.push(
                <td key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} discard suit card board`}>
                    {DrawPlayerBoardForSuitCardDiscard(data, "warrior")}
                </td>
            );
        } else if (option === "HoldaAction") {
            caption += "one card from camp to your board.";
            for (let j = 0; j < data.props.G.campNum; j++) {
                if (data.props.G.camp[j]) {
                    boardCells.push(
                        <td className="bg-yellow-200 cursor-pointer"
                            key={`Camp ${data.props.G.camp[j].name} card for hero pick`}
                            onClick={() => data.OnClickCampCardHolda(j)}>
                            <span style={Styles.CampCards(data.props.G.camp[j].tier, data.props.G.camp[j].path)}
                                  title={data.props.G.camp[j].description} className="bg-camp">
                                <b>{data.props.G.camp[j].points ?? ""}</b>
                            </span>
                        </td>
                    );
                }
            }
        } else if (option === "discardCard") {
            caption += "one card to discard from current tavern.";
            for (let j = 0; j < data.props.G.drawSize; j++) {
                boardCells.push(
                    <td className={`${suitsConfig[data.props.G.taverns[data.props.G.currentTavern][j].suit].suitColor} cursor-pointer`}
                        onClick={() => data.OnClickCardToDiscard2Players(j)}
                        key={`Discard card ${j} from tavern`}>
                        <span
                            style={Styles.Cards(data.props.G.taverns[data.props.G.currentTavern][j].suit,
                                data.props.G.taverns[data.props.G.currentTavern][j].points,
                                data.props.G.taverns[data.props.G.currentTavern][j].name)}
                            title={data.props.G.taverns[data.props.G.currentTavern][j].name}
                            className="bg-card">
                            <b>{data.props.G.taverns[data.props.G.currentTavern][j].points ??
                            data.props.G.taverns[data.props.G.currentTavern][j].value}</b>
                        </span>
                    </td>
                );
            }
        } else if (option === "AddCoinToPouchVidofnirVedrfolnir") {
            caption += `${data.props.G.actionsNum} coin${data.props.G.actionsNum > 1 ? "s" : ""} to add to your pouch to fill it.`;
            for (let j = 0; j < data.props.G.players[data.props.ctx.currentPlayer].handCoins.length; j++) {
                let drawData = "";
                if (data.props.G.players[data.props.ctx.currentPlayer].buffs?.["everyTurn"] === "Uline" &&
                    data.props.G.players[data.props.ctx.currentPlayer].handCoins[j] !== null) {
                    drawData = (
                        <span
                            style={Styles.Coin(data.props.G.players[data.props.ctx.currentPlayer].handCoins[j].value,
                                data.props.G.players[data.props.ctx.currentPlayer].handCoins[j].isInitial)}
                            className={`bg-coin border-2`}>

                        </span>
                    );
                }
                if (drawData !== "") {
                    boardCells.push(
                        <td className="cursor-pointer" key={`Coin ${j} to pouch`}
                            onClick={() => data.OnClickCoinToAddToPouch(j)}>
                            {drawData}
                        </td>
                    );
                }
            }
        } else if (option === "startOrPassEnlistmentMercenaries") {
            caption = "Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.";
            for (let j = 0; j < 2; j++) {
                if (j === 0) {
                    boardCells.push(
                        <td className="cursor-pointer" key={`Start Enlistment Mercenaries`}
                            onClick={() => data.OnClickStartEnlistmentMercenaries()}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Start
                            </button>
                        </td>
                    );
                } else if (data.props.G.playersOrder.length > 1) {
                    boardCells.push(
                        <td className="cursor-pointer" key={`Pass Enlistment Mercenaries`}
                            onClick={() => data.OnClickPassEnlistmentMercenaries()}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Pass
                            </button>
                        </td>
                    );
                }
            }
        } else if (option === "enlistmentMercenaries") {
            caption += "mercenary to place it to your player board.";
            const mercenaries = data.props.G.players[data.props.ctx.currentPlayer].campCards.filter(card => card.type === "наёмник");
            for (let j = 0; j < mercenaries.length; j++) {
                boardCells.push(
                    <td className="cursor-pointer" key={`Get enlistment mercenaries ${mercenaries[j].name} ${j}`}
                        onClick={() => data.OnClickGetEnlistmentMercenaries(j)}>
                        <span style={Styles.CampCards(mercenaries[j].tier, mercenaries[j].path)}
                              title={mercenaries.name} className="bg-camp">
                            <b>{mercenaries.points ?? ""}</b>
                        </span>
                    </td>
                );
            }
        } else if (option === "placeEnlistmentMercenaries") {
            caption += `suit to place ${data.props.G.players[data.props.ctx.currentPlayer].pickedCard.name} to that suit.`;
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                if (suit === data.props.G.players[data.props.ctx.currentPlayer].pickedCard.variants[suit]?.suit) {
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Place ${data.props.G.players[data.props.ctx.currentPlayer].pickedCard.name} ${j} on ${suitsConfig[suit].suitName}`}>
                            <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon"
                                  onClick={() => data.OnClickSuitToPlaceMercenary(j)}>
                                <b>{data.props.G.players[data.props.ctx.currentPlayer].pickedCard.points ?? ""}</b>
                            </span>
                        </td>
                    );
                }
            }
        } else {
            caption += `coin to upgrade up to ${data.props.G.stack[data.props.ctx.currentPlayer][0].stack.config.value}.`;
            if (option === "VidofnirVedrfolnirAction") {
                for (let j = data.props.G.tavernsNum; j < data.props.G.players[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                    let drawData = "",
                        type = "board",
                        isInitial = false;
                    if (data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j] &&
                        !data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
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
                        if (data.props.G.stack[data.props.ctx.currentPlayer][0].stack.config.coinId !== j) {
                            boardCells.push(
                                <td className="cursor-pointer" key={`Coin ${j} to upgrade`}
                                    onClick={() => data.OnClickCoinToUpgradeVidofnirVedrfolnir(j, type, isInitial)}>
                                    {drawData}
                                </td>
                            );
                        }
                    }
                }
            } else {
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
                    } else if (!data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j]?.isTriggerTrading) {
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
                        }
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
 * @returns
    {
        JSX.Element
    }
 Шаблон.
 * @constructor
 */
export const DrawCamp = (data) => {
    const boardCells = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.props.G.campNum; j++) {
            if (data.props.G.camp[j] === null || data.props.G.camp[j] === undefined) {
                boardCells.push(
                    <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </td>
                );
            } else {
                boardCells.push(
                    <td className="bg-yellow-200 cursor-pointer" key={`Camp ${data.props.G.camp[j].name} card`}
                        onClick={() => data.OnClickCampCard(j)}>
                        <span style={Styles.CampCards(data.props.G.camp[j].tier, data.props.G.camp[j].path)}
                              title={data.props.G.camp[j].description ?? data.props.G.camp[j].name} className="bg-camp">
                            <b>{data.props.G.camp[j].points ?? ""}</b>
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
 * @returns
    {*
        []
    }
 Шаблон.
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
                    boardCells.push(
                        <td className="cursor-pointer"
                            key={`${tavernsConfig[t].name} card ${j} ${data.props.G.taverns[t][j].name}`}
                            onClick={() => data.OnClickCard(j)}>
                            <span
                                style={Styles.Cards(data.props.G.taverns[t][j].suit, data.props.G.taverns[t][j].points,
                                    data.props.G.taverns[t][j].name)}
                                title={data.props.G.taverns[t][j].name}
                                className="bg-card">
                                <b>{data.props.G.taverns[t][j].points ?? data.props.G.taverns[t][j].value}</b>
                            </span>
                        </td>
                    );
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
