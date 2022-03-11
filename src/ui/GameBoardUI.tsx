import type { Ctx } from "boardgame.io";
import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsCardNotActionAndNotNull } from "../Card";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { DrawBoard } from "../helpers/DrawHelpers";
import { tavernsConfig } from "../Tavern";
import { ConfigNames, MoveNames, MoveValidatorNames } from "../typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, DeckCardTypes, ICoin, IConfig, IDrawBoardOptions, IHeroCard, IMoveArgumentsStage, IMyGameState, INumberValues, IPublicPlayer, IStack, ITavernInConfig, MoveValidatorTypes, PickedCardType, SuitTypes, TavernCardTypes } from "../typescript/interfaces";
import { DrawCard, DrawCoin } from "./ElementsUI";
import { AddCoinToPouchProfit, DiscardAnyCardFromPlayerBoardProfit, DiscardCardFromBoardProfit, DiscardCardProfit, DiscardSuitCardFromPlayerBoardProfit, ExplorerDistinctionProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./ProfitUI";

/**
 * <h3>Отрисовка карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле кэмпа | данные для списка доступных аргументов мува.
 */
export const DrawCamp = (G: IMyGameState, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>): JSX.Element | IMoveArgumentsStage<number[]>[`args`] => {
    const boardCells: JSX.Element[] = [],
        campDeck: CampDeckCardTypes[] | undefined = G.campDecks[G.campDecks.length - G.tierToEnd],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < G.campNum; j++) {
            const campCard: CampCardTypes | undefined = G.camp[j];
            if (campCard !== undefined) {
                if (campCard === null) {
                    if (data !== undefined) {
                        boardCells.push(
                            <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                                <span style={Styles.Camp()} className="bg-camp-icon">

                                </span>
                            </td>
                        );
                    }
                } else {
                    if (data !== undefined) {
                        DrawCard(data, boardCells, campCard, j, null, null,
                            MoveNames.ClickCampCardMove, j);
                    } else if (validatorName === MoveValidatorNames.ClickCampCardMoveValidator) {
                        moveMainArgs.push(j);
                    }
                }
            } else {
                throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
            }
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption>
                    <span style={Styles.Camp()} className="bg-top-camp-icon">

                    </span>
                    <span>Camp {G.campDecks.length - G.tierToEnd + 1 > G.campDecks.length ?
                        G.campDecks.length : G.campDecks.length - G.tierToEnd + 1}
                        ({campDeck !== undefined ? campDeck.length : 0}
                        {G.campDecks.length - G.tierToEnd === 0 ? `/` +
                            G.campDecks.reduce((count: number, current: CampCardTypes[]) =>
                                count + current.length, 0) : ``} cards left)
                    </span>
                </caption>
                <tbody>
                    <tr>{boardCells}</tr>
                </tbody>
            </table>
        );
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param ctx
 * @returns Поле информации о текущем ходу.
 */
export const DrawCurrentPlayerTurn = (ctx: Ctx): JSX.Element => (
    <b>Current player: <span className="italic">Player {Number(ctx.currentPlayer) + 1}</span> |
        Turn: <span className="italic">{ctx.turn}</span></b>
);

/**
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
 */
export const DrawDistinctions = (G: IMyGameState, ctx: Ctx, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>): JSX.Element | IMoveArgumentsStage<SuitTypes[]>[`args`] => {
    const boardCells: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
    for (let i = 0; i < 1; i++) {
        let suit: SuitTypes;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (G.distinctions[suit] === ctx.currentPlayer
                    && ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos]) {
                    if (data !== undefined) {
                        boardCells.push(
                            <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                                onClick={() => data.moves.ClickDistinctionCardMove?.(suit)}
                                title={suitsConfig[suit].distinction.description}>
                                <span style={Styles.Distinctions(suit)} className="bg-suit-distinction">

                                </span>
                            </td>
                        );
                    } else if (validatorName === MoveValidatorNames.ClickDistinctionCardMoveValidator) {
                        moveMainArgs.push(suit);
                    }
                } else {
                    if (data !== undefined) {
                        boardCells.push(
                            <td className="bg-green-500" key={`Distinction ${suit} card`}
                                title={suitsConfig[suit].distinction.description}>
                                <span style={Styles.Distinctions(suit)} className="bg-suit-distinction">

                                </span>
                            </td>
                        );
                    }
                }
            }
        }
    }
    if (data !== undefined) {
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
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = (G: IMyGameState, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>): JSX.Element | IMoveArgumentsStage<number[]>[`args`] => {
    const boardRows: JSX.Element[] = [],
        drawData: IDrawBoardOptions = DrawBoard(G.heroes.length),
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                hero: IHeroCard | undefined = G.heroes[increment];
            if (hero !== undefined) {
                if (data !== undefined) {
                    if (hero.active) {
                        DrawCard(data, boardCells, hero, increment, null, null,
                            MoveNames.ClickHeroCardMove, increment);
                    } else {
                        DrawCard(data, boardCells, hero, increment, null);
                    }
                } else if (validatorName === MoveValidatorNames.ClickHeroCardMoveValidator && hero.active) {
                    moveMainArgs.push(increment);
                }
            } else {
                throw new Error(`В массиве карт героев отсутствует герой ${increment}.`);
            }
            if (increment + 1 === G.heroes.length) {
                break;
            }
        }
        if (data !== undefined) {
            boardRows.push(
                <tr key={`Heroes row ${i}`}>{boardCells}</tr>
            );
        }
    }
    if (data !== undefined) {
        return (
            <table>
                <caption>
                    <span style={Styles.HeroBack()} className="bg-top-hero-icon">

                    </span> <span>Heroes ({G.heroes.length} left)</span>
                </caption>
                <tbody>
                    {boardRows}
                </tbody>
            </table>
        );
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param data Глобальные параметры.
 * @returns Поле рынка монет.
 */
export const DrawMarketCoins = (G: IMyGameState, data: BoardProps<IMyGameState>): JSX.Element => {
    const boardRows: JSX.Element[] = [],
        drawData: IDrawBoardOptions = DrawBoard(G.marketCoinsUnique.length),
        countMarketCoins: INumberValues = CountMarketCoins(G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                marketCoin: ICoin | undefined = G.marketCoinsUnique[increment];
            if (marketCoin !== undefined) {
                const tempCoinValue = marketCoin.value,
                    coinClassName: string = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
                DrawCoin(data, boardCells, `market`, marketCoin, increment, null,
                    coinClassName, countMarketCoins[tempCoinValue],
                    MoveNames.ClickHandCoinMove, j);
                if (increment + 1 === G.marketCoinsUnique.length) {
                    break;
                }
            } else {
                throw new Error(`В массиве монет рынка героев отсутствует монета ${increment}.`);
            }
        }
        boardRows.push(
            <tr key={`Market coins row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption>
                <span className="block">
                    <span style={Styles.Exchange()} className="bg-top-market-coin-icon">

                    </span> Market coins ({G.marketCoins.length} left)</span>
            </caption>
            <tbody>
                {boardRows}
            </tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Глобальные параметры.
 * @returns Поле профита.
 */
export const DrawProfit = (G: IMyGameState, ctx: Ctx, data: BoardProps<IMyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [],
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const stack: IStack | undefined = player.stack[0];
        if (stack !== undefined) {
            const config: IConfig | undefined = stack.config,
                option = G.drawProfit;
            let caption = `Get `;
            if (option === ConfigNames.PlaceThrudHero || option === ConfigNames.PlaceYludHero
                || option === ConfigNames.PlaceOlwinCards) {
                if (config !== undefined) {
                    caption += `suit to place ${player.actionsNum} ${config.drawName} ${player.actionsNum > 1 ? `s` : ``} to ${player.actionsNum > 1 ? `different` : `that`} suit.`;
                    PlaceCardsProfit(G, ctx, null, data, boardCells);
                }
            } else if (option === ConfigNames.ExplorerDistinction) {
                caption += `one card to your board.`;
                ExplorerDistinctionProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.BonfurAction || option === ConfigNames.DagdaAction) {
                caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} to discard from your board.`;
                DiscardCardFromBoardProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.AndumiaAction || option === ConfigNames.BrisingamensAction) {
                caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} from discard pile to your board.`;
                PickDiscardCardProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.BrisingamensEndGameAction) {
                caption += `one card to discard from your board.`;
                DiscardAnyCardFromPlayerBoardProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.HofudAction) {
                caption += `one warrior card to discard from your board.`;
                DiscardSuitCardFromPlayerBoardProfit(G, ctx, null, null, data, boardCells);
            } else if (option === ConfigNames.HoldaAction) {
                caption += `one card from camp to your board.`;
                PickCampCardHoldaProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.DiscardCard) {
                caption += `one card to discard from current tavern.`;
                DiscardCardProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.GetMjollnirProfit) {
                caption += `suit to get Mjollnir profit from ranks on that suit.`;
                GetMjollnirProfitProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.StartOrPassEnlistmentMercenaries) {
                caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
                StartEnlistmentMercenariesProfit(G, ctx, data, boardCells);
            } else if (option === ConfigNames.EnlistmentMercenaries) {
                caption += `mercenary to place it to your player board.`;
                GetEnlistmentMercenariesProfit(G, ctx, null, data, boardCells);
            } else if (option === ConfigNames.PlaceEnlistmentMercenaries) {
                const card: PickedCardType = player.pickedCard;
                if (card !== null) {
                    caption += `suit to place ${card.name} to that suit.`;
                    PlaceEnlistmentMercenariesProfit(G, ctx, null, data, boardCells);
                }
            } else if (option === ConfigNames.AddCoinToPouchVidofnirVedrfolnir) {
                caption += `${player.actionsNum} coin${player.actionsNum > 1 ? `s` : ``} to add to your pouch to fill it.`;
                AddCoinToPouchProfit(G, ctx, null, data, boardCells);
            } else {
                if (config !== undefined) {
                    caption += `coin to upgrade up to ${config.value}.`;
                    if (option === ConfigNames.VidofnirVedrfolnirAction) {
                        UpgradeCoinVidofnirVedrfolnirProfit(G, ctx, null, data, boardCells);
                    } else if (option === ConfigNames.UpgradeCoin) {
                        UpgradeCoinProfit(G, ctx, null, data, boardCells);
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
        } else {
            throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

/**
 * <h3>Отрисовка карт таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param validatorName Название валидатора.
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = (G: IMyGameState, validatorName: MoveValidatorTypes | null,
    data?: BoardProps<IMyGameState>, gridClass?: string): JSX.Element[] | IMoveArgumentsStage<number[]>[`args`] => {
    const tavernsBoards: JSX.Element[] = [],
        moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
    for (let t = 0; t < G.tavernsNum; t++) {
        const currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[t];
        if (currentTavernConfig !== undefined) {
            for (let i = 0; i < 1; i++) {
                const boardCells: JSX.Element[] = [];
                for (let j = 0; j < G.drawSize; j++) {
                    const tavern: TavernCardTypes[] | undefined = G.taverns[t];
                    if (tavern !== undefined) {
                        const tavernCard: TavernCardTypes | undefined = tavern[j];
                        if (tavernCard !== undefined) {
                            if (tavernCard === null) {
                                if (data !== undefined) {
                                    boardCells.push(
                                        <td key={`${currentTavernConfig.name} ${j}`}>
                                            <span style={Styles.Taverns(t)} className="bg-tavern-icon">

                                            </span>
                                        </td>
                                    );
                                }
                            } else {
                                let suit: SuitTypes | null = null;
                                if (IsCardNotActionAndNotNull(tavernCard)) {
                                    suit = tavernCard.suit;
                                }
                                if (t === G.currentTavern) {
                                    if (data !== undefined) {
                                        DrawCard(data, boardCells, tavernCard, j, null,
                                            suit, MoveNames.ClickCardMove, j);
                                    } else if (validatorName === MoveValidatorNames.ClickCardMoveValidator) {
                                        moveMainArgs.push(j);
                                    }
                                } else {
                                    if (data !== undefined) {
                                        DrawCard(data, boardCells, tavernCard, j, null,
                                            suit);
                                    }
                                }
                            }
                        } else {
                            throw new Error(`В массиве карт таверны ${t} отсутствует карта ${j}.`);
                        }
                    } else {
                        throw new Error(`В массиве таверн отсутствует таверна ${t}.`);
                    }
                }
                if (data !== undefined) {
                    tavernsBoards.push(
                        <table className={`${gridClass} justify-self-center`}
                            key={`Tavern ${currentTavernConfig.name} board`}>
                            <caption className="whitespace-nowrap">
                                <span style={Styles.Taverns(t)} className="bg-top-tavern-icon">

                                </span> <b>{currentTavernConfig.name}</b>
                            </caption>
                            <tbody>
                                <tr>{boardCells}</tr>
                            </tbody>
                        </table>
                    );
                }
            }
        } else {
            throw new Error(`Отсутствует конфиг таверны ${t}.`);
        }
    }
    if (data !== undefined) {
        return tavernsBoards;
    } else if (validatorName !== null) {
        return moveMainArgs;
    } else {
        throw new Error(`Функция должна возвращать значение.`);
    }
};

/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @returns Поле информации о количестве карт по эпохам.
 */
export const DrawTierCards = (G: IMyGameState): JSX.Element => {
    const deck: DeckCardTypes[] | undefined = G.decks[G.decks.length - G.tierToEnd];
    return (
        <b>Tier: <span className="italic">
            {G.decks.length - G.tierToEnd + 1 > G.decks.length ? G.decks.length :
                G.decks.length - G.tierToEnd + 1}/{G.decks.length}
            ({deck !== undefined ? deck.length : 0}{G.decks.length - G.tierToEnd === 0 ? `/`
                + G.decks.reduce((count: number, current: DeckCardTypes[]) =>
                    count + current.length, 0) : ``} cards left)
        </span></b>
    );
};

/**
 * <h3>Отрисовка игровой информации о текущем статусе игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Поле информации о ходе/победителях игры.
 */
export const DrawWinner = (G: IMyGameState, ctx: Ctx): JSX.Element => {
    let winner: string;
    if (ctx.gameover !== undefined) {
        if (G.winner !== undefined) {
            if (G.winner.length === 1) {
                const winnerIndex: number | undefined = G.winner[0];
                if (winnerIndex !== undefined) {
                    const winnerPlayer = G.publicPlayers[winnerIndex];
                    if (winnerPlayer !== undefined) {
                        winner = `Winner: Player ${winnerPlayer.nickname}`;
                    } else {
                        throw new Error(`Отсутствует игрок победитель ${winnerIndex}.`);
                    }
                } else {
                    throw new Error(`Отсутствует индекс игрока победителя.`);
                }
            } else {
                winner = "Winners: ";
                G.winner.forEach((playerId: number, index: number): void => {
                    const winnerPlayerI: IPublicPlayer | undefined = G.publicPlayers[playerId];
                    if (winnerPlayerI !== undefined) {
                        winner += `${index + 1}) Player ${winnerPlayerI.nickname}; `;
                    } else {
                        throw new Error(`Отсутствует игрок победитель ${playerId}.`);
                    }
                });
            }
        } else {
            winner = `Draw!`;
        }
    } else {
        winner = `Game is started`;
    }
    return (
        <b>Game status: <span className="italic">{winner.trim()}</span></b>
    );
};
