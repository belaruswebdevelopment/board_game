import { CompareCards, EvaluateCard, isCardNotAction, RusCardTypes } from "./Card";
import { HasLowestPriority } from "./Priority";
import { CheckHeuristicsForCoinsPlacement } from "./BotConfig";
import { CurrentScoring } from "./Score";
import { moveBy, moveValidators } from "./MoveValidator";
import { DeckCardTypes, MyGameState, TavernCardTypes } from "./GameSetup";
import { Ctx } from "boardgame.io";
import { ICoin } from "./Coin";
import { IConfig, PlayerCardsType } from "./Player";
import {
    AddCoinToPouchProfit,
    DiscardAnyCardFromPlayerBoardProfit,
    DiscardCardFromBoardProfit,
    DiscardCardProfit,
    GetEnlistmentMercenariesProfit,
    GetMjollnirProfitProfit,
    PickCampCardHoldaProfit,
    PickDiscardCardProfit,
    PlaceCardsProfit,
    PlaceEnlistmentMercenariesProfit,
    StartEnlistmentMercenariesProfit,
    UpgradeCoinVidofnirVedrfolnirProfit
} from "./helpers/ProfitHelpers";
import { suitsConfig } from "./data/SuitData";
import { Phases, Stages } from "./Game";
import { ConfigNames } from "./actions/Actions";

/**
 * <h3>Интерфейс для возможных мувов у ботов.</h3>
 */
interface IMoves {
    move: string,
    args: number[][] | (string | number | boolean)[] | number,
};

export type IBotMoveArgumentsTypes = (number | string | boolean)[][];

/**
 * <h3>Возвращает массив возможных ходов для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для доступных ходов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Массив возможных мувов у ботов.
 */
