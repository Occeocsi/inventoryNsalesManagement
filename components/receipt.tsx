"use client"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Printer, Download, CheckCircle } from "lucide-react"

interface ReceiptItem {
  name: string
  sku: string
  quantity: number
  price: number
  total: number
}

interface ReceiptProps {
  transactionId: string
  date: string
  time: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: "qr" | "card" | "cash"
  customerName?: string
  onNewTransaction: () => void
}

export function Receipt({
  transactionId,
  date,
  time,
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
  customerName,
  onNewTransaction,
}: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML
      const originalContent = document.body.innerHTML

      document.body.innerHTML = `
        <html>
          <head>
            <title>Receipt - ${transactionId}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                margin: 0; 
                padding: 20px; 
                font-size: 12px;
                line-height: 1.4;
              }
              .receipt-container { 
                max-width: 300px; 
                margin: 0 auto; 
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .text-lg { font-size: 14px; }
              .text-sm { font-size: 10px; }
              .text-xs { font-size: 9px; }
              .mb-2 { margin-bottom: 8px; }
              .mb-4 { margin-bottom: 16px; }
              .py-2 { padding: 8px 0; }
              .border-t { border-top: 1px dashed #000; }
              .border-b { border-bottom: 1px dashed #000; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .space-y-1 > * + * { margin-top: 4px; }
              @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              ${printContent}
            </div>
          </body>
        </html>
      `

      window.print()
      document.body.innerHTML = originalContent
      window.location.reload() // Reload to restore React functionality
    }
  }

  const handleDownload = () => {
    if (receiptRef.current) {
      const receiptContent = receiptRef.current.innerText
      const blob = new Blob([receiptContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `receipt-${transactionId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900">Payment Successful!</h1>
              <p className="text-green-700 mt-2">Your transaction has been completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt */}
      <Card>
        <CardContent className="p-6">
          <div ref={receiptRef} className="receipt-container max-w-sm mx-auto">
            {/* Store Header */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold">SUMMY SERVICE STORE</h2>
              <p className="text-sm">10 Jalan Pauh Putra</p>
              <p className="text-sm">06200 Arau, Perlis</p>
              <p className="text-sm">Tel: 05-7921111</p>
            </div>

            <Separator className="my-4" />

            {/* Transaction Info */}
            <div className="space-y-1 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-bold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{time}</span>
              </div>
              {customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{customerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="capitalize">{paymentMethod === "qr" ? "Malaysia National QR" : paymentMethod}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Items */}
            <div className="space-y-2 mb-4">
              {items.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>SKU: {item.sku}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      {item.quantity} x RM{item.price.toFixed(2)}
                    </span>
                    <span className="font-medium">RM{item.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>RM{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%):</span>
                <span>RM{tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>RM{total.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Footer */}
            <div className="text-center text-xs space-y-1">
              <p>Thank you for shopping with us!</p>
              <p>Please keep this receipt for your records</p>
              <p>Return policy: 30 days with receipt</p>
              <p className="mt-4">Generated on {new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 justify-center">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button onClick={onNewTransaction} className="bg-green-600 hover:bg-green-700">
              New Transaction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
