import { IAction, IStack } from "./action_interfaces";
import { IBuff } from "./buff_interfaces";
import { IValidatorsConfig } from "./hero_validator_interfaces";
import { IPublicPlayer } from "./player_interfaces";

/**
 * <h3>Интерфейс для создания героя.</h3>
 */
export interface ICreateHero {
    type: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    active?: boolean,
    buff?: IBuff,
    validators?: IValidatorsConfig,
    actions?: IAction,
    stack?: IStack[],
}

/**
 * <h3>Интерфейс для героя.</h3>
 */
export interface IHero {
    type: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    active: boolean,
    buff?: IBuff,
    validators?: IValidatorsConfig,
    actions?: IAction,
    stack?: IStack[],
}

/**
 * <h3>Интерфейс для конфига карт героев.</h3>
 */
export interface IHeroConfig {
    // TODO Rework [name: string]?
    [name: string]: IHeroData,
}

/**
 * <h3>Интерфейс для данных карты героя.</h3>
 */
export interface IHeroData {
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    buff?: IBuff,
    validators?: IValidatorsConfig,
    actions?: IAction,
    stack?: IStack[],
    scoringRule: (player?: IPublicPlayer) => number,
}
