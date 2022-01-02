import { IActionCard, IArtefactCampCard, ICard, IHero, IMercenaryCampCard } from "./interfaces";

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = ICard | IActionCard;

/**
 * <h3>Типы данных для карт на планшете игрока.</h3>
 */
export type PlayerCardsType = ICard | IArtefactCampCard | IHero;

/**
 * <h3>Типы данных для дек карт кэмпа.</h3>
 */
export type CampDeckCardTypes = IArtefactCampCard | IMercenaryCampCard;

/**
 * <h3>Типы данных для кэмпа.</h3>
 */
export type CampCardTypes = CampDeckCardTypes | null;

/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardTypes = DeckCardTypes | null;

/**
 * <h3>Типы данных для карт пикнутых игроком.</h3>
 */
export type PickedCardType = DeckCardTypes | CampDeckCardTypes | IHero | null;
