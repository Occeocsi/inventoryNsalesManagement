"use client"
import { useEffect, useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { ScanLine } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onError?: (error: string) => void
  inputDelay?: number
  minLength?: number
}

export function BarcodeScanner({ onScan, onError, inputDelay = 30, minLength = 3 }: BarcodeScannerProps) {
  const [isListening, setIsListening] = useState(true)
  const [lastScanned, setLastScanned] = useState("")
  const [status, setStatus] = useState<"ready" | "scanning" | "error">("ready")
  const barcodeBuffer = useRef("")
  const lastKeyTime = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Function to handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if we're listening for scans
      if (!isListening) return

      const currentTime = new Date().getTime()

      // If this is a rapid succession of keys (typical of a scanner)
      if (lastKeyTime.current && currentTime - lastKeyTime.current < inputDelay) {
        // Prevent default to avoid typing in input fields
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          // Don't prevent special key combinations
          e.preventDefault()
        }

        // Add to buffer if it's a valid character
        if (e.key.length === 1) {
          barcodeBuffer.current += e.key
          setStatus("scanning")
        } else if (e.key === "Enter") {
          // Enter key typically signals end of barcode scan
          e.preventDefault()

          // Process the barcode if it meets minimum length
          if (barcodeBuffer.current.length >= minLength) {
            const barcode = barcodeBuffer.current
            setLastScanned(barcode)
            onScan(barcode)
            setStatus("ready")
          } else if (barcodeBuffer.current.length > 0) {
            setStatus("error")
            if (onError) onError("Barcode too short")
          }

          // Reset buffer
          barcodeBuffer.current = ""
        }
      } else {
        // This is the first key or it's been a while since the last key
        // Start a new potential barcode
        barcodeBuffer.current = e.key.length === 1 ? e.key : ""
        setStatus("scanning")
      }

      // Update the last key time
      lastKeyTime.current = currentTime

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a timeout to reset if no more keys are pressed
      timeoutRef.current = setTimeout(() => {
        if (barcodeBuffer.current.length > 0 && barcodeBuffer.current.length >= minLength) {
          // If we have content and no Enter key was pressed, still process it
          const barcode = barcodeBuffer.current
          setLastScanned(barcode)
          onScan(barcode)
        }
        barcodeBuffer.current = ""
        setStatus("ready")
      }, 100) // Wait 100ms after last keystroke
    }

    // Add event listener
    window.addEventListener("keydown", handleKeyDown)

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening, inputDelay, minLength, onScan, onError])

  return (
    <div className="flex items-center gap-2">
      {status === "ready" ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
          <ScanLine className="h-3.5 w-3.5" />
          Scanner Ready
        </Badge>
      ) : status === "scanning" ? (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Scanning...
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          Error
        </Badge>
      )}

      {lastScanned && (
        <span className="text-sm text-gray-500">
          Last scanned: <span className="font-mono">{lastScanned}</span>
        </span>
      )}
    </div>
  )
}
