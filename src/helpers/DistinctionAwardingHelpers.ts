import { Ctx } from "boardgame.io";
import { CreateCard } from "../Card";
import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { ICard } from "../typescript/card_interfaces";
import { CoinType } from "../typescript/coin_types";
import { IAwarding } from "../typescript/distinction_interfaces";
import { LogTypes, SuitNames } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
import { GetMaxCoinValue } from "./CoinHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

// TODO Add dock blocks
export const BlacksmithDistinctionAwarding: IAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    if (G.tierToEnd !== 0) {
        player.cards[SuitNames.BLACKSMITH].push(CreateCard({
            suit: SuitNames.BLACKSMITH,
            rank: 2,
            points: null,
        } as ICard));
        G.distinctions[SuitNames.BLACKSMITH] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия кузнецов карту Главного кузнеца.`);
    }
    return 0;
};

export const ExplorerDistinctionAwarding: IAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDistinctionCard()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
    }
    return 0;
};

export const HunterDistinctionAwarding: IAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    if (G.tierToEnd !== 0) {
        const tradingCoinIndex: number =
            player.boardCoins.findIndex((coin: CoinType): boolean => coin?.value === 0);
        player.boardCoins[tradingCoinIndex] = CreateCoin({
            value: 3,
            isTriggerTrading: true,
        });
        G.distinctions[SuitNames.HUNTER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия охотников свою монету с номиналом 0 на особую монету с номиналом 3.`);
    }
    return 0;
};

export const MinerDistinctionAwarding: IAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    if (G.tierToEnd !== 0) {
        player.priority = CreatePriority({
            value: 6,
            isExchangeable: false,
        });
        G.distinctions[SuitNames.MINER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия горняков свой кристалл на особый кристалл 6.`);
    } else {
        if (player.priority.value === 6) {
            return 3;
        }
    }
    return 0;
};

export const WarriorDistinctionAwarding: IAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinWarriorDistinction()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия воинов возможность улучшить одну из своих монет на +5:`);
    } else {
        return GetMaxCoinValue(player);
    }
    return 0;
};