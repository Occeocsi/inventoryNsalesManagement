"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  sku: string
  barcode?: string
  category: string
  quantity: number
  price: number
  minStock: number
  supplier: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  sku: string
}

export interface Sale {
  id: string
  date: string
  customer: string
  items: SaleItem[]
  total: number
  status: "completed" | "pending" | "cancelled"
}

export interface SaleItem {
  productName: string
  quantity: number
  price: number
}

// Updated initial product data with barcodes
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-001",
    barcode: "9551084000920",
    category: "Electronics",
    quantity: 45,
    price: 79.99,
    minStock: 10,
    supplier: "TechCorp",
  },
  {
    id: "2",
    name: "Coffee Mug",
    sku: "CM-002",
    barcode: "8901030895562",
    category: "Kitchen",
    quantity: 8,
    price: 9.99,
    minStock: 15,
    supplier: "HomeGoods",
  },
  {
    id: "3",
    name: "Notebook",
    sku: "NB-003",
    barcode: "4902505116049",
    category: "Office",
    quantity: 120,
    price: 5.99,
    minStock: 25,
    supplier: "OfficeMax",
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    sku: "BS-004",
    barcode: "6901443200504",
    category: "Electronics",
    quantity: 32,
    price: 79.99,
    minStock: 8,
    supplier: "TechCorp",
  },
  {
    id: "5",
    name: "Desk Lamp",
    sku: "DL-005",
    barcode: "8712581549213",
    category: "Home",
    quantity: 18,
    price: 34.99,
    minStock: 5,
    supplier: "HomeGoods",
  },
]

const INITIAL_SALES: Sale[] = [
  {
    id: "S001",
    date: "2024-01-15",
    customer: "John Doe",
    items: [
      { productName: "Wireless Headphones", quantity: 2, price: 79.99 },
      { productName: "Coffee Mug", quantity: 1, price: 9.99 },
    ],
    total: 169.97,
    status: "completed",
  },
  {
    id: "S002",
    date: "2024-01-14",
    customer: "Jane Smith",
    items: [{ productName: "Notebook", quantity: 5, price: 5.99 }],
    total: 29.95,
    status: "completed",
  },
]

interface DataStoreContextType {
  products: Product[]
  sales: Sale[]
  updateProduct: (product: Product) => void
  addProduct: (product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addSale: (sale: Sale) => void
  updateProductQuantity: (id: string, quantityChange: number) => void
  findProductBySku: (sku: string) => Product | undefined
  findProductByBarcode: (barcode: string) => Product | undefined
  resetData: () => void // Add reset function for debugging
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to migrate old data structure to include barcodes
  const migrateProductData = (savedProducts: Product[]): Product[] => {
    return savedProducts.map((product, index) => {
      // If product doesn't have barcode, add it from initial data
      if (!product.barcode && INITIAL_PRODUCTS[index]) {
        return {
          ...product,
          barcode: INITIAL_PRODUCTS[index].barcode,
        }
      }
      return product
    })
  }

  // Load data from localStorage if available
  useEffect(() => {
    if (!isClient) return

    try {
      const savedProducts = localStorage.getItem("products")
      const savedSales = localStorage.getItem("sales")

      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        // Migrate data to ensure barcodes are present
        const migratedProducts = migrateProductData(parsedProducts)
        setProducts(migratedProducts)
        console.log("Loaded products from localStorage:", migratedProducts)
      } else {
        console.log("No saved products found, using initial data")
        setProducts(INITIAL_PRODUCTS)
      }

      if (savedSales) {
        const parsedSales = JSON.parse(savedSales)
        setSales(parsedSales)
        console.log("Loaded sales from localStorage:", parsedSales)
      } else {
        console.log("No saved sales found, using initial data")
        setSales(INITIAL_SALES)
      }

      setIsDataLoaded(true)
    } catch (error) {
      console.error("Error loading saved data:", error)
      // If there's an error, use initial data
      setProducts(INITIAL_PRODUCTS)
      setSales(INITIAL_SALES)
      setIsDataLoaded(true)
    }
  }, [isClient])

  // Save data to localStorage when it changes (only after initial load)
  useEffect(() => {
    if (!isClient || !isDataLoaded) return

    try {
      localStorage.setItem("products", JSON.stringify(products))
      console.log("Saved products to localStorage:", products)
    } catch (error) {
      console.error("Error saving products:", error)
    }
  }, [products, isClient, isDataLoaded])

  useEffect(() => {
    if (!isClient || !isDataLoaded) return

    try {
      localStorage.setItem("sales", JSON.stringify(sales))
      console.log("Saved sales to localStorage:", sales)
    } catch (error) {
      console.error("Error saving sales:", error)
    }
  }, [sales, isClient, isDataLoaded])

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const addProduct = (newProduct: Partial<Product>) => {
    if (newProduct.name && newProduct.sku && newProduct.price !== undefined) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        sku: newProduct.sku,
        barcode: newProduct.barcode,
        category: newProduct.category || "General",
        quantity: newProduct.quantity || 0,
        price: newProduct.price,
        minStock: newProduct.minStock || 10,
        supplier: newProduct.supplier || "Unknown",
      }
      setProducts([...products, product])
    }
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const addSale = (sale: Sale) => {
    setSales([...sales, sale])
  }

  const updateProductQuantity = (id: string, quantityChange: number) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const newQuantity = Math.max(0, p.quantity + quantityChange)
          console.log(`Updated product ${p.name} quantity: ${p.quantity} -> ${newQuantity}`)
          return { ...p, quantity: newQuantity }
        }
        return p
      }),
    )
  }

  const findProductBySku = (sku: string) => {
    const product = products.find((p) => p.sku.toLowerCase() === sku.toLowerCase())
    console.log(`Finding product by SKU "${sku}":`, product)
    return product
  }

  const findProductByBarcode = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode)
    console.log(`Finding product by barcode "${barcode}":`, product)
    console.log(
      "Available products with barcodes:",
      products.map((p) => ({ name: p.name, barcode: p.barcode })),
    )
    return product
  }

  const resetData = () => {
    console.log("Resetting data to initial state")
    localStorage.removeItem("products")
    localStorage.removeItem("sales")
    setProducts(INITIAL_PRODUCTS)
    setSales(INITIAL_SALES)
  }

  // Don't render children until data is loaded
  if (!isClient || !isDataLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <DataStoreContext.Provider
      value={{
        products,
        sales,
        updateProduct,
        addProduct,
        deleteProduct,
        addSale,
        updateProductQuantity,
        findProductBySku,
        findProductByBarcode,
        resetData,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  )
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
