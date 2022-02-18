import { Ctx } from "boardgame.io";
import { IMyGameState } from "./game_data_interfaces";

/**
 * <h3>Интерфейс для следующей фазы.</h3>
 */
export interface INext {
    readonly next: string,
}

/**
 * <h3>Интерфейс для порядка ходов.</h3>
 */
export interface IOrder {
    readonly next: (G: IMyGameState, ctx: Ctx) => number;
    readonly first: () => number;
    readonly playOrder: (G: IMyGameState) => string[];
}

/**
 * <h3>Интерфейс для распределения монет на столе.</h3>
 */
export interface IResolveBoardCoins {
    readonly playersOrder: string[],
    readonly exchangeOrder: number[],
}
