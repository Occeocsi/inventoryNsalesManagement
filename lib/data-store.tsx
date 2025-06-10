"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  sku: string
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

// Initial product data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-001",
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
    category: "Home",
    quantity: 18,
    price: 34.99,
    minStock: 5,
    supplier: "HomeGoods",
  },
]

// Initial sales data
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
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load data from localStorage if available
  useEffect(() => {
    if (!isClient) return

    try {
      const savedProducts = localStorage.getItem("products")
      const savedSales = localStorage.getItem("sales")

      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      }

      if (savedSales) {
        setSales(JSON.parse(savedSales))
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [isClient])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!isClient) return

    try {
      localStorage.setItem("products", JSON.stringify(products))
      localStorage.setItem("sales", JSON.stringify(sales))
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }, [products, sales, isClient])

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const addProduct = (newProduct: Partial<Product>) => {
    if (newProduct.name && newProduct.sku && newProduct.price !== undefined) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        sku: newProduct.sku,
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
          return { ...p, quantity: Math.max(0, p.quantity + quantityChange) }
        }
        return p
      }),
    )
  }

  const findProductBySku = (sku: string) => {
    return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase())
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
