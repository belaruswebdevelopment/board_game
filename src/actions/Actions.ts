import { CreateMercenaryPlayerCampCard } from "../Camp";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { AddBuffToPlayer, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer, PickCardOrActionCardActions } from "../helpers/CardHelpers";
import { DiscardCurrentCard, RemoveCardFromPlayerBoardSuitCards, RemoveCardFromTavern } from "../helpers/DiscardCardHelpers";
import { CheckAndMoveThrudAction } from "../helpers/HeroActionHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { IsMercenaryCampCard } from "../is_helpers/IsCampTypeHelpers";
import { AddDataToLog } from "../Logging";
import { DiscardConcreteCardFromTavern } from "../Tavern";
import { ArtefactNames, BuffNames, CampBuffNames, ErrorNames, LogTypeNames, PhaseNames, RusCardTypeNames, RusSuitNames, SuitNames } from "../typescript/enums";
import type { CampDeckCardType, CanBeUndefType, DeckCardType, DiscardDeckCardType, IActionFunctionWithoutParams, IMercenaryCampCard, IMercenaryPlayerCampCard, IPublicPlayer, IStack, MyFnContextWithMyPlayerID, PlayerCardType, TavernCardWithExpansionType } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с выбором карты из таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе карты из таверны игроком.</li>
 * <li>Применяется при выборе карты из таверны соло ботом.</li>
 * <li>Применяется при выборе карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param tavernCardId Id карты.
 * @returns
 */
export const ClickCardAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, tavernCardId: number):
    void => {
    const tavernCard: TavernCardWithExpansionType = RemoveCardFromTavern({ G, ctx, ...rest }, tavernCardId);
    PickCardOrActionCardActions({ G, ctx, myPlayerID, ...rest }, tavernCard);
};

/**
 * <h3>Действия, связанные с отправкой любой указанной карты со стола игрока в колоду сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при отправке карты в колоду сброса в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @param cardId Id карты.
 * @returns
 */
export const DiscardAnyCardFromPlayerBoardAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    suit: SuitNames, cardId: number): void => {
    const discardedCard: PlayerCardType =
        RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID, ...rest }, suit, cardId);
    DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Карта '${discardedCard.type}' '${discardedCard.name}' убрана в сброс из-за эффекта карты '${RusCardTypeNames.Artefact_Card}' '${ArtefactNames.Brisingamens}'.`);
    DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, CampBuffNames.DiscardCardEndGame);
};

/**
 * <h3>Сбрасывает карту из таверны в колоду сброса по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется после выбора первым игроком карты из лагеря при игре на двух игроков.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id карты.
 * @returns
 */
export const DiscardCardFromTavernAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    cardId: number): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' должен сбросить в колоду сброса карту из текущей таверны:`);
    DiscardConcreteCardFromTavern({ G, ctx, ...rest }, cardId);
    if (ctx.numPlayers === 2) {
        G.tavernCardDiscarded2Players = true;
    }
};

/**
 * <h3>Игрок выбирает наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать наёмника для вербовки.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id карты.
 * @returns
 */
export const GetEnlistmentMercenariesAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    cardId: number): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    const pickedCard: CanBeUndefType<CampDeckCardType> = player.campCards[cardId];
    if (pickedCard === undefined) {
        throw new Error(`В массиве карт лагеря игрока с id '${myPlayerID}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    if (pickedCard.type !== RusCardTypeNames.Mercenary_Card) {
        throw new Error(`Выбранная карта должна быть с типом '${RusCardTypeNames.Mercenary_Card}'.`);
    }
    AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [StackData.placeEnlistmentMercenaries(pickedCard)]);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' во время фазы '${ctx.phase}' выбрал наёмника '${pickedCard.name}'.`);
};

