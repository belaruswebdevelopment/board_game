import { BoardProps } from "boardgame.io/react";
import { IsArtefactCard, IsMercenaryCard } from "../Camp";
import { isActionCard } from "../Card";
import { isCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { isHeroCard } from "../Hero";
import { MoveNames } from "../typescript/enums";
import { AllCardTypes, ArgsTypes, CoinType, IBackground, IMoveFunctionTypes, IMyGameState, IPublicPlayer, SuitTypes } from "../typescript/interfaces";

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
export const DrawButton = (data: BoardProps<IMyGameState>, boardCells: JSX.Element[], key: string, name: string,
    player: IPublicPlayer, moveName?: string, ...args: ArgsTypes): void | never => {
    let action: IMoveFunctionTypes;
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
    boardCells.push(
        <td className="cursor-pointer" onClick={() => action?.(...args)}
            key={`${player?.nickname ? `Player ${player.nickname} ` : ``}${key}`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {name}
            </button>
        </td>
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
 * @param suit Название фракции.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCard = (data: BoardProps<IMyGameState>, playerCells: JSX.Element[], card: AllCardTypes, id: number,
    player: IPublicPlayer | null, suit?: SuitTypes | null, moveName?: string, ...args: ArgsTypes): void | never => {
    let styles: IBackground = { background: `` },
        tdClasses = ``,
        spanClasses = ``,
        action: IMoveFunctionTypes;
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
    } else {
        action = null;
    }
    if (suit !== null && suit !== undefined) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (isHeroCard(card)) {
        styles = Styles.Heroes(card.game, card.name);
        if (player === null && `active` in card && !card.active) {
            spanClasses = `bg-hero-inactive`;
        } else {
            spanClasses = `bg-hero`;
        }
        if (suit === null) {
            tdClasses = `bg-gray-600`;
        }
    } else if (IsMercenaryCard(card) || IsArtefactCard(card)) {
        styles = Styles.CampCards(card.tier, card.path);
        spanClasses = `bg-camp`;
        if (suit === null) {
            tdClasses = `bg-yellow-200`;
        }
    } else {
        if (!isActionCard(card)) {
            styles = Styles.Cards(card.suit, card.name, card.points);
        } else {
            styles = Styles.Cards(null, card.name, null);
        }
        spanClasses = `bg-card`;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    let description = ``,
        value = ``;
    if (`description` in card) {
        description = card.description;
    }
    if (`points` in card) {
        value = card.points !== null ? String(card.points) : ``;
    } else if (isActionCard(card)) {
        value = String(card.value);
    }
    playerCells.push(
        <td className={tdClasses} onClick={() => action?.(...args)}
            key={`${player?.nickname ? `player ${player.nickname} ` : ``}${suit} card ${id} ${card.name}`}>
            <span style={styles} title={description ?? card.name} className={spanClasses}>
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
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCoin = (data: BoardProps<IMyGameState>, playerCells: JSX.Element[], type: string, coin: CoinType,
    id: number, player: IPublicPlayer | null, coinClasses?: string | null, additionalParam?: number | null,
    moveName?: string, ...args: ArgsTypes): void | never => {
    let styles: IBackground = { background: `` },
        span: JSX.Element | number | null = null,
        tdClasses = `bg-yellow-300`,
        spanClasses = ``,
        action: IMoveFunctionTypes;
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
    } else {
        action = null;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    if (type === `market`) {
        if (isCoin(coin)) {
            styles = Styles.Coin(coin.value, false);
            spanClasses = `bg-market-coin`;
            if (coinClasses !== null && coinClasses !== undefined) {
                span = (<span className={coinClasses}>
                    {additionalParam}
                </span>);
            }
        } else {
            throw new Error(`Монета на рынке не может отсутствовать.`);
        }
    } else {
        spanClasses = `bg-coin`;
        if (coinClasses !== null && coinClasses !== undefined) {
            spanClasses += ` ${coinClasses}`;
        }
        if (type === `coin`) {
            if (coin === null) {
                styles = Styles.CoinBack();
            } else {
                if (coin.isInitial !== undefined) {
                    styles = Styles.Coin(coin.value, coin.isInitial);
                }
            }
        } else {
            styles = Styles.CoinBack();
            if (type === `back-small-market-coin`) {
                span = (<span style={Styles.Exchange()} className="bg-small-market-coin">

                </span>);
            } else if (type === `back-tavern-icon`) {
                if (additionalParam !== null && additionalParam !== undefined) {
                    span = (<span style={Styles.Taverns(additionalParam)} className="bg-tavern-icon">

                    </span>);
                }
            }
        }
    }
    playerCells.push(
        <td className={tdClasses} onClick={() => action?.(...args)}
            key={`${player?.nickname ? `player ${player.nickname} ` : ``}coin ${id}${isCoin(coin) ? ` ${coin.value}` : ` empty`}`}>
            <span style={styles} className={spanClasses}>
                {span}
            </span>
        </td>
    );
};

export const DrawSuit = (data: BoardProps<IMyGameState>, boardCells: JSX.Element[], suit: SuitTypes, key: string,
    value: number | string, player: IPublicPlayer | null, moveName: string | null): void | never => {
    let action: IMoveFunctionTypes;
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
    boardCells.push(
        <td className={`${suitsConfig[suit].suitColor} cursor-pointer`}
            key={`${player?.nickname ? `player ${player.nickname} ` : ``}choose ${suit} suit to ${key}`}
            onClick={() => action?.(suit)}>
            <span style={Styles.Suits(suit)} className="bg-suit-icon">
                <b className="whitespace-nowrap text-white">
                    {value}
                </b>
            </span>
        </td>
    );
};
