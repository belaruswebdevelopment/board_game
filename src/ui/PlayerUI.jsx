"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawPlayersBoards = exports.DrawPlayersHandsCoins = exports.DrawPlayersBoardsCoins = void 0;
var react_1 = require("react");
var SuitData_1 = require("../data/SuitData");
var Tavern_1 = require("../Tavern");
var Score_1 = require("../Score");
var StyleData_1 = require("../data/StyleData");
var SuitHelpers_1 = require("../helpers/SuitHelpers");
var UIHelper_1 = require("../helpers/UIHelper");
var ScoreHelpers_1 = require("../helpers/ScoreHelpers");
/**
 * <h3>Отрисовка планшета монет, выложенных игроком на стол.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {*[]} Шаблон.
 * @constructor
 */
var DrawPlayersBoardsCoins = function (data) {
    var playersBoardsCoins = [], playerHeaders = [], playerFooters = [], playerRows = [];
    for (var p = 0; p < data.props.ctx.numPlayers; p++) {
        var coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
        playerRows[p] = [];
        for (var i = 0; i < 2; i++) {
            var playerCells = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (var j = 0; j < data.props.G.tavernsNum; j++) {
                    playerHeaders[p].push(<th key={"Tavern " + Tavern_1.tavernsConfig[j].name}>
                            <span style={StyleData_1.Styles.Taverns(j)} className="bg-tavern-icon">

                            </span>
                        </th>);
                    if (data.props.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                        if ((Number(data.props.ctx.currentPlayer) === p &&
                            data.props.ctx.phase === "placeCoins") ||
                            (Number(data.props.ctx.currentPlayer) === p && data.props.ctx.phase === "placeCoinsUline"
                                && j === data.props.G.currentTavern + 1)) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "back-tavern-icon", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, j, "OnClickBoardCoin", j);
                        }
                        else {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "back-tavern-icon", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, j);
                        }
                    }
                    else if (data.props.ctx.phase === "placeCoins" && Number(data.props.ctx.currentPlayer) === p) {
                        (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, null, "OnClickBoardCoin", j);
                    }
                    else {
                        if (data.props.G.winner || (data.props.ctx.phase === "placeCoinsUline" &&
                            data.props.G.currentTavern >= j - 1) || (data.props.ctx.phase !== "placeCoins"
                            && data.props.G.currentTavern >= j)) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                        }
                        else {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "back", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                        }
                    }
                    coinIndex++;
                }
            }
            else if (i === 1) {
                for (var j = data.props.G.tavernsNum; j <= data.props.G.publicPlayers[p].boardCoins.length; j++) {
                    if (j === data.props.G.publicPlayers[p].boardCoins.length) {
                        playerFooters[p].push(<th key={data.props.G.publicPlayers[p].nickname + " priority icon"}>
                                <span style={StyleData_1.Styles.Priority()} className="bg-priority-icon">

                                </span>
                            </th>);
                        playerCells.push(<td key={data.props.G.publicPlayers[p].nickname + " priority gem"} className="bg-gray-300">
                                <span style={StyleData_1.Styles.Priorities(data.props.G.publicPlayers[p].priority.value)} className="bg-priority">

                                </span>
                            </td>);
                    }
                    else {
                        playerFooters[p].push(<th key={data.props.G.publicPlayers[p].nickname + " exchange icon " + j}>
                                <span style={StyleData_1.Styles.Exchange()} className="bg-small-market-coin">

                                </span>
                            </th>);
                        if (data.props.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                            if (Number(data.props.ctx.currentPlayer) === p && data.props.ctx.phase !== "placeCoinsUline" &&
                                (data.props.ctx.phase === "placeCoins" || (data.props.ctx.activePlayers &&
                                    data.props.ctx.activePlayers[data.props.ctx.currentPlayer]) === "placeTradingCoinsUline")) {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "back-small-market-coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, null, "OnClickBoardCoin", j);
                            }
                            else {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "back-small-market-coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                            }
                        }
                        else if (Number(data.props.ctx.currentPlayer) === p && (data.props.ctx.phase === "placeCoins" ||
                            (data.props.ctx.activePlayers && data.props.ctx.activePlayers[data.props.ctx.currentPlayer])
                                === "placeTradingCoinsUline")) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, null, "OnClickBoardCoin", j);
                        }
                        else {
                            if (data.props.G.winner || (data.props.ctx.phase !== "placeCoins" &&
                                Number(data.props.ctx.currentPlayer) === p &&
                                data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern] &&
                                data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern].isTriggerTrading)) {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                            }
                            else {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "back", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr key={data.props.G.publicPlayers[p].nickname + " board coins row " + i}>{playerCells}</tr>);
        }
        playersBoardsCoins[p].push(<table className="mx-auto" key={data.props.G.publicPlayers[p].nickname + " board coins"}>
                <caption>
                    Player {p + 1} ({data.props.G.publicPlayers[p].nickname}) played coins
                </caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>
                {playerRows[p]}
                </tbody>
                <tfoot>
                <tr>{playerFooters[p]}</tr>
                </tfoot>
            </table>);
    }
    return playersBoardsCoins;
};
exports.DrawPlayersBoardsCoins = DrawPlayersBoardsCoins;
/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {*[]} Шаблон.
 * @constructor
 */
