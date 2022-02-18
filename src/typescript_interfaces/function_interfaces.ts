import { Ctx } from "boardgame.io";
import { ArgsTypes } from "../typescript_types/types";
import { IMyGameState } from "./game_data_interfaces";

export interface IActionFunction {
    (G: IMyGameState, ctx: Ctx, ...params: ArgsTypes): void,
}

export interface IMoveFunction {
    (...args: ArgsTypes): void,
}
