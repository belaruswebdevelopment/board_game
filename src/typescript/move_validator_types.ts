import { ICurrentMoveArgumentsStage, ICurrentMoveCoinsArguments, ICurrentMoveSuitCardCurrentId, ICurrentMoveSuitCardIdArguments, ICurrentMoveSuitCardPlayerCurrentId, ICurrentMoveSuitCardPlayerIdArguments } from "./move_interfaces";

export type MoveValidatorGetRangeTypes = ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`]
    | ICurrentMoveArgumentsStage<ICurrentMoveSuitCardPlayerIdArguments>[`args`]
    | ICurrentMoveArgumentsStage<number[][]>[`args`]
    | ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`]
    | ICurrentMoveArgumentsStage<null>[`args`]
    | ICurrentMoveArgumentsStage<number[]>[`args`]
    | ICurrentMoveArgumentsStage<string[]>[`args`];

export type ValidMoveIdParamTypes = number | string | null | ICurrentMoveSuitCardCurrentId
    | ICurrentMoveSuitCardPlayerCurrentId | ICurrentMoveCoinsArguments | number[];
