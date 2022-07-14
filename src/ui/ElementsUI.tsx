import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { IsArtefactCard } from "../Camp";
import { IsCoin } from "../Coin";
import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { ArtefactNames, MoveNames, RusCardTypeNames } from "../typescript/enums";
import type { AllCardTypes, ArgsTypes, CanBeNull, IBackground, IMyGameState, IPublicPlayer, MoveFunctionTypes, PublicPlayerCoinTypes, SuitTypes } from "../typescript/interfaces";

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
export const DrawButton = (data: BoardProps<IMyGameState>, boardCells: JSX.Element[], name: string,
    player: IPublicPlayer, moveName?: MoveNames, ...args: ArgsTypes): void => {
    let action: MoveFunctionTypes;
    switch (moveName) {
        case MoveNames.ChooseDifficultyLevelForSoloModeMove:
            action = data.moves.ChooseDifficultyLevelForSoloModeMove!;
            break;
        case MoveNames.StartEnlistmentMercenariesMove:
            action = data.moves.StartEnlistmentMercenariesMove!;
            break;
        case MoveNames.PassEnlistmentMercenariesMove:
            action = data.moves.PassEnlistmentMercenariesMove!;
            break;
        default:
            throw new Error(`Нет такого мува '${moveName}'.`);
    }
    boardCells.push(
        <td className="cursor-pointer" onClick={() => action?.(...args)}
            key={`${player?.nickname ? `Player ${player.nickname} ` : ``}${name}`}>
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
 * @param suit Название фракции дворфов.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 */
export const DrawCard = (data: BoardProps<IMyGameState>, playerCells: JSX.Element[], card: AllCardTypes, id: number,
    player: CanBeNull<IPublicPlayer>, suit: CanBeNull<SuitTypes>, moveName?: MoveNames, ...args: ArgsTypes): void => {
    let styles: IBackground = { background: `` },
        tdClasses = ``,
        spanClasses = ``,
        description = ``,
        value = ``,
        action: MoveFunctionTypes;
    if (`description` in card) {
        description = card.description;
    }
    if (suit !== null) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (moveName !== undefined) {
        switch (moveName) {
            case MoveNames.ClickHeroCardMove:
                action = data.moves.ClickHeroCardMove!;
                break;
            case MoveNames.ClickCampCardMove:
                action = data.moves.ClickCampCardMove!;
                break;
            case MoveNames.ClickCardMove:
                action = data.moves.ClickCardMove!;
                break;
            case MoveNames.ClickCardToPickDistinctionMove:
                action = data.moves.ClickCardToPickDistinctionMove!;
                break;
            case MoveNames.DiscardCardMove:
                action = data.moves.DiscardCardMove!;
                break;
            case MoveNames.PickDiscardCardMove:
                action = data.moves.PickDiscardCardMove!;
                break;
            case MoveNames.DiscardCard2PlayersMove:
                action = data.moves.DiscardCard2PlayersMove!;
                break;
            case MoveNames.DiscardCardFromPlayerBoardMove:
                action = data.moves.DiscardCardFromPlayerBoardMove!;
                break;
            case MoveNames.DiscardSuitCardFromPlayerBoardMove:
                action = data.moves.DiscardSuitCardFromPlayerBoardMove!;
                break;
            case MoveNames.ClickCampCardHoldaMove:
                action = data.moves.ClickCampCardHoldaMove!;
                break;
            case MoveNames.GetEnlistmentMercenariesMove:
                action = data.moves.GetEnlistmentMercenariesMove!;
                break;
            case MoveNames.ChooseHeroForDifficultySoloModeMove:
                action = data.moves.ChooseHeroForDifficultySoloModeMove!;
                break;
            case MoveNames.UseGodPowerMove:
                action = data.moves.UseGodPowerMove!;
                break;
            case MoveNames.SoloBotClickHeroCardMove:
                action = data.moves.SoloBotClickHeroCardMove!;
                break;
            default:
                throw new Error(`Нет такого мува '${moveName}'.`);
        }
        tdClasses += ` cursor-pointer`;
    } else {
        action = null;
    }
    switch (card.type) {
        case RusCardTypeNames.Hero_Card:
        case RusCardTypeNames.Hero_Player_Card:
            styles = Styles.Heroes(card.name);
            if (player === null && `active` in card && !card.active) {
                spanClasses = `bg-hero-inactive`;
            } else {
                spanClasses = `bg-hero`;
            }
            if (suit === null) {
                tdClasses = ` bg-gray-600`;
            }
            break;
        case RusCardTypeNames.Mercenary_Player_Card:
        case RusCardTypeNames.Mercenary_Card:
        case RusCardTypeNames.Artefact_Card:
            styles = Styles.CampCards(card.path);
            spanClasses = `bg-camp`;
            if (suit === null) {
                tdClasses = ` bg-yellow-200`;
            }
            break;
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Special_Card:
        case RusCardTypeNames.Multi_Suit_Player_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
        case RusCardTypeNames.Royal_Offering_Card:
            spanClasses = `bg-card`;
            if (`suit` in card) {
                styles = Styles.Cards(card.suit, card.name, card.points);
            } else {
                styles = Styles.Cards(null, card.name, null);
                value = String(card.value);
            }
            break;
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.Valkyry_Card:
            // TODO Fix classes for Idavoll
            break;
        default:
            // eslint-disable-next-line no-case-declarations
            const _exhaustiveCheck: never = card;
            throw new Error(`Добавленная на поле игрока карта не может быть с недопустимым типом.`);
            return _exhaustiveCheck;
    }
    if (`points` in card) {
        if (IsArtefactCard(card) && card.name === ArtefactNames.Odroerir_The_Mythic_Cauldron) {
            value = String(GetOdroerirTheMythicCauldronCoinsValues(data.G));
        } else {
            value = card.points !== null ? String(card.points) : ``;
        }
    }
    //TODO Draw Power token on Gods if needed and Strength token on valkyries!
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
export const DrawCoin = (data: BoardProps<IMyGameState>, playerCells: JSX.Element[], type: string,
    coin: PublicPlayerCoinTypes, id: number, player: CanBeNull<IPublicPlayer>, coinClasses?: CanBeNull<string>,
    additionalParam?: CanBeNull<number>, moveName?: MoveNames, ...args: ArgsTypes): void => {
    let styles: IBackground = { background: `` },
        span: CanBeNull<JSX.Element | number> = null,
        tdClasses = `bg-yellow-300`,
        spanClasses = ``,
        action: MoveFunctionTypes;
    if (moveName !== undefined) {
        switch (moveName) {
            case MoveNames.ClickBoardCoinMove:
                action = data.moves.ClickBoardCoinMove!;
                break;
            case MoveNames.ClickHandCoinMove:
                action = data.moves.ClickHandCoinMove!;
                break;
            case MoveNames.ClickHandCoinUlineMove:
                action = data.moves.ClickHandCoinUlineMove!;
                break;
            case MoveNames.ClickHandTradingCoinUlineMove:
                action = data.moves.ClickHandTradingCoinUlineMove!;
                break;
            case MoveNames.ClickConcreteCoinToUpgradeMove:
                action = data.moves.ClickConcreteCoinToUpgradeMove!;
                break;
            case MoveNames.ClickCoinToUpgradeMove:
                action = data.moves.ClickCoinToUpgradeMove!;
                break;
            case MoveNames.AddCoinToPouchMove:
                action = data.moves.AddCoinToPouchMove!;
                break;
            case MoveNames.UpgradeCoinVidofnirVedrfolnirMove:
                action = data.moves.UpgradeCoinVidofnirVedrfolnirMove!;
                break;
            default:
                throw new Error(`Нет такого мува '${moveName}'.`);
        }
    } else {
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
            span = (<span className={coinClasses}>
                {additionalParam}
            </span>);
        }
    } else if (type === `hidden-coin`) {
        spanClasses = `bg-coin`;
        if (IsCoin(coin) && coinClasses !== null && coinClasses !== undefined) {
            styles = Styles.CoinBack();
            span = (<span style={Styles.CoinSmall(coin.value, coin.isInitial)} className={coinClasses}>
            </span>);
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
                if (!IsCoin(coin)) {
                    throw new Error(`Монета с типом 'coin' не может быть закрыта.`);
                }
                if (IsCoin(coin) && coin.isInitial !== undefined) {
                    styles = Styles.Coin(coin.value, coin.isInitial);
                }
            }
        } else {
            styles = Styles.CoinBack();
            if (type === `back-small-market-coin`) {
                span = (<span style={Styles.Exchange()} className="bg-small-market-coin"></span>);
            } else if (type === `back-tavern-icon`) {
                if (additionalParam !== null && additionalParam !== undefined) {
                    span = (<span style={Styles.Taverns(additionalParam)} className="bg-tavern-icon"></span>);
                }
            }
        }
    }
    playerCells.push(
        <td className={tdClasses} onClick={() => action?.(...args)}
            key={`${player?.nickname ? `player ${player.nickname} ` : ``}coin ${id}${IsCoin(coin) ? ` ${coin.value}` : ` empty`}`}>
            <span style={styles} className={spanClasses}>
                {span}
            </span>
        </td>
    );
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
export const DrawSuit = (data: BoardProps<IMyGameState>, playerHeaders: JSX.Element[], suit: SuitTypes,
    player: IPublicPlayer, moveName: CanBeNull<MoveNames>): void => {
    let action: MoveFunctionTypes;
    switch (moveName) {
        case MoveNames.GetMjollnirProfitMove:
            action = data.moves.GetMjollnirProfitMove!;
            break;
        case MoveNames.PlaceThrudHeroMove:
            action = data.moves.PlaceThrudHeroMove!;
            break;
        case MoveNames.PlaceYludHeroMove:
            action = data.moves.PlaceYludHeroMove!;
            break;
        case MoveNames.PlaceMultiSuitCardMove:
            action = data.moves.PlaceMultiSuitCardMove!;
            break;
        case MoveNames.PlaceEnlistmentMercenariesMove:
            action = data.moves.PlaceEnlistmentMercenariesMove!;
            break;
        default:
            action = null;
            break;
    }
    let className = ``;
    if (action !== null) {
        className += ` cursor-pointer`;
    }
    playerHeaders.push(
        <th className={`${suitsConfig[suit].suitColor}${className}`}
            key={`${player.nickname} ${suitsConfig[suit].suitName}`}
            onClick={() => action?.(suit)}>
            <span style={Styles.Suits(suit)} className="bg-suit-icon"></span>
        </th>
    );
};
