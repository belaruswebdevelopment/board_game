import { BoardProps } from "boardgame.io/react";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { CampDeckCardTypes, DeckCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { LogTypes, MoveNames, RusCardTypes } from "../typescript/enums";
import { MyGameState } from "../typescript/game_data_interfaces";
import { IHero } from "../typescript/hero_card_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
import { IBackground } from "../typescript/style_interfaces";
import { ArgsTypes } from "../typescript/types";

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
export const DrawButton = (data: BoardProps<MyGameState>, boardCells: JSX.Element[], key: string, name: string,
    player: IPublicPlayer, actionName?: string, ...args: ArgsTypes): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action: Function | null = null;
    switch (actionName) {
        case MoveNames.StartEnlistmentMercenariesMove:
            action = data.moves.StartEnlistmentMercenariesMove;
            break;
        case MoveNames.PassEnlistmentMercenariesMove:
            action = data.moves.PassEnlistmentMercenariesMove;
            break;
        default:
            action = null;
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
 * @param actionName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCard = (data: BoardProps<MyGameState>, playerCells: JSX.Element[],
    card: DeckCardTypes | CampDeckCardTypes | IHero, id: number, player: IPublicPlayer | null, suit?: string | null,
    actionName?: string, ...args: ArgsTypes): void => {
    let styles: IBackground = { background: `` },
        tdClasses = ``,
        spanClasses = ``,
        // eslint-disable-next-line @typescript-eslint/ban-types
        action: Function | null = null;
    switch (actionName) {
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
            action = null;
    }
    if (suit !== null && suit !== undefined) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (card.type === RusCardTypes.HERO && `game` in card) {
        styles = Styles.Heroes(card.game, card.name);
        if (player === null && `active` in card && !card.active) {
            spanClasses = `bg-hero-inactive`;
        } else {
            spanClasses = `bg-hero`;
        }
        if (suit === null) {
            tdClasses = `bg-gray-600`;
        }
    } else if (card.type === RusCardTypes.MERCENARY || card.type === RusCardTypes.ARTEFACT) {
        if (`tier` in card && `path` in card) {
            styles = Styles.CampCards(card.tier, card.path);
        }
        spanClasses = `bg-camp`;
        if (suit === null) {
            tdClasses = `bg-yellow-200`;
        }
    } else {
        if (`suit` in card && `points` in card && card.suit !== null) {
            styles = Styles.Cards(card.suit, card.name, card.points);
        } else {
            styles = Styles.Cards(null, card.name, null);
        }
        spanClasses = `bg-card`;
    }
    if (actionName !== null) {
        tdClasses += ` cursor-pointer`;
    }
    let description = ``,
        value = ``;
    if (`description` in card) {
        description = card.description;
    }
    if (`points` in card) {
        value = card.points !== null ? String(card.points) : ``;
    } else if (`value` in card) {
        value = String(card.value);
    }
    playerCells.push(
        <td className={tdClasses} onClick={() => action?.(...args)}
            key={`${(player && player.nickname) ? `player ${(player.nickname)} ` : ``}${suit} card ${id} ${card.name}`}>
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
 * @param actionName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCoin = (data: BoardProps<MyGameState>, playerCells: JSX.Element[], type: string, coin: CoinType,
    id: number, player: IPublicPlayer | null, coinClasses?: string | null, additionalParam?: number | null,
    actionName?: string, ...args: ArgsTypes): void => {
    let styles: IBackground = { background: `` },
        span: JSX.Element | number | null = null,
        tdClasses = `bg-yellow-300`,
        spanClasses = ``,
        // eslint-disable-next-line @typescript-eslint/ban-types
        action: Function | null = null;
    switch (actionName) {
        case MoveNames.ClickBoardCoinMove:
            action = data.moves.ClickBoardCoinMove;
            break;
        case MoveNames.ClickHandCoinMove:
            action = data.moves.ClickHandCoinMove;
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
                span = (<span className={coinClasses}>
                    {additionalParam}
                </span>);
            }
        } else {
            AddDataToLog(data.G, LogTypes.ERROR, `ОШИБКА: Монета на рынке не может быть 'null'.`);
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
            key={`${player?.nickname ? `player ${player.nickname} ` : ``}coin ${id}${coin !== null ? ` ${coin.value}` : ` empty`}`}>
            <span style={styles} className={spanClasses}>
                {span}
            </span>
        </td>
    );
};
