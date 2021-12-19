import { suitsConfig } from "../data/SuitData";
import { CreateCard, ICard, ICreateCard } from "../Card";
import {
    AddCardToPlayer,
    AddHeroCardToPlayerCards,
    AddHeroCardToPlayerHeroCards,
    IConfig
} from "../Player";
import { CheckPickHero, IHero } from "../Hero";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { ICoin, ReturnCoinToPlayerHands } from "../Coin";
import { CheckAndMoveThrudOrPickHeroAction, GetHeroIndexByName } from "../helpers/HeroHelpers";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddDataToLog, LogTypes } from "../Logging";
import { TotalRank } from "../helpers/ScoreHelpers";
import { MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { IConditions, IVariants } from "../data/HeroData";
import { IsStartActionStage } from "../helpers/ActionHelpers";

/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровом поле игрока.</li>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 */
export const PlaceHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    const suit: string = Object.keys(suitsConfig)[suitId],
        playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined && config.name !== undefined) {
        const heroCard: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: `герой`,
            name: config.name,
            game: `base`,
        } as ICreateCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${config.name} во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, heroCard);
        CheckPickHero(G, ctx);
        EndActionFromStackAndAddNew(G, ctx);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants' или не передан обязательный параметр 'stack[0].config.name'.`);
    }
};

/**
 * <h3>Действия, связанные с добавлением героев в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddHeroToCardsAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.drawName) {
        const heroIndex: number = GetHeroIndexByName(config.drawName),
            hero: IHero = G.heroes[heroIndex];
        let suitId: number | null = null;
        AddHeroCardToPlayerHeroCards(G, ctx, hero);
        AddHeroCardToPlayerCards(G, ctx, hero);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
        if (hero.suit !== null) {
            suitId = GetSuitIndexByName(hero.suit);
            if (suitId === -1) {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найдена несуществующая фракция ${hero.suit}.`);
            }
        }
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.drawName'.`);
    }
};

/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const GetClosedCoinIntoPlayerHandAction = (G: MyGameState, ctx: Ctx): void => {
    const coinsCount: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length,
        tradingBoardCoinIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading)),
        tradingHandCoinIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading));
    for (let i: number = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i) || (i >= G.tavernsNum && tradingHandCoinIndex !== -1)
            || (i >= G.tavernsNum && tradingBoardCoinIndex >= G.currentTavern)) {
            ReturnCoinToPlayerHands(G.publicPlayers[Number(ctx.currentPlayer)], i);
        }
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с выбором героев по определённым условиям.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, получаемых по определённым условиям.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns
 */
export const PickHeroWithConditionsAction = (G: MyGameState, ctx: Ctx, config: IConfig): string | void => {
    let isValidMove: boolean = false;
    for (const condition in config.conditions) {
        if (config.conditions.hasOwnProperty(condition)) {
            if (condition === `suitCountMin`) {
                let ranks: number = 0;
                for (const key in (config.conditions as IConditions)[condition]) {
                    if (config.conditions[condition].hasOwnProperty(key)) {
                        if (key === `suit`) {
                            const suitId: number = GetSuitIndexByName(config.conditions[condition][key]);
                            ranks = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
                                .reduce(TotalRank, 0);
                        } else if (key === `value`) {
                            isValidMove = ranks >= config.conditions[condition][key];
                        }
                    }
                }
            }
        }
    }
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const PickHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    const isStartPickHero: boolean = IsStartActionStage(G, ctx, config);
    if (isStartPickHero) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен пикнуть героя.`);
    } else {
        if (config.stageName === undefined) {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.stageName'.`);
        }
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не стартовал стэйдж 'PickHero'.`);
    }
};
