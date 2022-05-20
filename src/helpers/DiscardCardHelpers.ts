import { IsArtefactCard, IsMercenaryPlayerCard } from "../Camp";
import { IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { LogTypes, RusCardTypes } from "../typescript/enums";
import type { DeckCardTypes, IdavollDeckCardTypes, IMyGameState, IPublicPlayer, PlayerCardsType } from "../typescript/interfaces";

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
export const DiscardPickedCard = (G: IMyGameState, player: IPublicPlayer,
    discardedCard: PlayerCardsType | DeckCardTypes | IdavollDeckCardTypes): void => {
    // TODO Fix IdavollDeckCardTypes
    if (IsHeroCard(discardedCard)) {
        throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    }
    if (IsMercenaryPlayerCard(discardedCard) || IsArtefactCard(discardedCard)) {
        G.discardCampCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' отправил карту '${discardedCard.name}' в колоду сброса карт лагеря.`);
    } else if (IsActionCard(discardedCard) || IsCardNotActionAndNotNull(discardedCard)) {
        G.discardCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' отправил карту '${discardedCard.name}' в колоду сброса карт.`);
    }
};
