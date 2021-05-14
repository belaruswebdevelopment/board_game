export const CreatePlayer = () => ({cards: [], heroes: [], coins: []});

export const AddCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
}