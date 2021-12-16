import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
import { SuitNames } from "./SuitData";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}}
 */
var Dwerg_Bergelmir = {
    name: "Dwerg Bergelmir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: \n    1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Bergelmir",
            },
        },
    ],
    scoringRule: function () { return 1; },
};
// todo rework AddBuff?!
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}}
 */
var Ylud = {
    name: "Ylud",
    description: "\u041F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u044D\u0442\u0443 \u043A\u0430\u0440\u0442\u0443 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443. \u0412 \u044D\u043F\u043E\u0445\u0443 1, \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B, \u043D\u043E \u0434\u043E \n    \u0441\u043C\u043E\u0442\u0440\u0430 \u0432\u043E\u0439\u0441\u043A, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u043A\u0430\u0440\u0442\u0443 \u0418\u043B\u0443\u0434 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043B\u044E\u0431\u043E\u0433\u043E \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430 \u0432\u0430\u0448\u0435\u0439 \u0430\u0440\u043C\u0438\u0438. \u041F\u0440\u0438 \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0438 \u0437\u043D\u0430\u043A\u043E\u0432 \u043E\u0442\u043B\u0438\u0447\u0438\u0439 \n    \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0441\u043C\u043E\u0442\u0440\u0430 \u0432\u043E\u0439\u0441\u043A, \u0448\u0435\u0432\u0440\u043E\u043D \u0418\u043B\u0443\u0434 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0448\u0435\u0432\u0440\u043E\u043D\u0430 \u044D\u0442\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430. \u0418\u043B\u0443\u0434 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u044D\u0442\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0434\u043E \n    \u043A\u043E\u043D\u0446\u0430 \u044D\u043F\u043E\u0445\u0438 2. \u0415\u0441\u043B\u0438 \u0432\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u044D\u043F\u043E\u0445\u0438 2, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443. \u0412 \u044D\u043F\u043E\u0445\u0443 2, \u0441\u0440\u0430\u0437\u0443 \n    \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B, \u043D\u043E \u0434\u043E \u043F\u043E\u0434\u0441\u0447\u0451\u0442\u0430 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044F \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: \u2022 \u0435\u0441\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u043E\u0439 \u0437\u043E\u043D\u0435, \u0442\u043E \n    \u0438\u0433\u0440\u043E\u043A \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442 \u0435\u0451 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043B\u044E\u0431\u043E\u0433\u043E \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438, \u2022 \u0435\u0441\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432 \u0430\u0440\u043C\u0438\u0438, \u0438\u0433\u0440\u043E\u043A \u043C\u043E\u0436\u0435\u0442 \u043F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0435\u0451 \u0432 \n    \u0434\u0440\u0443\u0433\u0443\u044E \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443. \u0418\u043B\u0443\u0434 \u0431\u0443\u0434\u0435\u0442 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0434\u0432\u043E\u0440\u0444\u0430 \u0442\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430, \u0433\u0434\u0435 \n    \u0440\u0430\u0441\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F. \u0412 \u043A\u043E\u043D\u0446\u0435 \u044D\u043F\u043E\u0445\u0438 2, \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0418\u043B\u0443\u0434, \u043E\u043D\u0430 \u0431\u0443\u0434\u0435\u0442 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u043A\u0430\u043A \u043A\u0443\u0437\u043D\u0435\u0446 \u0438\u043B\u0438 \u043E\u0445\u043E\u0442\u043D\u0438\u043A, \n    \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A 11, \u0432\u043E\u0438\u043D 7, \u0433\u043E\u0440\u043D\u044F\u043A 1. \u0415\u0441\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0432\u043E\u0438\u043D\u043E\u0432, \u0442\u043E \u0435\u0451 \u0448\u0435\u0432\u0440\u043E\u043D \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u0441\u0443\u043C\u043C\u0435 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u0432\u043E\u0438\u043D\u043E\u0432 \u043F\u0440\u0438 \n    \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0438 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430. \u0418\u0433\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438 \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u043A\u0430\u0440\u0442\u044B \u0418\u043B\u0443\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442 \u043D\u043E\u0432\u0443\u044E \u043B\u0438\u043D\u0438\u044E \n    5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432. \u0415\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u043E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 \u043E\u0431\u0435\u0438\u043C\u0438 \u043A\u0430\u0440\u0442\u0430\u043C\u0438 \u0433\u0435\u0440\u043E\u0435\u0432 \u0418\u043B\u0443\u0434 \u0438 \u0422\u0440\u0443\u0434, \u0442\u043E \u043F\u0440\u0438 \u0438\u0445 \u0430\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u0438 \u0432\u0430\u0436\u043D\u043E \u0443\u0447\u0435\u0441\u0442\u044C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \n    \u043F\u043E\u0440\u044F\u0434\u043E\u043A. \u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B \u0432 \u044D\u043F\u043E\u0445\u0443 2 \u0438\u0433\u0440\u043E\u043A \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442 \u0418\u043B\u0443\u0434 \u0432 \u0441\u0432\u043E\u044E \u0430\u0440\u043C\u0438\u044E. \u0412 \u044D\u0442\u043E\u0442 \u043C\u043E\u043C\u0435\u043D\u0442 \u0438\u0433\u0440\u043E\u043A \n    \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438 \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u0418\u043B\u0443\u0434 \u0441\u043E\u0437\u0434\u0430\u043B \u043B\u0438\u043D\u0438\u044E 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432. \u0417\u0430\u0442\u0435\u043C \u0438\u0433\u0440\u043E\u043A \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u0435\u0442 \u0422\u0440\u0443\u0434 \u0438\u0437 \u0430\u0440\u043C\u0438\u0438 \u0432 \n    \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Ylud",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}}
 */
