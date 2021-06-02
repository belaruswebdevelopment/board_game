import {campConfig} from "./data/CampData";

export const CreateCampCard = ({name, description, game, suit, rank, points} = {}) => {
    return {
        name,
        description,
        game,
        suit,
        rank,
        points,
    };
};

export const BuildCampCards = (tier, config) => {
    const campCards = [];
    for (const campCard in campConfig) {
        if (config.includes(campConfig[campCard].tier)) {
            campCards.push(CreateCampCard({
                name: campConfig[campCard].name,
                description: campConfig[campCard].description,
                game: campConfig[campCard].game,
                suit: campConfig[campCard].suit,
                rank: campConfig[campCard].rank,
                points: campConfig[campCard].points,
            }));
        }
    }
    return campCards;
};

export const CheckEmptyCampCards = (G) => {
    const campEmptyCards = G.camp.map((element, index) => {
        if (element === null) {
            return index;
        }
        return null;
    });
    if (campEmptyCards.length !== 0 && G.campDecks[G.campDecks.length - G.tierToEnd].length !== 0) {
        campEmptyCards.forEach(card => {
            if (card !== null && G.campDecks[G.campDecks.length - G.tierToEnd].length) {
                G.camp.splice(card, 1, G.campDecks[G.campDecks.length - G.tierToEnd].splice(0, 1)[0]);
            }
        });
    }
}

export const RefillCamp = (G) => {
    // todo Add cards before dwarf tavern cards open
    for (let i = 0; i < G.campNum; i++) {
        G.camp.splice(i, 1, G.campDecks[G.campDecks.length - G.tierToEnd].splice(0, 1)[0]);
    }
}
