import { Ctx } from "boardgame.io";
import { ConfigNames, DiscardCardFromTavernAction, DrawNames, DrawProfitAction } from "../actions/Actions";
import {
    DiscardAnyCardFromPlayerBoardAction,
    DrawProfitCampAction,
    GetMjollnirProfitAction
} from "../actions/CampActions";
import { DrawProfitHeroAction, PlaceHeroAction } from "../actions/HeroActions";
import { DiscardCardIfCampCardPicked, RefillEmptyCampCards } from "../Camp";
import { DiscardCardFromTavern, RusCardTypes } from "../Card";
import { HeroNames, IVariants } from "../data/HeroData";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { Phases, Stages } from "../Game";
import { CampDeckCardTypes, MyGameState, TavernCardTypes } from "../GameSetup";
import { IHero, RemoveThrudFromPlayerBoardAfterGameEnd } from "../Hero";
import { IStack, PlayerCardsType } from "../Player";
import { CheckIfCurrentTavernEmpty, RefillTaverns } from "../Tavern";
import { ActivateTrading } from "./CoinHelpers";
import { CheckAndStartUlineActionsOrContinue } from "./HeroHelpers";
import { AddActionsToStack, StartActionFromStackOrEndActions } from "./StackHelpers";

// todo Add logging
/**
 * <h3>Выполняет основные действия после выбора базовых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выбора карты дворфа из таверны.</li>
 * <li>После выбора карты улучшения монеты из таверны.</li>
 * <li>После выбора карты из кэмпа.</li>
 * <li>После выбора героев.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 */