var Dwerg_Jungir = {
    name: "Dwerg Jungir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: \n    1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Jungir",
            },
        },
    ],
    scoringRule: function () { return 1; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {config: {buff: {name: string, value: string}}, actionName: string} | {actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Uline = {
    name: "Uline",
    description: "\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 9 \u043E\u0447\u043A\u043E\u0432 \u043A \u0441\u0432\u043E\u0435\u043C\u0443 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438. \u041A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u043B\u0438 \u0423\u043B\u0438\u043D\u0443 \u0438 \u043F\u043E\u043B\u043E\u0436\u0438\u043B\u0438 \u0435\u0451 \n    \u043A\u0430\u0440\u0442\u0443 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0431\u0435\u0440\u0438\u0442\u0435 \u0432 \u0440\u0443\u043A\u0443 \u043C\u043E\u043D\u0435\u0442\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u0441\u0451 \u0435\u0449\u0451 \u043B\u0435\u0436\u0430\u0442 \u043B\u0438\u0446\u043E\u043C \u0432\u043D\u0438\u0437 \u043D\u0430 \u0432\u0430\u0448\u0435\u043C \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435. \u0421 \n    \u044D\u0442\u043E\u0433\u043E \u043C\u043E\u043C\u0435\u043D\u0442\u0430 \u0438 \u043A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0438 \u043A \u0440\u0430\u0443\u043D\u0434\u0443 \u043D\u0430 \u044D\u0442\u0430\u043F\u0435 \u00AB\u0421\u0442\u0430\u0432\u043A\u0438\u00BB \u0438\u0433\u0440\u043E\u043A \u043D\u0435 \u0432\u044B\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0442 \u0441\u0432\u043E\u0438 \u043C\u043E\u043D\u0435\u0442\u044B \u043D\u0430 \n    \u043F\u043B\u0430\u043D\u0448\u0435\u0442, \u0430 \u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u0445 \u0432 \u0441\u0432\u043E\u0435\u0439 \u0440\u0443\u043A\u0435. \u0412\u043E \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u0442\u0430\u0432\u0435\u0440\u043D\u044B \u043D\u0430 \u044D\u0442\u0430\u043F\u0435 \u00AB\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u0441\u0442\u0430\u0432\u043E\u043A\u00BB, \u0438\u0433\u0440\u043E\u043A \u0436\u0434\u0451\u0442, \u043F\u043E\u043A\u0430 \u0432\u0441\u0435 \n    \u0434\u0440\u0443\u0433\u0438\u0435 \u044D\u043B\u044C\u0432\u0435\u043B\u0430\u043D\u0434\u044B \u043E\u0442\u043A\u0440\u043E\u044E\u0442 \u0441\u0432\u043E\u0438 \u0441\u0442\u0430\u0432\u043A\u0438 \u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u043E\u043D \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442\u0443 \u0438\u0437 \u0441\u0432\u043E\u0435\u0439 \u0440\u0443\u043A\u0438 \u0438 \u043A\u043B\u0430\u0434\u0451\u0442 \u0435\u0451 \u043B\u0438\u0446\u043E\u043C \u0432\u0432\u0435\u0440\u0445 \n    \u0432 \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B \u043D\u0430 \u0441\u0432\u043E\u0451\u043C \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435. \u0417\u0430\u0442\u0435\u043C \u0440\u0430\u0443\u043D\u0434 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F \u0432 \u043F\u043E\u0440\u044F\u0434\u043A\u0435, \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u043C \u0441\u0442\u0430\u0432\u043A\u0430\u043C \n    \u0438\u0433\u0440\u043E\u043A\u043E\u0432. \u0415\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043B \u0441\u0432\u043E\u0435\u0439 \u0441\u0442\u0430\u0432\u043A\u043E\u0439 \u043E\u0431\u043C\u0435\u043D \u043C\u043E\u043D\u0435\u0442, \u0442\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435\u043C \u0441\u0432\u043E\u0435\u0433\u043E \u0445\u043E\u0434\u0430 \u043E\u043D \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u0438\u0437 \u0440\u0443\u043A\u0438 \n    \u0434\u0432\u0435 \u043C\u043E\u043D\u0435\u0442\u044B, \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u044B \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u043E\u043D \u0441\u0443\u043C\u043C\u0438\u0440\u0443\u0435\u0442 \u0434\u043B\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043D\u043E\u0432\u043E\u0439 \u043C\u043E\u043D\u0435\u0442\u044B. \u041E\u0431\u043C\u0435\u043D \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u043F\u043E \u043E\u0431\u044B\u0447\u043D\u044B\u043C \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C, \u043E\u0434\u043D\u0430\u043A\u043E \n    \u043D\u043E\u0432\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0438\u0433\u0440\u043E\u043A \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0431\u0435\u0440\u0451\u0442 \u0432 \u0440\u0443\u043A\u0443, \u0430 \u043D\u0435 \u043A\u043B\u0430\u0434\u0451\u0442 \u0432 \u043A\u043E\u0448\u0435\u043B\u044C \u0441\u0432\u043E\u0435\u0433\u043E \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0430. \u0412\u043E \u0432\u0440\u0435\u043C\u044F \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u044F \u043C\u043E\u043D\u0435\u0442\u044B: \u2022 \u0435\u0441\u043B\u0438 \n    \u0438\u0433\u0440\u043E\u043A \u0432\u044B\u0431\u0440\u0430\u043B \u043C\u043E\u043D\u0435\u0442\u0443 \u0438\u0437 \u0440\u0443\u043A\u0438, \u0442\u043E \u043D\u043E\u0432\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u043E\u043D \u0431\u0435\u0440\u0451\u0442 \u0442\u0430\u043A \u0436\u0435 \u0432 \u0440\u0443\u043A\u0443, \u2022 \u0435\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u0432\u044B\u0431\u0440\u0430\u043B \u043C\u043E\u043D\u0435\u0442\u0443, \u043B\u0435\u0436\u0430\u0449\u0443\u044E \u043D\u0430 \n    \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435, \u0442\u043E \u043D\u043E\u0432\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u043E\u043D \u043A\u043B\u0430\u0434\u0451\u0442 \u0432 \u0442\u043E \u0436\u0435 \u043C\u0435\u0441\u0442\u043E. \u0418\u0433\u0440\u043E\u043A \u043C\u043E\u0436\u0435\u0442 \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u0442\u0430\u0432\u043A\u0443 \u043C\u043E\u043D\u0435\u0442\u0430\u043C\u0438 \u0438\u0437 \u0440\u0443\u043A\u0438 \u0432 \u0442\u0430\u0432\u0435\u0440\u043D\u0435, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \n    \u043F\u043E\u0441\u0435\u0442\u0438\u0442 \u0432 \u0445\u043E\u0434\u0435 \u0440\u0430\u0443\u043D\u0434\u0430. \u041C\u043E\u043D\u0435\u0442\u044B, \u043B\u0435\u0436\u0430\u0449\u0438\u0435 \u043D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435, \u0434\u043E\u043B\u0436\u043D\u044B \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043D\u0451\u043C \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0440\u0430\u0443\u043D\u0434\u0430.",
    game: "base",
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Uline",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "everyTurn",
                    value: "Uline",
                },
            },
        },
        {
            actionName: "GetClosedCoinIntoPlayerHand",
        },
    ],
    scoringRule: function () { return 9; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: (player?: IPublicPlayer) => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: SuitNames, points: number}}
 */
