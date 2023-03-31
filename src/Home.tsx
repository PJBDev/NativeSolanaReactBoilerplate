import React, { useEffect, useState } from 'react';
import { Keypair, Connection, PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const network = process.env.REACT_APP_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';

export default function Home() {
    const wallet: any = useWallet();

    const programId = new PublicKey(process.env.REACT_APP_PROGRAM_ID || '');
    const clientPubKey = new PublicKey(process.env.REACT_APP_PROGRAM_ACCOUNT || '');

    const signTransaction = async () => {
        const connection = new Connection(network);

        const transaction = new Transaction().add(
            new TransactionInstruction({
                keys: [
                    { pubkey: clientPubKey, isSigner: false, isWritable: true },
                    { pubkey: programId, isSigner: false, isWritable: true },
                ],
                programId,
                data: Buffer.from('bc1pwdc9tvgelhxjh2365ls2d35tvm7yfllww77mgrf3762lnwween5sv5dkpr'),
            })
        );

        transaction.feePayer = new PublicKey(wallet.publicKey);
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTransaction = await wallet.signTransaction(transaction);
        const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log('Transaction ID:', transactionId);
    };

    return (
        <div>
            <h1>Home</h1>

            <WalletMultiButton />

            <button onClick={() => signTransaction()}>Sign me</button>
        </div>
    );
}
