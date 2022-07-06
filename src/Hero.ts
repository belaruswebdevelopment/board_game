import { heroesConfig, soloGameDifficultyLevelHeroesConfig, soloGameHeroesForBotConfig, soloGameHeroesForPlayerConfig } from "./data/HeroData";
import { RusCardTypeNames } from "./typescript/enums";
import type { CreateHeroCardType, CreateHeroPlayerCardType, HeroTypes, IHeroCard, IHeroData, IHeroPlayerCard } from "./typescript/interfaces";

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
export const BuildHeroes = (configOptions: string[], solo: boolean): [IHeroCard[], IHeroCard[], IHeroCard[]] => {
    const heroes: IHeroCard[] = [],
        heroesForSoloBot: IHeroCard[] = [],
        heroesForSoloGameDifficultyLevel: IHeroCard[] = [];
    let heroName: HeroTypes;
    for (heroName in heroesConfig) {
        const heroData: IHeroData = heroesConfig[heroName];
        if (solo || (!solo && configOptions.includes(heroData.game))) {
            const hero: IHeroCard = CreateHero({
                name: heroData.name,
                description: heroData.description,
                game: heroData.game,
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
 * @param game Игра/дополнение.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param active Взят ли герой.
 * @param buff Баф.
 * @param validators Валидаторы.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Герой.
 */
export const CreateHero = ({
    type = RusCardTypeNames.Hero,
    name,
    description,
    game,
    suit = null,
    rank = null,
    points = null,
    active = true,
    buff,
    validators,
    actions,
    stack,
}: CreateHeroCardType = {} as CreateHeroCardType): IHeroCard => ({
    type,
    name,
    description,
    game,
    suit,
    rank,
    points,
    active,
    buff,
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
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param variants Варианты расположения карты героя на поле игрока.
 * @returns Карта героя на поле игрока.
 */
export const CreateHeroPlayerCard = ({
    type = RusCardTypeNames.Hero_Player_Card,
    name,
    description,
    game,
    suit = null,
    rank = null,
    points = null,
    active = false,
}: CreateHeroPlayerCardType = {} as CreateHeroPlayerCardType): IHeroPlayerCard => ({
    type,
    name,
    description,
    game,
    suit,
    rank,
    points,
    active,
});

/**
 * <h3>Проверка, является ли объект картой героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой героя.
 */
export const IsHeroCard = (card: unknown): card is IHeroCard =>
    card !== null && (card as IHeroCard).active !== undefined && (`validators` in (card as IHeroCard));

/**
* <h3>Проверка, является ли объект картой героя на поле игрока.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект картой героя на поле игрока.
*/
export const IsHeroPlayerCard = (card: unknown): card is IHeroPlayerCard => card !== null
    && (card as IHeroPlayerCard).active !== undefined && !(`validators` in (card as IHeroPlayerCard));
