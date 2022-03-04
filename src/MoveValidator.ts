import type { Ctx } from "boardgame.io";
import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { IsMercenaryCampCard } from "./Camp";
import { IsCardNotActionAndNotNull } from "./Card";
import { IsCoin } from "./Coin";
import { suitsConfig } from "./data/SuitData";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { IsHeroCard } from "./Hero";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { BuffNames, ConfigNames, MoveNames, Phases, ValidatorNames } from "./typescript/enums";
import type { CampCardTypes, CampDeckCardTypes, CoinType, DeckCardTypes, IBuffs, IConfig, IMoveArgumentsStage, IMoveBy, IMoveByBrisingamensEndGameOptions, IMoveByEndTierOptions, IMoveByEnlistmentMercenariesOptions, IMoveByGetDistinctionsOptions, IMoveByGetMjollnirProfitOptions, IMoveByPickCardsOptions, IMoveByPlaceCoinsOptions, IMoveByPlaceCoinsUlineOptions, IMoveCoinsArguments, IMoveSuitCardCurrentId, IMoveSuitCardPlayerCurrentId, IMoveSuitCardPlayerIdArguments, IMoveValidator, IMoveValidators, IMyGameState, IPublicPlayer, IValidatorsConfig, MoveByTypes, MoveValidatorGetRangeTypes, OptionalSuitPropertyTypes, PickedCardType, StageTypes, SuitTypes, TavernCardTypes, ValidMoveIdParamTypes } from "./typescript/interfaces";

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param coinId
 * @param type
 * @returns
 */
export const CoinUpgradeValidation = (G: IMyGameState, ctx: Ctx, coinData: IMoveCoinsArguments): boolean => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (coinData.type === "hand") {
        const handCoinPosition: number =
            player.boardCoins.filter((coin: CoinType, index: number): boolean =>
                coin === null && index <= coinData.coinId).length;
        if (!player.handCoins.filter((coin: CoinType): boolean =>
            IsCoin(coin))[handCoinPosition - 1]?.isTriggerTrading) {
            return true;
        }
    } else {
        if (!player.boardCoins[coinData.coinId]?.isTriggerTrading) {
            return true;
        }
    }
    return false;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param obj Параметры валидации мува.
 * @returns Валидный ли мув.
 */
export const IsValidMove = (G: IMyGameState, ctx: Ctx, stage: StageTypes, id?: ValidMoveIdParamTypes): boolean => {
    const validator: IMoveValidator | null = GetValidator(ctx.phase as MoveByTypes, stage);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid = ValidateByValues<number>(id, validator.getRange(G, ctx) as number[]);
        } else if (typeof id === `string`) {
            isValid = ValidateByValues<SuitTypes>(id, validator.getRange(G, ctx) as SuitTypes[]);
        } else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx) as
                    IMoveCoinsArguments[]);
            } else if (`playerId` in id) {
                isValid = ValidateByObjectSuitCardIdPlayerIdValues(id,
                    validator.getRange(G, ctx, id.playerId) as IMoveSuitCardPlayerIdArguments);
            } else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange(G, ctx) as
                    OptionalSuitPropertyTypes<number[]>);
            }
        } else {
            isValid = true;
        }
        if (isValid) {
            return validator.validate(G, ctx, id);
        }
    }
    return isValid;
};

export const GetValidator = (phase: MoveByTypes, stage: StageTypes): IMoveValidator | null | never => {
    let validator: IMoveValidator | null;
    switch (phase) {
        case Phases.PlaceCoins:
            validator = moveBy[phase][stage as keyof IMoveByPlaceCoinsOptions];
            break;
        case Phases.PlaceCoinsUline:
            validator = moveBy[phase][stage as keyof IMoveByPlaceCoinsUlineOptions];
            break;
        case Phases.PickCards:
            validator = moveBy[phase][stage as keyof IMoveByPickCardsOptions];
            break;
        case Phases.EnlistmentMercenaries:
            validator = moveBy[phase][stage as keyof IMoveByEnlistmentMercenariesOptions];
            break;
        case Phases.EndTier:
            validator = moveBy[phase][stage as keyof IMoveByEndTierOptions];
            break;
        case Phases.GetDistinctions:
            validator = moveBy[phase][stage as keyof IMoveByGetDistinctionsOptions];
            break;
        case Phases.BrisingamensEndGame:
            validator = moveBy[phase][stage as keyof IMoveByBrisingamensEndGameOptions];
            break;
        case Phases.GetMjollnirProfit:
            validator = moveBy[phase][stage as keyof IMoveByGetMjollnirProfitOptions];
            break;
        default:
            throw new Error(`Нет такого валидатора.`);
    }
    return validator;
};

