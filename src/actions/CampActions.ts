import { ChangeIsOpenedCoinStatus } from "../Coin";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddAnyCardToPlayerActions } from "../helpers/CardHelpers";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { DiscardCurrentCard, RemoveCardFromPlayerBoardSuitCards, RemoveCardsFromCampAndAddIfNeeded } from "../helpers/DiscardCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, CardTypeRusNames, CoinTypeNames, ErrorNames, GameModeNames, LogTypeNames, SuitNames } from "../typescript/enums";
import type { BasicVidofnirVedrfolnirUpgradeValueType, CampCardArray, CampCardType, CanBeUndefType, IndexOf, MyFnContextWithMyPlayerID, Player, PlayerBoardCardType, PublicPlayer, PublicPlayerCoinType, Stack } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с добавлением монет в кошель для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты артефакта Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @returns
 */
export const AddCoinToPouchAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, coinId: number):
    void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<Player> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const tempId: number =
        player.boardCoins.findIndex((coin: PublicPlayerCoinType, index: number): boolean =>
            index >= G.tavernsNum && coin === null);
    if (tempId === -1) {
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.VidofnirVedrfolnir}'.`);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinId];
    if (handCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует выбранная монета с id '${coinId}': это должно проверяться в MoveValidator.`);
    }
    if (handCoin === null) {
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может не быть монеты с id '${coinId}'.`);
    }
    if (!IsCoin(handCoin)) {
        throw new Error(`Монета с id '${coinId}' в руке текущего игрока с id '${myPlayerID}' не может быть закрытой для него.`);
    }
    if (!handCoin.isOpened) {
        ChangeIsOpenedCoinStatus(handCoin, true);
    }
    if (G.mode === GameModeNames.Multiplayer) {
        player.handCoins[coinId] = null;
        privatePlayer.boardCoins[tempId] = handCoin;
    }
    player.boardCoins[tempId] = handCoin;
    handCoins[coinId] = null;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' положил монету ценностью '${handCoin.value}' в свой кошель.`);
};

/**
 * <h3>Действия, связанные с выбором значения улучшения монеты при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты артефакта Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param context
 * @param value Значение улучшения монеты.
 * @returns
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeAction = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID, value: BasicVidofnirVedrfolnirUpgradeValueType): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<Stack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    AddActionsToStack({ G, ctx, myPlayerID, ...rest },
        [AllStackData.upgradeCoinVidofnirVedrfolnir(value, stack.coinId,
            stack.priority === 0 ? undefined : 3)]);
};

/**
 * <h3>Действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для сброса по действию карты лагеря артефакта Hofud.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id сбрасываемой карты.
 * @returns
 */
export const DiscardSuitCardAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, cardId: number):
    void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const discardedCard: PlayerBoardCardType =
        RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID, ...rest }, SuitNames.warrior, cardId);
    DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' убрана в сброс из-за выбора карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Hofud}'.`);
    player.stack = [];
};

/**
 * <h3>Действия, связанные с выбором карты лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря.</li>
 * <li>При выборе карты лагеря по действию персонажа Хольда.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id выбранной карты.
 * @returns
 */
export const PickCampCardAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    cardId: IndexOf<CampCardArray>): void => {
    const campCard: CampCardType = G.camp[cardId];
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта лагеря с id '${cardId}'.`);
    }
    RemoveCardsFromCampAndAddIfNeeded({ G, ctx, ...rest }, cardId, [null]);
    AddAnyCardToPlayerActions({ G, ctx, myPlayerID, ...rest }, campCard);
};

/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты лагеря артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const UpgradeCoinVidofnirVedrfolnirAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    coinId: number, type: CoinTypeNames): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<Stack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const value: number = UpgradeCoinActions({ G, ctx, myPlayerID, ...rest }, coinId, type);
    if (value !== 5 && stack.priority === 0) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest },
            [AllStackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([value === 2 ? 3 : 2],
                coinId, 3)]);
    }
};
