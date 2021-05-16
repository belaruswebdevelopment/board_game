export const CreatePlayer = () => ({cards: [], heroes: [], handCoins: [], boardCoins: [], selectedCoin: undefined,  priority: null});

export const AddCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
}