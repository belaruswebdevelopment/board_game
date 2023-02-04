import { soloGameAndvariEasyStrategyHeroesConfig, soloGameAndvariHardStrategyHeroesConfig } from "../data/HeroData";
import { AllStackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { AddCardToPlayerBoardCards } from "../helpers/CardHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddHeroToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AssertHeroesForSoloGameForStrategyBotAndvari, AssertHeroesForSoloGameForStrategyBotAndvariIndex, AssertOneOrTwoOrThreeOrFour, AssertZeroOrOneOrTwo } from "../is_helpers/AssertionTypeHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { CardTypeRusNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
/**
 * <h3>Проверяет порядок хода при начале фазы 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const CheckChooseStrategyForSoloModeAndvariOrder = ({ G, ctx, ...rest }) => {
    CheckPlayersBasicOrder({ G, ctx, ...rest });
};
/**
 * <h3>Проверяет необходимость завершения фазы 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param context
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckChooseStrategyForSoloModeAndvariPhase = ({ G, ctx }) => {
    if (ctx.currentPlayer === `1`) {
        return G.heroesForSoloGameForStrategyBotAndvari !== null
            && G.heroesForSoloGameForStrategyBotAndvari.length === 5
            && G.heroesInitialForSoloGameForBotAndvari === null;
    }
};
/**
 * <h3>Проверяет необходимость завершения хода в фазе 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param context
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndChooseStrategyForSoloModeAndvariTurn = ({ G, ctx }) => {
    if (ctx.currentPlayer === `0`) {
        return G.soloGameAndvariStrategyVariantLevel !== null && G.soloGameAndvariStrategyLevel !== null;
    }
};
/**
 * <h3>Действия при завершении фазы 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const EndChooseStrategyForSoloModeAndvariActions = ({ G }) => {
    G.publicPlayersOrder = [];
};
/**
 * <h3>Действия при завершении мува в фазе 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OnChooseStrategyForSoloModeAndvariMove = ({ G, ctx, ...rest }) => {
    StartOrEndActions({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
};
/**
 * <h3>Действия при начале хода в фазе 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const OnChooseStrategyForSoloModeAndvariTurnBegin = ({ G, ctx, random, ...rest }) => {
    if (ctx.currentPlayer === `0`) {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, random, ...rest }, [AllStackData.chooseStrategyVariantLevelForSoloModeAndvari()]);
        DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, random, ...rest });
    }
    else if (ctx.currentPlayer === `1`) {
        if (G.heroesInitialForSoloGameForBotAndvari === null) {
            throw new Error(`Набор стартовых героев и героев для стратегии соло бота Андвари не может быть ранее использован.`);
        }
        if (G.soloGameAndvariStrategyVariantLevel === null) {
            throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
        }
        let heroesForSoloGameForStrategyBotAndvari = [], pickedCard, heroNameEasyStrategy, heroNameHardStrategy, _exhaustiveCheck;
        switch (G.soloGameAndvariStrategyLevel) {
            case SoloGameAndvariStrategyNames.NoHeroEasyStrategy:
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для выбора в соло режиме Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameHardStrategy}'.`);
                    }
                    G.heroes.push(heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.NoHeroHardStrategy:
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameHardStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    G.heroes.push(heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.WithHeroEasyStrategy:
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameHardStrategy}'.`);
                    }
                    pickedCard = AddHeroToPlayerCards({ G, ctx, myPlayerID: ctx.currentPlayer, random, ...rest }, heroCard);
                    if (`suit` in pickedCard) {
                        AddCardToPlayerBoardCards({ G, ctx, myPlayerID: ctx.currentPlayer, random, ...rest }, pickedCard);
                    }
                }
                break;
            case SoloGameAndvariStrategyNames.WithHeroHardStrategy:
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameHardStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${CardTypeRusNames.HeroCard}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    pickedCard = AddHeroToPlayerCards({ G, ctx, myPlayerID: ctx.currentPlayer, random, ...rest }, heroCard);
                    if (`suit` in pickedCard) {
                        AddCardToPlayerBoardCards({ G, ctx, myPlayerID: ctx.currentPlayer, random, ...rest }, pickedCard);
                    }
                }
                break;
            case null:
                throw new Error(`Уровень сложности стратегий для соло бота Андвари не может быть не выбран.`);
            default:
                _exhaustiveCheck = G.soloGameAndvariStrategyLevel;
                throw new Error(`Не существует такого уровня сложности стратегий для соло бота Андвари.`);
                return _exhaustiveCheck;
        }
        heroesForSoloGameForStrategyBotAndvari = random.Shuffle(heroesForSoloGameForStrategyBotAndvari);
        AssertHeroesForSoloGameForStrategyBotAndvari(heroesForSoloGameForStrategyBotAndvari);
        G.heroesForSoloGameForStrategyBotAndvari = heroesForSoloGameForStrategyBotAndvari;
        switch (G.soloGameAndvariStrategyVariantLevel) {
            case 1:
                G.strategyForSoloBotAndvari = {
                    general: {
                        0: null,
                    },
                    reserve: {
                        1: null,
                        2: null,
                        3: null,
                        4: null,
                    },
                };
                break;
            case 2:
                G.strategyForSoloBotAndvari = {
                    general: {
                        0: null,
                        1: null,
                    },
                    reserve: {
                        2: null,
                        3: null,
                        4: null,
                    },
                };
                break;
            case 3:
                G.strategyForSoloBotAndvari = {
                    general: {
                        0: null,
                        1: null,
                        2: null,
                    },
                    reserve: {
                        3: null,
                        4: null,
                    },
                };
                break;
            default:
                _exhaustiveCheck = G.soloGameAndvariStrategyVariantLevel;
                throw new Error(`Нет такого варианта стратегий соло бота Андвари.`);
                return _exhaustiveCheck;
        }
        for (let i = 0; i < G.heroesForSoloGameForStrategyBotAndvari.length; i++) {
            AssertHeroesForSoloGameForStrategyBotAndvariIndex(i);
            const suit = G.heroesForSoloGameForStrategyBotAndvari[i].playerSuit;
            if (suit === null) {
                throw new Error(`В массиве героев для стратегий соло бота Андвари не должно быть героев без принадлежности к фракции дворфов с названием '${G.heroesForSoloGameForStrategyBotAndvari[i].name}'.`);
            }
            if (G.strategyForSoloBotAndvari === null) {
                throw new Error(`В объекте стратегий для соло бота Андвари не может не быть фракций.`);
            }
            if (i < G.soloGameAndvariStrategyVariantLevel) {
                AssertZeroOrOneOrTwo(i);
                G.strategyForSoloBotAndvari.general[i] = suit;
            }
            else {
                AssertOneOrTwoOrThreeOrFour(i);
                G.strategyForSoloBotAndvari.reserve[i] = suit;
            }
        }
        G.heroesInitialForSoloGameForBotAndvari = null;
    }
};
//# sourceMappingURL=ChooseStrategyForSoloModeAndvariHooks.js.map