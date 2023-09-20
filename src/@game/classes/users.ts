export class User {
  public id: string;

  public roomId?: string;

  public name: string;

  public avatar: string;

  public online: boolean;

  public isPlaying: boolean;

  public balance: number;

  constructor(name: string, avatar: string) {
    this.id = crypto.randomUUID();

    this.name = name;

    this.avatar = avatar;

    this.online = false;

    this.isPlaying = false;

    this.balance = 500;
  }

  connect() {
    this.online = true;
  }

  disconnect() {
    this.online = false;
  }
}

export class Users {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  find(id: string) {
    return this.users.get(id);
  }

  list() {
    return Array.from(this.users.values());
  }

  create(name: string, avatar: string) {
    const user = new User(name, avatar);

    this.users.set(user.id, user);

    return user;
  }

  delete(id: string) {
    return this.users.delete(id);
  }
}