import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'src/utils/prisma';

export function createContext({ req, res }: { req: NextApiRequest, res: NextApiResponse; }) {
    return { req, res, prisma };
}

export type Context = ReturnType<typeof createContext>;