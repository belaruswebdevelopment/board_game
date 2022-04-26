import { CardNames, RusCardTypes } from "./typescript/enums";
import type { ICreateHero, ICreateOlwinDoubleNonPlacedCard, IHeroCard, IHeroConfig, IHeroData, IHeroTypes, IOlwinDoubleNonPlacedCard } from "./typescript/interfaces";

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
        const heroData: IHeroData = heroesConfig[heroName];
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
export const CreateHero = ({
    type = RusCardTypes.HERO,
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

export const CreateOlwinDoubleNonPlacedCard = ({
    name = CardNames.OlwinsDouble,
    suit,
}: ICreateOlwinDoubleNonPlacedCard = {} as ICreateOlwinDoubleNonPlacedCard): IOlwinDoubleNonPlacedCard => ({
    name,
    suit,
});

export const IsHeroCard = (card: unknown): card is IHeroCard =>
    card !== null && (card as IHeroCard).active !== undefined;
