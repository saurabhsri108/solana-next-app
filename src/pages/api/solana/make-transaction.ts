import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint, Mint } from '@solana/spl-token';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { shopAddress, usdcAddress } from 'src/lib/addresses';
import calculatePrice from 'src/lib/calculate-price';
import { IErrorOutput, IMakeTransactionInputData, IMakeTransactionOutputData } from 'src/schema/solana.schema';
import { prisma } from 'src/utils/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IMakeTransactionOutputData | IErrorOutput>
) {
    try {
        // Passed from FE the selected items in the query, to calculate the original cost.
        const { price, shipping, totalPrice } = await calculatePrice(req.query);
        // console.log({ price, shipping, totalPrice });
        if (price.toNumber() === 0) {
            res.status(400).json({ error: "Your total amount is 0. You must add some products!" });
            return;
        }

        // Passed from FE reference to use in the query
        const { reference } = req.query;
        if (!reference) {
            res.status(400).json({ error: "No reference provided. It's required for tracking payment progress" });
            return;
        }

        // Passed from FE the buyers public key (wallet address) in the JSON body
        const { walletAddress: account, userId } = req.body as IMakeTransactionInputData;
        if (!account) {
            res.status(400).json({ error: "No account provided! Please select wallet..." });
            return;
        }
        if (!userId) {
            res.status(400).json({ error: "No user provided! Please login..." });
            return;
        }

        const buyerPublicKey = new PublicKey(account); // transform string to PublicKey format for the wallet address of the buyer
        const shopPublicKey = shopAddress;

        const network = WalletAdapterNetwork.Devnet; // this must be same for both buyer (FE) and seller (BE)
        const endpoint = clusterApiUrl(network);
        const connection = new Connection(endpoint);

        let { paymentMethod } = req.query;
        let usdcMint: Mint, buyerUsdcAddress: PublicKey, shopUsdcAddress: PublicKey;
        if (paymentMethod === 'usd') {
            usdcMint = await getMint(connection, usdcAddress); // get details of the USDC token
            buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey); // get the buyer's USDC token account address
            shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, shopPublicKey); // get the seller's USDC token account address
        }

        // Retrieve the recent blockhash to include in the transaction
        const { blockhash } = await (connection.getLatestBlockhash('finalized'));

        const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: buyerPublicKey // buyer is paying the transaction fees here
        });

        let transInstruction;
        if (paymentMethod === 'usd') {
            // Create the instruction to send USDC from the buyer to the shop
            transInstruction = createTransferCheckedInstruction(
                buyerUsdcAddress!, // source
                usdcAddress, // mint token address
                shopUsdcAddress!, // destination
                buyerPublicKey, // owner of source address,
                totalPrice.toNumber() * (10 ** (usdcMint!).decimals), // amount to transfer (USDC units)
                usdcMint!.decimals, // decimals of the USDC token
            );
        } else {
            // Create instructions for sending SOL to shop from buyer
            transInstruction = SystemProgram.transfer({
                fromPubkey: buyerPublicKey,
                lamports: totalPrice.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
                toPubkey: shopPublicKey
            });
        }

        // Add reference to the instruction as a key - helps query for this transaction using reference from FE to know the payment status
        transInstruction.keys.push({
            pubkey: new PublicKey(reference),
            isSigner: false,
            isWritable: false
        });

        // Add instruction to the transaction
        transaction.add(transInstruction);

        // Serialize the transaction and convert to base64 to return it
        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false // need the buyer to sign this transaction after it's returned to the FE for them
        });
        const base64Transaction = serializedTransaction.toString('base64');
        // console.log(base64Transaction, base64Transaction.length);
        // modify the database
        const { orderId } = req.body as IMakeTransactionInputData;
        const status = "IN_CART";
        if (paymentMethod === 'usd') {
            paymentMethod = 'USDC';
        }
        await prisma.$queryRaw`
                        UPDATE
                            railway.Order
                        SET 
                            railway.Order.paymentMethod=${paymentMethod},
                            railway.Order.price=${price},
                            railway.Order.shipping=${shipping},
                            railway.Order.totalPrice=${totalPrice},
                            railway.Order.status=${status},
                            railway.Order.transactionReferenceBase64=${base64Transaction}
                        WHERE railway.Order.id=${orderId}
                    `;
        res.status(200).json({
            transaction: base64Transaction,
            message: "Thanks for your order!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while creating transaction! Try again..." });
        return;
    }
}