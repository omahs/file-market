// eslint-disable-next-line
import filemarket_logomark_black_png from '/logos/filemarket_logomark-black.png'
// eslint-disable-next-line
import filemarket_logomark_black_svg from '/logos/filemarket_logomark-black.svg'
// eslint-disable-next-line
import filemarket_logomark_blue_png from '/logos/filemarket_logomark-blue.png'
// eslint-disable-next-line
import filemarket_logomark_blue_svg from '/logos/filemarket_logomark-blue.svg'
// eslint-disable-next-line
import filemarket_logomark_green_png from '/logos/filemarket_logomark-green.png'
// eslint-disable-next-line
import filemarket_logomark_green_svg from '/logos/filemarket_logomark-green.svg'
// eslint-disable-next-line
import filemarket_logomark_white_png from '/logos/filemarket_logomark-white.png'
// eslint-disable-next-line
import filemarket_logomark_white_svg from '/logos/filemarket_logomark-white.svg'
// eslint-disable-next-line
import filemarket_logo_horizontal_black_png from '/logos/filemarket_logotype-horizontal-black.png'
// eslint-disable-next-line
import filemarket_logo_horizontal_black_svg from '/logos/filemarket_logotype-horizontal-black.svg'
// eslint-disable-next-line
import filemarket_logo_horizontal_blue_png from '/logos/filemarket_logotype-horizontal-blue.png'
// eslint-disable-next-line
import filemarket_logo_horizontal_blue_svg from '/logos/filemarket_logotype-horizontal-blue.svg'
// eslint-disable-next-line
import filemarket_logo_horizontal_green_png from '/logos/filemarket_logotype-horizontal-green.png'
// eslint-disable-next-line
import filemarket_logo_horizontal_green_svg from '/logos/filemarket_logotype-horizontal-green.svg'
// eslint-disable-next-line
import filemarket_logo_horizontal_white_png from '/logos/filemarket_logotype-horizontal-white.png'
// eslint-disable-next-line
import filemarket_logo_horizontal_white_svg from '/logos/filemarket_logotype-horizontal-white.svg'
// eslint-disable-next-line
import filemarket_logo_vertical_black_png from '/logos/filemarket_logotype-vertical-black.png'
// eslint-disable-next-line
import filemarket_logo_vertical_black_svg from '/logos/filemarket_logotype-vertical-black.svg'
// eslint-disable-next-line
import filemarket_logo_vertical_blue_png from '/logos/filemarket_logotype-vertical-blue.png'
// eslint-disable-next-line
import filemarket_logo_vertical_blue_svg from '/logos/filemarket_logotype-vertical-blue.svg'
// eslint-disable-next-line
import filemarket_logo_vertical_green_png from '/logos/filemarket_logotype-vertical-green.png'
// eslint-disable-next-line
import filemarket_logo_vertical_green_svg from '/logos/filemarket_logotype-vertical-green.svg'
// eslint-disable-next-line
import filemarket_logo_vertical_white_png from '/logos/filemarket_logotype-vertical-white.png'
// eslint-disable-next-line
import filemarket_logo_vertical_white_svg from '/logos/filemarket_logotype-vertical-white.svg'
// eslint-disable-next-line
import filemarket_wordmark_black_png from '/logos/filemarket_wordmark-black.png'
// eslint-disable-next-line
import filemarket_wordmark_black_svg from '/logos/filemarket_wordmark-black.svg'
// eslint-disable-next-line
import filemarket_wordmark_blue_png from '/logos/filemarket_wordmark-blue.png'
// eslint-disable-next-line
import filemarket_wordmark_blue_svg from '/logos/filemarket_wordmark-blue.svg'
// eslint-disable-next-line
import filemarket_wordmark_green_png from '/logos/filemarket_wordmark-green.png'
// eslint-disable-next-line
import filemarket_wordmark_green_svg from '/logos/filemarket_wordmark-green.svg'
// eslint-disable-next-line
import filemarket_wordmark_white_png from '/logos/filemarket_wordmark-white.png'
// eslint-disable-next-line
import filemarket_wordmark_white_svg from '/logos/filemarket_wordmark-white.svg'

interface IAssets {
  logoHorizontal: {
    blue: string
    dark: string
    green: string
    light: string
  }
  logoVertical: {
    blue: string
    dark: string
    green: string
    light: string
  }
  logomark: {
    blue: string
    dark: string
    green: string
    light: string
  }
  wordmark: {
    blue: string
    dark: string
    green: string
    light: string
  }
}

export const SVG_ASSETS: IAssets = {
  logoHorizontal: {
    blue: filemarket_logo_horizontal_blue_svg,
    dark: filemarket_logo_horizontal_black_svg,
    green: filemarket_logo_horizontal_green_svg,
    light: filemarket_logo_horizontal_white_svg,
  },
  logoVertical: {
    blue: filemarket_logo_vertical_blue_svg,
    dark: filemarket_logo_vertical_black_svg,
    green: filemarket_logo_vertical_green_svg,
    light: filemarket_logo_vertical_white_svg,
  },
  logomark: {
    blue: filemarket_logomark_blue_svg,
    dark: filemarket_logomark_black_svg,
    green: filemarket_logomark_green_svg,
    light: filemarket_logomark_white_svg,
  },
  wordmark: {
    blue: filemarket_wordmark_blue_svg,
    dark: filemarket_wordmark_black_svg,
    green: filemarket_wordmark_green_svg,
    light: filemarket_wordmark_white_svg,
  },
}

export const PNG_ASSETS: IAssets = {
  logoHorizontal: {
    blue: filemarket_logo_horizontal_blue_png,
    dark: filemarket_logo_horizontal_black_png,
    green: filemarket_logo_horizontal_green_png,
    light: filemarket_logo_horizontal_white_png,
  },
  logoVertical: {
    blue: filemarket_logo_vertical_blue_png,
    dark: filemarket_logo_vertical_black_png,
    green: filemarket_logo_vertical_green_png,
    light: filemarket_logo_vertical_white_png,
  },
  logomark: {
    blue: filemarket_logomark_blue_png,
    dark: filemarket_logomark_black_png,
    green: filemarket_logomark_green_png,
    light: filemarket_logomark_white_png,
  },
  wordmark: {
    blue: filemarket_wordmark_blue_png,
    dark: filemarket_wordmark_black_png,
    green: filemarket_wordmark_green_png,
    light: filemarket_wordmark_white_png,
  },
}
