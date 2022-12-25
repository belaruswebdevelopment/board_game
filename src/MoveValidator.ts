import { CompareTavernCards, EvaluateTavernCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { CheckSoloBotAndvariMustTakeCardFromGeneralStrategy, CheckSoloBotAndvariMustTakeCardToPickHero, CheckSoloBotAndvariMustTakeRoyalOfferingCard, SoloBotMustTakeCardFromReserveStrategy } from "./bot_logic/SoloBotAndvariCardLogic";
import { CheckSoloBotCanPickHero, CheckSoloBotMustTakeCardToPickHero, CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard, CheckSoloBotMustTakeRoyalOfferingCard, CheckSuitsLeastPresentOnPlayerBoard, SoloBotMustTakeRandomCard } from "./bot_logic/SoloBotCardLogic";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { HasLowestPriority } from "./helpers/PriorityHelpers";
import { CheckMinCoinIndexForSoloBotAndvari, CheckMinCoinVisibleIndexForSoloBot, CheckMinCoinVisibleValueForSoloBot, CheckMinCoinVisibleValueForSoloBotAndvari } from "./helpers/SoloBotHelpers";
import { IsMercenaryCampCard } from "./is_helpers/IsCampTypeHelpers";
import { IsCoin } from "./is_helpers/IsCoinTypeHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { ActivateGiantAbilityOrPickCardSubMoveValidatorNames, ActivateGodAbilityOrNotSubMoveValidatorNames, AutoBotsMoveNames, BidsDefaultStageNames, BidsMoveValidatorNames, BidUlineDefaultStageNames, BidUlineMoveValidatorNames, BrisingamensEndGameDefaultStageNames, BrisingamensEndGameMoveValidatorNames, ButtonMoveNames, CampBuffNames, CardMoveNames, ChooseDifficultySoloModeAndvariDefaultStageNames, ChooseDifficultySoloModeAndvariMoveValidatorNames, ChooseDifficultySoloModeMoveValidatorNames, CoinMoveNames, CoinTypeNames, CommonMoveValidatorNames, EmptyCardMoveNames, EnlistmentMercenariesMoveValidatorNames, ErrorNames, GameModeNames, GetMjollnirProfitDefaultStageNames, GetMjollnirProfitMoveValidatorNames, GodNames, PhaseNames, PickHeroCardValidatorNames, PlaceYludDefaultStageNames, PlaceYludMoveValidatorNames, SoloBotAndvariCommonMoveValidatorNames, SoloBotCommonCoinUpgradeMoveValidatorNames, SoloBotCommonMoveValidatorNames, SoloGameAndvariStrategyNames, SuitMoveNames, SuitNames, TavernsResolutionMoveValidatorNames, TroopEvaluationMoveValidatorNames } from "./typescript/enums";
import type { CanBeNullType, CanBeUndefType, ChooseDifficultySoloModeAllStageNames, EnlistmentMercenariesAllStageNames, IDwarfCard, IHeroCard, IMoveBy, IMoveCardsArguments, IMoveCoinsArguments, IMoveSuitCardCurrentId, IMoveValidator, IMoveValidators, IPickValidatorsConfig, IPlayer, IPublicPlayer, KeyofType, MoveArgumentsType, MoveCardIdType, MoveNamesType, MoveValidatorGetRangeStringArrayType, MoveValidatorGetRangeType, MyFnContextWithMyPlayerID, PickHeroCardValidatorNamesKeyofTypeofType, PlayerCardType, PublicPlayerCoinType, SoloGameAndvariStrategyVariantLevelType, SoloGameDifficultyLevelArgType, StageNames, SuitPropertyType, TavernAllCardType, TavernCardType, TavernCardWithExpansionType, TavernsResolutionAllStageNames, TroopEvaluationAllStageNames, ValidMoveIdParamType } from "./typescript/interfaces";
import { DrawCamp, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { ActivateGiantAbilityOrPickCardProfit, ActivateGodAbilityOrNotProfit, ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ChooseGetMythologyCardProfit, ChooseStrategyForSoloModeAndvariProfit, ChooseStrategyVariantForSoloModeAndvariProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit, StartOrPassEnlistmentMercenariesProfit } from "./ui/ProfitUI";

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param context
 * @param coinData Данные монеты.
 * @returns Валидация обмена монет.
 */
export const CoinUpgradeValidation = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    coinData: IMoveCoinsArguments): boolean => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined,
            myPlayerID);
    }
    let handCoins: PublicPlayerCoinType[],
        boardCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
        boardCoins = privatePlayer.boardCoins;
    } else {
        handCoins = player.handCoins;
        boardCoins = player.boardCoins;
    }
    const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinData.coinId],
        boardCoin: CanBeUndefType<PublicPlayerCoinType> = boardCoins[coinData.coinId];
    let _exhaustiveCheck: never;
    switch (coinData.type) {
        case CoinTypeNames.Hand:
            if (handCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует монета с id '${coinData.coinId}'.`);
            }
            if (handCoin === null) {
                throw new Error(`Выбранная для улучшения монета игрока с id '${myPlayerID}' в руке с id '${coinData.coinId}' не может отсутствовать там.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`Монета с id '${coinData.coinId}' в руке текущего игрока с id '${myPlayerID}' не может быть закрытой для него.`);
            }
            if (!handCoin.isTriggerTrading) {
                return true;
            }
            break;
        case CoinTypeNames.Board:
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе отсутствует монета с id '${coinData.coinId}'.`);
            }
            if (boardCoin === null) {
                throw new Error(`Выбранная для улучшения монета игрока с id '${myPlayerID}' на столе с id '${coinData.coinId}' не может отсутствовать там.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`Монета с id '${coinData.coinId}' на столе текущего игрока с id '${myPlayerID}' не может быть закрытой для него.`);
            }
            if (!boardCoin.isTriggerTrading) {
                return true;
            }
            break;
        default:
            _exhaustiveCheck = coinData.type;
            throw new Error(`Не существует такого типа монеты.`);
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
 * @param context
 * @param stage Стадия.
 * @param type Тип мува.
 * @param id Данные для валидации.
 * @returns Валидный ли мув.
 */
