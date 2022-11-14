import { ChangeIsOpenedCoinStatus } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames } from "../typescript/enums";
import { UpgradeCoinAction } from "./CoinActions";
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
/**
 * <h3>Действия, связанные с улучшением всех монет игрока на +2 Hrungnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При активации способности Гиганта Hrungnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const AddPlusTwoValueToAllCoinsAction = ({ G, ctx, playerID, ...rest }) => {
    const player = G.publicPlayers[Number(playerID)], privatePlayer = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, playerID);
    }
    if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, HeroBuffNames.EveryTurn)) {
        // TODO DO It!
    }
    else {
        for (let j = 0; j < 5; j++) {
            // TODO Check for Local and Multiplayer games!
            const privateBoardCoin = privatePlayer.boardCoins[j];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${playerID}' на поле отсутствует монета с id '${j}'.`);
            }
            if (G.mode === GameModeNames.Multiplayer) {
                if (privateBoardCoin === null) {
                    throw new Error(`В массиве монет приватного игрока с id '${playerID}' на столе не может не быть монеты с id '${j}'.`);
                }
                if (!privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, true);
                }
                player.boardCoins[j] = privateBoardCoin;
            }
            UpgradeCoinAction({ G, ctx, playerID, ...rest }, false, 2, j, CoinTypeNames.Board);
        }
    }
};
//# sourceMappingURL=MythologicalCreatureAutoActions.js.map