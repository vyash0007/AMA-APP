/**
 * File-based storage for development
 * Persists data to a JSON file in the project root
 * Server-only code - uses Node.js fs module
 */

'use server';

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

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
    createdAt: string; // ISO string
  }>;
  createdAt: string; // ISO string
}

interface StorageData {
  users: StoredUser[];
  nextId: number;
}

const STORAGE_FILE = path.join(process.cwd(), '.devdata.json');

function ensureStorageFile(): StorageData {
  if (fs.existsSync(STORAGE_FILE)) {
    try {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read storage file, creating new one:', error);
      const fresh = { users: [], nextId: 1 };
      saveStorage(fresh);
      return fresh;
    }
  }

  const fresh = { users: [], nextId: 1 };
  saveStorage(fresh);
  return fresh;
}

function saveStorage(data: StorageData): void {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Storage saved: ${data.users.length} users`);
  } catch (error) {
    console.error('Failed to save storage file:', error);
  }
}

class FileStorage {
  private users: Map<string, StoredUser> = new Map();
  private usersByUsername: Map<string, string> = new Map();
  private usersByEmail: Map<string, string> = new Map();
  private nextId = 1;

  constructor() {
    this.load();
  }

  private load(): void {
    const data = ensureStorageFile();
    this.nextId = data.nextId;
    this.users.clear();
    this.usersByUsername.clear();
    this.usersByEmail.clear();

    for (const user of data.users) {
      this.users.set(user._id, user);
      this.usersByUsername.set(user.username, user._id);
      this.usersByEmail.set(user.email, user._id);
    }

    console.log(`📂 FileStorage loaded: ${this.users.size} users, nextId: ${this.nextId}`);
  }

  private save(): void {
    const data: StorageData = {
      users: Array.from(this.users.values()),
      nextId: this.nextId,
    };
    saveStorage(data);
  }

  findUserById(id: string): StoredUser | null {
    console.log(`🔍 fileStorage.findUserById(${id})`);
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
    const now = new Date().toISOString();
    const user: StoredUser = {
      ...userData,
      _id: id,
      createdAt: now,
      messages: userData.messages.map(m => ({
        ...m,
        createdAt: typeof m.createdAt === 'string' ? m.createdAt : new Date(m.createdAt).toISOString(),
      })),
    };

    console.log(`✨ fileStorage.createUser() - Creating user with ID: ${id}, username: ${userData.username}`);
    this.users.set(id, user);
    this.usersByUsername.set(userData.username, id);
    this.usersByEmail.set(userData.email, id);
    console.log(`✨ Total users in storage: ${this.users.size}`);

    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<StoredUser>): StoredUser | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    this.save();
    return updated;
  }

  deleteUser(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;

    this.users.delete(id);
    this.usersByUsername.delete(user.username);
    this.usersByEmail.delete(user.email);
    this.save();
    return true;
  }

  getAllUsers(): StoredUser[] {
    const all = Array.from(this.users.values());
    console.log(`📊 fileStorage.getAllUsers() - Returning ${all.length} users`);
    return all;
  }

  clear(): void {
    this.users.clear();
    this.usersByUsername.clear();
    this.usersByEmail.clear();
    this.save();
  }
}

// Singleton
let fileStorage: FileStorage | null = null;

export function getFileStorage(): FileStorage {
  if (!fileStorage) {
    fileStorage = new FileStorage();
  }
  return fileStorage;
}

export default getFileStorage();
