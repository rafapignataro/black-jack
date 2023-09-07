export class User {
  public id: string;

  public roomId?: string;

  public online: boolean;

  public isPlaying: boolean;

  constructor() {
    this.id = crypto.randomUUID();

    this.online = false;

    this.isPlaying = false;
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

  create() {
    const user = new User();

    this.users.set(user.id, user);

    return user;
  }

  delete(id: string) {
    return this.users.delete(id);
  }
}