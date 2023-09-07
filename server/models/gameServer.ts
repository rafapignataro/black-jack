import { Users } from "./users";
import { Rooms } from "./rooms";

export class GameServer {
  public users: Users;
  public rooms: Rooms;

  constructor() {
    this.users = new Users();
    this.rooms = new Rooms();
  }
}