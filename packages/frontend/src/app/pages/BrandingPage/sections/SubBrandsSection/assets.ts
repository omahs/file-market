// eslint-disable-next-line
import eft_logo_color_png from '/sub-brands/eft_logo_color.png'
// eslint-disable-next-line
import eft_logo_color_svg from '/sub-brands/eft_logo_color.svg'
// eslint-disable-next-line
import eft_logo_dark_png from '/sub-brands/eft_logo_dark.png'
// eslint-disable-next-line
import eft_logo_dark_svg from '/sub-brands/eft_logo_dark.svg'
// eslint-disable-next-line
import eft_logo_light_png from '/sub-brands/eft_logo_light.png'
// eslint-disable-next-line
import eft_logo_light_svg from '/sub-brands/eft_logo_light.svg'
// eslint-disable-next-line
import file_bunnies_logomark_color_png from '/sub-brands/file-bunnies_logomark_color.png'
// eslint-disable-next-line
import file_bunnies_logomark_color_svg from '/sub-brands/file-bunnies_logomark_color.svg'
// eslint-disable-next-line
import file_bunnies_logomark_dark_png from '/sub-brands/file-bunnies_logomark_dark.png'
// eslint-disable-next-line
import file_bunnies_logomark_dark_svg from '/sub-brands/file-bunnies_logomark_dark.svg'
// eslint-disable-next-line
import file_bunnies_logomark_light_png from '/sub-brands/file-bunnies_logomark_light.png'
// eslint-disable-next-line
import file_bunnies_logomark_light_svg from '/sub-brands/file-bunnies_logomark_light.svg'
// eslint-disable-next-line
import file_bunnies_logotype_color_png from '/sub-brands/file-bunnies_logotype_color.png'
// eslint-disable-next-line
import file_bunnies_logotype_color_svg from '/sub-brands/file-bunnies_logotype_color.svg'
// eslint-disable-next-line
import file_bunnies_logotype_dark_png from '/sub-brands/file-bunnies_logotype_dark.png'
// eslint-disable-next-line
import file_bunnies_logotype_dark_svg from '/sub-brands/file-bunnies_logotype_dark.svg'
// eslint-disable-next-line
import file_bunnies_logotype_light_png from '/sub-brands/file-bunnies_logotype_light.png'
// eslint-disable-next-line
import file_bunnies_logotype_light_svg from '/sub-brands/file-bunnies_logotype_light.svg'
// eslint-disable-next-line
import file_wallet_logomark_blue_png from '/sub-brands/file-wallet_logomark_blue.png'
// eslint-disable-next-line
import file_wallet_logomark_blue_svg from '/sub-brands/file-wallet_logomark_blue.svg'
// eslint-disable-next-line
import file_wallet_logomark_dark_png from '/sub-brands/file-wallet_logomark_dark.png'
// eslint-disable-next-line
import file_wallet_logomark_dark_svg from '/sub-brands/file-wallet_logomark_dark.svg'
// eslint-disable-next-line
import file_wallet_logomark_light_png from '/sub-brands/file-wallet_logomark_light.png'
// eslint-disable-next-line
import file_wallet_logomark_light_svg from '/sub-brands/file-wallet_logomark_light.svg'
// eslint-disable-next-line
import file_wallet_logotype_blue_png from '/sub-brands/file-wallet_logotype_blue.png'
// eslint-disable-next-line
import file_wallet_logotype_blue_svg from '/sub-brands/file-wallet_logotype_blue.svg'
// eslint-disable-next-line
import file_wallet_logotype_dark_png from '/sub-brands/file-wallet_logotype_dark.png'
// eslint-disable-next-line
import file_wallet_logotype_dark_svg from '/sub-brands/file-wallet_logotype_dark.svg'
// eslint-disable-next-line
import file_wallet_logotype_light_png from '/sub-brands/file-wallet_logotype_light.png'
// eslint-disable-next-line
import file_wallet_logotype_light_svg from '/sub-brands/file-wallet_logotype_light.svg'

interface ISubBrands {
  eft: {
    color: string
    dark: string
    light: string
  }
  fileBunniesLogomark: {
    color: string
    dark: string
    light: string
  }
  fileBunniesLogotype: {
    color: string
    dark: string
    light: string
  }
  fileWalletLogomark: {
    color: string
    dark: string
    light: string
  }
  fileWalletLogotype: {
    color: string
    dark: string
    light: string
  }
}

export const SVG_SUB_BRANDS: ISubBrands = {
  eft: {
    color: eft_logo_color_svg,
    dark: eft_logo_dark_svg,
    light: eft_logo_light_svg,
  },
  fileBunniesLogomark: {
    color: file_bunnies_logomark_color_svg,
    dark: file_bunnies_logomark_dark_svg,
    light: file_bunnies_logomark_light_svg,
  },
  fileBunniesLogotype: {
    color: file_bunnies_logotype_color_svg,
    dark: file_bunnies_logotype_dark_svg,
    light: file_bunnies_logotype_light_svg,
  },
  fileWalletLogomark: {
    color: file_wallet_logomark_blue_svg,
    dark: file_wallet_logomark_dark_svg,
    light: file_wallet_logomark_light_svg,
  },
  fileWalletLogotype: {
    color: file_wallet_logotype_blue_svg,
    dark: file_wallet_logotype_dark_svg,
    light: file_wallet_logotype_light_svg,
  },
}

export const PNG_SUB_BRANDS: ISubBrands = {
  eft: {
    color: eft_logo_color_png,
    dark: eft_logo_dark_png,
    light: eft_logo_light_png,
  },
  fileBunniesLogomark: {
    color: file_bunnies_logomark_color_png,
    dark: file_bunnies_logomark_dark_png,
    light: file_bunnies_logomark_light_png,
  },
  fileBunniesLogotype: {
    color: file_bunnies_logotype_color_png,
    dark: file_bunnies_logotype_dark_png,
    light: file_bunnies_logotype_light_png,
  },
  fileWalletLogomark: {
    color: file_wallet_logomark_blue_png,
    dark: file_wallet_logomark_dark_png,
    light: file_wallet_logomark_light_png,
  },
  fileWalletLogotype: {
    color: file_wallet_logotype_blue_png,
    dark: file_wallet_logotype_dark_png,
    light: file_wallet_logotype_light_png,
  },
}