// TODO MOVE ALL SAME VALIDATING LOGIC FROM GET RANGE/GET VALUE TO VALIDATE!
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators: IMoveValidators = {
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[][]>[`args`] | never => {
            if (G !== undefined) {
                return G.botData.allCoinsOrder;
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes | never => {
            const allCoinsOrder: IMoveArgumentsStage<number[][]>[`args`] = currentMoveArguments as number[][],
                hasLowestPriority: boolean = HasLowestPriority(G, Number(ctx.currentPlayer));
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
            const handCoins: CoinType[] = G.publicPlayers[Number(ctx.currentPlayer)].handCoins;
            for (let i = 0; i < allCoinsOrder.length; i++) {
                const hasTrading: boolean =
                    allCoinsOrder[i].some((coinId: number): boolean =>
                        Boolean(handCoins[coinId]?.isTriggerTrading));
                if (tradingProfit < 0) {
                    if (hasTrading) {
                        continue;
                    }
                    return allCoinsOrder[i];
                } else if (tradingProfit > 0) {
                    if (!hasTrading) {
                        continue;
                    }
                    const hasPositionForMaxCoin: boolean = positionForMaxCoin !== -1,
                        hasPositionForMinCoin: boolean = positionForMinCoin !== -1,
                        maxCoin: CoinType = handCoins[allCoinsOrder[i][positionForMaxCoin]],
                        minCoin: CoinType = handCoins[allCoinsOrder[i][positionForMinCoin]];
                    if (maxCoin && minCoin) {
                        let isTopCoinsOnPosition = false,
                            isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition =
                                allCoinsOrder[i].filter((coinIndex: number): boolean => {
                                    const handCoin: CoinType = handCoins[coinIndex];
                                    return IsCoin(handCoin) && handCoin.value > maxCoin.value;
                                }).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition = handCoins.filter((coin: CoinType): boolean =>
                                IsCoin(coin) && coin.value < minCoin.value).length <= 1;
                        }
                        if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                            return allCoinsOrder[i];
                            //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                        }
                    }
                } else {
                    return allCoinsOrder[i];
                }
            }
            throw new Error(`Отсутствует вариант выкладки монет для ботов.`);
        },
        moveName: MoveNames.BotsPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    ClickBoardCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.boardCoins.length; j++) {
                    if (player.selectedCoin !== null || (player.selectedCoin === null
                        && IsCoin(player.boardCoins[j]))) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickBoardCoinMove,
        validate: (): boolean => true,
    },
    ClickCampCardMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
                for (let j = 0; j < G.campNum; j++) {
                    const campCard: CampCardTypes = G.camp[j];
                    if (campCard !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCampCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean | never => {
            if (G !== undefined && ctx !== undefined) {
                return G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                    || (!G.campPicked && G.publicPlayers[Number(ctx.currentPlayer)].buffs
                        .find((buff: IBuffs): boolean => buff.goCamp !== undefined) !== undefined));
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
    },
    ClickCardMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes | never => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                uniqueArr: DeckCardTypes[] = [],
                tavern: TavernCardTypes[] = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < moveArguments.length; i++) {
                const tavernCard: TavernCardTypes = tavern[moveArguments[i]];
                if (tavernCard === null) {
                    continue;
                }
                if (tavern.some((card: TavernCardTypes): boolean =>
                    CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse: boolean =
                    EvaluateCard(G, ctx, tavernCard, moveArguments[i], tavern) < 0,
                    isExistCardNotWorse: boolean =
                        tavern.some((card: TavernCardTypes): boolean => (card !== null)
                            && (EvaluateCard(G, ctx, tavernCard, moveArguments[i], tavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength: number = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard: DeckCardTypes = uniqueArr[j];
                    if (IsCardNotActionAndNotNull(tavernCard) && IsCardNotActionAndNotNull(uniqueCard)
                        && tavernCard.suit === uniqueCard.suit
                        && CompareCards(tavernCard, uniqueCard) === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    uniqueArr.push(tavernCard);
                    return moveArguments[i];
                }
                flag = true;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: MoveNames.ClickCardMove,
        validate: (): boolean => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (): IMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
            for (let j = 0; j < 3; j++) {
                moveMainArgs.push(j);
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCardToPickDistinctionMove,
        validate: (): boolean => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
                let suit: SuitTypes;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.distinctions[suit] === ctx.currentPlayer) {
                            if (ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos]) {
                                moveMainArgs.push(suit);
                                break;
                            }
                        }
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickDistinctionCardMove,
        validate: (): boolean => true,
    },
    ClickHandCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (IsCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandCoinMove,
        validate: (): boolean => true,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (IsCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandCoinUlineMove,
        validate: (): boolean => true,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (IsCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandTradingCoinUlineMove,
        validate: (): boolean => true,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] = {};
                for (let i = 0; ; i++) {
                    let isExit = true,
                        suit: SuitTypes;
                    for (suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                            if (player.cards[suit][i] !== undefined) {
                                isExit = false;
                                if (!IsHeroCard(player.cards[suit][i])) {
                                    moveMainArgs[suit] = [];
                                    moveMainArgs[suit]?.push(i);
                                }
                            }
                        }
                    }
                    if (isExit) {
                        break;
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes | never => {
            const moveArguments: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`],
                suitNames: SuitTypes[] = [];
            let suit: SuitTypes;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNames.push(suit);
                }
            }
            const suitName: SuitTypes = suitNames[Math.floor(Math.random() * suitNames.length)],
                moveArgument: number[] | undefined = moveArguments[suitName];
            if (moveArgument !== undefined) {
                return {
                    suit: suitName,
                    cardId: moveArgument[Math.floor(Math.random() * moveArgument.length)],
                };
            } else {
                throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
            }
        },
        moveName: MoveNames.DiscardCardFromPlayerBoardMove,
        validate: (): boolean => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.DiscardCard2PlayersMove,
        validate: (): boolean => true,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
                    mercenaries: CampDeckCardTypes[] =
                        G.publicPlayers[Number(ctx.currentPlayer)].campCards
                            .filter((card: CampDeckCardTypes): boolean => IsMercenaryCampCard(card));
                for (let j = 0; j < mercenaries.length; j++) {
                    moveMainArgs.push(j);
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.GetEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
                let suit: SuitTypes;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes | never => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                totalSuitsRanks: number[] = [];
            for (let j = 0; j < moveArguments.length; j++) {
                totalSuitsRanks.push(G.publicPlayers[Number(ctx.currentPlayer)]
                    .cards[moveArguments[j]].reduce(TotalRank, 0) * 2);
            }
            const index: number = totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks));
            if (index !== -1) {
                return moveArguments[index];
            } else {
                throw new Error(`Должна быть хотя бы одна фракция с максимальным количеством шевронов.`);
            }
        },
        moveName: MoveNames.GetMjollnirProfitMove,
        validate: (): boolean => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: (): IMoveArgumentsStage<null>[`args`] => null,
        getValue: (): ValidMoveIdParamTypes => null,
        moveName: MoveNames.PassEnlistmentMercenariesMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean | never => {
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card: CampDeckCardTypes): boolean => IsMercenaryCampCard(card)).length;
                return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
                let suit: SuitTypes;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const card: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (card !== null && `variants` in card) {
                            if (card.variants !== undefined) {
                                if (suit === card.variants[suit]?.suit) {
                                    moveMainArgs.push(suit);
                                }
                            }
                        }
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
                let suit: SuitTypes;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        moveMainArgs.push(suit);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceYludHeroMove,
        validate: (): boolean => true,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: (): IMoveArgumentsStage<null>[`args`] => null,
        getValue: (): ValidMoveIdParamTypes => null,
        moveName: MoveNames.StartEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [],
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)
                        && IsCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.AddCoinToPouchMove,
        validate: (): boolean => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
                for (let j = 0; j < G.campNum; j++) {
                    if (G.camp[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes): number => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCampCardHoldaMove,
        validate: (): boolean => true,
    },
    ClickCoinToUpgradeMoveValidator: {
        // TODO Rework if Uline in play or no 1 coin in game (& add param isInitial?)
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                    [] as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`],
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                    handCoins: CoinType[] =
                        player.handCoins.filter((coin: CoinType): boolean => IsCoin(coin));
                let handCoinIndex = -1;
                for (let j = 0; j < player.boardCoins.length; j++) {
                    const boardCoin: CoinType = player.boardCoins[j];
                    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && boardCoin === null) {
                        handCoinIndex++;
                        const handCoinNotNull: CoinType = handCoins[handCoinIndex],
                            handCoinId: number = player.handCoins.findIndex((coin: CoinType): boolean =>
                                IsCoin(handCoinNotNull) && coin?.value === handCoinNotNull.value
                                && coin.isInitial === handCoinNotNull.isInitial);
                        if (handCoinId !== -1) {
                            const handCoin: CoinType = player.handCoins[handCoinId];
                            if (IsCoin(handCoin) && !handCoin.isTriggerTrading) {
                                moveMainArgs.push({
                                    coinId: j,
                                    type: `hand`,
                                    isInitial: handCoin.isInitial,
                                });
                            }
                        }
                    } else if (IsCoin(boardCoin) && !boardCoin.isTriggerTrading) {
                        moveMainArgs.push({
                            coinId: j,
                            type: `board`,
                            isInitial: boardCoin.isInitial,
                        });
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean | never => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                return CoinUpgradeValidation(G, ctx, id);
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
                for (let i = 0; i < G.heroes.length; i++) {
                    if (G.heroes[i].active) {
                        moveMainArgs.push(i);
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHeroCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean | never => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                let isValid = false;
                const validators: IValidatorsConfig | undefined = G.heroes[id].validators;
                if (validators !== undefined) {
                    for (const validator in validators) {
                        if (Object.prototype.hasOwnProperty.call(validators, validator)) {
                            switch (validator) {
                                case ValidatorNames.Conditions:
                                    isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                                    break;
                                case ValidatorNames.DiscardCard:
                                    isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                                    break;
                                default:
                                    isValid = true;
                                    break;
                            }
                        }
                    }
                } else {
                    isValid = true;
                }
                return isValid;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] = {},
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                    config: IConfig | undefined = player.stack[0].config,
                    pickedCard: PickedCardType = player.pickedCard;
                if (config !== undefined) {
                    let suit: SuitTypes;
                    for (suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            if (suit !== config.suit && !(G.drawProfit === ConfigNames.DagdaAction
                                && player.actionsNum === 1 && pickedCard !== null && `suit` in pickedCard
                                && suit === pickedCard.suit)) {
                                const last: number = player.cards[suit].length - 1;
                                if (last !== -1 && !IsHeroCard(player.cards[suit][last])) {
                                    moveMainArgs[suit] = [];
                                    moveMainArgs[suit]?.push(last);
                                }
                            }
                        }
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes | never => {
            const moveArguments: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`],
                suitNamesArray: SuitTypes[] = [];
            let suit: SuitTypes;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNamesArray.push(suit);
                }
            }
            const suitName: SuitTypes = suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)],
                moveArgument: number[] | undefined = moveArguments[suitName];
            if (moveArgument !== undefined) {
                return {
                    suit: suitName,
                    cardId: moveArgument[Math.floor(Math.random() * moveArgument.length)],
                };
            } else {
                throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
            }
        },
        moveName: MoveNames.DiscardCardMove,
        validate: (): boolean => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number):
            IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`] | never => {
            if (G !== undefined && ctx !== undefined && playerId !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[playerId],
                    config: IConfig | undefined = player.stack[0].config;
                if (config !== undefined && config.suit !== undefined) {
                    if (player.stack[0] !== undefined) {
                        const moveMainArgs: IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`] = {
                            playerId: playerId,
                            suit: config.suit,
                            cards: [],
                        };
                        for (let i = 0; i < player.cards[config.suit].length; i++) {
                            if (player.cards[config.suit][i] !== undefined) {
                                if (!IsHeroCard(player.cards[config.suit][i])) {
                                    moveMainArgs.cards.push(i);
                                }
                            }
                        }
                        return moveMainArgs;
                    } else {
                        throw new Error(`'player.stack[0]' is undefined.`);
                    }
                } else {
                    throw new Error(`'config' and/or 'config.suit' is undefined.`);
                }
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'playerId' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes | never => {
            const moveArguments: IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`],
                player: IPublicPlayer = G.publicPlayers[moveArguments.playerId];
            let minCardIndex = 0,
                minCardValue: number | null = player.cards[moveArguments.suit][0].points;
            // TODO Check if array not empty and FOR ALL VALIDATORS TOO!!!
            moveArguments.cards.forEach((value: number, index: number) => {
                const cardPoints: number | null = player.cards[moveArguments.suit][value].points;
                if (cardPoints !== null && minCardValue !== null) {
                    if (cardPoints < minCardValue) {
                        minCardIndex = index;
                        minCardValue = cardPoints;
                    }
                } else {
                    throw new Error(`Фракция должна иметь параметр 'points'.`);
                }
            });
            return {
                playerId: moveArguments.playerId,
                suit: moveArguments.suit,
                cardId: moveArguments.cards[minCardIndex],
            };
        },
        moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: (): boolean => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] | never => {
            if (G !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<number[]>[`args`] = [];
                for (let j = 0; j < G.discardCardsDeck.length; j++) {
                    moveMainArgs.push(j);
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PickDiscardCardMove,
        validate: (): boolean => true,
    },
    PlaceOlwinCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
                let suit: SuitTypes;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceOlwinCardMove,
        validate: (): boolean => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<SuitTypes[]>[`args`] = [];
                let suit: SuitTypes;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceThrudHeroMove,
        validate: (): boolean => true,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        // TODO Rework if Uline in play or no 1 coin in game(& add param isInitial ?)
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] | never => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] = [],
                    player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                    config: IConfig | undefined = player.stack[0].config;
                if (config !== undefined) {
                    for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
                        const coin: CoinType = player.boardCoins[j];
                        if (IsCoin(coin)) {
                            if (!coin.isTriggerTrading && config.coinId !== j) {
                                moveMainArgs.push({
                                    coinId: j,
                                    type: `board`,
                                    isInitial: coin.isInitial,
                                });
                            }
                        }
                    }
                }
                return moveMainArgs;
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean | never => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                return G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config?.coinId !== id.coinId
                    && CoinUpgradeValidation(G, ctx, id);
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    // end
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveBy: IMoveBy = {
    placeCoins: {
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
        default3: moveValidators.BotsPlaceAllCoinsMoveValidator,
    },
    placeCoinsUline: {
        default1: moveValidators.ClickHandCoinUlineMoveValidator,
    },
    pickCards: {
        default1: moveValidators.ClickCardMoveValidator,
        default2: moveValidators.ClickCampCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        discardCard: moveValidators.DiscardCard2PlayersMoveValidator,
        placeTradingCoinsUline: moveValidators.ClickHandTradingCoinUlineMoveValidator,
    },
    enlistmentMercenaries: {
        default1: moveValidators.StartEnlistmentMercenariesMoveValidator,
        default2: moveValidators.PassEnlistmentMercenariesMoveValidator,
        default3: moveValidators.GetEnlistmentMercenariesMoveValidator,
        default4: moveValidators.PlaceEnlistmentMercenariesMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    endTier: {
        default1: moveValidators.PlaceYludHeroMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    getDistinctions: {
        default1: moveValidators.ClickDistinctionCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        pickDistinctionCard: moveValidators.ClickCardToPickDistinctionMoveValidator,
    },
    brisingamensEndGame: {
        default1: moveValidators.DiscardCardFromPlayerBoardMoveValidator,
    },
    getMjollnirProfit: {
        default1: moveValidators.GetMjollnirProfitMoveValidator,
    },
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param num
 * @param values
 * @returns
 */
const ValidateByValues = <T>(value: T, values: T[]): boolean => values.includes(value);

const ValidateByObjectCoinIdTypeIsInitialValues = (value: IMoveCoinsArguments,
    values: IMoveCoinsArguments[]): boolean => values.findIndex((coin: IMoveCoinsArguments) =>
        value.coinId === coin.coinId && value.type === coin.type && value.isInitial === coin.isInitial) !== -1;

const ValidateByObjectSuitCardIdValues = (value: IMoveSuitCardCurrentId,
    values: OptionalSuitPropertyTypes<number[]>): boolean => {
    const objectSuitCardIdValues: number[] | undefined = values[value.suit];
    return objectSuitCardIdValues !== undefined && objectSuitCardIdValues.includes(value.cardId);
};


const ValidateByObjectSuitCardIdPlayerIdValues = (value: IMoveSuitCardPlayerCurrentId,
    values: IMoveSuitCardPlayerIdArguments): boolean => values.suit === value.suit
    && values.playerId === value.playerId && values.cards.includes(value.cardId);
