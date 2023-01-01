import { ChangeIsOpenedCoinStatus } from "../Coin";
import { AllStackData } from "../data/StackData";
import { StartAutoAction } from "../dispatchers/AutoActionDispatcher";
import { ThrowMyError } from "../Error";
import { AddCampCardToCards, AddCoinOnOdroerirTheMythicCauldronCampCard } from "../helpers/CampCardHelpers";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { DiscardCurrentCard, RemoveCardFromPlayerBoardSuitCards, RemoveCardsFromCampAndAddIfNeeded } from "../helpers/DiscardCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, CardTypeRusNames, CoinTypeNames, ErrorNames, GameModeNames, LogTypeNames, PhaseNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с добавлением монет в кошель для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @returns
 */
export const AddCoinToPouchAction = ({ G, ctx, myPlayerID, ...rest }, coinId) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const tempId = player.boardCoins.findIndex((coin, index) => index >= G.tavernsNum && coin === null);
    if (tempId === -1) {
        throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const handCoin = handCoins[coinId];
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
 * <li>При выборе карты лагеря Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param context
 * @param value Значение улучшения монеты.
 * @returns
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeAction = ({ G, ctx, myPlayerID, ...rest }, value) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.upgradeCoinVidofnirVedrfolnir(value, stack.coinId, stack.priority === 0 ? undefined : 3)]);
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
export const DiscardSuitCardAction = ({ G, ctx, myPlayerID, ...rest }, cardId) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const discardedCard = RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID, ...rest }, SuitNames.warrior, cardId);
    DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' убрана в сброс из-за выбора карты '${CardTypeRusNames.Artefact_Card}' '${ArtefactNames.Hofud}'.`);
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
export const PickCampCardAction = ({ G, ctx, myPlayerID, ...rest }, cardId) => {
    var _a;
    const campCard = G.camp[cardId];
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта лагеря с id '${cardId}'.`);
    }
    RemoveCardsFromCampAndAddIfNeeded({ G, ctx, ...rest }, cardId, [null]);
    AddCampCardToCards({ G, ctx, myPlayerID, ...rest }, campCard);
    if (campCard.type === CardTypeRusNames.Artefact_Card) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, (_a = campCard.stack) === null || _a === void 0 ? void 0 : _a.player, campCard);
        StartAutoAction({ G, ctx, myPlayerID, ...rest }, campCard.actions);
    }
    if (campCard.type === CardTypeRusNames.Mercenary_Card && ctx.phase === PhaseNames.EnlistmentMercenaries) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.placeEnlistmentMercenaries(campCard)]);
    }
    if (G.odroerirTheMythicCauldron) {
        AddCoinOnOdroerirTheMythicCauldronCampCard({ G, ctx, ...rest });
    }
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
export const UpgradeCoinVidofnirVedrfolnirAction = ({ G, ctx, myPlayerID, ...rest }, coinId, type) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const value = UpgradeCoinActions({ G, ctx, myPlayerID, ...rest }, coinId, type);
    if (value !== 5 && stack.priority === 0) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([value === 2 ? 3 : 2], coinId, 3)]);
    }
};
//# sourceMappingURL=CampActions.js.map