import WebSocket from 'ws';

import { User } from "./users";
import { Card } from "./card";
import { webSocketServer, Socket } from '../../entry.server';
import { sleep } from '../../utils/sleep';
import { uniqueID } from '../../utils/unique-id';
import { getShuffledDeck } from '../utils/get-shuffled-deck';

class Dealer {
  public id: string;

  public roomId: string;
  
  public status: 'IDLE' | 'BUST' | 'BLACKJACK';

  public cards: Array<Card>;

  public count: number;

  constructor(roomId: string) {
    this.id = crypto.randomUUID();

    this.roomId = roomId;

    this.status = 'IDLE';

    this.cards = [];

    this.count = 0;
  }

  public dealCard(card: Card) {
    if (this.cards.length === 1) card.hide();

    this.cards.push(card);

    this.count += typeof card.value === 'number' ? card.value : card.value[0];

    if (this.count === 21) this.status = 'BLACKJACK';

    if (this.count > 21) this.status = 'BUST'
  }

  public reset() {
    this.cards = [];

    this.count = 0;
  }
}

class Player {
  public id: string;

  public roomId: string;

  public status: 'IDLE' | 'BUST' | 'BLACKJACK' | 'LOST' | 'WON' | 'STAND-OFF';

  public cards: Array<Card>;

  public count: number;

  public played: boolean;

  public bet: number;

  public user: User;

  constructor(user: User) {
    this.id = user.id;

    this.roomId = String(user.roomId);

    this.user = user;

    this.status = 'IDLE';

    this.cards = [];

    this.count = 0;

    this.played = false;

    this.bet = 0;
  }

  public dealCard(card: Card) {
    this.cards.push(card);

    this.count += typeof card.value === 'number' ? card.value : card.value[0];

    if (this.count === 21) {
      this.status = 'BLACKJACK';
    }

    if (this.count > 21) {
      this.status = 'BUST';
    }
  }

  public reset() {
    this.status = 'IDLE';

    this.cards = [];

    this.count = 0;

    this.played = false;

    this.bet = 0;
  }
}

export class Room {
  public id: string;

  public status: 'IDLE' | 'STARTING' | 'BETTING' | 'DEALING_CARDS' | 'PLAYING' | 'END';

  public deck: Array<Card>;

  public startsInInterval?: NodeJS.Timeout;

  public startsIn?: number;

  public turnEndsInInterval?: NodeJS.Timeout;

  public turnEndsIn?: number;

  public turnPlayer?: Player;

  public turnEndsAt?: number;

  public dealer: Dealer;

  public players: Record<1 | 2 | 3 | 4 | 5 | 6, Player | null>;

  public spectators: Map<string, User>;

  constructor() {
    this.id = uniqueID();

    this.status = 'IDLE';
    
    this.deck = [];

    this.dealer = new Dealer(this.id);

    this.players = {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    }

    this.spectators = new Map();
  }

  join(user: User) {
    const userSpectator = this.spectators.get(user.id);

    if (userSpectator) return userSpectator;

    user.roomId = this.id;

    this.spectators.set(user.id, user);

    return user;
  }

  listPlayers() {
    return Object.values(this.players);
  }

  listSpectators() {
    return Array.from(this.spectators.values());
  }

  start() {
    this.status = 'STARTING';

    this.deck = getShuffledDeck().map(card => new Card({ ...card, show: true }));

    this.dealer.reset();

    for (const player of this.listPlayers()) {
      player?.reset();
    }

    this.startsIn = 10;
    
    this.emitState();

    this.startsInInterval = setInterval(() => {
      if (this.startsIn === 0) {
        this.startsIn = undefined;
        
        clearInterval(this.startsInInterval);

        this.startsInInterval = undefined;

        this.receiveBet();

        return;
      } 

      if (this.startsIn) this.startsIn--;

      this.emitState();
    }, 1000);
  }

  receiveBet() {
    this.status = 'BETTING';

    const playerToReceiveBets = this.listPlayers().filter(player => player) as Array<Player>;

    const playerToReceiveBet = playerToReceiveBets.find(player => !player.bet);

    this.turnPlayer = undefined;
    this.turnEndsIn = undefined;
    clearInterval(this.turnEndsInInterval);
    this.turnEndsInInterval = undefined;

    if (!playerToReceiveBet) {
      this.dealCards();
      return;
    }

    this.turnPlayer = playerToReceiveBet;
    this.turnEndsIn = 30;

    this.emitState();

    this.turnEndsInInterval = setInterval(() => {
      if (this.turnEndsIn === 0) {
        this.receiveBet();
        return;
      } 

      if (this.turnEndsIn) this.turnEndsIn--;
      
      this.emitState();
    }, 1000);
  }

  dealCards() {
    this.status = 'DEALING_CARDS';

    const playersToDealCards = this.listPlayers().filter(player => player) as Array<Player>;

    const receivers = [
      ...playersToDealCards,
      this.dealer,
    ]

    let playerToDeal = 0;

    const deliveringCardsInterval = setInterval(() => {
      const stopDealing = receivers.filter(receiver => receiver.cards.length === 2).length === receivers.length;

      if (stopDealing) {
        clearInterval(deliveringCardsInterval);

        this.nextTurn();
        return;
      }

      const card = this.deck.pop() as Card;

      const receiver = receivers[playerToDeal];

      receiver.dealCard(card);

      this.emitState('DEAL_CARD');

      playerToDeal++;

      if (!receivers[playerToDeal]) playerToDeal = 0;
    }, 1000);
  }

