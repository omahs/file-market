import {ethers} from "hardhat";
import { program } from "commander";
import {
    FileBunniesCollection__factory,
     FilemarketExchangeV2__factory,
} from "../typechain-types";
import {BigNumber} from "ethers";

const util = require("util")
const request = util.promisify(require("request"))

const zeroAddress = "0x0000000000000000000000000000000000000000";

import * as fs from 'fs';
import * as readline from 'readline';

type CSVRow = { [column: string]: string };

async function parseCSV(filePath: string): Promise<CSVRow[]> {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const data: CSVRow[] = [];

    let headers: string[] | null = null;

    for await (const line of rl) {
        const row = line.split(',');

        if (!headers) {
            headers = row;
        } else {
            let obj: CSVRow = {};
            headers.forEach((header, i) => {
                obj[header] = row[i];
            });
            data.push(obj);
        }
    }

    return data;
}
function getRandomElements(arr: string[], count: number) {
    let copyArr = [...arr];
    let m = copyArr.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = copyArr[m];
        copyArr[m] = copyArr[i];
        copyArr[i] = t;
    }
    return copyArr.slice(0, count);
}

async function callRpc(method: string, params: string) {
    const network = process.env.HARDHAT_NETWORK;
    let url: string;
    if (network === 'filecoin') {
        url = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1';
    } else {
        url = 'https://filecoin-calibration.chainup.net/rpc/v1';
    }
    const options = {
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: [],
            id: 1,
        }),
    }
    console.log(options.body);
    const res = await request(options)
    return JSON.parse(res.body).result
}

