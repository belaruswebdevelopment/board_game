import { jsx as _jsx } from "react/jsx-runtime";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { ArtefactNames, MoveNames, RusCardTypeNames } from "../typescript/enums";
/**
 * <h3>Отрисовка кнопок.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка кнопок на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @param name Имя кнопки.
 * @param player Игрок.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawButton = (data, boardCells, name, player, moveName, ...args) => {
    let action;
    switch (moveName) {
        case MoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove:
            // TODO Think about all data.moves.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove! -> ChooseCoinValueForVidofnirVedrfolnirUpgradeMove but get dependency cycle...
            action = data.moves.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove;
            break;
        case MoveNames.ChooseDifficultyLevelForSoloModeMove:
            action = data.moves.ChooseDifficultyLevelForSoloModeMove;
            break;
        case MoveNames.StartEnlistmentMercenariesMove:
            action = data.moves.StartEnlistmentMercenariesMove;
            break;
        case MoveNames.PassEnlistmentMercenariesMove:
            action = data.moves.PassEnlistmentMercenariesMove;
            break;
        default:
            throw new Error(`Нет такого мува '${moveName}'.`);
    }
    boardCells.push(_jsx("td", { className: "cursor-pointer", onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("button", { className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", children: name }) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `Player ${player.nickname} ` : ``}${name}`));
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
 * @param suit Название фракции дворфов.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCard = (data, playerCells, card, id, player, suit, moveName, ...args) => {
    let styles = { background: `` }, tdClasses = ``, spanClasses = ``, description = ``, value = ``, action;
    if (`description` in card) {
        description += card.description;
    }
    if (suit !== null) {
        tdClasses += suitsConfig[suit].suitColor;
    }
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
            case MoveNames.ChooseHeroForDifficultySoloModeMove:
                action = data.moves.ChooseHeroForDifficultySoloModeMove;
                break;
            case MoveNames.UseGodPowerMove:
                action = data.moves.UseGodPowerMove;
                break;
            case MoveNames.SoloBotClickHeroCardMove:
                action = data.moves.SoloBotClickHeroCardMove;
                break;
            default:
                throw new Error(`Нет такого мува '${moveName}'.`);
        }
        tdClasses += ` cursor-pointer`;
    }
    else {
        action = null;
    }
    let _exhaustiveCheck;
    switch (card.type) {
        case RusCardTypeNames.Hero_Card:
        case RusCardTypeNames.Hero_Player_Card:
            styles = Styles.Hero(card.name);
            if (player === null && `active` in card && !card.active) {
                spanClasses += `bg-hero-inactive`;
            }
            else {
                spanClasses += `bg-hero`;
            }
            if (suit === null) {
                tdClasses += ` bg-gray-600`;
            }
            break;
        case RusCardTypeNames.Mercenary_Player_Card:
        case RusCardTypeNames.Mercenary_Card:
        case RusCardTypeNames.Artefact_Card:
        case RusCardTypeNames.Artefact_Player_Card:
            styles = Styles.CampCard(card.path);
            spanClasses += `bg-camp`;
            if (suit === null) {
                tdClasses += ` bg-yellow-200`;
                if (card.type === RusCardTypeNames.Artefact_Card
                    && card.name === ArtefactNames.Odroerir_The_Mythic_Cauldron) {
                    value = String(GetOdroerirTheMythicCauldronCoinsValues(data.G));
                }
            }
            break;
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Special_Card:
        case RusCardTypeNames.Multi_Suit_Player_Card:
            spanClasses += `bg-card`;
            styles = Styles.Card(card.suit, card.name, card.points);
            break;
        case RusCardTypeNames.Royal_Offering_Card:
            spanClasses += `bg-royal-offering`;
            styles = Styles.RoyalOffering(card.name);
            value = String(card.value);
            break;
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
        case RusCardTypeNames.Valkyry_Card:
            spanClasses += `bg-mythological-creature`;
            styles = Styles.MythologicalCreature(card.name);
            break;
        default:
            _exhaustiveCheck = card;
            throw new Error(`Добавленная на поле игрока карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
    if (`points` in card) {
        value = card.points !== null ? String(card.points) : ``;
    }
    //TODO Draw Power token on Gods if needed and Strength token on valkyries!
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
            case MoveNames.ClickConcreteCoinToUpgradeMove:
                action = data.moves.ClickConcreteCoinToUpgradeMove;
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
                throw new Error(`Нет такого мува '${moveName}'.`);
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
        spanClasses += `bg-market-coin`;
        if (coinClasses !== null && coinClasses !== undefined) {
            span = (_jsx("span", { className: coinClasses, children: additionalParam }));
        }
    }
    else if (type === `hidden-coin`) {
        spanClasses += `bg-coin`;
        if (IsCoin(coin) && coinClasses !== null && coinClasses !== undefined) {
            styles = Styles.CoinBack();
            span = (_jsx("span", { style: Styles.CoinSmall(coin.value, coin.isInitial), className: coinClasses }));
        }
    }
    else {
        spanClasses += `bg-coin`;
        if (coinClasses !== null && coinClasses !== undefined) {
            spanClasses += ` ${coinClasses}`;
        }
        if (type === `coin`) {
            if (coin === null) {
                styles = Styles.CoinBack();
            }
            else {
                if (!IsCoin(coin)) {
                    throw new Error(`Монета с типом 'coin' не может быть закрыта.`);
                }
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
                    span = (_jsx("span", { style: Styles.Tavern(additionalParam), className: "bg-tavern-icon" }));
                }
            }
        }
    }
    playerCells.push(_jsx("td", { className: tdClasses, onClick: () => action === null || action === void 0 ? void 0 : action(...args), children: _jsx("span", { style: styles, className: spanClasses, children: span }) }, `${(player === null || player === void 0 ? void 0 : player.nickname) ? `player ${player.nickname} ` : ``}coin ${id}${IsCoin(coin) ? ` ${coin.value}` : ` empty`}`));
};
/**
 * <h3>Отрисовка фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка фракций на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param playerHeaders Ячейки для отрисовки.
 * @param suit Фракция.
 * @param player Игрок.
 * @param moveName Название действия.
 */
export const DrawSuit = (data, playerHeaders, suit, player, moveName) => {
    let action;
    switch (moveName) {
        case MoveNames.GetMjollnirProfitMove:
            action = data.moves.GetMjollnirProfitMove;
            break;
        case MoveNames.PlaceThrudHeroMove:
            action = data.moves.PlaceThrudHeroMove;
            break;
        case MoveNames.PlaceYludHeroMove:
            action = data.moves.PlaceYludHeroMove;
            break;
        case MoveNames.PlaceMultiSuitCardMove:
            action = data.moves.PlaceMultiSuitCardMove;
            break;
        case MoveNames.PlaceEnlistmentMercenariesMove:
            action = data.moves.PlaceEnlistmentMercenariesMove;
            break;
        default:
            action = null;
            break;
    }
    let className = ``;
    if (action !== null) {
        className += ` cursor-pointer`;
    }
    playerHeaders.push(_jsx("th", { className: `${suitsConfig[suit].suitColor}${className}`, onClick: () => action === null || action === void 0 ? void 0 : action(suit), children: _jsx("span", { style: Styles.Suit(suit), className: "bg-suit-icon" }) }, `${player.nickname} ${suitsConfig[suit].suitName}`));
};
//# sourceMappingURL=ElementsUI.js.map