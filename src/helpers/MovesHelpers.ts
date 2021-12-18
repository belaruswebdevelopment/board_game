import { DiscardCardIfCampCardPicked, RefillEmptyCampCards } from "../Camp";
import { CheckIfCurrentTavernEmpty, RefillTaverns } from "../Tavern";
import { IHero, RemoveThrudFromPlayerBoardAfterGameEnd } from "../Hero";
import { DiscardCardFromTavern } from "../Card";
import { AddActionsToStack, StartActionFromStackOrEndActions } from "./StackHelpers";
import { CheckAndStartUlineActionsOrContinue } from "./HeroHelpers";
import { ActivateTrading } from "./CoinHelpers";
import { CampDeckCardTypes, MyGameState, TavernCardTypes } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { IStack, PlayerCardsType } from "../Player";
import { IVariants } from "../data/HeroData";
import { SuitNames } from "../data/SuitData";
import { DiscardCardFromTavernAction, DrawProfitAction } from "../actions/Actions";
import { DiscardAnyCardFromPlayerBoardAction, GetMjollnirProfitAction } from "../actions/CampActions";
import { PlaceYludAction } from "../actions/HeroActions";
// todo Add logging

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
        ctx.events!.setPhase!("getDistinctions");
    } else {
        if (ctx.phase !== "brisingamensEndGame" && ctx.phase !== "getMjollnirProfit") {
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
        let isNewPhase: boolean = false;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== "brisingamensEndGame" && ctx.phase !== "getMjollnirProfit") {
                for (let i: number = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.discardCardEndGame) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        const stack: IStack[] = [
                            {
                                action: DrawProfitAction,
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: "BrisingamensEndGameAction",
                                    drawName: "Brisingamens end game",
                                },
                            },
                            {
                                playerId: G.publicPlayersOrder[0],
                                action: DiscardAnyCardFromPlayerBoardAction,
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = "BrisingamensEndGameAction";
                        ctx.events!.setPhase!("brisingamensEndGame");
                        break;
                    }
                }
            }
            if (ctx.phase !== "getMjollnirProfit" && !isNewPhase) {
                for (let i: number = 0; i < ctx.numPlayers; i++) {
                    if (G.publicPlayers[i].buffs.getMjollnirProfit) {
                        isNewPhase = true;
                        G.publicPlayersOrder.push(i);
                        const stack: IStack[] = [
                            {
                                action: DrawProfitAction,
                                playerId: G.publicPlayersOrder[0],
                                config: {
                                    name: "getMjollnirProfit",
                                    drawName: "Mjollnir",
                                },
                            },
                            {
                                playerId: G.publicPlayersOrder[0],
                                action: GetMjollnirProfitAction,
                            },
                        ];
                        AddActionsToStack(G, ctx, stack);
                        G.drawProfit = "getMjollnirProfit";
                        ctx.events!.setPhase!("getMjollnirProfit");
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
    if (ctx.phase === "pickCards") {
        const isUlinePlaceTradingCoin: string | boolean = CheckAndStartUlineActionsOrContinue(G, ctx);
        if (isUlinePlaceTradingCoin !== "placeTradingCoinsUline"
            && isUlinePlaceTradingCoin !== "nextPlaceTradingCoinsUline") {
            let isTradingActivated: boolean = false;
            if (!isTrading) {
                isTradingActivated = ActivateTrading(G, ctx);
            }
            if (!isTradingActivated) {
                if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && ctx.playOrder.length < Number(ctx.numPlayers)) {
                    const cardIndex: number =
                        G.taverns[G.currentTavern].findIndex((card: TavernCardTypes): boolean => card !== null);
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
                    if (isPlaceCoinsUline !== "endPlaceTradingCoinsUline" && isPlaceCoinsUline !== "placeCoinsUline") {
                        ctx.events!.setPhase!("pickCards");
                    } else {
                        ctx.events!.setPhase!("placeCoinsUline");
                    }
                } else {
                    if (ctx.currentPlayer === ctx.playOrder[0] && G.campPicked && ctx.numPlayers === 2
                        && G.taverns[G.currentTavern].every(card => card !== null)) {
                        const stack: IStack[] = [
                            {
                                action: DrawProfitAction,
                                config: {
                                    stageName: "discardCard",
                                    name: "discardCard",
                                    drawName: "Discard tavern card",
                                },
                            },
                            {
                                action: DiscardCardFromTavernAction,
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
    } else if (ctx.phase === "endTier" || ctx.phase === "brisingamensEndGame" || ctx.phase === "getMjollnirProfit") {
        CheckEndGameLastActions(G, ctx);
    } else if (ctx.phase === "getDistinctions") {
        ctx.events!.endTurn!();
    } else if (ctx.phase === "enlistmentMercenaries") {
        if (((ctx.playOrderPos === 0 && ctx.playOrder.length === 1)
            && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || ((ctx.playOrderPos !== 0 && ctx.playOrder.length > 1)
                && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1])
            || (ctx.playOrder[ctx.playOrder.length - 2] !== undefined
                && (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 2])
                && !G.publicPlayers[Number(ctx.playOrder[ctx.playOrder.length - 1])].campCards
                    .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length)) {
            StartEndTierActions(G, ctx);
        } else {
            const stack: IStack[] = [
                {
                    action: DrawProfitAction,
                    playerId: Number(ctx.playOrder[ctx.playOrder.findIndex((playerIndex: string): boolean =>
                        playerIndex === ctx.currentPlayer) + 1]),
                    config: {
                        name: "enlistmentMercenaries",
                        drawName: "Enlistment Mercenaries",
                    },
                },
            ];
            ctx.events!.endTurn!();
            AddActionsToStack(G, ctx, stack);
            G.drawProfit = "enlistmentMercenaries";
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
        index = G.publicPlayers[i].heroes.findIndex((hero: IHero): boolean => hero.name === "Ylud");
        if (index !== -1) {
            ylud = true;
            G.publicPlayersOrder.push(i);
        }
    }
    if (!ylud) {
        for (let i: number = 0; i < G.publicPlayers.length; i++) {
            for (let j: number = 0; j < G.suitsNum; j++) {
                index = G.publicPlayers[i].cards[j].findIndex((card: PlayerCardsType): boolean => card.name === "Ylud");
                if (index !== -1) {
                    G.publicPlayers[Number(ctx.currentPlayer)].cards[i].splice(index, 1);
                    G.publicPlayersOrder.push(i);
                    ylud = true;
                }
            }
        }
    }
    if (ylud) {
        ctx.events!.setPhase!("endTier");
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
                playerId: G.publicPlayersOrder[0],
                action: DrawProfitAction,
                variants,
                config: {
                    stageName: "placeCards",
                    drawName: "Ylud",
                    name: "placeCard",
                },
            },
            {
                playerId: G.publicPlayersOrder[0],
                action: PlaceYludAction,
                variants,
            },
        ];
        AddActionsToStack(G, ctx, stack);
        G.drawProfit = "placeCards";
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
        if (G.publicPlayers[i].campCards.filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length) {
            count = true;
            break;
        }
    }
    if (count) {
        G.drawProfit = "startOrPassEnlistmentMercenaries";
        ctx.events!.setPhase!("enlistmentMercenaries");
    } else {
        StartEndTierActions(G, ctx);
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
        ctx.events!.setPhase!("placeCoins");
    }
};
