import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Product } from "@/types/index"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Loader2, ShoppingBag, CheckCircle, XCircle, Tag } from "lucide-react"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Product>({ name: "", price: 0, available: true })
  const [priceInput, setPriceInput] = useState<string>("")
  const [editId, setEditId] = useState<number | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await api.get<Product[]>("/products")
      setProducts(data)
    } catch {
      toast.error("Error al cargar productos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedPrice = priceInput.trim() === "" ? NaN : Number(priceInput)
    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      toast.warning("Ingrese un precio válido")
      return
    }
    const payload: Product = { ...form, price: normalizedPrice }
    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload)
        toast.success("Producto actualizado")
      } else {
        await api.post<Product>("/products", payload)
        toast.success("Producto creado")
      }
      setOpen(false)
      resetForm()
      fetchProducts()
    } catch {
      toast.error("Error al guardar producto")
    }
  }

  const handleEdit = (p: Product) => {
    setForm(p)
    setPriceInput(p.price !== undefined ? String(p.price) : "")
    setEditId(p.id!)
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return
    try {
      await api.delete(`/products/${id}`)
      toast.success("Producto eliminado")
      fetchProducts()
    } catch {
      toast.error("Error al eliminar")
    }
  }

  const resetForm = () => {
    setForm({ name: "", price: 0, available: true })
    setPriceInput("")
    setEditId(null)
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner">
              <ShoppingBag className="h-6 w-6" />
            </div>
            Catálogo de Productos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pl-1">
            Administra los artículos disponibles en tu tienda y sus precios.
          </p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v) }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl font-black h-12 sm:h-14 px-6 sm:px-8 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto uppercase tracking-wider text-xs border-transparent hover:border-transparent">
              <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> NUEVO PRODUCTO
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md p-6 sm:p-8 border border-slate-100">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                {editId ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre del Producto</Label>
                <Input 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  placeholder="Ej. Coca Cola, Camiseta..." 
                  className="h-14 font-bold text-md px-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Precio (COP)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <Input 
                    type="number" 
                    value={priceInput} 
                    onChange={e => setPriceInput(e.target.value)} 
                    className="h-14 font-bold text-md pl-8 pr-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none"
                    required 
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available ?? true}
                  onChange={e => setForm({ ...form, available: e.target.checked })}
                  className="h-5 w-5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
                />
                <Label htmlFor="available" className="text-xs font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none">
                  Producto Disponible para la venta
                </Label>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300 border-transparent hover:border-transparent">
                {editId ? "ACTUALIZAR" : "GUARDAR"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">Cargando productos...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {products.map(p => (
              <Card 
                key={p.id}
                className="group overflow-hidden border border-slate-100 hover:border-primary/40 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col"
              >
                {/* Card Title & Price Tag */}
                <div className="flex flex-row items-center justify-between p-6 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Tag className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-md font-black uppercase tracking-tight text-slate-700 truncate max-w-32.5 sm:max-w-37.5">{p.name}</span>
                  </div>
                  <div className="bg-primary px-3.5 py-1.5 rounded-full font-black text-xs text-white shadow-sm shadow-primary/20">
                    ${p.price.toLocaleString("es-CO")}
                  </div>
                </div>

                {/* Card Content (Availability Status) */}
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="bg-slate-50 p-4 rounded-2xl min-h-20 flex flex-col justify-center items-center gap-2 flex-1">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Disponibilidad</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.available !== false 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50" 
                        : "bg-destructive/5 text-destructive border border-destructive/10"
                    }`}>
                      {p.available !== false ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Disponible
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Agotado
                        </>
                      )}
                    </span>
                  </div>

                  <div className="w-full h-px bg-slate-100" />

                  {/* Actions / ID */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[9px] uppercase tracking-tighter text-slate-300">ID: #{p.id}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(p)}
                        className="p-2.5 hover:bg-primary/10 rounded-xl transition-all text-primary border border-slate-100 hover:border-primary/20 bg-white cursor-pointer"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => p.id && handleDelete(p.id)}
                        className="p-2.5 hover:bg-destructive/10 rounded-xl transition-all text-destructive border border-slate-100 hover:border-destructive/20 bg-white cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner max-w-3xl mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-slate-300 animate-bounce" />
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-slate-600">Catálogo vacío</h3>
              <p className="text-slate-400 font-medium mb-6 max-w-xs mx-auto text-xs">Comienza creando tu primer producto para habilitar las ventas en tu tienda.</p>
              <Button onClick={() => setOpen(true)} className="rounded-2xl px-8 h-12 font-black tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/25 text-xs uppercase border-transparent hover:border-transparent">CREAR PRODUCTO</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
