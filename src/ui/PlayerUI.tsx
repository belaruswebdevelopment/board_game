import { BoardProps } from "boardgame.io/react";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { HeroNames, MoveNames, Phases, Stages } from "../typescript/enums";
import { CoinType, IMyGameState, IPublicPlayer, PlayerCardsType, SuitTypes } from "../typescript/interfaces";
import { DrawCard, DrawCoin } from "./ElementsUI";

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
        const player: IPublicPlayer = data.G.publicPlayers[p];
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        let suit: SuitTypes;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                playerHeaders[p].push(
                    <th className={`${suitsConfig[suit].suitColor}`}
                        key={`${player.nickname} ${suitsConfig[suit].suitName}`}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className={`${suitsConfig[suit].suitColor} text-white`}
                        key={`${player.nickname} ${suitsConfig[suit].suitName} count`}>
                        <b>{player.cards[suit].reduce(TotalRank, 0)}</b>
                    </th>
                );
            }
        }
        for (let s = 0; s < 1 + Number(data.G.expansions.thingvellir.active); s++) {
            if (s === 0) {
                playerHeaders[p].push(
                    <th className="bg-gray-600" key={`${player.nickname} hero icon`}>
                        <span style={Styles.HeroBack()} className="bg-hero-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className="bg-gray-600 text-white"
                        key={`${player.nickname} hero count`}>
                        <b>{player.heroes.length}</b>
                    </th>
                );
            } else {
                playerHeaders[p].push(
                    <th className="bg-yellow-200" key={`${player.nickname} camp icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </th>
                );
                playerHeadersCount[p].push(
                    <th className="bg-yellow-200 text-white"
                        key={`${player.nickname} camp counts`}>
                        <b>{player.campCards.length}</b>
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
            let suit: SuitTypes;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    if (player.cards[suit][i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.cards[suit][i], id, player, suit);
                    } else {
                        playerCells.push(
                            <td key={`${player.nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                    j++;
                }
            }
            for (let k = 0; k < 1 + Number(data.G.expansions.thingvellir.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards: PlayerCardsType[] = Object.values(player.cards).flat();
                    // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (player.heroes[i] !== undefined && (!player.heroes[i].suit
                        && !((player.heroes[i].name === HeroNames.Ylud
                            && playerCards.findIndex((card: { name: string, }): boolean =>
                                card.name === HeroNames.Ylud) !== -1)
                            || (player.heroes[i].name === HeroNames.Thrud
                                && playerCards.findIndex((card: { name: string; }): boolean =>
                                    card.name === HeroNames.Thrud) !== -1)))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.heroes[i], id, player);
                    } else {
                        playerCells.push(
                            <td key={`${player.nickname} hero ${i}`}>

                            </td>
                        );
                    }
                } else {
                    if (player.campCards[i] !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, player.campCards[i], id, player);
                    } else {
                        playerCells.push(
                            <td key={`${player.nickname} camp card ${i}`}>

                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(
                    <tr key={`${player.nickname} board row ${i}`}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards[p].push(
            <table className="mx-auto" key={`${player.nickname} board`}>
                <caption>Player {p + 1} ({player.nickname}) cards, {data.G.winner.length ? `Final: ${data.G.totalScore[p]}` : CurrentScoring(player)} points
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
        const player: IPublicPlayer = data.G.publicPlayers[p];
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
                    if (player.boardCoins[coinIndex] === null) {
                        if (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins) {
                            DrawCoin(data, playerCells, `back-tavern-icon`,
                                player.boardCoins[coinIndex], coinIndex, player, null,
                                j, MoveNames.ClickBoardCoinMove, j);
                        } else {
                            DrawCoin(data, playerCells, `back-tavern-icon`, player.boardCoins[coinIndex],
                                coinIndex, player, null, j);
                        }
                    } else if (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins) {
                        DrawCoin(data, playerCells, `coin`, player.boardCoins[coinIndex], coinIndex,
                            player, null, null, MoveNames.ClickBoardCoinMove,
                            j);
                    } else {
                        if (data.G.winner.length
                            || (data.ctx.phase !== Phases.PlaceCoins && data.G.currentTavern >= j)) {
                            DrawCoin(data, playerCells, `coin`, player.boardCoins[coinIndex], coinIndex,
                                player);
                        } else {
                            DrawCoin(data, playerCells, `back`, player.boardCoins[coinIndex], coinIndex,
                                player);
                        }
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j: number = data.G.tavernsNum; j <= player.boardCoins.length; j++) {
                    if (j === player.boardCoins.length) {
                        playerFooters[p].push(
                            <th key={`${player.nickname} priority icon`}>
                                <span style={Styles.Priority()} className="bg-priority-icon">

                                </span>
                            </th>
                        );
                        playerCells.push(
                            <td key={`${player.nickname} priority gem`}
                                className="bg-gray-300">
                                <span style={Styles.Priorities(player.priority.value)}
                                    className="bg-priority">

                                </span>
                            </td>
                        );
                    } else {
                        playerFooters[p].push(
                            <th key={`${player.nickname} exchange icon ${j}`}>
                                <span style={Styles.Exchange()} className="bg-small-market-coin">

                                </span>
                            </th>
                        );
                        const coin: CoinType = player.boardCoins[coinIndex];
                        if (coin === null) {
                            if (Number(data.ctx.currentPlayer) === p && data.ctx.phase === Phases.PlaceCoins) {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex,
                                    player, null, null,
                                    MoveNames.ClickBoardCoinMove, j);
                            } else {
                                DrawCoin(data, playerCells, `back-small-market-coin`, coin, coinIndex,
                                    player);
                            }
                        } else if (Number(data.ctx.currentPlayer) === p
                            && data.ctx.phase === Phases.PlaceCoins) {
                            DrawCoin(data, playerCells, `coin`, coin, coinIndex, player, null,
                                null, MoveNames.ClickBoardCoinMove, j);
                        } else {
                            if (data.G.winner.length || (data.ctx.phase !== Phases.PlaceCoins
                                && Number(data.ctx.currentPlayer) === p
                                && player.boardCoins[data.G.currentTavern] !== null
                                && player.boardCoins[data.G.currentTavern]?.isTriggerTrading)) {
                                DrawCoin(data, playerCells, `coin`, coin, coinIndex, player);
                            } else {
                                DrawCoin(data, playerCells, `back`, coin, coinIndex, player);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr
                key={`${player.nickname} board coins row ${i}`}>{playerCells}</tr>);
        }
        playersBoardsCoins[p].push(
            <table className="mx-auto" key={`${player.nickname} board coins`}>
                <caption>
                    Player {p + 1} ({player.nickname}) played coins
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
    let moveName: string | undefined;
    switch (data.ctx.phase) {
        case Phases.PlaceCoins:
            moveName = MoveNames.ClickHandCoinMove;
            break;
        case Phases.PlaceCoinsUline:
            moveName = MoveNames.ClickHandCoinUlineMove;
            break;
        case Phases.PickCards:
            moveName = MoveNames.ClickHandTradingCoinUlineMove;
            break;
        default:
            moveName = undefined;
            break;
    }
    for (let p = 0; p < data.ctx.numPlayers; p++) {
        const player: IPublicPlayer = data.G.publicPlayers[p];
        const playerCells: JSX.Element[] = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < player.handCoins.length; j++) {
                if (player.handCoins[j] === null) {
                    playerCells.push(
                        <td key={`${player.nickname} hand coin ${j} empty`}
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
                            DrawCoin(data, playerCells, `coin`, player.handCoins[j], j, player,
                                coinClasses, null, moveName, j);
                        } else {
                            DrawCoin(data, playerCells, `coin`, player.handCoins[j], j, player,
                                coinClasses);
                        }
                    } else {
                        DrawCoin(data, playerCells, `back`, player.handCoins[j], j, player);
                    }
                }
            }
        }
        playersHandsCoins[p].push(
            <table className="mx-auto" key={`${player.nickname} hand coins`}>
                <caption>Player {p + 1} ({player.nickname}) coins</caption>
                <tbody>
                    <tr>{playerCells}</tr>
                </tbody>
            </table>
        );
    }
    return playersHandsCoins;
};
