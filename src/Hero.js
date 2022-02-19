import { RusCardTypes } from "./typescript/enums";
/**
 * <h3>Создаёт всех героев при инициализации игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @param configOptions Конфиг опций героев.
 * @param heroesConfig Конфиг героев.
 * @returns Массив всех героев.
 */
export const BuildHeroes = (configOptions, heroesConfig) => {
    const heroes = [];
    for (const heroName in heroesConfig) {
        if (configOptions.includes(heroesConfig[heroName].game)) {
            heroes.push(CreateHero({
                type: RusCardTypes.HERO,
                name: heroesConfig[heroName].name,
                description: heroesConfig[heroName].description,
                game: heroesConfig[heroName].game,
                suit: heroesConfig[heroName].suit,
                rank: heroesConfig[heroName].rank,
                points: heroesConfig[heroName].points,
                buff: heroesConfig[heroName].buff,
                validators: heroesConfig[heroName].validators,
                actions: heroesConfig[heroName].actions,
                stack: heroesConfig[heroName].stack,
            }));
        }
    }
    return heroes;
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
 * @param suit Название фракции.
 * @param rank Шевроны.
 * @param points Очки.
 * @param active Взят ли герой.
 * @param buff Баф.
 * @param validators Валидаторы.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Герой.
 */
export const CreateHero = ({ type, name, description, game, suit, rank, points, active = true, buff, validators, actions, stack, } = {}) => ({
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
export const isHeroCard = (card) => card.active !== undefined;
//# sourceMappingURL=Hero.js.map