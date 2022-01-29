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
    for (const hero in heroesConfig) {
        if (configOptions.includes(heroesConfig[hero].game)) {
            heroes.push(CreateHero({
                type: RusCardTypes.HERO,
                name: heroesConfig[hero].name,
                description: heroesConfig[hero].description,
                game: heroesConfig[hero].game,
                suit: heroesConfig[hero].suit,
                rank: heroesConfig[hero].rank,
                points: heroesConfig[hero].points,
                buff: heroesConfig[hero].buff,
                validators: heroesConfig[hero].validators,
                actions: heroesConfig[hero].actions,
                stack: heroesConfig[hero].stack,
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
 * @param actions Экшены.
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
//# sourceMappingURL=Hero.js.map