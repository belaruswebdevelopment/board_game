import { PickHeroAction } from "../actions/Actions";
import { DrawProfitHeroAction, PlaceHeroAction } from "../actions/HeroActions";
import { heroesConfig } from "../data/HeroData";
import { suitsConfig } from "../data/SuitData";
import { AddDataToLog } from "../Logging";
import { ActionTypes, ConfigNames, DrawNames, HeroNames, LogTypes, Phases, Stages, SuitNames } from "../typescript/enums";
import { CheckEndGameLastActions } from "./CampHelpers";
import { TotalRank } from "./ScoreHelpers";
import { AddActionsToStack, AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "./StackHelpers";
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
    var _a, _b, _c, _d;
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
                            (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.setStage(Stages.PlaceTradingCoinsUline);
                            return Stages.PlaceTradingCoinsUline;
                        }
                        else if (!G.actionsNum) {
                            (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.endStage();
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
        (_d = ctx.events) === null || _d === void 0 ? void 0 : _d.setPhase(Phases.PickCards);
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
export const CheckPickHero = (G, ctx) => {
    if (!G.publicPlayers[Number(ctx.currentPlayer)].buffs.noHero) {
        const playerCards = Object.values(G.publicPlayers[Number(ctx.currentPlayer)].cards), isCanPickHero = Math.min(...playerCards.map((item) => item.reduce(TotalRank, 0))) >
            G.publicPlayers[Number(ctx.currentPlayer)].heroes.length;
        if (isCanPickHero) {
            const stack = [
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
export const GetHeroIndexByName = (heroName) => Object.keys(heroesConfig).indexOf(heroName);
/**
* <h3>Начало экшенов в фазе EndTier.</h3>
* <p>Применения:</p>
* <ol>
* <li>При начале фазы EndTier.</li>
* </ol>
*
* @param G
* @param ctx
*/
export const StartEndTierActions = (G, ctx) => {
    var _a;
    G.publicPlayersOrder = [];
    let ylud = false, index = -1;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        index = G.publicPlayers[i].heroes.findIndex((hero) => hero.name === HeroNames.Ylud);
        if (index !== -1) {
            ylud = true;
            G.publicPlayersOrder.push(String(i));
        }
    }
    if (!ylud) {
        for (let i = 0; i < G.publicPlayers.length; i++) {
            for (const suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    index = G.publicPlayers[i].cards[suit]
                        .findIndex((card) => card.name === HeroNames.Ylud);
                    if (index !== -1) {
                        G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].splice(index, 1);
                        G.publicPlayersOrder.push(String(i));
                        ylud = true;
                    }
                }
            }
        }
    }
    if (ylud) {
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setPhase(Phases.EndTier);
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
        const stack = [
            {
                action: {
                    name: DrawProfitHeroAction.name,
                    type: ActionTypes.Hero,
                },
                playerId: Number(G.publicPlayersOrder[0]),
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
                playerId: Number(G.publicPlayersOrder[0]),
                variants,
                config: {
                    name: ConfigNames.Ylud,
                },
            },
        ];
        AddActionsToStack(G, ctx, stack);
        G.drawProfit = ConfigNames.PlaceCards;
    }
    else {
        CheckEndGameLastActions(G, ctx);
    }
};
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
