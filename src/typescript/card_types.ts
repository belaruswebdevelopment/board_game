import { IActionCard } from "./action_card_intarfaces";
import { IArtefactCampCard, IMercenaryCampCard } from "./camp_card_interfaces";
import { ICard } from "./card_interfaces";
import { IHero } from "./hero_card_interfaces";

/**
 * <h3>Типы данных для кэмпа.</h3>
 */
export type CampCardTypes = CampDeckCardTypes | null;

/**
 * <h3>Типы данных для дек карт кэмпа.</h3>
 */
export type CampDeckCardTypes = IArtefactCampCard | IMercenaryCampCard;

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = ICard | IActionCard;

/**
 * <h3>Типы данных для карт пикнутых игроком.</h3>
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
