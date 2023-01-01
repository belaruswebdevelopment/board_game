import { Styles } from "../data/StyleData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { ArtefactNames, ButtonMoveNames, CardMoveNames, CardTypeRusNames, CoinMoveNames, DistinctionCardMoveNames, DrawCoinTypeNames, EmptyCardMoveNames, ErrorNames, SuitMoveNames, SuitNames } from "../typescript/enums";
import type { AllCardType, ArgsType, BoardProps, ButtonNameType, CanBeNullType, FnContext, IBackground, IndexOf, IPublicPlayer, MoveFunctionType, MyFnContextWithMyPlayerID, PublicPlayerCoinType, TavernsConfigType } from "../typescript/interfaces";

/**
 * <h3>Отрисовка кнопок.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка кнопок на игровом поле.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @param name Имя кнопки.
 * @param player Игрок.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 * @returns
 */
export const DrawButton = ({ G, ctx, ...rest }: FnContext, data: BoardProps, boardCells: JSX.Element[],
    name: ButtonNameType, player: IPublicPlayer, moveName?: ButtonMoveNames, ...args: ArgsType): void => {
    let action: MoveFunctionType,
        _exhaustiveCheck: never;
    switch (moveName) {
        case ButtonMoveNames.NotActivateGodAbilityMove:
            action = data.moves.NotActivateGodAbilityMove;
            break;
        case ButtonMoveNames.PassEnlistmentMercenariesMove:
            action = data.moves.PassEnlistmentMercenariesMove;
            break;
        case ButtonMoveNames.StartEnlistmentMercenariesMove:
            action = data.moves.StartEnlistmentMercenariesMove;
            break;
        // Start
        case ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove:
            action = data.moves.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove;
            break;
        // Solo Mode
        case ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove:
            action = data.moves.ChooseDifficultyLevelForSoloModeMove;
            break;
        // Solo Mode Andvari
        case ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove:
            action = data.moves.ChooseStrategyVariantForSoloModeAndvariMove;
            break;
        case ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove:
            action = data.moves.ChooseStrategyForSoloModeAndvariMove;
            break;
        case undefined:
            action = null;
            break;
        default:
            _exhaustiveCheck = moveName;
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
            return _exhaustiveCheck;
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
 * <h3>Отрисовка карт знаков отличия.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка карт знаков отличия на игровом поле.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param player Игрок.
 * @param suit Название фракции дворфов.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 * @returns
 */
export const DrawDistinctionCard = ({ G, ctx, ...rest }: FnContext, data: BoardProps, playerCells: JSX.Element[],
    player: CanBeNullType<IPublicPlayer>, suit: SuitNames, moveName?: DistinctionCardMoveNames, ...args: ArgsType):
    void => {
    let tdClasses = `bg-green-500`,
        action: MoveFunctionType;
    let _exhaustiveCheck: never;
    switch (moveName) {
        case DistinctionCardMoveNames.ClickDistinctionCardMove:
            action = data.moves.ClickDistinctionCardMove;
            break;
        case undefined:
            action = null;
            break;
        default:
            _exhaustiveCheck = moveName;
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
            return _exhaustiveCheck;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    playerCells.push(
        <td className={tdClasses} onClick={() => action?.(...args)}
            key={`${player?.nickname ? `player ${player.nickname} ` : ``} distinction ${suit} card`}>
            <span style={Styles.Distinction(suit)} title={suitsConfig[suit].distinction.description}
                className="bg-suit-distinction"></span>
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
 * @param context
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param card Карта.
 * @param id Id карты.
 * @param player Игрок.
 * @param suit Название фракции дворфов.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 * @returns
 */
export const DrawCard = ({ G, ctx, ...rest }: FnContext, data: BoardProps, playerCells: JSX.Element[],
    card: AllCardType, id: number, player: CanBeNullType<IPublicPlayer>, suit: CanBeNullType<SuitNames>,
    moveName?: CardMoveNames, ...args: ArgsType): void => {
    let styles: IBackground = { background: `` },
        tdClasses = ``,
        spanClasses = ``,
        description = ``,
        value = ``,
        action: MoveFunctionType;
    if (`description` in card) {
        description += card.description;
    }
    if (suit !== null) {
        tdClasses += suitsConfig[suit].suitColor;
    }
    let _exhaustiveCheck: never;
    switch (moveName) {
        case CardMoveNames.ActivateGodAbilityMove:
            action = data.moves.ActivateGodAbilityMove;
            break;
        case CardMoveNames.ClickCardNotGiantAbilityMove:
            action = data.moves.ClickCardNotGiantAbilityMove;
            break;
        case CardMoveNames.ClickCardMove:
            action = data.moves.ClickCardMove;
            break;
        case CardMoveNames.ClickGiantAbilityNotCardMove:
            action = data.moves.ClickGiantAbilityNotCardMove;
            break;
        case CardMoveNames.ClickCardToPickDistinctionMove:
            action = data.moves.ClickCardToPickDistinctionMove;
            break;
        case CardMoveNames.ClickCampCardMove:
            action = data.moves.ClickCampCardMove;
            break;
        case CardMoveNames.DiscardCardFromPlayerBoardMove:
            action = data.moves.DiscardCardFromPlayerBoardMove;
            break;
        case CardMoveNames.GetEnlistmentMercenariesMove:
            action = data.moves.GetEnlistmentMercenariesMove;
            break;
        case CardMoveNames.GetMythologyCardMove:
            action = data.moves.GetMythologyCardMove;
            break;
        // Start
        case CardMoveNames.ClickCampCardHoldaMove:
            action = data.moves.ClickCampCardHoldaMove;
            break;
        case CardMoveNames.ClickHeroCardMove:
            action = data.moves.ClickHeroCardMove;
            break;
        case CardMoveNames.DiscardTopCardFromSuitMove:
            action = data.moves.DiscardTopCardFromSuitMove;
            break;
        case CardMoveNames.DiscardCard2PlayersMove:
            action = data.moves.DiscardCard2PlayersMove;
            break;
        case CardMoveNames.DiscardSuitCardFromPlayerBoardMove:
            action = data.moves.DiscardSuitCardFromPlayerBoardMove;
            break;
        case CardMoveNames.PickDiscardCardMove:
            action = data.moves.PickDiscardCardMove;
            break;
        // Solo Mode
        case CardMoveNames.ChooseHeroForDifficultySoloModeMove:
            action = data.moves.ChooseHeroForDifficultySoloModeMove;
            break;
        // Solo Bot
        case CardMoveNames.SoloBotClickHeroCardMove:
            action = data.moves.SoloBotClickHeroCardMove;
            break;
        case CardMoveNames.SoloBotClickCardMove:
            action = data.moves.SoloBotClickCardMove;
            break;
        case CardMoveNames.SoloBotClickCardToPickDistinctionMove:
            action = data.moves.SoloBotClickCardMove;
            break;
        // Solo Bot Andvari
        case CardMoveNames.SoloBotAndvariClickCardMove:
            action = data.moves.SoloBotAndvariClickCardMove;
            break;
        case CardMoveNames.SoloBotAndvariClickHeroCardMove:
            action = data.moves.SoloBotAndvariClickHeroCardMove;
            break;
        case CardMoveNames.SoloBotAndvariClickCardToPickDistinctionMove:
            action = data.moves.SoloBotAndvariClickCardToPickDistinctionMove;
            break;
        case undefined:
            action = null;
            break;
        default:
            _exhaustiveCheck = moveName;
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
            return _exhaustiveCheck;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    switch (card.type) {
        case CardTypeRusNames.Hero_Card:
        case CardTypeRusNames.Hero_Player_Card:
            styles = Styles.Hero(card.name);
            if (player === null && `active` in card && !card.active) {
                spanClasses += `bg-hero-inactive`;
            } else {
                spanClasses += `bg-hero`;
            }
            if (suit === null) {
                tdClasses += ` bg-gray-600`;
            }
            break;
        case CardTypeRusNames.Mercenary_Player_Card:
        case CardTypeRusNames.Mercenary_Card:
        case CardTypeRusNames.Artefact_Card:
        case CardTypeRusNames.Artefact_Player_Card:
            styles = Styles.CampCard(card.path);
            spanClasses += `bg-camp`;
            if (suit === null) {
                tdClasses += ` bg-yellow-200`;
                if (card.type === CardTypeRusNames.Artefact_Card
                    && card.name === ArtefactNames.Odroerir_The_Mythic_Cauldron) {
                    value = String(GetOdroerirTheMythicCauldronCoinsValues({ G: data.G } as
                        MyFnContextWithMyPlayerID));
                }
            }
            break;
        case CardTypeRusNames.Dwarf_Card:
        case CardTypeRusNames.Special_Card:
        case CardTypeRusNames.Multi_Suit_Player_Card:
            spanClasses += `bg-card`;
            styles = Styles.Card(card.suit, card.name, card.points);
            break;
        case CardTypeRusNames.Royal_Offering_Card:
            spanClasses += `bg-royal-offering`;
            styles = Styles.RoyalOffering(card.name);
            value = String(card.value);
            break;
        case CardTypeRusNames.Giant_Card:
        case CardTypeRusNames.God_Card:
        case CardTypeRusNames.Mythical_Animal_Card:
        case CardTypeRusNames.Valkyry_Card:
            if (`isActivated` in card && card.isActivated === true) {
                // TODO Draw capturedCard for Giant if captured!
                spanClasses += `bg-mythological-creature-inactive`;
            } else {
                spanClasses += `bg-mythological-creature`;
            }
            // TODO Draw valkyry requirements!
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
    //TODO Draw Power token on Gods if needed and Strength token on valkyries! And Loki token!
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
 * <h3>Отрисовка пустых ячеек для карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка пустых ячеек для карт на игровом поле.</li>
 * </ol>
 *
 * @param context
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param cardType Тип карты.
 * @param id Id карты.
 * @param player Игрок.
 * @param suit Название фракции дворфов.
 * @param moveName Название действия.
 * @param args Аргументы действия.
 * @returns
 */
export const DrawEmptyCard = ({ G, ctx, ...rest }: FnContext, data: BoardProps, playerCells: JSX.Element[],
    cardType: CardTypeRusNames, id: number, player: CanBeNullType<IPublicPlayer>, suit: CanBeNullType<SuitNames>,
    moveName?: EmptyCardMoveNames, ...args: ArgsType): void => {
    let tdClasses = ``,
        action: MoveFunctionType;
    if (suit !== null) {
        tdClasses += suitsConfig[suit].suitColor;
    }
    let _exhaustiveCheck: never;
    switch (moveName) {
        case EmptyCardMoveNames.PlaceThrudHeroMove:
            action = data.moves.PlaceThrudHeroMove;
            break;
        case EmptyCardMoveNames.PlaceYludHeroMove:
            action = data.moves.PlaceYludHeroMove;
            break;
        case EmptyCardMoveNames.PlaceMultiSuitCardMove:
            action = data.moves.PlaceMultiSuitCardMove;
            break;
        case EmptyCardMoveNames.PlaceEnlistmentMercenariesMove:
            action = data.moves.PlaceEnlistmentMercenariesMove;
            break;
        // Solo Bot
        case EmptyCardMoveNames.SoloBotPlaceThrudHeroMove:
            action = data.moves.SoloBotPlaceThrudHeroMove;
            break;
        case EmptyCardMoveNames.SoloBotPlaceYludHeroMove:
            action = data.moves.SoloBotPlaceYludHeroMove;
            break;
        // Solo Bot Andvari
        case EmptyCardMoveNames.SoloBotAndvariPlaceThrudHeroMove:
            action = data.moves.SoloBotAndvariPlaceThrudHeroMove;
            break;
        case EmptyCardMoveNames.SoloBotAndvariPlaceYludHeroMove:
            action = data.moves.SoloBotAndvariPlaceYludHeroMove;
            break;
        case undefined:
            action = null;
            break;
        default:
            _exhaustiveCheck = moveName;
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
            return _exhaustiveCheck;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    // TODO Check colors of empty camp & others cards!
    playerCells.push(
        <td className={tdClasses} onClick={() => action?.(...args)}
            key={`${player?.nickname ? `player ${player.nickname} ` : ``}${suit} empty ${cardType} ${id}`}>

        </td>
    );
};

// TODO Replace string to DrawCoinTypes
/**
 * <h3>Отрисовка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка монет на игровом поле.</li>
 * </ol>
 *
 * @param context
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
 * @returns
 */
export const DrawCoin = ({ G, ctx, ...rest }: FnContext, data: BoardProps, playerCells: JSX.Element[],
    type: DrawCoinTypeNames, coin: PublicPlayerCoinType, id: number, player: CanBeNullType<IPublicPlayer>,
    coinClasses?: CanBeNullType<string>, additionalParam?: CanBeNullType<number>, moveName?: CoinMoveNames,
    ...args: ArgsType): void => {
    let styles: IBackground = { background: `` },
        span: CanBeNullType<JSX.Element | number> = null,
        tdClasses = `bg-yellow-300`,
        spanClasses = ``,
        action: MoveFunctionType,
        _exhaustiveCheck: never;
    switch (moveName) {
        case CoinMoveNames.ChooseCoinValueForHrungnirUpgradeMove:
            action = data.moves.ChooseCoinValueForHrungnirUpgradeMove;
            break;
        case CoinMoveNames.ClickBoardCoinMove:
            action = data.moves.ClickBoardCoinMove;
            break;
        case CoinMoveNames.ClickHandCoinMove:
            action = data.moves.ClickHandCoinMove;
            break;
        case CoinMoveNames.ClickHandCoinUlineMove:
            action = data.moves.ClickHandCoinUlineMove;
            break;
        case CoinMoveNames.ClickHandTradingCoinUlineMove:
            action = data.moves.ClickHandTradingCoinUlineMove;
            break;
        // Start
        case CoinMoveNames.AddCoinToPouchMove:
            action = data.moves.AddCoinToPouchMove;
            break;
        case CoinMoveNames.ClickCoinToUpgradeMove:
            action = data.moves.ClickCoinToUpgradeMove;
            break;
        case CoinMoveNames.PickConcreteCoinToUpgradeMove:
            action = data.moves.PickConcreteCoinToUpgradeMove;
            break;
        case CoinMoveNames.UpgradeCoinVidofnirVedrfolnirMove:
            action = data.moves.UpgradeCoinVidofnirVedrfolnirMove;
            break;
        // Solo Bot
        case CoinMoveNames.SoloBotClickCoinToUpgradeMove:
            action = data.moves.SoloBotClickCoinToUpgradeMove;
            break;
        // Solo Bot Andvari
        case CoinMoveNames.SoloBotAndvariClickCoinToUpgradeMove:
            action = data.moves.SoloBotAndvariClickCoinToUpgradeMove;
            break;
        case undefined:
            action = null;
            break;
        default:
            _exhaustiveCheck = moveName;
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
            return _exhaustiveCheck;
    }
    if (action !== null) {
        tdClasses += ` cursor-pointer`;
    }
    if (type === DrawCoinTypeNames.Market) {
        if (!IsCoin(coin)) {
            throw new Error(`Монета на рынке не может отсутствовать.`);
        }
        styles = Styles.Coin(coin.value, false);
        spanClasses += `bg-market-coin`;
        if (coinClasses !== null && coinClasses !== undefined) {
            span = (<span className={coinClasses}>
                {additionalParam}
            </span>);
        }
    } else if (type === DrawCoinTypeNames.HiddenCoin) {
        spanClasses += `bg-coin`;
        if (IsCoin(coin) && coinClasses !== null && coinClasses !== undefined) {
            styles = Styles.CoinBack();
            span = (<span style={Styles.CoinSmall(coin.value, coin.isInitial)} className={coinClasses}>
            </span>);
        }
    } else {
        spanClasses += `bg-coin`;
        if (coinClasses !== null && coinClasses !== undefined) {
            spanClasses += ` ${coinClasses}`;
        }
        if (type === DrawCoinTypeNames.Coin) {
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
            if (type === DrawCoinTypeNames.BackSmallMarketCoin) {
                span = (<span style={Styles.Exchange()} className="bg-small-market-coin"></span>);
            } else if (type === DrawCoinTypeNames.BackTavernIcon) {
                if (additionalParam !== null && additionalParam !== undefined) {
                    span = (<span style={Styles.Tavern(additionalParam as IndexOf<TavernsConfigType>)}
                        className="bg-tavern-icon"></span>);
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
 * @param context
 * @param data Глобальные параметры.
 * @param playerHeaders Ячейки для отрисовки.
 * @param suit Фракция.
 * @param player Игрок.
 * @param moveName Название действия.
 * @returns
 */
export const DrawSuit = ({ G, ctx, ...rest }: FnContext, data: BoardProps, playerHeaders: JSX.Element[],
    suit: SuitNames, player?: IPublicPlayer, moveName?: SuitMoveNames): void => {
    let className = ``,
        action: MoveFunctionType,
        _exhaustiveCheck: never;
    switch (moveName) {
        case SuitMoveNames.ChooseSuitOlrunMove:
            action = data.moves.ChooseSuitOlrunMove;
            break;
        case SuitMoveNames.GetMjollnirProfitMove:
            action = data.moves.GetMjollnirProfitMove;
            break;
        case undefined:
            action = null;
            break;
        default:
            _exhaustiveCheck = moveName;
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.NoSuchMove);
            return _exhaustiveCheck;
    }
    if (action !== null) {
        className += ` cursor-pointer`;
    }
    playerHeaders.push(
        <th className={`${suitsConfig[suit].suitColor}${className}`}
            key={`${player === undefined ? `` : `${player.nickname} `}${suitsConfig[suit].suitName} suit`}
            onClick={() => action?.(suit)}>
            <span style={Styles.Suit(suit)} className="bg-suit-icon"></span>
        </th>
    );
};
