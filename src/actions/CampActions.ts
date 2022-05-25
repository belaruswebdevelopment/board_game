import type { Ctx } from "boardgame.io";
import { IsArtefactCard } from "../Camp";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards, AddCoinOnOdroerirTheMythicCauldronCampCard } from "../helpers/CampCardHelpers";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { DiscardPickedCard } from "../helpers/DiscardCardHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, CoinTypeNames, LogTypes, SuitNames } from "../typescript/enums";
import type { CampCardTypes, CanBeUndef, IMyGameState, IPlayer, IPublicPlayer, PlayerCardTypes, PublicPlayerCoinTypes } from "../typescript/interfaces";
import { StartVidofnirVedrfolnirAction } from "./CampAutoActions";

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
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
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
    AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' положил монету ценностью '${handCoin.value}' в свой кошель.`);
    StartVidofnirVedrfolnirAction(G, ctx);
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
        throw new Error(`В массиве игроков отсутствует игрок с id '${ctx.playerID}'.`);
    }
    const discardedCard: CanBeUndef<PlayerCardTypes> =
        player.cards[SuitNames.WARRIOR].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    DiscardPickedCard(G, player, discardedCard);
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
    if (IsArtefactCard(campCard)) {
        AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
        StartAutoAction(G, ctx, campCard.actions);
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
    const value: number = UpgradeCoinActions(G, ctx, coinId, type);
    if (value === 3) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinVidofnirVedrfolnir(2, coinId)]);
    }
};
