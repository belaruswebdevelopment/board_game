import { IAction, IStack } from "./action_interfaces";
import { IBuff } from "./buff_interfaces";
import { IValidatorsConfig } from "./hero_validator_interfaces";
import { IPublicPlayer } from "./player_interfaces";

/**
 * <h3>Интерфейс для создания героя.</h3>
 */
export interface ICreateHero {
    readonly type: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: null | string,
    readonly rank: null | number,
    readonly points: null | number,
    readonly active?: boolean,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для героя.</h3>
 */
export interface IHero {
    readonly type: string,
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: null | string,
    readonly rank: null | number,
    readonly points: null | number,
    active: boolean,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
}

/**
 * <h3>Интерфейс для конфига карт героев.</h3>
 */
export interface IHeroConfig {
    // TODO Rework [name: string]?
    readonly [name: string]: IHeroData,
}

/**
 * <h3>Интерфейс для данных карты героя.</h3>
 */
export interface IHeroData {
    readonly name: string,
    readonly description: string,
    readonly game: string,
    readonly suit: null | string,
    readonly rank: null | number,
    readonly points: null | number,
    readonly buff?: IBuff,
    readonly validators?: IValidatorsConfig,
    readonly actions?: IAction,
    readonly stack?: IStack[],
    readonly scoringRule: (player?: IPublicPlayer) => number,
}
