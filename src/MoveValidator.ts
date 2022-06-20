import type { Ctx } from "boardgame.io";
import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { CheckIfSoloBotMustTakeCardToPickHero, CheckIfSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard, SoloBotMustTakeRandomCard } from "./bot_logic/SoloBotCardLogic";
import { IsMercenaryCampCard } from "./Camp";
import { IsCoin } from "./Coin";
import { IsDwarfCard } from "./Dwarf";
import { HasLowestPriority } from "./helpers/PriorityHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { CoinTypeNames, MoveNames, MoveValidatorNames, Phases, PickCardValidatorNames, Stages, SuitNames } from "./typescript/enums";
import type { CampDeckCardTypes, CanBeUndef, DeckCardTypes, IBuffs, IHeroCard, IMoveArgumentsStage, IMoveBy, IMoveByBrisingamensEndGameOptions, IMoveByChooseDifficultySoloModeOptions, IMoveByEndTierOptions, IMoveByEnlistmentMercenariesOptions, IMoveByGetDistinctionsOptions, IMoveByGetMjollnirProfitOptions, IMoveByPickCardsOptions, IMoveByPlaceCoinsOptions, IMoveByPlaceCoinsUlineOptions, IMoveCardIdPlayerIdArguments, IMoveCardPlayerCurrentId, IMoveCoinsArguments, IMoveSuitCardCurrentId, IMoveValidator, IMoveValidators, IMyGameState, IPlayer, IPublicPlayer, IValidatorsConfig, MoveValidatorGetRangeTypes, MythologicalCreatureDeckCardTypes, PlayerCardTypes, PublicPlayerCoinTypes, SuitPropertyTypes, SuitTypes, TavernCardTypes, ValidMoveIdParamTypes } from "./typescript/interfaces";
import { DrawCamp, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { DrawDifficultyLevelForSoloModeUI, DrawHeroesForSoloModeUI, ExplorerDistinctionProfit } from "./ui/ProfitUI";

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
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[],
        boardCoins: PublicPlayerCoinTypes[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
        boardCoins = privatePlayer.boardCoins;
    } else {
        handCoins = player.handCoins;
        boardCoins = player.boardCoins;
    }
    if (coinData.type === CoinTypeNames.Hand) {
        const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[coinData.coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinData.coinId}'.`);
        }
        if (handCoin === null) {
            throw new Error(`Выбранная для улучшения монета игрока с id '${ctx.currentPlayer}' в руке с id '${coinData.coinId}' не может отсутствовать там.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`Монета с id '${coinData.coinId}' в руке текущего игрока с id '${ctx.currentPlayer}' не может быть закрытой для него.`);
        }
        if (!handCoin.isTriggerTrading) {
            return true;
        }
    } else if (coinData.type === CoinTypeNames.Board) {
        const boardCoin: CanBeUndef<PublicPlayerCoinTypes> = boardCoins[coinData.coinId];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе отсутствует монета с id '${coinData.coinId}'.`);
        }
        if (boardCoin === null) {
            throw new Error(`Выбранная для улучшения монета игрока с id '${ctx.currentPlayer}' на столе с id '${coinData.coinId}' не может отсутствовать там.`);
        }
        if (!IsCoin(boardCoin)) {
            throw new Error(`Монета с id '${coinData.coinId}' на столе текущего игрока с id '${ctx.currentPlayer}' не может быть закрытой для него.`);
        }
        if (!boardCoin.isTriggerTrading) {
            return true;
        }
    } else {
        throw new Error(`Не существует типа монеты - '${coinData.type}'.`);
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
 * @param G
 * @param ctx
 * @param stage Стадия.
 * @param id Данные для валидации.
 * @returns Валидный ли мув.
 */
export const IsValidMove = (G: IMyGameState, ctx: Ctx, stage: Stages, id?: ValidMoveIdParamTypes): boolean => {
    const validator: IMoveValidator | null = GetValidator(ctx.phase as Phases, stage);
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
                    validator.getRange(G, ctx, id.playerId) as IMoveCardIdPlayerIdArguments);
            } else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange(G, ctx) as
                    Partial<SuitPropertyTypes<number[]>>);
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

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param phase Фаза игры.
 * @param stage Стадия игры.
 * @returns
 */
