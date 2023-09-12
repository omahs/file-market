FileMarket is a next-gen file-sharing platform with on-chain programmable access and incentives, turning digital wallets into 'My Documents' folder, ensuring privacy, lifelong storage via decentralization, and total control over monetizable content through tokenized paywalls.

Here is our tech article about EFT on Medium and we need your claps (may the force be with you): 
[Tech article](https://medium.com/filemarket-xyz/how-to-attach-an-encrypted-file-to-your-nft-7d6232fd6d34)

> Project Description

FileMarket pioneers a new generation of file-sharing - redefining it with web3 technology. Decentralization for privacy and lifelong storage, tokenized paywalls for total user control of monetizable content. 

As a tokenized paywall file-sharing solution, it empowers users to transform their digital wallets into a "My Documents" folder, merging the convenience of cloud storage with the innovative potential of blockchain.

> How it's Made

We use symmetric encryption of the file uploaded to Filecoin at the time of mint NFT. We use Lighthouse storage service to upload files. For minting and other functions we developed smart contracts on FEVM.

When someone buys an NFT, he freezes the amount in tokens for payment on the smart contract and sends a Public Key to the seller. The seller in a separate transaction using asymmetric encryption sends the encrypted file decryption key to the buyer.

Using Lighthouse storage, the buyer downloads the decrypted file from the Filecoin decentralized storage.

In the background, the FileMarket backend listens to all the transactions for the fraud reports. If the encrypted file received by the buyer does not match the original sample or cannot be decrypted, the buyer can send a report to the fraud.

Otherwise, if the buyer is satisfied, he completes the transaction by unfreezing the reserved funds and transferring them to the seller in a new transaction.

The encrypted file is now available to the new NFT owner and unavailable to the old one.

The NFT owner can initiate its own transfer to an address he knows and then the recipient must accept the transaction and the transaction enters a similar cycle to a sale with the public key being transferred to the seller and the decryption key being transferred back to the buyer.
