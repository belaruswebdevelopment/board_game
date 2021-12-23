import { ConfigNames, DrawNames } from "../actions/Actions";
import { DrawProfitHeroAction, PlaceHeroAction } from "../actions/HeroActions";
import { heroesConfig, HeroNames } from "../data/HeroData";
import { SuitNames } from "../data/SuitData";
import { Phases, Stages } from "../Game";
import { CheckPickHero } from "../Hero";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "./StackHelpers";
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
export const CheckAndMoveThrud = (G, ctx, card) => {
    if (card.suit !== null) {
        const index = G.publicPlayers[Number(ctx.currentPlayer)].cards[card.suit]
            .findIndex((card) => card.name === HeroNames.Thrud);
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
export const CheckAndMoveThrudOrPickHeroAction = (G, ctx, card) => {
    const isMoveThrud = CheckAndMoveThrud(G, ctx, card);
    if (isMoveThrud) {
        StartThrudMoving(G, ctx, card);
    }
    else {
        CheckPickHero(G, ctx);
    }
};
/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Проверяет нужно ли начать действия по наличию героя Улина.
 */
export const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    var _a;
    // todo Rework it all!
    const ulinePlayerIndex = G.publicPlayers.findIndex((player) => player.buffs.everyTurn === HeroNames.Uline);
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            if (ctx.phase === Phases.PickCards) {
                const coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern];
                if (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) {
                    if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                        .filter((coin, index) => index >= G.tavernsNum && coin === null)) {
                        if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[ctx.currentPlayer]) !== Stages.PlaceTradingCoinsUline) {
                            G.actionsNum = G.suitsNum - G.tavernsNum;
                            ctx.events.setStage(Stages.PlaceTradingCoinsUline);
                            return Stages.PlaceTradingCoinsUline;
                        }
                        else if (!G.actionsNum) {
                            ctx.events.endStage();
                            return `endPlaceTradingCoinsUline`;
                        }
                        else if (G.actionsNum) {
                            return `nextPlaceTradingCoinsUline`;
                        }
                    }
                }
            }
        }
        else {
            return Phases.PlaceCoinsUline;
        }
    }
    else if (ctx.phase !== Phases.PickCards) {
        ctx.events.setPhase(Phases.PickCards);
    }
    return false;
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
export const CheckPickDiscardCard = (G, ctx) => {
    if (G.discardCardsDeck.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    EndActionFromStackAndAddNew(G, ctx);
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
export const GetHeroIndexByName = (heroName) => Object.keys(heroesConfig).indexOf(heroName);
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
export const StartThrudMoving = (G, ctx, card) => {
    if (card.suit !== null) {
        const variants = {
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
        }, stack = [
            {
                action: DrawProfitHeroAction.name,
                variants,
                config: {
                    drawName: DrawNames.Thrud,
                    name: ConfigNames.PlaceCards,
                    stageName: Stages.PlaceCards,
                    suit: card.suit,
                },
            },
            {
                action: PlaceHeroAction.name,
                variants,
                config: {
                    name: ConfigNames.Thrud,
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
};
