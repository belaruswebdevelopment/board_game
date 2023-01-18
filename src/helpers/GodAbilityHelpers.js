import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { ErrorNames, GodBuffNames, GodNames } from "../typescript/enums";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { IsLastRound } from "./RoundHelpers";
import { AddActionsToStack } from "./StackHelpers";
export const CheckIsStartUseGodAbility = ({ G, ctx, myPlayerID, ...rest }, godName) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let isStart = false, _exhaustiveCheck;
    switch (godName) {
        case GodNames.Freyja:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GodBuffNames.PlayerHasActiveGodFreyja)) {
                isStart = true;
            }
            break;
        case GodNames.Frigg:
            if (!IsLastRound({ G, ctx, ...rest }) && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GodBuffNames.PlayerHasActiveGodFrigg)) {
                isStart = true;
            }
            break;
        case GodNames.Loki:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GodBuffNames.PlayerHasActiveGodLoki)) {
                isStart = true;
            }
            break;
        case GodNames.Odin:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GodBuffNames.PlayerHasActiveGodOdin)) {
                isStart = true;
            }
            break;
        case GodNames.Thor:
            if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, GodBuffNames.PlayerHasActiveGodThor)) {
                isStart = true;
            }
            break;
        default:
            _exhaustiveCheck = godName;
            throw new Error(`Нет такой карты '${godName}' среди карт богов.`);
            return _exhaustiveCheck;
    }
    if (isStart) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.activateGodAbilityOrNot(godName)]);
    }
    return isStart;
};
//# sourceMappingURL=GodAbilityHelpers.js.map