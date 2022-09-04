import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { CheckSoloBotAndvariMustTakeCardFromGeneralStrategy, CheckSoloBotAndvariMustTakeCardToPickHero, CheckSoloBotAndvariMustTakeRoyalOfferingCard, SoloBotMustTakeCardFromReserveStrategy } from "./bot_logic/SoloBotAndvariCardLogic";
import { CheckSoloBotCanPickHero, CheckSoloBotMustTakeCardToPickHero, CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard, CheckSoloBotMustTakeRoyalOfferingCard, CheckSuitsLeastPresentOnPlayerBoard, SoloBotMustTakeRandomCard } from "./bot_logic/SoloBotCardLogic";
import { IsCoin } from "./Coin";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { IsMercenaryCampCard } from "./helpers/IsCampTypeHelpers";
import { HasLowestPriority } from "./helpers/PriorityHelpers";
import { CheckMinCoinIndexForSoloBotAndvari, CheckMinCoinVisibleIndexForSoloBot, CheckMinCoinVisibleValueForSoloBot, CheckMinCoinVisibleValueForSoloBotAndvari } from "./helpers/SoloBotHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { AutoBotsMoveNames, BuffNames, ButtonMoveNames, CardMoveNames, CoinMoveNames, CoinTypeNames, EmptyCardMoveNames, ErrorNames, GameModeNames, MoveValidatorNames, PhaseNames, PickHeroCardValidatorNames, RusCardTypeNames, SoloGameAndvariStrategyNames, StageNames, SuitMoveNames, SuitNames } from "./typescript/enums";
import type { CanBeNullType, CanBeUndefType, CoinType, Ctx, DeckCardType, IHeroCard, IMoveBy, IMoveByBidOptions, IMoveByBidUlineOptions, IMoveByBrisingamensEndGameOptions, IMoveByChooseDifficultySoloModeAndvariOptions, IMoveByChooseDifficultySoloModeOptions, IMoveByEnlistmentMercenariesOptions, IMoveByGetMjollnirProfitOptions, IMoveByPlaceYludOptions, IMoveByTavernsResolutionOptions, IMoveByTroopEvaluationOptions, IMoveCardsPlayerIdArguments, IMoveCoinsArguments, IMoveSuitCardCurrentId, IMoveValidator, IMoveValidators, IMyGameState, IPickValidatorsConfig, IPlayer, IPublicPlayer, KeyofType, MoveArgumentsType, MoveCardPlayerCurrentIdType, MoveValidatorGetRangeType, MythologicalCreatureDeckCardType, PickHeroCardValidatorNamesKeyofTypeofType, PlayerCardType, PublicPlayerCoinType, SoloGameAndvariStrategyVariantLevelType, SoloGameDifficultyLevelArgType, SuitNamesKeyofTypeofType, SuitPropertyType, TavernAllCardType, TavernCardType, ValidMoveIdParamType } from "./typescript/interfaces";
import { DrawCamp, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ChooseStrategyForSoloModeAndvariProfit, ChooseStrategyVariantForSoloModeAndvariProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit } from "./ui/ProfitUI";

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
 * @returns Валидация обмена монет.
 */
export const CoinUpgradeValidation = (G: IMyGameState, ctx: Ctx, coinData: IMoveCoinsArguments): boolean => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
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
 * @param G
 * @param ctx
 * @param stage Стадия.
 * @param id Данные для валидации.
 * @returns Валидный ли мув.
 */
export const IsValidMove = (G: IMyGameState, ctx: Ctx, stage: StageNames, id: ValidMoveIdParamType): boolean => {
    const validator: IMoveValidator<MoveValidatorGetRangeType> = GetValidator(ctx.phase, stage);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid = ValidateByValues<number>(id, validator.getRange(G, ctx) as number[]);
        } else if (typeof id === `string`) {
            isValid = ValidateByValues<SuitNamesKeyofTypeofType | SoloGameAndvariStrategyNames>(id,
                validator.getRange(G, ctx) as SuitNamesKeyofTypeofType[] | SoloGameAndvariStrategyNames[]);
        } else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx) as
                    IMoveCoinsArguments[]);
            } else if (`playerId` in id) {
                isValid = ValidateByObjectSuitCardIdPlayerIdValues(id,
                    validator.getRange(G, ctx, id.playerId) as IMoveCardsPlayerIdArguments);
            } else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange(G, ctx) as
                    Partial<SuitPropertyType<number[]>>);
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
 * @returns Валидатор.
 */
