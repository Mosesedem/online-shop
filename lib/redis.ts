import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttl = 3600): Promise<T> {
  const cached = await redis.get<T>(key)
  if (cached) return cached

  const data = await fetchFn()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
