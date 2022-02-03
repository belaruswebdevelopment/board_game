import { IAction, IStack, IVariants } from "./action_interfaces";
import { IBuff } from "./buff_interfaces";
import { IValidatorsConfig } from "./hero_validator_interfaces";
import { IPublicPlayer } from "./player_interfaces";

/**
 * <h3>Интерфейс для данных карт кэмпа артефакт.</h3>
 */
export interface IArtefact {
    name: string,
    description: string,
    game: string,
    tier: number,
    suit: null | string,
    rank: null | number,
    points: null | number,
    buff?: IBuff,
    validators?: IValidatorsConfig,
    actions?: IAction,
    stack?: IStack[],
    scoringRule: (player?: IPublicPlayer, suit?: string) => number,
}

/**
 * <h3>Интерфейс для карты кэмпа артефакта.</h3>
 */
export interface IArtefactCampCard {
    type: string,
    tier: number,
    path: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    buff?: IBuff,
    actions?: IAction,
    stack?: IStack[],
}

/**
 * <h3>Интерфейс для конфига данных карт кэмпа артефакт.</h3>
 */
export interface IArtefactConfig {
    // TODO Can i rework [name: string]?
    [name: string]: IArtefact,
}

/**
 * <h3>Интерфейс для создания карты кэмпа артефакта.</h3>
 */
export interface ICreateArtefactCampCard {
    type?: string,
    tier: number,
    path: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    buff?: IBuff,
    actions?: IAction,
    stack?: IStack[],
}

/**
 * <h3>Интерфейс для создания карты кэмпа наёмника.</h3>
 */
export interface ICreateMercenaryCampCard {
    type?: string,
    tier: number,
    path: string,
    name: string,
    game?: string,
    variants: IVariants,
}

/**
 * <h3>Интерфейс для перечня данных карт кэмпа наёмники.</h3>
 */
export interface IMercenaries {
    // TODO Rework [name: string] to typeof/keyof SUITS
    [name: string]: IMercenary,
}

/**
 * <h3>Интерфейс для данных карт кэмпа наёмник.</h3>
 */
export interface IMercenary {
    suit: string,
    rank: number,
    points: null | number,
}

/**
 * <h3>Интерфейс для карты кэмпа наёмника.</h3>
 */
export interface IMercenaryCampCard {
    type: string,
    tier: number,
    path: string,
    name: string,
    game: string,
    variants: IVariants,
}