export const enumerate = (G: MyGameState, ctx: Ctx): IMoves[] => {
    //make false for standard bot
    const enableAdvancedBot: boolean = true,
        uniqueArr: DeckCardTypes[] = [];
    let moves: IMoves[] = [],
        flag: boolean = true,
        advancedString: string = `advanced`,
        isAdvancedExist: boolean =
            Object.keys(moveBy[ctx.phase])
                .some((key: string): boolean => key.includes(advancedString));
    const activeStageOfCurrentPlayer: string = ctx.activePlayers?.[Number(ctx.currentPlayer)] ?? `default`;
    // todo Fix it, now just for bot can do RANDOM move
    const botMoveArguments: IBotMoveArgumentsTypes = [];
    for (const stage in moveBy[ctx.phase]) {
        if (moveBy[ctx.phase].hasOwnProperty(stage)) {
            if (ctx.phase === Phases.PickCards && stage.startsWith(`default`)) {
                continue;
            }
            if (stage.includes(activeStageOfCurrentPlayer)
                && (!isAdvancedExist || stage.includes(advancedString) === enableAdvancedBot)) {
                // todo Sync players and bots validations in one places
                const moveName: string = moveBy[ctx.phase][stage],
                    [minValue, maxValue]: [number, number] = moveValidators[moveName].getRange({ G, ctx }),
                    hasGetValue: boolean = moveValidators[moveName].hasOwnProperty(`getValue`);
                let argValue: number;
                let argArray: number[];
                for (let id: number = minValue; id < maxValue; id++) {
                    // todo sync bot moves options with profit UI options for players (same logic without UI)
                    let type: undefined | string = undefined;
                    if (stage === Stages.UpgradeCoin) {
                        // todo fix for Uline???
                        type = `board`;
                    }
                    if (!moveValidators[moveName].validate({ G, ctx, id, type })) {
                        continue;
                    }
                    if (hasGetValue) {
                        argArray = moveValidators[moveName].getValue!({ G, ctx, id });
                        moves.push({ move: moveName, args: [argArray] });
                    } else {
                        argValue = id;
                        moves.push({ move: moveName, args: [argValue] });
                    }
                }
            }
        }
    }
    if (moves.length > 0) {
        return moves;
    }
    if (ctx.phase === Phases.PickCards && activeStageOfCurrentPlayer === `default` && ctx.activePlayers === null) {
        // todo Fix it, now just for bot can do RANDOM move
        let pickCardOrCampCard: string = `card`;
        if (G.expansions.thingvellir.active
            && (Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
                || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)))) {
            pickCardOrCampCard = Math.floor(Math.random() * 2) ? `card` : `camp`;
        }
        if (pickCardOrCampCard === `card`) {
            const tavern: TavernCardTypes[] = G.taverns[G.currentTavern];
            for (let i: number = 0; i < tavern.length; i++) {
                const tavernCard: TavernCardTypes = tavern[i];
                if (tavernCard === null) {
                    continue;
                }
                if (tavern.some((card: TavernCardTypes): boolean =>
                    CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse: boolean =
                    EvaluateCard(G, ctx, tavernCard, i, tavern) < 0,
                    isExistCardNotWorse: boolean =
                        tavern.some((card: TavernCardTypes): boolean => (card !== null)
                            && (EvaluateCard(G, ctx, tavernCard, i, tavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength: number = uniqueArr.length;
                for (let j: number = 0; j < uniqueArrLength; j++) {
                    const uniqueCard: DeckCardTypes = uniqueArr[j];
                    if (isCardNotAction(tavernCard) && isCardNotAction(uniqueCard)
                        && tavernCard.suit === uniqueCard.suit
                        && CompareCards(tavernCard, uniqueCard) === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    uniqueArr.push(tavernCard);
                    moves.push({ move: `ClickCardMove`, args: [i] });
                }
                flag = true;
            }
        } else {
            for (let j: number = 0; j < G.campNum; j++) {
                if (G.camp[j] !== null) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: `ClickCampCardMove`,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
    }
    if (enableAdvancedBot && ctx.phase === Phases.PlaceCoins) {
        moves = [];
        const hasLowestPriority: boolean = HasLowestPriority(G, Number(ctx.currentPlayer));
        let resultsForCoins: number[] = CheckHeuristicsForCoinsPlacement(G, ctx);
        if (hasLowestPriority) {
            resultsForCoins = resultsForCoins.map((num: number, index: number): number =>
                index === 0 ? num - 20 : num);
        }
        const minResultForCoins: number = Math.min(...resultsForCoins),
            maxResultForCoins: number = Math.max(...resultsForCoins),
            tradingProfit: number = G.decks[G.decks.length - 1].length > 9 ? 1 : 0;
        let [positionForMinCoin, positionForMaxCoin]: number[] = [-1, -1];
        if (minResultForCoins <= 0) {
            positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
        }
        if (maxResultForCoins >= 0) {
            positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
        }
        const allCoinsOrder: number[][] = G.botData.allCoinsOrder,
            handCoins: (ICoin | null)[] = G.publicPlayers[Number(ctx.currentPlayer)].handCoins;
        for (let i: number = 0; i < allCoinsOrder.length; i++) {
            const hasTrading: boolean =
                allCoinsOrder[i].some((coinId: number): boolean =>
                    Boolean(handCoins[coinId]?.isTriggerTrading));
            if (tradingProfit < 0) {
                if (hasTrading) {
                    continue;
                }
                moves.push({ move: `BotsPlaceAllCoinsMove`, args: [allCoinsOrder[i]] });
            } else if (tradingProfit > 0) {
                if (!hasTrading) {
                    continue;
                }
                const hasPositionForMaxCoin: boolean = positionForMaxCoin !== -1,
                    hasPositionForMinCoin: boolean = positionForMinCoin !== -1,
                    maxCoin: ICoin | null = handCoins[allCoinsOrder[i][positionForMaxCoin]],
                    minCoin: ICoin | null = handCoins[allCoinsOrder[i][positionForMinCoin]];
                if (maxCoin && minCoin) {
                    let isTopCoinsOnPosition: boolean = false,
                        isMinCoinsOnPosition: boolean = false;
                    if (hasPositionForMaxCoin) {
                        isTopCoinsOnPosition =
                            allCoinsOrder[i].filter((coinIndex: number): boolean =>
                                handCoins[coinIndex] !== null
                                && handCoins[coinIndex]!.value > maxCoin.value).length <= 1;
                    }
                    if (hasPositionForMinCoin) {
                        isMinCoinsOnPosition = handCoins.filter((coin: ICoin | null): boolean => coin !== null
                            && coin!.value < minCoin.value).length <= 1;
                    }
                    if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                        moves.push({ move: "BotsPlaceAllCoinsMove", args: [G.botData.allCoinsOrder[i]] });
                        //console.log(`#` + i.toString().padStart(2) + `:     ` + allCoinsOrder[i].map(item => handCoins[item].value));
                    }
                }
            } else {
                moves.push({ move: "BotsPlaceAllCoinsMove", args: [allCoinsOrder[i]] });
            }
        }
        //console.log(moves);
    }
    // todo Fix it, now just for bot can do RANDOM move
    if (activeStageOfCurrentPlayer === Stages.PlaceCards || ctx.phase === Phases.EndTier) {
        PlaceCardsProfit(G, ctx, botMoveArguments);
        moves.push({
            move: `PlaceCardMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (ctx.phase === Phases.GetMjollnirProfit) {
        const totalSuitsRanks: number[] = [];
        GetMjollnirProfitProfit(G, ctx, totalSuitsRanks);
        botMoveArguments.push([Object.values(suitsConfig)[totalSuitsRanks
            .indexOf(Math.max(...totalSuitsRanks))].suit]);
        moves.push({
            move: `GetMjollnirProfitMove`,
            args: [...botMoveArguments[0]],
        });
    }
    if (ctx.phase === Phases.BrisingamensEndGame) {
        DiscardAnyCardFromPlayerBoardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: `DiscardCardFromPlayerBoardMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (ctx.phase === Phases.EnlistmentMercenaries) {
        if (G.drawProfit === ConfigNames.StartOrPassEnlistmentMercenaries) {
            StartEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            if (Math.floor(Math.random() * botMoveArguments.length) === 0) {
                moves.push({ move: `StartEnlistmentMercenariesMove`, args: [] });
            } else {
                moves.push({ move: `PassEnlistmentMercenariesMove`, args: [] });
            }
        } else if (G.drawProfit === ConfigNames.EnlistmentMercenaries) {
            GetEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            moves.push({
                move: `GetEnlistmentMercenariesMove`,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        } else if (G.drawProfit === ConfigNames.PlaceEnlistmentMercenaries) {
            PlaceEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            moves.push({
                move: `PlaceEnlistmentMercenariesMove`,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
    }
    if (ctx.phase === Phases.PlaceCoinsUline) {
        for (let j: number = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                botMoveArguments.push([j]);
            }
        }
        moves.push({
            move: `ClickHandCoinMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
        moves.push({ move: `ClickBoardCoinMove`, args: [G.currentTavern + 1] });
    }
    if (activeStageOfCurrentPlayer === Stages.PlaceTradingCoinsUline) {
        for (let j: number = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                botMoveArguments.push([j]);
            }
        }
        moves.push({
            move: `ClickHandCoinMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
        if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.tavernsNum]) {
            moves.push({ move: `ClickBoardCoinMove`, args: [G.tavernsNum + 1] });
        } else {
            moves.push({ move: `ClickBoardCoinMove`, args: [G.tavernsNum] });
        }
    }
    if (activeStageOfCurrentPlayer === Stages.AddCoinToPouch) {
        AddCoinToPouchProfit(G, ctx, botMoveArguments);
        moves.push({
            move: `AddCoinToPouchMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (activeStageOfCurrentPlayer === Stages.UpgradeCoinVidofnirVedrfolnir) {
        UpgradeCoinVidofnirVedrfolnirProfit(G, ctx, botMoveArguments);
        moves.push({
            move: `UpgradeCoinVidofnirVedrfolnirMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    // TODO FIX It's not activeStageOfCurrentPlayer it' for Other players!!!
    // if (activeStageOfCurrentPlayer === "discardSuitCard") {
    if (ctx.phase === Phases.PickCards && ctx.activePlayers !== null && activeStageOfCurrentPlayer === `default`) {
        // TODO Fix this (only for quick bot actions)
        // todo Bot can't do async turns...?
        const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
        if (config !== undefined && config.suit !== undefined) {
            for (let p: number = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer) && G.publicPlayers[p].stack[0] !== undefined) {
                    for (let i: number = 0; i < G.publicPlayers[p].cards[config.suit].length; i++) {
                        for (let j: number = 0; j < 1; j++) {
                            if (G.publicPlayers[p].cards[config.suit][i] !== undefined) {
                                if (G.publicPlayers[p].cards[config.suit][i].type !== RusCardTypes.HERO) {
                                    const points: number | null = G.publicPlayers[p].cards[config.suit][i].points;
                                    if (points !== null) {
                                        botMoveArguments.push([points]);
                                    }
                                }
                            }
                        }
                    }
                    const minValue: number = Math.min(...botMoveArguments as unknown as number[]);
                    const minCardIndex: number =
                        G.publicPlayers[p].cards[config.suit].findIndex((card: PlayerCardsType): boolean =>
                            card.type !== RusCardTypes.HERO && card.points === minValue);
                    if (minCardIndex !== -1) {
                        moves.push({
                            move: `DiscardSuitCardFromPlayerBoardMove`,
                            args: [config.suit, p, minCardIndex],
                        });
                    }
                }
            }
        }
    }
    if (activeStageOfCurrentPlayer === Stages.DiscardCardFromBoard) {
        DiscardCardFromBoardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: `DiscardCardMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (activeStageOfCurrentPlayer === Stages.PickDiscardCard) {
        PickDiscardCardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: `PickDiscardCardMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (ctx.numPlayers === 2) {
        if (activeStageOfCurrentPlayer === Stages.DiscardCard) {
            DiscardCardProfit(G, ctx, botMoveArguments);
            moves.push({
                move: `DiscardCard2PlayersMove`,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
    }
    if (activeStageOfCurrentPlayer === Stages.PickCampCardHolda) {
        PickCampCardHoldaProfit(G, ctx, botMoveArguments);
        moves.push({
            move: `ClickCampCardHoldaMove`,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (moves.length === 0 && ctx.phase !== null) {
        // todo Fix for bot no moves if have artefact with not pick new hero and get artifact with get new hero (he can pick hero by it's action)
        console.log(`ALERT: bot has ${moves.length} moves. Phase: ${ctx.phase}`);
    }
    return moves;
};

/**
* <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
* <p>Применения:</p>
* <ol>
* <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
* </oL>
*
* @todo Саше: сделать описание функции и параметров.
* @param G
* @param ctx
* @returns
*/
export const iterations = (G: MyGameState, ctx: Ctx): number => {
    const maxIter: number = G.botData.maxIter;
    if (ctx.phase === Phases.PickCards) {
        const currentTavern: (DeckCardTypes | null)[] = G.taverns[G.currentTavern];
        if (currentTavern.filter((card: DeckCardTypes | null): boolean => card !== null).length === 1) {
            return 1;
        }
        const cardIndex: number =
            currentTavern.findIndex((card: DeckCardTypes | null): boolean => card !== null),
            tavernCard: DeckCardTypes | null = currentTavern[cardIndex];
        if (currentTavern.every((card: DeckCardTypes | null): boolean =>
            card === null || (isCardNotAction(card) && tavernCard !== null && isCardNotAction(tavernCard)
                && card.suit === tavernCard.suit && CompareCards(card, tavernCard) === 0))) {
            return 1;
        }
        let efficientMovesCount: number = 0;
        for (let i: number = 0; i < currentTavern.length; i++) {
            const tavernCard: DeckCardTypes | null = currentTavern[i];
            if (tavernCard === null) {
                continue;
            }
            if (currentTavern.some((card: DeckCardTypes | null): boolean =>
                CompareCards(tavernCard, card) === -1)) {
                continue;
            }
            if (G.decks[0].length > 18) {
                if (tavernCard && isCardNotAction(tavernCard)) {
                    if (CompareCards(tavernCard, G.averageCards[tavernCard.suit]) === -1
                        && currentTavern.some((card: DeckCardTypes | null): boolean => card !== null
                            && CompareCards(card, G.averageCards[tavernCard.suit]) > -1)) {
                        continue;
                    }
                }
            }
            efficientMovesCount++;
            if (efficientMovesCount > 1) {
                return maxIter;
            }
        }
        if (efficientMovesCount === 1) {
            return 1;
        }
    }
    return maxIter;
};

/**
 * <h3>Возвращает цели игры для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для определения целей.</li>
 * </ol>
 *
 * @returns
 */
export const objectives = (): {
    isEarlyGame: { weight: number; checker: (G: MyGameState) => boolean; };
    isFirst: { weight: number; checker: (G: MyGameState, ctx: Ctx) => boolean; };
    isStronger: { weight: number; checker: (G: MyGameState, ctx: Ctx) => boolean; };
} => ({
    isEarlyGame: {
        checker: (G: MyGameState): boolean => {
            return G.decks[0].length > 0;
        },
        weight: -100.0,
    },
    /*isWeaker: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== `placeCoins`) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] < top2 && top2 < top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.85 * top1);
            }
            return false;
        },
        weight: 0.01,
    },*/
    /*isSecond: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== `placeCoins`) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] === top2 && top2 < top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.90 * top1);
            }
            return false;
        },
        weight: 0.1,
    },*/
    /*isEqual: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== `placeCoins`) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] < top2 && top2 === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.90 * top1);
            }
            return false;

        },
        weight: 0.1,
    },*/
    isFirst: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== `pickCards`) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(1.05 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
    isStronger: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== `pickCards`) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(1.10 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
});

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns
 */
export const playoutDepth = (G: MyGameState, ctx: Ctx): number => {
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 20;
    }
    return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 2;
};
