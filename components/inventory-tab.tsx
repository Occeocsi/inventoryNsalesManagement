"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, AlertTriangle, Save, X } from "lucide-react"
import { useDataStore, type Product } from "@/lib/data-store"

export function InventoryTab() {
  const { products, addProduct, deleteProduct, updateProduct } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Product>>({})

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.sku && newProduct.price && newProduct.quantity !== undefined) {
      addProduct(newProduct)
      setNewProduct({})
      setIsAddDialogOpen(false)
    }
  }

  const startEditing = (product: Product) => {
    setEditingProduct(product.id)
    setEditValues(product)
  }

  const saveEdit = () => {
    if (editingProduct && editValues) {
      updateProduct(editValues as Product)
      setEditingProduct(null)
      setEditValues({})
    }
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditValues({})
  }

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity <= minStock) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
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
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newProduct.minStock || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.quantity, product.minStock)
                const isEditing = editingProduct === product.id

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {isEditing ? (
                        <Input
                          value={editValues.name || ""}
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        product.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.sku || ""}
                          onChange={(e) => setEditValues({ ...editValues, sku: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        product.sku
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.category || ""}
                          onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        product.category
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.quantity || ""}
                            onChange={(e) =>
                              setEditValues({ ...editValues, quantity: Number.parseInt(e.target.value) })
                            }
                            className="w-20"
                          />
                        ) : (
                          <>
                            {product.quantity}
                            {product.quantity <= product.minStock && (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editValues.price || ""}
                          onChange={(e) => setEditValues({ ...editValues, price: Number.parseFloat(e.target.value) })}
                          className="w-20"
                        />
                      ) : (
                        `RM${product.price.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.supplier || ""}
                          onChange={(e) => setEditValues({ ...editValues, supplier: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        product.supplier
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Button variant="ghost" size="sm" onClick={saveEdit}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={cancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => startEditing(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
