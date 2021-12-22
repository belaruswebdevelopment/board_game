import { AddDataToLog, LogTypes } from "./Logging";
import { AddActionsToStackAfterCurrent } from "./helpers/StackHelpers";
import { TotalRank } from "./helpers/ScoreHelpers";
import { PickHeroAction } from "./actions/Actions";
import { suitsConfig } from "./data/SuitData";
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
                type: "герой",
                name: heroesConfig[hero].name,
                description: heroesConfig[hero].description,
                game: heroesConfig[hero].game,
                suit: heroesConfig[hero].suit,
                rank: heroesConfig[hero].rank,
                points: heroesConfig[hero].points,
                stack: heroesConfig[hero].stack,
            }));
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
export const CheckPickHero = (G, ctx) => {
    if (!G.publicPlayers[Number(ctx.currentPlayer)].buffs.noHero) {
        let playerCards = [];
        let index = 0;
        for (const suit in suitsConfig) {
            if (suitsConfig.hasOwnProperty(suit)) {
                playerCards[index] = [];
                playerCards[index].push(...G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]);
                index++;
            }
        }
        const isCanPickHero = Math.min(...playerCards.map((item) => item.reduce(TotalRank, 0))) >
            G.publicPlayers[Number(ctx.currentPlayer)].heroes.length;
        if (isCanPickHero) {
            const stack = [
                {
                    action: PickHeroAction.name,
                    config: {
                        stageName: `pickHero`,
                    },
                },
            ];
            AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен выбрать нового героя.`);
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
    }
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
export const CreateHero = ({ type, name, description, game, suit, rank, points, active = true, stack } = {}) => ({
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
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerCards = [];
        for (const suit in suitsConfig) {
            if (suitsConfig.hasOwnProperty(suit)) {
                playerCards.concat(G.publicPlayers[i].cards[suit]);
            }
        }
        const thrud = playerCards.find((card) => card.name === `Thrud`);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex = G.publicPlayers[i].cards[thrud.suit]
                .findIndex((card) => card.name === `Thrud`);
            G.publicPlayers[i].cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypes.GAME, `Герой Труд игрока ${G.publicPlayers[i].nickname} уходит с игрового поля.`);
        }
    }
};
