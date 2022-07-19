import type { Ctx } from "boardgame.io";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards, AddCoinOnOdroerirTheMythicCauldronCampCard } from "../helpers/CampCardHelpers";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { DiscardPickedCard } from "../helpers/DiscardCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, CoinTypeNames, ErrorNames, LogTypeNames, PhaseNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
import type { BasicVidofnirVedrfolnirUpgradeValueTypes, CampCardTypes, CanBeUndef, IMyGameState, IPlayer, IPublicPlayer, IStack, PlayerCardTypes, PublicPlayerCoinTypes } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с добавлением монет в кошель для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchAction = (G: IMyGameState, ctx: Ctx, coinId: number): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
            ctx.currentPlayer);
    }
    const tempId: number =
        player.boardCoins.findIndex((coin: PublicPlayerCoinTypes, index: number): boolean =>
            index >= G.tavernsNum && coin === null);
    if (tempId === -1) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[coinId];
    if (handCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует выбранная монета с id '${coinId}': это должно проверяться в MoveValidator.`);
    }
    if (handCoin === null) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${coinId}'.`);
    }
    if (!IsCoin(handCoin)) {
        throw new Error(`Монета с id '${coinId}' в руке текущего игрока с id '${ctx.currentPlayer}' не может быть закрытой для него.`);
    }
    if (!handCoin.isOpened) {
        ChangeIsOpenedCoinStatus(handCoin, true);
    }
    if (G.multiplayer) {
        player.handCoins[coinId] = null;
        privatePlayer.boardCoins[tempId] = handCoin;
    }
    player.boardCoins[tempId] = handCoin;
    handCoins[coinId] = null;
    AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' положил монету ценностью '${handCoin.value}' в свой кошель.`);
};

/**
 * <h3>Действия, связанные с выбором значения улучшения монеты при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param value Значение улучшения монеты.
 */
export const ChooseCoinValueForVidofnirVedrfolnirUpgradeAction = (G: IMyGameState, ctx: Ctx,
    value: BasicVidofnirVedrfolnirUpgradeValueTypes): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndef<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
    }
    AddActionsToStack(G, ctx,
        [StackData.upgradeCoinVidofnirVedrfolnir(value, stack.coinId,
            stack.priority === 0 ? undefined : 3)]);
};

/**
 * <h3>Действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для сбросом по действию карты лагеря артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.playerID)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            ctx.playerID!);
    }
    const discardedCard: CanBeUndef<PlayerCardTypes> =
        player.cards[SuitNames.Warrior].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    DiscardPickedCard(G, discardedCard);
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
 * @param G
 * @param ctx
 * @param cardId Id выбранной карты.
 */
export const PickCampCardAction = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    const campCard: CanBeUndef<CampCardTypes> = G.camp[cardId];
    if (campCard === undefined) {
        throw new Error(`Отсутствует кликнутая карта лагеря с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта лагеря с id '${cardId}'.`);
    }
    G.camp.splice(cardId, 1, null);
    AddCampCardToCards(G, ctx, campCard);
    if (campCard.type === RusCardTypeNames.Artefact_Card) {
        AddActionsToStack(G, ctx, campCard.stack, campCard);
        StartAutoAction(G, ctx, campCard.actions);
    }
    if (campCard.type === RusCardTypeNames.Mercenary_Card && ctx.phase === PhaseNames.EnlistmentMercenaries) {
        AddActionsToStack(G, ctx, [StackData.placeEnlistmentMercenaries(campCard)]);
    }
    if (G.odroerirTheMythicCauldron) {
        AddCoinOnOdroerirTheMythicCauldronCampCard(G);
    }
};

/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты лагеря артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G: IMyGameState, ctx: Ctx, coinId: number, type: CoinTypeNames):
    void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndef<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
    }
    const value: number = UpgradeCoinActions(G, ctx, coinId, type);
    if (value !== 5 && stack.priority === 0) {
        AddActionsToStack(G, ctx,
            [StackData.startChooseCoinValueForVidofnirVedrfolnirUpgrade([value === 2 ? 3 : 2],
                coinId, 3)]);
    }
};
