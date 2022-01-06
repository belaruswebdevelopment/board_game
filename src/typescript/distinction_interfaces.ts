import { Ctx } from "boardgame.io";
import { MyGameState } from "./game_data_interfaces";
import { IPublicPlayer } from "./player_interfaces";
import { DistinctionTypes } from "./types";

/**
 * <h3>Интерфейс для преимуществ.</h3>
 */
export interface IDistinctions {
    [index: string]: DistinctionTypes,
}

/**
 * <h3>Интерфейс для преимуществ по фракциям.</h3>
 */
export interface IDistinction {
    description: string,
    awarding: IAwarding,
}

/**
 * <h3>Интерфейс для преимуществ по фракциям.</h3>
 */
export interface IAwarding {
    (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number,
}
