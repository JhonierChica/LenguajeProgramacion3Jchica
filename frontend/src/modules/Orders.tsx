import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Order, Customer, Product } from "@/types/index"
import { toast } from "sonner"
import { Plus, Loader2, ClipboardList, CheckCircle2, AlertCircle, ShoppingCart, Trash2, UserCheck } from "lucide-react"

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Order>({ customerId: 0, items: [{ productId: 0, quantity: 1 }], notes: "" })

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await api.get<Order[]>("/orders")
      setOrders(data)
    } catch {
      toast.error("Error al cargar órdenes")
    } finally {
      setLoading(false)
    }
  }

  const fetchOptions = async () => {
    try {
      const [customersData, productsData] = await Promise.all([
        api.get<Customer[]>("/customer"),
        api.get<Product[]>("/products")
      ])
      setCustomers(customersData)
      setProducts(productsData.filter(p => p.available !== false))
    } catch {
      toast.error("Error al cargar opciones de clientes o productos")
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders()
      fetchOptions()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const resetForm = () => {
    setForm({ customerId: 0, items: [{ productId: 0, quantity: 1 }], notes: "" })
  }

  const addProductRow = () => {
    setForm({
      ...form,
      items: [...form.items, { productId: 0, quantity: 1 }]
    })
  }

  const removeProductRow = (index: number) => {
    if (form.items.length <= 1) {
      toast.warning("La orden debe tener al menos un producto")
      return
    }
    const newItems = form.items.filter((_, i) => i !== index)
    setForm({ ...form, items: newItems })
  }

  const updateProductRow = (index: number, field: "productId" | "quantity", value: number) => {
    const newItems = form.items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    })
    setForm({ ...form, items: newItems })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerId) {
      toast.warning("Debe seleccionar un cliente")
      return
    }
    const invalidItems = form.items.some(item => !item.productId || item.quantity < 1)
    if (invalidItems) {
      toast.warning("Debe seleccionar un producto válido en todas las filas")
      return
    }
    try {
      await api.post<Order>("/orders", form)
      toast.success("Orden creada")
      setOpen(false)
      resetForm()
      fetchOrders()
    } catch {
      toast.error("Error al guardar orden")
    }
  }

  const handleDeleteOrder = async (orderId?: number) => {
    if (!orderId) {
      toast.error("Orden inválida")
      return
    }
    const confirmed = window.confirm("¿Seguro que querés eliminar esta orden?")
    if (!confirmed) return
    setDeletingId(orderId)
    try {
      await api.delete(`/orders/${orderId}`)
      toast.success("Orden eliminada")
      fetchOrders()
    } catch {
      toast.error("Error al eliminar orden")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner">
              <ClipboardList className="h-6 w-6" />
            </div>
            Registro de Órdenes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pl-1">
            Supervisa las transacciones comerciales, estados de pago y totales.
          </p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v) }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl font-black h-12 sm:h-14 px-6 sm:px-8 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto uppercase tracking-wider text-xs border-transparent hover:border-transparent">
              <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> NUEVA ORDEN
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md p-5 sm:p-8 border border-slate-100 max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] sm:w-full">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                Nueva Orden
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cliente *</Label>
                <select
                  value={form.customerId || ""}
                  onChange={e => setForm({ ...form, customerId: +e.target.value })}
                  className="h-14 font-bold text-sm px-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none w-full appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Seleccione un cliente...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Multi-product selection block */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Productos *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addProductRow}
                    className="h-8 text-[10px] font-black rounded-lg border-primary/20 text-primary hover:bg-primary/5 uppercase tracking-wider px-3"
                  >
                    + AGREGAR PRODUCTO
                  </Button>
                </div>

                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {form.items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center bg-slate-50/50 p-3 sm:p-2 rounded-2xl border border-slate-200 font-sans">
                      {/* Product Selector */}
                      <div className="flex-1">
                        <select
                          value={item.productId || ""}
                          onChange={e => updateProductRow(index, "productId", +e.target.value)}
                          className="h-10 font-bold text-xs px-2.5 rounded-xl border border-slate-200 focus:border-primary transition-all bg-white outline-none w-full cursor-pointer"
                          required
                        >
                          <option value="" disabled>Seleccione producto...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name.toUpperCase()} (${p.price.toLocaleString("es-CO")})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity & Delete Button Group */}
                      <div className="flex gap-2 items-center justify-between sm:justify-start">
                        <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest sm:hidden">CANT:</span>
                          <Input 
                            type="number" 
                            min="1"
                            value={item.quantity} 
                            onChange={e => updateProductRow(index, "quantity", Math.max(1, +e.target.value))} 
                            className="h-10 w-16 font-black text-xs px-2 rounded-xl border border-slate-200 focus:border-primary transition-all bg-white text-center outline-none flex-1 sm:flex-none"
                            required 
                          />
                        </div>

                        {form.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeProductRow(index)}
                            className="h-10 w-10 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculated price summary block */}
              {(() => {
                const selectedItems = form.items.filter(item => item.productId > 0);
                if (selectedItems.length === 0) return null;
                const calculatedTotal = selectedItems.reduce((sum, item) => {
                  const prod = products.find(p => p.id === item.productId);
                  return sum + (prod ? prod.price * item.quantity : 0);
                }, 0);
                return (
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-2 animate-in fade-in zoom-in-95 duration-200 text-left font-sans">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-0.5">Resumen de Compra</div>
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                      {selectedItems.map((item, index) => {
                        const prod = products.find(p => p.id === item.productId);
                        if (!prod) return null;
                        return (
                          <div key={index} className="flex justify-between items-center text-xs text-slate-600">
                            <span className="font-semibold text-slate-500">{prod.name.toUpperCase()} <span className="text-slate-400 font-bold">x{item.quantity}</span></span>
                            <span className="font-black text-slate-700">${(prod.price * item.quantity).toLocaleString("es-CO")}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-px bg-primary/10 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-primary uppercase tracking-widest">Total de la Orden:</span>
                      <span className="text-lg font-black text-primary">${calculatedTotal.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Notas / Observaciones</Label>
                <Input 
                  value={form.notes || ""} 
                  onChange={e => setForm({ ...form, notes: e.target.value })} 
                  placeholder="Ej. Entrega urgente, pago en efectivo..." 
                  className="h-14 font-bold text-md px-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none"
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300 border-transparent hover:border-transparent">
                CREAR ORDEN
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">Cargando órdenes...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Card view for mobile/tablet */}
          <div className="block lg:hidden space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {orders.map(o => {
                const isPending = o.status === "PENDIENTE" || o.status === "PENDING";
                return (
                  <Card 
                    key={o.id}
                    className="group overflow-hidden border border-slate-100 hover:border-primary/40 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col"
                  >
                    {/* Card Title & Status Badge */}
                    <div className="flex flex-row items-center justify-between p-6 border-b border-slate-50 bg-slate-50/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <ShoppingCart className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-md font-black uppercase tracking-tight text-slate-700">Orden #{o.id}</span>
                      </div>
                      
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isPending 
                          ? "bg-amber-50 text-amber-600 border border-amber-200/50" 
                          : "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                      }`}>
                        {isPending ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {o.status}
                      </span>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="bg-slate-50 p-4 rounded-2xl space-y-3.5 flex-1">
                        {/* Customer Info */}
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100/50 shadow-inner">
                          <UserCheck className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex flex-col truncate">
                            <span className="text-xs text-slate-700 font-black uppercase truncate">{o.customerName || `Cliente #${o.customerId}`}</span>
                            <span className="text-[9px] text-slate-400 font-bold">ID CLIENTE: #{o.customerId}</span>
                          </div>
                        </div>

                        {/* Notes Info */}
                        <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100/50 shadow-inner min-h-[64px]">
                          <ClipboardList className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Notas / Observaciones</span>
                            <span className="text-xs text-slate-500 font-medium break-words">
                              {o.notes || <span className="text-slate-300 italic">Ninguna</span>}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions Row */}
                      <div className="w-full h-px bg-slate-100" />

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total de la Orden</span>
                          <span className="text-lg font-black text-primary">${o.totalAmount?.toLocaleString("es-CO") || 0}</span>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={deletingId === o.id}
                          onClick={() => handleDeleteOrder(o.id)}
                          className="h-10 w-10 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-100 hover:border-rose-100 transition-all cursor-pointer shrink-0"
                        >
                          {deletingId === o.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  <ShoppingCart className="h-10 w-10 text-slate-300 stroke-[1.5]" />
                  <span className="text-sm font-medium text-slate-400">No hay transacciones registradas actualmente.</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden lg:block rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                    <TableRow>
                      <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest py-5 pl-8">ID Transacción</TableHead>
                      <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest py-5">Cliente</TableHead>
                      <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest py-5">Monto Total</TableHead>
                      <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest py-5">Notas</TableHead>
                      <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest py-5 pr-8">Estado de Orden</TableHead>
                      <TableHead className="text-xs font-black text-slate-500 uppercase tracking-widest py-5 pr-8 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(o => {
                      const isPending = o.status === "PENDIENTE" || o.status === "PENDING"
                      return (
                        <TableRow key={o.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100/60">
                          <TableCell className="font-black text-xs text-slate-400 py-5 pl-8">#{o.id}</TableCell>
                          <TableCell className="font-bold text-slate-700 py-5">
                            {o.customerName ? (
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{o.customerName}</span>
                                <span className="text-[10px] text-slate-400 font-bold">ID: #{o.customerId}</span>
                              </div>
                            ) : (
                              `Cliente #${o.customerId}`
                            )}
                          </TableCell>
                          <TableCell className="font-black text-sm text-primary py-5">
                            ${o.totalAmount?.toLocaleString("es-CO") || 0}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 font-medium py-5">
                            {o.notes || <span className="text-slate-300 italic">Ninguna</span>}
                          </TableCell>
                          <TableCell className="py-5 pr-8">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isPending 
                                ? "bg-amber-50 text-amber-600 border border-amber-200/50" 
                                : "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                            }`}>
                              {isPending ? (
                                <>
                                  <AlertCircle className="h-3 w-3" />
                                  {o.status}
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3 w-3" />
                                  {o.status}
                                </>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="py-5 pr-8 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={deletingId === o.id}
                              onClick={() => handleDeleteOrder(o.id)}
                              className="h-9 w-9 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                            >
                              {deletingId === o.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-16 text-center text-slate-400 font-medium text-sm">
                          <div className="flex flex-col items-center gap-3">
                            <ShoppingCart className="h-10 w-10 text-slate-300 stroke-[1.5]" />
                            <span>No hay transacciones registradas actualmente.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
