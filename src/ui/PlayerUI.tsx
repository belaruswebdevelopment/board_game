import { BoardProps } from "boardgame.io/react";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { TotalRank } from "../helpers/ScoreHelpers";
import { DrawCard, DrawCoin } from "../helpers/UIElementHelpers";
import { CurrentScoring } from "../Score";
import { tavernsConfig } from "../Tavern";
import { PlayerCardsType } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { HeroNames, MoveNames, Phases, Stages } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";

/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Игровые поля для планшета всех карт игрока.
 * @constructor
 */
export const DrawPlayersBoards = (data: BoardProps<IMyGameState>): JSX.Element[][] => {
    const playersBoards: JSX.Element[][] = [],
        playerHeaders: JSX.Element[][] = [],
        playerHeadersCount: JSX.Element[][] = [],
        playerRows: JSX.Element[][][] = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                playerHeaders[p].push(
                    <th className={`${suitsConfig[suit].suitColor}`}
                        key={`${data.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName}`}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className={`${suitsConfig[suit].suitColor} text-white`}
                        key={`${data.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName} count`}>
                        <b>{data.G.publicPlayers[p].cards[suit].reduce(TotalRank, 0)}</b>
                    </th>
                );
            }
        }
        for (let s = 0; s < 1 + Number(data.G.expansions.thingvellir.active); s++) {
            if (s === 0) {
                playerHeaders[p].push(
                    <th className="bg-gray-600" key={`${data.G.publicPlayers[p].nickname} hero icon`}>
                        <span style={Styles.HeroBack()} className="bg-hero-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className="bg-gray-600 text-white"
                        key={`${data.G.publicPlayers[p].nickname} hero count`}>
                        <b>{data.G.publicPlayers[p].heroes.length}</b>
                    </th>
                );
            } else {
                playerHeaders[p].push(
                    <th className="bg-yellow-200" key={`${data.G.publicPlayers[p].nickname} camp icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className="bg-yellow-200 text-white"
                        key={`${data.G.publicPlayers[p].nickname} camp counts`}>
                        <b>{data.G.publicPlayers[p].campCards.length}</b>
                    </th>
                );
            }
        }
        for (let i = 0; ; i++) {
            const playerCells: JSX.Element[] = [];
            let isDrawRow = false,
                id = 0,
                j = 0;
            playerRows[p][i] = [];
            for (const suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    if (data.G.publicPlayers[p].cards[suit][i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.G.publicPlayers[p].cards[suit][i], id,
                            data.G.publicPlayers[p], suit);
                    } else {
                        playerCells.push(
                            <td key={`${data.G.publicPlayers[p].nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                    j++;
                }
            }
            for (let k = 0; k < 1 + Number(data.G.expansions.thingvellir.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards: PlayerCardsType[] = Object.values(data.G.publicPlayers[p].cards).flat();
                    // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (data.G.publicPlayers[p].heroes[i] !== undefined && (!data.G.publicPlayers[p].heroes[i].suit
                        && !((data.G.publicPlayers[p].heroes[i].name === HeroNames.Ylud
                            && playerCards.findIndex((card: { name: string; }): boolean =>
                                card.name === HeroNames.Ylud) !== -1)
                            || (data.G.publicPlayers[p].heroes[i].name === HeroNames.Thrud
                                && playerCards.findIndex((card: { name: string; }): boolean =>
                                    card.name === HeroNames.Thrud) !== -1)))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.G.publicPlayers[p].heroes[i], id,
                            data.G.publicPlayers[p]);
                    } else {
                        playerCells.push(
                            <td key={`${data.G.publicPlayers[p].nickname} hero ${i}`}>

                            </td>
                        );
                    }
                } else {
                    if (data.G.publicPlayers[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, data.G.publicPlayers[p].campCards[i], id,
                            data.G.publicPlayers[p]);
                    } else {
                        playerCells.push(
                            <td key={`${data.G.publicPlayers[p].nickname} camp card ${i}`}>

                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(
                    <tr key={`${data.G.publicPlayers[p].nickname} board row ${i}`}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards[p].push(
            <table className="mx-auto" key={`${data.G.publicPlayers[p].nickname} board`}>
                <caption>Player {p + 1} ({data.G.publicPlayers[p].nickname}) cards, {data.G.winner.length ? `Final: ${data.G.totalScore[p]}` : CurrentScoring(data.G.publicPlayers[p])} points
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

/**
 * <h3>Отрисовка планшета монет, выложенных игроком на стол.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет на столе.
 * @constructor
 */
export const DrawPlayersBoardsCoins = (data: BoardProps<IMyGameState>): JSX.Element[][] => {
    // TODO Your coins always public for you only, others private, but you see previous/current tavern coins for all players (and your's transparent for non opened coins)
    const playersBoardsCoins: JSX.Element[][] = [],
        playerHeaders: JSX.Element[][] = [],
        playerFooters: JSX.Element[][] = [],
        playerRows: JSX.Element[][][] = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        let coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
        playerRows[p] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells: JSX.Element[] = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (let j = 0; j < data.G.tavernsNum; j++) {
                    playerHeaders[p].push(
                        <th key={`Tavern ${tavernsConfig[j].name}`}>
                            <span style={Styles.Taverns(j)} className="bg-tavern-icon">

                            </span>
                        </th>
                    );
                    if (data.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                        if ((Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins)
                            || (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoinsUline
                                && j === data.G.currentTavern + 1)) {
                            DrawCoin(data, playerCells, `back-tavern-icon`,
                                data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.G.publicPlayers[p], null, j,
                                MoveNames.ClickBoardCoinMove, j);
                        } else {
                            DrawCoin(data, playerCells, `back-tavern-icon`,
                                data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.G.publicPlayers[p], null, j);
                        }
                    } else if (data.ctx.phase === Phases.PlaceCoins && Number(data.ctx.currentPlayer) === p) {
                        DrawCoin(data, playerCells, `coin`,
                            data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                            data.G.publicPlayers[p], null, null,
                            MoveNames.ClickBoardCoinMove, j);
                    } else {
                        if (data.G.winner.length || (data.ctx.phase === Phases.PlaceCoinsUline
                            && data.G.currentTavern >= j - 1) || (data.ctx.phase !== Phases.PlaceCoins
                                && data.G.currentTavern >= j)) {
                            DrawCoin(data, playerCells, `coin`,
                                data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.G.publicPlayers[p]);
                        } else {
                            DrawCoin(data, playerCells, `back`,
                                data.G.publicPlayers[p].boardCoins[coinIndex], coinIndex,
                                data.G.publicPlayers[p]);
                        }
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j: number = data.G.tavernsNum; j <= data.G.publicPlayers[p].boardCoins.length; j++) {
                    if (j === data.G.publicPlayers[p].boardCoins.length) {
                        playerFooters[p].push(
                            <th key={`${data.G.publicPlayers[p].nickname} priority icon`}>
                                <span style={Styles.Priority()} className="bg-priority-icon">

                                </span>
                            </th>
                        );
                        playerCells.push(
                            <td key={`${data.G.publicPlayers[p].nickname} priority gem`}
                                className="bg-gray-300">
                                <span style={Styles.Priorities(data.G.publicPlayers[p].priority.value)}
                                    className="bg-priority">

                                </span>
                            </td>
                        );
                    } else {
                        playerFooters[p].push(
                            <th key={`${data.G.publicPlayers[p].nickname} exchange icon ${j}`}>
                                <span style={Styles.Exchange()} className="bg-small-market-coin">

                                </span>
                            </th>
                        );
                        const coin: CoinType = data.G.publicPlayers[p].boardCoins[coinIndex];
                        if (coin === null) {
                            if (Number(data.ctx.currentPlayer) === p && data.ctx.phase !== Phases.PlaceCoinsUline
                                && (data.ctx.phase === Phases.PlaceCoins || (data.ctx.activePlayers
                                    && data.ctx.activePlayers[Number(data.ctx.currentPlayer)] ===
                                    Stages.PlaceTradingCoinsUline))) {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin,
                                    coinIndex, data.G.publicPlayers[p], null,
                                    null, MoveNames.ClickBoardCoinMove,
                                    j);
                            } else {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex,
                                    data.G.publicPlayers[p]);
                            }
                        } else if (Number(data.ctx.currentPlayer) === p
                            && (data.ctx.phase === Phases.PlaceCoins || (data.ctx.activePlayers
                                && data.ctx.activePlayers[Number(data.ctx.currentPlayer)] ===
                                Stages.PlaceTradingCoinsUline))) {
                            DrawCoin(data, playerCells, `coin`, coin, coinIndex,
                                data.G.publicPlayers[p], null, null,
                                MoveNames.ClickBoardCoinMove, j);
                        } else {
                            if (data.G.winner.length || (data.ctx.phase !== Phases.PlaceCoins
                                && Number(data.ctx.currentPlayer) === p
                                && data.G.publicPlayers[p].boardCoins[data.G.currentTavern] !== null
                                && data.G.publicPlayers[p].boardCoins[data.G.currentTavern]?.isTriggerTrading)) {
                                DrawCoin(data, playerCells, `coin`, coin, coinIndex,
                                    data.G.publicPlayers[p]);
                            } else {
                                DrawCoin(data, playerCells, `back`, coin, coinIndex,
                                    data.G.publicPlayers[p]);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr
                key={`${data.G.publicPlayers[p].nickname} board coins row ${i}`}>{playerCells}</tr>);
        }
        playersBoardsCoins[p].push(
            <table className="mx-auto" key={`${data.G.publicPlayers[p].nickname} board coins`}>
                <caption>
                    Player {p + 1} ({data.G.publicPlayers[p].nickname}) played coins
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
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет в руке.
 * @constructor
 */
export const DrawPlayersHandsCoins = (data: BoardProps<IMyGameState>): JSX.Element[][] => {
    // TODO Your coins always public for you only, others always private!
    const playersHandsCoins: JSX.Element[][] = [];
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const playerCells: JSX.Element[] = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.G.publicPlayers[p].handCoins.length; j++) {
                if (data.G.publicPlayers[p].handCoins[j] === null) {
                    playerCells.push(
                        <td key={`${data.G.publicPlayers[p].nickname} hand coin ${j} empty`}
                            className="bg-yellow-300">
                            <span className="bg-coin bg-yellow-300 border-2">

                            </span>
                        </td>
                    );
                } else {
                    if (Number(data.ctx.currentPlayer) === p || data.G.winner.length) {
                        let coinClasses = `border-2`;
                        if (data.G.publicPlayers[p].selectedCoin === j) {
                            coinClasses = `border-2 border-green-400`;
                        }
                        if (!data.G.winner.length && (data.ctx.phase === Phases.PlaceCoins
                            || data.ctx.phase === Phases.PlaceCoinsUline || (data.ctx.activePlayers
                                && data.ctx.activePlayers[Number(data.ctx.currentPlayer)] ===
                                Stages.PlaceTradingCoinsUline))) {
                            DrawCoin(data, playerCells, `coin`, data.G.publicPlayers[p].handCoins[j], j,
                                data.G.publicPlayers[p], coinClasses, null,
                                MoveNames.ClickHandCoinMove, j);
                        } else {
                            DrawCoin(data, playerCells, `coin`, data.G.publicPlayers[p].handCoins[j], j,
                                data.G.publicPlayers[p], coinClasses);
                        }
                    } else {
                        DrawCoin(data, playerCells, `back`,
                            data.G.publicPlayers[p].handCoins[j], j, data.G.publicPlayers[p]);
                    }
                }
            }
        }
        playersHandsCoins[p].push(
            <table className="mx-auto" key={`${data.G.publicPlayers[p].nickname} hand coins`}>
                <caption>Player {p + 1} ({data.G.publicPlayers[p].nickname}) coins</caption>
                <tbody>
                    <tr>{playerCells}</tr>
                </tbody>
            </table>
        );
    }
    return playersHandsCoins;
};
