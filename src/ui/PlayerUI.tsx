import React from "react";
import {suitsConfig} from "../data/SuitData";
import {tavernsConfig} from "../Tavern";
import {CurrentScoring} from "../Score";
import {Styles} from "../data/StyleData";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {DrawCard, DrawCoin} from "../helpers/UIHelpers";
import {TotalRank} from "../helpers/ScoreHelpers";
import {GameBoard} from "../GameBoard";
import {ICoin} from "../Coin";

/**
 * <h3>Отрисовка планшета монет, выложенных игроком на стол.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element[][]} Игровые поля для пользовательских монет на столе.
 * @constructor
 */
export const DrawPlayersBoardsCoins = (data: GameBoard): JSX.Element[][] => {
    const playersBoardsCoins: JSX.Element[][] = [],
        playerHeaders: JSX.Element[][] = [],
        playerFooters: JSX.Element[][] = [],
        playerRows: JSX.Element[][][] = [];
    for (let p: number = 0; p < data.props.ctx.numPlayers; p++) {
        let coinIndex: number = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
        playerRows[p] = [];
        for (let i: number = 0; i < 2; i++) {
            const playerCells: JSX.Element[] = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (let j: number = 0; j < data.props.G.tavernsNum; j++) {
                    playerHeaders[p].push(
                        <th key={`Tavern ${tavernsConfig[j].name}`}>
                            <span style={Styles.Taverns(j)} className="bg-tavern-icon">

                            </span>
                        </th>
                    );
                    if (data.props.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                        if ((Number(data.props.ctx.currentPlayer) === p && data.props.ctx.phase === "placeCoins")
                            || (Number(data.props.ctx.currentPlayer) === p
                                && data.props.ctx.phase === "placeCoinsUline"
                                && j === data.props.G.currentTavern + 1)) {
                            DrawCoin(data, playerCells, "back-tavern-icon",
                                data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.props.G.publicPlayers[p], null, j,
                                "OnClickBoardCoin", j);
                        } else {
                            DrawCoin(data, playerCells, "back-tavern-icon",
                                data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.props.G.publicPlayers[p], null, j);
                        }
                    } else if (data.props.ctx.phase === "placeCoins"
                        && Number(data.props.ctx.currentPlayer) === p) {
                        DrawCoin(data, playerCells, "coin",
                            data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                            data.props.G.publicPlayers[p], null, null,
                            "OnClickBoardCoin", j);
                    } else {
                        if (data.props.G.winner.length || (data.props.ctx.phase === "placeCoinsUline" &&
                            data.props.G.currentTavern >= j - 1) || (data.props.ctx.phase !== "placeCoins"
                            && data.props.G.currentTavern >= j)) {
                            DrawCoin(data, playerCells, "coin",
                                data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.props.G.publicPlayers[p]);
                        } else {
                            DrawCoin(data, playerCells, "back",
                                data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.props.G.publicPlayers[p]);
                        }
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j = data.props.G.tavernsNum; j <= data.props.G.publicPlayers[p].boardCoins.length; j++) {
                    if (j === data.props.G.publicPlayers[p].boardCoins.length) {
                        playerFooters[p].push(
                            <th key={`${data.props.G.publicPlayers[p].nickname} priority icon`}>
                                <span style={Styles.Priority()} className="bg-priority-icon">

                                </span>
                            </th>
                        );
                        playerCells.push(
                            <td key={`${data.props.G.publicPlayers[p].nickname} priority gem`} className="bg-gray-300">
                                <span style={Styles.Priorities(data.props.G.publicPlayers[p].priority.value)}
                                      className="bg-priority">

                                </span>
                            </td>
                        );
                    } else {
                        playerFooters[p].push(
                            <th key={`${data.props.G.publicPlayers[p].nickname} exchange icon ${j}`}>
                                <span style={Styles.Exchange()} className="bg-small-market-coin">

                                </span>
                            </th>
                        );
                        const coin: ICoin | null = data.props.G.publicPlayers[p].boardCoins[coinIndex];
                        if (coin === null) {
                            if (Number(data.props.ctx.currentPlayer) === p
                                && data.props.ctx.phase !== "placeCoinsUline" && (data.props.ctx.phase === "placeCoins"
                                    || (data.props.ctx.activePlayers &&
                                        data.props.ctx.activePlayers[Number(data.props.ctx.currentPlayer)]) ===
                                    "placeTradingCoinsUline")) {
                                DrawCoin(data, playerCells, "back-small-market-coin",
                                    coin, coinIndex, data.props.G.publicPlayers[p], null,
                                    null, "OnClickBoardCoin", j);
                            } else {
                                DrawCoin(data, playerCells, "back-small-market-coin",
                                    coin, coinIndex, data.props.G.publicPlayers[p]);
                            }
                        } else if (Number(data.props.ctx.currentPlayer) === p
                            && (data.props.ctx.phase === "placeCoins" || (data.props.ctx.activePlayers
                                    && data.props.ctx.activePlayers[Number(data.props.ctx.currentPlayer)]) ===
                                "placeTradingCoinsUline")) {
                            DrawCoin(data, playerCells, "coin",
                                coin, coinIndex, data.props.G.publicPlayers[p], null,
                                null, "OnClickBoardCoin", j);
                        } else {
                            if (data.props.G.winner.length || (data.props.ctx.phase !== "placeCoins"
                                && Number(data.props.ctx.currentPlayer) === p
                                && data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern] !== null
                                && data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern]
                                    ?.isTriggerTrading)) {
                                DrawCoin(data, playerCells, "coin",
                                    coin, coinIndex, data.props.G.publicPlayers[p]);
                            } else {
                                DrawCoin(data, playerCells, "back",
                                    coin, coinIndex, data.props.G.publicPlayers[p]);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr
                key={`${data.props.G.publicPlayers[p].nickname} board coins row ${i}`}>{playerCells}</tr>);
        }
        playersBoardsCoins[p].push(
            <table className="mx-auto" key={`${data.props.G.publicPlayers[p].nickname} board coins`}>
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
            </table>
        );
    }
    return playersBoardsCoins;
};

/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element[][]} Игровые поля для пользовательских монет в руке.
 * @constructor
 */
export const DrawPlayersHandsCoins = (data: GameBoard): JSX.Element[][] => {
    const playersHandsCoins: JSX.Element[][] = [];
    for (let p: number = 0; p < data.props.ctx.numPlayers; p++) {
        const playerCells: JSX.Element[] = [];
        playersHandsCoins[p] = [];
        for (let i: number = 0; i < 1; i++) {
            for (let j: number = 0; j < data.props.G.publicPlayers[p].handCoins.length; j++) {
                if (data.props.G.publicPlayers[p].handCoins[j] === null) {
                    playerCells.push(
                        <td key={`${data.props.G.publicPlayers[p].nickname} hand coin ${j} empty`}
                            className="bg-yellow-300">
                            <span className="bg-coin bg-yellow-300 border-2">

                            </span>
                        </td>
                    );
                } else {
                    if (Number(data.props.ctx.currentPlayer) === p || data.props.G.winner.length) {
                        let coinClasses: string = "border-2";
                        if (data.props.G.publicPlayers[p].selectedCoin === j) {
                            coinClasses = "border-2 border-green-400";
                        }
                        if (!data.props.G.winner.length && (data.props.ctx.phase === "placeCoins"
                            || data.props.ctx.phase === "placeCoinsUline" || (data.props.ctx.activePlayers
                                && data.props.ctx.activePlayers[Number(data.props.ctx.currentPlayer)]) ===
                            "placeTradingCoinsUline")) {
                            DrawCoin(data, playerCells, "coin",
                                data.props.G.publicPlayers[p].handCoins[j], j,
                                data.props.G.publicPlayers[p], coinClasses, null,
                                "OnClickHandCoin", j);
                        } else {
                            DrawCoin(data, playerCells, "coin",
                                data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p],
                                coinClasses);
                        }
                    } else {
                        DrawCoin(data, playerCells, "back",
                            data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p]);
                    }
                }
            }
        }
        playersHandsCoins[p].push(
            <table className="mx-auto" key={`${data.props.G.publicPlayers[p].nickname} hand coins`}>
                <caption>Player {p + 1} ({data.props.G.publicPlayers[p].nickname}) coins</caption>
                <tbody>
                <tr>{playerCells}</tr>
                </tbody>
            </table>
        );
    }
    return playersHandsCoins;
};

