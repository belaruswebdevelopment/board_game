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
export const CoinUpgradeValidation = (G, ctx, coinData) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
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
export const IsValidMove = (G, ctx, stage, id) => {
    const validator = GetValidator(ctx.phase, stage);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `string`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx));
            }
            else if (`playerId` in id) {
                isValid = ValidateByObjectSuitCardIdPlayerIdValues(id, validator.getRange(G, ctx, id.playerId));
            }
            else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange(G, ctx));
            }
        }
        else {
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
    ClickBoardCoinMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickBoardCoinMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickBoardCoinMove,
        validate: () => true,
    },
    ClickCampCardMoveValidator: {
        getRange: (G, ctx) => DrawCamp(G, ctx, MoveValidatorNames.ClickCampCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardMove,
        validate: (G, ctx) => {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            return G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                || (!G.campPicked && CheckPlayerHasBuff(player, BuffNames.GoCamp)));
        },
    },
    ClickCardMoveValidator: {
        getRange: (G, ctx) => DrawTaverns(G, ctx, MoveValidatorNames.ClickCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
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
                const isCurrentCardWorse = EvaluateCard(G, ctx, tavernCard, moveArgument, currentTavern) < 0, isExistCardNotWorse = currentTavern.some((card) => (card !== null)
                    && (EvaluateCard(G, ctx, tavernCard, moveArgument, currentTavern) >= 0));
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
        validate: () => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: (G, ctx) => ExplorerDistinctionProfit(G, ctx, MoveValidatorNames.ClickCardToPickDistinctionMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCardToPickDistinctionMove,
        validate: () => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G, ctx) => DrawDistinctions(G, ctx, MoveValidatorNames.ClickDistinctionCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickDistinctionCardMove,
        validate: () => true,
    },
    ClickHandCoinMoveValidator: {
        getRange: (G, ctx) => DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandCoinMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinMove,
        validate: () => true,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G, ctx) => DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandCoinUlineMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandCoinUlineMove,
        validate: () => true,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G, ctx) => DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickHandTradingCoinUlineMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickHandTradingCoinUlineMove,
        validate: () => true,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardCardFromPlayerBoardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
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
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardCardFromPlayerBoardMove,
        validate: () => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G, ctx) => DrawTaverns(G, ctx, MoveValidatorNames.DiscardCard2PlayersMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.DiscardCard2PlayersMove,
        validate: () => true,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.GetEnlistmentMercenariesMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.GetEnlistmentMercenariesMove,
        validate: () => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.GetMjollnirProfitMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const totalSuitsRanks = [];
            for (let j = 0; j < currentMoveArguments.length; j++) {
                const player = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
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
        validate: () => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: ButtonMoveNames.PassEnlistmentMercenariesMove,
        validate: (G, ctx) => {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            const mercenariesCount = player.campCards.filter(IsMercenaryCampCard).length;
            return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                && mercenariesCount > 0;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceEnlistmentMercenariesMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceEnlistmentMercenariesMove,
        validate: () => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceYludHeroMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceYludHeroMove,
        validate: () => true,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: ButtonMoveNames.StartEnlistmentMercenariesMove,
        validate: () => true,
    },
    // Bots
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G) => G.botData.allCoinsOrder,
        getValue: (G, ctx, currentMoveArguments) => {
            const hasLowestPriority = HasLowestPriority(G, ctx, Number(ctx.currentPlayer));
            let resultsForCoins = CheckHeuristicsForCoinsPlacement(G, ctx);
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
            const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            if (privatePlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
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
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
                    }
                    if (handCoin !== null && !IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${coinId}'.`);
                    }
                    if (IsCoin(handCoin) && handCoin.isOpened) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${coinId}'.`);
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
                    const hasPositionForMaxCoin = positionForMaxCoin !== -1, hasPositionForMinCoin = positionForMinCoin !== -1, coinsOrderPositionForMaxCoin = allCoinsOrderI[positionForMaxCoin], coinsOrderPositionForMinCoin = allCoinsOrderI[positionForMinCoin];
                    if (coinsOrderPositionForMaxCoin !== undefined && coinsOrderPositionForMinCoin !== undefined) {
                        const maxCoin = handCoins[coinsOrderPositionForMaxCoin], minCoin = handCoins[coinsOrderPositionForMinCoin];
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
                        let isTopCoinsOnPosition = false, isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition = allCoinsOrderI.filter((coinIndex) => {
                                const handCoin = handCoins[coinIndex];
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
                                handCoins.filter((coin, index) => {
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
                }
                else {
                    // TODO Why if trading profit === 0 we not checked min max coins positions!?
                    return allCoinsOrderI;
                }
            }
            throw new Error(`Отсутствует вариант выкладки монет для ботов.`);
        },
        moveName: AutoBotsMoveNames.BotsPlaceAllCoinsMove,
        validate: () => true,
    },
    // Solo Bot
    SoloBotPlaceAllCoinsMoveValidator: {
        getRange: (G, ctx) => DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.SoloBotPlaceAllCoinsMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[0];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotPlaceAllCoinsMove,
        validate: () => true,
    },
    SoloBotClickCardMoveValidator: {
        getRange: (G, ctx) => DrawTaverns(G, ctx, MoveValidatorNames.SoloBotClickCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO If last round of tier 0 => get card not given distinction to other player and get for you if can' take hero or least present! If last round of the game => get most valuable points if can't pick hero anymore (can't check least present)!
            let moveArgument;
            moveArgument = CheckSoloBotMustTakeCardToPickHero(G, ctx, currentMoveArguments);
            if (moveArgument === undefined) {
                moveArgument = CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard(G, ctx, currentMoveArguments);
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
        validate: () => true,
    },
    SoloBotClickHeroCardMoveValidator: {
        getRange: (G, ctx) => DrawHeroesForSoloBotUI(G, ctx, MoveValidatorNames.SoloBotClickHeroCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickHeroCardMove,
        validate: () => true,
    },
    SoloBotClickCardToPickDistinctionMoveValidator: {
        getRange: (G, ctx) => ExplorerDistinctionProfit(G, ctx, MoveValidatorNames.SoloBotClickCardToPickDistinctionMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotClickCardToPickDistinctionMove,
        validate: () => true,
    },
    SoloBotPlaceThrudHeroMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotPlaceThrudHeroMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement and move in one func!?
            let moveArgument;
            const soloBotPublicPlayer = G.publicPlayers[1];
            if (soloBotPublicPlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
            }
            const suit = CheckSoloBotCanPickHero(G, ctx, soloBotPublicPlayer);
            if (suit === undefined) {
                const [suits] = CheckSuitsLeastPresentOnPlayerBoard(G, ctx, soloBotPublicPlayer);
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
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceThrudHeroMove,
        validate: () => true,
    },
    SoloBotPlaceYludHeroMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotPlaceYludHeroMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Same logic from Thrud placement and move in one func!?
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotPlaceYludHeroMove,
        validate: () => true,
    },
    SoloBotClickCoinToUpgradeMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.SoloBotClickCoinToUpgradeMoveValidator)),
        getValue: (G, ctx, currentMoveArguments) => {
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
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
            const minValue = CheckMinCoinVisibleValueForSoloBot(G, ctx, currentMoveArguments, type);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId = CheckMinCoinVisibleIndexForSoloBot(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' ${type === CoinTypeNames.Board ? `в руке` : `на столе`} не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotClickCoinToUpgradeMove,
        validate: (G, ctx, id) => CoinUpgradeValidation(G, ctx, id),
    },
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMoveValidator: {
        getRange: (G, ctx) => ChooseDifficultyLevelForSoloModeProfit(G, ctx, MoveValidatorNames.ChooseDifficultyLevelForSoloModeMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseDifficultyLevelForSoloModeMove,
        validate: () => true,
    },
    ChooseHeroesForSoloModeMoveValidator: {
        getRange: (G, ctx) => PickHeroesForSoloModeProfit(G, ctx, MoveValidatorNames.ChooseHeroesForSoloModeMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ChooseHeroForDifficultySoloModeMove,
        validate: () => true,
    },
    // Solo Mode Andvari
    ChooseStrategyVariantForSoloModeAndvariMoveValidator: {
        getRange: (G, ctx) => ChooseStrategyVariantForSoloModeAndvariProfit(G, ctx, MoveValidatorNames.ChooseStrategyVariantForSoloModeAndvariMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyVariantForSoloModeAndvariMove,
        validate: () => true,
    },
    ChooseStrategyForSoloModeAndvariMoveValidator: {
        getRange: (G, ctx) => ChooseStrategyForSoloModeAndvariProfit(G, ctx, MoveValidatorNames.ChooseStrategyForSoloModeAndvariMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseStrategyForSoloModeAndvariMove,
        validate: () => true,
    },
    SoloBotAndvariPlaceAllCoinsMoveValidator: {
        getRange: (G, ctx) => DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.SoloBotAndvariPlaceAllCoinsMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[0];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: AutoBotsMoveNames.SoloBotAndvariPlaceAllCoinsMove,
        validate: () => true,
    },
    SoloBotAndvariClickCardMoveValidator: {
        getRange: (G, ctx) => DrawTaverns(G, ctx, MoveValidatorNames.SoloBotAndvariClickCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            let moveArgument;
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
        validate: () => true,
    },
    SoloBotAndvariClickHeroCardMoveValidator: {
        getRange: (G, ctx) => DrawHeroes(G, ctx, MoveValidatorNames.SoloBotAndvariClickHeroCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            let moveArgument;
            const dwergBrotherIndex = G.heroes.findIndex((hero) => hero.active && hero.name.startsWith(`Dwerg`));
            if (dwergBrotherIndex !== -1) {
                moveArgument = dwergBrotherIndex;
            }
            else {
                moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            }
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickHeroCardMove,
        validate: () => true,
    },
    SoloBotAndvariClickCardToPickDistinctionMoveValidator: {
        getRange: (G, ctx) => ExplorerDistinctionProfit(G, ctx, MoveValidatorNames.SoloBotAndvariClickCardToPickDistinctionMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.SoloBotAndvariClickCardToPickDistinctionMove,
        validate: (G, ctx, id) => id === 0,
    },
    SoloBotAndvariPlaceThrudHeroMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotAndvariPlaceThrudHeroMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Move same logic for Ylud placement in one func!
            const strategySuitIndex = currentMoveArguments.findIndex((suit) => suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument = currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceThrudHeroMove,
        validate: () => true,
    },
    SoloBotAndvariPlaceYludHeroMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.SoloBotAndvariPlaceYludHeroMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Move same logic for Thrud placement in one func!
            const strategySuitIndex = currentMoveArguments.findIndex((suit) => suit === G.strategyForSoloBotAndvari.general[0]);
            if (strategySuitIndex === -1) {
                throw new Error(`В массиве возможных аргументов мува для соло бота отсутствует нужное значение главной стратегии фракции '${G.strategyForSoloBotAndvari.general[0]}'.`);
            }
            const moveArgument = currentMoveArguments[strategySuitIndex];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.SoloBotAndvariPlaceYludHeroMove,
        validate: () => true,
    },
    SoloBotAndvariClickCoinToUpgradeMoveValidator: {
        // TODO Bot Andvari can't update closed coins........!
        getRange: (G, ctx) => DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.SoloBotAndvariClickCoinToUpgradeMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const player = G.players[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
            }
            const coins = player.boardCoins, minValue = CheckMinCoinVisibleValueForSoloBotAndvari(G, ctx, currentMoveArguments);
            if (minValue === 0) {
                throw new Error(`В массиве монет соло бота Андвари с id '${ctx.currentPlayer}' не может быть минимальная монета для улучшения с значением '${minValue}'.`);
            }
            const coinId = CheckMinCoinIndexForSoloBotAndvari(coins, minValue);
            if (coinId === -1) {
                throw new Error(`В массиве монет соло бота Андвари с id '${ctx.currentPlayer}' не найдена минимальная монета с значением '${minValue}'.`);
            }
            const moveArgument = currentMoveArguments[coinId];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.SoloBotAndvariClickCoinToUpgradeMove,
        validate: (G, ctx, id) => CoinUpgradeValidation(G, ctx, id),
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G, ctx) => DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.AddCoinToPouchMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.AddCoinToPouchMove,
        validate: () => true,
    },
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator: {
        getRange: (G, ctx) => ChooseCoinValueForVidofnirVedrfolnirUpgradeProfit(G, ctx, MoveValidatorNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: ButtonMoveNames.ChooseCoinValueForVidofnirVedrfolnirUpgradeMove,
        validate: () => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G, ctx) => DrawCamp(G, ctx, MoveValidatorNames.ClickCampCardHoldaMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickCampCardHoldaMove,
        validate: () => true,
    },
    // TODO Is it need for solo bot and andvari!?
    PickConcreteCoinToUpgradeMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickConcreteCoinToUpgradeMoveValidator)),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickConcreteCoinToUpgradeMove,
        validate: (G, ctx, id) => CoinUpgradeValidation(G, ctx, id),
    },
    ClickCoinToUpgradeMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator).concat(DrawPlayersHandsCoins(G, ctx, MoveValidatorNames.ClickCoinToUpgradeMoveValidator)),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.ClickCoinToUpgradeMove,
        validate: (G, ctx, id) => CoinUpgradeValidation(G, ctx, id),
    },
    ClickHeroCardMoveValidator: {
        getRange: (G, ctx) => DrawHeroes(G, ctx, MoveValidatorNames.ClickHeroCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.ClickHeroCardMove,
        validate: (G, ctx, id) => {
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
                        isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                    }
                    else if (validator === PickHeroCardValidatorNames.discardCard) {
                        isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
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
            return isValid;
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
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
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return {
                suit: suitName,
                cardId: moveArgument,
            };
        },
        moveName: CardMoveNames.DiscardCardMove,
        validate: () => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G, ctx, playerId) => {
            if (playerId === undefined) {
                throw new Error(`Function param 'playerId' is undefined.`);
            }
            return DrawPlayersBoards(G, ctx, MoveValidatorNames.DiscardSuitCardFromPlayerBoardMoveValidator, playerId);
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const player = G.publicPlayers[currentMoveArguments.playerId];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, currentMoveArguments.playerId);
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
                playerId: currentMoveArguments.playerId,
                cardId: cardIndex,
            };
        },
        moveName: CardMoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: () => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G, ctx) => DrawDiscardedCards(G, ctx, MoveValidatorNames.PickDiscardCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.PickDiscardCardMove,
        validate: () => true,
    },
    PlaceMultiSuitCardMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceMultiSuitCardMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceMultiSuitCardMove,
        validate: () => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.PlaceThrudHeroMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Move same logic for SuitTypes & number to functions and use it in getValue
            // TODO Same logic for Ylud placement!
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: EmptyCardMoveNames.PlaceThrudHeroMove,
        validate: () => true,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoardsCoins(G, ctx, MoveValidatorNames.UpgradeCoinVidofnirVedrfolnirMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CoinMoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G, ctx, id) => {
            var _a;
            const player = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
            }
            return ((_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.coinId) !== id.coinId && CoinUpgradeValidation(G, ctx, id);
        },
    },
    // TODO Do it logic!
    UseGodPowerMoveValidator: {
        getRange: (G, ctx) => DrawPlayersBoards(G, ctx, MoveValidatorNames.UseGodPowerMoveValidator),
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArgument = currentMoveArguments[Math.floor(Math.random() * currentMoveArguments.length)];
            if (moveArgument === undefined) {
                throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
            }
            return moveArgument;
        },
        moveName: CardMoveNames.UseGodCardPowerMove,
        validate: () => true,
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
        // default3: moveValidators.UseGodPowerMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
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
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
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
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
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
        chooseCoinValueForVidofnirVedrfolnirUpgrade: moveValidators.ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator,
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
const ValidateByObjectSuitCardIdPlayerIdValues = (value, values) => values.playerId === value.playerId && values.cards.includes(value.cardId);
//# sourceMappingURL=MoveValidator.js.map