export const AfterBasicPickCardActions = (G: MyGameState, ctx: Ctx, isTrading: boolean): void => {
    // todo rework it?
    // todo Add LogTypes.ERROR ?
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
    if (ctx.phase === Phases.PickCards) {
        const isUlinePlaceTradingCoin: string | boolean = CheckAndStartUlineActionsOrContinue(G, ctx);
        if (isUlinePlaceTradingCoin !== Stages.PlaceTradingCoinsUline
            && isUlinePlaceTradingCoin !== `nextPlaceTradingCoinsUline`) {
            let isTradingActivated: boolean = false;
            if (!isTrading) {
                isTradingActivated = ActivateTrading(G, ctx);
            }
            if (!isTradingActivated) {
                if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && ctx.playOrder.length < Number(ctx.numPlayers)) {
                    const cardIndex: number =
                        G.taverns[G.currentTavern]
                            .findIndex((card: TavernCardTypes): boolean => card !== null);
                    DiscardCardFromTavern(G, cardIndex);
                }
                if (G.expansions.thingvellir.active
                    && Number(ctx.currentPlayer) === Number(ctx.playOrder[ctx.playOrder.length - 1])) {
                    DiscardCardIfCampCardPicked(G);
                }
                const isLastTavern: boolean = G.tavernsNum - 1 === G.currentTavern,
                    isCurrentTavernEmpty: boolean = CheckIfCurrentTavernEmpty(G, ctx);
                if (isCurrentTavernEmpty && isLastTavern) {
                    AfterLastTavernEmptyActions(G, ctx);
                } else if (isCurrentTavernEmpty) {
                    const isPlaceCoinsUline: string | boolean = CheckAndStartUlineActionsOrContinue(G, ctx);
                    if (isPlaceCoinsUline !== `endPlaceTradingCoinsUline`
                        && isPlaceCoinsUline !== Phases.PlaceCoinsUline) {
                        ctx.events!.setPhase!(Phases.PickCards);
                    } else {
                        ctx.events!.setPhase!(Phases.PlaceCoinsUline);
                    }
                } else {
                    if (ctx.currentPlayer === ctx.playOrder[0] && G.campPicked && ctx.numPlayers === 2
                        && G.taverns[G.currentTavern].every(card => card !== null)) {
                        const stack: IStack[] = [
                            {
                                action: DrawProfitAction.name,
                                config: {
                                    stageName: Stages.DiscardCard,
                                    name: ConfigNames.DiscardCard,
                                    drawName: DrawNames.DiscardTavernCard,
                                },
                            },
                            {
                                action: DiscardCardFromTavernAction.name,
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        StartActionFromStackOrEndActions(G, ctx, false);
                    } else {
                        ctx.events!.endTurn!();
                    }
                }
            }
        }
    } else if (ctx.phase === Phases.EndTier || ctx.phase === Phases.BrisingamensEndGame
        || ctx.phase === Phases.GetMjollnirProfit) {
        CheckEndGameLastActions(G, ctx);
    } else if (ctx.phase === Phases.GetDistinctions) {
        ctx.events!.endTurn!();
    } else if (ctx.phase === Phases.EnlistmentMercenaries) {
        if (((ctx.playOrderPos === 0 && ctx.playOrder.length === 1)
            && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || ((ctx.playOrderPos !== 0 && ctx.playOrder.length > 1)
                && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || (ctx.playOrder[ctx.playOrder.length - 2] !== undefined
                && (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 2])
                && !G.publicPlayers[Number(ctx.playOrder[ctx.playOrder.length - 1])].campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length)) {
            StartEndTierActions(G, ctx);
        } else {
            const stack: IStack[] = [
                {
                    action: DrawProfitCampAction.name,
                    playerId: Number(ctx.playOrder[ctx.playOrder
                        .findIndex((playerIndex: string): boolean => playerIndex === ctx.currentPlayer) + 1]),
                    config: {
                        name: ConfigNames.EnlistmentMercenaries,
                        drawName: DrawNames.EnlistmentMercenaries,
                    },
                },
            ];
            ctx.events!.endTurn!();
            AddActionsToStack(G, ctx, stack);
            G.drawProfit = ConfigNames.EnlistmentMercenaries;
        }
    }
};

/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @todo Refill taverns only on the beginning of the round (Add phase Round?)!
 * @param G
 * @param ctx
 */
const AfterLastTavernEmptyActions = (G: MyGameState, ctx: Ctx): void => {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        G.tierToEnd--;
        if (G.expansions.thingvellir.active) {
            CheckEnlistmentMercenaries(G, ctx);
        } else {
            StartEndTierActions(G, ctx);
        }
    } else {
        if (G.expansions.thingvellir.active) {
            RefillEmptyCampCards(G);
        }
        RefillTaverns(G);
        ctx.events!.setPhase!(Phases.PlaceCoins);
    }
};

/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения экшенов в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndGameLastActions = (G: MyGameState, ctx: Ctx): void => {
    if (G.tierToEnd) {
        ctx.events!.setPhase!(Phases.GetDistinctions);
    } else {
        if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
        let isNewPhase: boolean = false;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
                for (let i: number = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.discardCardEndGame) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        const stack: IStack[] = [
                            {
                                action: DrawProfitCampAction.name,
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: ConfigNames.BrisingamensEndGameAction,
                                    drawName: DrawNames.BrisingamensEndGame,
                                },
                            },
                            {
                                action: DiscardAnyCardFromPlayerBoardAction.name,
                                playerId: G.publicPlayersOrder[0],
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = ConfigNames.BrisingamensEndGameAction;
                        ctx.events!.setPhase!(Phases.BrisingamensEndGame);
                        break;
                    }
                }
            }
            if (ctx.phase !== Phases.GetMjollnirProfit && !isNewPhase) {
                for (let i: number = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.getMjollnirProfit) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        const stack: IStack[] = [
                            {
                                action: DrawProfitCampAction.name,
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: ConfigNames.GetMjollnirProfit,
                                    drawName: DrawNames.Mjollnir,
                                },
                            },
                            {
                                action: GetMjollnirProfitAction.name,
                                playerId: G.publicPlayersOrder[0],
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = ConfigNames.GetMjollnirProfit;
                        ctx.events!.setPhase!(Phases.GetMjollnirProfit);
                        break;
                    }
                }
            }
        }
        if (!isNewPhase) {
            ctx.events!.endPhase!();
            ctx.events!.endGame!();
        }
    }
};

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
const StartEndTierActions = (G: MyGameState, ctx: Ctx): void => {
    G.publicPlayersOrder = [];
    let ylud: boolean = false,
        index: number = -1;
    for (let i: number = 0; i < G.publicPlayers.length; i++) {
        index = G.publicPlayers[i].heroes.findIndex((hero: IHero): boolean => hero.name === HeroNames.Ylud);
        if (index !== -1) {
            ylud = true;
            G.publicPlayersOrder.push(i);
        }
    }
    if (!ylud) {
        for (let i: number = 0; i < G.publicPlayers.length; i++) {
            for (const suit in suitsConfig) {
                if (suitsConfig.hasOwnProperty(suit)) {
                    index = G.publicPlayers[i].cards[suit]
                        .findIndex((card: PlayerCardsType): boolean => card.name === HeroNames.Ylud);
                    if (index !== -1) {
                        G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].splice(index, 1);
                        G.publicPlayersOrder.push(i);
                        ylud = true;
                    }
                }
            }
        }
    }
    if (ylud) {
        ctx.events!.setPhase!(Phases.EndTier);
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
                action: DrawProfitHeroAction.name,
                playerId: G.publicPlayersOrder[0],
                variants,
                config: {
                    stageName: Stages.PlaceCards,
                    drawName: DrawNames.Ylud,
                    name: ConfigNames.PlaceCards,
                },
            },
            {
                action: PlaceHeroAction.name,
                playerId: G.publicPlayersOrder[0],
                variants,
                config: {
                    name: ConfigNames.Ylud,
                },
            },
        ];
        AddActionsToStack(G, ctx, stack);
        G.drawProfit = ConfigNames.PlaceCards;
    } else {
        CheckEndGameLastActions(G, ctx);
    }
};

/**
 * <h3>Проверяет есть ли у игроков наёмники для начала их вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии у игроков наёмников в конце текущей эпохи.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
const CheckEnlistmentMercenaries = (G: MyGameState, ctx: Ctx): void => {
    let count: boolean = false;
    for (let i: number = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY).length) {
            count = true;
            break;
        }
    }
    if (count) {
        G.drawProfit = ConfigNames.StartOrPassEnlistmentMercenaries;
        ctx.events!.setPhase!(Phases.EnlistmentMercenaries);
    } else {
        StartEndTierActions(G, ctx);
    }
};
