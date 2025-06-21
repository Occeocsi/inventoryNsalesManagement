"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, QrCode } from "lucide-react"
import Image from "next/image"

interface QrPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  onPaymentComplete: () => void
  onCancel: () => void
}

export function QrPaymentModal({ open, onOpenChange, amount, onPaymentComplete, onCancel }: QrPaymentModalProps) {
  const [status, setStatus] = useState<"pending" | "processing" | "success" | "error">("pending")
  const [timer, setTimer] = useState(180) // 3 minutes countdown

  useEffect(() => {
    let interval: NodeJS.Timeout
    let timeout: NodeJS.Timeout

    if (open && status === "pending") {
      // Countdown timer
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            onCancel()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Simulate payment processing after a random time (5-15 seconds)
      const randomTime = Math.floor(Math.random() * 10000) + 5000
      timeout = setTimeout(() => {
        setStatus("processing")

        // Simulate payment completion after 3 seconds
        setTimeout(() => {
          setStatus("success")
          // Wait 2 seconds before closing modal and proceeding
          setTimeout(() => {
            onPaymentComplete()
          }, 2000)
        }, 3000)
      }, randomTime)
    }

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [open, status, onPaymentComplete, onCancel])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Payment</DialogTitle>
          <DialogDescription>Scan this QR code with your banking app to pay RM{amount.toFixed(2)}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          {status === "pending" && (
            <>
              <div className="relative border-4 border-pink-500 rounded-lg p-2 bg-white">
                <Image
                  src="/images/malaysia-national-qr.png"
                  alt="QR"
                  width={250}
                  height={250}
                  className="mx-auto"
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-2xl font-bold">RM{amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  Expires in <span className="font-medium text-pink-600">{formatTime(timer)}</span>
                </p>
              </div>

              <div className="text-center text-sm text-gray-500 max-w-xs">
                <p>Open your banking app, scan the QR code, and confirm the payment</p>
              </div>
            </>
          )}

          {status === "processing" && (
            <div className="text-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-pink-600 mx-auto" />
              <p className="text-lg font-medium">Processing your payment...</p>
              <p className="text-sm text-gray-500">Please do not close this window</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-700">Payment Successful!</p>
              <p className="text-sm text-gray-500">Thank you for your payment</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={status === "processing" || status === "success"}>
            Cancel
          </Button>
          <Button variant="outline" className="flex items-center gap-2" disabled={true}>
            <QrCode className="h-4 w-4" />
            Malaysia National QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
