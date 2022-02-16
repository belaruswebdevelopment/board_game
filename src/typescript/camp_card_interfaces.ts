import { IAction, IStack, IVariants } from "./action_interfaces";
import { IBuff } from "./buff_interfaces";
import { IValidatorsConfig } from "./hero_validator_interfaces";
import { IPublicPlayer } from "./player_interfaces";

/**
 * <h3>Интерфейс для данных карт кэмпа артефакт.</h3>
 */
export interface IArtefact {
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly tier: number,
    readonly suit: null | string,
    readonly rank: null | number,
    readonly points: null | number,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
    readonly scoringRule: (player?: IPublicPlayer) => number,
}

/**
 * <h3>Интерфейс для карты кэмпа артефакта.</h3>
 */
export interface IArtefactCampCard {
    readonly type: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: null | string,
    readonly rank: null | number,
    readonly points: null | number,
    readonly buff?: IBuff,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для конфига данных карт кэмпа артефакт.</h3>
 */
export interface IArtefactConfig {
    // TODO Can i rework [name: string]?
    readonly [name: string]: IArtefact,
}

/**
 * <h3>Интерфейс для создания карты кэмпа артефакта.</h3>
 */
export interface ICreateArtefactCampCard {
    readonly type?: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: null | string,
    readonly rank: null | number,
    readonly points: null | number,
    readonly buff?: IBuff,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для создания карты кэмпа наёмника.</h3>
 */
export interface ICreateMercenaryCampCard {
    readonly type?: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly game?: string,
    readonly variants: IVariants,
}

/**
 * <h3>Интерфейс для перечня данных карт кэмпа наёмники.</h3>
 */
export interface IMercenaries {
    // TODO Rework [name: string] to typeof/keyof SUITS
    readonly [name: string]: IMercenary,
}

/**
 * <h3>Интерфейс для данных карт кэмпа наёмник.</h3>
 */
export interface IMercenary {
    readonly suit: string,
    readonly rank: number,
    readonly points: null | number,
}

/**
 * <h3>Интерфейс для карты кэмпа наёмника.</h3>
 */
export interface IMercenaryCampCard {
    readonly type: string,
    readonly tier: number,
    readonly path: string,
    readonly name: string,
    readonly game: string,
    readonly variants: IVariants,
}
