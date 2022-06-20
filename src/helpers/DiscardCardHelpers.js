import { IsArtefactCard, IsMercenaryPlayerCard } from "../Camp";
import { IsDwarfCard } from "../Dwarf";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { IsGiantCard, IsGodCard, IsMythicalAnimalCard, IsValkyryCard } from "../MythologicalCreature";
import { IsRoyalOfferingCard } from "../RoyalOffering";
import { IsSpecialCard } from "../SpecialCard";
import { LogTypes, RusCardTypes } from "../typescript/enums";
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
export const DiscardPickedCard = (G, player, discardedCard) => {
    if (IsHeroCard(discardedCard)) {
        throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.Hero}'.`);
    }
    if (IsMercenaryPlayerCard(discardedCard) || IsArtefactCard(discardedCard)) {
        G.discardCampCardsDeck.push(discardedCard);
    }
    else if (IsRoyalOfferingCard(discardedCard) || IsDwarfCard(discardedCard)) {
        G.discardCardsDeck.push(discardedCard);
    }
    else if (IsGiantCard(discardedCard) || IsGodCard(discardedCard) || IsValkyryCard(discardedCard)
        || IsMythicalAnimalCard(discardedCard)) {
        G.discardMythologicalCreaturesCards.push(discardedCard);
    }
    else if (IsSpecialCard(discardedCard)) {
        G.discardSpecialCards.push(discardedCard);
    }
    // TODO Add discard of Olwin's double cards!
    AddDataToLog(G, LogTypes.Game, `Игрок '${player.nickname}' отправил карту '${discardedCard.type}' '${discardedCard.name}' в колоду сброса карт.`);
};
//# sourceMappingURL=DiscardCardHelpers.js.map