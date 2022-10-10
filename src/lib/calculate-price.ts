import BigNumber from 'bignumber.js';
import { ParsedUrlQuery } from 'querystring';
import { prisma } from 'src/utils/prisma';

export default async function calculatePrice(query: ParsedUrlQuery): Promise<{ price: BigNumber; shipping: BigNumber; totalPrice: BigNumber; }> {
    let amount = new BigNumber(0);
    const { products, paymentMethod } = query;
    if (!!products) {
        const productIds = (products as string).split(",");
        const storedProducts = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });
        for (const product of storedProducts) {
            if (paymentMethod === 'usd' || paymentMethod === 'qr-usd') {
                amount = amount.plus(product.priceUSD);
            }
            if (paymentMethod === 'sol' || paymentMethod === 'qr-sol') {
                amount = amount.plus(product.priceSOL);
            }
        }
    }
    const price = new BigNumber(amount.toFixed(2));
    const shipping = new BigNumber(price.multipliedBy(0.2).toFixed(2));
    const totalPrice = new BigNumber(price.plus(shipping).toFixed(2));
    return { price, shipping, totalPrice };
}