export const IsValidMove = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, stage: StageNames,
    type: MoveNamesType, id: ValidMoveIdParamType): boolean => {
    const validator: IMoveValidator<MoveValidatorGetRangeType> = GetValidator(ctx.phase, stage, type);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid =
                ValidateByArrayValues(id, validator.getRange({ G, ctx, myPlayerID, ...rest }) as
                    number[]);
        } else if (typeof id === `string`) {
            isValid =
                ValidateByArrayValues(id, validator.getRange({ G, ctx, myPlayerID, ...rest }) as MoveValidatorGetRangeStringArrayType);
        } else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id,
                    validator.getRange({ G, ctx, myPlayerID, ...rest }) as IMoveCoinsArguments[]);
            } else if (`rank` in id) {
                isValid = ValidateObjectEqualValues(id,
                    validator.getRange({ G, ctx, myPlayerID, ...rest }) as IDwarfCard);
            } else if (`myPlayerID` in id) {
                isValid = ValidateByObjectCardIdValues(id,
                    validator.getRange({ G, ctx, myPlayerID, ...rest }) as IMoveCardsArguments);
            } else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id,
                    validator.getRange({ G, ctx, myPlayerID, ...rest }) as Partial<SuitPropertyType<number[]>>);
            }
        } else {
            isValid = true;
        }
        if (isValid) {
            return validator.validate({ G, ctx, myPlayerID, ...rest }, id);
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
 * @param type Тип мува.
 * @returns Валидатор.
 */
export const GetValidator = (phase: PhaseNames, stage: StageNames, type: MoveNamesType):
    IMoveValidator<MoveValidatorGetRangeType> => {
    let validator: IMoveValidator<MoveValidatorGetRangeType>,
        _exhaustiveCheck: never;
    let moveByType;
    switch (phase) {
        case PhaseNames.ChooseDifficultySoloMode:
            moveByType = moveBy[phase][stage as ChooseDifficultySoloModeAllStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>];
            break;
        case PhaseNames.ChooseDifficultySoloModeAndvari:
            moveByType = moveBy[phase][stage as ChooseDifficultySoloModeAndvariDefaultStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>];
            break;
        case PhaseNames.Bids:
            moveByType = moveBy[phase][stage as BidsDefaultStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>];
            break;
        case PhaseNames.BidUline:
            moveByType = moveBy[phase][stage as BidUlineDefaultStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>] as IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.TavernsResolution:
            moveByType = moveBy[phase][stage as TavernsResolutionAllStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>];
            break;
        case PhaseNames.EnlistmentMercenaries:
            moveByType = moveBy[phase][stage as EnlistmentMercenariesAllStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>];
            break;
        case PhaseNames.PlaceYlud:
            moveByType = moveBy[phase][stage as PlaceYludDefaultStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>];
            break;
        case PhaseNames.TroopEvaluation:
            moveByType = moveBy[phase][stage as TroopEvaluationAllStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>];
            break;
        case PhaseNames.BrisingamensEndGame:
            moveByType = moveBy[phase][stage as BrisingamensEndGameDefaultStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>] as IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.GetMjollnirProfit:
            moveByType = moveBy[phase][stage as GetMjollnirProfitDefaultStageNames];
            validator = moveByType[type as KeyofType<typeof moveByType>] as IMoveValidator<MoveValidatorGetRangeType>;
            break;
        default:
            _exhaustiveCheck = phase;
            throw new Error(`Нет валидатора для такой фазы.`);
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
    // TODO Fix it!
    ActivateGodAbilityMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<GodNames[]> =>
            ActivateGodAbilityOrNotProfit({ G, ctx, ...rest },
                ActivateGodAbilityOrNotSubMoveValidatorNames.ActivateGodAbilityMoveValidator) as
            MoveArgumentsType<GodNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<GodNames[]>): GodNames => {
            const moveArgument: CanBeUndefType<GodNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ActivateGodAbilityMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    NotActivateGodAbilityMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<null> =>
            ActivateGodAbilityOrNotProfit({ G, ctx, ...rest },
                ActivateGodAbilityOrNotSubMoveValidatorNames.NotActivateGodAbilityMoveValidator) as
            MoveArgumentsType<null>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getValue: ({ G }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<null>):
            MoveArgumentsType<null> => currentMoveArguments,
        moveName: ButtonMoveNames.NotActivateGodAbilityMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickCardNotGiantAbilityMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IDwarfCard> =>
            ActivateGiantAbilityOrPickCardProfit({ G, ctx, ...rest },
                ActivateGiantAbilityOrPickCardSubMoveValidatorNames.ClickCardNotGiantAbilityMoveValidator) as
            MoveArgumentsType<IDwarfCard>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getValue: ({ G }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<IDwarfCard>): IDwarfCard =>
            currentMoveArguments,
        moveName: CardMoveNames.ClickCardNotGiantAbilityMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickGiantAbilityNotCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IDwarfCard> =>
            ActivateGiantAbilityOrPickCardProfit({ G, ctx, ...rest },
                ActivateGiantAbilityOrPickCardSubMoveValidatorNames.ClickGiantAbilityNotCardMoveValidator) as
            MoveArgumentsType<IDwarfCard>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getValue: ({ G }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<IDwarfCard>): IDwarfCard =>
            currentMoveArguments,
        moveName: CardMoveNames.ClickGiantAbilityNotCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ChooseCoinValueForHrungnirUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IMoveCoinsArguments[]> =>
            DrawPlayersBoardsCoins({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.ChooseCoinValueForHrungnirUpgradeMoveValidator) as
            MoveArgumentsType<IMoveCoinsArguments[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>): IMoveCoinsArguments => {
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ChooseCoinValueForHrungnirUpgradeMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, id: IMoveCoinsArguments): boolean =>
            myPlayerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, myPlayerID, ...rest }, id),
    },
    ChooseSuitOlrunMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.ChooseSuitOlrunMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            const moveArgument: CanBeUndefType<SuitNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: SuitMoveNames.ChooseSuitOlrunMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    GetMythologyCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            ChooseGetMythologyCardProfit({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.GetMythologyCardMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.GetMythologyCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickBoardCoinMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawPlayersBoardsCoins({ G, ctx, ...rest },
                BidsMoveValidatorNames.ClickBoardCoinMoveValidator) as MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickBoardCoinMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickCampCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawCamp({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.ClickCampCardMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): boolean => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    myPlayerID);
            }
            return myPlayerID === ctx.currentPlayer && G.expansions.Thingvellir.active
                && (ctx.currentPlayer === G.publicPlayersOrder[0] || (!G.campPicked
                    && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, CampBuffNames.GoCamp)));
        },
    },
    ClickCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawTaverns({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.ClickCardMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            // TODO Get MythologicalCreature cards for AI bots...
            const uniqueArr: TavernCardWithExpansionType[] = [],
                currentTavern: TavernAllCardType = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < currentMoveArguments.length; i++) {
                const moveArgument: CanBeUndefType<number> = currentMoveArguments[i];
                if (moveArgument === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
                }
                const tavernCard: CanBeUndefType<TavernCardType> = currentTavern[moveArgument];
                if (tavernCard === undefined) {
                    return ThrowMyError({ G, ctx, ...rest },
                        ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
                }
                if (tavernCard === null) {
                    return ThrowMyError({ G, ctx, ...rest },
                        ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
                }
                if (currentTavern.some((card: TavernCardType): boolean =>
                    CompareTavernCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse: boolean = EvaluateTavernCard({ G, ctx, ...rest },
                    tavernCard, moveArgument, currentTavern) < 0,
                    isExistCardNotWorse: boolean =
                        currentTavern.some((card: TavernCardType): boolean => EvaluateTavernCard({ G, ctx, ...rest },
                            card, moveArgument, currentTavern) >= 0);
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength: number = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard: CanBeUndefType<TavernCardWithExpansionType> = uniqueArr[j];
                    if (uniqueCard === undefined) {
                        throw new Error(`В массиве уникальных карт отсутствует карта с id '${j}'.`);
                    }
                    if (CompareTavernCards(tavernCard, uniqueCard) === 0) {
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
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.ClickCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            ExplorerDistinctionProfit({ G, ctx, ...rest },
                TroopEvaluationMoveValidatorNames.ClickCardToPickDistinctionMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCardToPickDistinctionMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawDistinctions({ G, ctx, ...rest },
                TroopEvaluationMoveValidatorNames.ClickDistinctionCardMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            const moveArgument: CanBeUndefType<SuitNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickDistinctionCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickHandCoinMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawPlayersHandsCoins({ G, ctx, ...rest },
                BidsMoveValidatorNames.ClickHandCoinMoveValidator) as MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawPlayersHandsCoins({ G, ctx, ...rest },
                BidUlineMoveValidatorNames.ClickHandCoinUlineMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinUlineMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawPlayersHandsCoins({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.ClickHandTradingCoinUlineMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandTradingCoinUlineMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID):
            MoveArgumentsType<Partial<SuitPropertyType<number[]>>> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                BrisingamensEndGameMoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) as
            MoveArgumentsType<Partial<SuitPropertyType<number[]>>>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<Partial<SuitPropertyType<number[]>>>): IMoveSuitCardCurrentId => {
            const suitNames: SuitNames[] = [];
            let suit: SuitNames;
            for (suit in currentMoveArguments) {
                suitNames.push(suit);
            }
            const suitName: CanBeUndefType<SuitNames> =
                suitNames[Math.floor(Math.random() * suitNames.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция '${suitName}' для сброса карты.`);
            }
            const moveArgumentForSuit: CanBeUndefType<number[]> = currentMoveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
            }
            const moveArgument: CanBeUndefType<number> =
                moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardCardFromPlayerBoardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawTaverns({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.DiscardCard2PlayersMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.DiscardCard2PlayersMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                EnlistmentMercenariesMoveValidatorNames.GetEnlistmentMercenariesMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.GetEnlistmentMercenariesMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                GetMjollnirProfitMoveValidatorNames.GetMjollnirProfitMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            const totalSuitsRanks: number[] = [],
                player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    myPlayerID);
            }
            for (let j = 0; j < currentMoveArguments.length; j++) {
                const moveArgumentI: CanBeUndefType<SuitNames> = currentMoveArguments[j];
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
            const moveArgument: CanBeUndefType<SuitNames> = currentMoveArguments[index];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${index}'.`);
            }
            return moveArgument;
        },
        moveName: SuitMoveNames.GetMjollnirProfitMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<null> =>
            StartOrPassEnlistmentMercenariesProfit({ G, ctx, ...rest },
                EnlistmentMercenariesMoveValidatorNames.StartEnlistmentMercenariesMoveValidator) as
            MoveArgumentsType<null>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getValue: ({ G }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<null>):
            MoveArgumentsType<null> => currentMoveArguments,
        moveName: ButtonMoveNames.PassEnlistmentMercenariesMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): boolean => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    myPlayerID);
            }
            const mercenariesCount = player.campCards.filter(IsMercenaryCampCard).length;
            return myPlayerID === ctx.currentPlayer && ctx.playOrderPos === 0
                && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                EnlistmentMercenariesMoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            const moveArgument: CanBeUndefType<SuitNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceEnlistmentMercenariesMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    PlaceYludHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                PlaceYludMoveValidatorNames.PlaceYludHeroMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            const moveArgument: CanBeUndefType<SuitNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceYludHeroMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<null> =>
            StartOrPassEnlistmentMercenariesProfit({ G, ctx, ...rest },
                EnlistmentMercenariesMoveValidatorNames.StartEnlistmentMercenariesMoveValidator) as
            MoveArgumentsType<null>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getValue: ({ G }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<null>):
            MoveArgumentsType<null> => currentMoveArguments,
        moveName: ButtonMoveNames.StartEnlistmentMercenariesMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    // Bots
    BotsPlaceAllCoinsMoveValidator: {
        // TODO Move to Get from validator BidsMoveValidatorNames.BotsPlaceAllCoinsMoveValidator!?
        getRange: ({ G }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[][]> => G.botData.allCoinsOrder,
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<number[][]>): number[] => {
            const hasLowestPriority: boolean = HasLowestPriority({ G, ctx, myPlayerID, ...rest });
            let resultsForCoins: number[] = CheckHeuristicsForCoinsPlacement({ G, ctx, ...rest });
            if (hasLowestPriority) {
                resultsForCoins = resultsForCoins.map((num: number, index: number): number =>
                    index === 0 ? num - 20 : num);
            }
            const minResultForCoins: number = Math.min(...resultsForCoins),
                maxResultForCoins: number = Math.max(...resultsForCoins),
                tradingProfit: number = G.secret.decks[1].length > 9 ? 1 : 0;
            let [positionForMinCoin, positionForMaxCoin]: number[] = [-1, -1];
            if (minResultForCoins <= 0) {
                positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
            }
            if (maxResultForCoins >= 0) {
                positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
            }
            // TODO Check it bot can't play in multiplayer now...
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)],
                privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    myPlayerID);
            }
            if (privatePlayer === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined,
                    myPlayerID);
            }
            let handCoins: PublicPlayerCoinType[];
            if (G.mode === GameModeNames.Multiplayer) {
                handCoins = privatePlayer.handCoins;
            } else {
                handCoins = player.handCoins;
            }
            for (let i = 0; i < currentMoveArguments.length; i++) {
                const allCoinsOrderI: CanBeUndefType<number[]> = currentMoveArguments[i];
                if (allCoinsOrderI === undefined) {
                    throw new Error(`В массиве выкладки монет отсутствует выкладка '${i}'.`);
                }
                const hasTrading: boolean = allCoinsOrderI.some((coinId: number): boolean => {
                    const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinId];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует монета с id '${coinId}'.`);
                    }
                    if (handCoin !== null && !IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${coinId}'.`);
                    }
                    if (IsCoin(handCoin) && handCoin.isOpened) {
                        throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть ранее открыта монета с id '${coinId}'.`);
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
                        handCoins.every((coin: PublicPlayerCoinType, index: number): boolean => {
                            if (coin !== null && !IsCoin(coin)) {
                                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${index}'.`);
                            }
                            if (IsCoin(coin) && coin.isOpened) {
                                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть ранее открыта монета с id '${index}'.`);
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
                        coinsOrderPositionForMaxCoin: CanBeUndefType<number> = allCoinsOrderI[positionForMaxCoin],
                        coinsOrderPositionForMinCoin: CanBeUndefType<number> = allCoinsOrderI[positionForMinCoin];
                    if (coinsOrderPositionForMaxCoin !== undefined && coinsOrderPositionForMinCoin !== undefined) {
                        const maxCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinsOrderPositionForMaxCoin],
                            minCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinsOrderPositionForMinCoin];
                        if (maxCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (maxCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${myPlayerID}' не может не быть максимальной монеты с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${myPlayerID}' не может не быть минимальной монеты с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (!IsCoin(maxCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${myPlayerID}' не может быть закрыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (!IsCoin(minCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${myPlayerID}' не может быть закрыта минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (IsCoin(maxCoin) && maxCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (IsCoin(minCoin) && minCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        let isTopCoinsOnPosition = false,
                            isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition = allCoinsOrderI.filter((coinIndex: number): boolean => {
                                const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinIndex];
                                if (handCoin === undefined) {
                                    throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует монета с id '${coinIndex}'.`);
                                }
                                if (handCoin !== null && !IsCoin(handCoin)) {
                                    throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                                }
                                if (IsCoin(handCoin) && handCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть ранее открыта монета с id '${coinIndex}'.`);
                                }
                                return IsCoin(handCoin) && handCoin.value > maxCoin.value;
                            }).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition =
                                handCoins.filter((coin: PublicPlayerCoinType, index: number): boolean => {
                                    if (coin !== null && !IsCoin(coin)) {
                                        throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${index}'.`);
                                    }
                                    if (IsCoin(coin) && coin.isOpened) {
                                        throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть ранее открыта монета с id '${index}'.`);
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
        moveName: AutoBotsMoveNames.BotsPlaceAllCoinsMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    // Solo Bot
    SoloBotPlaceAllCoinsMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[][]> =>
            DrawPlayersHandsCoins({ G, ctx, ...rest },
                BidsMoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator) as
            MoveArgumentsType<number[][]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<number[][]>): number[] => {
            const moveArgument: CanBeUndefType<number[]> = currentMoveArguments[0];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotPlaceAllCoinsMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotClickCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawTaverns({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.SoloBotClickCardMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<number[]>): number => {
            // TODO If last round of tier 0 => get card not given distinction to other player and get for you if can' take hero or least present! If last round of the game => get most valuable points if can't pick hero anymore (can't check least present)!
            let moveArgument: CanBeUndefType<number>;
            moveArgument = CheckSoloBotMustTakeCardToPickHero({ G, ctx, myPlayerID, ...rest },
                currentMoveArguments);
            if (moveArgument === undefined) {
                moveArgument =
                    CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard({ G, ctx, myPlayerID, ...rest },
                        currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotMustTakeRoyalOfferingCard({ G, ctx, myPlayerID, ...rest },
                    currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument =
                    SoloBotMustTakeRandomCard({ G, ctx, myPlayerID, ...rest }, currentMoveArguments);
            }
            if (moveArgument !== undefined) {
                return moveArgument;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.SoloBotClickCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotClickHeroCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawHeroesForSoloBotUI({ G, ctx, ...rest },
                SoloBotCommonMoveValidatorNames.SoloBotClickHeroCardMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickHeroCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotClickCardToPickDistinctionMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            ExplorerDistinctionProfit({ G, ctx, ...rest },
                TroopEvaluationMoveValidatorNames.SoloBotClickCardToPickDistinctionMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickCardToPickDistinctionMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotPlaceThrudHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                SoloBotCommonMoveValidatorNames.SoloBotPlaceThrudHeroMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement and move in one func!?
            let moveArgument: CanBeUndefType<SuitNames>;
            const suit: CanBeUndefType<SuitNames> = CheckSoloBotCanPickHero({ G, ctx, myPlayerID, ...rest });
            if (suit === undefined) {
                const [suits]: [SuitNames[], number] =
                    CheckSuitsLeastPresentOnPlayerBoard({ G, ctx, myPlayerID, ...rest });
                if (suits.length === 0) {
                    // TODO Move Thrud/Ylud in most left suit from `suits`
                    throw new Error(`Не может не быть фракций с минимальным количеством карт.`);
                } else if (suits.length === 1) {
                    const leastPresentSuit: CanBeUndefType<SuitNames> = suits[0];
                    if (leastPresentSuit === undefined) {
                        throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение наименее представленной фракции.`);
                    }
                    moveArgument = currentMoveArguments[currentMoveArguments.indexOf(leastPresentSuit)];
                } else {
                    // TODO Move Thrud/Ylud in most left suit from least present `suits`!
                }
            } else {
                moveArgument = suit;
            }
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceThrudHeroMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotPlaceYludHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                PlaceYludMoveValidatorNames.SoloBotPlaceYludHeroMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            // TODO Same logic from Thrud placement and move in one func!?
            const moveArgument: CanBeUndefType<SuitNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceYludHeroMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotClickCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IMoveCoinsArguments[]> =>
            (DrawPlayersBoardsCoins({ G, ctx, ...rest },
                SoloBotCommonCoinUpgradeMoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator) as
                MoveArgumentsType<IMoveCoinsArguments[]>).concat(
                    DrawPlayersHandsCoins({ G, ctx, ...rest },
                        SoloBotCommonCoinUpgradeMoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator) as
                    MoveArgumentsType<IMoveCoinsArguments[]>),
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>): IMoveCoinsArguments => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    myPlayerID);
            }
            let type: CoinTypeNames,
                coins: PublicPlayerCoinType[];
            if (ctx.phase === PhaseNames.ChooseDifficultySoloMode) {
                type = CoinTypeNames.Hand;
                coins = player.handCoins;

            } else {
                type = CoinTypeNames.Board;
                coins = player.boardCoins;
            }
            const minValue: number = CheckMinCoinVisibleValueForSoloBot({ G, ctx, myPlayerID, ...rest },
                currentMoveArguments, type);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота с id '${myPlayerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId: number = CheckMinCoinVisibleIndexForSoloBot(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота с id '${myPlayerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotClickCoinToUpgradeMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, id: IMoveCoinsArguments): boolean =>
            myPlayerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, myPlayerID, ...rest }, id),
    },
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID):
            MoveArgumentsType<SoloGameDifficultyLevelArgType[]> =>
            ChooseDifficultyLevelForSoloModeProfit({ G, ctx, ...rest },
                ChooseDifficultySoloModeMoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator) as
            MoveArgumentsType<SoloGameDifficultyLevelArgType[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SoloGameDifficultyLevelArgType[]>):
            SoloGameDifficultyLevelArgType => {
            const moveArgument: CanBeUndefType<SoloGameDifficultyLevelArgType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)] as
                SoloGameDifficultyLevelArgType;
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ChooseHeroForDifficultySoloModeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            PickHeroesForSoloModeProfit({ G, ctx, ...rest },
                ChooseDifficultySoloModeMoveValidatorNames.ChooseHeroForDifficultySoloModeMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ChooseHeroForDifficultySoloModeMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    // Solo Mode Andvari
    ChooseStrategyVariantForSoloModeAndvariMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID):
            MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]> =>
            ChooseStrategyVariantForSoloModeAndvariProfit({ G, ctx, ...rest },
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyVariantForSoloModeAndvariMoveValidator) as
            MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments:
            MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]>):
            SoloGameAndvariStrategyVariantLevelType => {
            const moveArgument: CanBeUndefType<SoloGameAndvariStrategyVariantLevelType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)] as
                SoloGameAndvariStrategyVariantLevelType;
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ChooseStrategyForSoloModeAndvariMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SoloGameAndvariStrategyNames[]> =>
            ChooseStrategyForSoloModeAndvariProfit({ G, ctx, ...rest },
                ChooseDifficultySoloModeAndvariMoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) as
            MoveArgumentsType<SoloGameAndvariStrategyNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SoloGameAndvariStrategyNames[]>): SoloGameAndvariStrategyNames => {
            const moveArgument: CanBeUndefType<SoloGameAndvariStrategyNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)] as
                SoloGameAndvariStrategyNames;
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotAndvariPlaceAllCoinsMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[][]> =>
            DrawPlayersHandsCoins({ G, ctx, ...rest },
                BidsMoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator) as
            MoveArgumentsType<number[][]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<number[][]>): number[] => {
            const moveArgument: CanBeUndefType<number[]> = currentMoveArguments[0];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotAndvariPlaceAllCoinsMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawTaverns({ G, ctx, ...rest },
                TavernsResolutionMoveValidatorNames.SoloBotAndvariClickCardMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<number[]>): number => {
            let moveArgument: CanBeUndefType<number>;
            moveArgument = CheckSoloBotAndvariMustTakeCardFromGeneralStrategy({ G, ctx, myPlayerID, ...rest },
                currentMoveArguments);
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotAndvariMustTakeCardToPickHero({ G, ctx, myPlayerID, ...rest },
                    currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotAndvariMustTakeRoyalOfferingCard({ G, ctx, myPlayerID, ...rest },
                    currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = SoloBotMustTakeCardFromReserveStrategy({ G, ctx, myPlayerID, ...rest },
                    currentMoveArguments);
            }
            if (moveArgument !== undefined) {
                return moveArgument;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.SoloBotAndvariClickCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickHeroCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawHeroes({ G, ctx, ...rest },
                SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            let moveArgument: CanBeUndefType<number>;
            const dwergBrotherIndex: number = G.heroes.findIndex((hero: IHeroCard): boolean =>
                hero.active && hero.name.startsWith(`Dwerg`));
            if (dwergBrotherIndex !== -1) {
                moveArgument = dwergBrotherIndex;
            } else {
                moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            }
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickHeroCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickCardToPickDistinctionMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            ExplorerDistinctionProfit({ G, ctx, ...rest },
                TroopEvaluationMoveValidatorNames.SoloBotAndvariClickCardToPickDistinctionMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickCardToPickDistinctionMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID, id: number): boolean =>
            myPlayerID === ctx.currentPlayer && id === 0,
    },
    SoloBotAndvariPlaceThrudHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariPlaceThrudHeroMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Move same logic for Ylud placement in one func!
            const strategySuitIndex: number =
                currentMoveArguments.findIndex((suit: SuitNames): boolean =>
                    suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument: CanBeUndefType<SuitNames> = currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceThrudHeroMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotAndvariPlaceYludHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                PlaceYludMoveValidatorNames.SoloBotAndvariPlaceYludHeroMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            // TODO Move same logic for Thrud placement in one func!
            const strategySuitIndex: number =
                currentMoveArguments.findIndex((suit: SuitNames): boolean =>
                    suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument: CanBeUndefType<SuitNames> = currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceYludHeroMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IMoveCoinsArguments[]> =>
            DrawPlayersBoardsCoins({ G, ctx, ...rest },
                SoloBotAndvariCommonMoveValidatorNames.SoloBotAndvariClickCoinToUpgradeMoveValidator) as
            MoveArgumentsType<IMoveCoinsArguments[]>,
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>): IMoveCoinsArguments => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    myPlayerID);
            }
            const coins: PublicPlayerCoinType[] = player.boardCoins,
                minValue: number = CheckMinCoinVisibleValueForSoloBotAndvari({ G, ctx, myPlayerID, ...rest },
                    currentMoveArguments);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота Андвари с id '${myPlayerID}' не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId: number = CheckMinCoinIndexForSoloBotAndvari(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота Андвари с id '${myPlayerID}' не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotAndvariClickCoinToUpgradeMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, id: IMoveCoinsArguments): boolean =>
            myPlayerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, myPlayerID, ...rest }, id),
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawPlayersHandsCoins({ G, ctx, ...rest },
                CommonMoveValidatorNames.AddCoinToPouchMoveValidator) as MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.AddCoinToPouchMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit({ G, ctx, ...rest },
                CommonMoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawCamp({ G, ctx, ...rest },
                CommonMoveValidatorNames.ClickCampCardHoldaMoveValidator) as MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardHoldaMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    // TODO Is it need for solo bot and andvari!?
    PickConcreteCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IMoveCoinsArguments[]> =>
            (DrawPlayersBoardsCoins({ G, ctx, ...rest },
                CommonMoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) as
                MoveArgumentsType<IMoveCoinsArguments[]>).concat(
                    DrawPlayersHandsCoins({ G, ctx, ...rest },
                        CommonMoveValidatorNames.PickConcreteCoinToUpgradeMoveValidator) as
                    MoveArgumentsType<IMoveCoinsArguments[]>),
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>): IMoveCoinsArguments => {
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.PickConcreteCoinToUpgradeMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, id: IMoveCoinsArguments): boolean =>
            myPlayerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, myPlayerID, ...rest }, id),
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IMoveCoinsArguments[]> =>
            (DrawPlayersBoardsCoins({ G, ctx, ...rest },
                CommonMoveValidatorNames.ClickCoinToUpgradeMoveValidator) as
                MoveArgumentsType<IMoveCoinsArguments[]>).concat(
                    DrawPlayersHandsCoins({ G, ctx, ...rest },
                        CommonMoveValidatorNames.ClickCoinToUpgradeMoveValidator) as
                    MoveArgumentsType<IMoveCoinsArguments[]>),
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>): IMoveCoinsArguments => {
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickCoinToUpgradeMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, id: IMoveCoinsArguments): boolean =>
            myPlayerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, myPlayerID, ...rest }, id),
    },
    ClickHeroCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawHeroes({ G, ctx, ...rest },
                CommonMoveValidatorNames.ClickHeroCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickHeroCardMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, id: number): boolean => {
            let isValid = false;
            const hero: CanBeUndefType<IHeroCard> = G.heroes[id];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${id}'.`);
            }
            const validators: CanBeUndefType<IPickValidatorsConfig> = hero.pickValidators;
            if (validators !== undefined) {
                let validator: PickHeroCardValidatorNamesKeyofTypeofType,
                    _exhaustiveCheck: never;
                for (validator in validators) {
                    if (validator === PickHeroCardValidatorNames.conditions) {
                        isValid = IsCanPickHeroWithConditionsValidator({ G, ctx, myPlayerID, ...rest }, id);
                    } else if (validator === PickHeroCardValidatorNames.discardCard) {
                        isValid =
                            IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator({ G, ctx, myPlayerID, ...rest }, id);
                    } else {
                        _exhaustiveCheck = validator;
                        throw new Error(`Отсутствует валидатор для выбора карты героя.`);
                        return _exhaustiveCheck;
                    }
                }
            } else {
                isValid = true;
            }
            return myPlayerID === ctx.currentPlayer && isValid;
        },
    },
    DiscardTopCardFromSuitMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID):
            MoveArgumentsType<Partial<SuitPropertyType<number[]>>> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                CommonMoveValidatorNames.DiscardTopCardFromSuitMoveValidator) as
            MoveArgumentsType<Partial<SuitPropertyType<number[]>>>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<Partial<SuitPropertyType<number[]>>>): IMoveSuitCardCurrentId => {
            const suitNamesArray: SuitNames[] = [];
            let suit: SuitNames;
            for (suit in currentMoveArguments) {
                suitNamesArray.push(suit);
            }
            const suitName: CanBeUndefType<SuitNames> =
                suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
            const moveArgumentForSuit: CanBeUndefType<number[]> = currentMoveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
            }
            const moveArgument: CanBeUndefType<number> =
                moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardTopCardFromSuitMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
            MoveArgumentsType<IMoveCardsArguments> => DrawPlayersBoards({ G, ctx, ...rest },
                CommonMoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator,
                Number(myPlayerID)) as MoveArgumentsType<IMoveCardsArguments>,
        getValue: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<IMoveCardsArguments>): MoveCardIdType => {
            // TODO Check myPlayerID here!!!
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    myPlayerID);
            }
            const cardFirst: CanBeUndefType<PlayerCardType> = player.cards[SuitNames.warrior][0];
            if (cardFirst === undefined) {
                throw new Error(`В массиве карт игрока во фракции '${SuitNames.warrior}' отсутствует первая карта.`);
            }
            let minCardIndex = 0,
                minCardValue: CanBeNullType<number> = cardFirst.points;
            currentMoveArguments.cards.forEach((value: number, index: number): void => {
                const card: CanBeUndefType<PlayerCardType> = player.cards[SuitNames.warrior][value];
                if (card === undefined) {
                    throw new Error(`В массиве карт игрока во фракции '${SuitNames.warrior}' отсутствует карта ${value}.`);
                }
                const cardPoints: CanBeNullType<number> = card.points;
                if (cardPoints === null || minCardValue === null) {
                    throw new Error(`Фракция должна иметь параметр 'points'.`);
                }
                if (cardPoints < minCardValue) {
                    minCardIndex = index;
                    minCardValue = cardPoints;
                }
            });
            const cardIndex: CanBeUndefType<number> = currentMoveArguments.cards[minCardIndex];
            if (cardIndex === undefined) {
                throw new Error(`В массиве аргументов для 'cardId' отсутствует значение с id '${minCardIndex}'.`);
            }
            return {
                cardId: cardIndex,
            };
        },
        moveName: CardMoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot myPlayerID === ctx.currentPlayer & for Bot myPlayerID exists in playersNum and card not hero?
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    PickDiscardCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<number[]> =>
            DrawDiscardedCards({ G, ctx, ...rest },
                CommonMoveValidatorNames.PickDiscardCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID, currentMoveArguments: MoveArgumentsType<number[]>):
            number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.PickDiscardCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    PlaceMultiSuitCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                CommonMoveValidatorNames.PlaceMultiSuitCardMoveValidator) as
            MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            const moveArgument: CanBeUndefType<SuitNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceMultiSuitCardMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<SuitNames[]> =>
            DrawPlayersBoards({ G, ctx, ...rest },
                CommonMoveValidatorNames.PlaceThrudHeroMoveValidator) as MoveArgumentsType<SuitNames[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<SuitNames[]>): SuitNames => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement!
            const moveArgument: CanBeUndefType<SuitNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceThrudHeroMove,
        validate: ({ ctx, myPlayerID }: MyFnContextWithMyPlayerID): boolean => myPlayerID === ctx.currentPlayer,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        getRange: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID): MoveArgumentsType<IMoveCoinsArguments[]> =>
            DrawPlayersBoardsCoins({ G, ctx, ...rest },
                CommonMoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) as
            MoveArgumentsType<IMoveCoinsArguments[]>,
        getValue: ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
            currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>): IMoveCoinsArguments => {
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, id: IMoveCoinsArguments): boolean => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    myPlayerID);
            }
            return myPlayerID === ctx.currentPlayer && player.stack[0]?.coinId !== id.coinId
                && CoinUpgradeValidation({ G, ctx, myPlayerID, ...rest }, id);
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
    default: null,
    ChooseDifficultySoloMode: {
        ChooseDifficultyLevelForSoloMode: {
            ChooseDifficultyLevelForSoloModeMove: moveValidators.ChooseDifficultyLevelForSoloModeMoveValidator,
        },
        ChooseHeroForDifficultySoloMode: {
            ChooseHeroForDifficultySoloModeMove: moveValidators.ChooseHeroForDifficultySoloModeMoveValidator,
        },
        // Solo Bot
        SoloBotClickCoinToUpgrade: {
            SoloBotClickCoinToUpgradeMove: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
        },
    },
    ChooseDifficultySoloModeAndvari: {
        ChooseStrategyVariantForSoloModeAndvari: {
            ChooseStrategyVariantForSoloModeAndvariMove:
                moveValidators.ChooseStrategyVariantForSoloModeAndvariMoveValidator,
        },
        ChooseStrategyForSoloModeAndvari: {
            ChooseStrategyForSoloModeAndvariMove: moveValidators.ChooseStrategyForSoloModeAndvariMoveValidator,
        },
    },
    Bids: {
        ClickHandCoin: {
            ClickHandCoinMove: moveValidators.ClickHandCoinMoveValidator,
        },
        ClickBoardCoin: {
            ClickBoardCoinMove: moveValidators.ClickBoardCoinMoveValidator,
        },
        // Bots
        BotsPlaceAllCoins: {
            BotsPlaceAllCoinsMove: moveValidators.BotsPlaceAllCoinsMoveValidator,
        },
        // Solo Bot
        SoloBotPlaceAllCoins: {
            SoloBotPlaceAllCoinsMove: moveValidators.SoloBotPlaceAllCoinsMoveValidator,
        },
        // Solo Bot Andvari
        SoloBotAndvariPlaceAllCoins: {
            SoloBotAndvariPlaceAllCoinsMove: moveValidators.SoloBotAndvariPlaceAllCoinsMoveValidator,
        },
    },
    BidUline: {
        ClickHandCoinUline: {
            ClickHandCoinUlineMove: moveValidators.ClickHandCoinUlineMoveValidator,
        },
    },
    TavernsResolution: {
        ClickCard: {
            ClickCardMove: moveValidators.ClickCardMoveValidator,
        },
        ClickCampCard: {
            ClickCampCardMove: moveValidators.ClickCampCardMoveValidator,
        },
        // TODO Check/Fix
        // start
        AddCoinToPouch: {
            AddCoinToPouchMove: moveValidators.AddCoinToPouchMoveValidator,
        },
        ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove:
                moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        },
        DiscardTopCardFromSuit: {
            DiscardTopCardFromSuitMove: moveValidators.DiscardTopCardFromSuitMoveValidator,
        },
        DiscardSuitCardFromPlayerBoard: {
            DiscardSuitCardFromPlayerBoardMove: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        },
        ClickCampCardHolda: {
            ClickCampCardHoldaMove: moveValidators.ClickCampCardHoldaMoveValidator,
        },
        PickConcreteCoinToUpgrade: {
            PickConcreteCoinToUpgradeMove: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        },
        PickDiscardCard: {
            PickDiscardCardMove: moveValidators.PickDiscardCardMoveValidator,
        },
        ClickHeroCard: {
            ClickHeroCardMove: moveValidators.ClickHeroCardMoveValidator,
        },
        PlaceMultiSuitCard: {
            PlaceMultiSuitCardMove: moveValidators.PlaceMultiSuitCardMoveValidator,
        },
        PlaceThrudHero: {
            PlaceThrudHeroMove: moveValidators.PlaceThrudHeroMoveValidator,
        },
        ClickCoinToUpgrade: {
            ClickCoinToUpgradeMove: moveValidators.ClickCoinToUpgradeMoveValidator,
        },
        UpgradeCoinVidofnirVedrfolnir: {
            UpgradeCoinVidofnirVedrfolnirMove: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        },
        // end
        ActivateGiantAbilityOrPickCard: {
            ClickCardNotGiantAbilityMove: moveValidators.ClickCardNotGiantAbilityMoveValidator,
            ClickGiantAbilityNotCardMove: moveValidators.ClickGiantAbilityNotCardMoveValidator,
        },
        ActivateGodAbilityOrNot: {
            ActivateGodAbilityMove: moveValidators.ActivateGodAbilityMoveValidator,
            NotActivateGodAbilityMove: moveValidators.NotActivateGodAbilityMoveValidator,
        },
        ChooseCoinValueForHrungnirUpgrade: {
            ChooseCoinValueForHrungnirUpgradeMove: moveValidators.ChooseCoinValueForHrungnirUpgradeMoveValidator,
        },
        ChooseSuitOlrun: {
            ChooseSuitOlrunMove: moveValidators.ChooseSuitOlrunMoveValidator,
        },
        DiscardCard2Players: {
            DiscardCard2PlayersMove: moveValidators.DiscardCard2PlayersMoveValidator,
        },
        GetMythologyCard: {
            GetMythologyCardMove: moveValidators.GetMythologyCardMoveValidator,
        },
        ClickHandTradingCoinUline: {
            ClickHandTradingCoinUlineMove: moveValidators.ClickHandTradingCoinUlineMoveValidator,
        },
        // Solo Bot
        SoloBotClickCard: {
            SoloBotClickCardMove: moveValidators.SoloBotClickCardMoveValidator,
        },
        // Common Solo Bot Start
        SoloBotClickHeroCard: {
            SoloBotClickHeroCardMove: moveValidators.SoloBotClickHeroCardMoveValidator,
        },
        SoloBotPlaceThrudHero: {
            SoloBotPlaceThrudHeroMove: moveValidators.SoloBotPlaceThrudHeroMoveValidator,
        },
        SoloBotClickCoinToUpgrade: {
            SoloBotClickCoinToUpgradeMove: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
        },
        // Common Solo Bot End
        // Solo Bot Andvari
        SoloBotAndvariClickCard: {
            SoloBotAndvariClickCardMove: moveValidators.SoloBotAndvariClickCardMoveValidator,
        },
        // Common Solo Bot Andvari Start
        SoloBotAndvariClickHeroCard: {
            SoloBotAndvariClickHeroCardMove: moveValidators.SoloBotAndvariClickHeroCardMoveValidator,
        },
        SoloBotAndvariPlaceThrudHero: {
            SoloBotAndvariPlaceThrudHeroMove: moveValidators.SoloBotAndvariPlaceThrudHeroMoveValidator,
        },
        SoloBotAndvariClickCoinToUpgrade: {
            SoloBotAndvariClickCoinToUpgradeMove: moveValidators.SoloBotAndvariClickCoinToUpgradeMoveValidator,
        },
        // Common Solo Bot Andvari End
    },
    EnlistmentMercenaries: {
        StartEnlistmentMercenaries: {
            StartEnlistmentMercenariesMove: moveValidators.StartEnlistmentMercenariesMoveValidator,
        },
        PassEnlistmentMercenaries: {
            PassEnlistmentMercenariesMove: moveValidators.PassEnlistmentMercenariesMoveValidator,
        },
        GetEnlistmentMercenaries: {
            GetEnlistmentMercenariesMove: moveValidators.GetEnlistmentMercenariesMoveValidator,
        },
        PlaceEnlistmentMercenaries: {
            PlaceEnlistmentMercenariesMove: moveValidators.PlaceEnlistmentMercenariesMoveValidator,
        },
        // start
        AddCoinToPouch: {
            AddCoinToPouchMove: moveValidators.AddCoinToPouchMoveValidator,
        },
        ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove:
                moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        },
        DiscardTopCardFromSuit: {
            DiscardTopCardFromSuitMove: moveValidators.DiscardTopCardFromSuitMoveValidator,
        },
        DiscardSuitCardFromPlayerBoard: {
            DiscardSuitCardFromPlayerBoardMove: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        },
        ClickCampCardHolda: {
            ClickCampCardHoldaMove: moveValidators.ClickCampCardHoldaMoveValidator,
        },
        PickConcreteCoinToUpgrade: {
            PickConcreteCoinToUpgradeMove: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        },
        PickDiscardCard: {
            PickDiscardCardMove: moveValidators.PickDiscardCardMoveValidator,
        },
        ClickHeroCard: {
            ClickHeroCardMove: moveValidators.ClickHeroCardMoveValidator,
        },
        PlaceMultiSuitCard: {
            PlaceMultiSuitCardMove: moveValidators.PlaceMultiSuitCardMoveValidator,
        },
        PlaceThrudHero: {
            PlaceThrudHeroMove: moveValidators.PlaceThrudHeroMoveValidator,
        },
        ClickCoinToUpgrade: {
            ClickCoinToUpgradeMove: moveValidators.ClickCoinToUpgradeMoveValidator,
        },
        UpgradeCoinVidofnirVedrfolnir: {
            UpgradeCoinVidofnirVedrfolnirMove: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        },
        // end
    },
    PlaceYlud: {
        PlaceYludHero: {
            PlaceYludHeroMove: moveValidators.PlaceYludHeroMoveValidator,
        },
        // start
        AddCoinToPouch: {
            AddCoinToPouchMove: moveValidators.AddCoinToPouchMoveValidator,
        },
        ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove:
                moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        },
        DiscardTopCardFromSuit: {
            DiscardTopCardFromSuitMove: moveValidators.DiscardTopCardFromSuitMoveValidator,
        },
        DiscardSuitCardFromPlayerBoard: {
            DiscardSuitCardFromPlayerBoardMove: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        },
        ClickCampCardHolda: {
            ClickCampCardHoldaMove: moveValidators.ClickCampCardHoldaMoveValidator,
        },
        PickConcreteCoinToUpgrade: {
            PickConcreteCoinToUpgradeMove: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        },
        PickDiscardCard: {
            PickDiscardCardMove: moveValidators.PickDiscardCardMoveValidator,
        },
        ClickHeroCard: {
            ClickHeroCardMove: moveValidators.ClickHeroCardMoveValidator,
        },
        PlaceMultiSuitCard: {
            PlaceMultiSuitCardMove: moveValidators.PlaceMultiSuitCardMoveValidator,
        },
        PlaceThrudHero: {
            PlaceThrudHeroMove: moveValidators.PlaceThrudHeroMoveValidator,
        },
        ClickCoinToUpgrade: {
            ClickCoinToUpgradeMove: moveValidators.ClickCoinToUpgradeMoveValidator,
        },
        UpgradeCoinVidofnirVedrfolnir: {
            UpgradeCoinVidofnirVedrfolnirMove: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        },
        // end
        // Solo Bot
        SoloBotPlaceYludHero: {
            SoloBotPlaceYludHeroMove: moveValidators.SoloBotPlaceYludHeroMoveValidator,
        },
        // Common Solo Bot Start
        SoloBotClickHeroCard: {
            SoloBotClickHeroCardMove: moveValidators.SoloBotClickHeroCardMoveValidator,
        },
        SoloBotPlaceThrudHero: {
            SoloBotPlaceThrudHeroMove: moveValidators.SoloBotPlaceThrudHeroMoveValidator,
        },
        SoloBotClickCoinToUpgrade: {
            SoloBotClickCoinToUpgradeMove: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
        },
        // Common Solo Bot End
        // Solo Bot Andvari
        SoloBotAndvariPlaceYludHero: {
            SoloBotAndvariPlaceYludHeroMove: moveValidators.SoloBotAndvariPlaceYludHeroMoveValidator,
        },
        // Common Solo Bot Andvari Start
        SoloBotAndvariClickHeroCard: {
            SoloBotAndvariClickHeroCardMove: moveValidators.SoloBotAndvariClickHeroCardMoveValidator,
        },
        SoloBotAndvariPlaceThrudHero: {
            SoloBotAndvariPlaceThrudHeroMove: moveValidators.SoloBotAndvariPlaceThrudHeroMoveValidator,
        },
        SoloBotAndvariClickCoinToUpgrade: {
            SoloBotAndvariClickCoinToUpgradeMove: moveValidators.SoloBotAndvariClickCoinToUpgradeMoveValidator,
        },
        // Common Solo Bot Andvari End
    },
    TroopEvaluation: {
        ClickDistinctionCard: {
            ClickDistinctionCardMove: moveValidators.ClickDistinctionCardMoveValidator,
        },
        // start
        AddCoinToPouch: {
            AddCoinToPouchMove: moveValidators.AddCoinToPouchMoveValidator,
        },
        ChooseCoinValueForVidofnirVedrfolnirUpgrade: {
            ChooseCoinValueForVidofnirVedrfolnirUpgradeMove:
                moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        },
        DiscardTopCardFromSuit: {
            DiscardTopCardFromSuitMove: moveValidators.DiscardTopCardFromSuitMoveValidator,
        },
        DiscardSuitCardFromPlayerBoard: {
            DiscardSuitCardFromPlayerBoardMove: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        },
        ClickCampCardHolda: {
            ClickCampCardHoldaMove: moveValidators.ClickCampCardHoldaMoveValidator,
        },
        PickConcreteCoinToUpgrade: {
            PickConcreteCoinToUpgradeMove: moveValidators.PickConcreteCoinToUpgradeMoveValidator,
        },
        PickDiscardCard: {
            PickDiscardCardMove: moveValidators.PickDiscardCardMoveValidator,
        },
        ClickHeroCard: {
            ClickHeroCardMove: moveValidators.ClickHeroCardMoveValidator,
        },
        PlaceMultiSuitCard: {
            PlaceMultiSuitCardMove: moveValidators.PlaceMultiSuitCardMoveValidator,
        },
        PlaceThrudHero: {
            PlaceThrudHeroMove: moveValidators.PlaceThrudHeroMoveValidator,
        },
        ClickCoinToUpgrade: {
            ClickCoinToUpgradeMove: moveValidators.ClickCoinToUpgradeMoveValidator,
        },
        UpgradeCoinVidofnirVedrfolnir: {
            UpgradeCoinVidofnirVedrfolnirMove: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        },
        // end
        ClickCardToPickDistinction: {
            ClickCardToPickDistinctionMove: moveValidators.ClickCardToPickDistinctionMoveValidator,
        },
        // Solo Bot
        SoloBotClickCardToPickDistinction: {
            SoloBotClickCardToPickDistinctionMove: moveValidators.SoloBotClickCardToPickDistinctionMoveValidator,
        },
        // Common Solo Bot Start
        SoloBotClickHeroCard: {
            SoloBotClickHeroCardMove: moveValidators.SoloBotClickHeroCardMoveValidator,
        },
        SoloBotPlaceThrudHero: {
            SoloBotPlaceThrudHeroMove: moveValidators.SoloBotPlaceThrudHeroMoveValidator,
        },
        SoloBotClickCoinToUpgrade: {
            SoloBotClickCoinToUpgradeMove: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
        },
        // Common Solo Bot End
        // Solo Bot Andvari
        SoloBotAndvariClickCardToPickDistinction: {
            SoloBotAndvariClickCardToPickDistinctionMove:
                moveValidators.SoloBotAndvariClickCardToPickDistinctionMoveValidator,
        },
        // Common Solo Bot Andvari Start
        SoloBotAndvariClickHeroCard: {
            SoloBotAndvariClickHeroCardMove: moveValidators.SoloBotAndvariClickHeroCardMoveValidator,
        },
        SoloBotAndvariPlaceThrudHero: {
            SoloBotAndvariPlaceThrudHeroMove: moveValidators.SoloBotAndvariPlaceThrudHeroMoveValidator,
        },
        SoloBotAndvariClickCoinToUpgrade: {
            SoloBotAndvariClickCoinToUpgradeMove: moveValidators.SoloBotAndvariClickCoinToUpgradeMoveValidator,
        },
        // Common Solo Bot Andvari End
    },
    BrisingamensEndGame: {
        DiscardCardFromPlayerBoard: {
            DiscardCardFromPlayerBoardMove: moveValidators.DiscardCardFromPlayerBoardMoveValidator,
        },
    },
    GetMjollnirProfit: {
        GetMjollnirProfit: {
            GetMjollnirProfitMove: moveValidators.GetMjollnirProfitMoveValidator,
        },
    },
};

