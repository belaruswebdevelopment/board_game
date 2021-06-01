import React from "react";
import {suitsConfigArray} from "../data/SuitData";
import {tavernsConfig} from "../Tavern";
import {CurrentScoring, FinalScoring} from "../Score";
import {Styles} from "../data/StyleData";

export const DrawPlayersBoardsCoins = (data) => {
    const playersBoardsCoins = [],
        playerHeaders = [],
        playerFooters = [],
        playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        let coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
        playerRows[p] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (let j = 0; j < data.props.G.taverns.length; j++) {
                    playerHeaders[p].push(
                        <th key={tavernsConfig[j].name}>
                            <span style={Styles.Taverns(j)} className="bg-tavern-icon">

                            </span>
                        </th>
                    );
                    // todo CLEANUP & Open only current taverns coins!
                    if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                        if (Number(data.props.ctx.currentPlayer) === p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={`player${p} tavernsConfig[j].${tavernsConfig[j].name} empty`}
                                    onClick={() => data.OnClickBoardCoin(j)}>
                                    <span style={Styles.CoinBack()} className="bg-coin">
                                        <span style={Styles.Taverns(j)} className="bg-tavern-icon">

                                        </span>
                                    </span>
                                </td>
                            );
                        } else {
                            playerCells.push(
                                <td className="cursor-pointer" key={`player${p} tavernsConfig[j].${tavernsConfig[j].name} coin`}>
                                    <span style={Styles.CoinBack()} className="bg-coin">
                                        <span style={Styles.Taverns(j)} className="bg-tavern-icon">

                                        </span>
                                    </span>
                                </td>
                            );
                        }
                    } else if (data.props.ctx.phase === "placeCoins" && Number(data.props.ctx.currentPlayer) !== p) {
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <span style={Styles.CoinBack()} className="bg-coin">

                                </span>
                            </td>
                        );
                    } else {
                        if (Number(data.props.ctx.currentPlayer) === p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                    <span style={Styles.Coin(data.props.G.players[p].boardCoins[coinIndex].value,
                                        data.props.G.players[p].boardCoins[coinIndex].isInitial)}
                                        className="bg-coin">

                                    </span>
                                </td>
                            );
                        } else {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}>
                                    <span
                                        style={Styles.Coin(data.props.G.players[p].boardCoins[coinIndex].value,
                                            data.props.G.players[p].boardCoins[coinIndex].isInitial)}
                                        className="bg-coin">

                                    </span>
                                </td>
                            );
                        }
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j = data.props.G.taverns.length; j <= data.props.G.players[p].boardCoins.length; j++) {
                    if (j === data.props.G.players[p].boardCoins.length) {
                        playerFooters[p].push(
                            <th key={`${data.props.G.players[p].nickname} priority icon`}>
                                <span style={Styles.Priority()} className="bg-priority-icon">

                                </span>
                            </th>
                        );
                        playerCells.push(
                            <td key={`${data.props.G.players[p].nickname} priority gem`}>
                                <span style={Styles.Priorities(data.props.G.players[p].priority.value)} className="bg-priority">

                                </span>
                            </td>
                        );
                    } else {
                        playerFooters[p].push(
                            <th key={`${data.props.G.players[p].nickname} exchange icon ${j}`}>
                                <span style={Styles.Exchange()} className="bg-small-market-coin">

                                </span>
                            </th>
                        );
                        if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                            if (Number(data.props.ctx.currentPlayer) === p) {
                                playerCells.push(
                                    <td className="cursor-pointer" key={`${data.props.G.players[p].nickname} exchange coin ${j}`}
                                        onClick={() => data.OnClickBoardCoin(j)}>
                                        <span style={Styles.CoinBack()} className="bg-coin">
                                            <span style={Styles.Exchange()} className="bg-small-market-coin">

                                            </span>
                                        </span>
                                    </td>
                                );
                            } else {
                                playerCells.push(
                                    <td key={j}>
                                        <span style={Styles.CoinBack()} className="bg-coin">
                                        <span style={Styles.Exchange()} className="bg-small-market-coin">

                                        </span>
                                        </span>
                                    </td>
                                );
                            }
                        } else if (data.props.ctx.phase === "placeCoins" && Number(data.props.ctx.currentPlayer) !== p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}
                                    onClick={() => data.OnClickBoardCoin(j)}>
                                    <span style={Styles.CoinBack()} className="bg-coin">

                                    </span>
                                </td>
                            );
                        } else {
                            if (Number(data.props.ctx.currentPlayer) === p) {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}
                                        onClick={() => data.OnClickBoardCoin(j)}>
                                        <span style={Styles.Coin(data.props.G.players[p].boardCoins[coinIndex].value,
                                                data.props.G.players[p].boardCoins[coinIndex].isInitial)}
                                            className="bg-coin">

                                        </span>
                                    </td>
                                );
                            } else {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}>
                                        <span style={Styles.Coin(data.props.G.players[p].boardCoins[coinIndex].value,
                                            data.props.G.players[p].boardCoins[coinIndex].isInitial)}
                                            className="bg-coin">

                                        </span>
                                    </td>
                                );
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr key={`${data.props.G.players[p].nickname} board coins row ${i}`}>{playerCells}</tr>)
        }
        playersBoardsCoins[p].push(
            <table className="mx-auto" key={`${data.props.G.players[p].nickname} board coins`}>
                <caption>
                    Player {p + 1} ({data.props.G.players[p].nickname}) played coins
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

export const DrawPlayersHandsCoins = (data) => {
    const playersHandsCoins = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        const playerCells = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.props.G.players[p].handCoins.length; j++) {
                if (data.props.G.players[p].handCoins[j] === null) {
                    playerCells.push(
                        <td key={j}>
                            <span className="bg-coin bg-yellow-300 border-2">

                            </span>
                        </td>
                    );
                } else {
                    if (Number(data.props.ctx.currentPlayer) === p) {
                        let coinClass = "border-2";
                        if (data.props.G.players[p].selectedCoin === j) {
                            coinClass = "border-2 border-green-400";
                        }
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickHandCoin(j)}>
                                <span style={Styles.Coin(data.props.G.players[p].handCoins[j].value,
                                    data.props.G.players[p].handCoins[j].isInitial)}
                                    className={`bg-coin ${coinClass}`}>

                                </span>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="cursor-pointer" key={j}>
                                <span style={Styles.CoinBack()} className="bg-coin">

                                </span>
                            </td>
                        );
                    }
                }
            }
        }
        playersHandsCoins[p].push(
            <table className="mx-auto" key={`${data.props.G.players[p].nickname} hand coins`}>
                <caption>Player {p + 1} ({data.props.G.players[p].nickname}) coins</caption>
                <tbody>
                <tr>{playerCells}</tr>
                </tbody>
            </table>
        );
    }
    return playersHandsCoins;
};

