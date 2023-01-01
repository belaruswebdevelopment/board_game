import { GameNames, MultiSuitCardNames } from "../typescript/enums";
import type { MultiSuitCardData, MultiSuitCardsConfig } from "../typescript/interfaces";

/**
 * <h3>Данные о особой карте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным особой карты.</li>
 * </ol>
 */
const Gullinbursti: MultiSuitCardData = {
    name: MultiSuitCardNames.Gullinbursti,
    game: GameNames.Idavoll,
};

/**
 * <h3>Данные о особой карте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным особой карты.</li>
 * </ol>
 */
const OlwinsDouble: MultiSuitCardData = {
    name: MultiSuitCardNames.OlwinsDouble,
    game: GameNames.Thingvellir,
};


/**
 * <h3>Конфиг особых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех особых карт при инициализации игры.</li>
 * </ol>
 */
export const multiCardsConfig: MultiSuitCardsConfig = {
    Gullinbursti,
    OlwinsDouble,
};
