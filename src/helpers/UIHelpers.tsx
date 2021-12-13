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
import {AddDataToLog, LogTypes} from "../Logging";
import {DiscardAnyCardFromPlayerBoardProfit} from "./ProfitHelpers";

export interface IDrawBoardOptions {
    boardCols: number,
    lastBoardCol: number,
    boardRows: number,
}

/**
 * h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param {number} objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns {IDrawBoardOptions} Параметры для отрисовки сегмента игрового поля.
 * @constructor
 */
export const DrawBoard = (objectsSize: number): IDrawBoardOptions => {
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
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле для вывода карт для дискарда.
 * @constructor
 */
export const DrawPlayerBoardForCardDiscard = (data: GameBoard): JSX.Element => {
    const playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[][] = [];
    for (const suit in suitsConfig) {
        playerHeaders.push(
            <th className={`${suitsConfig[suit].suitColor}`}
                key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} 
                ${suitsConfig[suit].suitName}`}>
                <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">

                </span>
            </th>
        );
    }
    DiscardAnyCardFromPlayerBoardProfit(data.props.G, data.props.ctx, data, playerRows);
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
 * @param {GameBoard} data Глобальные параметры.
 * @param {string} suitName Фракция.
 * @returns {JSX.Element} Поле игрока для дискарда карты фракции.
 * @constructor
 */
export const DrawPlayersBoardForSuitCardDiscard = (data: GameBoard, suitName: string): JSX.Element => {
    const playersHeaders: JSX.Element[] = [],
        playersRows: JSX.Element[][] = [],
        suitId: number = GetSuitIndexByName(suitName);
    for (let p: number = 0; p < data.props.G.publicPlayers.length; p++) {
        if (p !== Number(data.props.ctx.currentPlayer)) {
            if (data.props.G.publicPlayers[p].cards[suitId] !== undefined
                && data.props.G.publicPlayers[p].cards[suitId].length) {
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
        const playersCells: JSX.Element[] = [];
        for (let p: number = 0; p < data.props.G.publicPlayers.length; p++) {
            if (p !== Number(data.props.ctx.currentPlayer)) {
                if (data.props.G.publicPlayers[p].cards[suitId] !== undefined
                    && data.props.G.publicPlayers[p].cards[suitId][i] !== undefined) {
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
 * @param {GameBoard} data Глобальные параметры.
 * @param {JSX.Element[]} playerCells Ячейки для отрисовки.
 * @param {DeckCardTypes | CampDeckCardTypes | IHero} card Карта.
 * @param {number} id Id карты.
 * @param {IPublicPlayer | null} player Игрок.
 * @param {string | null} suit Фракция.
 * @param {string} actionName Название действия.
 * @param {string | number | boolean | object | null} args Аргументы действия.
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
    if (suit !== null && suit !== undefined) {
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
        if ("suit" in card && "points" in card && card.suit !== null) {
            styles = Styles.Cards(card.suit, card.name, card.points);
        } else {
            styles = Styles.Cards(null, card.name, null);
        }
        spanClasses = "bg-card";
    }
    if (action !== null) {
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
 * @param {GameBoard} data Глобальные параметры.
 * @param {JSX.Element[]} playerCells Ячейки для отрисовки.
 * @param {string} type Тип монеты.
 * @param {ICoin} coin Монета.
 * @param {number} id Id монеты.
 * @param {IPublicPlayer | null} player Игрок.
 * @param {string | null} coinClasses Дополнительный классы для монеты.
 * @param {number | null} additionalParam Дополнительные параметры.
 * @param {string} actionName Название действия.
 * @param {string | number | boolean | object | null} args Аргументы действия.
 * @constructor
 */
export const DrawCoin = (data: GameBoard, playerCells: JSX.Element[], type: string, coin: ICoin | null, id: number,
                         player: IPublicPlayer | null, coinClasses?: string | null, additionalParam?: number | null,
                         actionName?: string, ...args: ArgsTypes): void => {
    let styles: IBackground = {background: ""},
        span = null,
        action: Function | null,
        tdClasses: string = "bg-yellow-300",
        spanClasses: string = "";
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
    if (action !== null) {
        tdClasses += " cursor-pointer";
    }
    if (type === "market") {
        if (coin !== null) {
            styles = Styles.Coin(coin.value, false);
            spanClasses = "bg-market-coin";
            if (coinClasses !== null && coinClasses !== undefined) {
                span = (<span className={coinClasses}>
                    {additionalParam}
                </span>);
            }
        } else {
            AddDataToLog(data.props.G, LogTypes.ERROR, `ОШИБКА: Монета на рынке не может быть 'null'.`);
        }
    } else {
        spanClasses = "bg-coin";
        if (coinClasses !== null && coinClasses !== undefined) {
            spanClasses += ` ${coinClasses}`;
        }
        if (type === "coin") {
            if (coin === null) {
                styles = Styles.CoinBack();
            } else {
                if (coin.isInitial !== undefined) {
                    styles = Styles.Coin(coin.value, coin.isInitial);
                }
            }
        } else {
            styles = Styles.CoinBack();
            if (type === "back-small-market-coin") {
                span = (<span style={Styles.Exchange()} className="bg-small-market-coin">

                </span>);
            } else if (type === "back-tavern-icon") {
                if (additionalParam !== null && additionalParam !== undefined) {
                    span = (<span style={Styles.Taverns(additionalParam)} className="bg-tavern-icon">

                    </span>);
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
 * @param {GameBoard} data Глобальные параметры.
 * @param {JSX.Element[]} boardCells Ячейки для отрисовки.
 * @param {string} key Ключ.
 * @param {string} name Имя кнопки.
 * @param {IPublicPlayer} player Игрок.
 * @param {string} actionName Название действия.
 * @param {string | number | boolean | object | null} args Аргументы действия.
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
        <td key={`${player?.nickname ? `Player ${player.nickname} ` : ""}${key}`}
            className="cursor-pointer" onClick={() => action !== null && action(...args)}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {name}
            </button>
        </td>
    );
};