var Idunn = {
    name: "Idunn",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 1 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u043C. \u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 7 \u043E\u0447\u043A\u043E\u0432 \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 \u043F\u043B\u044E\u0441 \u043F\u043E 2 \u043E\u0447\u043A\u0430 \u0437\u0430 \u043A\u0430\u0436\u0434\u044B\u0439 \n    \u0448\u0435\u0432\u0440\u043E\u043D \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0420\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 (\u0432\u043A\u043B\u044E\u0447\u0430\u044F \u0435\u0451 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439).",
    game: "base",
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 7,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Idunn",
            },
        },
    ],
    scoringRule: function (player) { return player !== undefined ?
        player.cards[GetSuitIndexByName(SuitNames.EXPLORER)].reduce(TotalRank, 0) * 2 : 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: SuitNames, points: number}}
 */
var Tarah = {
    name: "Tarah",
    description: "Обладает 1 шевроном. Прибавьте 14 очков к показателю храбрости воинов.",
    game: "base",
    suit: SuitNames.WARRIOR,
    rank: 1,
    points: 14,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Tarah",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: SuitNames, points: number}}
 */
var Kraal = {
    name: "Kraal",
    description: "Обладает 2 шевронами. Прибавьте 7 и 0 очков к показателю храбрости воинов.",
    game: "base",
    suit: SuitNames.WARRIOR,
    rank: 2,
    points: 7,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Kraal",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: SuitNames, points: number}}
 */
var Lokdur = {
    name: "Lokdur",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 1 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u043C. \u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 3 \u043A \u0441\u0443\u043C\u043C\u0435 \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432. \u041B\u043E\u043A\u0434\u0443\u0440 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0443\u043C\u043C\u0443 \u043E\u0447\u043A\u043E\u0432 \n    \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432 \u043D\u0430 3, \u0430 \u0441\u0443\u043C\u043C\u0443 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u043D\u0430 1.",
    game: "base",
    suit: SuitNames.MINER,
    rank: 1,
    points: 3,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Lokdur",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {config: {stageName: string, name: string, drawName: string, value: number}, actionName: string} | {config: {value: number}, actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Grid = {
    name: "Grid",
    description: "\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 7 \u043E\u0447\u043A\u043E\u0432 \u043A \u0441\u0432\u043E\u0435\u043C\u0443 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438. \u041A\u043E\u0433\u0434\u0430 \u0432\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u043B\u0438 \u0413\u0440\u0438\u0434 \u0438 \u043F\u043E\u043B\u043E\u0436\u0438\u043B\u0438 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \n    \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u0435 \u043D\u0430 +7 \u043D\u043E\u043C\u0438\u043D\u0430\u043B \u043E\u0434\u043D\u043E\u0439 \u0438\u0437 \u0441\u0432\u043E\u0438\u0445 \u043C\u043E\u043D\u0435\u0442.",
    game: "base",
    suit: null,
    rank: null,
    points: 7,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Grid",
            },
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "upgradeCoin",
                drawName: "Grid",
                name: "upgradeCoin",
                value: 7,
            },
        },
        {
            actionName: "UpgradeCoinAction",
            config: {
                value: 7,
            },
        },
    ],
    scoringRule: function () { return 7; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {variants: {blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, warrior: {rank: number, suit: SuitNames.WARRIOR, points: null}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: null}, hunter: {rank: number, suit: SuitNames.HUNTER, points: null}, miner: {rank: number, suit: SuitNames.MINER, points: null}}, config: {stageName: string, name: string, drawName: string}, actionName: string} | {variants: {blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, warrior: {rank: number, suit: SuitNames.WARRIOR, points: null}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: null}, hunter: {rank: number, suit: SuitNames.HUNTER, points: null}, miner: {rank: number, suit: SuitNames.MINER, points: null}}, actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Thrud = {
    name: "Thrud",
    description: "\u041F\u0440\u0438\u0437\u0432\u0430\u0432 \u044D\u0442\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443 \u0432 \u043B\u044E\u0431\u0443\u044E \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043A\u043B\u0430\u0441\u0441\u0430 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438. \u041D\u0430 \u043A\u0430\u0440\u0442\u0443 \n    \u0422\u0440\u0443\u0434 \u043D\u0435\u043B\u044C\u0437\u044F \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u044C \u043D\u0438\u043A\u0430\u043A\u0443\u044E \u0434\u0440\u0443\u0433\u0443\u044E \u043A\u0430\u0440\u0442\u0443 \u0434\u0432\u043E\u0440\u0444\u0430. \u0415\u0441\u043B\u0438 \u043A\u0430\u0440\u0442\u0430 \u0434\u0432\u043E\u0440\u0444\u0430 \u0438\u043B\u0438 \u0433\u0435\u0440\u043E\u044F \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443, \u0433\u0434\u0435 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0430 \n    \u0422\u0440\u0443\u0434, \u0442\u043E \u0438\u0433\u0440\u043E\u043A \u0434\u043E\u043B\u0436\u0435\u043D \u0432\u0437\u044F\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434 \u0432 \u0440\u0443\u043A\u0443, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0434\u0432\u043E\u0440\u0444\u0430 \u0438\u043B\u0438 \u0433\u0435\u0440\u043E\u044F \u0438 \u0437\u0430\u0442\u0435\u043C \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434 \u0432 \u0430\u0440\u043C\u0438\u044E, \n    \u0432 \u043B\u044E\u0431\u0443\u044E \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443. \u0418\u0433\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438, \u0440\u0430\u0437\u043C\u0435\u0441\u0442\u0438\u0432 \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434, \u0441\u043E\u0437\u0434\u0430\u043B \n    \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u0443\u044E \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043D\u043E\u0432\u0443\u044E \u043B\u0438\u043D\u0438\u044E 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432. \u0412 \u043A\u043E\u043D\u0446\u0435 \u044D\u043F\u043E\u0445\u0438 1, \u043F\u0440\u0438 \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0438 \u043A\u0430\u0440\u0442 \u0437\u043D\u0430\u043A\u043E\u0432 \u043E\u0442\u043B\u0438\u0447\u0438\u044F, \u0448\u0435\u0432\u0440\u043E\u043D \u0422\u0440\u0443\u0434 \n    \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u0442\u043E\u043C \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u043C \u043A\u043B\u0430\u0441\u0441\u0435, \u0433\u0434\u0435 \u043E\u043D\u0430 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0430. \u0412 \u044D\u043F\u043E\u0445\u0443 2, \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B, \u043D\u043E \u043F\u0435\u0440\u0435\u0434 \n    \u043F\u043E\u0434\u0441\u0447\u0451\u0442\u043E\u043C \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044F \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438, \u043A\u0430\u0440\u0442\u0430 \u0422\u0440\u0443\u0434 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u0435\u0442\u0441\u044F \u0438\u0437 \u0430\u0440\u043C\u0438\u0438 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443. \u0422\u0440\u0443\u0434 \u043F\u0440\u0438\u0431\u0430\u0432\u043B\u044F\u0435\u0442 13 \n    \u043E\u0447\u043A\u043E\u0432 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0438\u0433\u0440\u043E\u043A\u0430.",
    game: "base",
    suit: null,
    rank: null,
    points: 13,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Thrud",
            },
        },
        {
            actionName: "DrawProfitAction",
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: null,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: null,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: null,
                },
            },
            config: {
                stageName: "placeCards",
                name: "placeCards",
                drawName: "Thrud",
            },
        },
        {
            actionName: "PlaceThrudAction",
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: null,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: null,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: null,
                },
            },
        },
    ],
    scoringRule: function () { return 13; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: SuitNames, points: number}}
 */
