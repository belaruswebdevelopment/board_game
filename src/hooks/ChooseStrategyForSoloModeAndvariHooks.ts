import type { Ctx } from "boardgame.io";
import { soloGameAndvariEasyStrategyHeroesConfig, soloGameAndvariHardStrategyHeroesConfig } from "../data/HeroData";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddHeroToPlayerCards } from "../helpers/HeroCardHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { ErrorNames, RusCardTypeNames, SoloGameAndvariStrategyNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, CanBeVoidType, HeroesForSoloGameForStrategyBotAndvariArrayType, HeroNamesForEasyStrategyAndvariKeyofTypeofType, HeroNamesForHardStrategyAndvariKeyofTypeofType, IHeroCard, IMyGameState, IndexOf, IPublicPlayer, OneOrTwoOrThreeOrFour, SuitNamesKeyofTypeofType, ZeroOrOneOrTwoType } from "../typescript/interfaces";

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
export const CheckChooseStrategyForSoloModeAndvariOrder = (G: IMyGameState, ctx: Ctx): void => {
    CheckPlayersBasicOrder(G, ctx);
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
export const CheckChooseStrategyForSoloModeAndvariPhase = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
    if (ctx.currentPlayer === `1`) {
        const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
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
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndChooseStrategyForSoloModeAndvariTurn = (G: IMyGameState, ctx: Ctx): CanBeVoidType<boolean> => {
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
export const EndChooseStrategyForSoloModeAndvariActions = (G: IMyGameState): void => {
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
export const OnChooseStrategyForSoloModeAndvariMove = (G: IMyGameState, ctx: Ctx): void => {
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
export const OnChooseStrategyForSoloModeAndvariTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    if (ctx.currentPlayer === `0`) {
        AddActionsToStack(G, ctx, [StackData.chooseStrategyVariantLevelForSoloModeAndvari()]);
        DrawCurrentProfit(G, ctx);
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
                    AddHeroToPlayerCards(G, ctx, heroCard);
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
            heroesForSoloGameForStrategyBotAndvari as HeroesForSoloGameForStrategyBotAndvariArrayType;
        G.heroesForSoloGameForStrategyBotAndvari =
            ctx.random!.Shuffle(G.heroesForSoloGameForStrategyBotAndvari) as
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
            const suit: CanBeNullType<SuitNamesKeyofTypeofType> = G.heroesForSoloGameForStrategyBotAndvari[i as
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
