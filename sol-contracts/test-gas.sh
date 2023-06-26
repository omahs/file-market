#!/usr/bin/env bash

set -e

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 0 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 1000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 1500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 2000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 2500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 3000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 3500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 4000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 4500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 5000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-common-cids -start 5500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-uncommon-cids -start 6000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-uncommon-cids -start 6500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-cids -start 7000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-cids -start 7500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-cids -start 8000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-cids -start 8500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-cids -start 9000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind add-cids -start 9500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 0 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 1000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 1500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 2000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 2500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 3000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 3500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 4000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 4500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 5000 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 5500 -count 500 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 6000 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 6400 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 6800 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 7200 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 7600 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 8000 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 8400 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 8800 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 9200 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind mint-batch -start 9600 -count 400 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind approve -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 -exchange 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind place-orders -start 0 -count 50 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 -exchange 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind place-orders -start 50 -count 50 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 -exchange 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind place-orders -start 100 -count 50 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 -exchange 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind place-orders -start 150 -count 50 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 -exchange 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind place-orders -start 200 -count 50 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 -exchange 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

HARDHAT_NETWORK=localhost ts-node scripts/test-gas.ts -kind place-orders -start 250 -count 50 -collection 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 -exchange 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