async function main() {
    const shouldApprove = false;

    let accounts = await ethers.getSigners();
    console.log(accounts);

    const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")
    console.log(priorityFee)

    const cidObjArr = await parseCSV("")

    const fileBunniesCollectionFactory = new FileBunniesCollection__factory(accounts[0]);
    const exchangeFactory = new FilemarketExchangeV2__factory(accounts[0]);

    const fbCollection = await fileBunniesCollectionFactory.attach("0xBc3a4453Dd52D3820EaB1498c4673C694c5c6F09");
    const exchange = await exchangeFactory.attach("0x2f255f048c1510485bd3F7D65520EDFB9EbC9362");

    for (let i = BigNumber.from(0); i.lt(BigNumber.from(3000-210)); i = i.add(BigNumber.from(100))) {
        let arr = [];
        for (let j = 0; j<100 && i.toNumber() + j < 3000-210; j++) {
            arr.push(cidObjArr[0].Hash)
            cidObjArr.shift()
        }
        // console.log(arr.length, arr[0], arr[arr.length-1])
        console.log(await fbCollection.connect(accounts[0]).addPayedCids(i, arr, {maxPriorityFeePerGas: priorityFee, maxFeePerGas: BigNumber.from("800000000")}))
        arr = []
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("--------------------")

    for (let i = BigNumber.from(3000); i.lt(BigNumber.from(4000)); i = i.add(BigNumber.from(100))) {
        let arr = [];
        for (let j = 0; j<100 && i.toNumber() + j < 4000; j++) {
            arr.push(cidObjArr[0].Hash)
            cidObjArr.shift()
        }
        // console.log(arr.length, arr[0], arr[arr.length-1])
        console.log(await fbCollection.connect(accounts[0]).addUncommonCids(i, arr, {maxPriorityFeePerGas: priorityFee, maxFeePerGas: BigNumber.from("800000000")}))
        arr = []
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("--------------------")

    for (let i = BigNumber.from(4000); i.lt(BigNumber.from(10000)); i = i.add(BigNumber.from(100))) {
        let arr = [];
        for (let j = 0; j<100 && i.toNumber() + j < 10000; j++) {
            arr.push(cidObjArr[0].Hash)
            cidObjArr.shift()
        }
        // console.log(arr.length, arr[0], arr[arr.length-1])
        console.log(await fbCollection.connect(accounts[0]).addCommonCids(i, arr, {maxPriorityFeePerGas: priorityFee, maxFeePerGas: BigNumber.from("800000000")}))
        arr = []
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return
    //
    // // Approve
    // if (shouldApprove) {
    //     console.log("approve:", await fbCollection
    //         .connect(accounts[0])
    //         .setApprovalForAll(exchange.address, true, {maxPriorityFeePerGas: priorityFee}));
    // }
    //
    // const step = 20;
    // for (let i = BigNumber.from(0); i.lt(BigNumber.from(1000)); i = i.add(BigNumber.from(step))) {
    //     const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
    //         accounts[0].getAddress(),
    //         i,
    //         BigNumber.from(step),
    //         4321,
    //         Array(step).fill("0x"),
    //         {maxPriorityFeePerGas: priorityFee}
    //     );
    //     console.log(i, tx)
    //
    //     const tx2 = await fbCollection.connect(accounts[0]).addCommonCids(
    //         i,
    //         getRandomElements(cidArr, step),
    //         {maxPriorityFeePerGas: priorityFee}
    //     );
    //     console.log(i, tx2);
    //
    //     let tokenIds = []
    //     for (let j = i; j.lt(i.add(step)); j = j.add(1)) {
    //         tokenIds.push(j);
    //     }
    //     const tx3 = await exchange.connect(accounts[0]).placeOrderBatch(
    //         fbCollection.address,
    //         tokenIds,
    //         BigNumber.from(1),
    //         zeroAddress,
    //         {maxPriorityFeePerGas: priorityFee}
    //     );
    //     console.log(i, tx3);
    //
    //     await new Promise(resolve => setTimeout(resolve, 10000));
    // }
    //
    // for (let i = BigNumber.from(6000); i.lt(BigNumber.from(7000)); i = i.add(BigNumber.from(step))) {
    //     const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
    //         accounts[0].getAddress(),
    //         i,
    //         BigNumber.from(step),
    //         4321,
    //         Array(step).fill("0x"),
    //         {maxPriorityFeePerGas: priorityFee}
    //     )
    //     console.log(i, tx)
    //
    //     const tx2 = await fbCollection.connect(accounts[0]).addUncommonCids(
    //         i,
    //         getRandomElements(cidArr, step),
    //         {maxPriorityFeePerGas: priorityFee}
    //     );
    //     console.log(i, tx2);
    //
    //     let tokenIds = []
    //     for (let j = i; j.lt(i.add(step)); j = j.add(1))
    //         tokenIds.push(j);
    //     const tx3 = await exchange.connect(accounts[0]).placeOrderBatch(
    //         fbCollection.address,
    //         tokenIds,
    //         BigNumber.from(1),
    //         zeroAddress,
    //         {maxPriorityFeePerGas: priorityFee}
    //     );
    //     console.log(i, tx3);
    //     await new Promise(resolve => setTimeout(resolve, 10000));
    // }
    //
    // for (let i = BigNumber.from(7000); i.lt(BigNumber.from(8000)); i = i.add(BigNumber.from(step))) {
    //     if (!i.eq(7000)) {
    //         const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
    //             accounts[0].getAddress(),
    //             i,
    //             BigNumber.from(step),
    //             4321,
    //             Array(step).fill("0x"),
    //             {maxPriorityFeePerGas: priorityFee}
    //         )
    //         console.log(i, tx)
    //
    //         const tx2 = await fbCollection.connect(accounts[0]).addPayedCids(
    //             i,
    //             getRandomElements(cidArr, step),
    //             {maxPriorityFeePerGas: priorityFee}
    //         );
    //         console.log(i, tx2);
    //     }
    //
    //     let tokenIds = []
    //     for (let j = i; j.lt(i.add(step)); j = j.add(1))
    //         tokenIds.push(j);
    //     const tx3 = await exchange.connect(accounts[0]).placeOrderBatch(
    //         fbCollection.address,
    //         tokenIds,
    //         BigNumber.from(10).pow(16), // 0.01
    //         zeroAddress,
    //         {maxPriorityFeePerGas: priorityFee}
    //     );
    //     console.log(i, tx3);
    //     await new Promise(resolve => setTimeout(resolve, 10000));
    // }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
