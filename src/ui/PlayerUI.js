import React from "react";
import {Scoring} from "../Game";
import {suitsConfigArray} from "../data/SuitData";
import {tavernsConfig} from "../Tavern";

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
                        <th key={`${i}${j}`}>
                            <span style={{background: tavernsConfig[j].style}} className="tavern">

                            </span>
                        </th>
                    );
                    if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                        if (Number(data.props.ctx.currentPlayer) === p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}
                                    onClick={() => data.OnClickBoardCoin(j)}>
                                    <span
                                        style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                        className="coin">
                                        {/*todo fix it*/}
                                        <span style={{background: tavernsConfig[j].style}} className="coin">

                                        </span>
                                    </span>
                                </td>
                            );
                        } else {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}>
                                    <span
                                        style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                        className="coin">
                                        {/*todo fix it*/}
                                        <span style={{background: tavernsConfig[j].style}} className="coin">

                                        </span>
                                    </span>
                                </td>
                            );
                        }
                    } else if (data.props.ctx.phase === 'placeCoins' && Number(data.props.ctx.currentPlayer) !== p) {
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <span style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                      className="tavern">

                                </span>
                            </td>
                        );
                    } else {
                        if (Number(data.props.ctx.currentPlayer) === p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                    <img className="coin"
                                         src={`/img/coins/Coin${data.props.G.players[p].boardCoins[coinIndex].value}${data.props.G.players[p].boardCoins[coinIndex].isInitial
                                             ? "Initial" : ""}.jpg`}
                                         alt={data.props.G.players[p].boardCoins[coinIndex].value}/>
                                </td>
                            );
                        } else {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}>
                                    <img className="coin"
                                         src={`/img/coins/Coin${data.props.G.players[p].boardCoins[coinIndex].value}${data.props.G.players[p].boardCoins[coinIndex].isInitial
                                             ? "Initial" : ""}.jpg`}
                                         alt={data.props.G.players[p].boardCoins[coinIndex].value}/>
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
                            <th key={`${i}${j}`}>
                                <span
                                    style={{background: "url(/img/priorities/Priority.png) no-repeat -35px -5px / 64px 36px"}}
                                    className="tavern">

                                </span>
                            </th>
                        );
                        playerCells.push(
                            <td key={j}>
                                <img className="priority"
                                     src={`/img/priorities/Priority${data.props.G.players[p].priority.value}.png`}
                                     alt={`Priority ${data.props.G.players[p].priority.value}`}/>
                            </td>
                        );
                    } else {
                        playerFooters[p].push(
                            <th key={j}>
                                <span
                                    style={{background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px"}}
                                    className="market-coin">

                                </span>
                            </th>
                        );
                        if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                            if (Number(data.props.ctx.currentPlayer) === p) {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}
                                        onClick={() => data.OnClickBoardCoin(j)}>
                                        <span
                                            style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                            className="coin font-bold text-xl">
                                            <span
                                                style={{background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px"}}
                                                className="market-coin">

                                            </span>
                                        </span>
                                    </td>
                                );
                            } else {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}>
                                        <span
                                            style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                            className="coin font-bold text-xl">
                                        <span
                                            style={{background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px"}}
                                            className="market-coin">

                                        </span>
                                        </span>
                                    </td>
                                );
                            }
                        } else if (data.props.ctx.phase === 'placeCoins' && Number(data.props.ctx.currentPlayer) !== p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}
                                    onClick={() => data.OnClickBoardCoin(j)}>
                                    <img className="coin" src={`/img/coins/CoinBack.png`} alt="Coin Back"/>
                                </td>
                            );
                        } else {
                            if (Number(data.props.ctx.currentPlayer) === p) {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}
                                        onClick={() => data.OnClickBoardCoin(j)}>
                                        <img className="coin"
                                             src={`/img/coins/Coin${data.props.G.players[p].boardCoins[j].value}${data.props.G.players[p].boardCoins[j].isInitial ? "Initial" : ""}.jpg`}
                                             alt={data.props.G.players[p].boardCoins[j].value}/>
                                    </td>
                                );
                            } else {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}>
                                        <img className="coin"
                                             src={`/img/coins/Coin${data.props.G.players[p].boardCoins[j].value}${data.props.G.players[p].boardCoins[j].isInitial ? "Initial" : ""}.jpg`}
                                             alt={data.props.G.players[p].boardCoins[j].value}/>
                                    </td>
                                );
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr key={i}>{playerCells}</tr>)
        }
        playersBoardsCoins[p].push(
            <table className="col-span-3" key={p}>
                <caption>
                    Player {p + 1} played coins
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

export const DrawPlayersBoards = (data) => {
    const playersBoards = [],
        playerHeaders = [],
        playerRows = [],
        expansion = data.props.G.expansions.thingvellir.active ? 1 : 0;
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (let s = 0; s < data.props.G.suitsNum + 1 + expansion; s++) {
            if (s < data.props.G.suitsNum) {
                playerHeaders[p].push(
                    <th className={suitsConfigArray[s].suitColor} key={s}>
                        <img className="block m-auto w-6" src={`/img/suits/${suitsConfigArray[s].suitName}.png`}
                             alt={suitsConfigArray[s].suitName}/>
                    </th>
                );
            } else if (s === data.props.G.suitsNum) {
                playerHeaders[p].push(
                    <th className="bg-gray-600" key={s}>
                        <img className="block m-auto w-4" src={`/img/cards/heroes/HeroBack.png`} alt="Hero"/>
                    </th>
                );
            } else if (expansion && s < data.props.G.suitsNum + 1 + expansion) {
                playerHeaders[p].push(
                    <th className="bg-yellow-200" key={s}>
                        <img className="block m-auto w-8" src={`/img/cards/camp/Camp.png`} alt="Camp"/>
                    </th>
                );
            }
        }
        for (let i = 0; ; i++) {
            const playerCells = [];
            let isDrawRow = false;
            playerRows[p][i] = [];
            for (let j = 0; j < data.props.G.suitsNum + 1 + expansion; j++) {
                const id = i + j;
                const isNotCard = data.props.G.players[p].cards[j] !== undefined && data.props.G.players[p].cards[j][i] === undefined;
                const isNotHero = data.props.G.players[p].heroes[i] === undefined;
                const isNotCampCard = data.props.G.players[p].campCards[i] === undefined;
                if (j < data.props.G.suitsNum) {
                    if (data.props.G.players[p].cards[j] === undefined || isNotCard || !isNotHero || !isNotCampCard) {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    } else {
                        isDrawRow = true;
                        playerCells.push(
                            <td key={id}
                                className={suitsConfigArray[j].suitColor}>
                                <b>{data.props.G.players[p].cards[j][i].points}</b>
                            </td>
                        );
                    }
                } else if (j === data.props.G.suitsNum) {
                    if (data.props.G.players[p].heroes[i] === undefined || isNotHero || !isNotCampCard || !isNotCard) {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    } else {
                        isDrawRow = true;
                        playerCells.push(
                            <td key={id}
                                className="bg-gray-600">
                                <b>{data.props.G.players[p].heroes[i].points}</b>
                            </td>
                        );
                    }
                } else if (expansion && j === data.props.G.suitsNum + expansion) {
                    if (data.props.G.players[p].campCards[i] === undefined || isNotCampCard || !isNotCard || !isNotHero) {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    } else {
                        isDrawRow = true;
                        playerCells.push(
                            <td className="bg-yellow-200" key={id}>
                                <b>{data.props.G.players[p].campCards[i].points}</b>
                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(
                    <tr key={i}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards[p].push(
            <table className="col-span-3" key={p}>
                <caption>Player {p + 1} cards, {Scoring(data.props.G.players[p])} points</caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>{playerRows[p]}</tbody>
            </table>
        );
    }
    return playersBoards;
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
                            <span className="coin border">

                            </span>
                        </td>
                    );
                } else {
                    if (Number(data.props.ctx.currentPlayer) === p) {
                        // todo fix it
                        let coinClass = "border";
                        if (data.props.G.players[p].selectedCoin === j) {
                            coinClass = "border-2 border-green-400";
                        }
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickHandCoin(j)}>
                                <img className={`coin ${coinClass}`}
                                     src={`/img/coins/Coin${data.props.G.players[p].handCoins[j].value}${data.props.G.players[p].handCoins[j].isInitial ? "Initial" : ""}.jpg`}
                                     alt={data.props.G.players[p].handCoins[j].value}/>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="cursor-pointer" key={j}>
                                <img className="coin" src={`/img/coins/CoinBack.jpg`} alt="Coin Back"/>
                            </td>
                        );
                    }
                }
            }
        }
        playersHandsCoins[p].push(
            <table className="col-span-3" key={p}>
                <caption>Player {p + 1} coins</caption>
                <tbody>
                <tr>{playerCells}</tr>
                </tbody>
            </table>
        );
    }
    return playersHandsCoins;
};
