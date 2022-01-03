import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { GameBoard } from "../GameBoard";
import { AddDataToLog } from "../Logging";
import { CampDeckCardTypes, DeckCardTypes } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { LogTypes, RusCardTypes } from "../typescript/enums";
import { IHero } from "../typescript/hero_card_interfaces";
import { IBackground, IDrawBoardOptions, IPublicPlayer } from "../typescript/interfaces";
import { ArgsTypes } from "../typescript/types";
import { DiscardAnyCardFromPlayerBoardProfit } from "./ProfitHelpers";

/**
 * h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns Параметры для отрисовки сегмента игрового поля.
 */
export const DrawBoard = (objectsSize: number): IDrawBoardOptions => {
    const boardRows: number = Math.floor(Math.sqrt(objectsSize)),
        boardCols: number = Math.ceil(objectsSize / boardRows),
        lastBoardCol: number = objectsSize % boardCols;
    return { boardRows, boardCols, lastBoardCol };
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
 * @param actionName Название действия.
 * @param args Аргументы действия.
 */
export const DrawButton = (data: GameBoard, boardCells: JSX.Element[], key: string, name: string, player: IPublicPlayer,
    actionName?: string, ...args: ArgsTypes): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let action: Function | null = null;
    switch (actionName) {
        case OnClickStartEnlistmentMercenaries.name:
            action = OnClickStartEnlistmentMercenaries;
            break;
        case OnClickPassEnlistmentMercenaries.name:
            action = OnClickPassEnlistmentMercenaries;
            break;
        default:
            action = null;
    }
    boardCells.push(
        <td className="cursor-pointer" onClick={() => action?.(data, ...args)}
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
export const DrawCard = (data: GameBoard, playerCells: JSX.Element[], card: DeckCardTypes | CampDeckCardTypes | IHero,
    id: number, player: IPublicPlayer | null, suit?: string | null, actionName?: string, ...args: ArgsTypes):
    void => {
    let styles: IBackground = { background: `` },
        tdClasses = ``,
        spanClasses = ``,
        // eslint-disable-next-line @typescript-eslint/ban-types
        action: Function | null = null;
    switch (actionName) {
        case OnClickHeroCard.name:
            action = OnClickHeroCard;
            break;
        case OnClickCampCard.name:
            action = OnClickCampCard;
            break;
        case OnClickCard.name:
            action = OnClickCard;
            break;
        case OnClickCardToPickDistinction.name:
            action = OnClickCardToPickDistinction;
            break;
        case OnClickCardToDiscard.name:
            action = OnClickCardToDiscard;
            break;
        case OnClickCardFromDiscard.name:
            action = OnClickCardFromDiscard;
            break;
        case OnClickCardToDiscard2Players.name:
            action = OnClickCardToDiscard2Players;
            break;
        case OnClickDiscardCardFromPlayerBoard.name:
            action = OnClickDiscardCardFromPlayerBoard;
            break;
        case OnClickDiscardSuitCardFromPlayerBoard.name:
            action = OnClickDiscardSuitCardFromPlayerBoard;
            break;
        case OnClickCampCardHolda.name:
            action = OnClickCampCardHolda;
            break;
        case OnClickGetEnlistmentMercenaries.name:
            action = OnClickGetEnlistmentMercenaries;
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
        <td className={tdClasses} onClick={() => action?.(data, ...args)}
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
export const DrawCoin = (data: GameBoard, playerCells: JSX.Element[], type: string, coin: CoinType, id: number,
    player: IPublicPlayer | null, coinClasses?: string | null, additionalParam?: number | null,
    actionName?: string, ...args: ArgsTypes): void => {
    let styles: IBackground = { background: `` },
        span: JSX.Element | number | null = null,
        tdClasses = `bg-yellow-300`,
        spanClasses = ``,
        // eslint-disable-next-line @typescript-eslint/ban-types
        action: Function | null = null;
    switch (actionName) {
        case OnClickBoardCoin.name:
            action = OnClickBoardCoin;
            break;
        case OnClickHandCoin.name:
            action = OnClickHandCoin;
            break;
        case OnClickCoinToUpgrade.name:
            action = OnClickCoinToUpgrade;
            break;
        case OnClickCoinToAddToPouch.name:
            action = OnClickCoinToAddToPouch;
            break;
        case OnClickCoinToUpgradeVidofnirVedrfolnir.name:
            action = OnClickCoinToUpgradeVidofnirVedrfolnir;
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
            AddDataToLog(data.props.G, LogTypes.ERROR, `ОШИБКА: Монета на рынке не может быть 'null'.`);
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
        <td className={tdClasses} onClick={() => action?.(data, ...args)}
            key={`${player?.nickname ? `player ${player.nickname} ` : ``}coin ${id}${coin !== null ? ` ${coin.value}` : ` empty`}`}>
            <span style={styles} className={spanClasses}>
                {span}
            </span>
        </td>
    );
};

/**
 * <h3>Отрисовка планшета конкретного игрока для дискарда карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшета конкретного игрока для дискарда карты по действию артефакта Brisingamens.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле для вывода карт для дискарда.
 */
export const DrawPlayerBoardForCardDiscard = (data: GameBoard): JSX.Element => {
    // todo Discard cards must be hidden from others users?
    const playerHeaders: JSX.Element[] = [],
        playerRows: JSX.Element[][] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            playerHeaders.push(
                <th className={`${suitsConfig[suit].suitColor}`}
                    key={`${data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname} ${suitsConfig[suit].suitName}`}>
                    <span style={Styles.Suits(suit)} className="bg-suit-icon">

                    </span>
                </th>
            );
        }
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
 * @param data Глобальные параметры.
 * @param suit Название фракции.
 * @returns Поле игрока для дискарда карты фракции.
 */
export const DrawPlayersBoardForSuitCardDiscard = (data: GameBoard, suit: string): JSX.Element => {
    const playersHeaders: JSX.Element[] = [],
        playersRows: JSX.Element[][] = [];
    for (let p = 0; p < data.props.G.publicPlayers.length; p++) {
        if (p !== Number(data.props.ctx.currentPlayer)) {
            playersHeaders.push(
                <th className={`${suitsConfig[suit].suitColor} discard suit`}
                    key={`${data.props.G.publicPlayers[p].nickname} ${suitsConfig[suit].suitName}`}>
                    <span style={Styles.Suits(suit)} className="bg-suit-icon">
                        {p + 1}
                    </span>
                </th>
            );
        }
    }
    for (let i = 0; ; i++) {
        let isDrawRow = false,
            isExit = true;
        playersRows[i] = [];
        const playersCells: JSX.Element[] = [];
        for (let p = 0; p < data.props.G.publicPlayers.length; p++) {
            if (p !== Number(data.props.ctx.currentPlayer)) {
                if (data.props.G.publicPlayers[p].cards[suit][i] !== undefined) {
                    if (data.props.G.publicPlayers[p].cards[suit][i].type !== RusCardTypes.HERO) {
                        isExit = false;
                        isDrawRow = true;
                        DrawCard(data, playersCells, data.props.G.publicPlayers[p].cards[suit][i],
                            i, data.props.G.publicPlayers[p], suit,
                            OnClickDiscardSuitCardFromPlayerBoard.name, suit, p, i);
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
 * <h3>Активация мува при клике на монету на игровом столе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты на игровом столе выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickBoardCoin = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickBoardCoinMove(...args);
};

/**
 * <h3>Активация мува при клике на карту кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты кэмпа выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCampCard = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickCampCardMove(...args);
};

/**
 * <h3>Активация мува при клике на карту кэмпа по действию героя Хольда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты кэмпа по действию героя Хольда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCampCardHolda = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickCampCardHoldaMove(...args);
};

/**
 * <h3>Активация мува при клике на карту таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты таверны выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCard = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickCardMove(...args);
};

/**
 * <h3>Активация мува при клике на карты из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты из дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCardFromDiscard = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.PickDiscardCardMove(...args);
};

/**
 * <h3>Активация мува при клике на карты для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретнойкарты для дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCardToDiscard = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.DiscardCardMove(...args);
};

/**
 * <h3>Активация мува при клике на карту таверны для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты таверны при 2-х игроках выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCardToDiscard2Players = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.DiscardCard2PlayersMove(...args);
};

/**
 * <h3>Активация мува при клике на карту преимущества.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты преимущества выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCardToPickDistinction = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickCardToPickDistinctionMove(...args);
};

/**
 * <h3>Активация мува при клике на монету для добавления её в кошелёк.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты для добавления её в кошелёк выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCoinToAddToPouch = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.AddCoinToPouchMove(...args);
};

/**
 * <h3>Активация мува при клике на монету для её улучшения.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты для её улучшения выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCoinToUpgrade = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickCoinToUpgradeMove(...args);
};

/**
 * <h3>Активация мува при клике на монету для её улучшения по действию артефакта 'VidofnirVedrfolnir'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты для её улучшения о действию артефакта 'VidofnirVedrfolnir' выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickCoinToUpgradeVidofnirVedrfolnir = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.UpgradeCoinVidofnirVedrfolnirMove(...args);
};

/**
 * <h3>Активация мува при клике на карту на планшете игрока для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретную карту на планшете игрока для дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickDiscardCardFromPlayerBoard = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.DiscardCardFromPlayerBoardMove(...args);
};

/**
 * <h3>Активация мува при клике на карту на планшете определённой фракции игрока для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретную карту на планшете определённой фракции игрока для дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
const OnClickDiscardSuitCardFromPlayerBoard = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.DiscardSuitCardFromPlayerBoardMove(...args);
};

/**
 * <h3>Активация мува при клике на карту наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты наёмника выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickGetEnlistmentMercenaries = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.GetEnlistmentMercenariesMove(...args);
};

/**
 * <h3>Активация мува при клике на монету в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты в руке игрока выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickHandCoin = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickHandCoinMove(...args);
};

/**
 * <h3>Активация мува при клике на карту героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретного героя выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export const OnClickHeroCard = (data: GameBoard, ...args: ArgsTypes): void => {
    data.props.moves.ClickHeroCardMove(...args);
};

/**
 * <h3>Активация мува при клике на кнопку старта действия 'EnlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной кнопки старта действия 'EnlistmentMercenaries' выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 */
export const OnClickStartEnlistmentMercenaries = (data: GameBoard): void => {
    data.props.moves.StartEnlistmentMercenariesMove();
};

/**
 * <h3>Активация мува при клике на кнопку паса действия 'EnlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной кнопки паса действия 'EnlistmentMercenaries' выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 */
export const OnClickPassEnlistmentMercenaries = (data: GameBoard): void => {
    data.props.moves.PassEnlistmentMercenariesMove();
};
