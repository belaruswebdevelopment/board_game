export const createPlayer = () => ({cards: [[]], heroes: [], coins: []});

export const addCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
}