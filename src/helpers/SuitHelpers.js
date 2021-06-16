import {suitsConfig} from "../data/SuitData";

export const GetSuitIndexByName = (suitName) => Object.keys(suitsConfig).indexOf(suitName);
