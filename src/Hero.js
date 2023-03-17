import { heroesConfig, soloGameAndvariEasyStrategyHeroesConfig, soloGameAndvariHardStrategyHeroesConfig, soloGameAndvariHeroesForPlayersConfig, soloGameDifficultyLevelHeroesConfig, soloGameHeroesForBotConfig, soloGameHeroesForPlayerConfig } from "./data/HeroData";
import { AssertHeroesForSoloBot, AssertHeroesInitialForSoloGameForBotAndvari } from "./is_helpers/AssertionTypeHelpers";
import { CardTypeRusNames, GameModeNames } from "./typescript/enums";
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
export const BuildHeroes = (configOptions, mode) => {
    const heroes = [];
    let heroesForSoloBot = [], heroesForSoloGameDifficultyLevel = [], heroesInitialForSoloGameForBotAndvari = [], heroName;
    for (heroName in heroesConfig) {
        const heroData = heroesConfig[heroName];
        if ((mode === GameModeNames.Solo || mode === GameModeNames.SoloAndvari)
            || ((mode === GameModeNames.Basic || mode === GameModeNames.Multiplayer)
                && configOptions.includes(heroData.game))) {
            const hero = CreateHero({
                actions: heroData.actions,
                buff: heroData.buff,
                description: heroData.description,
                name: heroData.name,
                playerSuit: heroData.playerSuit,
                points: heroData.points,
                rank: heroData.rank,
                pickValidators: heroData.pickValidators,
                stack: heroData.stack,
                validators: heroData.validators,
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
    if (!(heroesForSoloGameDifficultyLevel === null || heroesForSoloGameDifficultyLevel === void 0 ? void 0 : heroesForSoloGameDifficultyLevel.length)) {
        heroesForSoloGameDifficultyLevel = null;
    }
    if (!(heroesInitialForSoloGameForBotAndvari === null || heroesInitialForSoloGameForBotAndvari === void 0 ? void 0 : heroesInitialForSoloGameForBotAndvari.length)) {
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
 * @param actions Действия.
 * @param active Взят ли герой.
 * @param buff Баф.
 * @param description Описание.
 * @param name Название.
 * @param pickValidators Валидаторы выбора карты.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @param stack Стек действий.
 * @param type Тип.
 * @param validators Валидаторы карты.
 * @returns Карта героя.
 */
const CreateHero = ({ actions, active = true, buff, description, name, pickValidators, playerSuit = null, points = null, rank = null, stack, type = CardTypeRusNames.HeroCard, validators, }) => ({
    actions,
    active,
    buff,
    description,
    name,
    pickValidators,
    playerSuit,
    points,
    rank,
    stack,
    type,
    validators,
});
/**
 * <h3>Создание карты героя на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты героя на поле игрока.</li>
 * </ol>
 *
 * @param description Описание.
 * @param name Название.
 * @param points Очки.
 * @param rank Шевроны.
 * @param suit Название фракции дворфов.
 * @param type Тип.
 * @returns Карта героя на поле игрока.
 */
export const CreateHeroPlayerCard = ({ description, name, points = null, rank = 1, suit, type = CardTypeRusNames.HeroPlayerCard, }) => ({
    description,
    name,
    points,
    rank,
    suit,
    type,
});
//# sourceMappingURL=Hero.js.map