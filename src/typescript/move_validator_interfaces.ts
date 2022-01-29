import { Ctx } from "boardgame.io";
import { IMyGameState } from "./game_data_interfaces";
import { MoveValidatorGetRangeTypes, ValidMoveIdParam } from "./types";

/**
 * <h3>Интерфейс для проверки параметров валидатора мувов.</h3>
 */
export interface ICheckMoveParam {
    obj?: object | null,
    objId: number,
    range?: number[],
    values?: number[],
}

/**
 * <h3>Интерфейс для возможных валидаторов у мувов.</h3>
 */
export interface IMoveBy {
    [name: string]: IMoveByOption,
}

/**
 * <h3>Интерфейс для возможных валидаторов у мува.</h3>
 */
interface IMoveByOption {
    [name: string]: string,
}

/**
 * <h3>Интерфейс для валидатора мувов.</h3>
 */
export interface IMoveValidator {
    getRange: (G: IMyGameState, ctx: Ctx) => MoveValidatorGetRangeTypes,
    getValue: (G: IMyGameState, ctx: Ctx) => ValidMoveIdParam,
    validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParam, type?: string) => boolean,
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    [name: string]: IMoveValidator,
}
