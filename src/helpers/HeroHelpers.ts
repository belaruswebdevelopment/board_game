import {heroesConfig, IVariants} from "../data/HeroData";
import {GetSuitIndexByName} from "./SuitHelpers";
import {AddActionsToStackAfterCurrent} from "./StackHelpers";
import {MyGameState} from "../GameSetup";
import {Ctx} from "boardgame.io";
import {ICard} from "../Card";
import {IArtefactCampCard} from "../Camp";
import {ICoin} from "../Coin";
import {IPublicPlayer, IStack, PlayerCardsType} from "../Player";
import {IHero} from "../Hero";

/**
 * <h3>Вычисляет индекс указанного героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретного героя.</li>
 * </ol>
 *
 * @param heroName Название героя.
 * @returns {number} Индекс героя.
 * @constructor
 */
export const GetHeroIndexByName = (heroName: string): number => Object.keys(heroesConfig).indexOf(heroName);

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
 * @returns {boolean} Нужно ли перемещать героя Труд.
 * @constructor
 */
export const CheckAndMoveThrud = (G: MyGameState, ctx: Ctx, card: ICard | IArtefactCampCard | IHero): boolean => {
    if (card.suit) {
        const suitId: number = GetSuitIndexByName(card.suit),
            index: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
                .findIndex((card: PlayerCardsType): boolean => card.name === "Thrud");
        if (index !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].splice(index, 1);
        }
        return index !== -1;
    }
    return false;
};

/**
 * <h3>Перемещение героя Труд.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При любых действия, когда пикается карта на планшет игрока и требуется переместить героя Труд.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @constructor
 */
export const StartThrudMoving = (G: MyGameState, ctx: Ctx, card: ICard | IArtefactCampCard | IHero): void => {
    const variants: IVariants = {
            blacksmith: {
                suit: "blacksmith",
                rank: 1,
                points: null,
            },
            hunter: {
                suit: "hunter",
                rank: 1,
                points: null,
            },
            explorer: {
                suit: "explorer",
                rank: 1,
                points: null,
            },
            warrior: {
                suit: "warrior",
                rank: 1,
                points: null,
            },
            miner: {
                suit: "miner",
                rank: 1,
                points: null,
            },
        },
        stack: IStack[] = [
            {
                actionName: "DrawProfitAction",
                variants,
                config: {
                    drawName: "Thrud",
                    name: "placeCards",
                    stageName: "placeCards",
                    suit: card.suit,
                },
            },
            {
                actionName: "PlaceThrudAction",
                variants,
            },
        ];
    AddActionsToStackAfterCurrent(G, ctx, stack);
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
 * @returns {string|boolean}
 * @constructor
 */
export const CheckAndStartUlineActionsOrContinue = (G: MyGameState, ctx: Ctx): string | boolean => {
    // todo Rework it all!
    const ulinePlayerIndex: number = G.publicPlayers.findIndex((player: IPublicPlayer): boolean =>
        player.buffs.everyTurn === "Uline");
    if (ulinePlayerIndex !== -1) {
        if (ctx.activePlayers![ctx.currentPlayer] !== "placeTradingCoinsUline" &&
            ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin: ICoin | null = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern];
            if (coin) {
                if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern] && coin.isTriggerTrading) {
                    if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                        .filter((coin: ICoin | null, index: number): boolean => index >= G.tavernsNum && coin === null)) {
                        G.actionsNum = G.suitsNum - G.tavernsNum;
                        ctx.events!.setStage!("placeTradingCoinsUline");
                        return "placeTradingCoinsUline";
                    }
                }
            }
        } else if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline" &&
            !G.actionsNum) {
            ctx.events!.endStage!();
            return "endPlaceTradingCoinsUline";
        } else if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) === "placeTradingCoinsUline" &&
            G.actionsNum) {
            return "nextPlaceTradingCoinsUline";
        } else {
            return "placeCoinsUline";
        }
    } else if (ctx.phase !== "pickCards") {
        ctx.events!.setPhase!("pickCards");
    }
    return false;
};