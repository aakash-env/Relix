import crypto from "crypto";
import fs from "fs";
import path from "path";
import { db, users } from "./db";
import { eq } from "drizzle-orm";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  plan: "free" | "pro" | "team";
  avatarUrl?: string;
  createdAt: string;
}

const LOCAL_STORE_PATH = path.join(process.cwd(), ".relix-users.json");

// In-memory fallback cache
let memoryUsers: StoredUser[] = [
  {
    id: "usr_alice_demo",
    name: "Alice Chen",
    email: "alice@example.com",
    passwordHash: hashPassword("password123"),
    plan: "pro",
    createdAt: new Date().toISOString(),
  },
];

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`relix_salt_${password}`).digest("hex");
}

function loadLocalUsers(): StoredUser[] {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const data = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore and fallback
  }
  return memoryUsers;
}

function saveLocalUsers(userList: StoredUser[]) {
  try {
    memoryUsers = userList;
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(userList, null, 2), "utf-8");
  } catch (e) {
    // Non-fatal if filesystem is readonly
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalized = email.toLowerCase().trim();

  // 1. Try PostgreSQL Database if connected
  try {
    const result = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
    if (result && result.length > 0) {
      const u = result[0];
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash ?? undefined,
        plan: (u.plan as "free" | "pro" | "team") || "free",
        avatarUrl: u.avatarUrl ?? undefined,
        createdAt: u.createdAt.toISOString(),
      };
    }
  } catch (e) {
    // Database offline / in-memory fallback
  }

  // 2. Local store fallback
  const localList = loadLocalUsers();
  const found = localList.find((u) => u.email.toLowerCase() === normalized);
  return found || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  plan?: "free" | "pro" | "team";
}): Promise<StoredUser> {
  const normalized = data.email.toLowerCase().trim();
  const existing = await findUserByEmail(normalized);

  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const userId = `usr_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const passwordHash = data.password ? hashPassword(data.password) : undefined;
  const plan = data.plan || "free";

  const newUser: StoredUser = {
    id: userId,
    name: data.name.trim() || normalized.split("@")[0],
    email: normalized,
    passwordHash,
    plan,
    createdAt: new Date().toISOString(),
  };

  // 1. Try persisting to PostgreSQL
  try {
    await db.insert(users).values({
      id: userId,
      name: newUser.name,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      plan: newUser.plan,
    });
  } catch (e) {
    // Non-fatal if DB is offline, local store persists below
  }

  // 2. Persist to local JSON file & memory
  const localList = loadLocalUsers();
  localList.push(newUser);
  saveLocalUsers(localList);

  return newUser;
}

export async function authenticateUser(
  email: string,
  password?: string
): Promise<StoredUser> {
  const normalized = email.toLowerCase().trim();
  let user = await findUserByEmail(normalized);

  if (!user) {
    // Auto-create user for frictionless login
    user = await createUser({
      name: normalized.split("@")[0],
      email: normalized,
      password: password || "password123",
      plan: "free",
    });
    return user;
  }

  if (password && user.passwordHash) {
    const inputHash = hashPassword(password);
    if (inputHash !== user.passwordHash) {
      throw new Error("Invalid email address or password.");
    }
  }

  return user;
}