// TODO Move to function generic type with extends number & SuitNames
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
 * @returns Валидация значений мувов.
 */
const ValidateByArrayValues = <T>(value: T, values: T[]): boolean => values.includes(value);

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
 * @returns Валидация монет.
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
 * @returns Валидация карт.
 */
const ValidateByObjectSuitCardIdValues = (value: IMoveSuitCardCurrentId,
    values: Partial<SuitPropertyType<number[]>>): boolean => {
    const objectSuitCardIdValues: CanBeUndefType<number[]> = values[value.suit];
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
 * @returns Валидация карт.
 */
const ValidateByObjectCardIdValues = (value: MoveCardIdType, values: IMoveCardsArguments): boolean =>
    values.cards.includes(value.cardId);

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
* @returns Валидация карт.
*/
const ValidateObjectEqualValues = (value: IDwarfCard, values: IDwarfCard): boolean => {
    const props1: KeyofType<IDwarfCard>[] = Object.getOwnPropertyNames(value) as KeyofType<IDwarfCard>[],
        props2: KeyofType<IDwarfCard>[] = Object.getOwnPropertyNames(values) as KeyofType<IDwarfCard>[];
    if (props1.length !== props2.length) {
        return false;
    }
    for (let i = 0; i < props1.length; i += 1) {
        const prop = props1[i];
        if (prop === undefined) {
            throw new Error(`Не существует такого 'prop'.`);
        }
        if (value[prop] !== values[prop]) {
            return false;
        }
    }
    return true;
};