var Zoral = {
    name: "Zoral",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 3 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438. \u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 1, 0 \u0438 0 \u043A \u0441\u0443\u043C\u043C\u0435 \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432. \u0417\u043E\u0440\u0430\u043B \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0443\u043C\u043C\u0443 \n    \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432 \u043D\u0430 1, \u0430 \u0441\u0443\u043C\u043C\u0443 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u2013 \u043D\u0430 3.",
    game: "base",
    suit: SuitNames.MINER,
    rank: 3,
    points: 1,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Zoral",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}}
 */
var Dwerg_Aesir = {
    name: "Dwerg Aesir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: \n    1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Aesir",
            },
        },
    ],
    scoringRule: function () { return 1; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {suit: SuitNames.BLACKSMITH}, actionName: string} | {config: {stageName: string, name: string, suit: SuitNames.BLACKSMITH, drawName: string}, actionName: string} | {config: {suit: SuitNames.BLACKSMITH}, actionName: string} | {config: {drawName: string}, actionName: string})[], name: string, description: string, rank: number, suit: SuitNames, points: null}}
 */
var Bonfur = {
    name: "Bonfur",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 3 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438. \u041F\u0440\u0438\u0437\u0432\u0430\u0432 \u0411\u043E\u043D\u0444\u0443\u0440\u0430, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0433\u043E \u043A\u0430\u0440\u0442\u0443 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043A\u0443\u0437\u043D\u0435\u0446\u043E\u0432 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0432 \n    \u0441\u0431\u0440\u043E\u0441 \u043E\u0434\u043D\u0443 \u043D\u0438\u0436\u043D\u044E\u044E \u043A\u0430\u0440\u0442\u0443 \u0434\u0432\u043E\u0440\u0444\u0430 (\u043D\u0435 \u0433\u0435\u0440\u043E\u044F) \u0438\u0437 \u0434\u0440\u0443\u0433\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u043A\u0438 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443.",
    game: "base",
    suit: SuitNames.BLACKSMITH,
    rank: 3,
    points: null,
    stack: [
        {
            actionName: "CheckDiscardCardsFromPlayerBoardAction",
            config: {
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "discardCardFromBoard",
                drawName: "Bonfur",
                name: "BonfurAction",
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            actionName: "DiscardCardsFromPlayerBoardAction",
            config: {
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Bonfur",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {number: number, suit: SuitNames.HUNTER}, actionName: string} | {config: {number: number, stageName: string, name: string, suit: SuitNames.HUNTER, drawName: string}, actionName: string} | {actionName: string} | {config: {drawName: string}, actionName: string})[], name: string, description: string, rank: number, suit: SuitNames, points: null}}
 */
var Dagda = {
    name: "Dagda",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 3 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438. \u041F\u0440\u0438\u0437\u0432\u0430\u0432 \u0414\u0430\u0433\u0434\u0443, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0432 \n    \u0441\u0431\u0440\u043E\u0441 \u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u043D\u0438\u0436\u043D\u0435\u0439 \u043A\u0430\u0440\u0442\u0435 \u0434\u0432\u043E\u0440\u0444\u043E\u0432 (\u043D\u0435 \u0433\u0435\u0440\u043E\u0435\u0432) \u0438\u0437 \u0434\u0432\u0443\u0445 \u0434\u0440\u0443\u0433\u0438\u0445 \u043A\u043E\u043B\u043E\u043D\u043E\u043A \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443.",
    game: "base",
    suit: SuitNames.HUNTER,
    rank: 3,
    points: null,
    stack: [
        {
            actionName: "CheckDiscardCardsFromPlayerBoardAction",
            config: {
                suit: SuitNames.HUNTER,
                number: 2,
            },
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "discardCardFromBoard",
                drawName: "Dagda",
                name: "DagdaAction",
                suit: SuitNames.HUNTER,
                number: 2,
            },
        },
        {
            actionName: "DiscardCardsFromPlayerBoardAction",
        },
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dagda",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Skaa = {
    name: "Skaa",
    description: "Прибавьте 17 очков к своему итоговому показателю храбрости.",
    game: "base",
    suit: null,
    rank: null,
    points: 17,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Skaa",
            },
        },
    ],
    scoringRule: function () { return 17; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {config: {buff: {name: string, value: number}}, actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Jarika = {
    name: "Jarika",
    description: "Adds 8 points to your Final Bravery Value. As a neutral Hero, place her in your Command Zone. During \n    a coin transformation or a coin trade (Royal Offering, Warrior Distinction, Grid), increase the value of the desired \n    sum by +2.",
    game: "base",
    suit: null,
    rank: null,
    points: 8,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Jarika",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "upgradeCoin",
                    value: 2,
                },
            },
        },
    ],
    scoringRule: function () { return 8; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: (player?: IPublicPlayer) => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}}
 */
var Astrid = {
    name: "Astrid",
    description: "Прибавьте к своему итоговому показателю храбрости номинал своей самой ценной монеты.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Astrid",
            },
        },
    ],
    scoringRule: function (player) { return player !== undefined ? GetMaxCoinValue(player) : 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}}
 */
