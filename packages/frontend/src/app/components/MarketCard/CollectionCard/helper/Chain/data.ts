import fillIcon from '../assets/FillIcon.png'

interface IChainDataField {
  icon: string
}

export type IChainData = Record<string, IChainDataField>

export const chainData: IChainData = {
  314: {
    icon: fillIcon,
  },
}
