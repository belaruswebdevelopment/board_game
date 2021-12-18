import { heroesConfig } from "./data/HeroData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddDataToLog, LogTypes } from "./Logging";
import { AddActionsToStackAfterCurrent } from "./helpers/StackHelpers";
import { TotalRank } from "./helpers/ScoreHelpers";
import { MyGameState } from "./GameSetup";
import { Ctx } from "boardgame.io";
import { IStack, PlayerCardsType } from "./Player";
import { PickHeroAction } from "./actions/HeroActions";

/**
 * <h3>Интерфейс для героя.</h3>
 */
export interface IHero {
    type: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    active: boolean,
    stack: IStack[],
}

/**
 * <h3>Интерфейс для создания героя.</h3>
 */
interface ICreateHero {
    type: string,
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    active?: boolean,
    stack: IStack[],
}

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
 * @param suit Фракция.
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
 * <h3>Создаёт всех героев при инициализации игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @param config Конфиг героев.
 * @returns Массив всех героев.
 */
export const BuildHeroes = (config: string[]): IHero[] => {
    const heroes: IHero[] = [];
    for (const hero in heroesConfig) {
        if (config.includes(heroesConfig[hero].game)) {
            heroes.push(CreateHero({
                type: "герой",
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
 * <h3>Проверяет возможность взятия нового героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при расположении на планшете игрока карта из таверны.</li>
 * <li>Происходит при завершении действия взятых героев.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Илуд.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Труд.</li>
 * <li>Происходит при перемещении на планшете игрока карта героя Труд.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickHero = (G: MyGameState, ctx: Ctx): void => {
    if (!G.publicPlayers[Number(ctx.currentPlayer)].buffs.noHero) {
        const isCanPickHero: boolean =
            Math.min(...G.publicPlayers[Number(ctx.currentPlayer)].cards
                .map((item: PlayerCardsType[]): number => item.reduce(TotalRank, 0))) >
            G.publicPlayers[Number(ctx.currentPlayer)].heroes.length;
        if (isCanPickHero) {
            const stack: IStack[] = [
                {
                    action: PickHeroAction,
                    config: {
                        stageName: `pickHero`,
                    },
                },
            ];
            AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен выбрать
            нового героя.`);
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
    }
};

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
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        const playerCards: PlayerCardsType[] = G.publicPlayers[i].cards.flat(),
            thrud: PlayerCardsType | undefined =
                playerCards.find((card: PlayerCardsType): boolean => card.name === `Thrud`);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudSuit: number = GetSuitIndexByName(thrud.suit),
                thrudIndex: number = G.publicPlayers[i].cards[thrudSuit]
                    .findIndex((card: PlayerCardsType): boolean => card.name === `Thrud`);
            G.publicPlayers[i].cards[thrudSuit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypes.GAME, `Герой Труд игрока ${G.publicPlayers[i].nickname} уходит с игрового поля.`);
        }
    }
};
