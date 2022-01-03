import { isCardNotAction } from "../Card";
import { CountMarketCoins } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { GameBoard } from "../GameBoard";
import { PlaceCardsProfit, DiscardCardFromBoardProfit, PickDiscardCardProfit, PickCampCardHoldaProfit, DiscardCardProfit, GetMjollnirProfitProfit, StartEnlistmentMercenariesProfit, GetEnlistmentMercenariesProfit, PlaceEnlistmentMercenariesProfit, AddCoinToPouchProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "../helpers/ProfitHelpers";
import { DrawCard, OnClickCampCard, DrawBoard, OnClickHeroCard, DrawCoin, OnClickHandCoin, OnClickCardToPickDistinction, DrawPlayerBoardForCardDiscard, DrawPlayersBoardForSuitCardDiscard, OnClickCoinToUpgrade, OnClickCard } from "../helpers/UIHelpers";
import { tavernsConfig } from "../Tavern";
import { CampCardTypes, PickedCardType, TavernCardTypes, DeckCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { ConfigNames, HeroNames } from "../typescript/enums";
import { IDrawBoardOptions, INumberValues, IConfig } from "../typescript/interfaces";

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
export const DrawCamp = (data: GameBoard): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.props.G.campNum; j++) {
            const campCard: CampCardTypes = data.props.G.camp[j];
            if (campCard === null || data.props.G.camp[j] === undefined) {
                boardCells.push(
                    <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </td>
                );
            } else {
                DrawCard(data, boardCells, campCard, j, null, null,
                    OnClickCampCard.name, j);
            }
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.Camp()} className="bg-top-camp-icon">

                </span>
                <span>Camp {data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length ?
                    data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1}
                    ({data.props.G.campDecks.length - data.props.G.tierToEnd !== 2 ?
                        data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd].length : 0}
                    {data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? `/`
                        + data.props.G.campDecks
                            .reduce((count: number, current: CampCardTypes[]) =>
                                count + current.length, 0) : ""} cards left)
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
export const DrawCurrentPlayerTurn = (data: GameBoard): JSX.Element => (
    <b>Current player: <span className="italic">Player {Number(data.props.ctx.currentPlayer) + 1}</span> |
        Turn: <span className="italic">{data.props.ctx.turn}</span></b>
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
export const DrawDistinctions = (data: GameBoard): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    for (let i = 0; i < 1; i++) {
        for (const suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                boardCells.push(
                    <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                        onClick={() => data.OnClickDistinctionCard(suit)}
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
export const DrawHeroes = (data: GameBoard): JSX.Element => {
    const boardRows: JSX.Element[][] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.props.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j;
            DrawCard(data, boardCells, data.props.G.heroes[increment], increment, null,
                null, OnClickHeroCard.name, increment);
            if (increment + 1 === data.props.G.heroes.length) {
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

                </span> <span>Heroes ({data.props.G.heroes.length} left)</span>
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
export const DrawMarketCoins = (data: GameBoard): JSX.Element => {
    const boardRows: JSX.Element[][] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.props.G.marketCoinsUnique.length),
        countMarketCoins: INumberValues = CountMarketCoins(data.props.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                tempCoinValue = data.props.G.marketCoinsUnique[increment].value,
                coinClassName: string = countMarketCoins[tempCoinValue] === 0 ? `text-red-500` : `text-blue-500`;
            DrawCoin(data, boardCells, `market`, data.props.G.marketCoinsUnique[increment],
                increment, null, coinClassName, countMarketCoins[tempCoinValue],
                OnClickHandCoin.name, j);
            if (increment + 1 === data.props.G.marketCoinsUnique.length) {
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

                    </span> Market coins ({data.props.G.marketCoins.length} left)</span>
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
 * @param option Опция отрисовки конкретного профита.
 * @returns Поле профита.
 */
export const DrawProfit = (data: GameBoard, option: string): JSX.Element => {
    const boardCells: JSX.Element[] = [],
        config: IConfig | undefined =
            data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].stack[0].config;
    let caption = `Get `;
    for (let i = 0; i < 1; i++) {
        if (option === ConfigNames.PlaceCards) {
            if (config !== undefined) {
                caption += `suit to place ${data.props.G.actionsNum ?? 1} ${config.drawName} ${data.props.G.actionsNum > 1 ? `s` : ``} to ${data.props.G.actionsNum > 1 ? `different` : `that`} suit.`;
                PlaceCardsProfit(data.props.G, data.props.ctx, data, boardCells);
            }
        } else if (option === ConfigNames.ExplorerDistinction) {
            caption += `one card to your board.`;
            // todo Move to ProfitHelpers and add logic for bot or just use standard pick cards / upgrade coins
            for (let j = 0; j < 3; j++) {
                const card = data.props.G.decks[1][j];
                let suit: null | string = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, data.props.G.decks[1][j], j,
                    data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)], suit,
                    OnClickCardToPickDistinction.name, j);
            }
        } else if (option === ConfigNames.BonfurAction || option === ConfigNames.DagdaAction) {
            caption += `${data.props.G.actionsNum} card${data.props.G.actionsNum > 1 ? `s` : ``} to discard from your board.`;
            DiscardCardFromBoardProfit(data.props.G, data.props.ctx, data, boardCells);
        } else if (option === ConfigNames.AndumiaAction || option === ConfigNames.BrisingamensAction) {
            caption += `${data.props.G.actionsNum} card${data.props.G.actionsNum > 1 ? `s` : ``} from discard pile to your board.`;
            PickDiscardCardProfit(data.props.G, data.props.ctx, data, boardCells);
        } else if (option === ConfigNames.BrisingamensEndGameAction) {
            caption += `one card to discard from your board.`;
            boardCells.push(
                <td
                    key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} discard card`}>
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
            PickCampCardHoldaProfit(data.props.G, data.props.ctx, data, boardCells);
        } else if (option === ConfigNames.DiscardCard) {
            caption += `one card to discard from current tavern.`;
            DiscardCardProfit(data.props.G, data.props.ctx, data, boardCells);
        } else if (option === ConfigNames.GetMjollnirProfit) {
            caption += `suit to get Mjöllnir profit from ranks on that suit.`;
            GetMjollnirProfitProfit(data.props.G, data.props.ctx, data, boardCells);
        } else if (option === ConfigNames.StartOrPassEnlistmentMercenaries) {
            caption = `Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.`;
            StartEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
        } else if (option === ConfigNames.EnlistmentMercenaries) {
            caption += `mercenary to place it to your player board.`;
            GetEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
        } else if (option === ConfigNames.PlaceEnlistmentMercenaries) {
            const card: PickedCardType =
                data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].pickedCard;
            if (card !== null) {
                caption += `suit to place ${card.name} to that suit.`;
                PlaceEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
            }
        } else if (option === ConfigNames.AddCoinToPouchVidofnirVedrfolnir) {
            caption += `${data.props.G.actionsNum} coin${data.props.G.actionsNum > 1 ? `s` : ``} to add to your pouch to fill it.`;
            AddCoinToPouchProfit(data.props.G, data.props.ctx, data, boardCells);
        } else {
            if (config !== undefined) {
                caption += `coin to upgrade up to ${config.value}.`;
                if (option === ConfigNames.VidofnirVedrfolnirAction) {
                    UpgradeCoinVidofnirVedrfolnirProfit(data.props.G, data.props.ctx, data, boardCells);
                } else if (option === ConfigNames.UpgradeCoin) {
                    // todo Move to ProfitHelpers and add logic for bot or just use standard upgrade coins
                    const handCoins = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].handCoins
                        .filter((coin: CoinType): boolean => coin !== null);
                    let handCoinIndex = -1;
                    for (let j = 0; j <
                        data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins.length; j++) {
                        // todo Check .? for all coins!!! and delete AS
                        if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].buffs.everyTurn ===
                            HeroNames.Uline
                            && data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j] ===
                            null) {
                            handCoinIndex++;
                            const handCoinId: number =
                                data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .handCoins.findIndex((coin: CoinType): boolean =>
                                        coin?.value === handCoins[handCoinIndex]?.value
                                        && coin?.isInitial === handCoins[handCoinIndex]?.isInitial);
                            if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .handCoins[handCoinId]
                                && !data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .handCoins[handCoinId]?.isTriggerTrading) {
                                DrawCoin(data, boardCells, `coin`,
                                    data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                        .handCoins[handCoinId], j,
                                    data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)],
                                    `border-2`, null, OnClickCoinToUpgrade.name,
                                    j, `hand`, handCoins[handCoinIndex]?.isInitial as boolean);
                            }
                        } else if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]
                            && !data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]
                                ?.isTriggerTrading) {
                            DrawCoin(data, boardCells, `coin`,
                                data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .boardCoins[j], j,
                                data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)],
                                `border-2`, null, OnClickCoinToUpgrade.name,
                                j, `board`,
                                data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
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
export const DrawTaverns = (data: GameBoard, gridClass: string) => {
    const tavernsBoards: JSX.Element[] = [];
    for (let t = 0; t < data.props.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells: JSX.Element[] = [];
            for (let j = 0; j < data.props.G.drawSize; j++) {
                const tavernCard: TavernCardTypes = data.props.G.taverns[t][j];
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
                    if (t === data.props.G.currentTavern) {
                        DrawCard(data, boardCells, tavernCard, j, null, tavernCardSuit,
                            OnClickCard.name, j);
                    } else {
                        DrawCard(data, boardCells, tavernCard, j, null, tavernCardSuit);
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
export const DrawTierCards = (data: GameBoard): JSX.Element => (
    <b>Tier: <span className="italic">
        {data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length ?
            data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1}
        /{data.props.G.decks.length} ({data.props.G.decks.length - data.props.G.tierToEnd !== 2 ?
            data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0}
        {data.props.G.decks.length - data.props.G.tierToEnd === 0 ? `/`
            + data.props.G.decks.reduce((count: number, current: DeckCardTypes[]) =>
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
export const DrawWinner = (data: GameBoard): JSX.Element => {
    let winner: string;
    if (data.props.ctx.gameover !== undefined) {
        if (data.props.G.winner !== undefined) {
            if (data.props.G.winner.length === 1) {
                winner = `Winner: Player ${data.props.G.publicPlayers[data.props.G.winner[0]].nickname}`;
            } else {
                winner = "Winners: ";
                data.props.G.winner.forEach((playerId: number, index: number): void => {
                    winner += `${index + 1}) Player ${data.props.G.publicPlayers[playerId].nickname}; `;
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