var Dwerg_Ymir = {
    name: "Dwerg Ymir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: \n    1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Ymir",
            },
        },
    ],
    scoringRule: function () { return 1; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: null, suit: null, points: null}}
 */
var Dwerg_Sigmir = {
    name: "Dwerg Sigmir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: \n    1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Dwerg_Sigmir",
            },
        },
    ],
    scoringRule: function () { return 1; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {conditions: {suitCountMin: {suit: SuitNames.EXPLORER, value: number}}}, actionName: string} | {config: {drawName: string}, actionName: string})[], name: string, description: string, rank: number, suit: SuitNames, points: number}}
 */
var Hourya = {
    name: "Hourya",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 1 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u043C. \u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 20 \u043E\u0447\u043A\u043E\u0432 \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432. \u0427\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u0425\u0443\u0440\u0438\u044E, \n    \u0438\u0433\u0440\u043E\u043A \u0434\u043E\u043B\u0436\u0435\u043D \u0438\u043C\u0435\u0442\u044C \u0432 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438 \u043A\u0430\u043A \u043C\u0438\u043D\u0438\u043C\u0443\u043C 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432. \u0412\u0430\u0436\u043D\u043E: \u0435\u0441\u043B\u0438 \u0422\u0440\u0443\u0434 \u0438/\u0438\u043B\u0438 \u0418\u043B\u0443\u0434 \n    \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u044B \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432, \u0442\u043E \u0438\u0445 \u0448\u0435\u0432\u0440\u043E\u043D\u044B \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0434\u043B\u044F \u043F\u0440\u0438\u0437\u044B\u0432\u0430 \u0425\u0443\u0440\u0438\u0438",
    game: "base",
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 20,
    stack: [
        {
            actionName: "PickHeroWithConditions",
            config: {
                conditions: {
                    suitCountMin: {
                        suit: SuitNames.EXPLORER,
                        value: 5,
                    },
                },
            },
        },
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Hourya",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: SuitNames, points: null}}
 */
var Aegur = {
    name: "Aegur",
    description: "Обладает 2 шевронами.",
    game: "base",
    suit: SuitNames.BLACKSMITH,
    rank: 2,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Aegur",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: {config: {drawName: string}, actionName: string}[], name: string, description: string, rank: number, suit: SuitNames, points: null}}
 */
var Aral = {
    name: "Aral",
    description: "Обладает 2 шевронами.",
    game: "base",
    suit: SuitNames.HUNTER,
    rank: 2,
    points: null,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Aral",
            },
        },
    ],
    scoringRule: function () { return 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {actionName: string} | {config: {stageName: string, name: string, drawName: string}, actionName: string} | {actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Andumia = {
    name: "Andumia",
    description: "Adds 12 points to your Final Bravery Value. When you recruit her, immediately look at all the cards \n    in the discard pile and keep one (Royal Offering card or Dwarf card). - If it is a Royal Offering card, its effect \n    is immediately applied, then the card is returned to the discard. - If it is a Dwarf card, place it in your army. \n    Its placement can trigger the recruitment of a Hero card.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Andumia",
            },
        },
        {
            actionName: "CheckPickDiscardCard",
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "pickDiscardCard",
                drawName: "Andumia",
                name: "AndumiaAction",
            },
        },
        {
            actionName: "PickDiscardCard",
        },
    ],
    scoringRule: function () { return 12; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {config: {buff: {name: string, value: boolean}}, actionName: string} | {actionName: string} | {config: {stageName: string, name: string, drawName: string}, actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Holda = {
    name: "Holda",
    description: "Adds 12 points to your Final Bravery Value. When you recruit her, immediately choose a Mercenary or \n    Artifact card available at the Camp.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Holda",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "goCampOneTime",
                    value: true,
                },
            },
        },
        {
            actionName: "CheckPickCampCard",
        },
        {
            actionName: "DrawProfitAction",
            config: {
                stageName: "pickCampCardHolda",
                drawName: "Holda",
                name: "HoldaAction",
            },
        },
    ],
    scoringRule: function () { return 12; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {config: {value: number, coin: string}, actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Khrad = {
    name: "Khrad",
    description: "Adds 4 points to your Final Bravery Value. When you recruit him, immediately add +10 to your lowest \n    value coin (except the Trading coin).",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 4,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Khrad",
            },
        },
        {
            actionName: "UpgradeCoinAction",
            config: {
                value: 10,
                coin: "min",
            },
        },
    ],
    scoringRule: function () { return 4; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {variants: {blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}, hunter: {rank: number, suit: SuitNames.HUNTER, points: null}, miner: {rank: number, suit: SuitNames.MINER, points: number}}, config: {number: number, stageName: string, name: string, drawName: string}, actionName: string} | {variants: {blacksmith: {rank: number, suit: SuitNames.BLACKSMITH, points: null}, warrior: {rank: number, suit: SuitNames.WARRIOR, points: number}, explorer: {rank: number, suit: SuitNames.EXPLORER, points: number}, hunter: {rank: number, suit: SuitNames.HUNTER, points: null}, miner: {rank: number, suit: SuitNames.MINER, points: number}}, actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Olwin = {
    name: "Olwin",
    description: "Adds 9 points to your Final Bravery Value. When you recruit him, also take his two doubles whose \n    Bravery value is 0 and then place each of these cards in two different columns of your choice. Their placement may \n    result in the recruitment of a Hero card. \u00ABOlwin's double\u00BB cards are considered Dwarf cards of the class in which \n    they are placed and can be destroyed by the powers of Dagda, Bonfur, Brisingamens, and Hofud.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Olwin",
            },
        },
        {
            actionName: "DrawProfitAction",
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: 0,
                },
            },
            config: {
                stageName: "placeCards",
                drawName: "Olwin",
                name: "placeCards",
                number: 2,
            },
        },
        {
            actionName: "PlaceCards",
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: 0,
                },
            },
        },
    ],
    scoringRule: function () { return 9; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 *
 * @type {{scoringRule: () => number, game: string, stack: ({config: {drawName: string}, actionName: string} | {config: {buff: {name: string, value: string}}, actionName: string})[], name: string, description: string, rank: null, suit: null, points: number}}
 */
var Zolkur = {
    name: "Zolkur",
    description: "Adds 10 points to your Final Bravery Value. When you recruit him, immediately place him on the coins \n    of your pouch. During your next trade, you trade the lower value coin instead of the higher as in a standard \n    exchange. Then return Zolkur's card to the Command Zone.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 10,
    stack: [
        {
            actionName: "AddHeroToCards",
            config: {
                drawName: "Zolkur",
            },
        },
        {
            actionName: "AddBuffToPlayer",
            config: {
                buff: {
                    name: "upgradeNextCoin",
                    value: "min",
                },
            },
        },
    ],
    scoringRule: function () { return 10; },
};
/**
 * <h3>Конфиг героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @type {{Zoral: IHeroData, Aegur: IHeroData, Dwerg_Ymir: IHeroData, Andumia: IHeroData, Dwerg_Bergelmir: IHeroData, Grid: IHeroData, Holda: IHeroData, Dwerg_Aesir: IHeroData, Dagda: IHeroData, Zolkur: IHeroData, Astrid: IHeroData, Tarah: IHeroData, Aral: IHeroData, Dwerg_Jungir: IHeroData, Lokdur: IHeroData, Dwerg_Sigmir: IHeroData, Ylud: IHeroData, Idunn: IHeroData, Uline: IHeroData, Khrad: IHeroData, Bonfur: IHeroData, Kraal: IHeroData, Olwin: IHeroData, Jarika: IHeroData, Hourya: IHeroData, Thrud: IHeroData, Skaa: IHeroData}}
 */
export var heroesConfig = {
    Bonfur: Bonfur,
    Aegur: Aegur,
    Dagda: Dagda,
    Aral: Aral,
    Lokdur: Lokdur,
    Zoral: Zoral,
    Tarah: Tarah,
    Kraal: Kraal,
    Idunn: Idunn,
    Hourya: Hourya,
    Dwerg_Bergelmir: Dwerg_Bergelmir,
    Dwerg_Jungir: Dwerg_Jungir,
    Dwerg_Aesir: Dwerg_Aesir,
    Dwerg_Ymir: Dwerg_Ymir,
    Dwerg_Sigmir: Dwerg_Sigmir,
    Ylud: Ylud,
    Uline: Uline,
    Grid: Grid,
    Thrud: Thrud,
    Skaa: Skaa,
    Jarika: Jarika,
    Astrid: Astrid,
    Andumia: Andumia,
    Holda: Holda,
    Khrad: Khrad,
    Olwin: Olwin,
    Zolkur: Zolkur,
};
