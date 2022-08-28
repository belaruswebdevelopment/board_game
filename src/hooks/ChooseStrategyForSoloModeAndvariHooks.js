import { soloGameAndvariEasyStrategyHeroesConfig, soloGameAndvariHardStrategyHeroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddHeroToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { ErrorNames, RusCardTypeNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
/**
 * <h3>Проверяет порядок хода при начале фазы 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckChooseStrategyForSoloModeAndvariOrder = (G, ctx) => CheckPlayersBasicOrder(G, ctx);
/**
 * <h3>Проверяет необходимость завершения фазы 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckChooseStrategyForSoloModeAndvariPhase = (G, ctx) => {
    if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
        }
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
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndChooseStrategyForSoloModeAndvariTurn = (G, ctx) => {
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
 * @param G
 */
export const EndChooseStrategyForSoloModeAndvariActions = (G) => {
    G.publicPlayersOrder = [];
};
/**
 * <h3>Действия при завершении мува в фазе 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnChooseStrategyForSoloModeAndvariMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
/**
 * <h3>Действия при начале хода в фазе 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnChooseStrategyForSoloModeAndvariTurnBegin = (G, ctx) => {
    if (ctx.currentPlayer === `0`) {
        AddActionsToStack(G, ctx, [StackData.chooseStrategyVariantLevelForSoloModeAndvari()]);
        DrawCurrentProfit(G, ctx);
    }
    else if (ctx.currentPlayer === `1`) {
        if (G.heroesInitialForSoloGameForBotAndvari === null) {
            throw new Error(`Набор стартовых героев и героев для стратегии соло бота Андвари не может быть ранее использован.`);
        }
        if (G.soloGameAndvariStrategyVariantLevel === null) {
            throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
        }
        const heroesForSoloGameForStrategyBotAndvari = [];
        let heroNameEasyStrategy, heroNameHardStrategy, _exhaustiveCheck;
        switch (G.soloGameAndvariStrategyLevel) {
            case SoloGameAndvariStrategyNames.NoHeroEasyStrategy:
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для выбора в соло режиме Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    G.heroes.push(heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.NoHeroHardStrategy:
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    G.heroes.push(heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.WithHeroEasyStrategy:
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    AddHeroToPlayerCards(G, ctx, heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.WithHeroHardStrategy:
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard = G.heroesInitialForSoloGameForBotAndvari.find((hero) => hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    AddHeroToPlayerCards(G, ctx, heroCard);
                }
                break;
            case null:
                throw new Error(`Уровень сложности стратегий для соло бота Андвари не может быть не выбран.`);
            default:
                _exhaustiveCheck = G.soloGameAndvariStrategyLevel;
                throw new Error(`Не существует такого уровня сложности стратегий для соло бота Андвари.`);
                return _exhaustiveCheck;
        }
        G.heroesForSoloGameForStrategyBotAndvari =
            heroesForSoloGameForStrategyBotAndvari;
        G.heroesForSoloGameForStrategyBotAndvari =
            ctx.random.Shuffle(G.heroesForSoloGameForStrategyBotAndvari);
        switch (G.soloGameAndvariStrategyVariantLevel) {
            case 1:
                G.strategyForSoloBotAndvari = {
                    general: {
                        0: undefined,
                    },
                    reserve: {
                        1: undefined,
                        2: undefined,
                        3: undefined,
                        4: undefined,
                    },
                };
                break;
            case 2:
                G.strategyForSoloBotAndvari = {
                    general: {
                        0: undefined,
                        1: undefined,
                    },
                    reserve: {
                        2: undefined,
                        3: undefined,
                        4: undefined,
                    },
                };
                break;
            case 3:
                G.strategyForSoloBotAndvari = {
                    general: {
                        0: undefined,
                        1: undefined,
                        2: undefined,
                    },
                    reserve: {
                        3: undefined,
                        4: undefined,
                    },
                };
                break;
            default:
                _exhaustiveCheck = G.soloGameAndvariStrategyVariantLevel;
                throw new Error(`Нет такого варианта стратегий соло бота Андвари.`);
                return _exhaustiveCheck;
        }
        for (let i = 0; i < G.heroesForSoloGameForStrategyBotAndvari.length; i++) {
            const suit = G.heroesForSoloGameForStrategyBotAndvari[i].suit;
            if (suit === null) {
                throw new Error(`В массиве героев для стратегий соло бота Андвари не должно быть героев без принадлежности к фракции дворфов с названием '${G.heroesForSoloGameForStrategyBotAndvari[i].name}'.`);
            }
            if (i < G.soloGameAndvariStrategyVariantLevel) {
                G.strategyForSoloBotAndvari.general[i] = suit;
            }
            else {
                G.strategyForSoloBotAndvari.reserve[i] = suit;
            }
        }
        G.heroesInitialForSoloGameForBotAndvari = null;
    }
};
//# sourceMappingURL=ChooseStrategyForSoloModeAndvariHooks.js.map