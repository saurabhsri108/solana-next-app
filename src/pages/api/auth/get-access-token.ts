import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

async function generateAccessToken(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken } = await getAccessToken(req, res);
        return res.status(200).json(accessToken);
    } catch (error: any) {
        console.error(error);
        res.status(error.status || 500).end(error.message);
    }
}

export default withApiAuthRequired(generateAccessToken);