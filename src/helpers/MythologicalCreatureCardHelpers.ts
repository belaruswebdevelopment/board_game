import { CreateMythicalAnimalPlayerCard } from "../MythologicalCreature";
import type { MythicalAnimalCard, MythicalAnimalPlayerCard } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с добавлением карт мифических животных в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт мифических животных, добавляющихся на поле игрока.</li>
 * </ol>
 *
 * @param context
 * @param card Карта.
 * @returns Карта мифического животного.
 */
export const AddMythicalAnimalToPlayerCards = (card: MythicalAnimalCard): MythicalAnimalPlayerCard => {
    if (card.playerSuit !== null && card.rank !== null) {
        return CreateMythicalAnimalPlayerCard({
            description: card.description,
            name: card.name,
            points: card.points,
            rank: card.rank,
            suit: card.playerSuit,
        });
    }
    throw new Error(`Карта '${card.type}' '${card.name}' должна иметь параметры 'playerSuit' и 'rank'.`);
};
