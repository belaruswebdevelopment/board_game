import {TotalRank} from "./Score";
import {heroesConfig} from "./data/HeroData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog} from "./Logging";
import {AddActionsToStackAfterCurrent} from "./helpers/StackHelpers";

/**
 * Создание героя.
 * Применения:
 * 1) Происходит при создании всех героев при инициализации игры.
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
 * @returns {{game, name, description, rank, active: boolean, stack, suit, points}} Герой.
 * @constructor
 */
export const CreateHero = ({type, name, description, game, suit, rank, points, active = true, stack} = {}) => {
    return {
        type,
        name,
        description,
        game,
        suit,
        rank,
        points,
        active,
        stack,
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
                stack: heroesConfig[hero].stack,
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
    if (!G.players[ctx.currentPlayer].buffs?.["noHero"]) {
        const isCanPickHero = Math.min(...G.players[ctx.currentPlayer].cards.map(item => item.reduce(TotalRank, 0)))
            > G.players[ctx.currentPlayer].heroes.length;
        if (isCanPickHero) {
            const stack = [
                {
                    stack: {
                        actionName: "PickHero",
                        config: {
                            stageName: "pickHero",
                        },
                    },
                },
            ];
            AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} должен выбрать нового героя.`);
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
    }
};

/**
 * Удаляет Труд в конце игры с поля игрока.
 * Применения:
 * 1) Происходит в конце матча после всех игровых событий.
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerCards = G.players[i].cards.flat();
        const thrud = playerCards.find(card => card.name === "Thrud");
        if (thrud) {
            const thrudSuit = GetSuitIndexByName(thrud.suit),
                thrudIndex = G.players[i].cards[thrudSuit].findIndex(card => card.name === "Thrud");
            G.players[i].cards[thrudSuit].splice(thrudIndex, 1);
            AddDataToLog(G, "game", `Герой Труд игрока ${G.players[i].nickname} уходит с игрового поля.`);
        }
    }
};
