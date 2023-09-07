export class Card {
  public suit: 'clubs' | 'hearts' | 'diamonds' | 'spades';

  public label: string;

  public value: number | Array<number>;

  public show: boolean;
  
  constructor({ suit, label, value, show }) {
    this.suit = suit;

    this.label = label;

    this.value = value;

    this.show = show;
  }

  public _show() {
    this.show = true;
  }

  public hide() {
    this.show = false;
  }

}