import { rootStore } from '../../stores/RootStore'

export function copyToClipboard(text?: string) {
  if (!text) return
  if (!navigator.clipboard.writeText) {
    prompt('Copy to clipboard: Ctrl+C, Enter', text)

    return
  }
  navigator.clipboard.writeText(text).then(
    () => {
      rootStore.dialogStore.showSuccess('Text has copied')
    },
    () => {
      prompt('Copy to clipboard: Ctrl+C, Enter', text)
    },
  )
}
