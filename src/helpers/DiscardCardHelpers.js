import { IsArtefactCard, IsMercenaryPlayerCard } from "../Camp";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { LogTypes, RusCardTypes } from "../typescript/enums";
export const DiscardPickedCard = (G, player, discardedCard) => {
    if (IsHeroCard(discardedCard)) {
        throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    }
    if (IsMercenaryPlayerCard(discardedCard) || IsArtefactCard(discardedCard)) {
        G.discardCampCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' отправил карту '${discardedCard.name}' в колоду сброса карт лагеря.`);
    }
    else if (IsActionCard(discardedCard) || IsCardNotActionAndNotNull(discardedCard)) {
        G.discardCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' отправил карту '${discardedCard.name}' в колоду сброса карт.`);
    }
};
//# sourceMappingURL=DiscardCardHelpers.js.map