import cards from "../../../cards.json";
import { Card } from "../classes/card";

export function getShuffledDeck() {
  const deck = cards as Array<Card>;
  let currentIndex = cards.length;
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
  }

  return deck;
}