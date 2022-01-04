import { IStack } from "./interfaces";
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
    stack: IStack[],
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
    stack: IStack[],
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
    stack: IStack[],
    scoringRule: (player?: IPublicPlayer) => number,
}

/**
 * <h3>Интерфейс для конфига карт героев.</h3>
 */
export interface IHeroConfig {
    [name: string]: IHeroData,
}
