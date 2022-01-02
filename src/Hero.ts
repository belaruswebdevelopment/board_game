import { Ctx } from "boardgame.io";
import { AddDataToLog } from "./Logging";
import { PlayerCardsType } from "./typescript/card_types";
import { HeroNames, LogTypes, RusCardTypes } from "./typescript/enums";
import { ICreateHero, IHero, IHeroConfig, MyGameState } from "./typescript/interfaces";

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
export const BuildHeroes = (configOptions: string[], heroesConfig: IHeroConfig): IHero[] => {
    const heroes: IHero[] = [];
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
                stack: heroesConfig[hero].stack,
            } as ICreateHero));
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
    stack
}: ICreateHero = {} as ICreateHero): IHero => ({
    type,
    name,
    description,
    game,
    suit,
    rank,
    points,
    active,
    stack,
});

/**
 * <h3>Удаляет Труд в конце игры с поля игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце матча после всех игровых событий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G: MyGameState, ctx: Ctx): void => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerCards: PlayerCardsType[] = Object.values(G.publicPlayers[i].cards).flat();
        const thrud: PlayerCardsType | undefined =
            playerCards.find((card: PlayerCardsType): boolean => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex: number = G.publicPlayers[i].cards[thrud.suit]
                .findIndex((card: PlayerCardsType): boolean => card.name === HeroNames.Thrud);
            G.publicPlayers[i].cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypes.GAME, `Герой Труд игрока ${G.publicPlayers[i].nickname} уходит с игрового поля.`);
        }
    }
};
