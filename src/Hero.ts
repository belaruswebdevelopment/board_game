import { heroesConfig, soloGameDifficultyLevelHeroesConfig, soloGameHeroesForBotConfig, soloGameHeroesForPlayerConfig } from "./data/HeroData";
import { GameNames, RusCardTypeNames } from "./typescript/enums";
import type { CreateHeroCardType, CreateHeroPlayerCardType, HeroKeyofTypes, IHeroCard, IHeroData, IHeroPlayerCard } from "./typescript/interfaces";

/**
 * <h3>Создаёт всех героев при инициализации игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @param configOptions Конфиг опций героев.
 * @param solo Является ли режим игры соло игрой.
 * @returns Массив всех героев.
 */
export const BuildHeroes = (configOptions: GameNames[], solo: boolean): [IHeroCard[], IHeroCard[], IHeroCard[]] => {
    const heroes: IHeroCard[] = [],
        heroesForSoloBot: IHeroCard[] = [],
        heroesForSoloGameDifficultyLevel: IHeroCard[] = [];
    let heroName: HeroKeyofTypes;
    for (heroName in heroesConfig) {
        const heroData: IHeroData = heroesConfig[heroName];
        if (solo || (!solo && configOptions.includes(heroData.game))) {
            const hero: IHeroCard = CreateHero({
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
            if (!solo || solo && heroName in soloGameHeroesForPlayerConfig) {
                heroes.push(hero);
            }
            if (solo && heroName in soloGameHeroesForBotConfig) {
                heroesForSoloBot.push(hero);
            }
            if (solo && heroName in soloGameDifficultyLevelHeroesConfig) {
                heroesForSoloGameDifficultyLevel.push(hero);
            }
        }
    }
    return [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel];
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
export const CreateHero = ({
    type = RusCardTypeNames.Hero_Card,
    name,
    description,
    suit = null,
    rank = null,
    points = null,
    active = true,
    buff,
    pickValidators,
    validators,
    actions,
    stack,
}: CreateHeroCardType = {} as CreateHeroCardType): IHeroCard => ({
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
export const CreateHeroPlayerCard = ({
    type = RusCardTypeNames.Hero_Player_Card,
    name,
    description,
    suit,
    rank,
    points,
}: CreateHeroPlayerCardType = {} as CreateHeroPlayerCardType): IHeroPlayerCard => ({
    type,
    name,
    description,
    suit,
    rank,
    points,
});
