import {TotalRank} from "./Score";
import {heroesConfig} from "./data/HeroData";

export const CreateHero = ({name, description, game, suit, rank, points} = {}) => {
    return {
        name,
        description,
        game,
        suit,
        rank,
        points,
    };
};

export const BuildHeroes = (config) => {
    const heroes = [];
    for (const hero in heroesConfig) {
        if (config.includes(heroesConfig[hero].game)) {
            heroes.push(CreateHero({
                name: heroesConfig[hero].name,
                description: heroesConfig[hero].description,
                game: heroesConfig[hero].game,
                suit: heroesConfig[hero].suit,
                rank: heroesConfig[hero].rank,
                points: heroesConfig[hero].points,
            }));
        }
    }
    return heroes;
};

export const CheckPickHero = (G, ctx) => {
    return Math.min(...G.players[ctx.currentPlayer].cards.map(item => item.reduce(TotalRank, 0))) > G.players[ctx.currentPlayer].heroes.length;
};
