import type { Ctx } from "boardgame.io";
import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { IsMercenaryCampCard } from "./Camp";
import { IsCardNotActionAndNotNull } from "./Card";
import { IsCoin } from "./Coin";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { MoveNames, MoveValidatorNames, Phases, ValidatorNames } from "./typescript/enums";
import type { CampDeckCardTypes, CoinType, DeckCardTypes, IBuffs, IHeroCard, IMoveArgumentsStage, IMoveBy, IMoveByBrisingamensEndGameOptions, IMoveByEndTierOptions, IMoveByEnlistmentMercenariesOptions, IMoveByGetDistinctionsOptions, IMoveByGetMjollnirProfitOptions, IMoveByPickCardsOptions, IMoveByPlaceCoinsOptions, IMoveByPlaceCoinsUlineOptions, IMoveCoinsArguments, IMoveSuitCardCurrentId, IMoveSuitCardPlayerCurrentId, IMoveSuitCardPlayerIdArguments, IMoveValidator, IMoveValidators, IMyGameState, IPublicPlayer, IValidatorsConfig, MoveByTypes, MoveValidatorGetRangeTypes, OptionalSuitPropertyTypes, PlayerCardsType, StageTypes, SuitTypes, TavernCardTypes, ValidMoveIdParamTypes } from "./typescript/interfaces";
import { DrawCamp, DrawDistinctions, DrawHeroes, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { AddCoinToPouchProfit, DiscardAnyCardFromPlayerBoardProfit, DiscardCardFromBoardProfit, DiscardCardProfit, DiscardSuitCardFromPlayerBoardProfit, ExplorerDistinctionProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, UpgradeCoinProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./ui/ProfitUI";

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
 * @param coinData Данные монеты.
 * @returns
 */
export const CoinUpgradeValidation = (G: IMyGameState, ctx: Ctx, coinData: IMoveCoinsArguments): boolean => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
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
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
};

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
 * @param stage Стадия.
 * @param id Данные для валидации.
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

export const GetValidator = (phase: MoveByTypes, stage: StageTypes): IMoveValidator | null => {
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
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[][]>[`args`] => {
            if (G !== undefined) {
                return G.botData.allCoinsOrder;
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const allCoinsOrder: IMoveArgumentsStage<number[][]>[`args`] = currentMoveArguments as number[][],
                hasLowestPriority: boolean = HasLowestPriority(G, Number(ctx.currentPlayer));
            let resultsForCoins: number[] = CheckHeuristicsForCoinsPlacement(G, ctx);
            if (hasLowestPriority) {
                resultsForCoins = resultsForCoins.map((num: number, index: number): number =>
                    index === 0 ? num - 20 : num);
            }
            const minResultForCoins: number = Math.min(...resultsForCoins),
                maxResultForCoins: number = Math.max(...resultsForCoins);
            const deck: DeckCardTypes[] | undefined = G.decks[G.decks.length - 1];
            if (deck !== undefined) {
                const tradingProfit: number = deck.length > 9 ? 1 : 0;
                let [positionForMinCoin, positionForMaxCoin]: number[] = [-1, -1];
                if (minResultForCoins <= 0) {
                    positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
                }
                if (maxResultForCoins >= 0) {
                    positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
                }
                const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    const handCoins: CoinType[] = player.handCoins;
                    for (let i = 0; i < allCoinsOrder.length; i++) {
                        const allCoinsOrderI: number[] | undefined = allCoinsOrder[i];
                        if (allCoinsOrderI !== undefined) {
                            const hasTrading: boolean =
                                allCoinsOrderI.some((coinId: number): boolean => {
                                    const handCoin: CoinType | undefined = handCoins[coinId];
                                    if (handCoin !== undefined) {
                                        return Boolean(handCoins[coinId]?.isTriggerTrading);
                                    } else {
                                        throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinId}.`);
                                    }
                                });
                            // TODO How tradingProfit can be < 0?
                            if (tradingProfit < 0) {
                                if (hasTrading) {
                                    continue;
                                }
                                return allCoinsOrderI;
                            } else if (tradingProfit > 0) {
                                if (!hasTrading && handCoins.every(coin => IsCoin(coin))) {
                                    continue;
                                }
                                if (positionForMaxCoin !== undefined && positionForMinCoin !== undefined) {
                                    const hasPositionForMaxCoin: boolean = positionForMaxCoin !== -1,
                                        hasPositionForMinCoin: boolean = positionForMinCoin !== -1,
                                        coinsOrderPositionForMaxCoin = allCoinsOrderI[positionForMaxCoin],
                                        coinsOrderPositionForMinCoin = allCoinsOrderI[positionForMinCoin];
                                    if (coinsOrderPositionForMaxCoin !== undefined
                                        && coinsOrderPositionForMinCoin !== undefined) {
                                        const maxCoin: CoinType | undefined = handCoins[coinsOrderPositionForMaxCoin],
                                            minCoin: CoinType | undefined = handCoins[coinsOrderPositionForMinCoin];
                                        if (maxCoin !== undefined && minCoin !== undefined) {
                                            if (IsCoin(maxCoin) && IsCoin(minCoin)) {
                                                let isTopCoinsOnPosition = false,
                                                    isMinCoinsOnPosition = false;
                                                if (hasPositionForMaxCoin) {
                                                    isTopCoinsOnPosition =
                                                        allCoinsOrderI.filter((coinIndex: number):
                                                            boolean => {
                                                            const handCoin: CoinType | undefined = handCoins[coinIndex];
                                                            if (handCoin !== undefined) {
                                                                return IsCoin(handCoin)
                                                                    && handCoin.value > maxCoin.value;
                                                            } else {
                                                                throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinIndex}.`);
                                                            }
                                                        }).length <= 1;
                                                }
                                                if (hasPositionForMinCoin) {
                                                    isMinCoinsOnPosition =
                                                        handCoins.filter((coin: CoinType): boolean =>
                                                            IsCoin(coin) && coin.value < minCoin.value).length <= 1;
                                                }
                                                if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                                                    return allCoinsOrderI;
                                                    //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                                                }
                                            } else {
                                                throw new Error(`В массиве выкладки монет отсутствует выкладка для максимальной ${coinsOrderPositionForMaxCoin} и/или минимальной ${coinsOrderPositionForMinCoin} монеты.`);
                                            }
                                        } else {
                                            throw new Error(`В массиве монет игрока в руке отсутствует максимальная и/или минимальная монета.`);
                                        }
                                    }
                                } else {
                                    throw new Error(`Отсутствуют значения выкладки для минимальной и/или максимальной монеты.`);
                                }
                            } else {
                                // TODO Why if trading profit === 0 we not checked min max coins positions!?
                                return allCoinsOrderI;
                            }
                        } else {
                            throw new Error(`В массиве выкладки монет отсутствует выкладка ${i}.`);
                        }
                    }
                } else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
                throw new Error(`Отсутствует вариант выкладки монет для ботов.`);
            } else {
                throw new Error(`В массиве дек карт отсутствует дека ${G.decks.length - 1} эпохи.`);
            }
        },
        moveName: MoveNames.BotsPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    ClickBoardCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickBoardCoinMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickBoardCoinMove,
        validate: (): boolean => true,
    },
    ClickCampCardMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined) {
                return DrawCamp(G, MoveValidatorNames.ClickCampCardMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickCampCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    return G.expansions.thingvellir?.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                        || (!G.campPicked && player.buffs.find((buff: IBuffs): boolean =>
                            buff.goCamp !== undefined) !== undefined));
                } else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
    },
    ClickCardMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined) {
                return DrawTaverns(G, MoveValidatorNames.ClickCardMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                uniqueArr: DeckCardTypes[] = [],
                currentTavern: TavernCardTypes[] | undefined = G.taverns[G.currentTavern];
            if (currentTavern !== undefined) {
                let flag = true;
                for (let i = 0; i < moveArguments.length; i++) {
                    const moveArgument: number | undefined = moveArguments[i];
                    if (moveArgument !== undefined) {
                        const tavernCard: TavernCardTypes | undefined = currentTavern[moveArgument];
                        if (tavernCard !== undefined) {
                            if (tavernCard === null) {
                                continue;
                            }
                            if (currentTavern.some((card: TavernCardTypes): boolean =>
                                CompareCards(tavernCard, card) < 0)) {
                                continue;
                            }
                            const isCurrentCardWorse: boolean = EvaluateCard(G, ctx, tavernCard,
                                moveArgument, currentTavern) < 0,
                                isExistCardNotWorse: boolean =
                                    currentTavern.some((card: TavernCardTypes): boolean => (card !== null)
                                        && (EvaluateCard(G, ctx, tavernCard, moveArgument,
                                            currentTavern) >= 0));
                            if (isCurrentCardWorse && isExistCardNotWorse) {
                                continue;
                            }
                            const uniqueArrLength: number = uniqueArr.length;
                            for (let j = 0; j < uniqueArrLength; j++) {
                                const uniqueCard: DeckCardTypes | undefined = uniqueArr[j];
                                if (uniqueCard !== undefined) {
                                    if (IsCardNotActionAndNotNull(tavernCard)
                                        && IsCardNotActionAndNotNull(uniqueCard)
                                        && tavernCard.suit === uniqueCard.suit
                                        && CompareCards(tavernCard, uniqueCard) === 0) {
                                        flag = false;
                                        break;
                                    }
                                } else {
                                    throw new Error(`В массиве уникальных карт отсутствует карта ${j}.`);
                                }
                            }
                            if (flag) {
                                uniqueArr.push(tavernCard);
                                return moveArgument;
                            }
                            flag = true;
                        } else {
                            throw new Error(`В массиве карт текущей таверны отсутствует карта ${moveArgument}.`);
                        }
                    } else {
                        throw new Error(`В массиве аргументов мува отсутствует аргумент ${i}.`);
                    }
                }
                throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
            } else {
                throw new Error(`В массиве таверн отсутствует текущая таверна.`);
            }
        },
        moveName: MoveNames.ClickCardMove,
        validate: (): boolean => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return ExplorerDistinctionProfit(G, ctx,
                    MoveValidatorNames.ClickCardToPickDistinctionMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickCardToPickDistinctionMove,
        validate: (): boolean => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DrawDistinctions(G, ctx, MoveValidatorNames.ClickDistinctionCardMoveValidator) as
                    IMoveArgumentsStage<SuitTypes[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: SuitTypes | undefined =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickDistinctionCardMove,
        validate: (): boolean => true,
    },
    ClickHandCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandCoinMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickHandCoinMove,
        validate: (): boolean => true,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DrawPlayersHandsCoins(G, ctx,
                    MoveValidatorNames.ClickHandCoinUlineMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickHandCoinUlineMove,
        validate: (): boolean => true,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DrawPlayersHandsCoins(G, ctx,
                    MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickHandTradingCoinUlineMove,
        validate: (): boolean => true,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DiscardAnyCardFromPlayerBoardProfit(G, ctx,
                    MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) as
                    IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`],
                suitNames: SuitTypes[] = [];
            let suit: SuitTypes;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNames.push(suit);
                }
            }
            const suitName: SuitTypes | undefined = suitNames[Math.floor(Math.random() * suitNames.length)];
            if (suitName !== undefined) {
                const moveArgumentForSuit: number[] | undefined = moveArguments[suitName];
                if (moveArgumentForSuit !== undefined) {
                    const moveArgument: number | undefined =
                        moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
                    if (moveArgument !== undefined) {
                        return {
                            suit: suitName,
                            cardId: moveArgument,
                        };
                    } else {
                        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
                    }
                } else {
                    throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
                }
            } else {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
        },
        moveName: MoveNames.DiscardCardFromPlayerBoardMove,
        validate: (): boolean => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DiscardCardProfit(G, ctx, MoveValidatorNames.DiscardCard2PlayersMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.DiscardCard2PlayersMove,
        validate: (): boolean => true,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return GetEnlistmentMercenariesProfit(G, ctx,
                    MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.GetEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return GetMjollnirProfitProfit(G, ctx,
                    MoveValidatorNames.GetMjollnirProfitMoveValidator) as
                    IMoveArgumentsStage<SuitTypes[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                totalSuitsRanks: number[] = [];
            for (let j = 0; j < moveArguments.length; j++) {
                const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    const moveArgumentI: SuitTypes | undefined = moveArguments[j];
                    if (moveArgumentI !== undefined) {
                        totalSuitsRanks.push(player.cards[moveArgumentI]
                            .reduce(TotalRank, 0) * 2);
                    } else {
                        throw new Error(`В массиве аргументов мува отсутствует аргумент ${j}.`);
                    }
                } else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
            }
            const index: number = totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks));
            if (index !== -1) {
                const moveArgument: SuitTypes | undefined = moveArguments[index];
                if (moveArgument !== undefined) {
                    return moveArgument;
                } else {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент ${index}.`);
                }
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
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    const mercenariesCount =
                        player.campCards.filter((card: CampDeckCardTypes): boolean =>
                            IsMercenaryCampCard(card)).length;
                    return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                        && mercenariesCount > 0;
                } else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return PlaceEnlistmentMercenariesProfit(G, ctx,
                    MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator) as
                    IMoveArgumentsStage<SuitTypes[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: SuitTypes | undefined =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.PlaceEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return PlaceCardsProfit(G, ctx, MoveValidatorNames.PlaceYludHeroMoveValidator) as
                    IMoveArgumentsStage<SuitTypes[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: SuitTypes | undefined =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
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
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return AddCoinToPouchProfit(G, ctx, MoveValidatorNames.AddCoinToPouchMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.AddCoinToPouchMove,
        validate: (): boolean => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return PickCampCardHoldaProfit(G, ctx,
                    MoveValidatorNames.ClickCampCardHoldaMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes): number => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickCampCardHoldaMove,
        validate: (): boolean => true,
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return UpgradeCoinProfit(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator) as
                    IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`],
                moveArgument: IMoveCoinsArguments | undefined =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                return CoinUpgradeValidation(G, ctx, id);
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined) {
                return DrawHeroes(G, MoveValidatorNames.ClickHeroCardMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.ClickHeroCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                let isValid = false;
                const hero: IHeroCard | undefined = G.heroes[id];
                if (hero !== undefined) {
                    const validators: IValidatorsConfig | undefined = hero.validators;
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
                    throw new Error(`В массиве карт героев отсутствует герой ${id}.`);
                }
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return DiscardCardFromBoardProfit(G, ctx, MoveValidatorNames.DiscardCardMoveValidator) as
                    IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<OptionalSuitPropertyTypes<number[]>>[`args`],
                suitNamesArray: SuitTypes[] = [];
            let suit: SuitTypes;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNamesArray.push(suit);
                }
            }
            const suitName: SuitTypes | undefined =
                suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)];
            if (suitName !== undefined) {
                const moveArgumentForSuit: number[] | undefined = moveArguments[suitName];
                if (moveArgumentForSuit !== undefined) {
                    const moveArgument: number | undefined =
                        moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
                    if (moveArgument !== undefined) {
                        return {
                            suit: suitName,
                            cardId: moveArgument,
                        };
                    } else {
                        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
                    }
                } else {
                    throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
                }
            } else {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
        },
        moveName: MoveNames.DiscardCardMove,
        validate: (): boolean => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number):
            IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`] => {
            if (G !== undefined && ctx !== undefined && playerId !== undefined) {
                return DiscardSuitCardFromPlayerBoardProfit(G, ctx,
                    MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator, playerId) as
                    IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'playerId' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveSuitCardPlayerIdArguments>[`args`],
                player: IPublicPlayer | undefined = G.publicPlayers[moveArguments.playerId];
            if (player !== undefined) {
                const cardFirst: PlayerCardsType | undefined = player.cards[moveArguments.suit][0];
                if (cardFirst !== undefined) {
                    let minCardIndex = 0,
                        minCardValue: number | null = cardFirst.points;
                    moveArguments.cards.forEach((value: number, index: number) => {
                        const card: PlayerCardsType | undefined = player.cards[moveArguments.suit][value];
                        if (card !== undefined) {
                            const cardPoints: number | null = card.points;
                            if (cardPoints !== null && minCardValue !== null) {
                                if (cardPoints < minCardValue) {
                                    minCardIndex = index;
                                    minCardValue = cardPoints;
                                }
                            } else {
                                throw new Error(`Фракция должна иметь параметр 'points'.`);
                            }
                        } else {
                            throw new Error(`В массиве карт игрока во фракции ${moveArguments.suit} отсутствует карта ${value}.`);
                        }
                    });
                    const cardIndex: number | undefined = moveArguments.cards[minCardIndex];
                    if (cardIndex !== undefined) {
                        return {
                            playerId: moveArguments.playerId,
                            suit: moveArguments.suit,
                            cardId: cardIndex,
                        };
                    } else {
                        throw new Error(`В массиве аргументов для 'cardId' отсутствует значение ${minCardIndex}.`);
                    }
                } else {
                    throw new Error(`В массиве карт игрока во фракции ${moveArguments.suit} отсутствует первая карта.`);
                }
            } else {
                throw new Error(`В массиве игроков отсутствует игрок ${moveArguments.playerId}.`);
            }
        },
        moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: (): boolean => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return PickDiscardCardProfit(G, ctx, MoveValidatorNames.PickDiscardCardMoveValidator) as
                    IMoveArgumentsStage<number[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: number | undefined = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.PickDiscardCardMove,
        validate: (): boolean => true,
    },
    PlaceOlwinCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return PlaceCardsProfit(G, ctx, MoveValidatorNames.PlaceOlwinCardMoveValidator) as
                    IMoveArgumentsStage<SuitTypes[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: SuitTypes | undefined =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.PlaceOlwinCardMove,
        validate: (): boolean => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return PlaceCardsProfit(G, ctx, MoveValidatorNames.PlaceThrudHeroMoveValidator) as
                    IMoveArgumentsStage<SuitTypes[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: SuitTypes | undefined =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.PlaceThrudHeroMove,
        validate: (): boolean => true,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] => {
            if (G !== undefined && ctx !== undefined) {
                return UpgradeCoinVidofnirVedrfolnirProfit(G, ctx,
                    MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) as
                    IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`];
            } else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`],
                moveArgument: IMoveCoinsArguments | undefined =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument !== undefined) {
                return moveArgument;
            } else {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
        },
        moveName: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player !== undefined) {
                    return player.stack[0]?.config?.coinId !== id.coinId && CoinUpgradeValidation(G, ctx, id);
                } else {
                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                }
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
 * @param value Значение для валидации.
 * @param values Массив значений, допустимых для прохождения валидации.
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
