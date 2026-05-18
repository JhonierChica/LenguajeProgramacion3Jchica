import { useState } from "react"
import { Toaster } from "sonner"
import Products from "./modules/Products"
import Customers from "./modules/Customers"
import Orders from "./modules/Orders"
import { ShoppingBag, Users, ClipboardList, Menu, X, Store } from "lucide-react"

function App() {
  const [activeTab, setActiveTab] = useState<"products" | "customers" | "orders">(() => {
    const saved = localStorage.getItem("activeTab")
    return (saved === "products" || saved === "customers" || saved === "orders") ? saved : "orders"
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: "orders", label: "Órdenes", icon: ClipboardList, component: Orders },
    { id: "customers", label: "Clientes", icon: Users, component: Customers },
    { id: "products", label: "Productos", icon: ShoppingBag, component: Products },


  ] as const

  const ActiveComponent = menuItems.find(item => item.id === activeTab)!.component

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-100 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl shadow-inner animate-pulse">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase text-slate-800">Tienda JChica</h1>
              <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-2 p-6 bg-white">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  localStorage.setItem("activeTab", item.id)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-slate-400'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lenguaje de Programación 3</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur px-6 sticky top-0 z-40 md:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-md font-black tracking-tight uppercase text-slate-800">Tienda JChica</h1>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur px-10 sticky top-0 z-40">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Módulo Activo</span>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Servidor Activo</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 bg-slate-50/50">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ActiveComponent />
          </div>
        </main>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App
