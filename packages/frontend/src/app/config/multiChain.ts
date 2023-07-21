interface Chain {
  /** ID in number form */
  id: number
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Currency used by chain */
  nativeCurrency: NativeCurrency
  /** Collection of RPC endpoints */
  rpcUrls: {
    [key: string]: RpcUrls
    default: RpcUrls
    public: RpcUrls
  }
  /** Collection of block explorers */
  blockExplorers?: {
    [key: string]: BlockExplorer
    default: BlockExplorer
  }
  /** Flag for test networks */
  testnet?: boolean
}

interface NativeCurrency {
  name: string
  /** 2-6 characters long */
  symbol: string
  decimals: number
}

interface RpcUrls {
  http: readonly string[]
  webSocket?: readonly string[]
}

interface BlockExplorer {
  name: string
  url: string
}

interface MultiChain {
  chain: Chain
  previewImg: string
  tokenImg: string
}
