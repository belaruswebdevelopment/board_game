import { Ctx } from "boardgame.io";
import { IMyGameState } from "./game_data_interfaces";

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
    getRange: (params: IMoveValidatorParams) => [number, number],
    getValue?: (params: IMoveValidatorParams) => number[],
    validate: (params: IMoveValidatorParams) => boolean,
}

/**
 * <h3>Интерфейс для параметров валидатора мувов.</h3>
 */
export interface IMoveValidatorParams {
    G: IMyGameState,
    ctx?: Ctx,
    id?: number,
    type?: string,
}

/**
 * <h3>Интерфейс для объекта валидаторов мувов.</h3>
 */
export interface IMoveValidators {
    [name: string]: IMoveValidator,
}