/**
 * <h3>Выбор фракции для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const GetMjollnirProfitAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, suit: SuitNames):
    void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    AddBuffToPlayer({ G, ctx, myPlayerID, ...rest }, {
        name: BuffNames.SuitIdForMjollnir,
    }, suit);
    DeleteBuffFromPlayer({ G, ctx, myPlayerID, ...rest }, CampBuffNames.GetMjollnirProfit);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' выбрал фракцию '${suitsConfig[suit].suitName}' для эффекта артефакта '${ArtefactNames.Mjollnir}'.`);
};

/**
 * <h3>Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Может применятся первым игроком в фазе вербовки наёмников.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const PassEnlistmentMercenariesAction: IActionFunctionWithoutParams = ({ G, ctx, myPlayerID, ...rest }):
    void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' пасанул во время фазы '${ctx.phase}'.`);
};

/**
 * <h3>Действия, связанные с взятием карт из колоды сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из колоды сброса.</li>
 * <li>При выборе конкретных карт лагеря, дающих возможность взять карты из колоды сброса.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id карты.
 * @returns
 */
export const PickDiscardCardAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, cardId: number):
    void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    const card: CanBeUndefType<DiscardDeckCardType> = G.discardCardsDeck.splice(cardId, 1)[0];
    if (card === undefined) {
        throw new Error(`В массиве колоды сброса отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' взял карту '${card.name}' из колоды сброса.`);
    PickCardOrActionCardActions({ G, ctx, myPlayerID, ...rest }, card);
};

/**
 * <h3>Действия, связанные с взятием базовой карты из новой эпохи по преимуществу по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков игроком.</li>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом.</li>
 * <li>При выборе базовой карты из новой эпохи по преимуществу по фракции разведчиков соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param cardId Id карты.
 * @returns
 */
export const PickCardToPickDistinctionAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    cardId: number): void => {
    if (G.explorerDistinctionCards === null) {
        throw new Error(`В массиве карт для получения преимущества по фракции '${RusSuitNames.explorer}' не может не быть карт.`);
    }
    const pickedCard: CanBeUndefType<DeckCardType> =
        G.explorerDistinctionCards.splice(cardId, 1)[0];
    if (pickedCard === undefined) {
        throw new Error(`Отсутствует выбранная карта с id '${cardId}' эпохи '2'.`);
    }
    G.explorerDistinctionCards.splice(0);
    PickCardOrActionCardActions({ G, ctx, myPlayerID, ...rest }, pickedCard);
    if (pickedCard.type === RusCardTypeNames.Dwarf_Card) {
        G.distinctions[SuitNames.explorer] = undefined;
    }
    G.explorerDistinctionCardId = cardId;
};

/**
 * <h3>Игрок выбирает фракцию для вербовки указанного наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать фракцию для вербовки наёмника.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns
 */
export const PlaceEnlistmentMercenariesAction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    suit: SuitNames): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined,
            myPlayerID);
    }
    if (!IsMercenaryCampCard(stack.card)) {
        throw new Error(`Выбранная карта должна быть типа '${RusCardTypeNames.Mercenary_Card}'.`);
    }
    const mercenaryCard: CanBeUndefType<IMercenaryCampCard> = stack.card;
    if (mercenaryCard === undefined) {
        throw new Error(`В стеке отсутствует 'card'.`);
    }
    const cardVariants = mercenaryCard.variants[suit];
    if (cardVariants === undefined) {
        throw new Error(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${suit}'.`);
    }
    const mercenaryPlayerCard: IMercenaryPlayerCampCard = CreateMercenaryPlayerCampCard({
        suit,
        points: cardVariants.points,
        name: mercenaryCard.name,
        path: mercenaryCard.path,
    }),
        cardIndex: number = player.campCards.findIndex((card: CampDeckCardType): boolean =>
            card.name === mercenaryCard.name);
    if (cardIndex === -1) {
        throw new Error(`У игрока с id '${myPlayerID}' в массиве карт лагеря отсутствует выбранная карта.`);
    }
    AddCardToPlayer({ G, ctx, myPlayerID, ...rest }, mercenaryPlayerCard);
    player.campCards.splice(cardIndex, 1);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' во время фазы '${PhaseNames.EnlistmentMercenaries}' завербовал карту '${mercenaryPlayerCard.type}' '${mercenaryPlayerCard.name}' во фракцию '${suitsConfig[suit].suitName}'.`);
    CheckAndMoveThrudAction({ G, ctx, myPlayerID, ...rest }, mercenaryPlayerCard);
};
