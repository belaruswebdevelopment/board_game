import { RusCardTypes } from "./typescript/enums";
import { ICreateHero, IHeroCard, IHeroConfig, IHeroData, IHeroTypes } from "./typescript/interfaces";

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
    let heroName: IHeroTypes;
    for (heroName in heroesConfig) {
        if (Object.prototype.hasOwnProperty.call(heroesConfig, heroName)) {
            const heroData: IHeroData = heroesConfig[heroName];
            if (configOptions.includes(heroData.game)) {
                heroes.push(CreateHero({
                    type: RusCardTypes.HERO,
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

export const IsHeroCard = (card: unknown): card is IHeroCard =>
    card !== null && (card as IHeroCard).active !== undefined;