var DrawPlayersHandsCoins = function (data) {
    var playersHandsCoins = [];
    for (var p = 0; p < data.props.ctx.numPlayers; p++) {
        var playerCells = [];
        playersHandsCoins[p] = [];
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < data.props.G.publicPlayers[p].handCoins.length; j++) {
                if (data.props.G.publicPlayers[p].handCoins[j] === null) {
                    playerCells.push(<td key={data.props.G.publicPlayers[p].nickname + " hand coin " + j + " empty"} className="bg-yellow-300">
                            <span className="bg-coin bg-yellow-300 border-2">

                            </span>
                        </td>);
                }
                else {
                    if (Number(data.props.ctx.currentPlayer) === p || data.props.G.winner) {
                        var coinClasses = "border-2";
                        if (data.props.G.publicPlayers[p].selectedCoin === j) {
                            coinClasses = "border-2 border-green-400";
                        }
                        if (!data.props.G.winner && (data.props.ctx.phase === "placeCoins" ||
                            data.props.ctx.phase === "placeCoinsUline" || (data.props.ctx.activePlayers &&
                            data.props.ctx.activePlayers[data.props.ctx.currentPlayer]) === "placeTradingCoinsUline")) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p], coinClasses, null, "OnClickHandCoin", j);
                        }
                        else {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p], coinClasses);
                        }
                    }
                    else {
                        (0, UIHelper_1.DrawCoin)(data, playerCells, "back", data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p]);
                    }
                }
            }
        }
        playersHandsCoins[p].push(<table className="mx-auto" key={data.props.G.publicPlayers[p].nickname + " hand coins"}>
                <caption>Player {p + 1} ({data.props.G.publicPlayers[p].nickname}) coins</caption>
                <tbody>
                <tr>{playerCells}</tr>
                </tbody>
            </table>);
    }
    return playersHandsCoins;
};
exports.DrawPlayersHandsCoins = DrawPlayersHandsCoins;
/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {*[]} Шаблон.
 * @constructor
 */
