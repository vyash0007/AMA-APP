// Shared in-memory storage for users (development without database)
// Using global to persist across module reloads in Next.js development

declare global {
  var usersStore: any[];
}

// Initialize if not already done
if (!global.usersStore) {
  global.usersStore = [];
}

export const usersStore = global.usersStore;

export function findUserByEmailOrUsername(identifier: string) {
  console.log('[memoryStore] Searching for user:', identifier, 'in', usersStore.length, 'users');
  const user = usersStore.find(u => 
    u.email === identifier || u.username === identifier
  );
  console.log('[memoryStore] Found user:', !!user);
  return user;
}

export function findUserByUsername(username: string) {
  return usersStore.find(u => u.username === username);
}

export function findUserByEmail(email: string) {
  return usersStore.find(u => u.email === email);
}

export function addUser(userData: any) {
  console.log('[memoryStore] Adding user:', userData.username, userData.email);
  usersStore.push(userData);
  console.log('[memoryStore] Total users now:', usersStore.length);
}

export function getUserList() {
  return usersStore;
}

