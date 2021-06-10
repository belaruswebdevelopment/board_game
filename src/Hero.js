import {TotalRank} from "./Score";
import {heroesConfig} from "./data/HeroData";

/**
 * Создание героя.
 * Применения:
 * 1) Происходит при создании всех героев при инициализации игры.
 *
 * @param type Тип.
 * @param name Название.
 * @param description Описание.
 * @param game Игра/дополнене.
 * @param suit Фракция.
 * @param rank Шевроны.
 * @param points Очки.
 * @param active Взят ли герой.
 * @param action Действия.
 * @returns {{game, name, description, rank, active: boolean, action, suit, points}} Герой.
 * @constructor
 */
export const CreateHero = ({type, name, description, game, suit, rank, points, active = true, action} = {}) => {
    return {
        type,
        name,
        description,
        game,
        suit,
        rank,
        points,
        active,
        action,
    };
};

/**
 * Создаёт всех героев при инциализации игры.
 * Применения:
 * 1) Происходит при создании всех героев при инициализации игры.
 *
 * @param config Конфиг героев.
 * @returns {*[]} Массив героев.
 * @constructor
 */
export const BuildHeroes = (config) => {
    const heroes = [];
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
                action: heroesConfig[hero].action,
            }));
        }
    }
    return heroes;
};

/**
 * Проверяет возможность взятия нового героя.
 * Применения:
 * 1) Происходит когда располагается на планшете игрока карта из таверны.
 * 2) Происходит когда завершается действия взятых героев.
 * 3) Происходит когда расположена на планшете игрока карта героя Илуд.
 * 4) Происходит когда расположена на планшете игрока карта героя Труд.
 * 5) Происходит когда перемещается на планшете игрока карта героя Труд.
 *
 * @param G
 * @param ctx
 * @returns {boolean} Можно ли взять нового героя.
 * @constructor
 */
export const CheckPickHero = (G, ctx) => {
    return Math.min(...G.players[ctx.currentPlayer].cards.map(item => item.reduce(TotalRank, 0))) > G.players[ctx.currentPlayer].heroes.length;
};
