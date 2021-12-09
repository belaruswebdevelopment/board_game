import React from "react";
import {CountMarketCoins, ICoin} from "../Coin";
import {INumberValues, suitsConfig} from "../data/SuitData";
import {tavernsConfig} from "../Tavern";
import {Styles} from "../data/StyleData";
import {
    DrawBoard,
    DrawButton,
    DrawCard,
    DrawCoin,
    DrawPlayerBoardForCardDiscard,
    DrawPlayersBoardForSuitCardDiscard,
    IDrawBoardOptions
} from "../helpers/UIHelper";
import {TotalRank} from "../helpers/ScoreHelpers";
import {GameBoard} from "../GameBoard";
import {CampCardTypes, CampDeckCardTypes, DeckCardTypes} from "../GameSetup";

/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле информации о количестве карт по эпохам.
 * @constructor
 */
export const DrawTierCards = (data: GameBoard): JSX.Element => (
    <b>Tier: <span className="italic">
            {data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length ?
                data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1}
        /{data.props.G.decks.length} ({data.props.G.decks.length - data.props.G.tierToEnd !== 2 ?
        data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0}
        {data.props.G.decks.length - data.props.G.tierToEnd === 0 ? "/"
            + data.props.G.decks.reduce((count: number, current: DeckCardTypes[][]) => count + current.length, 0)
            : ""} cards left)
        </span></b>
);

/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле информации о текущем ходу.
 * @constructor
 */
export const DrawCurrentPlayerTurn = (data: GameBoard): JSX.Element => (
    <b>Current player: <span className="italic">Player {Number(data.props.ctx.currentPlayer) + 1}</span> |
        Turn: <span className="italic">{data.props.ctx.turn}</span></b>
);

/**
 * <h3>Отрисовка игровой информации о текущем статусе игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле информации о ходе/победителях игры.
 * @constructor
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
            winner = "Draw!";
        }
    } else {
        winner = "Game is started";
    }
    return (
        <b>Game status: <span className="italic">{winner.trim()}</span></b>
    );
};

/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле рынка монет.
 * @constructor
 */
