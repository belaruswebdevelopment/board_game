import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
import { SuitNames } from "./SuitData";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { AddHeroToCardsAction, GetClosedCoinIntoPlayerHandAction, PickHeroWithConditionsAction, PlaceHeroAction } from "../actions/HeroActions";
import { AddBuffToPlayerAction, CheckDiscardCardsFromPlayerBoardAction, CheckPickDiscardCardAction, DiscardCardsFromPlayerBoardAction, DrawProfitAction, PickDiscardCardAction, PlaceCardsAction, UpgradeCoinAction } from "../actions/Actions";
import { CheckPickCampCardAction } from "../actions/CampActions";
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
var Dwerg_Bergelmir = {
    name: "Dwerg Bergelmir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Ylud = {
    name: "Ylud",
    description: "\u041F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u044D\u0442\u0443 \u043A\u0430\u0440\u0442\u0443 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443. \u0412 \u044D\u043F\u043E\u0445\u0443 1, \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B, \u043D\u043E \u0434\u043E \u0441\u043C\u043E\u0442\u0440\u0430 \u0432\u043E\u0439\u0441\u043A, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u043A\u0430\u0440\u0442\u0443 \u0418\u043B\u0443\u0434 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043B\u044E\u0431\u043E\u0433\u043E \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430 \u0432\u0430\u0448\u0435\u0439 \u0430\u0440\u043C\u0438\u0438. \u041F\u0440\u0438 \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0438 \u0437\u043D\u0430\u043A\u043E\u0432 \u043E\u0442\u043B\u0438\u0447\u0438\u0439 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0441\u043C\u043E\u0442\u0440\u0430 \u0432\u043E\u0439\u0441\u043A, \u0448\u0435\u0432\u0440\u043E\u043D \u0418\u043B\u0443\u0434 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0448\u0435\u0432\u0440\u043E\u043D\u0430 \u044D\u0442\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430. \u0418\u043B\u0443\u0434 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u044D\u0442\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u044D\u043F\u043E\u0445\u0438 2. \u0415\u0441\u043B\u0438 \u0432\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u044D\u043F\u043E\u0445\u0438 2, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443. \u0412 \u044D\u043F\u043E\u0445\u0443 2, \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B, \u043D\u043E \u0434\u043E \u043F\u043E\u0434\u0441\u0447\u0451\u0442\u0430 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044F \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: \u2022 \u0435\u0441\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u043E\u0439 \u0437\u043E\u043D\u0435, \u0442\u043E \u0438\u0433\u0440\u043E\u043A \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442 \u0435\u0451 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043B\u044E\u0431\u043E\u0433\u043E \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438, \u2022 \u0435\u0441\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432 \u0430\u0440\u043C\u0438\u0438, \u0438\u0433\u0440\u043E\u043A \u043C\u043E\u0436\u0435\u0442 \u043F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0435\u0451 \u0432 \u0434\u0440\u0443\u0433\u0443\u044E \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443. \u0418\u043B\u0443\u0434 \u0431\u0443\u0434\u0435\u0442 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0434\u0432\u043E\u0440\u0444\u0430 \u0442\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0441\u0430, \u0433\u0434\u0435 \u0440\u0430\u0441\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F. \u0412 \u043A\u043E\u043D\u0446\u0435 \u044D\u043F\u043E\u0445\u0438 2, \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0418\u043B\u0443\u0434, \u043E\u043D\u0430 \u0431\u0443\u0434\u0435\u0442 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u043A\u0430\u043A \u043A\u0443\u0437\u043D\u0435\u0446 \u0438\u043B\u0438 \u043E\u0445\u043E\u0442\u043D\u0438\u043A, \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A 11, \u0432\u043E\u0438\u043D 7, \u0433\u043E\u0440\u043D\u044F\u043A 1. \u0415\u0441\u043B\u0438 \u0418\u043B\u0443\u0434 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0432\u043E\u0438\u043D\u043E\u0432, \u0442\u043E \u0435\u0451 \u0448\u0435\u0432\u0440\u043E\u043D \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u0441\u0443\u043C\u043C\u0435 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u0432\u043E\u0438\u043D\u043E\u0432 \u043F\u0440\u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0438 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430. \u0418\u0433\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438 \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u043A\u0430\u0440\u0442\u044B \u0418\u043B\u0443\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442 \u043D\u043E\u0432\u0443\u044E \u043B\u0438\u043D\u0438\u044E 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432. \u0415\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u043E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 \u043E\u0431\u0435\u0438\u043C\u0438 \u043A\u0430\u0440\u0442\u0430\u043C\u0438 \u0433\u0435\u0440\u043E\u0435\u0432 \u0418\u043B\u0443\u0434 \u0438 \u0422\u0440\u0443\u0434, \u0442\u043E \u043F\u0440\u0438 \u0438\u0445 \u0430\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u0438 \u0432\u0430\u0436\u043D\u043E \u0443\u0447\u0435\u0441\u0442\u044C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A. \u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B \u0432 \u044D\u043F\u043E\u0445\u0443 2 \u0438\u0433\u0440\u043E\u043A \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442 \u0418\u043B\u0443\u0434 \u0432 \u0441\u0432\u043E\u044E \u0430\u0440\u043C\u0438\u044E. \u0412 \u044D\u0442\u043E\u0442 \u043C\u043E\u043C\u0435\u043D\u0442 \u0438\u0433\u0440\u043E\u043A \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438 \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u0418\u043B\u0443\u0434 \u0441\u043E\u0437\u0434\u0430\u043B \u043B\u0438\u043D\u0438\u044E 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432. \u0417\u0430\u0442\u0435\u043C \u0438\u0433\u0440\u043E\u043A \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u0435\u0442 \u0422\u0440\u0443\u0434 \u0438\u0437 \u0430\u0440\u043C\u0438\u0438 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Dwerg_Jungir = {
    name: "Dwerg Jungir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Uline = {
    name: "Uline",
    description: "\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 9 \u043E\u0447\u043A\u043E\u0432 \u043A \u0441\u0432\u043E\u0435\u043C\u0443 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438. \u041A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u043B\u0438 \u0423\u043B\u0438\u043D\u0443 \u0438 \u043F\u043E\u043B\u043E\u0436\u0438\u043B\u0438 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0431\u0435\u0440\u0438\u0442\u0435 \u0432 \u0440\u0443\u043A\u0443 \u043C\u043E\u043D\u0435\u0442\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u0441\u0451 \u0435\u0449\u0451 \u043B\u0435\u0436\u0430\u0442 \u043B\u0438\u0446\u043E\u043C \u0432\u043D\u0438\u0437 \u043D\u0430 \u0432\u0430\u0448\u0435\u043C \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435. \u0421 \u044D\u0442\u043E\u0433\u043E \u043C\u043E\u043C\u0435\u043D\u0442\u0430 \u0438 \u043A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0438 \u043A \u0440\u0430\u0443\u043D\u0434\u0443 \u043D\u0430 \u044D\u0442\u0430\u043F\u0435 \u00AB\u0421\u0442\u0430\u0432\u043A\u0438\u00BB \u0438\u0433\u0440\u043E\u043A \u043D\u0435 \u0432\u044B\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0442 \u0441\u0432\u043E\u0438 \u043C\u043E\u043D\u0435\u0442\u044B \u043D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442, \u0430 \u0434\u0435\u0440\u0436\u0438\u0442 \u0438\u0445 \u0432 \u0441\u0432\u043E\u0435\u0439 \u0440\u0443\u043A\u0435. \u0412\u043E \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u0442\u0430\u0432\u0435\u0440\u043D\u044B \u043D\u0430 \u044D\u0442\u0430\u043F\u0435 \u00AB\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u0441\u0442\u0430\u0432\u043E\u043A\u00BB, \u0438\u0433\u0440\u043E\u043A \u0436\u0434\u0451\u0442, \u043F\u043E\u043A\u0430 \u0432\u0441\u0435 \u0434\u0440\u0443\u0433\u0438\u0435 \u044D\u043B\u044C\u0432\u0435\u043B\u0430\u043D\u0434\u044B \u043E\u0442\u043A\u0440\u043E\u044E\u0442 \u0441\u0432\u043E\u0438 \u0441\u0442\u0430\u0432\u043A\u0438 \u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u043E\u043D \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442\u0443 \u0438\u0437 \u0441\u0432\u043E\u0435\u0439 \u0440\u0443\u043A\u0438 \u0438 \u043A\u043B\u0430\u0434\u0451\u0442 \u0435\u0451 \u043B\u0438\u0446\u043E\u043C \u0432\u0432\u0435\u0440\u0445 \u0432 \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B \u043D\u0430 \u0441\u0432\u043E\u0451\u043C \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435. \u0417\u0430\u0442\u0435\u043C \u0440\u0430\u0443\u043D\u0434 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F \u0432 \u043F\u043E\u0440\u044F\u0434\u043A\u0435, \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u043C \u0441\u0442\u0430\u0432\u043A\u0430\u043C \u0438\u0433\u0440\u043E\u043A\u043E\u0432. \u0415\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043B \u0441\u0432\u043E\u0435\u0439 \u0441\u0442\u0430\u0432\u043A\u043E\u0439 \u043E\u0431\u043C\u0435\u043D \u043C\u043E\u043D\u0435\u0442, \u0442\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435\u043C \u0441\u0432\u043E\u0435\u0433\u043E \u0445\u043E\u0434\u0430 \u043E\u043D \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u0438\u0437 \u0440\u0443\u043A\u0438 \u0434\u0432\u0435 \u043C\u043E\u043D\u0435\u0442\u044B, \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u044B \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u043E\u043D \u0441\u0443\u043C\u043C\u0438\u0440\u0443\u0435\u0442 \u0434\u043B\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043D\u043E\u0432\u043E\u0439 \u043C\u043E\u043D\u0435\u0442\u044B. \u041E\u0431\u043C\u0435\u043D \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u043F\u043E \u043E\u0431\u044B\u0447\u043D\u044B\u043C \u043F\u0440\u0430\u0432\u0438\u043B\u0430\u043C, \u043E\u0434\u043D\u0430\u043A\u043E \u043D\u043E\u0432\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0438\u0433\u0440\u043E\u043A \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0431\u0435\u0440\u0451\u0442 \u0432 \u0440\u0443\u043A\u0443, \u0430 \u043D\u0435 \u043A\u043B\u0430\u0434\u0451\u0442 \u0432 \u043A\u043E\u0448\u0435\u043B\u044C \u0441\u0432\u043E\u0435\u0433\u043E \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0430. \u0412\u043E \u0432\u0440\u0435\u043C\u044F \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u044F \u043C\u043E\u043D\u0435\u0442\u044B: \u2022 \u0435\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u0432\u044B\u0431\u0440\u0430\u043B \u043C\u043E\u043D\u0435\u0442\u0443 \u0438\u0437 \u0440\u0443\u043A\u0438, \u0442\u043E \u043D\u043E\u0432\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u043E\u043D \u0431\u0435\u0440\u0451\u0442 \u0442\u0430\u043A \u0436\u0435 \u0432 \u0440\u0443\u043A\u0443, \u2022 \u0435\u0441\u043B\u0438 \u0438\u0433\u0440\u043E\u043A \u0432\u044B\u0431\u0440\u0430\u043B \u043C\u043E\u043D\u0435\u0442\u0443, \u043B\u0435\u0436\u0430\u0449\u0443\u044E \u043D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435, \u0442\u043E \u043D\u043E\u0432\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u043E\u043D \u043A\u043B\u0430\u0434\u0451\u0442 \u0432 \u0442\u043E \u0436\u0435 \u043C\u0435\u0441\u0442\u043E. \u0418\u0433\u0440\u043E\u043A \u043C\u043E\u0436\u0435\u0442 \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u0442\u0430\u0432\u043A\u0443 \u043C\u043E\u043D\u0435\u0442\u0430\u043C\u0438 \u0438\u0437 \u0440\u0443\u043A\u0438 \u0432 \u0442\u0430\u0432\u0435\u0440\u043D\u0435, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u043F\u043E\u0441\u0435\u0442\u0438\u0442 \u0432 \u0445\u043E\u0434\u0435 \u0440\u0430\u0443\u043D\u0434\u0430. \u041C\u043E\u043D\u0435\u0442\u044B, \u043B\u0435\u0436\u0430\u0449\u0438\u0435 \u043D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435, \u0434\u043E\u043B\u0436\u043D\u044B \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043D\u0451\u043C \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0440\u0430\u0443\u043D\u0434\u0430.",
    game: "base",
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Uline",
            },
        },
        {
            action: AddBuffToPlayerAction,
            config: {
                buff: {
                    name: "everyTurn",
                    value: "Uline",
                },
            },
        },
        {
            action: GetClosedCoinIntoPlayerHandAction,
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
 */
var Idunn = {
    name: "Idunn",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 1 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u043C. \u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 7 \u043E\u0447\u043A\u043E\u0432 \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 \u043F\u043B\u044E\u0441 \u043F\u043E 2 \u043E\u0447\u043A\u0430 \u0437\u0430 \u043A\u0430\u0436\u0434\u044B\u0439 \u0448\u0435\u0432\u0440\u043E\u043D \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0420\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 (\u0432\u043A\u043B\u044E\u0447\u0430\u044F \u0435\u0451 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439).",
    game: "base",
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Idunn",
            },
        },
    ],
    scoringRule: function (player) { return player !== undefined ?
        player.cards[GetSuitIndexByName(SuitNames.EXPLORER)]
            .reduce(TotalRank, 0) * 2 : 0; },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
