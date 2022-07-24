import { GameNames, MultiSuitCardNames } from "../typescript/enums";
import type { MultiCardsConfigType, MultiSuitCardDataType } from "../typescript/interfaces";

/**
 * <h3>Данные о особой карте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным особой карты.</li>
 * </ol>
 */
const Gullinbursti: MultiSuitCardDataType = {
    name: MultiSuitCardNames.Gullinbursti,
    game: GameNames.idavoll,
};

/**
 * <h3>Данные о особой карте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным особой карты.</li>
 * </ol>
 */
const OlwinsDouble: MultiSuitCardDataType = {
    name: MultiSuitCardNames.OlwinsDouble,
    game: GameNames.thingvellir,
};


/**
 * <h3>Конфиг особых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех особых карт при инициализации игры.</li>
 * </ol>
 */
export const multiCardsConfig: MultiCardsConfigType = {
    Gullinbursti,
    OlwinsDouble,
};
