import { heroesConfig, soloGameAndvariEasyStrategyHeroesConfig, soloGameAndvariHardStrategyHeroesConfig, soloGameAndvariHeroesForPlayersConfig, soloGameDifficultyLevelHeroesConfig, soloGameHeroesForBotConfig, soloGameHeroesForPlayerConfig } from "./data/HeroData";
import { GameModeNames, RusCardTypeNames } from "./typescript/enums";
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
        if ((mode === GameModeNames.Solo1 || mode === GameModeNames.SoloAndvari)
            || ((mode === GameModeNames.Basic || mode === GameModeNames.Multiplayer)
                && configOptions.includes(heroData.game))) {
            const hero = CreateHero({
                name: heroData.name,
                description: heroData.description,
                suit: heroData.suit,
                rank: heroData.rank,
                points: heroData.points,
                buff: heroData.buff,
                validators: heroData.validators,
                actions: heroData.actions,
                stack: heroData.stack,
            });
            if ((mode === GameModeNames.Basic || mode === GameModeNames.Multiplayer)
                || (mode === GameModeNames.Solo1 && heroName in soloGameHeroesForPlayerConfig)
                || (mode === GameModeNames.SoloAndvari && heroName in soloGameAndvariHeroesForPlayersConfig)) {
                heroes.push(hero);
            }
            if (mode === GameModeNames.Solo1 && heroName in soloGameHeroesForBotConfig) {
                if (heroesForSoloBot === null) {
                    throw new Error(`В массиве карт героев для соло бота не может не быть героев.`);
                }
                heroesForSoloBot.push(hero);
            }
            if (mode === GameModeNames.Solo1 && heroName in soloGameDifficultyLevelHeroesConfig) {
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
    return [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel,
        heroesInitialForSoloGameForBotAndvari];
};
/**
 * <h3>Создание героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param active Взят ли герой.
 * @param buff Баф.
 * @param pickValidators Валидаторы выбора карты.
 * @param validators Валидаторы карты.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Герой.
 */
const CreateHero = ({ type = RusCardTypeNames.Hero_Card, name, description, suit = null, rank = null, points = null, active = true, buff, pickValidators, validators, actions, stack, }) => ({
    type,
    name,
    description,
    suit,
    rank,
    points,
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
 * <li>Происходит при размещении карты героя на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта героя на поле игрока.
 */
export const CreateHeroPlayerCard = ({ type = RusCardTypeNames.Hero_Player_Card, name, description, suit, rank, points, }) => ({
    type,
    name,
    description,
    suit,
    rank,
    points,
});
//# sourceMappingURL=Hero.js.map