var DrawPlayersBoards = function (data) {
    var playersBoards = [], playerHeaders = [], playerHeadersCount = [], playerRows = [];
    for (var p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        for (var suit in SuitData_1.suitsConfig) {
            playerHeaders[p].push(<th className={"" + SuitData_1.suitsConfig[suit].suitColor} key={data.props.G.publicPlayers[p].nickname + " " + SuitData_1.suitsConfig[suit].suitName}>
                    <span style={StyleData_1.Styles.Suits(SuitData_1.suitsConfig[suit].suit)} className="bg-suit-icon">

                    </span>
                </th>);
            playerHeadersCount[p].push(<th className={SuitData_1.suitsConfig[suit].suitColor + " text-white"} key={data.props.G.publicPlayers[p].nickname + " " + SuitData_1.suitsConfig[suit].suitName + " count"}>
                    <b>{data.props.G.publicPlayers[p].cards[(0, SuitHelpers_1.GetSuitIndexByName)(suit)].reduce(ScoreHelpers_1.TotalRank, 0)}</b>
                </th>);
        }
        for (var s = 0; s < 1 + data.props.G.expansions.thingvellir.active; s++) {
            if (s === 0) {
                playerHeaders[p].push(<th className="bg-gray-600" key={data.props.G.publicPlayers[p].nickname + " hero icon"}>
                        <span style={StyleData_1.Styles.HeroBack()} className="bg-hero-icon">

                        </span>
                    </th>);
                playerHeadersCount[p].push(<th className="bg-gray-600 text-white" key={data.props.G.publicPlayers[p].nickname + " hero count"}>
                        <b>{data.props.G.publicPlayers[p].heroes.length}</b>
                    </th>);
            }
            else {
                playerHeaders[p].push(<th className="bg-yellow-200" key={data.props.G.publicPlayers[p].nickname + " camp icon"}>
                        <span style={StyleData_1.Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </th>);
                playerHeadersCount[p].push(<th className="bg-yellow-200 text-white" key={data.props.G.publicPlayers[p].nickname + " camp counts"}>
                        <b>{data.props.G.publicPlayers[p].campCards.length}</b>
                    </th>);
            }
        }
        for (var i = 0;; i++) {
            var playerCells = [];
            var isDrawRow = false, id = 0;
            playerRows[p][i] = [];
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                var suit = Object.keys(SuitData_1.suitsConfig)[j];
                id = i + j;
                if (data.props.G.publicPlayers[p].cards[j] !== undefined && data.props.G.publicPlayers[p].cards[j][i]
                    !== undefined) {
                    isDrawRow = true;
                    (0, UIHelper_1.DrawCard)(data, playerCells, data.props.G.publicPlayers[p].cards[j][i], id, data.props.G.publicPlayers[p], suit);
                }
                else {
                    playerCells.push(<td key={data.props.G.publicPlayers[p].nickname + " empty card " + id}>

                        </td>);
                }
            }
            for (var k = 0; k < 1 + data.props.G.expansions.thingvellir.active; k++) {
                id += k + 1;
                if (k === 0) {
                    // todo Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (data.props.G.publicPlayers[p].heroes[i] !== undefined && (!data.props.G.publicPlayers[p].heroes[i].suit &&
                        !((data.props.G.publicPlayers[p].heroes[i].name === "Ylud" &&
                            data.props.G.publicPlayers[p].cards.flat().findIndex(function (card) { return card.name === "Ylud"; }) !== -1) ||
                            (data.props.G.publicPlayers[p].heroes[i].name === "Thrud" &&
                                data.props.G.publicPlayers[p].cards.flat().findIndex(function (card) { return card.name === "Thrud"; }) !== -1)))) {
                        isDrawRow = true;
                        (0, UIHelper_1.DrawCard)(data, playerCells, data.props.G.publicPlayers[p].heroes[i], id, data.props.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(<td key={data.props.G.publicPlayers[p].nickname + " hero " + i}>

                            </td>);
                    }
                }
                else {
                    if (data.props.G.publicPlayers[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        (0, UIHelper_1.DrawCard)(data, playerCells, data.props.G.publicPlayers[p].campCards[i], id, data.props.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(<td key={data.props.G.publicPlayers[p].nickname + " camp card " + i}>

                            </td>);
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(<tr key={data.props.G.publicPlayers[p].nickname + " board row " + i}>{playerCells}</tr>);
            }
            else {
                break;
            }
        }
        playersBoards[p].push(<table className="mx-auto" key={data.props.G.publicPlayers.nickname + " board"}>
                <caption>Player {p + 1} ({data.props.G.publicPlayers[p].nickname}) cards, {data.props.G.winner !== null ?
                "Final: " + data.props.G.totalScore[p] : (0, Score_1.CurrentScoring)(data.props.G.publicPlayers[p])} points
                </caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                <tr>{playerHeadersCount[p]}</tr>
                </thead>
                <tbody>{playerRows[p]}</tbody>
            </table>);
    }
    return playersBoards;
};
exports.DrawPlayersBoards = DrawPlayersBoards;
