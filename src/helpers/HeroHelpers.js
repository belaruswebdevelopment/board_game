import {heroesConfig} from "../data/HeroData";

export const GetHeroIndexByName = (heroName) => Object.keys(heroesConfig).indexOf(heroName)
