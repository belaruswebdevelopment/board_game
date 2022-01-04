import { BoardProps } from "boardgame.io/react";
import { isCardNotAction } from "../Card";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { AddCoinToPouchProfit, DiscardCardFromBoardProfit, DiscardCardProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "../helpers/ProfitHelpers";
import { DrawCard, DrawCoin } from "../helpers/UIElementHelpers";
import { DrawBoard, DrawPlayerBoardForCardDiscard, DrawPlayersBoardForSuitCardDiscard } from "../helpers/UIHelpers";
import { tavernsConfig } from "../Tavern";
import { CampCardTypes, DeckCardTypes, PickedCardType, TavernCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { ConfigNames, HeroNames } from "../typescript/enums";
import { IConfig, IDrawBoardOptions, INumberValues, MyGameState } from "../typescript/interfaces";

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
export const DrawCamp = (data: BoardProps<MyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.G.campNum; j++) {
            const campCard: CampCardTypes = data.G.camp[j];
            if (campCard === null || data.G.camp[j] === undefined) {
                boardCells.push(
                    <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </td>
                );
            } else {
                DrawCard(data, boardCells, campCard, j, null, null,
                    data.moves.ClickCampCardMove.name, j);
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
                    ({data.G.campDecks.length - data.G.tierToEnd !== 2 ?
                        data.G.campDecks[data.G.campDecks.length - data.G.tierToEnd].length : 0}
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
export const DrawCurrentPlayerTurn = (data: BoardProps<MyGameState>): JSX.Element => (
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
export const DrawDistinctions = (data: BoardProps<MyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    for (let i = 0; i < 1; i++) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                boardCells.push(
                    <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                        onClick={() => data.moves.ClickDistinctionCard(suit)}
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
export const DrawHeroes = (data: BoardProps<MyGameState>): JSX.Element => {
    const boardRows: JSX.Element[][] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j;
            DrawCard(data, boardCells, data.G.heroes[increment], increment, null,
                null, data.moves.ClickHeroCardMove.name, increment);
            if (increment + 1 === data.G.heroes.length) {
                break;
            }
        }
        boardRows[i].push(
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
export const DrawMarketCoins = (data: BoardProps<MyGameState>): JSX.Element => {
    const boardRows: JSX.Element[][] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.G.marketCoinsUnique.length),
        countMarketCoins: INumberValues = CountMarketCoins(data.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                tempCoinValue = data.G.marketCoinsUnique[increment].value,
                coinClassName: string = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin(data, boardCells, `market`,
                data.G.marketCoinsUnique[increment], increment, null, coinClassName,
                countMarketCoins[tempCoinValue], data.moves.ClickHandCoinMove.name,
                j);
            if (increment + 1 === data.G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows[i].push(
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
export const DrawProfit = (data: BoardProps<MyGameState>): JSX.Element => {
    const boardCells: JSX.Element[] = [],
        config: IConfig | undefined = data.G.publicPlayers[Number(data.ctx.currentPlayer)].stack[0].config,
        option = data.G.drawProfit;
    let caption = `Get `;
    for (let i = 0; i < 1; i++) {
        if (option === ConfigNames.PlaceCards) {
            if (config !== undefined) {
                caption += `suit to place ${data.G.actionsNum ?? 1} ${config.drawName} ${data.G.actionsNum > 1 ? `s` : ``} to ${data.G.actionsNum > 1 ? `different` : `that`} suit.`;
                PlaceCardsProfit(data.G, data.ctx, data, boardCells);
            }
        } else if (option === ConfigNames.ExplorerDistinction) {
            caption += `one card to your board.`;
            // todo Move to ProfitHelpers and add logic for bot or just use standard pick cards / upgrade coins
            for (let j = 0; j < 3; j++) {
                const card = data.G.decks[1][j];
                let suit: null | string = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, data.G.decks[1][j], j,
                    data.G.publicPlayers[Number(data.ctx.currentPlayer)], suit,
                    data.moves.ClickCardToPickDistinctionMove.name, j);
            }
        } else if (option === ConfigNames.BonfurAction || option === ConfigNames.DagdaAction) {
            caption += `${data.G.actionsNum} card${data.G.actionsNum > 1 ? `s` : ``} to discard from your board.`;
            DiscardCardFromBoardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.AndumiaAction || option === ConfigNames.BrisingamensAction) {
            caption += `${data.G.actionsNum} card${data.G.actionsNum > 1 ? `s` : ``} from discard pile to your board.`;
            PickDiscardCardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.BrisingamensEndGameAction) {
            caption += `one card to discard from your board.`;
            boardCells.push(
                <td
                    key={`${data.G.publicPlayers[Number(data.ctx.currentPlayer)].nickname} discard card`}>
                    {DrawPlayerBoardForCardDiscard(data)}
                </td>
            );
        } else if (option === ConfigNames.HofudAction) {
            caption += `one warrior card to discard from your board.`;
            if (config !== undefined && config.suit !== undefined) {
                boardCells.push(
                    <td key={`Discard ${config.suit} suit cardboard`}>
                        {DrawPlayersBoardForSuitCardDiscard(data, config.suit)}
                    </td>
                );
            }
        } else if (option === ConfigNames.HoldaAction) {
            caption += `one card from camp to your board.`;
            PickCampCardHoldaProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.DiscardCard) {
            caption += `one card to discard from current tavern.`;
            DiscardCardProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.GetMjollnirProfit) {
            caption += `suit to get Mjöllnir profit from ranks on that suit.`;
            GetMjollnirProfitProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.StartOrPassEnlistmentMercenaries) {
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.EnlistmentMercenaries) {
            caption += `mercenary to place it to your player board.`;
            GetEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
        } else if (option === ConfigNames.PlaceEnlistmentMercenaries) {
            const card: PickedCardType =
                data.G.publicPlayers[Number(data.ctx.currentPlayer)].pickedCard;
            if (card !== null) {
                caption += `suit to place ${card.name} to that suit.`;
                PlaceEnlistmentMercenariesProfit(data.G, data.ctx, data, boardCells);
            }
        } else if (option === ConfigNames.AddCoinToPouchVidofnirVedrfolnir) {
            caption += `${data.G.actionsNum} coin${data.G.actionsNum > 1 ? `s` : ``} to add to your pouch to fill it.`;
            AddCoinToPouchProfit(data.G, data.ctx, data, boardCells);
        } else {
            if (config !== undefined) {
                caption += `coin to upgrade up to ${config.value}.`;
                if (option === ConfigNames.VidofnirVedrfolnirAction) {
                    UpgradeCoinVidofnirVedrfolnirProfit(data.G, data.ctx, data, boardCells);
                } else if (option === ConfigNames.UpgradeCoin) {
                    // todo Move to ProfitHelpers and add logic for bot or just use standard upgrade coins
                    const handCoins = data.G.publicPlayers[Number(data.ctx.currentPlayer)].handCoins
                        .filter((coin: CoinType): boolean => coin !== null);
                    let handCoinIndex = -1;
                    for (let j = 0; j <
                        data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins.length; j++) {
                        // todo Check .? for all coins!!! and delete AS
                        if (data.G.publicPlayers[Number(data.ctx.currentPlayer)].buffs.everyTurn ===
                            HeroNames.Uline
                            && data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j] === null) {
                            handCoinIndex++;
                            const handCoinId: number =
                                data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                    .handCoins.findIndex((coin: CoinType): boolean =>
                                        coin?.value === handCoins[handCoinIndex]?.value
                                        && coin?.isInitial === handCoins[handCoinIndex]?.isInitial);
                            if (data.G.publicPlayers[Number(data.ctx.currentPlayer)].handCoins[handCoinId]
                                && !data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                    .handCoins[handCoinId]?.isTriggerTrading) {
                                DrawCoin(data, boardCells, `coin`,
                                    data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                        .handCoins[handCoinId], j,
                                    data.G.publicPlayers[Number(data.ctx.currentPlayer)],
                                    `border-2`, null,
                                    data.moves.ClickCoinToUpgradeMove.name, j, `hand`,
                                    handCoins[handCoinIndex]?.isInitial as boolean);
                            }
                        } else if (data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j]
                            && !data.G.publicPlayers[Number(data.ctx.currentPlayer)].boardCoins[j]
                                ?.isTriggerTrading) {
                            DrawCoin(data, boardCells, `coin`,
                                data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                    .boardCoins[j], j,
                                data.G.publicPlayers[Number(data.ctx.currentPlayer)],
                                `border-2`, null,
                                data.moves.ClickCoinToUpgradeMove.name, j, `board`,
                                data.G.publicPlayers[Number(data.ctx.currentPlayer)]
                                    .boardCoins[j]?.isInitial as boolean);
                        }
                    }
                }
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
export const DrawTaverns = (data: BoardProps<MyGameState>, gridClass: string) => {
    const tavernsBoards: JSX.Element[] = [];
    for (let t = 0; t < data.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells: JSX.Element[] = [];
            for (let j = 0; j < data.G.drawSize; j++) {
                const tavernCard: TavernCardTypes = data.G.taverns[t][j];
                if (tavernCard === null) {
                    boardCells.push(
                        <td key={`${tavernsConfig[t].name} ${j}`}>
                            <span style={Styles.Taverns(t)} className="bg-tavern-icon">

                            </span>
                        </td>
                    );
                } else {
                    let tavernCardSuit: string | null = null;
                    if (isCardNotAction(tavernCard)) {
                        tavernCardSuit = tavernCard.suit;
                    }
                    if (t === data.G.currentTavern) {
                        DrawCard(data, boardCells, tavernCard, j, null,
                            tavernCardSuit, data.moves.ClickCardMove.name, j);
                    } else {
                        DrawCard(data, boardCells, tavernCard, j, null,
                            tavernCardSuit);
                    }
                }
            }
            tavernsBoards.push(
                <table className={`${gridClass} justify-self-center`}
                    key={`Tavern ${tavernsConfig[t].name} board`}>
                    <caption className="whitespace-nowrap">
                        <span style={Styles.Taverns(t)} className="bg-top-tavern-icon">

                        </span> <b>{tavernsConfig[t].name}</b>
                    </caption>
                    <tbody>
                        <tr>{boardCells}</tr>
                    </tbody>
                </table>
            );
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
export const DrawTierCards = (data: BoardProps<MyGameState>): JSX.Element => (
    <b>Tier: <span className="italic">
        {data.G.decks.length - data.G.tierToEnd + 1 > data.G.decks.length ?
            data.G.decks.length : data.G.decks.length - data.G.tierToEnd + 1}
        /{data.G.decks.length} ({data.G.decks.length - data.G.tierToEnd !== 2 ?
            data.G.decks[data.G.decks.length - data.G.tierToEnd].length : 0}
        {data.G.decks.length - data.G.tierToEnd === 0 ? `/`
            + data.G.decks.reduce((count: number, current: DeckCardTypes[]) =>
                count + current.length, 0) : ``} cards left)
    </span></b>
);

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
export const DrawWinner = (data: BoardProps<MyGameState>): JSX.Element => {
    let winner: string;
    if (data.ctx.gameover !== undefined) {
        if (data.G.winner !== undefined) {
            if (data.G.winner.length === 1) {
                winner = `Winner: Player ${data.G.publicPlayers[data.G.winner[0]].nickname}`;
            } else {
                winner = "Winners: ";
                data.G.winner.forEach((playerId: number, index: number): void => {
                    winner += `${index + 1}) Player ${data.G.publicPlayers[playerId].nickname}; `;
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
