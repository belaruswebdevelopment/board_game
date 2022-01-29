import { Ctx } from "boardgame.io";
import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { isCardNotAction } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { TotalRank } from "./helpers/ScoreHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { CampDeckCardTypes, DeckCardTypes, TavernCardTypes } from "./typescript/card_types";
import { CoinType } from "./typescript/coin_types";
import { HeroNames, MoveNames, Phases, RusCardTypes, Stages } from "./typescript/enums";
import { IMyGameState } from "./typescript/game_data_interfaces";
import { ICurrentMoveArgumentsStage, ICurrentMoveCoinsArguments, ICurrentMoveSuitCardCurrentId, ICurrentMoveSuitCardIdArguments } from "./typescript/move_interfaces";
import { IMoveBy, IMoveValidators } from "./typescript/move_validator_interfaces";
import { ValidMoveIdParam } from "./typescript/types";

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
export const CoinUpgradeValidation = (G: IMyGameState, ctx: Ctx, coinId: number, type: string): boolean => {
    if (type === "hand") {
        const handCoinPosition: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin: CoinType, index: number): boolean => coin === null && index <= coinId).length;
        if (!G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter((coin: CoinType): boolean => coin !== null)[handCoinPosition - 1]?.isTriggerTrading) {
            return true;
        }
    } else {
        if (!G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[coinId]?.isTriggerTrading) {
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
export const IsValidMove = (G: IMyGameState, ctx: Ctx, stage: string, id?: ValidMoveIdParam): boolean => {
    let isValid = false;
    if (typeof id === `number`) {
        isValid = ValidateByValues<number>(id,
            moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx) as unknown as number[]);
    } else if (typeof id === `string`) {
        isValid = ValidateByValues<string>(id,
            moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx) as unknown as string[]);
    } else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
        if (`suit` in id) {
            isValid = ValidateByObjectSuitIdValues(id,
                moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx) as unknown as
                ICurrentMoveSuitCardIdArguments);
        } else if (`coinId` in id) {
            isValid = ValidateByObjectCoinIdTypeIsInitialValues(id,
                moveValidators[moveBy[ctx.phase][stage]].getRange(G, ctx) as unknown as
                ICurrentMoveArgumentsStage["coins"]);
        }
    } else {
        isValid = true;
    }
    if (isValid) {
        return moveValidators[moveBy[ctx.phase][stage]].validate(G, ctx, id);
    }
    return isValid;
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
    null: {},
    [Phases.PlaceCoins]: {
        default1: MoveNames.ClickHandCoinMove,
        default2: MoveNames.ClickBoardCoinMove,
        default3: MoveNames.BotsPlaceAllCoinsMove,
    },
    [Phases.PlaceCoinsUline]: {
        default1: MoveNames.ClickHandCoinMove,
        default2: MoveNames.ClickBoardCoinMove,
    },
    [Phases.PickCards]: {
        default1: MoveNames.ClickCardMove,
        default2: MoveNames.ClickCampCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
        [Stages.DiscardCard]: MoveNames.DiscardCard2PlayersMove,
        // TODO Fix it!
        [Stages.PlaceTradingCoinsUline]: MoveNames.ClickHandCoinMove,
        // [Stages.PlaceTradingCoinsUline]: MoveNames.ClickBoardCoinMove,
    },
    [Phases.EnlistmentMercenaries]: {
        default1: MoveNames.StartEnlistmentMercenariesMove,
        default2: MoveNames.PassEnlistmentMercenariesMove,
        default3: MoveNames.GetEnlistmentMercenariesMove,
        default4: MoveNames.PlaceEnlistmentMercenariesMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
    },
    [Phases.EndTier]: {
        default1: MoveNames.PlaceCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
    },
    [Phases.GetDistinctions]: {
        default1: MoveNames.ClickDistinctionCardMove,
        // start
        [Stages.AddCoinToPouch]: MoveNames.AddCoinToPouchMove,
        [Stages.DiscardBoardCard]: MoveNames.DiscardCardMove,
        [Stages.DiscardSuitCard]: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        [Stages.PickCampCardHolda]: MoveNames.ClickCampCardHoldaMove,
        [Stages.PickDiscardCard]: MoveNames.PickDiscardCardMove,
        [Stages.PickHero]: MoveNames.ClickHeroCardMove,
        [Stages.PlaceCards]: MoveNames.PlaceCardMove,
        [Stages.UpgradeCoin]: MoveNames.ClickCoinToUpgradeMove,
        [Stages.UpgradeVidofnirVedrfolnirCoin]: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        // end
        [Stages.PickDistinctionCard]: MoveNames.ClickCardToPickDistinctionMove,
    },
    [Phases.BrisingamensEndGame]: {
        default1: MoveNames.DiscardCardFromPlayerBoardMove,
    },
    [Phases.GetMjollnirProfit]: {
        defaul1: MoveNames.GetMjollnirProfitMove,
    },
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
    [MoveNames.BotsPlaceAllCoinsMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["arrayNumbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default3].arrayNumbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
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
            const allCoinsOrder: number[][] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default3].arrayNumbers,
                handCoins: CoinType[] = G.publicPlayers[Number(ctx.currentPlayer)].handCoins;
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
                            isMinCoinsOnPosition = handCoins.filter((coin: CoinType): boolean => coin !== null
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                && coin!.value < minCoin.value).length <= 1;
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
        validate: (): boolean => true,
    },
    [MoveNames.ClickBoardCoinMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default2].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParam): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[id] === null;
            }
            return isValid;
        },
    },
    [MoveNames.ClickCampCardMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                isValid = G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                    || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
            }
            return isValid;
        },
    },
    [MoveNames.ClickCardMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            // TODO G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].numbers !== G.taverns[G.currentTavern] becouse has no null cards!!!
            const uniqueArr: DeckCardTypes[] = [],
                tavern: TavernCardTypes[] = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < tavern.length; i++) {
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
                for (let j = 0; j < uniqueArrLength; j++) {
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
                    return i;
                }
                flag = true;
            }
            // TODO FIX it!
            return -1;
        },
        validate: (): boolean => true,
    },
    [MoveNames.ClickCardToPickDistinctionMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickDistinctionCard].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickDistinctionCard].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (): boolean => true,
    },
    [MoveNames.ClickDistinctionCardMove]: {
        // TODO Rework with validator in Move:
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["strings"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].strings,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: string[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].strings as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParam): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `string`) {
                // TODO ID === SUIT NOT NUMBER!
                const suitDistinctionIndex =
                    Object.keys(G.distinctions).findIndex((suit: string): boolean => suit === id);
                isValid = Object.keys(G.distinctions).includes(id)
                    && Object.keys(G.distinctions).filter((suit: string): boolean => suit !== undefined
                        && suit !== null).findIndex((suit: string): boolean => suit === id) ===
                    ctx.playOrderPos && G.distinctions[suitDistinctionIndex] === ctx.currentPlayer;
            }
            return isValid;
        }
    },
    [MoveNames.ClickHandCoinMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParam): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin === undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null;
            }
            return isValid;
        },
    },
    [MoveNames.DiscardCardFromPlayerBoardMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveSuitCardIdArguments =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.DiscardSuitCard].suits!,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: ICurrentMoveSuitCardIdArguments =
                G.currentMoveArguments[Number(ctx.currentPlayer)]
                    .phases[ctx.phase][Stages.DiscardSuitCard].suits as ICurrentMoveSuitCardIdArguments,
                suitNames: string[] = [];
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    suitNames.push(suit);
                }
            }
            suitName = suitNames[Math.floor(Math.random() * suitNames.length)];
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        validate: (): boolean => true,
    },
    [MoveNames.DiscardCard2PlayersMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.DiscardCard].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.DiscardCard].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx): boolean => {
            let isValid = false;
            if (ctx !== undefined) {
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1];
            }
            return isValid;
        },
    },
    [MoveNames.GetEnlistmentMercenariesMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default3].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default3].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (): boolean => true,
    },
    [MoveNames.GetMjollnirProfitMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["strings"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].strings,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const totalSuitsRanks: number[] = [];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (let j = 0; j < G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default1].strings![0].length; j++) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const suit: string = G.currentMoveArguments[Number(ctx.currentPlayer)]
                    .phases[ctx.phase][Stages.Default1].strings![0][j];
                totalSuitsRanks.push(G.publicPlayers[Number(ctx.currentPlayer)]
                    .cards[suit].reduce(TotalRank, 0) * 2);
            }
            return Object.values(suitsConfig)[totalSuitsRanks
                .indexOf(Math.max(...totalSuitsRanks))].suit;
        },
        validate: (): boolean => true,
    },
    [MoveNames.PassEnlistmentMercenariesMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["empty"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default2].empty,
        getValue: (): ValidMoveIdParam => null,
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
    [MoveNames.PlaceEnlistmentMercenariesMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["strings"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default4].strings,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: string[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.Default4].strings as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (): boolean => true,
    },
    [MoveNames.StartEnlistmentMercenariesMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["empty"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.Default1].empty,
        getValue: (): ValidMoveIdParam => null,
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
    [MoveNames.AddCoinToPouchMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.AddCoinToPouch].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.AddCoinToPouch].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (): boolean => true,
    },
    [MoveNames.ClickCampCardHoldaMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PickCampCardHolda].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): number => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickCampCardHolda].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (): boolean => true,
    },
    [MoveNames.ClickCoinToUpgradeMove]: {
        // TODO Rework if Uline in play or no 1 coin in game (& add param isInitial?)
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["coins"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.UpgradeCoin].coins,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            // TODO Check add TYPE!?
            const moveArguments: ICurrentMoveCoinsArguments[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.UpgradeCoin].coins;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParam, type?: string): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && type !== undefined
                && typeof id === `number`) {
                isValid = CoinUpgradeValidation(G, ctx, id, type);
            }
            return isValid;
        },
    },
    [MoveNames.ClickHeroCardMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PickHero].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickHero].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParam): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                switch (G.heroes[id].name) {
                    case HeroNames.Hourya:
                        isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                        break;
                    case HeroNames.Bonfur:
                    case HeroNames.Dagda:
                        isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                        break;
                    default:
                        break;
                }
            }
            return isValid;
        },
    },
    [MoveNames.DiscardCardMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveSuitCardIdArguments =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.DiscardBoardCard].suits!,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: ICurrentMoveSuitCardIdArguments =
                G.currentMoveArguments[Number(ctx.currentPlayer)]
                    .phases[ctx.phase][Stages.DiscardBoardCard].suits as ICurrentMoveSuitCardIdArguments;
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    suitName = suit;
                }
            }
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        validate: (): boolean => true,
    },
    // [MoveNames.DiscardSuitCardFromPlayerBoardMove]: {
    //     // TODO FIX  IT!!!!!!
    //     getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArguments => G.currentMoveArguments,
    //     // getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
    //     //     const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
    //     //         .phases[ctx.phase][Stages.PickDiscardCard].numbers as number[];
    //     //     return [moveArguments[Math.floor(Math.random() * moveArguments.length)]];
    //     // },
    //     validate: (): boolean => true, // TODO Check it
    // },
    [MoveNames.PickDiscardCardMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["numbers"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PickDiscardCard].numbers,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: number[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PickDiscardCard].numbers as number[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (): boolean => true,
    },
    [MoveNames.PlaceCardMove]: {
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["strings"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)].phases[ctx.phase][Stages.PlaceCards].strings,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: string[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.PlaceCards].strings as string[];
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (): boolean => true, // TODO Check it
    },
    [MoveNames.UpgradeCoinVidofnirVedrfolnirMove]: {
        // TODO Rework if Uline in play or no 1 coin in game(& add param isInitial ?)
        getRange: (G: IMyGameState, ctx: Ctx): ICurrentMoveArgumentsStage["coins"] =>
            G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.UpgradeVidofnirVedrfolnirCoin].coins,
        getValue: (G: IMyGameState, ctx: Ctx): ValidMoveIdParam => {
            const moveArguments: ICurrentMoveCoinsArguments[] = G.currentMoveArguments[Number(ctx.currentPlayer)]
                .phases[ctx.phase][Stages.UpgradeVidofnirVedrfolnirCoin].coins;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        validate: (G?: IMyGameState, ctx?: Ctx, id?: ValidMoveIdParam, type?: string): boolean => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && type !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config?.coinId !== id
                    && CoinUpgradeValidation(G, ctx, id, type);
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
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param num
 * @param values
 * @returns
 */
const ValidateByValues = <T>(value: T, values: T[]): boolean => values.includes(value);

const ValidateByObjectCoinIdTypeIsInitialValues = (value: ICurrentMoveCoinsArguments,
    values: ICurrentMoveArgumentsStage["coins"]): boolean => values.includes(value);

const ValidateByObjectSuitIdValues = (value: ICurrentMoveSuitCardCurrentId, values: ICurrentMoveSuitCardIdArguments):
    boolean => values[value.suit].includes(value.cardId);
