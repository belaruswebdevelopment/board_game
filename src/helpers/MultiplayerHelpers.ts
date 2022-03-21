import type { IMyGameState } from "../typescript/interfaces";

export const IsMultiplayer = (G: IMyGameState): boolean => G.multiplayer;
