import { Ctx } from "boardgame.io";
import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { CardNames, LogTypes, SuitNames } from "../typescript/enums";
import { CoinType, ICard, IMyGameState, IPublicPlayer } from "../typescript/interfaces";
import { GetMaxCoinValue } from "./CoinHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

// TODO Add dock blocks
export const BlacksmithDistinctionAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number | never => {
    if (G.tierToEnd !== 0) {
        const card: ICard | undefined = G.additionalCardsDeck.find((card: ICard): boolean =>
            card.name === CardNames.ChiefBlacksmith);
        if (card !== undefined) {
            player.cards[SuitNames.BLACKSMITH].push(card);
            G.distinctions[SuitNames.BLACKSMITH] = undefined;
            AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия кузнецов карту Главного кузнеца.`);
        } else {
            throw new Error(`В игре отсутствует обязательная карта ${CardNames.ChiefBlacksmith}.`);
        }
    }
    return 0;
};

export const ExplorerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDistinctionCard()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
    }
    return 0;
};

export const HunterDistinctionAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number | never => {
    if (G.tierToEnd !== 0) {
        const tradingCoinIndex: number =
            player.boardCoins.findIndex((coin: CoinType): boolean => coin?.value === 0);
        if (tradingCoinIndex !== -1) {
            player.boardCoins[tradingCoinIndex] = CreateCoin({
                value: 3,
                isTriggerTrading: true,
            });
            G.distinctions[SuitNames.HUNTER] = undefined;
            AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия охотников свою монету с номиналом 0 на особую монету с номиналом 3.`);
        } else {
            throw new Error(`У игрока не может отсутствовать обменная монета в первую эпоху.`);
        }
    }
    return 0;
};

export const MinerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
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

export const WarriorDistinctionAwarding = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinWarriorDistinction()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия воинов возможность улучшить одну из своих монет на +5:`);
    } else {
        return GetMaxCoinValue(player);
    }
    return 0;
};
