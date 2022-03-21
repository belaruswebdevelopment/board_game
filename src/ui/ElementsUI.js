import { jsx as _jsx } from "react/jsx-runtime";
import { IsArtefactCard, IsMercenaryCampCard, IsMercenaryPlayerCard } from "../Camp";
import { IsActionCard } from "../Card";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { IsHeroCard } from "../Hero";
import { ArtefactNames, MoveNames } from "../typescript/enums";
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
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawButton = (data, boardCells, key, name, player, moveName, ...args) => {
    let action;
    switch (moveName) {
        case MoveNames.StartEnlistmentMercenariesMove:
            action = data.moves.StartEnlistmentMercenariesMove;
            break;
        case MoveNames.PassEnlistmentMercenariesMove:
            action = data.moves.PassEnlistmentMercenariesMove;
            break;
        default:
            throw new Error(`Нет такого мува.`);
    }
    boardCells.push(_jsx("td", { className: "cursor-pointer", onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("button", { className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", children: name }) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `Player ${player.nickname} ` : ``}${key}`));
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
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCard = (data, playerCells, card, id, player, suit, moveName, ...args) => {
    let styles = { background: `` }, tdClasses = ``, spanClasses = ``, action;
    if (moveName !== undefined) {
        switch (moveName) {
            case MoveNames.ClickHeroCardMove:
                action = data.moves.ClickHeroCardMove;
                break;
            case MoveNames.ClickCampCardMove:
                action = data.moves.ClickCampCardMove;
                break;
            case MoveNames.ClickCardMove:
                action = data.moves.ClickCardMove;
                break;
            case MoveNames.ClickCardToPickDistinctionMove:
                action = data.moves.ClickCardToPickDistinctionMove;
                break;
            case MoveNames.DiscardCardMove:
                action = data.moves.DiscardCardMove;
                break;
            case MoveNames.PickDiscardCardMove:
                action = data.moves.PickDiscardCardMove;
                break;
            case MoveNames.DiscardCard2PlayersMove:
                action = data.moves.DiscardCard2PlayersMove;
                break;
            case MoveNames.DiscardCardFromPlayerBoardMove:
                action = data.moves.DiscardCardFromPlayerBoardMove;
                break;
            case MoveNames.DiscardSuitCardFromPlayerBoardMove:
                action = data.moves.DiscardSuitCardFromPlayerBoardMove;
                break;
            case MoveNames.ClickCampCardHoldaMove:
                action = data.moves.ClickCampCardHoldaMove;
                break;
            case MoveNames.GetEnlistmentMercenariesMove:
                action = data.moves.GetEnlistmentMercenariesMove;
                break;
            default:
                throw new Error(`Нет такого мува.`);
        }
    }
    else {
        action = null;
    }
    if (suit !== null) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (IsHeroCard(card)) {
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
    else if (IsMercenaryCampCard(card) || IsArtefactCard(card) || IsMercenaryPlayerCard(card)) {
        styles = Styles.CampCards(card.tier, card.path);
        spanClasses = `bg-camp`;
        if (suit === null) {
            tdClasses = `bg-yellow-200`;
        }
    }
    else {
        if (!IsActionCard(card)) {
            styles = Styles.Cards(card.suit, card.name, card.points);
        }
        else {
            styles = Styles.Cards(null, card.name, null);
        }
        spanClasses = `bg-card`;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    let description = ``, value = ``;
    if (`description` in card) {
        description = card.description;
    }
    if (`points` in card) {
        if (IsArtefactCard(card) && card.name === ArtefactNames.Odroerir_The_Mythic_Cauldron) {
            value = String(GetOdroerirTheMythicCauldronCoinsValues(data.G));
        }
        else {
            value = card.points !== null ? String(card.points) : ``;
        }
    }
    else if (IsActionCard(card)) {
        value = String(card.value);
    }
    playerCells.push(_jsx("td", { className: tdClasses, onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("span", { style: styles, title: description !== null && description !== void 0 ? description : card.name, className: spanClasses, children: _jsx("b", { children: value }) }) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `player ${player.nickname} ` : ``}${suit} card ${id} ${card.name}`));
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
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCoin = (data, playerCells, type, coin, id, player, coinClasses, additionalParam, moveName, ...args) => {
    let styles = { background: `` }, span = null, tdClasses = `bg-yellow-300`, spanClasses = ``, action;
    if (moveName !== undefined) {
        switch (moveName) {
            case MoveNames.ClickBoardCoinMove:
                action = data.moves.ClickBoardCoinMove;
                break;
            case MoveNames.ClickHandCoinMove:
                action = data.moves.ClickHandCoinMove;
                break;
            case MoveNames.ClickHandCoinUlineMove:
                action = data.moves.ClickHandCoinUlineMove;
                break;
            case MoveNames.ClickHandTradingCoinUlineMove:
                action = data.moves.ClickHandTradingCoinUlineMove;
                break;
            case MoveNames.ClickCoinToUpgradeMove:
                action = data.moves.ClickCoinToUpgradeMove;
                break;
            case MoveNames.AddCoinToPouchMove:
                action = data.moves.AddCoinToPouchMove;
                break;
            case MoveNames.UpgradeCoinVidofnirVedrfolnirMove:
                action = data.moves.UpgradeCoinVidofnirVedrfolnirMove;
                break;
            default:
                throw new Error(`Нет такого мува.`);
        }
    }
    else {
        action = null;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    if (type === `market`) {
        if (!IsCoin(coin)) {
            throw new Error(`Монета на рынке не может отсутствовать.`);
        }
        styles = Styles.Coin(coin.value, false);
        spanClasses = `bg-market-coin`;
        if (coinClasses !== null && coinClasses !== undefined) {
            span = (_jsx("span", { className: coinClasses, children: additionalParam }));
        }
    }
    else if (type === `hidden-coin`) {
        spanClasses = `bg-coin`;
        if (IsCoin(coin) && coinClasses !== null && coinClasses !== undefined) {
            styles = Styles.CoinBack();
            span = (_jsx("span", { style: Styles.CoinSmall(coin.value, coin.isInitial), className: coinClasses }));
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
                if (IsCoin(coin) && coin.isInitial !== undefined) {
                    styles = Styles.Coin(coin.value, coin.isInitial);
                }
            }
        }
        else {
            styles = Styles.CoinBack();
            if (type === `back-small-market-coin`) {
                span = (_jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }));
            }
            else if (type === `back-tavern-icon`) {
                if (additionalParam !== null && additionalParam !== undefined) {
                    span = (_jsx("span", { style: Styles.Taverns(additionalParam), className: "bg-tavern-icon" }));
                }
            }
        }
    }
    playerCells.push(_jsx("td", { className: tdClasses, onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("span", { style: styles, className: spanClasses, children: span }) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `player ${player.nickname} ` : ``}coin ${id}${IsCoin(coin) ? ` ${coin.value}` : ` empty`}`));
};
export const DrawSuit = (data, boardCells, suit, key, value, player, moveName) => {
    let action;
    switch (moveName) {
        case MoveNames.GetMjollnirProfitMove:
            action = data.moves.GetMjollnirProfitMove;
            break;
        case MoveNames.ClickHandCoinMove:
            action = data.moves.ClickHandCoinMove;
            break;
        case MoveNames.ClickHandCoinUlineMove:
            action = data.moves.ClickHandCoinUlineMove;
            break;
        case MoveNames.PlaceThrudHeroMove:
            action = data.moves.PlaceThrudHeroMove;
            break;
        case MoveNames.PlaceYludHeroMove:
            action = data.moves.PlaceYludHeroMove;
            break;
        case MoveNames.PlaceOlwinCardMove:
            action = data.moves.PlaceOlwinCardMove;
            break;
        case MoveNames.PlaceEnlistmentMercenariesMove:
            action = data.moves.PlaceEnlistmentMercenariesMove;
            break;
        default:
            throw new Error(`Нет такого мува.`);
    }
    boardCells.push(_jsx("td", { className: `${suitsConfig[suit].suitColor} cursor-pointer`, onClick: () => action === null || action === void 0 ? void 0 : action(suit), children: _jsx("span", { style: Styles.Suits(suit), className: "bg-suit-icon", children: _jsx("b", { className: "whitespace-nowrap text-white", children: value }) }) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `player ${player.nickname} ` : ``}choose ${suit} suit to ${key}`));
};
//# sourceMappingURL=ElementsUI.js.map