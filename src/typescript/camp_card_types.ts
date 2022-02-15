import { IArtefactCampCard, IMercenaryCampCard } from "./camp_card_interfaces";

/**
 * <h3>Типы данных для кэмпа.</h3>
 */
export type CampCardTypes = CampDeckCardTypes | null;

/**
 * <h3>Типы данных для карт колоды кэмпа.</h3>
 */
export type CampDeckCardTypes = IArtefactCampCard | IMercenaryCampCard;
