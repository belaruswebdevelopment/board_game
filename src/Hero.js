import { CardNames, RusCardTypes } from "./typescript/enums";
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
    let heroName;
    for (heroName in heroesConfig) {
        const heroData = heroesConfig[heroName];
        if (configOptions.includes(heroData.game)) {
            heroes.push(CreateHero({
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
export const CreateHero = ({ type = RusCardTypes.HERO, name, description, game, suit = null, rank = null, points = null, active = true, buff, validators, actions, stack, } = {}) => ({
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
export const CreateOlwinDoubleNonPlacedCard = ({ name = CardNames.OlwinsDouble, suit, } = {}) => ({
    name,
    suit,
});
export const IsHeroCard = (card) => card !== null && card.active !== undefined;
//# sourceMappingURL=Hero.js.map