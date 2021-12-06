import {GetSuitIndexByName} from "./SuitHelpers";
import {suitsConfig} from "../data/SuitData";
import {IBackground, Styles} from "../data/StyleData";
import React from "react";
import {ArgsTypes} from "../actions/Actions";
import {GameBoard} from "../GameBoard";
import {ICoin} from "../Coin";
import {IPublicPlayer} from "../Player";
import {IHero} from "../Hero";
import {CampDeckCardTypes, DeckCardTypes} from "../GameSetup";

/**
 * <h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns {{boardCols: number, lastBoardCol: number, boardRows: number}} Параметры для отрисовки сегмента игрового поля.
 * @constructor
 */
export const DrawBoard = (objectsSize: number): { boardCols: number, lastBoardCol: number, boardRows: number } => {
    const boardRows: number = Math.floor(Math.sqrt(objectsSize)),
        boardCols: number = Math.ceil(objectsSize / boardRows),
        lastBoardCol: number = objectsSize % boardCols;
    return {boardRows, boardCols, lastBoardCol};
};

/**
 * <h3>Отрисовка планшета конкретного игрока для дискарда карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшета конкретного игрока для дискарда карты по действию артефакта Brisingamens.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawPlayerBoardForCardDiscard = (data: GameBoard): JSX.Element => {
    const playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[][] = [];
    for (const suit in suitsConfig) {
        playerHeaders.push(
            <th className={`${suitsConfig[suit].suitColor}`}
                key={`${data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname} ${suitsConfig[suit].suitName}`}>
                <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">

                </span>
            </th>
        );
    }
    for (let i: number = 0; ; i++) {
        const playerCells: JSX.Element[] = [];
        let isDrawRow: boolean = false,
            isExit: boolean = true,
            id: number = 0;
        playerRows[i] = [];
        for (let j: number = 0; j < data.props.G.suitsNum; j++) {
            const suit: string = Object.keys(suitsConfig)[j];
            id = i + j;
            if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j] !== undefined &&
                data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i] !== undefined) {
                isExit = false;
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i].type !== "герой") {
                    isDrawRow = true;
                    DrawCard(data, playerCells,
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i], id,
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer], suit,
                        "OnClickDiscardCardFromPlayerBoard", j, i);
                } else {
                    playerCells.push(
                        <td key={`${data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname} empty card ${id}`}>

                        </td>
                    );
                }
            } else {
                playerCells.push(
                    <td key={`${data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname} empty card ${id}`}>

                    </td>
                );
            }
        }
        if (isDrawRow) {
            playerRows[i].push(
                <tr key={`${data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname} board row ${i}`}>
                    {playerCells}
                </tr>
            );
        }
        if (isExit) {
            break;
        }
    }
    return (
        <table>
            <thead>
            <tr>{playerHeaders}</tr>
            </thead>
            <tbody>{playerRows}</tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка планшета конкретных игроков для дискарда карты конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшетов конкретных игроков для дискарда карты конкретной фракции по действию артефакта Hofud.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param suitName Фракция.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawPlayersBoardForSuitCardDiscard = (data: GameBoard, suitName: string): JSX.Element => {
    const playersHeaders: JSX.Element[] = [],
        playersRows: JSX.Element[][] = [],
        suitId: number = GetSuitIndexByName(suitName);
    for (let p: number = 0; p < data.props.G.publicPlayers.length; p++) {
        if (p !== Number(data.props.ctx.currentPlayer)) {
            if (data.props.G.publicPlayers[p].cards[suitId] !== undefined &&
                data.props.G.publicPlayers[p].cards[suitId].length) {
                playersHeaders.push(
                    <th className={`${suitsConfig[suitName].suitColor} discard suit`}
                        key={`${data.props.G.publicPlayers[p].nickname} ${suitsConfig[suitName].suitName}`}>
                        <span style={Styles.Suits(suitsConfig[suitName].suitName)} className="bg-suit-icon">
                            {p + 1}
                        </span>
                    </th>
                );
            }
        }
    }
    for (let i: number = 0; ; i++) {
        let isDrawRow: boolean = false,
            isExit: boolean = true;
        playersRows[i] = [];
        const playersCells = [];
        for (let p: number = 0; p < data.props.G.publicPlayers.length; p++) {
            if (p !== Number(data.props.ctx.currentPlayer)) {
                if (data.props.G.publicPlayers[p].cards[suitId] !== undefined &&
                    data.props.G.publicPlayers[p].cards[suitId][i] !== undefined) {
                    if (data.props.G.publicPlayers[p].cards[suitId][i].type !== "герой") {
                        isExit = false;
                        isDrawRow = true;
                        DrawCard(data, playersCells, data.props.G.publicPlayers[p].cards[suitId][i],
                            i, data.props.G.publicPlayers[p], suitName,
                            "OnClickDiscardSuitCardFromPlayerBoard", suitId, p, i);
                    }
                } else {
                    playersCells.push(
                        <td key={`${data.props.G.publicPlayers[p].nickname} discard suit cardboard row ${i}`}>

                        </td>
                    );
                }
            }
        }
        if (isDrawRow) {
            playersRows[i].push(
                <tr key={`Discard suit cardboard row ${i}`}>
                    {playersCells}
                </tr>
            );
        }
        if (isExit) {
            break;
        }
    }
    return (
        <table>
            <thead>
            <tr>{playersHeaders}</tr>
            </thead>
            <tbody>{playersRows}</tbody>
        </table>
    );
};

/**
 * <h3>Отрисовка карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка карт на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param card Карта.
 * @param id Id карты.
 * @param player Игрок.
 * @param suit Фракция.
 * @param actionName Название действия.
 * @param args Аргументы действия.
 * @constructor
 */
