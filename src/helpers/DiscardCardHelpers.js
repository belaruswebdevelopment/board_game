import { ThrowMyError } from "../Error";
import { CardTypeRusNames, ErrorNames, SuitNames, SuitRusNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с убиранием фракционной карты со стола игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, убирающих фракционные карты со стола игрока.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @param cardId Id убираемой карты.
 * @returns Убранная карта.
 */
export const RemoveCardFromPlayerBoardSuitCards = ({ G, ctx, myPlayerID, ...rest }, suit, cardId) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const removedCard = player.cards[suit].splice(cardId, 1)[0];
    if (removedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${myPlayerID}' отсутствует выбранная карта во фракции '${SuitRusNames[suit]}' с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    return removedCard;
};
/**
 * <h3>Действия, связанные с убиранием из таверны карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты из таверны.</li>
 * <li>При ручном сбросе конкретной карты из таверны.</li>
 * <li>При автоматическом сбросе оставшейся карты из таверны.</li>
 * </ol>
 *
 * @param context
 * @param tavernCardId Id убираемой из таверны карты.
 * @returns Убранная из таверны карта.
 */
export const RemoveCardFromTavern = ({ G, ctx, ...rest }, tavernCardId) => {
    const currentTavern = G.taverns[G.currentTavern], removedTavernCard = currentTavern[tavernCardId];
    if (removedTavernCard === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, tavernCardId);
    }
    if (removedTavernCard === null) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsNull, tavernCardId);
    }
    currentTavern.splice(tavernCardId, 1, null);
    return removedTavernCard;
};
/**
 * <h3>Действия, связанные с убиранием карт из лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, убирающих карты из лагеря.</li>
 * </ol>
 *
 * @param context
 * @param campCardId Id убираемой карты из лагеря.
 * @param addToCampArray Массив добавляемых в лагерь элементов.
 * @returns Убранная карта из лагеря.
 */
export const RemoveCardsFromCampAndAddIfNeeded = ({ G }, campCardId, addToCampArray) => {
    const removedCampCard = G.camp.splice(campCardId, 1, ...addToCampArray)[0];
    if (removedCampCard === undefined) {
        throw new Error(`В массиве карт лагеря отсутствует карта лагеря с id '${campCardId}' для сброса.`);
    }
    return removedCampCard;
};
// TODO Rework CampDeckCardType[] to universal all discarded card types
/**
 * <h3>Действия, связанные с сбросом карт от действий сбрасывающих карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях сбрасывающих карты.</li>
 * </ol>
 *
 * @param context
 * @param discardedCardsArray Сбрасываемые карты.
 * @returns
 */
export const DiscardAllCurrentCards = ({ G, ...rest }, discardedCardsArray) => {
    for (let i = 0; i < discardedCardsArray.length; i++) {
        const campCard = discardedCardsArray[i];
        if (campCard === undefined) {
            throw new Error(`Сброшенная карта не может отсутствовать в массиве карт для сброса.`);
        }
        DiscardCurrentCard({ G, ...rest }, campCard);
    }
};
/**
 * <h3>Действия, связанные с сбросом карты от действий сбрасывающих карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях сбрасывающих карты.</li>
 * </ol>
 *
 * @param context
 * @param discardedCard Сбрасываемая карта.
 * @returns
 */
export const DiscardCurrentCard = ({ G }, discardedCard) => {
    let _exhaustiveCheck;
    switch (discardedCard.type) {
        case CardTypeRusNames.Mercenary_Card:
        case CardTypeRusNames.Mercenary_Player_Card:
        case CardTypeRusNames.Artefact_Card:
        case CardTypeRusNames.Artefact_Player_Card:
            // TODO Mercenary_Player_Card must be discarded as basic Mercenary_Card!?...
            G.discardCampCardsDeck.push(discardedCard);
            break;
        case CardTypeRusNames.Dwarf_Card:
        case CardTypeRusNames.Royal_Offering_Card:
            G.discardCardsDeck.push(discardedCard);
            break;
        case CardTypeRusNames.Giant_Card:
        case CardTypeRusNames.God_Card:
        case CardTypeRusNames.Valkyry_Card:
        case CardTypeRusNames.Mythical_Animal_Card:
            G.discardMythologicalCreaturesCards.push(discardedCard);
            break;
        case CardTypeRusNames.Special_Card:
            G.discardSpecialCards.push(discardedCard);
            break;
        case CardTypeRusNames.Multi_Suit_Player_Card:
            G.discardMultiCards.push(discardedCard);
            break;
        case CardTypeRusNames.Hero_Player_Card:
            throw new Error(`Сброшенная карта не может быть с типом '${CardTypeRusNames.Hero_Player_Card}'.`);
        default:
            _exhaustiveCheck = discardedCard;
            throw new Error(`Сброшенная карта не может быть с недопустимым для сброса типом.`);
            return _exhaustiveCheck;
    }
};
//# sourceMappingURL=DiscardCardHelpers.js.map