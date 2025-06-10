"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Eye } from "lucide-react"
import { useDataStore, type SaleItem } from "@/lib/data-store"

export function SalesTab() {
  const { sales, products, addSale, updateProductQuantity } = useDataStore()
  const [newSale, setNewSale] = useState<{
    customer: string
    items: SaleItem[]
  }>({
    customer: "",
    items: [],
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSales = sales.filter(
    (sale) =>
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addItemToSale = (productName: string, quantity: number) => {
    const product = products.find((p) => p.name === productName)
    if (product && quantity > 0) {
      const newItem: SaleItem = {
        productName,
        quantity,
        price: product.price,
      }
      setNewSale({
        ...newSale,
        items: [...newSale.items, newItem],
      })
    }
  }

  const calculateTotal = (items: SaleItem[]) => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0)
  }

  const createSale = () => {
    if (newSale.customer && newSale.items.length > 0) {
      const total = calculateTotal(newSale.items)
      const sale = {
        id: `S${String(sales.length + 1).padStart(3, "0")}`,
        date: new Date().toISOString().split("T")[0],
        customer: newSale.customer,
        items: newSale.items,
        total,
        status: "completed" as const,
      }

      // Update product quantities
      newSale.items.forEach((item) => {
        const product = products.find((p) => p.name === item.productName)
        if (product) {
          updateProductQuantity(product.id, -item.quantity)
        }
      })

      addSale(sale)
      setNewSale({ customer: "", items: [] })
      setIsAddDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sale</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  value={newSale.customer}
                  onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label>Add Items</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    onValueChange={(value) => {
                      const [productName, quantity] = value.split("|")
                      addItemToSale(productName, Number.parseInt(quantity))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={`${product.name}|1`}>
                          {product.name} - ${product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newSale.items.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Sale Items</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newSale.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 text-right">
                      <strong>Total: ${calculateTotal(newSale.items).toFixed(2)}</strong>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={createSale} className="w-full">
                Create Sale
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">{sales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {sales.length > 0 ? (sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length).toFixed(2) : "0.00"}
            </div>
            <p className="text-sm text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total units</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.items.length} items</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        sale.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : sale.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
