import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { HeroNames, MoveNames, MoveValidatorNames, Phases, Stages } from "../typescript/enums";
import type { CampDeckCardTypes, CoinType, IHeroCard, IMoveArgumentsStage, IMyGameState, IPublicPlayer, ITavernInConfig, MoveValidatorTypes, PlayerCardsType, SuitTypes } from "../typescript/interfaces";
import { DrawCard, DrawCoin } from "./ElementsUI";

/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @returns Игровые поля для планшета всех карт игрока.
 * @constructor
 */
export const DrawPlayersBoards = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>): JSX.Element[] => {
    const playersBoards: JSX.Element[] = [];
    for (let p = 0; p < ctx.numPlayers; p++) {
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerHeadersCount: JSX.Element[] = [],
            player: IPublicPlayer | undefined = G.publicPlayers[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        let suit: SuitTypes;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                playerHeaders.push(
                    <th className={`${suitsConfig[suit].suitColor}`}
                        key={`${player.nickname} ${suitsConfig[suit].suitName}`}>
                        <span style={Styles.Suits(suit)} className="bg-suit-icon">

                        </span>
                    </th>
                );
                playerHeadersCount.push(
                    <th className={`${suitsConfig[suit].suitColor} text-white`}
                        key={`${player.nickname} ${suitsConfig[suit].suitName} count`}>
                        <b>{player.cards[suit].reduce(TotalRank, 0)}</b>
                    </th>
                );
            }
        }
        for (let s = 0; s < 1 + Number(G.expansions.thingvellir.active); s++) {
            if (s === 0) {
                playerHeaders.push(
                    <th className="bg-gray-600" key={`${player.nickname} hero icon`}>
                        <span style={Styles.HeroBack()} className="bg-hero-icon">

                        </span>
                    </th>
                );
                playerHeadersCount.push(
                    <th className="bg-gray-600 text-white"
                        key={`${player.nickname} hero count`}>
                        <b>{player.heroes.length}</b>
                    </th>
                );
            } else {
                playerHeaders.push(
                    <th className="bg-yellow-200" key={`${player.nickname} camp icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </th>
                );
                playerHeadersCount.push(
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
                j = 0,
                suit: SuitTypes;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    const card: PlayerCardsType | undefined = player.cards[suit][i];
                    if (card !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, card, id, player, suit);
                    } else {
                        playerCells.push(
                            <td key={`${player.nickname} empty card ${id}`}>

                            </td>
                        );
                    }
                    j++;
                }
            }
            for (let k = 0; k < 1 + Number(G.expansions.thingvellir?.active); k++) {
                id += k + 1;
                if (k === 0) {
                    const playerCards: PlayerCardsType[] = Object.values(player.cards).flat(),
                        hero: IHeroCard | undefined = player.heroes[i];
                    // TODO Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (hero !== undefined && !hero.suit
                        && !((hero.name === HeroNames.Ylud
                            && playerCards.findIndex((card: { name: string, }): boolean =>
                                card.name === HeroNames.Ylud) !== -1)
                            || (hero.name === HeroNames.Thrud
                                && playerCards.findIndex((card: { name: string; }): boolean =>
                                    card.name === HeroNames.Thrud) !== -1))) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, hero, id, player);
                    } else {
                        playerCells.push(
                            <td key={`${player.nickname} hero ${i}`}>

                            </td>
                        );
                    }
                } else {
                    const campCard: CampDeckCardTypes | undefined = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        DrawCard(data, playerCells, campCard, id, player);
                    } else {
                        playerCells.push(
                            <td key={`${player.nickname} camp card ${i}`}>

                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playerRows.push(
                    <tr key={`${player.nickname} board row ${i}`}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards.push(
            <table className="mx-auto" key={`${player.nickname} board`}>
                <caption>Player {p + 1} ({player.nickname}) cards, {G.winner.length ? `Final: ${G.totalScore[p]}` : CurrentScoring(player)} points
                </caption>
                <thead>
                    <tr>{playerHeaders}</tr>
                    <tr>{playerHeadersCount}</tr>
                </thead>
                <tbody>{playerRows}</tbody>
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
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет на столе | данные для списка доступных аргументов мува.
 * @constructor
 */
export const DrawPlayersBoardsCoins = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>): JSX.Element[] | IMoveArgumentsStage<number[]>[`args`] => {
    // TODO Your coins always public for you only, others private, but you see previous/current tavern coins for all players (and your's transparent for non opened coins)
    const playersBoardsCoins: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let p = 0; p < ctx.numPlayers; p++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerFooters: JSX.Element[] = [];
        let coinIndex = 0;
        for (let i = 0; i < 2; i++) {
            const playerCells: JSX.Element[] = [];
            for (let j = 0; j < G.tavernsNum; j++) {
                if (data !== undefined) {
                    if (i === 0) {
                        const currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[j];
                        if (currentTavernConfig === undefined) {
                            throw new Error(`Отсутствует конфиг таверны ${j}.`);
                        }
                        playerHeaders.push(
                            <th key={`Tavern ${currentTavernConfig.name}`}>
                                <span style={Styles.Taverns(j)} className="bg-tavern-icon">

                                </span>
                            </th>
                        );
                    } else {
                        if (j === G.tavernsNum - 1) {
                            playerFooters.push(
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
                            if (data !== undefined) {
                                playerFooters.push(
                                    <th key={`${player.nickname} exchange icon ${j}`}>
                                        <span style={Styles.Exchange()} className="bg-small-market-coin">

                                        </span>
                                    </th>
                                );
                            }
                        }
                    }
                }
                if (i === 0 || (i === 1 && j !== G.tavernsNum - 1)) {
                    const id: number = j + G.tavernsNum * i,
                        boardCoin: CoinType | undefined = player.boardCoins[coinIndex];
                    if (boardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на столе отсутствует монета ${coinIndex}.`);
                    }
                    if (boardCoin === null) {
                        if (Number(ctx.currentPlayer) === p && ctx.phase === Phases.PlaceCoins
                            && player.selectedCoin !== null) {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`,
                                        boardCoin, coinIndex, player, null,
                                        id, MoveNames.ClickBoardCoinMove, id);
                                } else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, boardCoin,
                                        coinIndex, player, null, null,
                                        MoveNames.ClickBoardCoinMove, id);
                                }
                            } else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                moveMainArgs.push(coinIndex);
                            }
                        } else {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, boardCoin,
                                        coinIndex, player, null, id);
                                } else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, boardCoin,
                                        coinIndex, player);
                                }
                            }
                        }
                    } else if (Number(ctx.currentPlayer) === p && ctx.phase === Phases.PlaceCoins) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, boardCoin, coinIndex, player,
                                null, null, MoveNames.ClickBoardCoinMove,
                                id);
                        } else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                            moveMainArgs.push(coinIndex);
                        }
                    } else {
                        if (data !== undefined) {
                            const currentTavernBoardCoin: CoinType | undefined = player.boardCoins[G.currentTavern];
                            if (currentTavernBoardCoin !== undefined) {
                                if (G.winner.length || (ctx.phase !== Phases.PlaceCoins
                                    && ((i === 0 && G.currentTavern >= j)
                                        || (i === 1 && Number(ctx.currentPlayer) === p
                                            && currentTavernBoardCoin?.isTriggerTrading)))) {
                                    DrawCoin(data, playerCells, `coin`, boardCoin, coinIndex,
                                        player);
                                } else {
                                    DrawCoin(data, playerCells, `back`, boardCoin, coinIndex,
                                        player);
                                }
                            } else {
                                if (G.currentTavern !== -1) {
                                    throw new Error(`В массиве монет игрока на столе отсутствует монета текущей таверны ${G.currentTavern}.`);
                                }
                                DrawCoin(data, playerCells, `back`, boardCoin, coinIndex,
                                    player);
                            }
                        }
                    }
                    coinIndex++;
                }
            }
            if (data !== undefined) {
                playerRows.push(
                    <tr key={`${player.nickname} board coins row ${i}`}>{playerCells}</tr>
                );
            }
        }
        if (data !== undefined) {
            playersBoardsCoins.push(
                <table className="mx-auto" key={`${player.nickname} board coins`}>
                    <caption>
                        Player {p + 1} ({player.nickname}) played coins
                    </caption>
                    <thead>
                        <tr>{playerHeaders}</tr>
                    </thead>
                    <tbody>
                        {playerRows}
                    </tbody>
                    <tfoot>
                        <tr>{playerFooters}</tr>
                    </tfoot>
                </table>
            );
        }
    }
    if (data !== undefined) {
        return playersBoardsCoins;
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Игровые поля для пользовательских монет в руке.
 * @constructor
 */
export const DrawPlayersHandsCoins = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>): JSX.Element[] | IMoveArgumentsStage<number[]>[`args`] => {
    // TODO Your coins always public for you only, others always private!
    const playersHandsCoins: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    let moveName: MoveNames | undefined;
    switch (ctx.phase) {
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
    for (let p = 0; p < ctx.numPlayers; p++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[p],
            playerCells: JSX.Element[] = [];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < player.handCoins.length; j++) {
                const handCoin: CoinType | undefined = player.handCoins[j];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока в руке отсутствует монета ${j}.`);
                }
                if (handCoin === null) {
                    if (data !== undefined) {
                        playerCells.push(
                            <td key={`${player.nickname} hand coin ${j} empty`}
                                className="bg-yellow-300">
                                <span className="bg-coin bg-yellow-300 border-2">

                                </span>
                            </td>
                        );
                    }
                } else {
                    if (Number(ctx.currentPlayer) === p || G.winner.length) {
                        let coinClasses = `border-2`;
                        if (player.selectedCoin === j) {
                            coinClasses = `border-2 border-green-400`;
                        }
                        if (!G.winner.length && (ctx.phase === Phases.PlaceCoins
                            || ctx.phase === Phases.PlaceCoinsUline || (ctx.activePlayers
                                && ctx.activePlayers[Number(ctx.currentPlayer)] ===
                                Stages.PlaceTradingCoinsUline))) {
                            if (data !== undefined) {
                                DrawCoin(data, playerCells, `coin`, handCoin, j, player,
                                    coinClasses, null, moveName, j);
                            } else if (validatorName === MoveValidatorNames.ClickHandCoinMoveValidator
                                || validatorName === MoveValidatorNames.ClickHandCoinUlineMoveValidator
                                || validatorName ===
                                MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator) {
                                moveMainArgs.push(j);
                            }
                        } else {
                            if (data !== undefined) {
                                DrawCoin(data, playerCells, `coin`, handCoin, j, player,
                                    coinClasses);
                            }
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `back`, handCoin, j, player);
                        }
                    }
                }
            }
        }
        if (data !== undefined) {
            playersHandsCoins.push(
                <table className="mx-auto" key={`${player.nickname} hand coins`}>
                    <caption>Player {p + 1} ({player.nickname}) coins</caption>
                    <tbody>
                        <tr>{playerCells}</tr>
                    </tbody>
                </table>
            );
        }
    }
    if (data !== undefined) {
        return playersHandsCoins;
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};
