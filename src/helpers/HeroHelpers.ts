import { Ctx } from "boardgame.io";
import { PickHeroAction } from "../actions/Actions";
import { DrawProfitHeroAction, PlaceHeroAction } from "../actions/HeroActions";
import { heroesConfig } from "../data/HeroData";
import { AddDataToLog } from "../Logging";
import { IStack, IVariants } from "../typescript/action_interfaces";
import { PlayerCardsType } from "../typescript/card_types";
import { ActionTypes, ConfigNames, DrawNames, HeroNames, LogTypes, Stages, SuitNames } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { TotalRank } from "./ScoreHelpers";
import { AddActionsToStack, AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "./StackHelpers";

/**
 * <h3>Добавляет экшены при старте хода в фазе 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте хода в фазе 'endTier'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddEndTierActionsToStack = (G: IMyGameState, ctx: Ctx): void => {
    const variants: IVariants = {
        blacksmith: {
            suit: SuitNames.BLACKSMITH,
            rank: 1,
            points: null,
        },
        hunter: {
            suit: SuitNames.HUNTER,
            rank: 1,
            points: null,
        },
        explorer: {
            suit: SuitNames.EXPLORER,
            rank: 1,
            points: 11,
        },
        warrior: {
            suit: SuitNames.WARRIOR,
            rank: 1,
            points: 7,
        },
        miner: {
            suit: SuitNames.MINER,
            rank: 1,
            points: 1,
        },
    };
    const stack: IStack[] = [
        {
            action: {
                name: DrawProfitHeroAction.name,
                type: ActionTypes.Hero,
            },
            variants,
            config: {
                stageName: Stages.PlaceCards,
                drawName: DrawNames.Ylud,
                name: ConfigNames.PlaceCards,
            },
        },
        {
            action: {
                name: PlaceHeroAction.name,
                type: ActionTypes.Hero,
            },
            variants,
            config: {
                name: ConfigNames.Ylud,
            },
        },
    ];
    AddActionsToStack(G, ctx, stack);
    G.drawProfit = ConfigNames.PlaceCards;
};

/**
 * <h3>Проверяет нужно ли перемещать героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда пикается карта на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns Нужно ли перемещать героя Труд.
 */
export const CheckAndMoveThrud = (G: IMyGameState, ctx: Ctx, card: PlayerCardsType): boolean => {
    if (card.suit !== null) {
        const index: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[card.suit]
            .findIndex((card: PlayerCardsType): boolean => card.name === HeroNames.Thrud);
        if (index !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].cards[card.suit].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};

/**
 * <h3>Действия, связанные с проверкой перемещения героя Труд или выбора героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении карт, героев или карт кэмпа, помещающихся на карту героя Труд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта, помещающаяся на карту героя Труд.
 */

export const CheckAndMoveThrudOrPickHeroAction = (G: IMyGameState, ctx: Ctx, card: PlayerCardsType): void => {
    const isMoveThrud: boolean = CheckAndMoveThrud(G, ctx, card);
    if (isMoveThrud) {
        StartThrudMoving(G, ctx, card);
    } else {
        CheckPickHero(G, ctx);
    }
};

/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickDiscardCard = (G: IMyGameState, ctx: Ctx): void => {
    if (G.discardCardsDeck.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Проверяет возможность взятия нового героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при расположении на планшете игрока карта из таверны.</li>
 * <li>Происходит при завершении действия взятых героев.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Илуд.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Труд.</li>
 * <li>Происходит при перемещении на планшете игрока карта героя Труд.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickHero = (G: IMyGameState, ctx: Ctx): void => {
    if (!G.publicPlayers[Number(ctx.currentPlayer)].buffs.noHero) {
        const playerCards: PlayerCardsType[][] =
            Object.values(G.publicPlayers[Number(ctx.currentPlayer)].cards),
            isCanPickHero: boolean =
                Math.min(...playerCards.map((item: PlayerCardsType[]): number =>
                    item.reduce(TotalRank, 0))) >
                G.publicPlayers[Number(ctx.currentPlayer)].heroes.length;
        if (isCanPickHero) {
            const stack: IStack[] = [
                {
                    action: {
                        name: PickHeroAction.name,
                        type: ActionTypes.Action,
                    },
                    config: {
                        stageName: Stages.PickHero,
                    },
                },
            ];
            AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен выбрать нового героя.`);
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
    }
};

/**
 * <h3>Вычисляет индекс указанного героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретного героя.</li>
 * </ol>
 *
 * @param heroName Название героя.
 * @returns Индекс героя.
 */
export const GetHeroIndexByName = (heroName: string): number =>
    Object.keys(heroesConfig).indexOf(heroName);

/**
 * <h3>Перемещение героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда пикается карта на планшет игрока и требуется переместить героя Труд.</li>
 * </ol>
 я
 * @param G
 * @param ctx
 * @param card Карта.
 */
export const StartThrudMoving = (G: IMyGameState, ctx: Ctx, card: PlayerCardsType): void => {
    if (card.suit !== null) {
        const variants: IVariants = {
            blacksmith: {
                suit: SuitNames.BLACKSMITH,
                rank: 1,
                points: null,
            },
            hunter: {
                suit: SuitNames.HUNTER,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.EXPLORER,
                rank: 1,
                points: null,
            },
            warrior: {
                suit: SuitNames.WARRIOR,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.MINER,
                rank: 1,
                points: null,
            },
        },
            stack: IStack[] = [
                {
                    action: {
                        name: DrawProfitHeroAction.name,
                        type: ActionTypes.Hero,
                    },
                    variants,
                    config: {
                        drawName: DrawNames.Thrud,
                        name: ConfigNames.PlaceCards,
                        stageName: Stages.PlaceCards,
                        suit: card.suit,
                    },
                },
                {
                    action: {
                        name: PlaceHeroAction.name,
                        type: ActionTypes.Hero,
                    },
                    variants,
                    config: {
                        name: ConfigNames.Thrud,
                    },
                },
            ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
};
