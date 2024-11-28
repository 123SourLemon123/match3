import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    KV_REST_API_URL: process.env.KV_REST_API_URL ? 'Set' : 'Not set',
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'Set' : 'Not set',
  })
}

