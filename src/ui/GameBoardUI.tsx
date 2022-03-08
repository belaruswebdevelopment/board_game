import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsCardNotActionAndNotNull } from "../Card";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { DrawBoard } from "../helpers/DrawHelpers";
import { tavernsConfig } from "../Tavern";
import { ConfigNames, MoveNames } from "../typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, DeckCardTypes, ICoin, IConfig, IDrawBoardOptions, IHeroCard, IMyGameState, INumberValues, IPublicPlayer, ITavernInConfig, PickedCardType, SuitTypes, TavernCardTypes } from "../typescript/interfaces";
import { DrawCard, DrawCoin } from "./ElementsUI";
import { AddCoinToPouchProfit, DiscardAnyCardFromPlayerBoardProfit, DiscardCardFromBoardProfit, DiscardCardProfit, DiscardSuitCardFromPlayerBoardProfit, ExplorerDistinctionProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./ProfitUI";

/**
 * <h3>Отрисовка карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле кэмпа.
 */
export const DrawCamp = (data: BoardProps<IMyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [],
        campDeck: CampDeckCardTypes[] | undefined = data.G.campDecks[data.G.campDecks.length - data.G.tierToEnd];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.G.campNum; j++) {
            const campCard: CampCardTypes | undefined = data.G.camp[j];
            if (campCard !== undefined) {
                if (campCard === null) {
                    boardCells.push(
                        <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                            <span style={Styles.Camp()} className="bg-camp-icon">

                            </span>
                        </td>
                    );
                } else {
                    DrawCard(data, boardCells, campCard, j, null, null,
                        MoveNames.ClickCampCardMove, j);
                }
            } else {
                throw new Error(`В массиве карт кэмпа отсутствует карта ${j}.`);
            }
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.Camp()} className="bg-top-camp-icon">

                </span>
                <span>Camp {data.G.campDecks.length - data.G.tierToEnd + 1 > data.G.campDecks.length ?
                    data.G.campDecks.length : data.G.campDecks.length - data.G.tierToEnd + 1}
                    ({campDeck !== undefined ? campDeck.length : 0}
                    {data.G.campDecks.length - data.G.tierToEnd === 0 ? `/` +
                        data.G.campDecks.reduce((count: number, current: CampCardTypes[]) =>
                            count + current.length, 0) : ``} cards left)
                </span>
            </caption>
            <tbody>
                <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле информации о текущем ходу.
 */
export const DrawCurrentPlayerTurn = (data: BoardProps<IMyGameState>): JSX.Element => (
    <b>Current player: <span className="italic">Player {Number(data.ctx.currentPlayer) + 1}</span> |
        Turn: <span className="italic">{data.ctx.turn}</span></b>
);

/**
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
 */
export const DrawDistinctions = (data: BoardProps<IMyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    for (let i = 0; i < 1; i++) {
        let suit: SuitTypes;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                boardCells.push(
                    <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                        onClick={() => data.moves.ClickDistinctionCardMove?.(suit)}
                        title={suitsConfig[suit].distinction.description}>
                        <span style={Styles.Distinctions(suit)} className="bg-suit-distinction">

                        </span>
                    </td>
                );
            }
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
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле героев.
 */
export const DrawHeroes = (data: BoardProps<IMyGameState>): JSX.Element => {
    const boardRows: JSX.Element[] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                hero: IHeroCard | undefined = data.G.heroes[increment];
            if (hero !== undefined) {
                DrawCard(data, boardCells, hero, increment, null, null,
                    MoveNames.ClickHeroCardMove, increment);
            } else {
                throw new Error(`В массиве карт героев отсутствует герой ${increment}.`);
            }
            if (increment + 1 === data.G.heroes.length) {
                break;
            }
        }
        boardRows.push(
            <tr key={`Heroes row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption>
                <span style={Styles.HeroBack()} className="bg-top-hero-icon">

                </span> <span>Heroes ({data.G.heroes.length} left)</span>
            </caption>
            <tbody>
                {boardRows}
            </tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле рынка монет.
 */
export const DrawMarketCoins = (data: BoardProps<IMyGameState>): JSX.Element => {
    const boardRows: JSX.Element[] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.G.marketCoinsUnique.length),
        countMarketCoins: INumberValues = CountMarketCoins(data.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                marketCoin: ICoin | undefined = data.G.marketCoinsUnique[increment];
            if (marketCoin !== undefined) {
                const tempCoinValue = marketCoin.value,
                    coinClassName: string = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
                DrawCoin(data, boardCells, `market`, marketCoin, increment, null,
                    coinClassName, countMarketCoins[tempCoinValue],
                    MoveNames.ClickHandCoinMove, j);
                if (increment + 1 === data.G.marketCoinsUnique.length) {
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

                    </span> Market coins ({data.G.marketCoins.length} left)</span>
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
 * @param data Глобальные параметры.
 * @returns Поле профита.
 */
export const DrawProfit = (data: BoardProps<IMyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [],
        player: IPublicPlayer | undefined = data.G.publicPlayers[Number(data.ctx.currentPlayer)];
    if (player !== undefined) {
        const config: IConfig | undefined = player.stack[0]?.config,
            option = data.G.drawProfit;
        let caption = `Get `;
        if (option === ConfigNames.PlaceThrudHero || option === ConfigNames.PlaceYludHero
            || option === ConfigNames.PlaceOlwinCards) {
            if (config !== undefined) {
                caption += `suit to place ${player.actionsNum} ${config.drawName} ${player.actionsNum > 1 ? `s` : ``} to ${player.actionsNum > 1 ? `different` : `that`} suit.`;
                PlaceCardsProfit(data.G, data.ctx, data, boardCells);
            }
        } else if (option === ConfigNames.ExplorerDistinction) {
            caption += `one card to your board.`;
            ExplorerDistinctionProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.BonfurAction || option === ConfigNames.DagdaAction) {
            caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} to discard from your board.`;
            DiscardCardFromBoardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.AndumiaAction || option === ConfigNames.BrisingamensAction) {
            caption += `${player.actionsNum} card${player.actionsNum > 1 ? `s` : ``} from discard pile to your board.`;
            PickDiscardCardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.BrisingamensEndGameAction) {
            caption += `one card to discard from your board.`;
            DiscardAnyCardFromPlayerBoardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.HofudAction) {
            caption += `one warrior card to discard from your board.`;
            DiscardSuitCardFromPlayerBoardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.HoldaAction) {
            caption += `one card from camp to your board.`;
            PickCampCardHoldaProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.DiscardCard) {
            caption += `one card to discard from current tavern.`;
            DiscardCardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.GetMjollnirProfit) {
            caption += `suit to get Mjollnir profit from ranks on that suit.`;
            GetMjollnirProfitProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.StartOrPassEnlistmentMercenaries) {
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.EnlistmentMercenaries) {
            caption += `mercenary to place it to your player board.`;
            GetEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.PlaceEnlistmentMercenaries) {
            const card: PickedCardType = player.pickedCard;
            if (card !== null) {
                caption += `suit to place ${card.name} to that suit.`;
                PlaceEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
            }
        } else if (option === ConfigNames.AddCoinToPouchVidofnirVedrfolnir) {
            caption += `${player.actionsNum} coin${player.actionsNum > 1 ? `s` : ``} to add to your pouch to fill it.`;
            AddCoinToPouchProfit(data.G, data.ctx, data, boardCells);
        } else {
            if (config !== undefined) {
                caption += `coin to upgrade up to ${config.value}.`;
                if (option === ConfigNames.VidofnirVedrfolnirAction) {
                    UpgradeCoinVidofnirVedrfolnirProfit(data.G, data.ctx, data, boardCells);
                } else if (option === ConfigNames.UpgradeCoin) {
                    UpgradeCoinProfit(data.G, data.ctx, data, boardCells);
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
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @returns Поле таверн.
 */
export const DrawTaverns = (data: BoardProps<IMyGameState>, gridClass: string) => {
    const tavernsBoards: JSX.Element[] = [];
    for (let t = 0; t < data.G.tavernsNum; t++) {
        const currentTavernConfig: ITavernInConfig | undefined = tavernsConfig[t];
        if (currentTavernConfig !== undefined) {
            for (let i = 0; i < 1; i++) {
                const boardCells: JSX.Element[] = [];
                for (let j = 0; j < data.G.drawSize; j++) {
                    const tavern: TavernCardTypes[] | undefined = data.G.taverns[t];
                    if (tavern !== undefined) {
                        const tavernCard: TavernCardTypes | undefined = tavern[j];
                        if (tavernCard !== undefined) {
                            if (tavernCard === null) {
                                boardCells.push(
                                    <td key={`${currentTavernConfig.name} ${j}`}>
                                        <span style={Styles.Taverns(t)} className="bg-tavern-icon">

                                        </span>
                                    </td>
                                );
                            } else {
                                let suit: SuitTypes | null = null;
                                if (IsCardNotActionAndNotNull(tavernCard)) {
                                    suit = tavernCard.suit;
                                }
                                if (t === data.G.currentTavern) {
                                    DrawCard(data, boardCells, tavernCard, j, null, suit,
                                        MoveNames.ClickCardMove, j);
                                } else {
                                    DrawCard(data, boardCells, tavernCard, j, null,
                                        suit);
                                }
                            }
                        } else {
                            throw new Error(`В массиве карт таверны ${t} отсутствует карта ${j}.`);
                        }
                    } else {
                        throw new Error(`В массиве таверн отсутствует таверна ${t}.`);
                    }
                }
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
        } else {
            throw new Error(`Отсутствует конфиг таверны ${t}.`);
        }
    }
    return tavernsBoards;
};

/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле информации о количестве карт по эпохам.
 */
export const DrawTierCards = (data: BoardProps<IMyGameState>): JSX.Element => {
    const deck: DeckCardTypes[] | undefined = data.G.decks[data.G.decks.length - data.G.tierToEnd];
    return (
        <b>Tier: <span className="italic">
            {data.G.decks.length - data.G.tierToEnd + 1 > data.G.decks.length ? data.G.decks.length :
                data.G.decks.length - data.G.tierToEnd + 1}/{data.G.decks.length}
            ({deck !== undefined ? deck.length : 0}
            {data.G.decks.length - data.G.tierToEnd === 0 ? `/`
                + data.G.decks.reduce((count: number, current: DeckCardTypes[]) =>
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
 * @param data Глобальные параметры.
 * @returns Поле информации о ходе/победителях игры.
 */
export const DrawWinner = (data: BoardProps<IMyGameState>): JSX.Element => {
    let winner: string;
    if (data.ctx.gameover !== undefined) {
        if (data.G.winner !== undefined) {
            if (data.G.winner.length === 1) {
                const winnerIndex: number | undefined = data.G.winner[0];
                if (winnerIndex !== undefined) {
                    const winnerPlayer = data.G.publicPlayers[winnerIndex];
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
                data.G.winner.forEach((playerId: number, index: number): void => {
                    const winnerPlayerI: IPublicPlayer | undefined = data.G.publicPlayers[playerId];
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
