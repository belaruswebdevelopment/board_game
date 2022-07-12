import { RusCardTypeNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с сбросом карт от действий сбрасывающих карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях сбрасывающих карты.</li>
 * </ol>
 *
 * @param G
 * @param player Игрок.
 * @param discardedCard Сбрасываемая карта.
 */
export const DiscardPickedCard = (G, discardedCard) => {
    switch (discardedCard.type) {
        case RusCardTypeNames.Mercenary_Player_Card:
        case RusCardTypeNames.Artefact_Card:
            G.discardCampCardsDeck.push(discardedCard);
            break;
        case RusCardTypeNames.Dwarf_Card:
        case RusCardTypeNames.Royal_Offering_Card:
            G.discardCardsDeck.push(discardedCard);
            break;
        case RusCardTypeNames.Giant_Card:
        case RusCardTypeNames.God_Card:
        case RusCardTypeNames.Valkyry_Card:
        case RusCardTypeNames.Mythical_Animal_Card:
            G.discardMythologicalCreaturesCards.push(discardedCard);
            break;
        case RusCardTypeNames.Special_Card:
            G.discardSpecialCards.push(discardedCard);
            break;
        case RusCardTypeNames.Multi_Suit_Player_Card:
            G.discardMultiCards.push(discardedCard);
            break;
        case RusCardTypeNames.Hero_Player_Card:
            throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypeNames.Hero_Player_Card}'.`);
        default:
            throw new Error(`Сброшенная карта не может быть с недопустимым для сброса типом.`);
    }
};
//# sourceMappingURL=DiscardCardHelpers.js.map