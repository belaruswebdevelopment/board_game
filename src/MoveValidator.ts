import type { Ctx } from "boardgame.io";
import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { CheckSoloBotCanPickHero, CheckSoloBotMustTakeCardToPickHero, CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard, CheckSuitsLeastPresentOnPlayerBoard, SoloBotMustTakeRandomCard } from "./bot_logic/SoloBotCardLogic";
import { IsCoin } from "./Coin";
import { ThrowMyError } from "./Error";
import { HasLowestPriority } from "./helpers/PriorityHelpers";
import { CheckMinCoinVisibleIndexForSoloBot, CheckMinCoinVisibleValueForSoloBot } from "./helpers/SoloBotHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { CoinTypeNames, ErrorNames, MoveNames, MoveValidatorNames, PhaseNames, PickHeroCardValidatorNames, RusCardTypeNames, StageNames, SuitNames } from "./typescript/enums";
import type { CampDeckCardTypes, CanBeNull, CanBeUndef, DeckCardTypes, IBuffs, IHeroCard, IMoveArgumentsStage, IMoveBy, IMoveByBidOptions, IMoveByBidUlineOptions, IMoveByBrisingamensEndGameOptions, IMoveByChooseDifficultySoloModeOptions, IMoveByEnlistmentMercenariesOptions, IMoveByGetMjollnirProfitOptions, IMoveByPlaceYludOptions, IMoveByTavernsResolutionOptions, IMoveByTroopEvaluationOptions, IMoveCardsPlayerIdArguments, IMoveCoinsArguments, IMoveSuitCardCurrentId, IMoveValidator, IMoveValidators, IMyGameState, IPickValidatorsConfig, IPlayer, IPublicPlayer, MoveCardPlayerCurrentIdType, MoveValidatorGetRangeTypes, MythologicalCreatureDeckCardTypes, PickValidatorConfigKeyofTypes, PlayerCardTypes, PublicPlayerCoinTypes, SuitKeyofTypes, SuitPropertyTypes, TavernCardTypes, ValidMoveIdParamTypes } from "./typescript/interfaces";
import { DrawCamp, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit } from "./ui/ProfitUI";

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
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
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
    const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[coinData.coinId],
        boardCoin: CanBeUndef<PublicPlayerCoinTypes> = boardCoins[coinData.coinId];
    let _exhaustiveCheck: never;
    switch (coinData.type) {
        case CoinTypeNames.Hand:
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
            break;
        case CoinTypeNames.Board:
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
            break;
        default:
            _exhaustiveCheck = coinData.type;
            throw new Error(`Не существует типа монеты - '${coinData.type}'.`);
            return _exhaustiveCheck;
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
export const IsValidMove = (G: IMyGameState, ctx: Ctx, stage: StageNames, id?: ValidMoveIdParamTypes): boolean => {
    const validator: CanBeNull<IMoveValidator> = GetValidator(ctx.phase as PhaseNames, stage);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid = ValidateByValues<number>(id, validator.getRange(G, ctx) as number[]);
        } else if (typeof id === `string`) {
            isValid =
                ValidateByValues<SuitKeyofTypes>(id, validator.getRange(G, ctx) as SuitKeyofTypes[]);
        } else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx) as
                    IMoveCoinsArguments[]);
            } else if (`playerId` in id) {
                isValid = ValidateByObjectSuitCardIdPlayerIdValues(id,
                    validator.getRange(G, ctx, id.playerId) as IMoveCardsPlayerIdArguments);
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
export const GetValidator = (phase: PhaseNames, stage: StageNames): CanBeNull<IMoveValidator> => {
    let validator: CanBeNull<IMoveValidator>,
        _exhaustiveCheck: never;
    switch (phase) {
        case PhaseNames.ChooseDifficultySoloMode:
            validator = moveBy[phase][stage as keyof IMoveByChooseDifficultySoloModeOptions];
            break;
        case PhaseNames.Bids:
            validator = moveBy[phase][stage as keyof IMoveByBidOptions];
            break;
        case PhaseNames.BidUline:
            validator = moveBy[phase][stage as keyof IMoveByBidUlineOptions];
            break;
        case PhaseNames.TavernsResolution:
            validator = moveBy[phase][stage as keyof IMoveByTavernsResolutionOptions];
            break;
        case PhaseNames.EnlistmentMercenaries:
            validator = moveBy[phase][stage as keyof IMoveByEnlistmentMercenariesOptions];
            break;
        case PhaseNames.PlaceYlud:
            validator = moveBy[phase][stage as keyof IMoveByPlaceYludOptions];
            break;
        case PhaseNames.TroopEvaluation:
            validator = moveBy[phase][stage as keyof IMoveByTroopEvaluationOptions];
            break;
        case PhaseNames.BrisingamensEndGame:
            validator = moveBy[phase][stage as keyof IMoveByBrisingamensEndGameOptions];
            break;
        case PhaseNames.GetMjollnirProfit:
            validator = moveBy[phase][stage as keyof IMoveByGetMjollnirProfitOptions];
            break;
        default:
            _exhaustiveCheck = phase;
            throw new Error(`Нет такого валидатора.`);
            return _exhaustiveCheck;
    }
    return validator;
};

// TODO MOVE ALL SAME VALIDATING LOGIC FROM GET RANGE/GET VALUE TO VALIDATE! And not same in another functions too to reduce logic here!
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators: IMoveValidators = {
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
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
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
                    return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined,
                        G.currentTavern);
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
                        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карты с id '${moveArgument}'.`);
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
                        if (tavernCard.type === RusCardTypeNames.Dwarf_Card
                            && uniqueCard.type === RusCardTypeNames.Dwarf_Card
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
                moveArgument = CheckSoloBotMustTakeCardToPickHero(G, ctx, moveArguments);
                if (moveArgument === undefined) {
                    moveArgument = CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard(G, ctx, moveArguments);
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
            // TODO Add for Solo Bot!
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
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawDistinctions(G, ctx, MoveValidatorNames.ClickDistinctionCardMoveValidator) as
                IMoveArgumentsStage<SuitKeyofTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] = currentMoveArguments as SuitKeyofTypes[],
                moveArgument: CanBeUndef<SuitKeyofTypes> =
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
                suitNames: SuitKeyofTypes[] = [];
            let suit: SuitKeyofTypes;
            for (suit in moveArguments) {
                suitNames.push(suit);
            }
            const suitName: CanBeUndef<SuitKeyofTypes> = suitNames[Math.floor(Math.random() * suitNames.length)];
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
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.GetMjollnirProfitMoveValidator,
                null) as IMoveArgumentsStage<SuitKeyofTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] = currentMoveArguments as SuitKeyofTypes[],
                totalSuitsRanks: number[] = [];
            for (let j = 0; j < moveArguments.length; j++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                const moveArgumentI: CanBeUndef<SuitKeyofTypes> = moveArguments[j];
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
            const moveArgument: CanBeUndef<SuitKeyofTypes> = moveArguments[index];
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
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            const mercenariesCount = player.campCards.filter((card: CampDeckCardTypes): boolean =>
                card.type === RusCardTypeNames.Mercenary_Card).length;
            return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator,
                null) as IMoveArgumentsStage<SuitKeyofTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] = currentMoveArguments as SuitKeyofTypes[],
                moveArgument: CanBeUndef<SuitKeyofTypes> =
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
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceYludHeroMoveValidator,
                null) as IMoveArgumentsStage<SuitKeyofTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            // TODO Add for Solo Bot!
            const moveArguments: IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] = currentMoveArguments as SuitKeyofTypes[],
                moveArgument: CanBeUndef<SuitKeyofTypes> =
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
                hasLowestPriority: boolean = HasLowestPriority(G, ctx, Number(ctx.currentPlayer));
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
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            if (privatePlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
                    ctx.currentPlayer);
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
            return ChooseDifficultyLevelForSoloModeProfit(G, ctx,
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
            return PickHeroesForSoloModeProfit(G, ctx,
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
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<number[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit(G, ctx,
                MoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator) as
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
        moveName: MoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
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
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                let type: CoinTypeNames,
                    coins: PublicPlayerCoinTypes[];
                if (ctx.phase === PhaseNames.ChooseDifficultySoloMode) {
                    type = CoinTypeNames.Hand;
                    coins = player.handCoins;

                } else {
                    type = CoinTypeNames.Board;
                    coins = player.boardCoins;
                }
                const minValue: number = CheckMinCoinVisibleValueForSoloBot(G, ctx, moveArguments, type);
                if (minValue === 0) {
                    throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть минимальная монета для улучшения с значением '${minValue}'.`);
                }
                const coinId: number = CheckMinCoinVisibleIndexForSoloBot(coins, minValue);
                if (coinId === -1) {
                    throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не найдена минимальная монета с значением '${minValue}'.`);
                }
                moveArgument = moveArguments[coinId];
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
            const validators: CanBeUndef<IPickValidatorsConfig> = hero.pickValidators;
            if (validators !== undefined) {
                let validator: PickValidatorConfigKeyofTypes;
                for (validator in validators) {
                    switch (validator) {
                        case PickHeroCardValidatorNames.Conditions:
                            isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                            break;
                        case PickHeroCardValidatorNames.DiscardCard:
                            isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                            break;
                        default:
                            throw new Error(`Отсутствует валидатор ${validator} для выбора карт героя.`);
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
                suitNamesArray: SuitKeyofTypes[] = [];
            let suit: SuitKeyofTypes;
            for (suit in moveArguments) {
                suitNamesArray.push(suit);
            }
            const suitName: CanBeUndef<SuitKeyofTypes> =
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
            IMoveArgumentsStage<IMoveCardsPlayerIdArguments>[`args`] => {
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
                IMoveArgumentsStage<IMoveCardsPlayerIdArguments>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<IMoveCardsPlayerIdArguments>[`args`] =
                currentMoveArguments as IMoveArgumentsStage<IMoveCardsPlayerIdArguments>[`args`],
                player: CanBeUndef<IPublicPlayer> = G.publicPlayers[moveArguments.playerId];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    moveArguments.playerId);
            }
            const cardFirst: CanBeUndef<PlayerCardTypes> = player.cards[SuitNames.Warrior][0];
            if (cardFirst === undefined) {
                throw new Error(`В массиве карт игрока во фракции '${SuitNames.Warrior}' отсутствует первая карта.`);
            }
            let minCardIndex = 0,
                minCardValue: CanBeNull<number> = cardFirst.points;
            moveArguments.cards.forEach((value: number, index: number): void => {
                const card: CanBeUndef<PlayerCardTypes> = player.cards[SuitNames.Warrior][value];
                if (card === undefined) {
                    throw new Error(`В массиве карт игрока во фракции '${SuitNames.Warrior}' отсутствует карта ${value}.`);
                }
                const cardPoints: CanBeNull<number> = card.points;
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
    PlaceMultiSuitCardMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceMultiSuitCardMoveValidator,
                null) as IMoveArgumentsStage<SuitKeyofTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            const moveArguments: IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] = currentMoveArguments as SuitKeyofTypes[],
                moveArgument: CanBeUndef<SuitKeyofTypes> =
                    moveArguments[Math.floor(Math.random() * moveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: MoveNames.PlaceMultiSuitCardMove,
        validate: (): boolean => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G?: IMyGameState, ctx?: Ctx): IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] => {
            if (G === undefined) {
                throw new Error(`Function param 'G' is undefined.`);
            }
            if (ctx === undefined) {
                throw new Error(`Function param 'ctx' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceThrudHeroMoveValidator,
                null) as IMoveArgumentsStage<SuitKeyofTypes[]>[`args`];
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
            ValidMoveIdParamTypes => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement!
            const moveArguments: IMoveArgumentsStage<SuitKeyofTypes[]>[`args`] = currentMoveArguments as SuitKeyofTypes[];
            let moveArgument: CanBeUndef<SuitKeyofTypes>;
            if (G.solo && ctx.currentPlayer === `1`) {
                const soloBotPublicPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[1];
                if (soloBotPublicPlayer === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                        1);
                }
                const suit: CanBeUndef<SuitKeyofTypes> = CheckSoloBotCanPickHero(G, ctx, soloBotPublicPlayer);
                if (suit === undefined) {
                    const [suits]: [SuitKeyofTypes[], number] =
                        CheckSuitsLeastPresentOnPlayerBoard(G, ctx, soloBotPublicPlayer);
                    if (suits.length === 0) {
                        throw new Error(`Не может не быть фракций с минимальным количеством карт.`);
                    } else if (suits.length === 1) {
                        moveArgument = suits[0];
                    } else {
                        // TODO Move Thrud in most left suit from `suits`
                    }
                } else {
                    moveArgument = suit;
                }
            } else {
                moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
            }
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
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            return player.stack[0]?.coinId !== id.coinId && CoinUpgradeValidation(G, ctx, id);
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
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
    },
    bids: {
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
        // Bots
        default3: moveValidators.BotsPlaceAllCoinsMoveValidator,
        // Solo Bot
        default4: moveValidators.SoloBotPlaceAllCoinsMoveValidator,
    },
    bidUline: {
        default1: moveValidators.ClickHandCoinUlineMoveValidator,
    },
    tavernsResolution: {
        default1: moveValidators.ClickCardMoveValidator,
        default2: moveValidators.ClickCampCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade:
            moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
        discardCard: moveValidators.DiscardCard2PlayersMoveValidator,
        placeTradingCoinsUline: moveValidators.ClickHandTradingCoinUlineMoveValidator,
        // Solo Bot
        pickHeroSoloBot: moveValidators.SoloBotClickHeroCardMoveValidator,
    },
    enlistmentMercenaries: {
        default1: moveValidators.StartEnlistmentMercenariesMoveValidator,
        default2: moveValidators.PassEnlistmentMercenariesMoveValidator,
        default3: moveValidators.GetEnlistmentMercenariesMoveValidator,
        placeEnlistmentMercenaries: moveValidators.PlaceEnlistmentMercenariesMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade:
            moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
    },
    placeYlud: {
        default1: moveValidators.PlaceYludHeroMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade:
            moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
    },
    troopEvaluation: {
        default1: moveValidators.ClickDistinctionCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade:
            moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickConcreteCoinToUpgrade: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
        pickDistinctionCard: moveValidators.ClickCardToPickDistinctionMoveValidator,
        // Solo Bot
        pickHeroSoloBot: moveValidators.SoloBotClickHeroCardMoveValidator,
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
const ValidateByObjectSuitCardIdPlayerIdValues = (value: MoveCardPlayerCurrentIdType,
    values: IMoveCardsPlayerIdArguments): boolean =>
    values.playerId === value.playerId && values.cards.includes(value.cardId);