export const DrawMarketCoins = (data: GameBoard): JSX.Element => {
    const boardRows: JSX.Element[][] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.props.G.marketCoinsUnique.length),
        countMarketCoins: INumberValues = CountMarketCoins(data.props.G);
    for (let i: number = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        boardRows[i] = [];
        for (let j: number = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j,
                tempCoinValue = data.props.G.marketCoinsUnique[increment].value,
                coinClassName: string = countMarketCoins[tempCoinValue] === 0 ? "text-red-500" : "text-blue-500";
            DrawCoin(data, boardCells, "market", data.props.G.marketCoinsUnique[increment],
                increment, null, coinClassName, countMarketCoins[tempCoinValue],
                "OnClickHandCoin", j);
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
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле героев.
 * @constructor
 */
export const DrawHeroes = (data: GameBoard): JSX.Element => {
    const boardRows: JSX.Element[][] = [],
        drawData: IDrawBoardOptions = DrawBoard(data.props.G.heroes.length);
    for (let i: number = 0; i < drawData.boardRows; i++) {
        const boardCells: JSX.Element[] = [];
        boardRows[i] = [];
        for (let j: number = 0; j < drawData.boardCols; j++) {
            const increment: number = i * drawData.boardCols + j;
            DrawCard(data, boardCells, data.props.G.heroes[increment], increment, null,
                null, "OnClickHeroCard", increment);
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
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле преимуществ в конце эпохи.
 * @constructor
 */
export const DrawDistinctions = (data: GameBoard): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    for (let i: number = 0; i < 1; i++) {
        for (let j: number = 0; j < data.props.G.suitsNum; j++) {
            const suit: string = Object.keys(suitsConfig)[j];
            boardCells.push(
                <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                    onClick={() => data.OnClickDistinctionCard(j)}
                    title={suitsConfig[suit].distinction.description}>
                    <span style={Styles.Distinctions(suit)} className="bg-suit-distinction">

                    </span>
                </td>
            );
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
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @param {string} option Опция отрисовки конкретного профита.
 * @returns {JSX.Element} Поле профита.
 * @constructor
 */
export const DrawProfit = (data: GameBoard, option: string): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    let caption: string = "Get ";
    for (let i: number = 0; i < 1; i++) {
        if (option === "placeCards") {
            caption += `suit to place ${data.props.G.actionsNum ? data.props.G.actionsNum : 1} 
            ${data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.drawName}${data.props.G.actionsNum
            > 1 ? "s" : ""} to ${data.props.G.actionsNum > 1 ? "different" : "that"} suit.`;
            for (let j: number = 0; j < data.props.G.suitsNum; j++) {
                const suit: string = Object.keys(suitsConfig)[j];
                if (suit !== data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard?.suit) {
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            key={`Place 
                            ${data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.drawName} 
                            on ${suitsConfig[suit].suitName}`}
                            onClick={() => data.OnClickSuitToPlaceCard(j)}>
                            <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">
                                <b>{data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].variants[suit]
                                    .points ?? ""}</b>
                            </span>
                        </td>
                    );
                }
            }
        } else if (option === "explorerDistinction") {
            caption += "one card to your board.";
            for (let j: number = 0; j < 3; j++) {
                DrawCard(data, boardCells, data.props.G.decks[1][j], j,
                    data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.decks[1][j].suit,
                    "OnClickCardToPickDistinction", j);
            }
        } else if (option === "BonfurAction" || option === "DagdaAction") {
            caption += `${data.props.G.actionsNum} card${data.props.G.actionsNum > 1 ? "s" : ""} to discard from your 
            board.`;
            for (let j: number = 0; j < data.props.G.suitsNum; j++) {
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0] !== undefined
                    && suitsConfig[data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0].suit].suit !==
                    data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit
                    && !(option === "DagdaAction" && data.props.G.actionsNum === 1
                        && suitsConfig[data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0].suit].suit ===
                        (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard
                            && data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.suit))) {
                    const last: number = data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j].length - 1;
                    if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last].type !== "герой") {
                        DrawCard(data, boardCells,
                            data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last], last,
                            data.props.G.publicPlayers[data.props.ctx.currentPlayer],
                            data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last].suit,
                            "OnClickCardToDiscard", j, last);
                    }
                }
            }
        } else if (option === "AndumiaAction" || option === "BrisingamensAction") {
            caption += `${data.props.G.actionsNum} card${data.props.G.actionsNum > 1 ? "s" : ""} from discard pile to 
            your board.`;
            for (let j: number = 0; j < data.props.G.discardCardsDeck.length; j++) {
                DrawCard(data, boardCells, data.props.G.discardCardsDeck[j], j,
                    data.props.G.publicPlayers[data.props.ctx.currentPlayer],
                    data.props.G.discardCardsDeck[j].suit, "OnClickCardFromDiscard", j);
            }
        } else if (option === "BrisingamensEndGameAction") {
            caption += "one card to discard from your board.";
            boardCells.push(
                <td key={`${data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname} discard card`}>
                    {DrawPlayerBoardForCardDiscard(data)}
                </td>
            );
        } else if (option === "HofudAction") {
            caption += "one warrior card to discard from your board.";
            boardCells.push(
                <td key={`Discard ${data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit} suit 
                cardboard`}>
                    {DrawPlayersBoardForSuitCardDiscard(data,
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit)}
                </td>
            );
        } else if (option === "HoldaAction") {
            caption += "one card from camp to your board.";
            for (let j: number = 0; j < data.props.G.campNum; j++) {
                if (data.props.G.camp[j]) {
                    DrawCard(data, boardCells, data.props.G.camp[j], j,
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer],
                        null, "OnClickCampCardHolda", j);
                }
            }
        } else if (option === "discardCard") {
            caption += "one card to discard from current tavern.";
            for (let j: number = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[data.props.G.currentTavern][j]) {
                    DrawCard(data, boardCells, data.props.G.taverns[data.props.G.currentTavern][j],
                        j, data.props.G.publicPlayers[data.props.ctx.currentPlayer],
                        data.props.G.taverns[data.props.G.currentTavern][j].suit,
                        "OnClickCardToDiscard2Players", j);
                }
            }
        } else if (option === "getMjollnirProfit") {
            caption += "suit to get Mjöllnir profit from ranks on that suit.";
            for (let j: number = 0; j < data.props.G.suitsNum; j++) {
                const suit = Object.keys(suitsConfig)[j];
                boardCells.push(
                    <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                        key={`${suit} suit to get Mjöllnir profit`}
                        onClick={() => data.OnClickSuitToGetMjollnirProfit(j)}>
                        <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">
                            <b className="whitespace-nowrap text-white">
                                {data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j].reduce(TotalRank, 0)
                                    * 2}
                            </b>
                        </span>
                    </td>
                );
            }
        } else if (option === "startOrPassEnlistmentMercenaries") {
            caption = "Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.";
            for (let j: number = 0; j < 2; j++) {
                if (j === 0) {
                    DrawButton(data, boardCells, "start Enlistment Mercenaries", "Start",
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer],
                        "OnClickStartEnlistmentMercenaries");
                } else if (data.props.G.publicPlayersOrder.length > 1) {
                    DrawButton(data, boardCells, "pass Enlistment Mercenaries", "Pass",
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer],
                        "OnClickPassEnlistmentMercenaries");
                }
            }
        } else if (option === "enlistmentMercenaries") {
            caption += "mercenary to place it to your player board.";
            const mercenaries = data.props.G.publicPlayers[data.props.ctx.currentPlayer].campCards
                .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник");
            for (let j: number = 0; j < mercenaries.length; j++) {
                DrawCard(data, boardCells, mercenaries[j], j,
                    data.props.G.publicPlayers[data.props.ctx.currentPlayer], null,
                    "OnClickGetEnlistmentMercenaries", j);
            }
        } else if (option === "placeEnlistmentMercenaries") {
            caption += `suit to place ${data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.name} to 
            that suit.`;
            for (let j: number = 0; j < data.props.G.suitsNum; j++) {
                const suit: string = Object.keys(suitsConfig)[j];
                if (suit === (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit]
                    && data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit].suit)) {
                    boardCells.push(
                        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
                            onClick={() => data.OnClickSuitToPlaceMercenary(j)}
                            key={`Place ${data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.name} ${j} 
                            on ${suitsConfig[suit].suitName}`}>
                            <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">
                                <b>{data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0]
                                    .variants[suit].points !== null ?
                                    data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0]
                                        .variants[suit].points : ""}</b>
                            </span>
                        </td>
                    );
                }
            }
        } else if (option === "AddCoinToPouchVidofnirVedrfolnir") {
            caption += `${data.props.G.actionsNum} coin${data.props.G.actionsNum > 1 ? "s" : ""} to add to your pouch 
            to fill it.`;
            for (let j: number = 0; j < data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins.length; j++) {
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].buffs.everyTurn === "Uline"
                    && data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[j] !== null) {
                    DrawCoin(data, boardCells, "coin",
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[j], j,
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2",
                        null, "OnClickCoinToAddToPouch", j);
                }
            }
        } else {
            caption += `coin to upgrade up to 
            ${data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.value}.`;
            if (option === "VidofnirVedrfolnirAction") {
                for (let j = data.props.G.tavernsNum; j <
                data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                    let type: string = "board",
                        isInitial: boolean = false;
                    if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j]
                        && !data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading
                        && data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.coinId !== j) {
                        isInitial = data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isInitial;
                        DrawCoin(data, boardCells, "coin",
                            data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j], j,
                            data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2",
                            null, "OnClickCoinToUpgradeVidofnirVedrfolnir", j, type, isInitial);
                    }
                }
            } else if (option === "upgradeCoin") {
                const handCoins = data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins
                    .filter((coin: ICoin | null): boolean => coin !== null);
                let handCoinIndex: number = -1;
                for (let j: number = 0; j < data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins.length;
                     j++) {
                    let type: string = "board",
                        isInitial: boolean = false;
                    if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].buffs.everyTurn === "Uline"
                        && data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j] === null) {
                        handCoinIndex++;
                        isInitial = handCoins[handCoinIndex].isInitial;
                        const handCoinId: number = data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins
                            .findIndex((coin: ICoin | null): boolean =>
                                coin?.value === handCoins[handCoinIndex].value
                                && coin?.isInitial === handCoins[handCoinIndex].isInitial);
                        if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[handCoinId]
                            && !data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[handCoinId]
                                .isTriggerTrading) {
                            type = "hand";
                            isInitial = handCoins[handCoinIndex].isInitial;
                            DrawCoin(data, boardCells, "coin",
                                data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[handCoinId], j,
                                data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2",
                                null, "OnClickCoinToUpgrade", j, type, isInitial);
                        }
                    } else if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j]
                        && !data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                        isInitial = data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isInitial;
                        DrawCoin(data, boardCells, "coin",
                            data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j], j,
                            data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2",
                            null, "OnClickCoinToUpgrade", j, type, isInitial);
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
 * <h3>Отрисовка карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле кэмпа.
 * @constructor
 */
