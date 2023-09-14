import { getShuffledDeck } from "../utils/get-shuffled-deck";
import { Card } from "./card";

export class Deck {
  public id: string;

  private cards: Array<Card>;
  
  private currentCards: Array<Card>;

  constructor() {
    this.id = crypto.randomUUID();

    const cards = getShuffledDeck();

    this.cards = cards;
    this.currentCards = cards;
  }

  pop() {
    const card = this.currentCards.pop();

    return card;
  }
}