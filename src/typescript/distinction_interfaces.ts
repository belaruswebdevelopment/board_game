import { Ctx } from "boardgame.io";
import { IMyGameState } from "./game_data_interfaces";
import { IPublicPlayer } from "./player_interfaces";
import { DistinctionTypes } from "./types";

/**
 * <h3>Интерфейс для преимуществ по фракциям.</h3>
 */
export interface IAwarding {
    (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number,
}

/**
 * <h3>Интерфейс для преимуществ по фракциям.</h3>
 */
export interface IDistinction {
    readonly description: string,
    readonly awarding: IAwarding,
}

/**
 * <h3>Интерфейс для преимуществ.</h3>
 */
export interface IDistinctions {
    // TODO Rework [name: string] to typeof/keyof SUITS
    [index: string]: DistinctionTypes,
}
