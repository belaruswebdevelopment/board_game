import { soloGameAndvariEasyStrategyHeroesConfig, soloGameAndvariHardStrategyHeroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddHeroToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RusCardTypeNames, SoloGameAndvariStrategyNames, SuitNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, CanBeVoidType, FnContext, HeroesForSoloGameForStrategyBotAndvariArrayType, HeroNamesForEasyStrategyAndvariKeyofTypeofType, HeroNamesForHardStrategyAndvariKeyofTypeofType, IHeroCard, IndexOf, OneOrTwoOrThreeOrFour, ZeroOrOneOrTwoType } from "../typescript/interfaces";

/**
 * <h3>Проверяет порядок хода при начале фазы 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckChooseStrategyForSoloModeAndvariOrder = ({ G, ctx, ...rest }: FnContext): void => {
    CheckPlayersBasicOrder({ G, ctx, ...rest });
};

/**
 * <h3>Проверяет необходимость завершения фазы 'chooseDifficultySoloModeAndvari'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'chooseDifficultySoloModeAndvari'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckChooseStrategyForSoloModeAndvariPhase = ({ G, ctx }: FnContext): CanBeVoidType<boolean> => {
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
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndChooseStrategyForSoloModeAndvariTurn = ({ G, ctx }: FnContext): CanBeVoidType<boolean> => {
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
 * @returns
 */
export const EndChooseStrategyForSoloModeAndvariActions = ({ G }: FnContext): void => {
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
 * @returns
 */
export const OnChooseStrategyForSoloModeAndvariMove = ({ G, ctx, ...rest }: FnContext): void => {
    StartOrEndActions({ G, ctx, playerID: ctx.currentPlayer, ...rest });
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
export const OnChooseStrategyForSoloModeAndvariTurnBegin = ({ G, ctx, random, ...rest }: FnContext): void => {
    if (ctx.currentPlayer === `0`) {
        AddActionsToStack({ G, ctx, playerID: ctx.currentPlayer, random, ...rest },
            [StackData.chooseStrategyVariantLevelForSoloModeAndvari()]);
        DrawCurrentProfit({ G, ctx, playerID: ctx.currentPlayer, random, ...rest });
    } else if (ctx.currentPlayer === `1`) {
        if (G.heroesInitialForSoloGameForBotAndvari === null) {
            throw new Error(`Набор стартовых героев и героев для стратегии соло бота Андвари не может быть ранее использован.`);
        }
        if (G.soloGameAndvariStrategyVariantLevel === null) {
            throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
        }
        const heroesForSoloGameForStrategyBotAndvari: IHeroCard[] = [];
        let heroNameEasyStrategy: HeroNamesForEasyStrategyAndvariKeyofTypeofType,
            heroNameHardStrategy: HeroNamesForHardStrategyAndvariKeyofTypeofType,
            _exhaustiveCheck: never;
        switch (G.soloGameAndvariStrategyLevel) {
            case SoloGameAndvariStrategyNames.NoHeroEasyStrategy:
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для выбора в соло режиме Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    G.heroes.push(heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.NoHeroHardStrategy:
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    G.heroes.push(heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.WithHeroEasyStrategy:
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    AddHeroToPlayerCards({ G, ctx, playerID: ctx.currentPlayer, random, ...rest }, heroCard);
                }
                break;
            case SoloGameAndvariStrategyNames.WithHeroHardStrategy:
                for (heroNameHardStrategy in soloGameAndvariHardStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameHardStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameHardStrategy}'.`);
                    }
                    heroesForSoloGameForStrategyBotAndvari.push(heroCard);
                }
                for (heroNameEasyStrategy in soloGameAndvariEasyStrategyHeroesConfig) {
                    const heroCard: CanBeUndefType<IHeroCard> =
                        G.heroesInitialForSoloGameForBotAndvari.find((hero: IHeroCard): boolean =>
                            hero.name === heroNameEasyStrategy);
                    if (heroCard === undefined) {
                        throw new Error(`В массиве героев для соло бот Андвари отсутствует '${RusCardTypeNames.Hero_Card}' с названием '${heroNameEasyStrategy}'.`);
                    }
                    AddHeroToPlayerCards({ G, ctx, playerID: ctx.currentPlayer, random, ...rest }, heroCard);
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
            heroesForSoloGameForStrategyBotAndvari as HeroesForSoloGameForStrategyBotAndvariArrayType;
        G.heroesForSoloGameForStrategyBotAndvari = random.Shuffle(G.heroesForSoloGameForStrategyBotAndvari) as
            HeroesForSoloGameForStrategyBotAndvariArrayType;
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
            const suit: CanBeNullType<SuitNames> = G.heroesForSoloGameForStrategyBotAndvari[i as
                IndexOf<HeroesForSoloGameForStrategyBotAndvariArrayType>].suit;
            if (suit === null) {
                throw new Error(`В массиве героев для стратегий соло бота Андвари не должно быть героев без принадлежности к фракции дворфов с названием '${G.heroesForSoloGameForStrategyBotAndvari[i as IndexOf<HeroesForSoloGameForStrategyBotAndvariArrayType>].name}'.`);
            }
            if (i < G.soloGameAndvariStrategyVariantLevel) {
                G.strategyForSoloBotAndvari.general[i as ZeroOrOneOrTwoType] = suit;
            } else {
                G.strategyForSoloBotAndvari.reserve[i as OneOrTwoOrThreeOrFour] = suit;
            }
        }
        G.heroesInitialForSoloGameForBotAndvari = null;
    }
};
