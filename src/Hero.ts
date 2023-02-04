import { heroesConfig, soloGameAndvariEasyStrategyHeroesConfig, soloGameAndvariHardStrategyHeroesConfig, soloGameAndvariHeroesForPlayersConfig, soloGameDifficultyLevelHeroesConfig, soloGameHeroesForBotConfig, soloGameHeroesForPlayerConfig } from "./data/HeroData";
import { AssertHeroesForSoloBot, AssertHeroesInitialForSoloGameForBotAndvari } from "./is_helpers/AssertionTypeHelpers";
import { CardTypeRusNames, GameModeNames } from "./typescript/enums";
import type { BuildHeroesArray, CanBeNullType, CreateHeroCardFromData, CreateHeroPlayerCardFromData, GameNamesKeyofTypeofType, HeroCard, HeroCardData, HeroNamesKeyofTypeofType, HeroPlayerCard } from "./typescript/interfaces";

/**
 * <h3>Создаёт всех героев при инициализации игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @param configOptions Конфиг опций героев.
 * @param mode Режим игры.
 * @returns Массив всех героев.
 */
export const BuildHeroes = (configOptions: GameNamesKeyofTypeofType[], mode: GameModeNames): BuildHeroesArray => {
    const heroes: HeroCard[] = [];
    let heroesForSoloBot: CanBeNullType<HeroCard[]> = [],
        heroesForSoloGameDifficultyLevel: CanBeNullType<HeroCard[]> = [],
        heroesInitialForSoloGameForBotAndvari: CanBeNullType<HeroCard[]> = [],
        heroName: HeroNamesKeyofTypeofType;
    for (heroName in heroesConfig) {
        const heroData: HeroCardData = heroesConfig[heroName];
        if ((mode === GameModeNames.Solo || mode === GameModeNames.SoloAndvari)
            || ((mode === GameModeNames.Basic || mode === GameModeNames.Multiplayer)
                && configOptions.includes(heroData.game))) {
            const hero: HeroCard = CreateHero({
                name: heroData.name,
                description: heroData.description,
                playerSuit: heroData.playerSuit,
                points: heroData.points,
                rank: heroData.rank,
                buff: heroData.buff,
                pickValidators: heroData.pickValidators,
                validators: heroData.validators,
                actions: heroData.actions,
                stack: heroData.stack,
            });
            if ((mode === GameModeNames.Basic || mode === GameModeNames.Multiplayer)
                || (mode === GameModeNames.Solo && heroName in soloGameHeroesForPlayerConfig)
                || (mode === GameModeNames.SoloAndvari && heroName in soloGameAndvariHeroesForPlayersConfig)) {
                heroes.push(hero);
            }
            if (mode === GameModeNames.Solo && heroName in soloGameHeroesForBotConfig) {
                if (heroesForSoloBot === null) {
                    throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
                }
                heroesForSoloBot.push(hero);
            }
            if (mode === GameModeNames.Solo && heroName in soloGameDifficultyLevelHeroesConfig) {
                if (heroesForSoloGameDifficultyLevel === null) {
                    throw new Error(`Уровень сложности для соло игры не может быть ранее выбран.`);
                }
                heroesForSoloGameDifficultyLevel.push(hero);
            }
            if (mode === GameModeNames.SoloAndvari && (heroName in soloGameAndvariEasyStrategyHeroesConfig
                || heroName in soloGameAndvariHardStrategyHeroesConfig)) {
                if (heroesInitialForSoloGameForBotAndvari === null) {
                    throw new Error(`Набор стартовых героев и героев для стратегии соло бота Андвари не может быть ранее использован.`);
                }
                heroesInitialForSoloGameForBotAndvari.push(hero);
            }
        }
    }
    if (!heroesForSoloBot.length) {
        heroesForSoloBot = null;
    }
    if (!heroesForSoloGameDifficultyLevel?.length) {
        heroesForSoloGameDifficultyLevel = null;
    }
    if (!heroesInitialForSoloGameForBotAndvari?.length) {
        heroesInitialForSoloGameForBotAndvari = null;
    }
    if (heroesForSoloBot !== null) {
        AssertHeroesForSoloBot(heroesForSoloBot);
    }
    if (heroesInitialForSoloGameForBotAndvari !== null) {
        AssertHeroesInitialForSoloGameForBotAndvari(heroesInitialForSoloGameForBotAndvari);
    }
    return [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel, heroesInitialForSoloGameForBotAndvari];
};

/**
 * <h3>Создание карты героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт героев при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param description Описание.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @param active Взят ли герой.
 * @param buff Баф.
 * @param pickValidators Валидаторы выбора карты.
 * @param validators Валидаторы карты.
 * @param actions Действия.
 * @param stack Стек действий.
 * @returns Карта героя.
 */
const CreateHero = ({
    type = CardTypeRusNames.HeroCard,
    name,
    description,
    playerSuit = null,
    points = null,
    rank = null,
    active = true,
    buff,
    pickValidators,
    validators,
    actions,
    stack,
}: CreateHeroCardFromData): HeroCard => ({
    type,
    name,
    description,
    playerSuit,
    points,
    rank,
    active,
    buff,
    pickValidators,
    validators,
    actions,
    stack,
});

/**
 * <h3>Создание карты героя на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты героя на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта героя на поле игрока.
 */
export const CreateHeroPlayerCard = ({
    type = CardTypeRusNames.HeroPlayerCard,
    name,
    description,
    suit,
    points = null,
    rank = 1,
}: CreateHeroPlayerCardFromData): HeroPlayerCard => ({
    type,
    name,
    description,
    suit,
    points,
    rank,
});
