import { ICurrentMoveArgumentsStage, ICurrentMoveCoinsArguments, ICurrentMoveSuitCardCurrentId, ICurrentMoveSuitCardIdArguments } from "./move_interfaces";
import { IMoveBy, IMoveByBrisingamensEndGameOptions, IMoveByEndTierOptions, IMoveByEnlistmentMercenariesOptions, IMoveByGetDistinctionsOptions, IMoveByGetMjollnirProfitOptions, IMoveByPickCardsOptions, IMoveByPlaceCoinsOptions, IMoveByPlaceCoinsUlineOptions } from "./move_validator_interfaces";

export type MoveValidatorGetRangeTypes = ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`]
    | ICurrentMoveArgumentsStage<number[][]>[`args`]
    | ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`]
    | ICurrentMoveArgumentsStage<null>[`args`]
    | ICurrentMoveArgumentsStage<number[]>[`args`]
    | ICurrentMoveArgumentsStage<string[]>[`args`];

export type MoveValidatorPhaseTypes = keyof IMoveBy;

export type MoveValidatorStageTypes = keyof IMoveByPlaceCoinsOptions | keyof IMoveByPlaceCoinsUlineOptions
    | keyof IMoveByPickCardsOptions | keyof IMoveByEnlistmentMercenariesOptions | keyof IMoveByEndTierOptions
    | keyof IMoveByGetDistinctionsOptions | keyof IMoveByBrisingamensEndGameOptions
    | keyof IMoveByGetMjollnirProfitOptions;

export type ValidMoveIdParamTypes = number | string | null | ICurrentMoveSuitCardCurrentId | ICurrentMoveCoinsArguments
    | number[];
