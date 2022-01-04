import { jsx as _jsx } from "react/jsx-runtime";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { RusCardTypes, LogTypes } from "../typescript/enums";
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
 * @param actionName Название действия.
 * @param args Аргументы действия.
 */
export const DrawButton = (data, boardCells, key, name, player, actionName, ...args) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action = null;
    switch (actionName) {
        case data.moves.StartEnlistmentMercenariesMove.name:
            action = data.moves.StartEnlistmentMercenariesMove;
            break;
        case data.moves.PassEnlistmentMercenariesMove.name:
            action = data.moves.PassEnlistmentMercenariesMove;
            break;
        default:
            action = null;
    }
    boardCells.push(_jsx("td", { className: "cursor-pointer", onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("button", { className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", children: name }, void 0) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `Player ${player.nickname} ` : ``}${key}`));
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
 * @param suit Название фракции.
 * @param actionName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCard = (data, playerCells, card, id, player, suit, actionName, ...args) => {
    let styles = { background: `` }, tdClasses = ``, spanClasses = ``, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    action = null;
    switch (actionName) {
        case data.moves.ClickHeroCardMove.name:
            action = data.moves.ClickHeroCardMove;
            break;
        case data.moves.ClickCampCardMove.name:
            action = data.moves.ClickCampCardMove;
            break;
        case data.moves.ClickCardMove.name:
            action = data.moves.ClickCardMove;
            break;
        case data.moves.ClickCardToPickDistinctionMove.name:
            action = data.moves.ClickCardToPickDistinctionMove;
            break;
        case data.moves.DiscardCardMove.name:
            action = data.moves.DiscardCardMove;
            break;
        case data.moves.PickDiscardCardMove.name:
            action = data.moves.PickDiscardCardMove;
            break;
        case data.moves.DiscardCard2PlayersMove.name:
            action = data.moves.DiscardCard2PlayersMove;
            break;
        case data.moves.DiscardCardFromPlayerBoardMove.name:
            action = data.moves.DiscardCardFromPlayerBoardMove;
            break;
        case data.moves.DiscardSuitCardFromPlayerBoardMove.name:
            action = data.moves.DiscardSuitCardFromPlayerBoardMove;
            break;
        case data.moves.ClickCampCardHoldaMove.name:
            action = data.moves.ClickCampCardHoldaMove;
            break;
        case data.moves.GetEnlistmentMercenariesMove.name:
            action = data.moves.GetEnlistmentMercenariesMove;
            break;
        default:
            action = null;
    }
    if (suit !== null && suit !== undefined) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (card.type === RusCardTypes.HERO && `game` in card) {
        styles = Styles.Heroes(card.game, card.name);
        if (player === null && `active` in card && !card.active) {
            spanClasses = `bg-hero-inactive`;
        }
        else {
            spanClasses = `bg-hero`;
        }
        if (suit === null) {
            tdClasses = `bg-gray-600`;
        }
    }
    else if (card.type === RusCardTypes.MERCENARY || card.type === RusCardTypes.ARTEFACT) {
        if (`tier` in card && `path` in card) {
            styles = Styles.CampCards(card.tier, card.path);
        }
        spanClasses = `bg-camp`;
        if (suit === null) {
            tdClasses = `bg-yellow-200`;
        }
    }
    else {
        if (`suit` in card && `points` in card && card.suit !== null) {
            styles = Styles.Cards(card.suit, card.name, card.points);
        }
        else {
            styles = Styles.Cards(null, card.name, null);
        }
        spanClasses = `bg-card`;
    }
    if (actionName !== null) {
        tdClasses += ` cursor-pointer`;
    }
    let description = ``, value = ``;
    if (`description` in card) {
        description = card.description;
    }
    if (`points` in card) {
        value = card.points !== null ? String(card.points) : ``;
    }
    else if (`value` in card) {
        value = String(card.value);
    }
    playerCells.push(_jsx("td", { className: tdClasses, onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("span", { style: styles, title: description !== null && description !== void 0 ? description : card.name, className: spanClasses, children: _jsx("b", { children: value }, void 0) }, void 0) }, `${(player && player.nickname) ? `player ${(player.nickname)} ` : ``}${suit} card ${id} ${card.name}`));
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
 */
export const DrawCoin = (data, playerCells, type, coin, id, player, coinClasses, additionalParam, actionName, ...args) => {
    let styles = { background: `` }, span = null, tdClasses = `bg-yellow-300`, spanClasses = ``, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    action = null;
    switch (actionName) {
        case data.moves.ClickBoardCoinMove.name:
            action = data.moves.ClickBoardCoinMove;
            break;
        case data.moves.ClickHandCoinMove.name:
            action = data.moves.ClickHandCoinMove;
            break;
        case data.moves.ClickCoinToUpgradeMove.name:
            action = data.moves.ClickCoinToUpgradeMove;
            break;
        case data.moves.AddCoinToPouchMove.name:
            action = data.moves.AddCoinToPouchMove;
            break;
        case data.moves.UpgradeCoinVidofnirVedrfolnirMove.name:
            action = data.moves.UpgradeCoinVidofnirVedrfolnirMove;
            break;
        default:
            action = null;
    }
    if (actionName !== null) {
        tdClasses += ` cursor-pointer`;
    }
    if (type === `market`) {
        if (coin !== null) {
            styles = Styles.Coin(coin.value, false);
            spanClasses = `bg-market-coin`;
            if (coinClasses !== null && coinClasses !== undefined) {
                span = (_jsx("span", { className: coinClasses, children: additionalParam }, void 0));
            }
        }
        else {
            AddDataToLog(data.G, LogTypes.ERROR, `ОШИБКА: Монета на рынке не может быть 'null'.`);
        }
    }
    else {
        spanClasses = `bg-coin`;
        if (coinClasses !== null && coinClasses !== undefined) {
            spanClasses += ` ${coinClasses}`;
        }
        if (type === `coin`) {
            if (coin === null) {
                styles = Styles.CoinBack();
            }
            else {
                if (coin.isInitial !== undefined) {
                    styles = Styles.Coin(coin.value, coin.isInitial);
                }
            }
        }
        else {
            styles = Styles.CoinBack();
            if (type === `back-small-market-coin`) {
                span = (_jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }, void 0));
            }
            else if (type === `back-tavern-icon`) {
                if (additionalParam !== null && additionalParam !== undefined) {
                    span = (_jsx("span", { style: Styles.Taverns(additionalParam), className: "bg-tavern-icon" }, void 0));
                }
            }
        }
    }
    playerCells.push(_jsx("td", { className: tdClasses, onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("span", { style: styles, className: spanClasses, children: span }, void 0) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `player ${player.nickname} ` : ``}coin ${id}${coin !== null ? ` ${coin.value}` : ` empty`}`));
};
