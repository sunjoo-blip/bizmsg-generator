import { promises as fs } from 'node:fs';
import path from 'node:path';
import Redis from 'ioredis';
import type { SavedTemplate } from '../types';

// 저장소 추상화
//   - REDIS_URL 이 있으면 Redis 사용 (배포본에서도 저장됨, 팀 즉시 공유)
//   - 없으면 로컬 data/templates.json 파일 사용 (개발 폴백)

const FILE = path.join(process.cwd(), 'data', 'templates.json');
const REDIS_KEY = 'bizmsg:templates'; // id -> JSON(SavedTemplate) 해시

// 서버리스에서 연결 재사용 (핫리로드/재호출 시 커넥션 폭증 방지)
const g = globalThis as unknown as { __bizmsgRedis?: Redis | null };

function getRedis(): Redis | null {
  if (g.__bizmsgRedis !== undefined) return g.__bizmsgRedis;
  const url = process.env.REDIS_URL;
  g.__bizmsgRedis = url
    ? new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: false })
    : null;
  return g.__bizmsgRedis;
}

export const usingRedis = !!process.env.REDIS_URL;

// ---- 파일 백엔드 ----
async function fileReadAll(): Promise<SavedTemplate[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as SavedTemplate[]) : [];
  } catch {
    return [];
  }
}

async function fileWriteAll(list: SavedTemplate[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2) + '\n', 'utf8');
}

function sortById(list: SavedTemplate[]): SavedTemplate[] {
  return [...list].sort((a, b) => a.id.localeCompare(b.id));
}

// ---- 공개 API ----
export async function getAll(): Promise<SavedTemplate[]> {
  const redis = getRedis();
  if (!redis) return sortById(await fileReadAll());

  const map = await redis.hgetall(REDIS_KEY);
  const ids = Object.keys(map);
  if (ids.length > 0) {
    return sortById(ids.map((id) => JSON.parse(map[id]) as SavedTemplate));
  }

  // Redis 가 비어있으면 커밋된 파일로 1회 시딩
  const seed = await fileReadAll();
  if (seed.length > 0) {
    const flat: Record<string, string> = {};
    for (const t of seed) flat[t.id] = JSON.stringify(t);
    await redis.hset(REDIS_KEY, flat);
  }
  return sortById(seed);
}

export async function upsert(entry: SavedTemplate): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.hset(REDIS_KEY, entry.id, JSON.stringify(entry));
    return;
  }
  const list = await fileReadAll();
  const idx = list.findIndex((t) => t.id === entry.id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  await fileWriteAll(list);
}

export async function remove(id: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.hdel(REDIS_KEY, id);
    return;
  }
  const list = await fileReadAll();
  await fileWriteAll(list.filter((t) => t.id !== id));
}
