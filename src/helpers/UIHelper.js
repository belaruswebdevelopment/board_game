import {GetSuitIndexByName} from "./SuitHelpers";
import {suitsConfig} from "../data/SuitData";
import {Styles} from "../data/StyleData";
import React from "react";

/**
 * Отрисовка сегмента игрового поля по указанным данным.
 * Применения:
 * 1) Используется для отрисовки некоторых сегментов игрового поля.
 *
 * @param objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns {{boardCols: number, lastBoardCol: number, boardRows: number}} Параметры для отрисовки сегмента игрового поля.
 * @constructor
 */
export const DrawBoard = (objectsSize) => {
    const boardRows = Math.floor(Math.sqrt(objectsSize)),
        boardCols = Math.ceil(objectsSize / boardRows),
        lastBoardCol = objectsSize % boardCols;
    return {boardRows, boardCols, lastBoardCol};
};

/**
 * Отрисовка планшета конкретного игрока для дискарда карты.
 * Применения:
 * 1) Отрисовка планшета конкретного игрока для дискарда карты по действию артефакта Brisingamens.
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawPlayerBoardForCardDiscard = (data) => {
    const playerHeaders = [],
        playerRows = [];
    for (const suit in suitsConfig) {
        playerHeaders.push(
            <th className={`${suitsConfig[suit].suitColor}`}
                key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} ${suitsConfig[suit].suitName}`}>
                <span style={Styles.Suits(suitsConfig[suit].suit)} className="bg-suit-icon">

                </span>
            </th>
        );
    }
    for (let i = 0; ; i++) {
        const playerCells = [];
        let isDrawRow = false,
            isExit = true,
            id = 0;
        playerRows[i] = [];
        for (let j = 0; j < data.props.G.suitsNum; j++) {
            const suit = Object.keys(suitsConfig)[j];
            id = i + j;
            if (data.props.G.players[data.props.ctx.currentPlayer].cards[j] !== undefined &&
                data.props.G.players[data.props.ctx.currentPlayer].cards[j][i] !== undefined) {
                isExit = false;
                if (data.props.G.players[data.props.ctx.currentPlayer].cards[j][i].type !== "герой") {
                    isDrawRow = true;
                    DrawCard(data, playerCells, data.props.G.players[data.props.ctx.currentPlayer].cards[j][i], id,
                        data.props.G.players[data.props.ctx.currentPlayer], suit, "OnClickDiscardCardFromPlayerBoard", j, i);
                } else {
                    playerCells.push(
                        <td key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} empty card ${id}`}>

                        </td>
                    );
                }
            } else {
                playerCells.push(
                    <td key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} empty card ${id}`}>

                    </td>
                );
            }
        }
        if (isDrawRow) {
            playerRows[i].push(
                <tr key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} board row ${i}`}>{playerCells}</tr>
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
 * Отрисовка планшета конкретного игрока для дискарда карты конкретной фракции.
 * Применения:
 * 1) Отрисовка планшета конкретного игрока для дискарда карты конкретной фракции по действию артефакта Hofud.
 *
 * @param data Глобальные параметры.
 * @param suitName Фракция.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
export const DrawPlayerBoardForSuitCardDiscard = (data, suitName) => {
    const playerHeaders = [],
        playerRows = [],
        suitId = GetSuitIndexByName(suitName);
    playerHeaders.push(
        <th className={`${suitsConfig[suitName].suitColor} discard suit`}
            key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} ${suitsConfig[suitName].suitName}`}>
            <span style={Styles.Suits(suitsConfig[suitName].suitName)} className="bg-suit-icon">

            </span>
        </th>
    );
    for (let i = 0; data.props.G.players[data.props.ctx.currentPlayer].cards[suitId].length; i++) {
        for (let j = 0; j < 1; j++) {
            if (data.props.G.players[data.props.ctx.currentPlayer].cards[suitId] !== undefined &&
                data.props.G.players[data.props.ctx.currentPlayer].cards[suitId][i] !== undefined) {
                if (data.props.G.players[data.props.ctx.currentPlayer].cards[suitId][i].type !== "герой") {
                    playerRows[i] = [];
                    const playerCells = [];
                    DrawCard(data, playerCells, data.props.G.players[data.props.ctx.currentPlayer].cards[suitId][i], i,
                        data.props.G.players[data.props.ctx.currentPlayer], suitName, "OnClickDiscardSuitCardFromPlayerBoard", suitId, i);
                    playerRows[i].push(
                        <tr key={`${data.props.G.players[data.props.ctx.currentPlayer].nickname} discard suit card board row ${i}`}>
                            {playerCells}
                        </tr>
                    );
                }
            }
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
 * Отрисовка карт.
 * Применения:
 * 1) Отрисовка карт на игровом поле.
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
export const DrawCard = (data, playerCells, card, id, player = null, suit = null, actionName = null, ...args) => {
    let styles,
        tdClasses,
        spanClasses,
        action;
    switch (actionName) {
        case "OnClickHeroCard":
            action = (...args) => {
                data.props.moves.ClickHeroCard(...args);
            };
            break;
        case "OnClickCampCard":
            action = (...args) => {
                data.props.moves.ClickCampCard(...args);
            };
            break;
        case "OnClickCard":
            action = (...args) => {
                data.props.moves.ClickCard(...args);
            };
            break;
        case "OnClickCardToPickDistinction":
            action = (...args) => {
                data.props.moves.ClickCardToPickDistinction(...args);
            };
            break;
        case "OnClickCardToDiscard":
            action = (...args) => {
                data.props.moves.DiscardCard(...args);
            };
            break;
        case "OnClickCardFromDiscard":
            action = (...args) => {
                data.props.moves.PickDiscardCard(...args);
            };
            break;
        case "OnClickCardToDiscard2Players":
            action = (...args) => {
                data.props.moves.DiscardCard2Players(...args);
            };
            break;
        case "OnClickDiscardCardFromPlayerBoard":
            action = (...args) => {
                data.props.moves.DiscardCardFromPlayerBoard(...args);
            };
            break;
        case "OnClickDiscardSuitCardFromPlayerBoard":
            action = (...args) => {
                data.props.moves.DiscardSuitCardFromPlayerBoard(...args);
            };
            break;
        case "OnClickCampCardHolda":
            action = (...args) => {
                data.props.moves.ClickCampCardHolda(...args);
            };
            break;
        case "OnClickGetEnlistmentMercenaries":
            action = (...args) => {
                data.props.moves.GetEnlistmentMercenaries(...args);
            };
            break;
        default:
            action = null;
    }
    if (suit) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (card.type === "герой") {
        styles = Styles.Heroes(card.game, card.name);
        if (player === null && !card.active) {
            spanClasses = "bg-hero-inactive";
            action = null;
        } else {
            spanClasses = "bg-hero";
        }
        if (suit === null) {
            tdClasses = "bg-gray-600";
        }
    } else if (card.type === "наёмник" || card.type === "артефакт") {
        styles = Styles.CampCards(card.tier, card.path);
        spanClasses = "bg-camp";
        if (suit === null) {
            tdClasses = "bg-yellow-200";
        }
    } else {
        styles = Styles.Cards(card.suit, card.points, card.name);
        spanClasses = "bg-card";
    }
    if (action) {
        tdClasses += " cursor-pointer";
    }
    playerCells.push(
        <td key={`${player?.nickname ? `player ${player?.nickname} ` : ""}${suit} card ${id} ${card.name}`}
            className={tdClasses}
            onClick={() => action?.(...args)}>
            <span style={styles} title={card.description ?? card.name} className={spanClasses}>
                <b>{card.points ?? card.value ?? ""}</b>
            </span>
        </td>
    );
};

/**
 * Отрисовка монет.
 * Применения:
 * 1) Отрисовка монет на игровом поле.
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
export const DrawCoin = (data, playerCells, type, coin, id, player = null, coinClasses = null,
                         additionalParam = null, actionName = null, ...args) => {
    let styles,
        span = null,
        action,
        tdClasses = "bg-yellow-300",
        spanClasses;
    switch (actionName) {
        case "OnClickBoardCoin":
            action = (...args) => {
                data.props.moves.ClickBoardCoin(...args);
            };
            break;
        case "OnClickHandCoin":
            action = (...args) => {
                data.props.moves.ClickHandCoin(...args);
            };
            break;
        case "OnClickCoinToUpgrade":
            action = (...args) => {
                data.props.moves.ClickCoinToUpgrade(...args);
            };
            break;
        case "OnClickCoinToAddToPouch":
            action = (...args) => {
                data.props.moves.AddCoinToPouch(...args);
            };
            break;
        case "OnClickCoinToUpgradeVidofnirVedrfolnir":
            action = (...args) => {
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
        span = (<span className={coinClasses}>
            {additionalParam}
        </span>);
    } else {
        spanClasses = "bg-coin";
        if (coinClasses) {
            spanClasses += ` ${coinClasses}`;
        }
        if (type === "coin") {
            if (coin === undefined) {
                styles = Styles.CoinBack();
            } else {
                styles = Styles.Coin(coin.value, coin.isInitial);
            }
        } else {
            styles = Styles.CoinBack();
            if (type === "back-small-market-coin") {
                span = (<span style={Styles.Exchange()} className="bg-small-market-coin">

                </span>);
            } else if (type === "back-tavern-icon") {
                span = (<span style={Styles.Taverns(additionalParam)} className="bg-tavern-icon">

                </span>)
            }
        }
    }
    playerCells.push(
        <td key={`${player?.nickname ? `player ${player?.nickname} ` : ""}coin ${id}${coin?.value ? ` ${coin?.value}` : " empty"}`}
            className={tdClasses} onClick={() => action?.(...args)}>
            <span style={styles} className={spanClasses}>
                {span}
            </span>
        </td>
    );
};

/**
 * Отрисовка кнопок.
 * Применения:
 * 1) Отрисовка кнопок на игровом поле.
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
export const DrawButton = (data, boardCells, key, name, player = null, actionName = null, ...args) => {
    let action;
    switch (actionName) {
        case "OnClickStartEnlistmentMercenaries":
            action = () => {
                data.props.moves.StartEnlistmentMercenaries();
            };
            break;
        case "OnClickPassEnlistmentMercenaries":
            action = () => {
                data.props.moves.PassEnlistmentMercenaries();
            };
            break;
        default:
            action = null;
    }
    boardCells.push(
        <td key={`${player?.nickname ? `player ${player?.nickname} ` : ""} button ${name}`}
            className="cursor-pointer"
            onClick={() => action?.(...args)}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {name}
            </button>
        </td>
    );
};
