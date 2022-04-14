import type { Ctx } from "boardgame.io";
import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { CardNames, LogTypes, SuitNames } from "../typescript/enums";
import type { ICard, ICoin, IMyGameState, IPlayer, IPublicPlayer } from "../typescript/interfaces";
import { DiscardTradingCoin, GetMaxCoinValue } from "./CoinHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { IsMultiplayer } from "./MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

export const BlacksmithDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        const card: ICard | undefined = G.additionalCardsDeck.find((card: ICard): boolean =>
            card.name === CardNames.ChiefBlacksmith);
        if (card === undefined) {
            throw new Error(`В игре отсутствует обязательная карта '${CardNames.ChiefBlacksmith}'.`);
        }
        player.pickedCard = card;
        player.cards[SuitNames.BLACKSMITH].push(card);
        G.distinctions[SuitNames.BLACKSMITH] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' получил по знаку отличия кузнецов карту '${CardNames.ChiefBlacksmith}'.`);
        CheckAndMoveThrudAction(G, ctx, card);
    }
    return 0;
};

export const ExplorerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDistinctionCard()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
    }
    return 0;
};

export const HunterDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    if (G.tierToEnd !== 0) {
        const multiplayer: boolean = IsMultiplayer(G),
            player: IPublicPlayer | undefined = G.publicPlayers[playerId],
            privatePlayer: IPlayer | undefined = G.players[playerId];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
        }
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${playerId}'.`);
        }
        const tradingCoinIndex: number = DiscardTradingCoin(G, playerId),
            coin: ICoin = CreateCoin({
                isOpened: true,
                isTriggerTrading: true,
                value: 3,
            });
        if (multiplayer) {
            privatePlayer.boardCoins[tradingCoinIndex] = coin;
        }
        player.boardCoins[tradingCoinIndex] = coin;
        G.distinctions[SuitNames.HUNTER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' обменял по знаку отличия охотников свою монету с номиналом '0' на особую монету с номиналом '3'.`);
    }
    return 0;
};

export const MinerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        const currentPriorityValue: number = player.priority.value;
        player.priority = CreatePriority({
            value: 6,
            isExchangeable: false,
        });
        G.distinctions[SuitNames.MINER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' обменял по знаку отличия горняков свой кристалл '${currentPriorityValue}' на особый кристалл '6'.`);
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
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinWarriorDistinction()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' получил по знаку отличия воинов возможность улучшить одну из своих монет на '+5':`);
    } else {
        return GetMaxCoinValue(G, playerId);
    }
    return 0;
};
