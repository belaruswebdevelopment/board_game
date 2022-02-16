import { Ctx } from "boardgame.io";
import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { isCardNotActionAndNotNull } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { IConfig } from "./typescript/action_interfaces";
import { IBuffs } from "./typescript/buff_interfaces";
import { CampCardTypes, CampDeckCardTypes } from "./typescript/camp_card_types";
import { DeckCardTypes, PickedCardType, PlayerCardsType, TavernCardTypes } from "./typescript/card_types";
import { CoinType } from "./typescript/coin_types";
import { ConfigNames, MoveNames, Phases, RusCardTypes, ValidatorNames } from "./typescript/enums";
import { IMyGameState } from "./typescript/game_data_interfaces";
import { IValidatorsConfig } from "./typescript/hero_validator_interfaces";
import { ICurrentMoveArgumentsStage, ICurrentMoveCoinsArguments, ICurrentMoveSuitCardCurrentId, ICurrentMoveSuitCardIdArguments, ICurrentMoveSuitCardPlayerCurrentId, ICurrentMoveSuitCardPlayerIdArguments } from "./typescript/move_interfaces";
import { IMoveBy, IMoveByBrisingamensEndGameOptions, IMoveByEndTierOptions, IMoveByEnlistmentMercenariesOptions, IMoveByGetDistinctionsOptions, IMoveByGetMjollnirProfitOptions, IMoveByPickCardsOptions, IMoveByPlaceCoinsOptions, IMoveByPlaceCoinsUlineOptions, IMoveValidator, IMoveValidators } from "./typescript/move_validator_interfaces";
import { MoveValidatorGetRangeTypes, ValidMoveIdParamTypes } from "./typescript/move_validator_types";
import { IPublicPlayer } from "./typescript/player_interfaces";

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
export const CoinUpgradeValidation = (G: IMyGameState, ctx: Ctx, coinData: ICurrentMoveCoinsArguments): boolean => {
    if (coinData.type === "hand") {
        const handCoinPosition: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin: CoinType, index: number): boolean =>
                coin === null && index <= coinData.coinId).length;
        if (!G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter((coin: CoinType): boolean => coin !== null)[handCoinPosition - 1]?.isTriggerTrading) {
            return true;
        }
    } else {
        if (!G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[coinData.coinId]?.isTriggerTrading) {
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
export const IsValidMove = (G: IMyGameState, ctx: Ctx, stage: string, id?: ValidMoveIdParamTypes): boolean => {
    const validator: IMoveValidator | undefined = GetValidator(ctx.phase as keyof IMoveBy, stage);
    let isValid = false;
    if (validator !== undefined) {
        if (typeof id === `number`) {
            isValid = ValidateByValues<number>(id, validator.getRange(G, ctx) as number[]);
        } else if (typeof id === `string`) {
            isValid = ValidateByValues<string>(id,
                validator.getRange(G, ctx) as string[]);
        } else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx) as
                    ICurrentMoveCoinsArguments[]);
            } else if (`playerId` in id) {
                isValid = ValidateByObjectSuitCardIdPlayerIdValues(id,
                    validator.getRange(G, ctx, id.playerId) as ICurrentMoveSuitCardPlayerIdArguments);
            } else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange(G, ctx) as
                    ICurrentMoveSuitCardIdArguments);
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

