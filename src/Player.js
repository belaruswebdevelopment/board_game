export const CreatePlayer = () => ({cards: [], heroes: [], coins: [], priority: null});

export const AddCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
}