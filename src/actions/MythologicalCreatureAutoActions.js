/**
 * <h3>Действия, связанные с добавлением карт Мифических существ для выбора Skymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При активации способности Гиганта Skymir.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const AddMythologyCreatureCardsSkymirAction = ({ G }) => {
    const mythologyCreatureCardsSkymir = [];
    for (let j = 0; j < 5; j++) {
        const mythologyCreatureCard = G.secret.mythologicalCreatureNotInGameDeck.splice(0, 1)[0];
        if (mythologyCreatureCard === undefined) {
            throw new Error(`В массиве карт Мифических существ не в игре отсутствует карта с id '${j}'.`);
        }
        if (G.mythologicalCreatureDeckForSkymir === null) {
            throw new Error(`Массив всех карт мифических существ для Skymir не может не быть заполнен картами.`);
        }
        mythologyCreatureCardsSkymir.push(mythologyCreatureCard);
    }
    G.mythologicalCreatureDeckForSkymir = mythologyCreatureCardsSkymir;
};
//# sourceMappingURL=MythologicalCreatureAutoActions.js.map