  nextTurn() {
    this.status = 'PLAYING';

    const players = this.listPlayers();

    const lastTurnPlayer = this.turnPlayer;

    if (lastTurnPlayer) lastTurnPlayer.played = true;

    this.turnPlayer = undefined;
    this.turnEndsIn = undefined;
    clearInterval(this.turnEndsInInterval)
    this.turnEndsInInterval = undefined;

    this.emitState();

    const currentTurnPlayer = players.find(p => p && !p.played);

    if (!currentTurnPlayer) {
      this.turnPlayer = undefined;
      this.turnEndsInInterval = undefined;
      this.turnEndsIn = undefined;

      this.finishRound();

      return;
    }

    this.turnPlayer = currentTurnPlayer;

    this.turnEndsIn = 30;

    this.emitState();

    this.turnEndsInInterval = setInterval(() => {
      if (this.turnEndsIn === 0) {
        this.nextTurn();

        return;
      } 

      if (this.turnEndsIn) this.turnEndsIn--;
      
      this.emitState();
    }, 1000);
  }

  async finishRound() {
    const dealerSecondCard = this.dealer.cards.at(1);

    if (dealerSecondCard) dealerSecondCard._show();

    await sleep();

    this.emitState();

    if (
      this.listPlayers().find(p => p && p.status === 'IDLE') &&
      this.dealer.count <= 16
    ) {
      while (this.dealer.count <= 16) {
        const card = this.deck.pop() as Card;

        this.dealer.dealCard(card);

        await sleep();

        this.emitState('DEAL_CARD');
      }
    }

    this.status = 'END';

    this.emitState();

    await sleep();

    const players = this.listPlayers();

    players.forEach(player => {
      if (!player) return;

      const playerBet = player.bet;
      const playerBalance = player.user.balance;

      player.bet = 0;

      if (player.status === 'BLACKJACK' && this.dealer.status === 'BLACKJACK') {
        player.user.balance = playerBalance + playerBet;
        player.status = 'STAND-OFF';
        return;
      }

      if (player.status === 'BLACKJACK' && (this.dealer.status === 'BUST' || this.dealer.status === 'IDLE')) {
        player.user.balance = playerBalance + (playerBet * 2);
        player.status = 'WON';
        return;
      }

      if (player.status === 'BUST') {
        player.status = 'LOST';
        return;
      }

      if (player.status === 'IDLE' && this.dealer.status === 'BUST') {
        player.user.balance = playerBalance + (playerBet * 2);
        player.status = 'WON';
        return;
      }

      if (player.status === 'IDLE' && this.dealer.status === 'IDLE') {
        if (player.count === this.dealer.count) {
          player.status = 'IDLE';
          player.user.balance = playerBalance + playerBet;
          
          return;
        }

        const playerWon = player.count > this.dealer.count;

        if (!playerWon) {
          player.status = 'LOST';
          return;
        }

        player.user.balance = playerBalance + (playerBet * 2);
        player.status = 'WON';

        return;
      }
    });

    this.emitState();

    setTimeout(() => this.start(), 5000);
  }

  playerPickChair(user: User, chair: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) {
    const spectator = this.spectators.get(user.id);

    if (!spectator) return;

    let player = Object.values(this.players).find(p => p && p.id === user.id);

    if (player) return player;

    this.spectators.delete(user.id);

    user.isPlaying = true;

    player = new Player(user);

    this.players[chair as 1 | 2 | 3 | 4 | 5 | 6] = player;

    if (this.status === 'IDLE') this.start();

    this.emitState();

    return player;
  }

  playerBet(playerId: string, bet: 25 | 50 | 100 | 500) {
    const player = Object.values(this.players).find(p => p && p.id === playerId);

    if (!player) return;

    if (!this.turnPlayer || this.turnPlayer.id !== playerId) return;

    const bets = [25, 50, 100, 500];

    if (!bets.includes(bet)) return;

    player.bet = bet;
    player.user.balance = player.user.balance - bet;

    this.receiveBet();

    this.emitState();
  }

  playerHit(playerId: string) {
    const player = Object.values(this.players).find(p => p && p.id === playerId);

    if (!player) return;

    if (!this.turnPlayer || this.turnPlayer.id !== playerId) return;

    const card = this.deck.pop() as Card;

    player.dealCard(card);

    if (player.status !== 'IDLE') {
      return this.nextTurn();
    }

    this.emitState('DEAL_CARD');
  }

  playerStay(playerId: string) {  
    const player = Object.values(this.players).find(p => p && p.id === playerId);

    if (!player) return;

    if (!this.turnPlayer || this.turnPlayer.id !== playerId) return;

    this.nextTurn();
  }

  state() {
    return {
      id: this.id,
      status: this.status,
      dealer: this.dealer,
      players: this.listPlayers(),
      spectators: this.listSpectators(),
      startsIn: this.startsIn,
      turnPlayer: this.turnPlayer,
      turnEndsIn: this.turnEndsIn,
    }
  }

  public emitState(ref?: string) {
    webSocketServer.clients.forEach((socket: Socket) => {
      if (
        !socket.userId ||
        socket.roomId !== this.id || 
        socket.readyState !== WebSocket.OPEN
      ) return;

      socket.send(JSON.stringify({
        event: 'ROOM_STATE',
        data: {
          state: this.state(),
          ref
        }
      }));
    });
  }
}

export class Rooms {
  private rooms: Map<string, Room> = new Map();

  constructor() {}

  find(id: string) {
    return this.rooms.get(id);
  }

  list() {
    return Array.from(this.rooms.values());
  }

  create() {
    const room: Room = new Room();

    this.rooms.set(room.id, room);

    return room;
  }

  delete(id: string) {
    return this.rooms.delete(id);
  }

  // FLAG: This is temporary until users can choose rooms
  getMainRoom() {
    if (!this.rooms.size) return this.create();

    return Array.from(this.rooms.values()).at(0);
  }
}