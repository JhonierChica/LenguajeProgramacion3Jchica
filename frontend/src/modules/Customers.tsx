import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Customer } from "@/types/index"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Loader2, Users, MapPin, Phone, UserCheck, CreditCard } from "lucide-react"

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Customer>({ cedula: "", fullName: "", phone: "", address: "" })
  const [editId, setEditId] = useState<number | null>(null)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const data = await api.get<Customer[]>("/customer")
      setCustomers(data)
    } catch {
      toast.error("Error al cargar clientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        await api.put(`/customer/${editId}`, form)
        toast.success("Cliente actualizado")
      } else {
        await api.post<Customer>("/customer", form)
        toast.success("Cliente creado")
      }
      setOpen(false)
      resetForm()
      fetchCustomers()
    } catch {
      toast.error("Error al guardar cliente")
    }
  }

  const handleEdit = (c: Customer) => {
    setForm(c)
    setEditId(c.id!)
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar cliente?")) return
    try {
      await api.delete(`/customer/${id}`)
      toast.success("Cliente eliminado")
      fetchCustomers()
    } catch {
      toast.error("Error al eliminar")
    }
  }

  const resetForm = () => {
    setForm({ cedula: "", fullName: "", phone: "", address: "" })
    setEditId(null)
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner">
              <Users className="h-6 w-6" />
            </div>
            Gestión de Clientes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pl-1">
            Administra la información de contacto y perfiles de tus clientes.
          </p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v) }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl font-black h-12 sm:h-14 px-6 sm:px-8 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto uppercase tracking-wider text-xs border-transparent hover:border-transparent">
              <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> NUEVO CLIENTE
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-md p-6 sm:p-8 border border-slate-100">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-2">
                {editId ? "Editar Cliente" : "Nuevo Cliente"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre Completo</Label>
                <Input 
                  value={form.fullName} 
                  onChange={e => setForm({ ...form, fullName: e.target.value })} 
                  placeholder="Ej. Juan Pérez, María Gómez..." 
                  className="h-14 font-bold text-md px-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cédula / Documento</Label>
                <Input 
                  value={form.cedula} 
                  onChange={e => setForm({ ...form, cedula: e.target.value })} 
                  placeholder="Ej. 1098765432" 
                  className="h-14 font-bold text-md px-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Teléfono</Label>
                <Input 
                  value={form.phone || ""} 
                  onChange={e => setForm({ ...form, phone: e.target.value })} 
                  placeholder="Ej. 300 123 4567" 
                  className="h-14 font-bold text-md px-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Dirección</Label>
                <Input 
                  value={form.address || ""} 
                  onChange={e => setForm({ ...form, address: e.target.value })} 
                  placeholder="Ej. Calle 123 #45-67" 
                  className="h-14 font-bold text-md px-4 rounded-2xl border border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white outline-none"
                />
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
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">Cargando clientes...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {customers.map(c => (
              <Card 
                key={c.id}
                className="group overflow-hidden border border-slate-100 hover:border-primary/40 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col"
              >
                {/* Card Title */}
                <div className="flex flex-row items-center justify-between p-6 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <UserCheck className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-md font-black uppercase tracking-tight text-slate-700 truncate max-w-42.5">{c.fullName}</span>
                  </div>
                </div>

                {/* Card Content (Details) */}
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3.5 flex-1">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100/50 shadow-inner">
                      <CreditCard className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-xs text-slate-600 font-bold truncate">C.C. {c.cedula}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100/50 shadow-inner">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-xs text-slate-600 font-bold truncate">{c.phone || "Sin teléfono"}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100/50 shadow-inner">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-xs text-slate-600 font-bold truncate">{c.address || "Sin dirección"}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100" />

                  {/* Actions / ID */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[9px] uppercase tracking-tighter text-slate-300">ID: #{c.id}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(c)}
                        className="p-2.5 hover:bg-primary/10 rounded-xl transition-all text-primary border border-slate-100 hover:border-primary/20 bg-white cursor-pointer"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => c.id && handleDelete(c.id)}
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

          {customers.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner max-w-3xl mx-auto">
              <Users className="h-16 w-16 mx-auto mb-4 text-slate-300 animate-bounce" />
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-slate-600">No hay clientes</h3>
              <p className="text-slate-400 font-medium mb-6 max-w-xs mx-auto text-xs">Comienza registrando a tu primer cliente para poder asignar órdenes de venta.</p>
              <Button onClick={() => setOpen(true)} className="rounded-2xl px-8 h-12 font-black tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/25 text-xs uppercase border-transparent hover:border-transparent">REGISTRAR CLIENTE</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
