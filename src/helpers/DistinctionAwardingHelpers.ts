import type { Ctx } from "boardgame.io";
import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { CardNames, LogTypes, SuitNames } from "../typescript/enums";
import type { DeckCardTypes, ICard, IMyGameState, IPublicPlayer, PublicPlayerBoardCoinTypes } from "../typescript/interfaces";
import { GetMaxCoinValue } from "./CoinHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

// TODO Add dock blocks
export const BlacksmithDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
    if (G.tierToEnd !== 0) {
        const card: ICard | undefined = G.additionalCardsDeck.find((card: ICard): boolean =>
            card.name === CardNames.ChiefBlacksmith);
        if (card === undefined) {
            throw new Error(`В игре отсутствует обязательная карта ${CardNames.ChiefBlacksmith}.`);
        }
        player.cards[SuitNames.BLACKSMITH].push(card);
        G.distinctions[SuitNames.BLACKSMITH] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия кузнецов карту Главного кузнеца.`);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
    }
    return 0;
};

export const ExplorerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
    if (G.tierToEnd !== 0) {
        for (let j = 0; j < 3; j++) {
            const deck1: DeckCardTypes[] | undefined = G.secret.decks[1];
            if (deck1 === undefined) {
                throw new Error(`В массиве дек карт отсутствует дека 1 эпохи.`);
            }
            const card: DeckCardTypes | undefined = deck1[j];
            if (card === undefined) {
                throw new Error(`В массиве карт 2 эпохи отсутствует карта ${j}.`);
            }
            G.explorerDistinctionCards.push(card);
        }
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDistinctionCard()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
    }
    return 0;
};

export const HunterDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует ${playerId} игрок.`);
    }
    if (G.tierToEnd !== 0) {
        const tradingCoinIndex: number =
            player.boardCoins.findIndex((coin: PublicPlayerBoardCoinTypes): boolean => coin?.value === 0);
        if (tradingCoinIndex === -1) {
            throw new Error(`У игрока не может отсутствовать обменная монета в первую эпоху.`);
        }
        player.boardCoins[tradingCoinIndex] = CreateCoin({
            value: 3,
            isTriggerTrading: true,
        });
        G.distinctions[SuitNames.HUNTER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия охотников свою монету с номиналом 0 на особую монету с номиналом 3.`);
    }
    return 0;
};

export const MinerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
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

export const WarriorDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${playerId}.`);
    }
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinWarriorDistinction()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия воинов возможность улучшить одну из своих монет на +5:`);
    } else {
        return GetMaxCoinValue(G, playerId);
    }
    return 0;
};
