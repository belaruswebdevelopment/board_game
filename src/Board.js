import React from 'react';
import {
    DrawTierCards,
    DrawCurrentPlayerTurn,
    DrawWinner,
    DrawMarketCoins,
    DrawCamp,
    DrawTaverns,
    DrawHeroes,
    DrawDistinctions,
    DrawProfit,
} from "./ui/GameBoardUI";
import {
    DrawPlayersBoardsCoins,
    DrawPlayersBoards,
    DrawPlayersHandsCoins,
} from "./ui/PlayerUI";
import {DrawDebugData} from "./ui/DebugUI";

export class GameBoard extends React.Component {
    OnClickHeroCard = (heroId) => {
        this.props.moves.ClickHeroCard(heroId);
    };
    OnClickCampCard = (cardId) => {
        this.props.moves.ClickCampCard(cardId);
    };
    OnClickDistinctionCard = (cardId) => {
        this.props.moves.ClickDistinctionCard(cardId);
    };
    OnClickCard = (tavernId, cardId) => {
        this.props.moves.ClickCard(tavernId, cardId);
    };
    OnClickBoardCoin = (coinId) => {
        this.props.moves.ClickBoardCoin(coinId);
    };
    OnClickHandCoin = (coinId) => {
        this.props.moves.ClickHandCoin(coinId);
    };
    OnClickCoinToUpgradeDistinction = (coinId) => {
        this.props.moves.ClickCoinToUpgradeDistinction(coinId);
    };
    OnClickCoinToUpgradeInDistinction = (coinId, value) => {
        this.props.moves.ClickCoinToUpgradeInDistinction(coinId, value);
    };
    OnClickCardToPickDistinction = (cardId, deck) => {
        this.props.moves.ClickCardToPickDistinction(cardId, deck);
    };
    OnClickCoinToUpgrade = (coinId) => {
        this.props.moves.ClickCoinToUpgrade(coinId);
    };

    render() {
        // todo Cursor-pointer class only for your objects and in current phase!
        const gridClass = `col-span-4`,
            tierCardsUI = DrawTierCards(this),
            currentPlayerTurnUI = DrawCurrentPlayerTurn(this),
            winnerUI = DrawWinner(this),
            marketCoinsUI = DrawMarketCoins(this),
            drawHeroesUI = DrawHeroes(this),
            drawCampUI = DrawCamp(this),
            drawDistinctionsUI = DrawDistinctions(this),
            drawDistinctionProfitUI = this.props.G.drawProfit ? DrawProfit(this, this.props.G.drawProfit)
                : this.props.G.drawProfit,
            tavernsUI = DrawTaverns(this, gridClass),
            playersBoardsCoinsUI = DrawPlayersBoardsCoins(this),
            playersHandsCoinsUI = DrawPlayersHandsCoins(this),
            playersBoardsUI = DrawPlayersBoards(this),
            debugUI = DrawDebugData(this),
            classes = `col-span-4 text-center underline border`;
        return (
            <div className="flex">
                <div className={`grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1`}>
                    <div className={classes}>
                        {tierCardsUI}
                    </div>
                    <div className={classes}>
                        {currentPlayerTurnUI}
                    </div>
                    <div className={classes}>
                        {winnerUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {marketCoinsUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {drawHeroesUI}
                    </div>
                    <div className={`${gridClass} justify-self-center h-full flex flex-col justify-evenly`}>
                        {drawDistinctionsUI}
                        {drawDistinctionProfitUI}
                        {drawCampUI}
                    </div>
                    {tavernsUI}
                    <div className={`col-span-full flex flex-col gap-1`}>
                        <div className="flex flex-col lg:flex-row gap-1">{playersBoardsCoinsUI}</div>
                        <div className="flex flex-col lg:flex-row gap-1">{playersHandsCoinsUI}</div>
                        <div className="flex items-start flex-col lg:flex-row gap-1">{playersBoardsUI}</div>
                    </div>
                </div>
                {debugUI}
            </div>
        );
    }
}
