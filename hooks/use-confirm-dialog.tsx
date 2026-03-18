'use client'

import { useCallback, useRef, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ConfirmDialogProps = {
  title?: React.ReactNode
  description?: React.ReactNode
}

/**
 * 確認ダイアログを Promise ベースで制御するカスタムフック。
 * `confirm()` を呼ぶとダイアログが表示され、ユーザーの選択結果（true/false）で resolve される。
 */
export const useConfirmDialog = ({
  title = 'Caution',
  description = 'Are you sure you want to do this?',
}: ConfirmDialogProps) => {
  const [open, setOpen] = useState(false)
  // ダイアログの resolve 関数を保持する ref（confirm() の呼び出し元に結果を返すため）
  const resolverRef = useRef<((value: boolean) => void) | null>(null)
  // 進行中の Promise を保持し、二重呼び出し時は同じ Promise を返す
  const promiseRef = useRef<Promise<boolean> | null>(null)

  // ダイアログを閉じて Promise を解決する共通処理
  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result)
    resolverRef.current = null
    promiseRef.current = null
    setOpen(false)
  }, [])

  // ダイアログを開き、ユーザーの選択を待つ Promise を返す
  const confirm = useCallback(() => {
    // すでにダイアログが開いている場合は既存の Promise を返す
    if (promiseRef.current) return promiseRef.current

    setOpen(true)

    const p = new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })

    promiseRef.current = p
    return p
  }, [])

  // ダイアログ本体のコンポーネント（JSX を返すので useCallback でメモ化）

  const ConfirmDialog = useCallback(
    () => (
      // ダイアログ外クリック時はキャンセル（false）として閉じる
      <AlertDialog open={open} onOpenChange={(v) => !v && close(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => close(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => close(true)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [open, close, title, description],
  )

  return { confirm, ConfirmDialog }
}
