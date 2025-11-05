/**
 * Development-only in-memory storage as fallback when MongoDB is unavailable
 * This is NOT for production use!
 * Uses global to persist across Next.js hot reloads
 */

export interface StoredUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Array<{
    _id: string;
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
}

interface GlobalDevStorageData {
  users: Array<[string, StoredUser]>;
  usersByUsername: Array<[string, string]>;
  usersByEmail: Array<[string, string]>;
  nextId: number;
}

declare global {
  var _devStorageData: GlobalDevStorageData | undefined;
  var _devStorageInstance: DevStorage | undefined;
}

class DevStorage {
  private users: Map<string, StoredUser>;
  private usersByUsername: Map<string, string>;
  private usersByEmail: Map<string, string>;
  private nextId: number;

  constructor() {
    // Initialize from global data if it exists, otherwise create fresh
    if (global._devStorageData) {
      this.users = new Map(global._devStorageData.users);
      this.usersByUsername = new Map(global._devStorageData.usersByUsername);
      this.usersByEmail = new Map(global._devStorageData.usersByEmail);
      this.nextId = global._devStorageData.nextId;
      console.log(`📦 Restored devStorage from global: ${this.users.size} users, nextId: ${this.nextId}`);
    } else {
      this.users = new Map();
      this.usersByUsername = new Map();
      this.usersByEmail = new Map();
      this.nextId = 1;
      console.log('🆕 Initialized new devStorage');
    }
  }

  private syncToGlobal() {
    // Persist to global whenever data changes
    global._devStorageData = {
      users: Array.from(this.users.entries()),
      usersByUsername: Array.from(this.usersByUsername.entries()),
      usersByEmail: Array.from(this.usersByEmail.entries()),
      nextId: this.nextId,
    };
  }

  findUserById(id: string): StoredUser | null {
    console.log(`🔍 devStorage.findUserById(${id})`);
    console.log(`   Available IDs: ${Array.from(this.users.keys()).join(', ') || 'NONE'}`);
    const result = this.users.get(id) || null;
    console.log(`   Result: ${result ? 'FOUND' : 'NOT_FOUND'}`);
    return result;
  }

  findUserByUsername(username: string): StoredUser | null {
    const userId = this.usersByUsername.get(username);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  findUserByEmail(email: string): StoredUser | null {
    const userId = this.usersByEmail.get(email);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  createUser(userData: Omit<StoredUser, '_id' | 'createdAt'>): StoredUser {
    const id = String(this.nextId++);
    const user: StoredUser = {
      ...userData,
      _id: id,
      createdAt: new Date(),
    };

    console.log(`✨ devStorage.createUser() - Creating user with ID: ${id}, username: ${userData.username}`);
    this.users.set(id, user);
    this.usersByUsername.set(userData.username, id);
    this.usersByEmail.set(userData.email, id);
    console.log(`✨ Total users in storage: ${this.users.size}`);

    this.syncToGlobal();
    return user;
  }

  updateUser(id: string, updates: Partial<StoredUser>): StoredUser | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    this.syncToGlobal();
    return updated;
  }

  deleteUser(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;

    this.users.delete(id);
    this.usersByUsername.delete(user.username);
    this.usersByEmail.delete(user.email);
    this.syncToGlobal();
    return true;
  }

  getAllUsers(): StoredUser[] {
    const all = Array.from(this.users.values());
    console.log(`📊 devStorage.getAllUsers() - Returning ${all.length} users`);
    return all;
  }

  clear(): void {
    this.users.clear();
    this.usersByUsername.clear();
    this.usersByEmail.clear();
    this.syncToGlobal();
  }
}

// Create or get the singleton from global
if (!global._devStorageInstance) {
  global._devStorageInstance = new DevStorage();
}

const devStorage = global._devStorageInstance;

export default devStorage;