export const GetValidator = (phase: keyof IMoveBy, stage: string) => {
    let validator: IMoveValidator | undefined;
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
            break;
    }
    return validator;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators: IMoveValidators = {
    // TODO Add all validators to all moves
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G?: IMyGameState): ICurrentMoveArgumentsStage<number[][]>[`args`] => {
            let moveMainArgs: ICurrentMoveArgumentsStage<number[][]>[`args`] = [];
            if (G !== undefined) {
                moveMainArgs = G.botData.allCoinsOrder;
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const allCoinsOrder: ICurrentMoveArgumentsStage<number[][]>[`args`] = currentMoveArguments as number[][],
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
                                allCoinsOrder[i].filter((coinIndex: number): boolean =>
                                    handCoins[coinIndex] !== null
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    && handCoins[coinIndex]!.value > maxCoin.value).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition = handCoins.filter((coin: CoinType): boolean =>
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                coin !== null && coin.value < minCoin.value).length <= 1;
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
            // TODO FIx it!
            return [];
        },
        moveName: MoveNames.BotsPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    ClickBoardCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.boardCoins.length; j++) {
                    if (player.selectedCoin !== undefined || (player.selectedCoin === undefined
                        && player.boardCoins[j] !== null)) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickBoardCoinMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                isValid = player.selectedCoin !== undefined || (player.selectedCoin === undefined
                    && player.boardCoins[id] !== null);
            }
            return isValid;
        },
    },
    ClickCampCardMoveValidator: {
        getRange: (G?: IMyGameState): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined) {
                for (let j = 0; j < G.campNum; j++) {
                    const campCard: CampCardTypes = G.camp[j];
                    if (campCard !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCampCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                isValid = G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                    || (!G.campPicked
                        && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs
                            .find((buff: IBuffs): boolean => buff.goCamp !== undefined))));
            }
            return isValid;
        },
    },
    ClickCardMoveValidator: {
        getRange: (G?: IMyGameState): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined) {
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
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
                    if (isCardNotActionAndNotNull(tavernCard) && isCardNotActionAndNotNull(uniqueCard)
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
            // TODO FIX it!
            return -1;
        },
        moveName: MoveNames.ClickCardMove,
        validate: (): boolean => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            for (let j = 0; j < 3; j++) {
                moveMainArgs.push(j);
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCardToPickDistinctionMove,
        validate: (): boolean => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<string[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<string[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.distinctions[suit] === ctx.currentPlayer) {
                            if (ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos]) {
                                moveMainArgs.push(suit);
                                break;
                            }
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<string[]>[`args`] = currentMoveArguments as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickDistinctionCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `string`) {
                isValid = Object.keys(G.distinctions).includes(id)
                    && G.distinctions[id] === ctx.currentPlayer
                    && ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos];
            }
            return isValid;
        }
    },
    ClickHandCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (player.handCoins[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandCoinMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null;
            }
            return isValid;
        },
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (player.handCoins[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandCoinUlineMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                isValid = player.selectedCoin === undefined && player.handCoins[id] !== null;
            }
            return isValid;
        },
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (player.handCoins[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandTradingCoinUlineMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                isValid = player.selectedCoin === undefined && player.handCoins[id] !== null;
            }
            return isValid;
        },
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`] = {};
            if (G !== undefined && ctx !== undefined) {
                for (let i = 0; ; i++) {
                    let isExit = true;
                    for (const suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                            if (player.cards[suit][i] !== undefined) {
                                isExit = false;
                                if (player.cards[suit][i].type !==
                                    RusCardTypes.HERO) {
                                    moveMainArgs[suit] = [];
                                    moveMainArgs[suit].push(i);
                                }
                            }
                        }
                    }
                    if (isExit) {
                        break;
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`] =
                currentMoveArguments as ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`],
                suitNames: string[] = [];
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNames.push(suit);
                }
            }
            suitName = suitNames[Math.floor(Math.random() * suitNames.length)];
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        moveName: MoveNames.DiscardCardFromPlayerBoardMove,
        validate: (): boolean => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G?: IMyGameState): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined) {
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.DiscardCard2PlayersMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            let isValid = false;
            if (ctx !== undefined) {
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1];
            }
            return isValid;
        },
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                const mercenaries: CampDeckCardTypes[] =
                    G.publicPlayers[Number(ctx.currentPlayer)].campCards
                        .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY);
                for (let j = 0; j < mercenaries.length; j++) {
                    moveMainArgs.push(j);
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.GetEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<string[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<string[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<string[]>[`args`] = currentMoveArguments as string[],
                totalSuitsRanks: number[] = [];
            for (let j = 0; j < moveArguments.length; j++) {
                totalSuitsRanks.push(G.publicPlayers[Number(ctx.currentPlayer)]
                    .cards[moveArguments[j]].reduce(TotalRank, 0) * 2);
            }
            return moveArguments[totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks))];
        },
        moveName: MoveNames.GetMjollnirProfitMove,
        validate: (): boolean => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: (): ICurrentMoveArgumentsStage<null>[`args`] => null,
        getValue: (): ValidMoveIdParamTypes => null,
        moveName: MoveNames.PassEnlistmentMercenariesMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length;
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            }
            return isValid;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<string[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<string[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
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
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<string[]>[`args`] = currentMoveArguments as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<string[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<string[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        moveMainArgs.push(suit);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<string[]>[`args`] = currentMoveArguments as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceYludHeroMove,
        validate: (): boolean => true,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: (): ICurrentMoveArgumentsStage<null>[`args`] => null,
        getValue: (): ValidMoveIdParamTypes => null,
        moveName: MoveNames.StartEnlistmentMercenariesMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length;
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            }
            return isValid;
        },
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)
                        && player.handCoins[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.AddCoinToPouchMove,
        validate: (): boolean => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                for (let j = 0; j < G.campNum; j++) {
                    if (G.camp[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes): number => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCampCardHoldaMove,
        validate: (): boolean => true,
    },
    ClickCoinToUpgradeMoveValidator: {
        // TODO Rework if Uline in play or no 1 coin in game (& add param isInitial?)
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`] =
                [] as ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`];
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                    handCoins = player.handCoins.filter((coin: CoinType): boolean => coin !== null);
                let handCoinIndex = -1;
                for (let j = 0; j < player.boardCoins.length; j++) {
                    // TODO Check .? for all coins!!! and delete AS
                    if (player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)
                        && player.boardCoins[j] === null) {
                        handCoinIndex++;
                        const handCoinId: number = player.handCoins.findIndex((coin: CoinType): boolean =>
                            coin?.value === handCoins[handCoinIndex]?.value
                            && coin?.isInitial === handCoins[handCoinIndex]?.isInitial);
                        if (player.handCoins[handCoinId] && !G.publicPlayers[Number(ctx.currentPlayer)]
                            .handCoins[handCoinId]?.isTriggerTrading) {
                            moveMainArgs.push({
                                coinId: j,
                                type: `hand`,
                                isInitial: handCoins[handCoinIndex]?.isInitial as boolean,
                            });
                        }
                    } else if (player.boardCoins[j] && !player.boardCoins[j]?.isTriggerTrading) {
                        moveMainArgs.push({
                            coinId: j,
                            type: `board`,
                            isInitial: player.boardCoins[j]?.isInitial as boolean,
                        });
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            // TODO Check add TYPE!?
            const moveArguments: ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                isValid = CoinUpgradeValidation(G, ctx, id);
            }
            return isValid;
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G?: IMyGameState): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined) {
                for (let i = 0; i < G.heroes.length; i++) {
                    if (G.heroes[i].active) {
                        moveMainArgs.push(i);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHeroCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
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
            }
            return isValid;
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`] = {};
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                    config: IConfig | undefined = player.stack[0].config,
                    pickedCard: PickedCardType = player.pickedCard;
                if (config !== undefined) {
                    for (const suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            if (suit !== config.suit
                                && !(G.drawProfit === ConfigNames.DagdaAction
                                    && player.actionsNum === 1 && pickedCard !== null
                                    && `suit` in pickedCard && suit === pickedCard.suit)) {
                                const last: number = player.cards[suit].length - 1;
                                if (last !== -1 && player.cards[suit][last].type !==
                                    RusCardTypes.HERO) {
                                    moveMainArgs[suit] = [];
                                    moveMainArgs[suit].push(last);
                                }
                            }
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`] =
                currentMoveArguments as ICurrentMoveArgumentsStage<ICurrentMoveSuitCardIdArguments>[`args`];
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitName = suit;
                }
            }
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        moveName: MoveNames.DiscardCardMove,
        validate: (): boolean => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number):
            ICurrentMoveArgumentsStage<ICurrentMoveSuitCardPlayerIdArguments>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<ICurrentMoveSuitCardPlayerIdArguments>[`args`] = {
                playerId: playerId as number,
                suit: ``,
                cards: [],
            };
            if (G !== undefined && ctx !== undefined && playerId !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[playerId],
                    config: IConfig | undefined = player.stack[0].config;
                if (config !== undefined && config.suit !== undefined) {
                    moveMainArgs.suit = config.suit;
                    if (player.stack[0] !== undefined) {
                        for (let i = 0; i < player.cards[config.suit].length; i++) {
                            if (player.cards[config.suit][i] !== undefined) {
                                if (player.cards[config.suit][i].type !== RusCardTypes.HERO) {
                                    moveMainArgs.cards.push(i);
                                }
                            }
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<ICurrentMoveSuitCardPlayerIdArguments>[`args`] =
                currentMoveArguments as ICurrentMoveArgumentsStage<ICurrentMoveSuitCardPlayerIdArguments>[`args`],
                player: IPublicPlayer = G.publicPlayers[moveArguments.playerId],
                minValue: number = Math.min(
                    ...player.cards[moveArguments.suit].filter((card: PlayerCardsType): boolean =>
                        card.type !== RusCardTypes.HERO).map((card: PlayerCardsType): number =>
                            card.points as number)),
                minCardIndex: number =
                    player.cards[moveArguments.suit].findIndex((card: PlayerCardsType): boolean =>
                        card.type !== RusCardTypes.HERO && card.points === minValue);
            if (minCardIndex !== -1) {
                // TODO ?!
            }
            return {
                playerId: moveArguments.playerId,
                suit: moveArguments.suit,
                cardId: moveArguments.cards[minCardIndex],
            };
        },
        moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum?
        validate: (): boolean => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G?: IMyGameState): ICurrentMoveArgumentsStage<number[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<number[]>[`args`] = [];
            if (G !== undefined) {
                for (let j = 0; j < G.discardCardsDeck.length; j++) {
                    moveMainArgs.push(j);
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PickDiscardCardMove,
        validate: (): boolean => true,
    },
    PlaceOlwinCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<string[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<string[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<string[]>[`args`] = currentMoveArguments as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceOlwinCardMove,
        validate: (): boolean => true, // TODO Check it
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<string[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<string[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<string[]>[`args`] = currentMoveArguments as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceThrudHeroMove,
        validate: (): boolean => true, // TODO Check it
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        // TODO Rework if Uline in play or no 1 coin in game(& add param isInitial ?)
        getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`] => {
            const moveMainArgs: ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`] = [];
            if (G !== undefined && ctx !== undefined) {
                const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                    config: IConfig | undefined = player.stack[0].config;
                if (config !== undefined) {
                    for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
                        const coin: CoinType = player.boardCoins[j];
                        if (coin !== null) {
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
            }
            return moveMainArgs;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as ICurrentMoveArgumentsStage<ICurrentMoveCoinsArguments[]>[`args`];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config?.coinId !== id.coinId
                    && CoinUpgradeValidation(G, ctx, id);
            }
            return isValid;
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

const ValidateByObjectCoinIdTypeIsInitialValues = (value: ICurrentMoveCoinsArguments,
    values: ICurrentMoveCoinsArguments[]): boolean => values.findIndex((coin: ICurrentMoveCoinsArguments) =>
        value.coinId === coin.coinId && value.type === coin.type && value.isInitial === coin.isInitial) !== -1;

const ValidateByObjectSuitCardIdValues = (value: ICurrentMoveSuitCardCurrentId, values: ICurrentMoveSuitCardIdArguments)
    : boolean => values[value.suit].includes(value.cardId);

const ValidateByObjectSuitCardIdPlayerIdValues = (value: ICurrentMoveSuitCardPlayerCurrentId,
    values: ICurrentMoveSuitCardPlayerIdArguments): boolean => values.suit === value.suit && values.playerId === value.playerId && values.cards.includes(value.cardId);
