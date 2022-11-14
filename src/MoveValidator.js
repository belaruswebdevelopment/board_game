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
import { AutoBotsMoveNames, ButtonMoveNames, CampBuffNames, CardMoveNames, CoinMoveNames, CoinTypeNames, EmptyCardMoveNames, ErrorNames, GameModeNames, MoveValidatorNames, PhaseNames, PickHeroCardValidatorNames, RusCardTypeNames, SoloGameAndvariStrategyNames, StageNames, SuitMoveNames, SuitNames } from "./typescript/enums";
import { DrawCamp, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawTaverns } from "./ui/GameBoardUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
import { ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit, ChooseDifficultyLevelForSoloModeProfit, ChooseGetMythologyCardProfit, ChooseStrategyForSoloModeAndvariProfit, ChooseStrategyVariantForSoloModeAndvariProfit, ExplorerDistinctionProfit, PickHeroesForSoloModeProfit } from "./ui/ProfitUI";
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
export const CoinUpgradeValidation = ({ G, ctx, playerID, ...rest }, coinData) => {
    const player = G.publicPlayers[Number(playerID)], privatePlayer = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, playerID);
    }
    let handCoins, boardCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
        boardCoins = privatePlayer.boardCoins;
    }
    else {
        handCoins = player.handCoins;
        boardCoins = player.boardCoins;
    }
    const handCoin = handCoins[coinData.coinId], boardCoin = boardCoins[coinData.coinId];
    let _exhaustiveCheck;
    switch (coinData.type) {
        case CoinTypeNames.Hand:
            if (handCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует монета с id '${coinData.coinId}'.`);
            }
            if (handCoin === null) {
                throw new Error(`Выбранная для улучшения монета игрока с id '${playerID}' в руке с id '${coinData.coinId}' не может отсутствовать там.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`Монета с id '${coinData.coinId}' в руке текущего игрока с id '${playerID}' не может быть закрытой для него.`);
            }
            if (!handCoin.isTriggerTrading) {
                return true;
            }
            break;
        case CoinTypeNames.Board:
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${playerID}' на столе отсутствует монета с id '${coinData.coinId}'.`);
            }
            if (boardCoin === null) {
                throw new Error(`Выбранная для улучшения монета игрока с id '${playerID}' на столе с id '${coinData.coinId}' не может отсутствовать там.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`Монета с id '${coinData.coinId}' на столе текущего игрока с id '${playerID}' не может быть закрытой для него.`);
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
export const IsValidMove = ({ G, ctx, ...rest }, stage, id) => {
    const validator = GetValidator(ctx.phase, stage);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid = ValidateByValues(id, validator.getRange({ G, ctx, ...rest }));
        }
        else if (typeof id === `string`) {
            isValid = ValidateByValues(id, validator.getRange({ G, ctx, ...rest }));
        }
        else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange({ G, ctx, ...rest }));
            }
            else if (`playerId` in id) {
                isValid = ValidateByObjectCardIdValues(id, validator.getRange({ G, ctx, ...rest }));
            }
            else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange({ G, ctx, ...rest }));
            }
        }
        else {
            isValid = true;
        }
        if (isValid) {
            return validator.validate({ G, ctx, ...rest }, id);
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
export const GetValidator = (phase, stage) => {
    let validator, _exhaustiveCheck;
    switch (phase) {
        case PhaseNames.ChooseDifficultySoloMode:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.ChooseDifficultySoloModeAndvari:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.Bids:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.BidUline:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.TavernsResolution:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.EnlistmentMercenaries:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.PlaceYlud:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.TroopEvaluation:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.BrisingamensEndGame:
            validator = moveBy[phase][stage];
            break;
        case PhaseNames.GetMjollnirProfit:
            validator = moveBy[phase][stage];
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
export const moveValidators = {
    ChooseSuitOlrunMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.ChooseSuitOlrunMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: SuitMoveNames.ChooseSuitOlrunMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    GetMythologyCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ChooseGetMythologyCardProfit({ G, ctx, ...rest }, MoveValidatorNames.GetMythologyCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.GetMythologyCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickBoardCoinMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoardsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickBoardCoinMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickBoardCoinMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickCampCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawCamp({ G, ctx, ...rest }, MoveValidatorNames.ClickCampCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardMove,
        validate: ({ G, ctx, playerID, ...rest }) => {
            const player = G.publicPlayers[Number(playerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
            }
            return playerID === ctx.currentPlayer && G.expansions.thingvellir.active
                && (ctx.currentPlayer === G.publicPlayersOrder[0] || (!G.campPicked
                    && CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, CampBuffNames.GoCamp)));
        },
    },
    ClickCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawTaverns({ G, ctx, ...rest }, MoveValidatorNames.ClickCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            // TODO Get MythologicalCreature cards for AI bots...
            const uniqueArr = [], currentTavern = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < currentMoveArguments.length; i++) {
                const moveArgument = currentMoveArguments[i];
                if (moveArgument === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
                }
                const tavernCard = currentTavern[moveArgument];
                if (tavernCard === undefined) {
                    throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
                }
                if (tavernCard === null) {
                    throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карты с id '${moveArgument}'.`);
                }
                if (currentTavern.some((card) => CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse = EvaluateCard({ G, ctx, ...rest }, tavernCard, moveArgument, currentTavern) < 0, isExistCardNotWorse = currentTavern.some((card) => (card !== null)
                    && (EvaluateCard({ G, ctx, ...rest }, tavernCard, moveArgument, currentTavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard = uniqueArr[j];
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
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ExplorerDistinctionProfit({ G, ctx, ...rest }, MoveValidatorNames.ClickCardToPickDistinctionMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCardToPickDistinctionMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawDistinctions({ G, ctx, ...rest }, MoveValidatorNames.ClickDistinctionCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickDistinctionCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickHandCoinMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickHandCoinMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickHandCoinUlineMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinUlineMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandTradingCoinUlineMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const suitNames = [];
            let suit;
            for (suit in currentMoveArguments) {
                suitNames.push(suit);
            }
            const suitName = suitNames[Math.floor(Math.random() * suitNames.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция '${suitName}' для сброса карты.`);
            }
            const moveArgumentForSuit = currentMoveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
            }
            const moveArgument = moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardCardFromPlayerBoardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawTaverns({ G, ctx, ...rest }, MoveValidatorNames.DiscardCard2PlayersMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.DiscardCard2PlayersMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.GetEnlistmentMercenariesMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.GetEnlistmentMercenariesMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.GetMjollnirProfitMoveValidator),
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            const totalSuitsRanks = [];
            for (let j = 0; j < currentMoveArguments.length; j++) {
                const player = G.publicPlayers[Number(playerID)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
                }
                const moveArgumentI = currentMoveArguments[j];
                if (moveArgumentI === undefined) {
                    throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${j}'.`);
                }
                totalSuitsRanks.push(player.cards[moveArgumentI]
                    .reduce(TotalRank, 0) * 2);
            }
            const index = totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks));
            if (index === -1) {
                throw new Error(`Должна быть хотя бы одна фракция с максимальным количеством шевронов.`);
            }
            const moveArgument = currentMoveArguments[index];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${index}'.`);
            }
            return moveArgument;
        },
        moveName: SuitMoveNames.GetMjollnirProfitMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: ButtonMoveNames.PassEnlistmentMercenariesMove,
        validate: ({ G, ctx, playerID, ...rest }) => {
            const player = G.publicPlayers[Number(playerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
            }
            const mercenariesCount = player.campCards.filter(IsMercenaryCampCard).length;
            return playerID === ctx.currentPlayer && ctx.playOrderPos === 0
                && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceEnlistmentMercenariesMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    PlaceYludHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.PlaceYludHeroMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceYludHeroMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: ButtonMoveNames.StartEnlistmentMercenariesMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    // Bots
    BotsPlaceAllCoinsMoveValidator: {
        getRange: ({ G }) => G.botData.allCoinsOrder,
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            const hasLowestPriority = HasLowestPriority({ G, ctx, playerID, ...rest });
            let resultsForCoins = CheckHeuristicsForCoinsPlacement({ G, ctx, ...rest });
            if (hasLowestPriority) {
                resultsForCoins = resultsForCoins.map((num, index) => index === 0 ? num - 20 : num);
            }
            const minResultForCoins = Math.min(...resultsForCoins), maxResultForCoins = Math.max(...resultsForCoins), tradingProfit = G.secret.decks[1].length > 9 ? 1 : 0;
            let [positionForMinCoin, positionForMaxCoin] = [-1, -1];
            if (minResultForCoins <= 0) {
                positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
            }
            if (maxResultForCoins >= 0) {
                positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
            }
            // TODO Check it bot can't play in multiplayer now...
            const player = G.publicPlayers[Number(playerID)], privatePlayer = G.players[Number(playerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
            }
            if (privatePlayer === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, playerID);
            }
            let handCoins;
            if (G.mode === GameModeNames.Multiplayer) {
                handCoins = privatePlayer.handCoins;
            }
            else {
                handCoins = player.handCoins;
            }
            for (let i = 0; i < currentMoveArguments.length; i++) {
                const allCoinsOrderI = currentMoveArguments[i];
                if (allCoinsOrderI === undefined) {
                    throw new Error(`В массиве выкладки монет отсутствует выкладка '${i}'.`);
                }
                const hasTrading = allCoinsOrderI.some((coinId) => {
                    const handCoin = handCoins[coinId];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует монета с id '${coinId}'.`);
                    }
                    if (handCoin !== null && !IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть закрыта монета с id '${coinId}'.`);
                    }
                    if (IsCoin(handCoin) && handCoin.isOpened) {
                        throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть ранее открыта монета с id '${coinId}'.`);
                    }
                    return Boolean(handCoin === null || handCoin === void 0 ? void 0 : handCoin.isTriggerTrading);
                });
                // TODO How tradingProfit can be < 0?
                if (tradingProfit < 0) {
                    if (hasTrading) {
                        continue;
                    }
                    return allCoinsOrderI;
                }
                else if (tradingProfit > 0) {
                    const isEveryCoinsInHands = handCoins.every((coin, index) => {
                        if (coin !== null && !IsCoin(coin)) {
                            throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть закрыта монета с id '${index}'.`);
                        }
                        if (IsCoin(coin) && coin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть ранее открыта монета с id '${index}'.`);
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
                    const hasPositionForMaxCoin = positionForMaxCoin !== -1, hasPositionForMinCoin = positionForMinCoin !== -1, coinsOrderPositionForMaxCoin = allCoinsOrderI[positionForMaxCoin], coinsOrderPositionForMinCoin = allCoinsOrderI[positionForMinCoin];
                    if (coinsOrderPositionForMaxCoin !== undefined && coinsOrderPositionForMinCoin !== undefined) {
                        const maxCoin = handCoins[coinsOrderPositionForMaxCoin], minCoin = handCoins[coinsOrderPositionForMinCoin];
                        if (maxCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === undefined) {
                            throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (maxCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${playerID}' не может не быть максимальной монеты с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (minCoin === null) {
                            throw new Error(`В массиве выкладки монет игрока с id '${playerID}' не может не быть минимальной монеты с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (!IsCoin(maxCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${playerID}' не может быть закрыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (!IsCoin(minCoin)) {
                            throw new Error(`В массиве выкладки монет игрока с id '${playerID}' не может быть закрыта минимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        if (IsCoin(maxCoin) && maxCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMaxCoin}'.`);
                        }
                        if (IsCoin(minCoin) && minCoin.isOpened) {
                            throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть ранее открыта максимальная монета с id '${coinsOrderPositionForMinCoin}'.`);
                        }
                        let isTopCoinsOnPosition = false, isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition = allCoinsOrderI.filter((coinIndex) => {
                                const handCoin = handCoins[coinIndex];
                                if (handCoin === undefined) {
                                    throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует монета с id '${coinIndex}'.`);
                                }
                                if (handCoin !== null && !IsCoin(handCoin)) {
                                    throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                                }
                                if (IsCoin(handCoin) && handCoin.isOpened) {
                                    throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть ранее открыта монета с id '${coinIndex}'.`);
                                }
                                return IsCoin(handCoin) && handCoin.value > maxCoin.value;
                            }).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition =
                                handCoins.filter((coin, index) => {
                                    if (coin !== null && !IsCoin(coin)) {
                                        throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть закрыта монета с id '${index}'.`);
                                    }
                                    if (IsCoin(coin) && coin.isOpened) {
                                        throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть ранее открыта монета с id '${index}'.`);
                                    }
                                    return IsCoin(coin) && coin.value < minCoin.value;
                                }).length <= 1;
                        }
                        if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                            return allCoinsOrderI;
                            //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                        }
                    }
                }
                else {
                    // TODO Why if trading profit === 0 we not checked min max coins positions!?
                    return allCoinsOrderI;
                }
            }
            throw new Error(`Отсутствует вариант выкладки монет для ботов.`);
        },
        moveName: AutoBotsMoveNames.BotsPlaceAllCoinsMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    // Solo Bot
    SoloBotPlaceAllCoinsMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[0];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotPlaceAllCoinsMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotClickCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawTaverns({ G, ctx, ...rest }, MoveValidatorNames.SoloBotClickCardMoveValidator),
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            // TODO If last round of tier 0 => get card not given distinction to other player and get for you if can' take hero or least present! If last round of the game => get most valuable points if can't pick hero anymore (can't check least present)!
            let moveArgument;
            moveArgument =
                CheckSoloBotMustTakeCardToPickHero({ G, ctx, playerID, ...rest }, currentMoveArguments);
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard({ G, ctx, playerID, ...rest }, currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotMustTakeRoyalOfferingCard({ G, ctx, playerID, ...rest }, currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument =
                    SoloBotMustTakeRandomCard({ G, ctx, playerID, ...rest }, currentMoveArguments);
            }
            if (moveArgument !== undefined) {
                return moveArgument;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.SoloBotClickCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotClickHeroCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawHeroesForSoloBotUI({ G, ctx, ...rest }, MoveValidatorNames.SoloBotClickHeroCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickHeroCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotClickCardToPickDistinctionMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ExplorerDistinctionProfit({ G, ctx, ...rest }, MoveValidatorNames.SoloBotClickCardToPickDistinctionMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickCardToPickDistinctionMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotPlaceThrudHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.SoloBotPlaceThrudHeroMoveValidator),
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement and move in one func!?
            let moveArgument;
            const suit = CheckSoloBotCanPickHero({ G, ctx, playerID, ...rest });
            if (suit === undefined) {
                const [suits] = CheckSuitsLeastPresentOnPlayerBoard({ G, ctx, playerID, ...rest });
                if (suits.length === 0) {
                    // TODO Move Thrud/Ylud in most left suit from `suits`
                    throw new Error(`Не может не быть фракций с минимальным количеством карт.`);
                }
                else if (suits.length === 1) {
                    const leastPresentSuit = suits[0];
                    if (leastPresentSuit === undefined) {
                        throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение наименее представленной фракции.`);
                    }
                    moveArgument = currentMoveArguments[currentMoveArguments.indexOf(leastPresentSuit)];
                }
                else {
                    // TODO Move Thrud/Ylud in most left suit from least present `suits`!
                }
            }
            else {
                moveArgument = suit;
            }
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceThrudHeroMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotPlaceYludHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.SoloBotPlaceYludHeroMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            // TODO Same logic from Thrud placement and move in one func!?
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceYludHeroMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotClickCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoardsCoins({ G, ctx, ...rest }, MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator)),
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            const player = G.publicPlayers[Number(playerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
            }
            let type, coins;
            if (ctx.phase === PhaseNames.ChooseDifficultySoloMode) {
                type = CoinTypeNames.Hand;
                coins = player.handCoins;
            }
            else {
                type = CoinTypeNames.Board;
                coins = player.boardCoins;
            }
            const minValue = CheckMinCoinVisibleValueForSoloBot({ G, ctx, playerID, ...rest }, currentMoveArguments, type);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота с id '${playerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId = CheckMinCoinVisibleIndexForSoloBot(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота с id '${playerID}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotClickCoinToUpgradeMove,
        validate: ({ G, ctx, playerID, ...rest }, id) => playerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, playerID, ...rest }, id),
    },
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ChooseDifficultyLevelForSoloModeProfit({ G, ctx, ...rest }, MoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ChooseHeroesForSoloModeMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => PickHeroesForSoloModeProfit({ G, ctx, ...rest }, MoveValidatorNames.ChooseHeroesForSoloModeMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ChooseHeroForDifficultySoloModeMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    // Solo Mode Andvari
    ChooseStrategyVariantForSoloModeAndvariMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ChooseStrategyVariantForSoloModeAndvariProfit({ G, ctx, ...rest }, MoveValidatorNames.ChooseStrategyVariantForSoloModeAndvariMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ChooseStrategyForSoloModeAndvariMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ChooseStrategyForSoloModeAndvariProfit({ G, ctx, ...rest }, MoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotAndvariPlaceAllCoinsMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[0];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotAndvariPlaceAllCoinsMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawTaverns({ G, ctx, ...rest }, MoveValidatorNames.SoloBotAndvariClickCardMoveValidator),
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            let moveArgument;
            moveArgument = CheckSoloBotAndvariMustTakeCardFromGeneralStrategy({ G, ctx, playerID, ...rest }, currentMoveArguments);
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotAndvariMustTakeCardToPickHero({ G, ctx, playerID, ...rest }, currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotAndvariMustTakeRoyalOfferingCard({ G, ctx, playerID, ...rest }, currentMoveArguments);
            }
            if (moveArgument === undefined) {
                moveArgument = SoloBotMustTakeCardFromReserveStrategy({ G, ctx, playerID, ...rest }, currentMoveArguments);
            }
            if (moveArgument !== undefined) {
                return moveArgument;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: CardMoveNames.SoloBotAndvariClickCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickHeroCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawHeroes({ G, ctx, ...rest }, MoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            let moveArgument;
            const dwergBrotherIndex = G.heroes.findIndex((hero) => hero.active && hero.name.startsWith(`Dwerg`));
            if (dwergBrotherIndex !== -1) {
                moveArgument = dwergBrotherIndex;
            }
            else {
                moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            }
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickHeroCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickCardToPickDistinctionMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ExplorerDistinctionProfit({ G, ctx, ...rest }, MoveValidatorNames.SoloBotAndvariClickCardToPickDistinctionMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickCardToPickDistinctionMove,
        validate: ({ ctx, playerID }, id) => playerID === ctx.currentPlayer && id === 0,
    },
    SoloBotAndvariPlaceThrudHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.SoloBotAndvariPlaceThrudHeroMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Move same logic for Ylud placement in one func!
            const strategySuitIndex = currentMoveArguments.findIndex((suit) => suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument = currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceThrudHeroMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotAndvariPlaceYludHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.SoloBotAndvariPlaceYludHeroMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            // TODO Move same logic for Thrud placement in one func!
            const strategySuitIndex = currentMoveArguments.findIndex((suit) => suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument = currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceYludHeroMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    SoloBotAndvariClickCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoardsCoins({ G, ctx, ...rest }, MoveValidatorNames.SoloBotAndvariClickCoinToUpgradeMoveValidator),
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            const player = G.publicPlayers[Number(playerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
            }
            const coins = player.boardCoins, minValue = CheckMinCoinVisibleValueForSoloBotAndvari({ G, ctx, playerID, ...rest }, currentMoveArguments);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота Андвари с id '${playerID}' не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId = CheckMinCoinIndexForSoloBotAndvari(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота Андвари с id '${playerID}' не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotAndvariClickCoinToUpgradeMove,
        validate: ({ G, ctx, playerID, ...rest }, id) => playerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, playerID, ...rest }, id),
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.AddCoinToPouchMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.AddCoinToPouchMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit({ G, ctx, ...rest }, MoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawCamp({ G, ctx, ...rest }, MoveValidatorNames.ClickCampCardHoldaMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardHoldaMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    // TODO Is it need for solo bot and andvari!?
    ClickConcreteCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoardsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator)),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickConcreteCoinToUpgradeMove,
        validate: ({ G, ctx, playerID, ...rest }, id) => playerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, playerID, ...rest }, id),
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoardsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins({ G, ctx, ...rest }, MoveValidatorNames.ClickCoinToUpgradeMoveValidator)),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickCoinToUpgradeMove,
        validate: ({ G, ctx, playerID, ...rest }, id) => playerID === ctx.currentPlayer && CoinUpgradeValidation({ G, ctx, playerID, ...rest }, id),
    },
    ClickHeroCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawHeroes({ G, ctx, ...rest }, MoveValidatorNames.ClickHeroCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickHeroCardMove,
        validate: ({ G, ctx, playerID, ...rest }, id) => {
            let isValid = false;
            const hero = G.heroes[id];
            if (hero === undefined) {
                throw new Error(`В массиве карт героев отсутствует герой с id '${id}'.`);
            }
            const validators = hero.pickValidators;
            if (validators !== undefined) {
                let validator, _exhaustiveCheck;
                for (validator in validators) {
                    if (validator === PickHeroCardValidatorNames.conditions) {
                        isValid = IsCanPickHeroWithConditionsValidator({ G, ctx, playerID, ...rest }, id);
                    }
                    else if (validator === PickHeroCardValidatorNames.discardCard) {
                        isValid =
                            IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator({ G, ctx, playerID, ...rest }, id);
                    }
                    else {
                        _exhaustiveCheck = validator;
                        throw new Error(`Отсутствует валидатор для выбора карты героя.`);
                        return _exhaustiveCheck;
                    }
                }
            }
            else {
                isValid = true;
            }
            return playerID === ctx.currentPlayer && isValid;
        },
    },
    DiscardCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.DiscardCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const suitNamesArray = [];
            let suit;
            for (suit in currentMoveArguments) {
                suitNamesArray.push(suit);
            }
            const suitName = suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)];
            if (suitName === undefined) {
                throw new Error(`Отсутствует выбранная случайно фракция для сброса карты.`);
            }
            const moveArgumentForSuit = currentMoveArguments[suitName];
            if (moveArgumentForSuit === undefined) {
                throw new Error(`Отсутствует обязательный параметр с аргументом '${suitName}'.`);
            }
            const moveArgument = moveArgumentForSuit[Math.floor(Math.random() * moveArgumentForSuit.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator),
        getValue: ({ G, ctx, playerID, ...rest }, currentMoveArguments) => {
            // TODO Check playerID here!!!
            const player = G.publicPlayers[Number(playerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
            }
            const cardFirst = player.cards[SuitNames.warrior][0];
            if (cardFirst === undefined) {
                throw new Error(`В массиве карт игрока во фракции '${SuitNames.warrior}' отсутствует первая карта.`);
            }
            let minCardIndex = 0, minCardValue = cardFirst.points;
            currentMoveArguments.cards.forEach((value, index) => {
                const card = player.cards[SuitNames.warrior][value];
                if (card === undefined) {
                    throw new Error(`В массиве карт игрока во фракции '${SuitNames.warrior}' отсутствует карта ${value}.`);
                }
                const cardPoints = card.points;
                if (cardPoints === null || minCardValue === null) {
                    throw new Error(`Фракция должна иметь параметр 'points'.`);
                }
                if (cardPoints < minCardValue) {
                    minCardIndex = index;
                    minCardValue = cardPoints;
                }
            });
            const cardIndex = currentMoveArguments.cards[minCardIndex];
            if (cardIndex === undefined) {
                throw new Error(`В массиве аргументов для 'cardId' отсутствует значение с id '${minCardIndex}'.`);
            }
            return {
                cardId: cardIndex,
            };
        },
        moveName: CardMoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    PickDiscardCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawDiscardedCards({ G, ctx, ...rest }, MoveValidatorNames.PickDiscardCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.PickDiscardCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    PlaceMultiSuitCardMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.PlaceMultiSuitCardMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceMultiSuitCardMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoards({ G, ctx, ...rest }, MoveValidatorNames.PlaceThrudHeroMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement!
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceThrudHeroMove,
        validate: ({ ctx, playerID }) => playerID === ctx.currentPlayer,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        getRange: ({ G, ctx, ...rest }) => DrawPlayersBoardsCoins({ G, ctx, ...rest }, MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator),
        getValue: ({ G, ctx, ...rest }, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: ({ G, ctx, playerID, ...rest }, id) => {
            var _a;
            const player = G.publicPlayers[Number(playerID)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
            }
            return playerID === ctx.currentPlayer && ((_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.coinId) !== id.coinId
                && CoinUpgradeValidation({ G, ctx, playerID, ...rest }, id);
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
export const moveBy = {
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
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        clickConcreteCoinToUpgrade: moveValidators.ClickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        chooseSuitOlrun: moveValidators.ChooseSuitOlrunMoveValidator,
        getMythologyCard: moveValidators.GetMythologyCardMoveValidator,
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
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        clickConcreteCoinToUpgrade: moveValidators.ClickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    placeYlud: {
        default1: moveValidators.PlaceYludHeroMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        clickConcreteCoinToUpgrade: moveValidators.ClickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
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
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        clickConcreteCoinToUpgrade: moveValidators.ClickConcreteCoinToUpgradeMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeMultiSuitsCards: moveValidators.PlaceMultiSuitCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
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
const ValidateByValues = (value, values) => values.includes(value);
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
const ValidateByObjectCoinIdTypeIsInitialValues = (value, values) => values.findIndex((coin) => value.coinId === coin.coinId && value.type === coin.type) !== -1;
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
const ValidateByObjectSuitCardIdValues = (value, values) => {
    const objectSuitCardIdValues = values[value.suit];
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
const ValidateByObjectCardIdValues = (value, values) => values.cards.includes(value.cardId);
//# sourceMappingURL=MoveValidator.js.map