export const DrawCard = (data: GameBoard, playerCells: JSX.Element[], card: DeckCardTypes | CampDeckCardTypes | IHero,
                         id: number, player: IPublicPlayer | null, suit?: string | null, actionName?: string,
                         ...args: ArgsTypes):
    void => {
    let styles: IBackground = {background: ""},
        tdClasses: string = "",
        spanClasses: string,
        action: Function | null;
    switch (actionName) {
        case "OnClickHeroCard":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickHeroCard(...args);
            };
            break;
        case "OnClickCampCard":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickCampCard(...args);
            };
            break;
        case "OnClickCard":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickCard(...args);
            };
            break;
        case "OnClickCardToPickDistinction":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickCardToPickDistinction(...args);
            };
            break;
        case "OnClickCardToDiscard":
            action = (...args: ArgsTypes): void => {
                data.props.moves.DiscardCard(...args);
            };
            break;
        case "OnClickCardFromDiscard":
            action = (...args: ArgsTypes): void => {
                data.props.moves.PickDiscardCard(...args);
            };
            break;
        case "OnClickCardToDiscard2Players":
            action = (...args: ArgsTypes): void => {
                data.props.moves.DiscardCard2Players(...args);
            };
            break;
        case "OnClickDiscardCardFromPlayerBoard":
            action = (...args: ArgsTypes): void => {
                data.props.moves.DiscardCardFromPlayerBoard(...args);
            };
            break;
        case "OnClickDiscardSuitCardFromPlayerBoard":
            action = (...args: ArgsTypes): void => {
                data.props.moves.DiscardSuitCardFromPlayerBoard(...args);
            };
            break;
        case "OnClickCampCardHolda":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickCampCardHolda(...args);
            };
            break;
        case "OnClickGetEnlistmentMercenaries":
            action = (...args: ArgsTypes): void => {
                data.props.moves.GetEnlistmentMercenaries(...args);
            };
            break;
        default:
            action = null;
    }
    if (suit) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (card.type === "герой" && "game" in card) {
        styles = Styles.Heroes(card.game, card.name);
        if (player === null && "active" in card && !card.active) {
            spanClasses = "bg-hero-inactive";
            action = null;
        } else {
            spanClasses = "bg-hero";
        }
        if (suit === null) {
            tdClasses = "bg-gray-600";
        }
    } else if (card.type === "наёмник" || card.type === "артефакт") {
        if ("tier" in card && "path" in card) {
            styles = Styles.CampCards(card.tier, card.path);
        }
        spanClasses = "bg-camp";
        if (suit === null) {
            tdClasses = "bg-yellow-200";
        }
    } else {
        if ("suit" in card && "points" in card) {
            if (typeof card.points === "number") {
                styles = Styles.Cards(card.suit, card.points, card.name);
            }
        }
        spanClasses = "bg-card";
    }
    if (action) {
        tdClasses += " cursor-pointer";
    }
    let description: string = "",
        value: string = "";
    if ("description" in card) {
        description = card.description;
    }
    if ("points" in card) {
        value = card.points !== null ? String(card.points) : "";
    } else if ("value" in card) {
        value = String(card.value);
    }
    playerCells.push(
        <td key={`${(player && player.nickname) ? `player ${(player.nickname)} ` : ""}${suit} card ${id} ${card.name}`}
            className={tdClasses} onClick={() => action && action(...args)}>
            <span style={styles} title={description ? description : card.name} className={spanClasses}>
                <b>{value}</b>
            </span>
        </td>
    );
};