export const GetValidator = (phase: Phases, stage: Stages): IMoveValidator | null => {
    let validator: IMoveValidator | null;
    switch (phase) {
        case Phases.ChooseDifficultySoloMode:
            validator = moveBy[phase][stage as keyof IMoveByChooseDifficultySoloModeOptions];
            break;
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
    // TODO Add validators for solo bot moves!
    ClickBoardCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickBoardCoinMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickBoardCoinMove,
        validate: (): boolean => true,
    },
    ClickCampCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawCamp(G, ctx, MoveValidatorNames.ClickCampCardMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCampCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
            }
            return G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                || (!G.campPicked && player.buffs.find((buff: IBuffs): boolean =>
                    buff.goCamp !== undefined) !== undefined));
        },
    },
    ClickCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawTaverns(G, ctx, MoveValidatorNames.ClickCardMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            // TODO Get MythologicalCreature cards for bots...
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[];
            if (!G.solo || (G.solo && ctx.currentPlayer === `0`)) {
                const uniqueArr: (DeckCardTypes | MythologicalCreatureDeckCardTypes)[] = [],
                    currentTavern: CanBeUndef<TavernCardTypes[]> = G.taverns[G.currentTavern];
                if (currentTavern === undefined) {
                    throw new Error(`В массиве таверн отсутствует текущая таверна с id '${G.currentTavern}'.`);
                }
                let flag = true;
                for (let i = 0; i < moveArguments.length; i++) {
                    const moveArgument: CanBeUndef<number> = moveArguments[i];
                    if (moveArgument === undefined) {
                        throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
                    }
                    const tavernCard: CanBeUndef<TavernCardTypes> = currentTavern[moveArgument];
                    if (tavernCard === undefined) {
                        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
                    }
                    if (tavernCard === null) {
                        // TODO Add Error that NULL can't be moveArguments value
                        continue;
                    }
                    if (currentTavern.some((card: TavernCardTypes): boolean =>
                        CompareCards(tavernCard, card) < 0)) {
                        continue;
                    }
                    const isCurrentCardWorse: boolean =
                        EvaluateCard(G, ctx, tavernCard, moveArgument, currentTavern) < 0,
                        isExistCardNotWorse: boolean =
                            currentTavern.some((card: TavernCardTypes): boolean => (card !== null)
                                && (EvaluateCard(G, ctx, tavernCard, moveArgument,
                                    currentTavern) >= 0));
                    if (isCurrentCardWorse && isExistCardNotWorse) {
                        continue;
                    }
                    const uniqueArrLength: number = uniqueArr.length;
                    for (let j = 0; j < uniqueArrLength; j++) {
                        const uniqueCard: CanBeUndef<DeckCardTypes | MythologicalCreatureDeckCardTypes> = uniqueArr[j];
                        if (uniqueCard === undefined) {
                            throw new Error(`В массиве уникальных карт отсутствует карта с id '${j}'.`);
                        }
                        if (IsDwarfCard(tavernCard)
                            && IsDwarfCard(uniqueCard)
                            && tavernCard.suit === uniqueCard.suit
                            && CompareCards(tavernCard, uniqueCard) === 0) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        uniqueArr.push(tavernCard);
                        return moveArgument;
                    }
                    flag = true;
                }
            } else if (G.solo && ctx.currentPlayer === `1`) {
                let moveArgument: CanBeUndef<number>;
                moveArgument = CheckIfSoloBotMustTakeCardToPickHero(G, moveArguments);
                if (moveArgument === undefined) {
                    moveArgument = CheckIfSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard(G, moveArguments);
                }
                // Todo Think about picking Royal Offering if other cards not LeastPresentOnPlayerBoard...
                if (moveArgument === undefined) {
                    moveArgument = SoloBotMustTakeRandomCard(G, moveArguments);
                }
                if (moveArgument !== undefined) {
                    return moveArgument;
                }
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: MoveNames.ClickCardMove,
        validate: (): boolean => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return ExplorerDistinctionProfit(G, ctx,
                MoveValidatorNames.ClickCardToPickDistinctionMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCardToPickDistinctionMove,
        validate: (): boolean => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawDistinctions(G, ctx, MoveValidatorNames.ClickDistinctionCardMoveValidator) as
                IMoveArgumentsStage<SuitTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: CanBeUndef<SuitTypes> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickDistinctionCardMove,
        validate: (): boolean => true,
    },
    ClickHandCoinMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandCoinMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHandCoinMove,
        validate: (): boolean => true,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx,
                MoveValidatorNames.ClickHandCoinUlineMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHandCoinUlineMove,
        validate: (): boolean => true,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx,
                MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHandTradingCoinUlineMove,
        validate: (): boolean => true,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx,
                MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator, null) as
                IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`],
                suitNames: SuitTypes[] = [];
            let suit: SuitTypes;
            for (suit in moveArguments) {
                suitNames.push(suit);
            }
            const suitName: CanBeUndef<SuitTypes> = suitNames[Math.floor(Math.random() * suitNames.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция '${suitName}' для сброса карты.`);
            }
            const moveArgumentForSuit: CanBeUndef<number[]> = moveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
            }
            const moveArgument: CanBeUndef<number> =
                moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: MoveNames.DiscardCardFromPlayerBoardMove,
        validate: (): boolean => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawTaverns(G, ctx, MoveValidatorNames.DiscardCard2PlayersMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.DiscardCard2PlayersMove,
        validate: (): boolean => true,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.GetEnlistmentMercenariesMoveValidator,
                null) as IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.GetEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.GetMjollnirProfitMoveValidator,
                null) as IMoveArgumentsStage<SuitTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                totalSuitsRanks: number[] = [];
            for (let j = 0; j < moveArguments.length; j++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
                }
                const moveArgumentI: CanBeUndef<SuitTypes> = moveArguments[j];
                if (moveArgumentI === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${j}'.`);
                }
                totalSuitsRanks.push(player.cards[moveArgumentI]
                    .reduce(TotalRank, 0) * 2);
            }
            const index: number = totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks));
            if (index === -1) {
                throw new Error(`Должна быть хотя бы одна фракция с максимальным количеством шевронов.`);
            }
            const moveArgument: CanBeUndef<SuitTypes> = moveArguments[index];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${index}'.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.GetMjollnirProfitMove,
        validate: (): boolean => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: (): IMoveArgumentsStage<null>[`args`] => null,
        getValue: (): ValidMoveIdParamTypes => null,
        moveName: MoveNames.PassEnlistmentMercenariesMove,
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
            }
            const mercenariesCount = player.campCards.filter((card: CampDeckCardTypes): boolean =>
                IsMercenaryCampCard(card)).length;
            return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator,
                null) as IMoveArgumentsStage<SuitTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: CanBeUndef<SuitTypes> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceYludHeroMoveValidator,
                null) as IMoveArgumentsStage<SuitTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: CanBeUndef<SuitTypes> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
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
    // Bots
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G?: IMyGameState): IMoveArgumentsStage<number[][]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            return G.botData.allCoinsOrder;
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
                maxResultForCoins: number = Math.max(...resultsForCoins),
                deck: CanBeUndef<DeckCardTypes[]> = G.secret.decks[G.secret.decks.length - 1];
            if (deck === undefined) {
                throw new Error(`В массиве дек карт отсутствует дека '${G.secret.decks.length - 1}' эпохи.`);
            }
            const tradingProfit: number = deck.length > 9 ? 1 : 0;
            let [positionForMinCoin, positionForMaxCoin]: number[] = [-1, -1];
            if (minResultForCoins <= 0) {
                positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
            }
            if (maxResultForCoins >= 0) {
                positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
            }
            // TODO Check it bot can't play in multiplayer now...
            const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
                privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
            }
            if (privatePlayer === undefined) {
                throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
            }
            let handCoins: PublicPlayerCoinTypes[];
            if (G.multiplayer) {
                handCoins = privatePlayer.handCoins;
            } else {
                handCoins = player.handCoins;
            }
            for (let i = 0; i < allCoinsOrder.length; i++) {
                const allCoinsOrderI: CanBeUndef<number[]> = allCoinsOrder[i];
                if (allCoinsOrderI === undefined) {
                    throw new Error(`В массиве выкладки монет отсутствует выкладка '${i}'.`);
                }
                const hasTrading: boolean = allCoinsOrderI.some((coinId: number): boolean => {
                    const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[coinId];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
                    }
                    if (handCoin !== null && !IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${coinId}'.`);
                    }
                    if (IsCoin(handCoin) && handCoin.isOpened) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${coinId}'.`);
                    }
                    return Boolean(handCoin?.isTriggerTrading);
                });
                // TODO How tradingProfit can be < 0?
                if (tradingProfit < 0) {
                    if (hasTrading) {
                        continue;
                    }
                    return allCoinsOrderI;
                } else if (tradingProfit > 0) {
                    const isEveryCoinsInHands: boolean =
                        handCoins.every((coin: PublicPlayerCoinTypes, index: number): boolean => {
                            if (coin !== null && !IsCoin(coin)) {
                                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                            }
                            if (IsCoin(coin) && coin.isOpened) {
                                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${index}'.`);
                            }
                            return IsCoin(coin);
                        });
                    if (!hasTrading && isEveryCoinsInHands) {
                        continue;
                    }
                    if (positionForMaxCoin === undefined) {
                        throw new Error(`Отсутствуют значения выкладки для максимальной монеты.`);
                    }
                    if (positionForMinCoin === undefined) {
                        throw new Error(`Отсутствуют значения выкладки для минимальной монеты.`);
                    }
                    const hasPositionForMaxCoin: boolean = positionForMaxCoin !== -1,
                        hasPositionForMinCoin: boolean = positionForMinCoin !== -1,
                        coinsOrderPositionForMaxCoin: CanBeUndef<number> = allCoinsOrderI[positionForMaxCoin],
                        coinsOrderPositionForMinCoin: CanBeUndef<number> = allCoinsOrderI[positionForMinCoin];
                    if (coinsOrderPositionForMaxCoin !== undefined && coinsOrderPositionForMinCoin !== undefined) {
                        const maxCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[coinsOrderPositionForMaxCoin],
                            minCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[coinsOrderPositionForMinCoin];
                        if (maxCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (maxCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может не быть максимальной монеты с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может не быть минимальной монеты с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (!IsCoin(maxCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может быть закрыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (!IsCoin(minCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${ctx.currentPlayer}' не может быть закрыта минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (IsCoin(maxCoin) && maxCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (IsCoin(minCoin) && minCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        let isTopCoinsOnPosition = false,
                            isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition = allCoinsOrderI.filter((coinIndex: number): boolean => {
                                const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[coinIndex];
                                if (handCoin === undefined) {
                                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinIndex}'.`);
                                }
                                if (handCoin !== null && !IsCoin(handCoin)) {
                                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                                }
                                if (IsCoin(handCoin) && handCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${coinIndex}'.`);
                                }
                                return IsCoin(handCoin) && handCoin.value > maxCoin.value;
                            }).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition =
                                handCoins.filter((coin: PublicPlayerCoinTypes, index: number): boolean => {
                                    if (coin !== null && !IsCoin(coin)) {
                                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                                    }
                                    if (IsCoin(coin) && coin.isOpened) {
                                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${index}'.`);
                                    }
                                    return IsCoin(coin) && coin.value < minCoin.value;
                                }).length <= 1;
                        }
                        if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                            return allCoinsOrderI;
                            //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                        }
                    }
                } else {
                    // TODO Why if trading profit === 0 we not checked min max coins positions!?
                    return allCoinsOrderI;
                }
            }
            throw new Error(`Отсутствует вариант выкладки монет для ботов.`);
        },
        moveName: MoveNames.BotsPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    // Solo Bot
    SoloBotPlaceAllCoinsMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => currentMoveArguments as number[],
        moveName: MoveNames.SoloBotPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    SoloBotClickHeroCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawHeroesForSoloBotUI(G, ctx,
                MoveValidatorNames.SoloBotClickHeroCardMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.SoloBotClickHeroCardMove,
        validate: (): boolean => true,
    },
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawDifficultyLevelForSoloModeUI(G, ctx,
                MoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ChooseDifficultyLevelForSoloModeMove,
        validate: (): boolean => true,
    },
    ChooseHeroesForSoloModeMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawHeroesForSoloModeUI(G, ctx,
                MoveValidatorNames.ChooseHeroesForSoloModeMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ChooseHeroForDifficultySoloModeMove,
        validate: (): boolean => true,
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.AddCoinToPouchMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.AddCoinToPouchMove,
        validate: (): boolean => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawCamp(G, ctx, MoveValidatorNames.ClickCampCardHoldaMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes): number => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCampCardHoldaMove,
        validate: (): boolean => true,
    },
    PickConcreteCoinToUpgradeMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return (DrawPlayersBoardsCoins(G, ctx,
                MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) as
                IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]).concat(DrawPlayersHandsCoins(G, ctx,
                    MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) as
                    IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]);
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`],
                moveArgument: CanBeUndef<IMoveCoinsArguments> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickConcreteCoinToUpgradeMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `object`) {
                throw new Error(`Function param 'id' isn't object.`);
            }
            if (id === null) {
                throw new Error(`Function param 'id' is null.`);
            }
            if (!(`coinId` in id)) {
                throw new Error(`Function param 'id' hasn't 'coinId'.`);
            }
            return CoinUpgradeValidation(G, ctx, id);
        },
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return (DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator) as
                IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]).concat(DrawPlayersHandsCoins(G, ctx,
                    MoveValidatorNames.ClickCoinToUpgradeMoveValidator) as
                    IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`]);
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`];
            let moveArgument: CanBeUndef<IMoveCoinsArguments>;
            if (G.solo && ctx.currentPlayer === `1`) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
                }
                let minValue = 0,
                    coinId = 0;
                for (let i = 0; i < moveArguments.length; i++) {
                    const currentMoveArgument: IMoveCoinsArguments | undefined = moveArguments[i];
                    if (currentMoveArgument === undefined) {
                        throw new Error(`Отсутствует необходимый аргумент мува для бота с id '${i}'.`);
                    }
                    const boardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[currentMoveArgument.coinId];
                    if (boardCoin === undefined) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе отсутствует монета с id '${currentMoveArgument.coinId}'.`);
                    }
                    if (boardCoin === null) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может отсутствовать монета с id '${currentMoveArgument.coinId}'.`);
                    }
                    if (!IsCoin(boardCoin)) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может быть закрытой для него монета с id '${ctx.currentPlayer}'.`);
                    }
                    if (minValue === 0 || boardCoin.value < minValue) {
                        minValue = boardCoin.value;
                        coinId = i;
                    }
                }
                if (minValue !== 0) {
                    moveArgument = moveArguments[coinId];
                } else {
                    // TODO What about only `0` coin is opened?! Must return Null and can't update coin?
                }
            } else {
                moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            }
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `object`) {
                throw new Error(`Function param 'id' isn't object.`);
            }
            if (id === null) {
                throw new Error(`Function param 'id' is null.`);
            }
            if (!(`coinId` in id)) {
                throw new Error(`Function param 'id' hasn't field 'coinId'.`);
            }
            return CoinUpgradeValidation(G, ctx, id);
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawHeroes(G, ctx, MoveValidatorNames.ClickHeroCardMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.ClickHeroCardMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `number`) {
                throw new Error(`Function param 'id' isn't number.`);
            }
            let isValid = false;
            const hero: CanBeUndef<IHeroCard> = G.heroes[id];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${id}'.`);
            }
            const validators: CanBeUndef<IValidatorsConfig> = hero.validators;
            if (validators !== undefined) {
                for (const validator in validators) {
                    switch (validator) {
                        case PickCardValidatorNames.Conditions:
                            isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                            break;
                        case PickCardValidatorNames.DiscardCard:
                            isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                            break;
                        default:
                            isValid = true;
                            break;
                    }
                }
            } else {
                isValid = true;
            }
            return isValid;
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardCardMoveValidator,
                null) as IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<Partial<SuitPropertyTypes<number[]>>>[`args`],
                suitNamesArray: SuitTypes[] = [];
            let suit: SuitTypes;
            for (suit in moveArguments) {
                suitNamesArray.push(suit);
            }
            const suitName: CanBeUndef<SuitTypes> =
                suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
            const moveArgumentForSuit: CanBeUndef<number[]> = moveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
            }
            const moveArgument: CanBeUndef<number> =
                moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: MoveNames.DiscardCardMove,
        validate: (): boolean => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx, playerId?: number):
            IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (playerId === undefined) {
                throw new Error(`Function param 'playerId' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx,
                MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator, playerId) as
                IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCardIdPlayerIdArguments>[`args`],
                player: CanBeUndef<IPublicPlayer> = G.publicPlayers[moveArguments.playerId];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует игрок с id '${moveArguments.playerId}'.`);
            }
            const cardFirst: CanBeUndef<PlayerCardTypes> = player.cards[SuitNames.Warrior][0];
            if (cardFirst === undefined) {
                throw new Error(`В массиве карт игрока во фракции '${SuitNames.Warrior}' отсутствует первая карта.`);
            }
            let minCardIndex = 0,
                minCardValue: number | null = cardFirst.points;
            moveArguments.cards.forEach((value: number, index: number): void => {
                const card: CanBeUndef<PlayerCardTypes> = player.cards[SuitNames.Warrior][value];
                if (card === undefined) {
                    throw new Error(`В массиве карт игрока во фракции '${SuitNames.Warrior}' отсутствует карта ${value}.`);
                }
                const cardPoints: number | null = card.points;
                if (cardPoints === null || minCardValue === null) {
                    throw new Error(`Фракция должна иметь параметр 'points'.`);
                }
                if (cardPoints < minCardValue) {
                    minCardIndex = index;
                    minCardValue = cardPoints;
                }
            });
            const cardIndex: CanBeUndef<number> = moveArguments.cards[minCardIndex];
            if (cardIndex === undefined) {
                throw new Error(`В массиве аргументов для 'cardId' отсутствует значение с id '${minCardIndex}'.`);
            }
            return {
                playerId: moveArguments.playerId,
                cardId: cardIndex,
            };
        },
        moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: (): boolean => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawDiscardedCards(G, ctx, MoveValidatorNames.PickDiscardCardMoveValidator) as
                IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PickDiscardCardMove,
        validate: (): boolean => true,
    },
    PlaceOlwinCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceOlwinCardMoveValidator,
                null) as IMoveArgumentsStage<SuitTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: CanBeUndef<SuitTypes> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceOlwinCardMove,
        validate: (): boolean => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceThrudHeroMoveValidator,
                null) as IMoveArgumentsStage<SuitTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            const moveArguments: IMoveArgumentsStage<SuitTypes[]>[`args`] = currentMoveArguments as SuitTypes[],
                moveArgument: CanBeUndef<SuitTypes> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceThrudHeroMove,
        validate: (): boolean => true,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx):
            IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoardsCoins(G, ctx,
                MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) as
                IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCoinsArguments[]>[`args`],
                moveArgument: CanBeUndef<IMoveCoinsArguments> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParamTypes): boolean => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            if (id === undefined) {
                throw new Error(`Function param 'id' is undefined.`);
            }
            if (typeof id !== `object`) {
                throw new Error(`Function param 'id' isn't object.`);
            }
            if (id === null) {
                throw new Error(`Function param 'id' is null.`);
            }
            if (!(`coinId` in id)) {
                throw new Error(`Function param 'id' hasn't 'coinId'.`);
            }
            const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
            }
            return player.stack[0]?.config?.coinId !== id.coinId && CoinUpgradeValidation(G, ctx, id);
        },
    },
    // TODO Do it logic!
    UseGodPowerMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.UseGodPowerMoveValidator,
                null) as IMoveArgumentsStage<number[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<number[]>[`args`] = currentMoveArguments as number[],
                moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.UseGodPowerMove,
        validate: (): boolean => true,
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
    chooseDifficultySoloMode: {
        default1: moveValidators.ChooseDifficultyLevelForSoloModeMoveValidator,
        chooseHeroesForSoloMode: moveValidators.ChooseHeroesForSoloModeMoveValidator,
    },
    placeCoins: {
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
        default3: moveValidators.BotsPlaceAllCoinsMoveValidator,
        default4: moveValidators.SoloBotPlaceAllCoinsMoveValidator,
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
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
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
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
    },
    endTier: {
        default1: moveValidators.PlaceYludHeroMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
    },
    getDistinctions: {
        default1: moveValidators.ClickDistinctionCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
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

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param value
 * @param values
 * @returns
 */
const ValidateByObjectCoinIdTypeIsInitialValues = (value: IMoveCoinsArguments, values: IMoveCoinsArguments[]):
    boolean => values.findIndex((coin: IMoveCoinsArguments): boolean =>
        value.coinId === coin.coinId && value.type === coin.type) !== -1;

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param value
 * @param values
 * @returns
 */
const ValidateByObjectSuitCardIdValues = (value: IMoveSuitCardCurrentId,
    values: Partial<SuitPropertyTypes<number[]>>): boolean => {
    const objectSuitCardIdValues: CanBeUndef<number[]> = values[value.suit];
    return objectSuitCardIdValues !== undefined && objectSuitCardIdValues.includes(value.cardId);
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param value
 * @param values
 * @returns
 */
const ValidateByObjectSuitCardIdPlayerIdValues = (value: IMoveCardPlayerCurrentId,
    values: IMoveCardIdPlayerIdArguments): boolean =>
    values.playerId === value.playerId && values.cards.includes(value.cardId);
