import { IActionCard } from "./action_card_interfaces";
import { IAction } from "./action_interfaces";
import { IArtefact, IArtefactCampCard } from "./camp_card_interfaces";
import { CampDeckCardTypes } from "./camp_card_types";
import { ICard } from "./card_interfaces";
import { IHero } from "./hero_card_interfaces";

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = ICard | IActionCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardCardTypes = IActionCard | IArtefactCampCard | ICard;

export type CardsHasStack = IHero | IArtefact | IAction;

export type CardsHasStackValidators = IHero | IArtefact;

/**
 * <h3>Типы данных для карт выбранных игроком.</h3>
 */
export type PickedCardType = DeckCardTypes | CampDeckCardTypes | IHero | null;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardsType = ICard | IArtefactCampCard | IHero;

/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardTypes = DeckCardTypes | null;
