import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { CoinTypeNames, ErrorNames, GameModeNames, LogTypeNames, SpecialCardNames, SuitNames } from "../typescript/enums";
import type { CanBeUndefType, ICoin, IDistinctionAwardingFunction, IPlayer, IPublicPlayer, ISpecialCard, MyFnContext } from "../typescript/interfaces";
import { AddCardToPlayer } from "./CardHelpers";
import { DiscardTradingCoin, GetMaxCoinValue } from "./CoinHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { AddActionsToStack } from "./StackHelpers";

/**
 * <h3>Получение преимущества по фракции кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции кузнецов.</li>
 * <li>В конце игры, когда получается преимущество по фракции кузнецов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const BlacksmithDistinctionAwarding: IDistinctionAwardingFunction = ({ G, ctx, playerID, ...rest }:
    MyFnContext): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (G.tierToEnd !== 0) {
        const card: CanBeUndefType<ISpecialCard> = G.specialCardsDeck.find((card: ISpecialCard): boolean =>
            card.name === SpecialCardNames.ChiefBlacksmith);
        if (card === undefined) {
            throw new Error(`В игре отсутствует обязательная карта '${SpecialCardNames.ChiefBlacksmith}'.`);
        }
        AddCardToPlayer({ G, ctx, playerID, ...rest }, card);
        G.distinctions[SuitNames.blacksmith] = undefined;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия кузнецов карту '${card.type}' '${SpecialCardNames.ChiefBlacksmith}' во фракцию '${SuitNames.blacksmith}'.`);
        CheckAndMoveThrudAction({ G, ctx, playerID, ...rest }, card);
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции разведчиков.</li>
 * <li>В конце игры, когда получается преимущество по фракции разведчиков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const ExplorerDistinctionAwarding: IDistinctionAwardingFunction = ({ G, ctx, playerID, ...rest }: MyFnContext):
    number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (G.tierToEnd !== 0) {
        if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
            AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.pickDistinctionCardSoloBot()]);
        } else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.pickDistinctionCardSoloBotAndvari()]);
        } else {
            AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.pickDistinctionCard()]);
        }
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции охотников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции охотников.</li>
 * <li>В конце игры, когда получается преимущество по фракции охотников.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const HunterDistinctionAwarding: IDistinctionAwardingFunction = ({ G, ctx, playerID, ...rest }: MyFnContext):
    number => {
    if (G.tierToEnd !== 0) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)],
            privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(playerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                playerID);
        }
        if (privatePlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
                playerID);
        }
        const [type, tradingCoinIndex]: [CoinTypeNames, number] =
            DiscardTradingCoin({ G, ctx, playerID, ...rest }),
            coin: ICoin = CreateCoin({
                isOpened: true,
                isTriggerTrading: true,
                value: 3,
            });
        let _exhaustiveCheck: never;
        switch (type) {
            case CoinTypeNames.Hand:
                if (G.mode === GameModeNames.Multiplayer) {
                    privatePlayer.handCoins[tradingCoinIndex] = coin;
                }
                player.handCoins[tradingCoinIndex] = coin;
                break;
            case CoinTypeNames.Board:
                if (G.mode === GameModeNames.Multiplayer) {
                    privatePlayer.boardCoins[tradingCoinIndex] = coin;
                }
                player.boardCoins[tradingCoinIndex] = coin;
                break;
            default:
                _exhaustiveCheck = type;
                throw new Error(`Не существует такого типа монеты.`);
                return _exhaustiveCheck;
        }
        G.distinctions[SuitNames.hunter] = undefined;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' обменял по знаку отличия охотников свою монету с номиналом '0' на особую монету с номиналом '3'.`);
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции горняков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции горняков.</li>
 * <li>В конце игры, когда получается преимущество по фракции горняков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const MinerDistinctionAwarding: IDistinctionAwardingFunction = ({ G, ctx, playerID, ...rest }: MyFnContext):
    number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (G.tierToEnd !== 0) {
        const currentPriorityValue: number = player.priority.value;
        player.priority = CreatePriority({
            value: 6,
            isExchangeable: false,
        });
        G.distinctions[SuitNames.miner] = undefined;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' обменял по знаку отличия горняков свой кристалл '${currentPriorityValue}' на особый кристалл '6'.`);
    } else {
        if (player.priority.value === 6) {
            return 3;
        }
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции воинов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции воинов.</li>
 * <li>В конце игры, когда получается преимущество по фракции воинов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const WarriorDistinctionAwarding: IDistinctionAwardingFunction = ({ G, ctx, playerID, ...rest }: MyFnContext):
    number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (G.tierToEnd !== 0) {
        if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
            AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.upgradeCoinWarriorDistinctionSoloBot()]);
        } else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            AddActionsToStack({ G, ctx, playerID, ...rest },
                [StackData.upgradeCoinWarriorDistinctionSoloBotAndvari()]);
        } else {
            AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.upgradeCoinWarriorDistinction()]);
        }
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия воинов возможность улучшить одну из своих монет на '+5':`);
    } else {
        return GetMaxCoinValue({ G, ctx, playerID, ...rest });
    }
    return 0;
};

/**
 * <h3>Завершение получения преимущества по фракции воинов или разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции воинов или разведчиков.</li>
 * <li>В конце игры, когда получается преимущество по фракции воинов или разведчиков.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const EndWarriorOrExplorerDistinctionIfCoinUpgraded = ({ G }: MyFnContext): void => {
    // todo Move to distinction phase hook?
    if (Object.values(G.distinctions).length) {
        // TODO Rework in suit name distinctions and delete not by if but by current distinction suit
        const isDistinctionWarrior: boolean = G.distinctions[SuitNames.warrior] !== undefined;
        if (isDistinctionWarrior) {
            G.distinctions[SuitNames.warrior] = undefined;
        } else if (!isDistinctionWarrior && G.distinctions[SuitNames.explorer] !== undefined) {
            G.distinctions[SuitNames.explorer] = undefined;
        }
    }
};
