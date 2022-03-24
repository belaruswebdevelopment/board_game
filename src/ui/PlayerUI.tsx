import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsMercenaryCampCard } from "../Camp";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { CurrentScoring } from "../Score";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { tavernsConfig } from "../Tavern";
import { HeroNames, MoveNames, MoveValidatorNames, Phases, Stages } from "../typescript/enums";
import type { CampDeckCardTypes, CoinType, IHeroCard, IMoveArgumentsStage, IMyGameState, IPlayer, IPublicPlayer, ITavernInConfig, MoveValidatorTypes, PlayerCardsType, PublicPlayerBoardCoinTypes, SuitTypes } from "../typescript/interfaces";
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
export const DrawPlayersBoards = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>): JSX.Element[] | (IMoveArgumentsStage<number[]>[`args`]) => {
    const playersBoards: JSX.Element[] = [];
    const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let p = 0; p < ctx.numPlayers; p++) {
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerHeadersCount: JSX.Element[] = [],
            player: IPublicPlayer | undefined = G.publicPlayers[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${p}.`);
        }
        let suit: SuitTypes;
        if (data !== undefined) {
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    playerHeaders.push(
                        <th className={`${suitsConfig[suit].suitColor}`}
                            key={`${player.nickname} ${suitsConfig[suit].suitName}`}>
                            <span style={Styles.Suits(suit)} className="bg-suit-icon"></span>
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
                            <span style={Styles.HeroBack()} className="bg-hero-icon"></span>
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
                            <span style={Styles.Camp()} className="bg-camp-icon"></span>
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
        }
        for (let i = 0; ; i++) {
            const playerCells: JSX.Element[] = [];
            let isDrawRow = false,
                id = 0,
                j = 0;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    id = i + j;
                    const card: PlayerCardsType | undefined = player.cards[suit][i];
                    if (card !== undefined) {
                        isDrawRow = true;
                        if (data !== undefined) {
                            DrawCard(data, playerCells, card, id, player, suit);
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} empty card ${id}`}></td>
                            );
                        }
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
                    if (hero !== undefined && !hero.suit && !((hero.name === HeroNames.Ylud
                        && playerCards.findIndex((card: PlayerCardsType): boolean =>
                            card.name === HeroNames.Ylud) !== -1) || (hero.name === HeroNames.Thrud
                                && playerCards.findIndex((card: PlayerCardsType): boolean =>
                                    card.name === HeroNames.Thrud) !== -1))) {
                        isDrawRow = true;
                        if (data !== undefined) {
                            DrawCard(data, playerCells, hero, id, player, null);
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} hero ${i}`}></td>
                            );
                        }
                    }
                } else {
                    const campCard: CampDeckCardTypes | undefined = player.campCards[i];
                    if (campCard !== undefined) {
                        isDrawRow = true;
                        if (IsMercenaryCampCard(campCard) && ctx.phase === Phases.EnlistmentMercenaries
                            && ctx.activePlayers === null && Number(ctx.currentPlayer) === p) {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, campCard, id, player, null,
                                    MoveNames.GetEnlistmentMercenariesMove, i);
                            } else if (validatorName === MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) {
                                moveMainArgs.push(i);
                            }
                        } else {
                            if (data !== undefined) {
                                DrawCard(data, playerCells, campCard, id, player, null);
                            }
                        }
                    } else {
                        if (data !== undefined) {
                            playerCells.push(
                                <td key={`${player.nickname} camp card ${i}`}></td>
                            );
                        }
                    }
                }
            }
            if (isDrawRow) {
                if (data !== undefined) {
                    playerRows.push(
                        <tr key={`${player.nickname} board row ${i}`}>{playerCells}</tr>
                    );
                }
            } else {
                break;
            }
        }
        if (data !== undefined) {
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
    }
    if (data !== undefined) {
        return playersBoards;
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
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
    const multiplayer = IsMultiplayer(G),
        playersBoardsCoins: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let p = 0; p < ctx.numPlayers; p++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[p],
            privatePlayer: IPlayer | undefined = G.players[p];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${p}.`);
        }
        const playerRows: JSX.Element[] = [],
            playerHeaders: JSX.Element[] = [],
            playerFooters: JSX.Element[] = [];
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
                                <span style={Styles.Taverns(j)} className="bg-tavern-icon"></span>
                            </th>
                        );
                    } else {
                        if (j === G.tavernsNum - 1) {
                            playerFooters.push(
                                <th key={`${player.nickname} priority icon`}>
                                    <span style={Styles.Priority()} className="bg-priority-icon"></span>
                                </th>
                            );
                            playerCells.push(
                                <td key={`${player.nickname} priority gem`}
                                    className="bg-gray-300">
                                    <span style={Styles.Priorities(player.priority.value)}
                                        className="bg-priority"></span>
                                </td>
                            );
                        } else {
                            if (data !== undefined) {
                                playerFooters.push(
                                    <th key={`${player.nickname} exchange icon ${j}`}>
                                        <span style={Styles.Exchange()} className="bg-small-market-coin"></span>
                                    </th>
                                );
                            }
                        }
                    }
                }
                if (i === 0 || (i === 1 && j !== G.tavernsNum - 1)) {
                    const id: number = j + G.tavernsNum * i,
                        publicBoardCoin: PublicPlayerBoardCoinTypes | undefined = player.boardCoins[id],
                        privateBoardCoin: PublicPlayerBoardCoinTypes | undefined = privatePlayer?.boardCoins[id];
                    if (publicBoardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на столе отсутствует монета ${j}.`);
                    }
                    if (publicBoardCoin !== null) {
                        if (ctx.phase === Phases.PlaceCoins && Number(ctx.currentPlayer) === p
                            && ((multiplayer && privateBoardCoin !== undefined)
                                || (!multiplayer && publicBoardCoin !== undefined))) {
                            if (data !== undefined) {
                                if (!multiplayer && !IsCoin(publicBoardCoin)
                                    || (multiplayer && !IsCoin(privateBoardCoin))) {
                                    throw new Error(`Монета на столе текущего игрока не может быть закрытой для него.`);
                                }
                                DrawCoin(data, playerCells, `coin`, privateBoardCoin ?? publicBoardCoin,
                                    id, player, null, null,
                                    MoveNames.ClickBoardCoinMove, id);
                            } else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                moveMainArgs.push(id);
                            }
                        } else {
                            if (data !== undefined) {
                                const currentTavernBoardCoin: PublicPlayerBoardCoinTypes | undefined =
                                    player.boardCoins[G.currentTavern];
                                if ((G.winner.length || (ctx.phase !== Phases.PlaceCoins
                                    && ((i === 0 && G.currentTavern >= j)
                                        || (i === 1 && Number(ctx.currentPlayer) === p
                                            && IsCoin(publicBoardCoin)
                                            && currentTavernBoardCoin?.isTriggerTrading))))) {
                                    DrawCoin(data, playerCells, `coin`, publicBoardCoin, id, player);
                                } else {
                                    if (multiplayer && privateBoardCoin !== undefined) {
                                        if (IsCoin(publicBoardCoin)) {
                                            DrawCoin(data, playerCells, `coin`, publicBoardCoin, id,
                                                player);
                                        } else {
                                            DrawCoin(data, playerCells, `hidden-coin`, privateBoardCoin, id,
                                                player, `bg-small-coin`);
                                        }
                                    } else {
                                        // if (IsCoin(publicBoardCoin)) {
                                        //     DrawCoin(data, playerCells, `coin`, publicBoardCoin, id,
                                        //         player);
                                        // } else {
                                        DrawCoin(data, playerCells, `back`, publicBoardCoin, id,
                                            player);
                                        // }
                                    }
                                }
                            }
                        }
                    } else {
                        if (ctx.phase === Phases.PlaceCoins && player.selectedCoin !== null
                            && ((!multiplayer && (Number(ctx.currentPlayer) === p))
                                || (multiplayer && (Number(ctx.currentPlayer) === p)))) {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, publicBoardCoin, id,
                                        player, null, id,
                                        MoveNames.ClickBoardCoinMove, id);
                                } else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, publicBoardCoin,
                                        id, player, null, null,
                                        MoveNames.ClickBoardCoinMove, id);
                                }
                            } else if (validatorName === MoveValidatorNames.ClickBoardCoinMoveValidator) {
                                moveMainArgs.push(id);
                            }
                        } else {
                            if (data !== undefined) {
                                if (i === 0) {
                                    DrawCoin(data, playerCells, `back-tavern-icon`, publicBoardCoin, id,
                                        player, null, id);
                                } else {
                                    DrawCoin(data, playerCells, `back-small-market-coin`, publicBoardCoin,
                                        id, player);
                                }
                            }
                        }
                    }
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
    const multiplayer = IsMultiplayer(G),
        playersHandsCoins: JSX.Element[] = [],
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
            privatePlayer: IPlayer | undefined = G.players[p],
            playerCells: JSX.Element[] = [];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок ${p}.`);
        }
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 5; j++) {
                let handCoin: CoinType | undefined;
                if (multiplayer) {
                    handCoin = privatePlayer?.handCoins[j];
                } else {
                    handCoin = player.handCoins[j];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока в руке отсутствует монета ${j}.`);
                    }
                }
                if (handCoin !== undefined && IsCoin(handCoin)
                    && ((!multiplayer && Number(ctx.currentPlayer) === p) || multiplayer)) {
                    let coinClasses = `border-2`;
                    if (player.selectedCoin === j) {
                        coinClasses = `border-2 border-green-400`;
                    }
                    if (Number(ctx.currentPlayer) === p
                        && (ctx.phase === Phases.PlaceCoins || ctx.phase === Phases.PlaceCoinsUline
                            || (ctx.activePlayers && ctx.activePlayers[Number(ctx.currentPlayer)] ===
                                Stages.PlaceTradingCoinsUline))) {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses,
                                null, moveName, j);
                        } else if (validatorName === MoveValidatorNames.ClickHandCoinMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandCoinUlineMoveValidator
                            || validatorName === MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator) {
                            moveMainArgs.push(j);
                        }
                    } else {
                        if (data !== undefined) {
                            DrawCoin(data, playerCells, `coin`, handCoin, j, player, coinClasses);
                        }
                    }
                } else {
                    if (data !== undefined) {
                        const boardCoinsLength: number =
                            player.boardCoins.filter((coin: PublicPlayerBoardCoinTypes): boolean =>
                                coin !== null).length;
                        if (handCoin !== undefined && IsCoin(handCoin)) {
                            DrawCoin(data, playerCells, `back`, handCoin, j, player);
                        } else if (handCoin === undefined && (j < (5 - boardCoinsLength))) {
                            DrawCoin(data, playerCells, `back`, null, j, player);
                        } else {
                            playerCells.push(
                                <td key={`${player.nickname} hand coin ${j} empty`}
                                    className="bg-yellow-300">
                                    <span className="bg-coin bg-yellow-300 border-2"></span>
                                </td>
                            );
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
