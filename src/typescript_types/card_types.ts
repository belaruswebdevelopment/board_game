import { IActionCard } from "../typescript_interfaces/action_card_interfaces";
import { IArtefactCampCard } from "../typescript_interfaces/camp_card_interfaces";
import { ICard } from "../typescript_interfaces/card_interfaces";
import { IHeroCard } from "../typescript_interfaces/hero_card_interfaces";
import { CampDeckCardTypes } from "./camp_card_types";

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = ICard | IActionCard;

/**
 * <h3>Типы данных для карт колоды сброса.</h3>
 */
export type DiscardCardTypes = DeckCardTypes | IArtefactCampCard;

export type CardsHasStack = IHeroCard | IArtefactCampCard | IActionCard;

export type CardsHasStackValidators = IHeroCard | IArtefactCampCard;

/**
 * <h3>Типы данных для карт выбранных игроком.</h3>
 */
export type PickedCardType = DeckCardTypes | CampDeckCardTypes | IHeroCard | null;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardsType = ICard | IArtefactCampCard | IHeroCard;

/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardTypes = DeckCardTypes | null;