export const DrawPlayersBoards = (data) => {
    const playersBoards = [],
        playerHeaders = [],
        playerRows = [],
        expansion = data.props.G.expansions.thingvellir.active ? 1 : 0;
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (const suit in suitsConfigArray) {
            playerHeaders[p].push(
                <th className={`${suitsConfigArray[suit].suitColor}`} key={`${data.props.G.players[p].nickname} ${suitsConfigArray[suit].suitName}`}>
                        <span style={Styles.Suits(suitsConfigArray[suit].suitName)} className="bg-suit-icon">

                        </span>
                </th>
            );
        }
        for (let s = 0; s < 1 + expansion; s++) {
           if (s === 0) {
                playerHeaders[p].push(
                    <th className="bg-gray-600" key={`${data.props.G.players[p].nickname} hero icon`}>
                        <span style={Styles.HeroBack()} className="bg-hero-icon">

                        </span>
                    </th>
                );
            } else {
                playerHeaders[p].push(
                    <th className="bg-yellow-200" key={`${data.props.G.players[p].nickname} camp icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </th>
                );
            }
        }
        for (let i = 0; ; i++) {
            const playerCells = [];
            let isDrawRow = false,
            j = 0,
            id = 0;
            playerRows[p][i] = [];
            for (const suit in suitsConfigArray) {
                id = i + j;
                if (data.props.G.players[p].cards[j] !== undefined && data.props.G.players[p].cards[j][i] !== undefined) {
                    isDrawRow = true;
                    playerCells.push(
                        <td key={id} className={suitsConfigArray[suit].suitColor}>
                            <b>{data.props.G.players[p].cards[j][i].points}</b>
                        </td>
                    );
                } else {
                    playerCells.push(
                        <td key={id}>

                        </td>
                    );
                }
                j++;
            }
            for (let k = 0; k < 1 + expansion; k++) {
                id += k + 1;
                if (k === 1) {
                    if (data.props.G.players[p].heroes[i] !== undefined) {
                        isDrawRow = true;
                        playerCells.push(
                            <td key={id}
                                className="bg-gray-600">
                                <b>{data.props.G.players[p].heroes[i]}</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    }
                } else {
                    if (data.props.G.players[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        playerCells.push(
                            <td className="bg-yellow-200" key={id}>
                                <b>{data.props.G.players[p].campCards[i].points}</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(
                    <tr key={`${data.props.G.players[p].nickname} board row ${i}`}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards[p].push(
            <table className="mx-auto" key={`${data.props.G.players[p].nickname} board`}>
                <caption>Player {p + 1} ({data.props.G.players[p].nickname}) cards, {data.props.G.winner !== null ?
                        "Final: " + FinalScoring(data.props.G, data.props.ctx, data.props.G.players[p], CurrentScoring(data.props.G.players[p])) :
                        CurrentScoring(data.props.G.players[p])} points</caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>{playerRows[p]}</tbody>
            </table>
        );
    }
    return playersBoards;
};