/**
 * <h3>Отрисовка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка монет на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param type Тип монеты.
 * @param coin Монета.
 * @param id Id монеты.
 * @param player Игрок.
 * @param coinClasses Дополнительный классы для монеты.
 * @param additionalParam Дополнительные параметры.
 * @param actionName Название действия.
 * @param args Аргументы действия.
 * @constructor
 */
export const DrawCoin = (data: GameBoard, playerCells: JSX.Element[], type: string, coin: ICoin, id: number,
                         player: IPublicPlayer | null, coinClasses?: string | null, additionalParam?: number | null,
                         actionName?: string, ...args: ArgsTypes): void => {
    let styles: IBackground = {background: ""},
        span = null,
        action: Function | null,
        tdClasses: string = "bg-yellow-300",
        spanClasses: string;
    switch (actionName) {
        case "OnClickBoardCoin":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickBoardCoin(...args);
            };
            break;
        case "OnClickHandCoin":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickHandCoin(...args);
            };
            break;
        case "OnClickCoinToUpgrade":
            action = (...args: ArgsTypes): void => {
                data.props.moves.ClickCoinToUpgrade(...args);
            };
            break;
        case "OnClickCoinToAddToPouch":
            action = (...args: ArgsTypes): void => {
                data.props.moves.AddCoinToPouch(...args);
            };
            break;
        case "OnClickCoinToUpgradeVidofnirVedrfolnir":
            action = (...args: ArgsTypes): void => {
                data.props.moves.UpgradeCoinVidofnirVedrfolnir(...args);
            };
            break;
        default:
            action = null;
    }
    if (action) {
        tdClasses += " cursor-pointer";
    }
    if (type === "market") {
        styles = Styles.Coin(coin.value, false);
        spanClasses = "bg-market-coin";
        if (coinClasses) {
            span = (<span className={coinClasses}>
                {additionalParam}
            </span>);
        }
    } else {
        spanClasses = "bg-coin";
        if (coinClasses) {
            spanClasses += ` ${coinClasses}`;
        }
        if (type === "coin") {
            if (coin === undefined) {
                styles = Styles.CoinBack();
            } else {
                if (typeof coin.isInitial !== "undefined") {
                    styles = Styles.Coin(coin.value, coin.isInitial);
                }
            }
        } else {
            styles = Styles.CoinBack();
            if (type === "back-small-market-coin") {
                span = (<span style={Styles.Exchange()} className="bg-small-market-coin">

                </span>);
            } else if (type === "back-tavern-icon") {
                if (typeof additionalParam === "number") {
                    span = (<span style={Styles.Taverns(additionalParam)} className="bg-tavern-icon">

                    </span>)
                }
            }
        }
    }
    playerCells.push(
        <td key={`${(player && player.nickname) ? `player ${player.nickname} ` : ""}coin ${id}${coin ? ` ${coin.value}`
            : " empty"}`} className={tdClasses} onClick={() => action && action(...args)}>
            <span style={styles} className={spanClasses}>
                {span}
            </span>
        </td>
    );
};

/**
 * <h3>Отрисовка кнопок.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка кнопок на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @param key Ключ.
 * @param name Имя кнопки.
 * @param player Игрок.
 * @param actionName
 * @param args Аргументы действия.
 * @constructor
 */
export const DrawButton = (data: GameBoard, boardCells: JSX.Element[], key: string, name: string, player: IPublicPlayer,
                           actionName?: string, ...args: ArgsTypes): void => {
    let action: Function | null;
    switch (actionName) {
        case "OnClickStartEnlistmentMercenaries":
            action = (): void => {
                data.props.moves.StartEnlistmentMercenaries();
            };
            break;
        case "OnClickPassEnlistmentMercenaries":
            action = (): void => {
                data.props.moves.PassEnlistmentMercenaries();
            };
            break;
        default:
            action = null;
    }
    boardCells.push(
        <td key={`${(player && player.nickname) ? `Player ${player.nickname} ` : ""}${key}`}
            className="cursor-pointer" onClick={() => action && action(...args)}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {name}
            </button>
        </td>
    );
};
