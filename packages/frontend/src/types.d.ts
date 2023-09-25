import type React from 'react'

declare module '*.module.css' {
  type IClassNames = Record<string, string>
  const classNames: IClassNames
  export = classNames
}

declare global {
  interface ModelViewerProps
    extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
    > {
    alt?: string
    src?: string
    ar?: boolean
    poster?: string
  }

  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps
    }
  }
}
