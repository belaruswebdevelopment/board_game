import { ICurrentMoveArgumentsStage, ICurrentMoveCoinsArguments, ICurrentMoveSuitCardCurrentId, ICurrentMoveSuitCardIdArguments } from "./move_interfaces";

// TODO Check my types
/**
 * <h3>Типы данных для рест аргументов функций.</h3>
 */
export type ArgsTypes = (string | number | boolean | null | object)[];

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionTypes = null | undefined | string;

export type MoveArgsTypes = number[][] | [string] | [number] | [string, number] | [number, string, boolean];

export type MoveValidatorGetRangeTypes = ICurrentMoveSuitCardIdArguments | ICurrentMoveArgumentsStage["arrayNumbers"]
    | ICurrentMoveArgumentsStage["coins"] | ICurrentMoveArgumentsStage["empty"] | ICurrentMoveArgumentsStage["numbers"]
    | ICurrentMoveArgumentsStage["strings"];

export type ValidMoveIdParam = number | string | null | ICurrentMoveSuitCardCurrentId | ICurrentMoveCoinsArguments
    | number[];