var Tarah = {
    name: "Tarah",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 1 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u043C. \u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 14 \u043E\u0447\u043A\u043E\u0432 \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0432\u043E\u0438\u043D\u043E\u0432.",
    game: "base",
    suit: SuitNames.WARRIOR,
    rank: 1,
    points: 14,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Kraal = {
    name: "Kraal",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 2 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438. \u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 7 \u0438 0 \u043E\u0447\u043A\u043E\u0432 \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0432\u043E\u0438\u043D\u043E\u0432.",
    game: "base",
    suit: SuitNames.WARRIOR,
    rank: 2,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Lokdur = {
    name: "Lokdur",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 1 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u043C.\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 3 \u043A \u0441\u0443\u043C\u043C\u0435 \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432.\u041B\u043E\u043A\u0434\u0443\u0440 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0443\u043C\u043C\u0443 \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432 \u043D\u0430 3, \u0430 \u0441\u0443\u043C\u043C\u0443 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u043D\u0430 1.",
    game: "base",
    suit: SuitNames.MINER,
    rank: 1,
    points: 3,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Grid = {
    name: "Grid",
    description: "\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 7 \u043E\u0447\u043A\u043E\u0432 \u043A \u0441\u0432\u043E\u0435\u043C\u0443 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438.\u041A\u043E\u0433\u0434\u0430 \u0432\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u043B\u0438 \u0413\u0440\u0438\u0434 \u0438 \u043F\u043E\u043B\u043E\u0436\u0438\u043B\u0438 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u0432 \u0441\u0432\u043E\u044E \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u0435 \u043D\u0430 + 7 \u043D\u043E\u043C\u0438\u043D\u0430\u043B \u043E\u0434\u043D\u043E\u0439 \u0438\u0437 \u0441\u0432\u043E\u0438\u0445 \u043C\u043E\u043D\u0435\u0442.",
    game: "base",
    suit: null,
    rank: null,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Grid",
            },
        },
        {
            action: DrawProfitAction,
            config: {
                stageName: "upgradeCoin",
                drawName: "Grid",
                name: "upgradeCoin",
                value: 7,
            },
        },
        {
            action: UpgradeCoinAction,
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
 */
var Thrud = {
    name: "Thrud",
    description: "\u041F\u0440\u0438\u0437\u0432\u0430\u0432 \u044D\u0442\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443 \u0432 \u043B\u044E\u0431\u0443\u044E \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043A\u043B\u0430\u0441\u0441\u0430 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438.\u041D\u0430 \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434 \u043D\u0435\u043B\u044C\u0437\u044F \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u044C \u043D\u0438\u043A\u0430\u043A\u0443\u044E \u0434\u0440\u0443\u0433\u0443\u044E \u043A\u0430\u0440\u0442\u0443 \u0434\u0432\u043E\u0440\u0444\u0430.\u0415\u0441\u043B\u0438 \u043A\u0430\u0440\u0442\u0430 \u0434\u0432\u043E\u0440\u0444\u0430 \u0438\u043B\u0438 \u0433\u0435\u0440\u043E\u044F \u043F\u043E\u043C\u0435\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443, \u0433\u0434\u0435 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0430 \u0422\u0440\u0443\u0434, \u0442\u043E \u0438\u0433\u0440\u043E\u043A \u0434\u043E\u043B\u0436\u0435\u043D \u0432\u0437\u044F\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434 \u0432 \u0440\u0443\u043A\u0443, \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0434\u0432\u043E\u0440\u0444\u0430 \u0438\u043B\u0438 \u0433\u0435\u0440\u043E\u044F \u0438 \u0437\u0430\u0442\u0435\u043C \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434 \u0432 \u0430\u0440\u043C\u0438\u044E, \u0432 \u043B\u044E\u0431\u0443\u044E \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443.\u0418\u0433\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438, \u0440\u0430\u0437\u043C\u0435\u0441\u0442\u0438\u0432 \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434, \u0441\u043E\u0437\u0434\u0430\u043B \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u0443\u044E \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043D\u043E\u0432\u0443\u044E \u043B\u0438\u043D\u0438\u044E 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432.\u0412 \u043A\u043E\u043D\u0446\u0435 \u044D\u043F\u043E\u0445\u0438 1, \u043F\u0440\u0438 \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0438 \u043A\u0430\u0440\u0442 \u0437\u043D\u0430\u043A\u043E\u0432 \u043E\u0442\u043B\u0438\u0447\u0438\u044F, \u0448\u0435\u0432\u0440\u043E\u043D \u0422\u0440\u0443\u0434 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u0442\u043E\u043C \u0432\u043E\u0438\u043D\u0441\u043A\u043E\u043C \u043A\u043B\u0430\u0441\u0441\u0435, \u0433\u0434\u0435 \u043E\u043D\u0430 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0430.\u0412 \u044D\u043F\u043E\u0445\u0443 2, \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0441\u0435\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0442\u0430\u0432\u0435\u0440\u043D\u044B, \u043D\u043E \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u0434\u0441\u0447\u0451\u0442\u043E\u043C \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044F \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438, \u043A\u0430\u0440\u0442\u0430 \u0422\u0440\u0443\u0434 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u0435\u0442\u0441\u044F \u0438\u0437 \u0430\u0440\u043C\u0438\u0438 \u0432 \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443.\u0422\u0440\u0443\u0434 \u043F\u0440\u0438\u0431\u0430\u0432\u043B\u044F\u0435\u0442 13 \u043E\u0447\u043A\u043E\u0432 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0438\u0433\u0440\u043E\u043A\u0430.",
    game: "base",
    suit: null,
    rank: null,
    points: 13,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Thrud",
            },
        },
        {
            action: DrawProfitAction,
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
            action: PlaceHeroAction,
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
                name: "Thrud",
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
 */
var Zoral = {
    name: "Zoral",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 3 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438.\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 1, 0 \u0438 0 \u043A \u0441\u0443\u043C\u043C\u0435 \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432.\u0417\u043E\u0440\u0430\u043B \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0443\u043C\u043C\u0443 \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432 \u043D\u0430 1, \u0430 \u0441\u0443\u043C\u043C\u0443 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u2013 \u043D\u0430 3.",
    game: "base",
    suit: SuitNames.MINER,
    rank: 3,
    points: 1,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Dwerg_Aesir = {
    name: "Dwerg Aesir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Bonfur = {
    name: "Bonfur",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 3 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438.\u041F\u0440\u0438\u0437\u0432\u0430\u0432 \u0411\u043E\u043D\u0444\u0443\u0440\u0430, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0433\u043E \u043A\u0430\u0440\u0442\u0443 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043A\u0443\u0437\u043D\u0435\u0446\u043E\u0432 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0432 \u0441\u0431\u0440\u043E\u0441 \u043E\u0434\u043D\u0443 \u043D\u0438\u0436\u043D\u044E\u044E \u043A\u0430\u0440\u0442\u0443 \u0434\u0432\u043E\u0440\u0444\u0430(\u043D\u0435 \u0433\u0435\u0440\u043E\u044F) \u0438\u0437 \u0434\u0440\u0443\u0433\u043E\u0439 \u043A\u043E\u043B\u043E\u043D\u043A\u0438 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443.",
    game: "base",
    suit: SuitNames.BLACKSMITH,
    rank: 3,
    points: null,
    stack: [
        {
            action: CheckDiscardCardsFromPlayerBoardAction,
            config: {
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            action: DrawProfitAction,
            config: {
                stageName: "discardCardFromBoard",
                drawName: "Bonfur",
                name: "BonfurAction",
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            action: DiscardCardsFromPlayerBoardAction,
            config: {
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            action: AddHeroToCardsAction,
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
 */
var Dagda = {
    name: "Dagda",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 3 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438.\u041F\u0440\u0438\u0437\u0432\u0430\u0432 \u0414\u0430\u0433\u0434\u0443, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0451 \u043A\u0430\u0440\u0442\u0443 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0432 \u0441\u0431\u0440\u043E\u0441 \u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u043D\u0438\u0436\u043D\u0435\u0439 \u043A\u0430\u0440\u0442\u0435 \u0434\u0432\u043E\u0440\u0444\u043E\u0432(\u043D\u0435 \u0433\u0435\u0440\u043E\u0435\u0432) \u0438\u0437 \u0434\u0432\u0443\u0445 \u0434\u0440\u0443\u0433\u0438\u0445 \u043A\u043E\u043B\u043E\u043D\u043E\u043A \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438 \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443.",
    game: "base",
    suit: SuitNames.HUNTER,
    rank: 3,
    points: null,
    stack: [
        {
            action: CheckDiscardCardsFromPlayerBoardAction,
            config: {
                suit: SuitNames.HUNTER,
                number: 2,
            },
        },
        {
            action: DrawProfitAction,
            config: {
                stageName: "discardCardFromBoard",
                drawName: "Dagda",
                name: "DagdaAction",
                suit: SuitNames.HUNTER,
                number: 2,
            },
        },
        {
            action: DiscardCardsFromPlayerBoardAction,
        },
        {
            action: AddHeroToCardsAction,
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
 */
var Skaa = {
    name: "Skaa",
    description: "\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 17 \u043E\u0447\u043A\u043E\u0432 \u043A \u0441\u0432\u043E\u0435\u043C\u0443 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438.",
    game: "base",
    suit: null,
    rank: null,
    points: 17,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Jarika = {
    name: "Jarika",
    description: "Adds 8 points to your Final Bravery Value.As a neutral Hero, place her in your Command Zone.During a coin transformation or a coin trade(Royal Offering, Warrior Distinction, Grid), increase the value of the desired sum by + 2.",
    game: "base",
    suit: null,
    rank: null,
    points: 8,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Jarika",
            },
        },
        {
            action: AddBuffToPlayerAction,
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
 */
var Astrid = {
    name: "Astrid",
    description: "\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0441\u0432\u043E\u0435\u043C\u0443 \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u043D\u043E\u043C\u0438\u043D\u0430\u043B \u0441\u0432\u043E\u0435\u0439 \u0441\u0430\u043C\u043E\u0439 \u0446\u0435\u043D\u043D\u043E\u0439 \u043C\u043E\u043D\u0435\u0442\u044B.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Dwerg_Ymir = {
    name: "Dwerg Ymir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Dwerg_Sigmir = {
    name: "Dwerg Sigmir",
    description: "\u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0431\u0440\u0430\u0442\u044C\u0435\u0432, \u043F\u0440\u0438\u0437\u0432\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u043C, \u043F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 \u043A \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.",
    game: "base",
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Hourya = {
    name: "Hourya",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 1 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u043C.\u041F\u0440\u0438\u0431\u0430\u0432\u044C\u0442\u0435 20 \u043E\u0447\u043A\u043E\u0432 \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432.\u0427\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u0425\u0443\u0440\u0438\u044E, \u0438\u0433\u0440\u043E\u043A \u0434\u043E\u043B\u0436\u0435\u043D \u0438\u043C\u0435\u0442\u044C \u0432 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438 \u043A\u0430\u043A \u043C\u0438\u043D\u0438\u043C\u0443\u043C 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432.\u0412\u0430\u0436\u043D\u043E: \u0435\u0441\u043B\u0438 \u0422\u0440\u0443\u0434 \u0438 / \u0438\u043B\u0438 \u0418\u043B\u0443\u0434 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u044B \u0432 \u043A\u043E\u043B\u043E\u043D\u043A\u0435 \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432, \u0442\u043E \u0438\u0445 \u0448\u0435\u0432\u0440\u043E\u043D\u044B \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0434\u043B\u044F \u043F\u0440\u0438\u0437\u044B\u0432\u0430 \u0425\u0443\u0440\u0438\u0438",
    game: "base",
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 20,
    stack: [
        {
            action: PickHeroWithConditionsAction,
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
            action: AddHeroToCardsAction,
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
 */
var Aegur = {
    name: "Aegur",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 2 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438.",
    game: "base",
    suit: SuitNames.BLACKSMITH,
    rank: 2,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Aral = {
    name: "Aral",
    description: "\u041E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 2 \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438.",
    game: "base",
    suit: SuitNames.HUNTER,
    rank: 2,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction,
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
 */
var Andumia = {
    name: "Andumia",
    description: "Adds 12 points to your Final Bravery Value.When you recruit her, immediately look at all the cards in the discard pile and keep one(Royal Offering card or Dwarf card). - If it is a Royal Offering card, its effect is immediately applied, then the card is returned to the discard. - If it is a Dwarf card, place it in your army. Its placement can trigger the recruitment of a Hero card.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Andumia",
            },
        },
        {
            action: CheckPickDiscardCardAction,
        },
        {
            action: DrawProfitAction,
            config: {
                stageName: "pickDiscardCard",
                drawName: "Andumia",
                name: "AndumiaAction",
            },
        },
        {
            action: PickDiscardCardAction,
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
 */
var Holda = {
    name: "Holda",
    description: "Adds 12 points to your Final Bravery Value.When you recruit her, immediately choose a Mercenary or Artifact card available at the Camp.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Holda",
            },
        },
        {
            action: AddBuffToPlayerAction,
            config: {
                buff: {
                    name: "goCampOneTime",
                    value: true,
                },
            },
        },
        {
            action: CheckPickCampCardAction,
        },
        {
            action: DrawProfitAction,
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
 */
var Khrad = {
    name: "Khrad",
    description: "Adds 4 points to your Final Bravery Value.When you recruit him, immediately add + 10 to your lowest value coin(except the Trading coin).",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 4,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Khrad",
            },
        },
        {
            action: UpgradeCoinAction,
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
 */
var Olwin = {
    name: "Olwin",
    description: "Adds 9 points to your Final Bravery Value.When you recruit him, also take his two doubles whose Bravery value is 0 and then place each of these cards in two different columns of your choice.Their placement may result in the recruitment of a Hero card. \u00ABOlwin's double\u00BB cards are considered Dwarf cards of the class in which they are placed and can be destroyed by the powers of Dagda, Bonfur, Brisingamens, and Hofud.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Olwin",
            },
        },
        {
            action: DrawProfitAction,
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
            action: PlaceCardsAction,
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
 */
var Zolkur = {
    name: "Zolkur",
    description: "Adds 10 points to your Final Bravery Value.When you recruit him, immediately place him on the coins of your pouch.During your next trade, you trade the lower value coin instead of the higher as in a standard exchange.Then return Zolkur's card to the Command Zone.",
    game: "thingvellir",
    suit: null,
    rank: null,
    points: 10,
    stack: [
        {
            action: AddHeroToCardsAction,
            config: {
                drawName: "Zolkur",
            },
        },
        {
            action: AddBuffToPlayerAction,
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
