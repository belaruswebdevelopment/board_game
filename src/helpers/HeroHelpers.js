import {heroesConfig} from "../data/HeroData";

/**
 * Вычисляет индекс указанного героя.
 * Применения:
 * 1) Используется повсеместно в проекте для вычисления индекса конкретного героя.
 *
 * @param heroName Название героя.
 * @returns {number} Индекс героя.
 * @constructor
 */
export const GetHeroIndexByName = (heroName) => Object.keys(heroesConfig).indexOf(heroName)