/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element[][]} Игровые поля для планшета всех карт игрока.
 * @constructor
 */
export const DrawPlayersBoards = (data: GameBoard): JSX.Element[][] => {
    const playersBoards: JSX.Element[][] = [],
        playerHeaders: JSX.Element[][] = [],
        playerHeadersCount: JSX.Element[][] = [],
        playerRows: JSX.Element[][][] = [];
    for (let p: number = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        for (const suit in suitsConfig) {
            playerHeaders[p].push(
                <th className={`${suitsConfig[suit].suitColor}`}
                    key={`${data.props.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName}`}>
                    <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">

                    </span>
                </th>
            );
            playerHeadersCount[p].push(
                <th className={`${suitsConfig[suit].suitColor} text-white`}
                    key={`${data.props.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName} count`}>
                    <b>{data.props.G.publicPlayers[p].cards[GetSuitIndexByName(suit)].reduce(TotalRank, 0)}</b>
                </th>
            );
        }
        for (let s: number = 0; s < 1 + Number(data.props.G.expansions.thingvellir.active); s++) {
            if (s === 0) {
                playerHeaders[p].push(
                    <th className="bg-gray-600" key={`${data.props.G.publicPlayers[p].nickname} hero icon`}>
                        <span style={Styles.HeroBack()} className="bg-hero-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className="bg-gray-600 text-white" key={`${data.props.G.publicPlayers[p].nickname} hero count`}>
                        <b>{data.props.G.publicPlayers[p].heroes.length}</b>
                    </th>
                );
            } else {
                playerHeaders[p].push(
                    <th className="bg-yellow-200" key={`${data.props.G.publicPlayers[p].nickname} camp icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className="bg-yellow-200 text-white"
                        key={`${data.props.G.publicPlayers[p].nickname} camp counts`}>
                        <b>{data.props.G.publicPlayers[p].campCards.length}</b>
                    </th>
                );
            }
        }
        for (let i: number = 0; ; i++) {
            const playerCells: JSX.Element[] = [];
            let isDrawRow: boolean = false,
                id: number = 0;
            playerRows[p][i] = [];
            for (let j: number = 0; j < data.props.G.suitsNum; j++) {
                const suit: string = Object.keys(suitsConfig)[j];
                id = i + j;
                if (data.props.G.publicPlayers[p].cards[j] !== undefined
                    && data.props.G.publicPlayers[p].cards[j][i] !== undefined) {
                    isDrawRow = true;
                    DrawCard(data, playerCells, data.props.G.publicPlayers[p].cards[j][i], id,
                        data.props.G.publicPlayers[p], suit);
                } else {
                    playerCells.push(
                        <td key={`${data.props.G.publicPlayers[p].nickname} empty card ${id}`}>

                        </td>
                    );
                }
            }
            for (let k: number = 0; k < 1 + Number(data.props.G.expansions.thingvellir.active); k++) {
                id += k + 1;
                if (k === 0) {
                    // todo Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (data.props.G.publicPlayers[p].heroes[i] !== undefined &&
                        (!data.props.G.publicPlayers[p].heroes[i].suit &&
                            !((data.props.G.publicPlayers[p].heroes[i].name === "Ylud"
                                    && data.props.G.publicPlayers[p].cards.flat()
                                        .findIndex((card: { name: string }): boolean => card.name === "Ylud") !== -1)
                                || (data.props.G.publicPlayers[p].heroes[i].name === "Thrud"
                                    && data.props.G.publicPlayers[p].cards.flat()
                                        .findIndex((card: { name: string }): boolean =>
                                            card.name === "Thrud") !== -1)))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.props.G.publicPlayers[p].heroes[i], id,
                            data.props.G.publicPlayers[p]);
                    } else {
                        playerCells.push(
                            <td key={`${data.props.G.publicPlayers[p].nickname} hero ${i}`}>

                            </td>
                        );
                    }
                } else {
                    if (data.props.G.publicPlayers[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.props.G.publicPlayers[p].campCards[i], id,
                            data.props.G.publicPlayers[p]);
                    } else {
                        playerCells.push(
                            <td key={`${data.props.G.publicPlayers[p].nickname} camp card ${i}`}>

                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(
                    <tr key={`${data.props.G.publicPlayers[p].nickname} board row ${i}`}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards[p].push(
            <table className="mx-auto" key={`${data.props.G.publicPlayers[p].nickname} board`}>
                <caption>Player {p + 1} ({data.props.G.publicPlayers[p].nickname})
                    cards, {data.props.G.winner.length ? `Final: ${data.props.G.totalScore[p]}` :
                        CurrentScoring(data.props.G.publicPlayers[p])} points
                </caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                <tr>{playerHeadersCount[p]}</tr>
                </thead>
                <tbody>{playerRows[p]}</tbody>
            </table>
        );
    }
    return playersBoards;
};