export const DrawCamp = (data: GameBoard): JSX.Element => {
    const boardCells: JSX.Element[] = [];
    for (let i: number = 0; i < 1; i++) {
        for (let j: number = 0; j < data.props.G.campNum; j++) {
            if (data.props.G.camp[j] === null || data.props.G.camp[j] === undefined) {
                boardCells.push(
                    <td className="bg-yellow-200" key={`Camp ${j} icon`}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </td>
                );
            } else {
                DrawCard(data, boardCells, data.props.G.camp[j], j, null, null,
                    "OnClickCampCard", j);
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
                    {data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? "/"
                        + data.props.G.campDecks.reduce((count: number, current: CampCardTypes[]) => count +
                            current.length, 0) : ""} cards left)
                </span>
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
 * @param {GameBoard} data Глобальные параметры.
 * @param {string} gridClass Класс для отрисовки таверны.
 * @returns {JSX.Element[]} Поле таверн.
 * @constructor
 */
export const DrawTaverns = (data: GameBoard, gridClass: string) => {
    const tavernsBoards: JSX.Element[] = [];
    for (let t: number = 0; t < data.props.G.tavernsNum; t++) {
        for (let i: number = 0; i < 1; i++) {
            const boardCells: JSX.Element[] = [];
            for (let j: number = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells.push(
                        <td key={`${tavernsConfig[t].name} ${j}`}>
                            <span style={Styles.Taverns(t)} className="bg-tavern-icon">

                            </span>
                        </td>
                    );
                } else {
                    if (t === data.props.G.currentTavern) {
                        DrawCard(data, boardCells, data.props.G.taverns[t][j], j, null,
                            data.props.G.taverns[t][j].suit, "OnClickCard", j);
                    } else {
                        DrawCard(data, boardCells, data.props.G.taverns[t][j], j, null,
                            data.props.G.taverns[t][j].suit);
                    }
                }
            }
            tavernsBoards.push(
                <table className={`${gridClass} justify-self-center`} key={`Tavern ${tavernsConfig[t].name} board`}>
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
