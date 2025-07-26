// app/api/data/[file]/route.ts
import { NextRequest } from "next/server";
import redisConnect from '@/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string } }
) {
  const { file } = params;
  let redis = null;

  try {
    redis = await redisConnect();
    
    // Add cache key with namespace
    const cacheKey = `checkout:specs:${file}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      console.log("Cache hit for checkout:specs:", file);
      return new Response(cached, {
        headers: { 'Cache-Control': 'public, max-age=86400' }
      });
    }

    const response = await fetch(
      `https://raw.githubusercontent.com/Adyen/adyen-openapi/main/json/${file}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
      }
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    
    // Cache the response for 30 days
    await redis.set(cacheKey, JSON.stringify(data), {
      EX: 2592000, // 30 days in seconds
      NX: true // Only set if not exists
    });

    return new Response(JSON.stringify(data), {
      headers: { 'Cache-Control': 'public, max-age=86400' }
    });
  } catch (error: any) {
    if (error instanceof Response) {
      const data = await error.json();
      return new Response(JSON.stringify(data), {
        status: error.status,
      });
    } else {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
}
