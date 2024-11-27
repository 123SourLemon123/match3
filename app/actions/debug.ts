import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    KV_REST_API_URL: process.env.KV_REST_API_URL ? 'Set' : 'Not set',
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'Set' : 'Not set',
  })
}

