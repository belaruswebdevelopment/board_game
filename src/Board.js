import React from "react";
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

/**
 * Отрисовка игрового стола.
 */
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
    OnClickCard = (cardId) => {
        this.props.moves.ClickCard(cardId);
    };
    OnClickBoardCoin = (coinId) => {
        this.props.moves.ClickBoardCoin(coinId);
    };
    OnClickHandCoin = (coinId) => {
        this.props.moves.ClickHandCoin(coinId);
    };
    OnClickCoinToUpgradeDistinction = (coinId, type, isInitial) => {
        this.props.moves.ClickCoinToUpgradeDistinction(coinId, type, isInitial);
    };
    OnClickCoinToUpgradeInDistinction = (coinId, type, isInitial) => {
        this.props.moves.ClickCoinToUpgradeInDistinction(coinId, type, isInitial);
    };
    OnClickCardToPickDistinction = (cardId, deck) => {
        this.props.moves.ClickCardToPickDistinction(cardId, deck);
    };
    OnClickCoinToUpgrade = (coinId, type, isInitial) => {
        this.props.moves.ClickCoinToUpgrade(coinId, type, isInitial);
    };
    OnClickCoinToUpgradeGrid = (coinId, type, isInitial) => {
        this.props.moves.GridAction(coinId, type, isInitial);
    };
    OnClickCardToDiscard = (suitId, cardId, hero) => {
        this.props.moves.DiscardCard(suitId, cardId, hero);
    };
    OnClickSuitToPlaceCard = (suitId) => {
        this.props.moves.PlaceCard(suitId);
    };
    OnClickCardFromDiscard = (cardId) => {
        this.props.moves.PickDiscardCard(cardId);
    };
    OnClickCoinToUpgradeFromDiscard = (coinId, type, isInitial) => {
        this.props.moves.UpgradeCoinFromDiscard(coinId, type, isInitial);
    };
    OnClickSuitToPlaceYlud = (suitId) => {
        this.props.moves.PlaceYlud(suitId);
    };
    OnClickSuitToPlaceThrud = (suitId) => {
        this.props.moves.PlaceThrud(suitId);
    };
    OnClickSuitToMoveThrud = (suitId) => {
        this.props.moves.MoveThrud(suitId);
    };
    OnClickCardToDiscard2Players = (cardId) => {
        this.props.moves.DiscardCard2Players(cardId);
    };
    OnClickCampCardHolda = (cardId) => {
        this.props.moves.PickCampCardHolda(cardId);
    };

    render() {
        const gridClass = "col-span-4",
            classes = "col-span-4 text-center underline border",
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
            debugUI = DrawDebugData(this);
        return (
            <div className="flex">
                <div className="grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1">
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
                    <div className="col-span-full flex flex-col gap-1">
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
