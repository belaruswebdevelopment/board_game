import { RusCardTypes } from "./typescript/enums";
import { ICreateHero, IHeroCard, IHeroConfig, IHeroTypes } from "./typescript/interfaces";

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
export const BuildHeroes = (configOptions: string[], heroesConfig: IHeroConfig): IHeroCard[] => {
    const heroes: IHeroCard[] = [];
    for (const heroName in heroesConfig) {
        if (configOptions.includes(heroesConfig[heroName as IHeroTypes].game)) {
            heroes.push(CreateHero({
                type: RusCardTypes.HERO,
                name: heroesConfig[heroName as IHeroTypes].name,
                description: heroesConfig[heroName as IHeroTypes].description,
                game: heroesConfig[heroName as IHeroTypes].game,
                suit: heroesConfig[heroName as IHeroTypes].suit,
                rank: heroesConfig[heroName as IHeroTypes].rank,
                points: heroesConfig[heroName as IHeroTypes].points,
                buff: heroesConfig[heroName as IHeroTypes].buff,
                validators: heroesConfig[heroName as IHeroTypes].validators,
                actions: heroesConfig[heroName as IHeroTypes].actions,
                stack: heroesConfig[heroName as IHeroTypes].stack,
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
export const CreateHero = ({
    type,
    name,
    description,
    game,
    suit,
    rank,
    points,
    active = true,
    buff,
    validators,
    actions,
    stack,
}: ICreateHero = {} as ICreateHero): IHeroCard => ({
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

export const isHeroCard = (card: unknown): card is IHeroCard => (card as IHeroCard).active !== undefined;
