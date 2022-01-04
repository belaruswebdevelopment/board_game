import { DrawProfitAction, UpgradeCoinAction } from "../actions/Actions";
import { CreateCard } from "../Card";
import { CreateCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { SuitNames, LogTypes, ActionTypes, ConfigNames, DrawNames, Stages } from "../typescript/enums";
import { StartActionFromStackOrEndActions } from "./ActionDispatcherHelpers";
import { GetMaxCoinValue } from "./CoinHelpers";
import { AddActionsToStack } from "./StackHelpers";
export const BlacksmithDistinctionAwarding = (G, ctx, player) => {
    var _a;
    if (G.tierToEnd !== 0) {
        player.cards[SuitNames.BLACKSMITH].push(CreateCard({
            suit: SuitNames.BLACKSMITH,
            rank: 2,
            points: 2,
        }));
        G.distinctions[SuitNames.BLACKSMITH] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия кузнецов карту Главного кузнеца.`);
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endTurn();
    }
    return 0;
};
export const ExplorerDistinctionAwarding = (G, ctx, player) => {
    if (G.tierToEnd !== 0) {
        const stack = [
            {
                action: {
                    name: DrawProfitAction.name,
                    type: ActionTypes.Action,
                },
                config: {
                    name: ConfigNames.ExplorerDistinction,
                    stageName: Stages.PickDistinctionCard,
                    drawName: DrawNames.PickCardByExplorerDistinction,
                },
            },
        ];
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
        AddActionsToStack(G, ctx, stack);
        StartActionFromStackOrEndActions(G, ctx, false);
    }
    return 0;
};
export const HunterDistinctionAwarding = (G, ctx, player) => {
    var _a;
    if (G.tierToEnd !== 0) {
        const tradingCoinIndex = player.boardCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === 0);
        player.boardCoins[tradingCoinIndex] = CreateCoin({
            value: 3,
            isTriggerTrading: true,
        });
        G.distinctions[SuitNames.HUNTER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия охотников свою монету с номиналом 0 на особую монету с номиналом 3.`);
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endTurn();
    }
    return 0;
};
export const MinerDistinctionAwarding = (G, ctx, player) => {
    var _a;
    if (G.tierToEnd !== 0) {
        player.priority = CreatePriority({
            value: 6,
            isExchangeable: false,
        });
        G.distinctions[SuitNames.MINER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия горняков свой кристалл на особый кристалл 6.`);
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endTurn();
    }
    else {
        if (player.priority.value === 6) {
            return 3;
        }
    }
    return 0;
};
export const WarriorDistinctionAwarding = (G, ctx, player) => {
    if (G.tierToEnd !== 0) {
        const stack = [
            {
                action: {
                    name: DrawProfitAction.name,
                    type: ActionTypes.Action,
                },
                config: {
                    name: ConfigNames.UpgradeCoin,
                    stageName: Stages.UpgradeCoin,
                    value: 5,
                    drawName: DrawNames.UpgradeCoinWarriorDistinction,
                },
            },
            {
                action: {
                    name: UpgradeCoinAction.name,
                    type: ActionTypes.Action,
                },
                config: {
                    value: 5,
                },
            },
        ];
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия воинов возможность улучшить одну из своих монет на +5:`);
        AddActionsToStack(G, ctx, stack);
        StartActionFromStackOrEndActions(G, ctx, false);
    }
    else {
        return GetMaxCoinValue(player);
    }
    return 0;
};
