"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart } from "lucide-react"
import { useDataStore } from "@/lib/data-store"
import { useEffect, useState } from "react"

export function ReportsTab() {
  const { sales, products } = useDataStore()
  const [productSalesData, setProductSalesData] = useState<any[]>([])

  // Calculate product sales data whenever sales or products change
  useEffect(() => {
    const calculateProductSales = () => {
      const data = products.map((product) => {
        const totalSold = sales.reduce((total, sale) => {
          const saleItem = sale.items.find((item) => item.productName === product.name)
          return total + (saleItem ? saleItem.quantity : 0)
        }, 0)

        const totalRevenue = sales.reduce((total, sale) => {
          const saleItem = sale.items.find((item) => item.productName === product.name)
          return total + (saleItem ? saleItem.quantity * saleItem.price : 0)
        }, 0)

        return {
          ...product,
          totalSold,
          totalRevenue,
        }
      })

      setProductSalesData(data)
    }

    calculateProductSales()
  }, [sales, products])

  // Sort by total sold (descending)
  const topSellingProducts = [...productSalesData]
    .filter((product) => product.totalSold > 0)
    .sort((a, b) => b.totalSold - a.totalSold)

  const salesData = [
    { month: "Jan", sales: 4000, profit: 2400 },
    { month: "Feb", sales: 3000, profit: 1398 },
    { month: "Mar", sales: 2000, profit: 9800 },
    { month: "Apr", sales: 2780, profit: 3908 },
    { month: "May", sales: 1890, profit: 4800 },
    { month: "Jun", sales: 2390, profit: 3800 },
  ]

  // Calculate category distribution
  const categoryData = products.reduce((acc: Record<string, { value: number; percentage: number }>, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { value: 0, percentage: 0 }
    }
    acc[product.category].value += product.quantity
    return acc
  }, {})

  const totalInventory = Object.values(categoryData).reduce((sum, cat) => sum + cat.value, 0)

  // Calculate percentages
  Object.keys(categoryData).forEach((category) => {
    categoryData[category].percentage =
      totalInventory > 0 ? Math.round((categoryData[category].value / totalInventory) * 100) : 0
  })

  // Convert to array and assign colors
  const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-500", "bg-indigo-500"]
  const inventoryData = Object.entries(categoryData).map(([category, data], index) => ({
    category,
    value: data.value,
    percentage: data.percentage,
    color: colors[index % colors.length],
  }))

  const maxSales = Math.max(...salesData.map((d) => d.sales))
  const maxProfit = Math.max(...salesData.map((d) => d.profit))

  // Calculate totals
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalItemsSold = sales.reduce(
    (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )
  const lowStockItems = products.filter((product) => product.quantity <= product.minStock).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              From {sales.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsSold}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Total units sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              Need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Profit Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{data.month}</span>
                    <span>
                      Sales: RM{data.sales.toLocaleString()} | Profit: RM{data.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-12">Sales</span>
                      <Progress value={(data.sales / maxSales) * 100} className="flex-1 h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-12">Profit</span>
                      <Progress value={(data.profit / maxProfit) * 100} className="flex-1 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span>
                      {item.value} items ({item.percentage}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <Progress value={item.percentage} className="flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Sales Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Revenue Generated</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productSalesData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.totalSold}</span>
                      {product.totalSold > 0 && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Sold</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">RM{product.totalRevenue.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <span className={product.quantity <= product.minStock ? "text-red-600 font-semibold" : ""}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>RM{product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSellingProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.totalSold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">RM{product.totalRevenue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
              </div>
            ))}
            {topSellingProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales data available yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
