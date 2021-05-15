export const CreatePlayer = () => ({cards: [], heroes: [], handCoins: [], boardCoins: [], priority: null});

export const AddCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
}