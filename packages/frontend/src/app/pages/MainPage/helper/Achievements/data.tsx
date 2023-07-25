import AppOfTheMonthImg from '../../../../../assets/img/MainPage/achievements/app_of_the_month.svg'
import CointelegraphImg from '../../../../../assets/img/MainPage/achievements/cointelegraph_startup_program.svg'
import FileCoinGrantImg from '../../../../../assets/img/MainPage/achievements/filecoin_grant_receiver.svg'
import FVMEarlyBuilders from '../../../../../assets/img/MainPage/achievements/fvm_early_builders.svg'
import FVMMainnet from '../../../../../assets/img/MainPage/achievements/fvm_mainnet.svg'
import FMSSpace from '../../../../../assets/img/MainPage/achievements/fvm_space.svg'
import HackFS from '../../../../../assets/img/MainPage/achievements/hack_fs.svg'
import { AchievementItemProps } from '../../Blocks/Achievements'

export const AchievementsData: AchievementItemProps[] = [
  {
    img: AppOfTheMonthImg,
    title: (
      <span>{'App of the Month'}</span>
    ),
    description: 'Filecoin&IPFS ecosystem, July 2023',
    href: 'https://youtu.be/v_DPrsic7Pg?t=976',
  },
  {
    img: CointelegraphImg,
    title: (
      <span>
        {'Cointelegraph'}
        <br />
        {'Startup Program'}
      </span>
    ),
    href: 'https://cointelegraph.com/news/this-platforms-eft-standard-makes-trading-downloadable-encrypted-content-accessible',
  },
  {
    img: FileCoinGrantImg,
    title: (
      <span>{'Filecoin Grant receiver'}</span>
    ),
    href: 'https://github.com/filecoin-project/devgrants/issues/1288',
  },
  {
    img: HackFS,
    title: (
      <span>
        {'HackFS 2023 Hackathon'}
      </span>
    ),
    description: '“FVM - Runner Up” prize winner',
    href: 'https://ethglobal.com/showcase/filebunnies-zmdpw',
  },
  {
    img: FMSSpace,
    title: (
      <span>{'FVM SPACE WARP Hackathon'}</span>
    ),
    description: 'Jetpacks Prize “Best use of FVM”',
    href: 'https://ethglobal.com/showcase/filemarket-hu00j',
  },
  {
    img: FVMMainnet,
    title: (
      <span>{'FVM Mainnet'}</span>
    ),
    description: 'Mainnet cohort Alumni',
    href: 'https://filecoin.io/blog/posts/filecoin-virtual-machine-fvm-builder-cohort-launches-to-mainnet/',
  },
  {
    img: FVMEarlyBuilders,
    title: (
      <span>{'FVM Early builders'}</span>
    ),
    description: 'F1 cohort Alumni',
  },
]