export const GetValidator = (phase: PhaseNames, stage: StageNames): IMoveValidator<MoveValidatorGetRangeType> => {
    let validator: IMoveValidator<MoveValidatorGetRangeType>,
        _exhaustiveCheck: never;
    switch (phase) {
        case PhaseNames.ChooseDifficultySoloMode:
            validator = moveBy[phase][stage as KeyofType<IMoveByChooseDifficultySoloModeOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.ChooseDifficultySoloModeAndvari:
            validator = moveBy[phase][stage as KeyofType<IMoveByChooseDifficultySoloModeAndvariOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.Bids:
            validator = moveBy[phase][stage as KeyofType<IMoveByBidOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.BidUline:
            validator = moveBy[phase][stage as KeyofType<IMoveByBidUlineOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.TavernsResolution:
            validator = moveBy[phase][stage as KeyofType<IMoveByTavernsResolutionOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.EnlistmentMercenaries:
            validator = moveBy[phase][stage as KeyofType<IMoveByEnlistmentMercenariesOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.PlaceYlud:
            validator = moveBy[phase][stage as KeyofType<IMoveByPlaceYludOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.TroopEvaluation:
            validator = moveBy[phase][stage as KeyofType<IMoveByTroopEvaluationOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.BrisingamensEndGame:
            validator = moveBy[phase][stage as KeyofType<IMoveByBrisingamensEndGameOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
            break;
        case PhaseNames.GetMjollnirProfit:
            validator = moveBy[phase][stage as KeyofType<IMoveByGetMjollnirProfitOptions>] as
                IMoveValidator<MoveValidatorGetRangeType>;
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
    ClickBoardCoinMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawPlayersBoardsCoins(G, ctx,
            MoveValidatorNames.ClickBoardCoinMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickBoardCoinMove,
        validate: (): boolean => true,
    },
    ClickCampCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawCamp(G, ctx,
            MoveValidatorNames.ClickCampCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardMove,
        validate: (G: IMyGameState, ctx: Ctx): boolean => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            return G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                || (!G.campPicked && CheckPlayerHasBuff(player, BuffNames.GoCamp)));
        },
    },
    ClickCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawTaverns(G, ctx,
            MoveValidatorNames.ClickCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            // TODO Get MythologicalCreature cards for AI bots...
            const uniqueArr: (DeckCardType | MythologicalCreatureDeckCardType)[] = [],
                currentTavern: TavernAllCardType = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < currentMoveArguments.length; i++) {
                const moveArgument: CanBeUndefType<number> = currentMoveArguments[i];
                if (moveArgument === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
                }
                const tavernCard: CanBeUndefType<TavernCardType> = currentTavern[moveArgument];
                if (tavernCard === undefined) {
                    throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
                }
                if (tavernCard === null) {
                    throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карты с id '${moveArgument}'.`);
                }
                if (currentTavern.some((card: TavernCardType): boolean =>
                    CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse: boolean =
                    EvaluateCard(G, ctx, tavernCard, moveArgument, currentTavern) < 0,
                    isExistCardNotWorse: boolean =
                        currentTavern.some((card: TavernCardType): boolean => (card !== null)
                            && (EvaluateCard(G, ctx, tavernCard, moveArgument,
                                currentTavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength: number = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard: CanBeUndefType<DeckCardType | MythologicalCreatureDeckCardType> =
                        uniqueArr[j];
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
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.ClickCardMove,
        validate: (): boolean => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => ExplorerDistinctionProfit(G, ctx,
            MoveValidatorNames.ClickCardToPickDistinctionMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCardToPickDistinctionMove,
        validate: (): boolean => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawDistinctions(G, ctx, MoveValidatorNames.ClickDistinctionCardMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickDistinctionCardMove,
        validate: (): boolean => true,
    },
    ClickHandCoinMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawPlayersHandsCoins(G, ctx,
            MoveValidatorNames.ClickHandCoinMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinMove,
        validate: (): boolean => true,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawPlayersHandsCoins(G, ctx,
            MoveValidatorNames.ClickHandCoinUlineMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinUlineMove,
        validate: (): boolean => true,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawPlayersHandsCoins(G, ctx,
            MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandTradingCoinUlineMove,
        validate: (): boolean => true,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<Partial<SuitPropertyType<number[]>>> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator) as
            MoveArgumentsType<Partial<SuitPropertyType<number[]>>>,
        getValue: (G: IMyGameState, ctx: Ctx,
            currentMoveArguments: MoveArgumentsType<Partial<SuitPropertyType<number[]>>>): IMoveSuitCardCurrentId => {
            const suitNames: SuitNamesKeyofTypeofType[] = [];
            let suit: SuitNamesKeyofTypeofType;
            for (suit in currentMoveArguments) {
                suitNames.push(suit);
            }
            const suitName: CanBeUndefType<SuitNamesKeyofTypeofType> =
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
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardCardFromPlayerBoardMove,
        validate: (): boolean => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawTaverns(G, ctx,
            MoveValidatorNames.DiscardCard2PlayersMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.DiscardCard2PlayersMove,
        validate: (): boolean => true,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawPlayersBoards(G, ctx,
            MoveValidatorNames.GetEnlistmentMercenariesMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.GetEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.GetMjollnirProfitMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            const totalSuitsRanks: number[] = [];
            for (let j = 0; j < currentMoveArguments.length; j++) {
                const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                const moveArgumentI: CanBeUndefType<SuitNamesKeyofTypeofType> = currentMoveArguments[j];
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
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> = currentMoveArguments[index];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${index}'.`);
            }
            return moveArgument;
        },
        moveName: SuitMoveNames.GetMjollnirProfitMove,
        validate: (): boolean => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: (): MoveArgumentsType<null> => null,
        getValue: (): null => null,
        moveName: ButtonMoveNames.PassEnlistmentMercenariesMove,
        validate: (G: IMyGameState, ctx: Ctx): boolean => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            const mercenariesCount = player.campCards.filter(IsMercenaryCampCard).length;
            return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceYludHeroMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceYludHeroMove,
        validate: (): boolean => true,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: (): MoveArgumentsType<null> => null,
        getValue: (): null => null,
        moveName: ButtonMoveNames.StartEnlistmentMercenariesMove,
        validate: (): boolean => true,
    },
    // Bots
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G: IMyGameState): MoveArgumentsType<number[][]> => G.botData.allCoinsOrder,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[][]>): number[] => {
            const hasLowestPriority: boolean = HasLowestPriority(G, ctx, Number(ctx.currentPlayer));
            let resultsForCoins: number[] = CheckHeuristicsForCoinsPlacement(G, ctx);
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
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
                privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            if (privatePlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
                    ctx.currentPlayer);
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
                        handCoins.every((coin: PublicPlayerCoinType, index: number): boolean => {
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
                        coinsOrderPositionForMaxCoin: CanBeUndefType<number> = allCoinsOrderI[positionForMaxCoin],
                        coinsOrderPositionForMinCoin: CanBeUndefType<number> = allCoinsOrderI[positionForMinCoin];
                    if (coinsOrderPositionForMaxCoin !== undefined && coinsOrderPositionForMinCoin !== undefined) {
                        const maxCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinsOrderPositionForMaxCoin],
                            minCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinsOrderPositionForMinCoin];
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
                                const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[coinIndex];
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
                                handCoins.filter((coin: PublicPlayerCoinType, index: number): boolean => {
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
        moveName: AutoBotsMoveNames.BotsPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    // Solo Bot
    SoloBotPlaceAllCoinsMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[][]> => DrawPlayersHandsCoins(G, ctx,
            MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator) as MoveArgumentsType<number[][]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[][]>): number[] => {
            const moveArgument: CanBeUndefType<number[]> = currentMoveArguments[0];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    SoloBotClickCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawTaverns(G, ctx,
            MoveValidatorNames.SoloBotClickCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            // TODO If last round of tier 0 => get card not given distinction to other player and get for you if can' take hero or least present! If last round of the game => get most valuable points if can't pick hero anymore (can't check least present)!
            let moveArgument: CanBeUndefType<number>;
            moveArgument = CheckSoloBotMustTakeCardToPickHero(G, ctx, currentMoveArguments);
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard(G, ctx,
                    currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotMustTakeRoyalOfferingCard(G, ctx, currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = SoloBotMustTakeRandomCard(G, ctx, currentMoveArguments);
            }
            if (moveArgument !== undefined) {
                return moveArgument;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.SoloBotClickCardMove,
        validate: (): boolean => true,
    },
    SoloBotClickHeroCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawHeroesForSoloBotUI(G, ctx,
            MoveValidatorNames.SoloBotClickHeroCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickHeroCardMove,
        validate: (): boolean => true,
    },
    SoloBotClickCardToPickDistinctionMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => ExplorerDistinctionProfit(G, ctx,
            MoveValidatorNames.SoloBotClickCardToPickDistinctionMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickCardToPickDistinctionMove,
        validate: (): boolean => true,
    },
    SoloBotPlaceThrudHeroMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotPlaceThrudHeroMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement and move in one func!?
            let moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType>;
            const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
            if (soloBotPublicPlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    1);
            }
            const suit: CanBeUndefType<SuitNamesKeyofTypeofType> =
                CheckSoloBotCanPickHero(G, ctx, soloBotPublicPlayer);
            if (suit === undefined) {
                const [suits]: [SuitNamesKeyofTypeofType[], number] =
                    CheckSuitsLeastPresentOnPlayerBoard(G, ctx, soloBotPublicPlayer);
                if (suits.length === 0) {
                    // TODO Move Thrud/Ylud in most left suit from `suits`
                    throw new Error(`Не может не быть фракций с минимальным количеством карт.`);
                } else if (suits.length === 1) {
                    const leastPresentSuit: CanBeUndefType<SuitNamesKeyofTypeofType> = suits[0];
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
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceThrudHeroMove,
        validate: (): boolean => true,
    },
    SoloBotPlaceYludHeroMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotPlaceYludHeroMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            // TODO Same logic from Thrud placement and move in one func!?
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceYludHeroMove,
        validate: (): boolean => true,
    },
    SoloBotClickCoinToUpgradeMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<IMoveCoinsArguments[]> =>
            (DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator) as
                MoveArgumentsType<IMoveCoinsArguments[]>).concat(DrawPlayersHandsCoins(G, ctx,
                    MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator) as
                    MoveArgumentsType<IMoveCoinsArguments[]>),
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>):
            IMoveCoinsArguments => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
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
            const minValue: number =
                CheckMinCoinVisibleValueForSoloBot(G, ctx, currentMoveArguments, type);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId: number = CheckMinCoinVisibleIndexForSoloBot(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotClickCoinToUpgradeMove,
        validate: (G: IMyGameState, ctx: Ctx, id: IMoveCoinsArguments): boolean =>
            CoinUpgradeValidation(G, ctx, id),
    },
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SoloGameDifficultyLevelArgType[]> =>
            ChooseDifficultyLevelForSoloModeProfit(G, ctx,
                MoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator) as
            MoveArgumentsType<SoloGameDifficultyLevelArgType[]>,
        getValue: (G: IMyGameState, ctx: Ctx,
            currentMoveArguments: MoveArgumentsType<SoloGameDifficultyLevelArgType[]>):
            SoloGameDifficultyLevelArgType => {
            const moveArgument: CanBeUndefType<SoloGameDifficultyLevelArgType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)] as
                SoloGameDifficultyLevelArgType;
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove,
        validate: (): boolean => true,
    },
    ChooseHeroesForSoloModeMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => PickHeroesForSoloModeProfit(G, ctx,
            MoveValidatorNames.ChooseHeroesForSoloModeMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ChooseHeroForDifficultySoloModeMove,
        validate: (): boolean => true,
    },
    // Solo Mode Andvari
    ChooseStrategyVariantForSoloModeAndvariMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]> =>
            ChooseStrategyVariantForSoloModeAndvariProfit(G, ctx,
                MoveValidatorNames.ChooseStrategyVariantForSoloModeAndvariMoveValidator) as
            MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments:
            MoveArgumentsType<SoloGameAndvariStrategyVariantLevelType[]>):
            SoloGameAndvariStrategyVariantLevelType => {
            const moveArgument: CanBeUndefType<SoloGameAndvariStrategyVariantLevelType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)] as
                SoloGameAndvariStrategyVariantLevelType;
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove,
        validate: (): boolean => true,
    },
    ChooseStrategyForSoloModeAndvariMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SoloGameAndvariStrategyNames[]> =>
            ChooseStrategyForSoloModeAndvariProfit(G, ctx,
                MoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator) as
            MoveArgumentsType<SoloGameAndvariStrategyNames[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SoloGameAndvariStrategyNames[]>):
            SoloGameAndvariStrategyNames => {
            const moveArgument: CanBeUndefType<SoloGameAndvariStrategyNames> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)] as
                SoloGameAndvariStrategyNames;
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove,
        validate: (): boolean => true,
    },
    SoloBotAndvariPlaceAllCoinsMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[][]> => DrawPlayersHandsCoins(G, ctx,
            MoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator) as
            MoveArgumentsType<number[][]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[][]>): number[] => {
            const moveArgument: CanBeUndefType<number[]> = currentMoveArguments[0];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotAndvariPlaceAllCoinsMove,
        validate: (): boolean => true,
    },
    SoloBotAndvariClickCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawTaverns(G, ctx,
            MoveValidatorNames.SoloBotAndvariClickCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            let moveArgument: CanBeUndefType<number>;
            moveArgument =
                CheckSoloBotAndvariMustTakeCardFromGeneralStrategy(G, ctx, currentMoveArguments);
            if (moveArgument === undefined) {
                moveArgument =
                    CheckSoloBotAndvariMustTakeCardToPickHero(G, ctx, currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument =
                    CheckSoloBotAndvariMustTakeRoyalOfferingCard(G, ctx, currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = SoloBotMustTakeCardFromReserveStrategy(G, ctx, currentMoveArguments);
            }
            if (moveArgument !== undefined) {
                return moveArgument;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.SoloBotAndvariClickCardMove,
        validate: (): boolean => true,
    },
    SoloBotAndvariClickHeroCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawHeroes(G, ctx,
            MoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            let moveArgument: CanBeUndefType<number>;
            const dwergBrotherIndex: number = G.heroes.findIndex((hero: IHeroCard): boolean =>
                hero.active && hero.name.startsWith(`Dwerg`));
            if (dwergBrotherIndex !== -1) {
                moveArgument = dwergBrotherIndex;
            } else {
                moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            }
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickHeroCardMove,
        validate: (): boolean => true,
    },
    SoloBotAndvariClickCardToPickDistinctionMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => ExplorerDistinctionProfit(G, ctx,
            MoveValidatorNames.SoloBotAndvariClickCardToPickDistinctionMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickCardToPickDistinctionMove,
        validate: (G: IMyGameState, ctx: Ctx, id: number): boolean => id === 0,
    },
    SoloBotAndvariPlaceThrudHeroMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotAndvariPlaceThrudHeroMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Move same logic for Ylud placement in one func!
            const strategySuitIndex: number =
                currentMoveArguments.findIndex((suit: SuitNamesKeyofTypeofType): boolean =>
                    suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceThrudHeroMove,
        validate: (): boolean => true,
    },
    SoloBotAndvariPlaceYludHeroMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotAndvariPlaceYludHeroMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            // TODO Move same logic for Thrud placement in one func!
            const strategySuitIndex: number =
                currentMoveArguments.findIndex((suit: SuitNamesKeyofTypeofType): boolean =>
                    suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceYludHeroMove,
        validate: (): boolean => true,
    },
    SoloBotAndvariClickCoinToUpgradeMoveValidator: {
        // TODO Bot Andvari can't update closed coins........!
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<IMoveCoinsArguments[]> =>
            DrawPlayersBoardsCoins(G, ctx,
                MoveValidatorNames.SoloBotAndvariClickCoinToUpgradeMoveValidator) as
            MoveArgumentsType<IMoveCoinsArguments[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>):
            IMoveCoinsArguments => {
            const player: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
                    ctx.currentPlayer);
            }
            const coins: CoinType[] = player.boardCoins,
                minValue: number =
                    CheckMinCoinVisibleValueForSoloBotAndvari(G, ctx, currentMoveArguments);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота Андвари с id '${ctx.currentPlayer}' не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId: number = CheckMinCoinIndexForSoloBotAndvari(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота Андвари с id '${ctx.currentPlayer}' не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotAndvariClickCoinToUpgradeMove,
        validate: (G: IMyGameState, ctx: Ctx, id: IMoveCoinsArguments): boolean =>
            CoinUpgradeValidation(G, ctx, id),
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawPlayersHandsCoins(G, ctx,
            MoveValidatorNames.AddCoinToPouchMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.AddCoinToPouchMove,
        validate: (): boolean => true,
    },
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> =>
            ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit(G, ctx,
                MoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator) as
            MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
        validate: (): boolean => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawCamp(G, ctx,
            MoveValidatorNames.ClickCampCardHoldaMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardHoldaMove,
        validate: (): boolean => true,
    },
    // TODO Is it need for solo bot and andvari!?
    PickConcreteCoinToUpgradeMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<IMoveCoinsArguments[]> =>
            (DrawPlayersBoardsCoins(G, ctx,
                MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) as
                MoveArgumentsType<IMoveCoinsArguments[]>).concat(DrawPlayersHandsCoins(G, ctx,
                    MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator) as
                    MoveArgumentsType<IMoveCoinsArguments[]>),
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>):
            IMoveCoinsArguments => {
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickConcreteCoinToUpgradeMove,
        validate: (G: IMyGameState, ctx: Ctx, id: IMoveCoinsArguments): boolean =>
            CoinUpgradeValidation(G, ctx, id),
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<IMoveCoinsArguments[]> =>
            (DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator) as
                MoveArgumentsType<IMoveCoinsArguments[]>).concat(DrawPlayersHandsCoins(G, ctx,
                    MoveValidatorNames.ClickCoinToUpgradeMoveValidator) as
                    MoveArgumentsType<IMoveCoinsArguments[]>),
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>):
            IMoveCoinsArguments => {
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickCoinToUpgradeMove,
        validate: (G: IMyGameState, ctx: Ctx, id: IMoveCoinsArguments): boolean =>
            CoinUpgradeValidation(G, ctx, id),
    },
    ClickHeroCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawHeroes(G, ctx,
            MoveValidatorNames.ClickHeroCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickHeroCardMove,
        validate: (G: IMyGameState, ctx: Ctx, id: number): boolean => {
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
                        isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                    } else if (validator === PickHeroCardValidatorNames.discardCard) {
                        isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                    } else {
                        _exhaustiveCheck = validator;
                        throw new Error(`Отсутствует валидатор для выбора карты героя.`);
                        return _exhaustiveCheck;
                    }
                }
            } else {
                isValid = true;
            }
            return isValid;
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<Partial<SuitPropertyType<number[]>>> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardCardMoveValidator) as
            MoveArgumentsType<Partial<SuitPropertyType<number[]>>>,
        getValue: (G: IMyGameState, ctx: Ctx,
            currentMoveArguments: MoveArgumentsType<Partial<SuitPropertyType<number[]>>>): IMoveSuitCardCurrentId => {
            const suitNamesArray: SuitNamesKeyofTypeofType[] = [];
            let suit: SuitNamesKeyofTypeofType;
            for (suit in currentMoveArguments) {
                suitNamesArray.push(suit);
            }
            const suitName: CanBeUndefType<SuitNamesKeyofTypeofType> =
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
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardCardMove,
        validate: (): boolean => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx, playerId?: number): MoveArgumentsType<IMoveCardsPlayerIdArguments> => {
            if (playerId === undefined) {
                throw new Error(`Function param 'playerId' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx,
                MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator, playerId) as
                MoveArgumentsType<IMoveCardsPlayerIdArguments>;
        },
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<IMoveCardsPlayerIdArguments>):
            MoveCardPlayerCurrentIdType => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[currentMoveArguments.playerId];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    currentMoveArguments.playerId);
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
                playerId: currentMoveArguments.playerId,
                cardId: cardIndex,
            };
        },
        moveName: CardMoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: (): boolean => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawDiscardedCards(G, ctx,
            MoveValidatorNames.PickDiscardCardMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.PickDiscardCardMove,
        validate: (): boolean => true,
    },
    PlaceMultiSuitCardMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceMultiSuitCardMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceMultiSuitCardMove,
        validate: (): boolean => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<SuitNamesKeyofTypeofType[]> =>
            DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceThrudHeroMoveValidator) as
            MoveArgumentsType<SuitNamesKeyofTypeofType[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<SuitNamesKeyofTypeofType[]>):
            SuitNamesKeyofTypeofType => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement!
            const moveArgument: CanBeUndefType<SuitNamesKeyofTypeofType> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceThrudHeroMove,
        validate: (): boolean => true,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<IMoveCoinsArguments[]> =>
            DrawPlayersBoardsCoins(G, ctx,
                MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator) as
            MoveArgumentsType<IMoveCoinsArguments[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<IMoveCoinsArguments[]>):
            IMoveCoinsArguments => {
            const moveArgument: CanBeUndefType<IMoveCoinsArguments> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G: IMyGameState, ctx: Ctx, id: IMoveCoinsArguments): boolean => {
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            return player.stack[0]?.coinId !== id.coinId && CoinUpgradeValidation(G, ctx, id);
        },
    },
    // TODO Do it logic!
    UseGodPowerMoveValidator: {
        getRange: (G: IMyGameState, ctx: Ctx): MoveArgumentsType<number[]> => DrawPlayersBoards(G, ctx,
            MoveValidatorNames.UseGodPowerMoveValidator) as MoveArgumentsType<number[]>,
        getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveArgumentsType<number[]>): number => {
            const moveArgument: CanBeUndefType<number> =
                currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.UseGodCardPowerMove,
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
    default: null,
    chooseDifficultySoloMode: {
        default1: moveValidators.ChooseDifficultyLevelForSoloModeMoveValidator,
        chooseHeroesForSoloMode: moveValidators.ChooseHeroesForSoloModeMoveValidator,
        // Solo Bot
        upgradeCoinSoloBot: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
    },
    chooseDifficultySoloModeAndvari: {
        default1: moveValidators.ChooseStrategyVariantForSoloModeAndvariMoveValidator,
        default2: moveValidators.ChooseStrategyForSoloModeAndvariMoveValidator,
    },
    bids: {
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
        // Bots
        default3: moveValidators.BotsPlaceAllCoinsMoveValidator,
        // Solo Bot
        default4: moveValidators.SoloBotPlaceAllCoinsMoveValidator,
        // Solo Bot Andvari
        default5: moveValidators.SoloBotAndvariPlaceAllCoinsMoveValidator,
    },
    bidUline: {
        default1: moveValidators.ClickHandCoinUlineMoveValidator,
    },
    tavernsResolution: {
        default1: moveValidators.ClickCardMoveValidator,
        default2: moveValidators.ClickCampCardMoveValidator,
        // TODO Check/Fix
        // default3: moveValidators.UseGodPowerMoveValidator,
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
        // useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
        discardCard: moveValidators.DiscardCard2PlayersMoveValidator,
        placeTradingCoinsUline: moveValidators.ClickHandTradingCoinUlineMoveValidator,
        // Solo Bot
        default3: moveValidators.SoloBotClickCardMoveValidator,
        // Common Solo Bot Start
        pickHeroSoloBot: moveValidators.SoloBotClickHeroCardMoveValidator,
        placeThrudHeroSoloBot: moveValidators.SoloBotPlaceThrudHeroMoveValidator,
        upgradeCoinSoloBot: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
        // Common Solo Bot End
        // Solo Bot Andvari
        default4: moveValidators.SoloBotAndvariClickCardMoveValidator,
        // Common Solo Bot Andvari Start
        pickHeroSoloBotAndvari: moveValidators.SoloBotAndvariClickHeroCardMoveValidator,
        placeThrudHeroSoloBotAndvari: moveValidators.SoloBotAndvariPlaceThrudHeroMoveValidator,
        upgradeCoinSoloBotAndvari: moveValidators.SoloBotAndvariClickCoinToUpgradeMoveValidator,
        // Common Solo Bot Andvari End
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
        // useGodPower: moveValidators.UseGodPowerMoveValidator,
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
        // useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
        // Solo Bot
        default2: moveValidators.SoloBotPlaceYludHeroMoveValidator,
        // Common Solo Bot Start
        pickHeroSoloBot: moveValidators.SoloBotClickHeroCardMoveValidator,
        placeThrudHeroSoloBot: moveValidators.SoloBotPlaceThrudHeroMoveValidator,
        upgradeCoinSoloBot: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
        // Common Solo Bot End
        // Solo Bot Andvari
        default3: moveValidators.SoloBotAndvariPlaceYludHeroMoveValidator,
        // Common Solo Bot Andvari Start
        pickHeroSoloBotAndvari: moveValidators.SoloBotAndvariClickHeroCardMoveValidator,
        placeThrudHeroSoloBotAndvari: moveValidators.SoloBotAndvariPlaceThrudHeroMoveValidator,
        upgradeCoinSoloBotAndvari: moveValidators.SoloBotAndvariClickCoinToUpgradeMoveValidator,
        // Common Solo Bot Andvari End
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
        // useGodPower: moveValidators.UseGodPowerMoveValidator,
        // end
        pickDistinctionCard: moveValidators.ClickCardToPickDistinctionMoveValidator,
        // Solo Bot
        pickDistinctionCardSoloBot: moveValidators.SoloBotClickCardToPickDistinctionMoveValidator,
        // Common Solo Bot Start
        pickHeroSoloBot: moveValidators.SoloBotClickHeroCardMoveValidator,
        placeThrudHeroSoloBot: moveValidators.SoloBotPlaceThrudHeroMoveValidator,
        upgradeCoinSoloBot: moveValidators.SoloBotClickCoinToUpgradeMoveValidator,
        // Common Solo Bot End
        // Solo Bot Andvari
        pickDistinctionCardSoloBotAndvari: moveValidators.SoloBotAndvariClickCardToPickDistinctionMoveValidator,
        // Common Solo Bot Andvari Start
        pickHeroSoloBotAndvari: moveValidators.SoloBotAndvariClickHeroCardMoveValidator,
        placeThrudHeroSoloBotAndvari: moveValidators.SoloBotAndvariPlaceThrudHeroMoveValidator,
        upgradeCoinSoloBotAndvari: moveValidators.SoloBotAndvariClickCoinToUpgradeMoveValidator,
        // Common Solo Bot Andvari End
    },
    brisingamensEndGame: {
        default1: moveValidators.DiscardCardFromPlayerBoardMoveValidator,
    },
    getMjollnirProfit: {
        default1: moveValidators.GetMjollnirProfitMoveValidator,
    },
};

// TODO Move to function generic type with extends number & SuitNamesKeyofTypeofType
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
const ValidateByObjectSuitCardIdPlayerIdValues = (value: MoveCardPlayerCurrentIdType,
    values: IMoveCardsPlayerIdArguments): boolean =>
    values.playerId === value.playerId && values.cards.includes(value.cardId);
