import { useEffect, useState } from "react"
import type { ComponentType } from "react"
import { Toaster } from "sonner"
import Products from "./modules/Products"
import Customers from "./modules/Customers"
import Orders from "./modules/Orders"
import { ShoppingBag, Users, ClipboardList, Menu, X, Store, LogOut, User as UserIcon } from "lucide-react"
import { useAuth } from "./context/AuthContext"
import { LoginPage } from "./pages/LoginPage"
import type { Role } from "./types"

type TabId = "products" | "customers" | "orders"
type MenuItem = {
  id: TabId
  label: string
  icon: typeof ClipboardList
  component: ComponentType
  roles: Role[]
}

const getSavedTab = (): TabId | null => {
  const saved = localStorage.getItem("activeTab")
  if (saved === "orders" || saved === "customers" || saved === "products") {
    return saved
  }
  return null
}

function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>(() => getSavedTab() ?? "orders")

  // Definición completa de items de menú
  const allMenuItems: MenuItem[] = [
    { id: "orders", label: "Órdenes", icon: ClipboardList, component: Orders, roles: ["ROLE_ADMIN", "ROLE_CASHIER", "ROLE_WAITER"] },
    { id: "customers", label: "Clientes", icon: Users, component: Customers, roles: ["ROLE_ADMIN", "ROLE_CASHIER"] },
    { id: "products", label: "Productos", icon: ShoppingBag, component: Products, roles: ["ROLE_ADMIN"] },
  ]

  // Filtrar items según el rol del usuario autenticado
  const menuItems = user ? allMenuItems.filter(item => item.roles.includes(user.role)) : []
  const allowedTab = menuItems.some(item => item.id === activeTab)
    ? activeTab
    : (menuItems[0]?.id ?? "orders")

  useEffect(() => {
    if (menuItems.length === 0) return
    localStorage.setItem("activeTab", allowedTab)
  }, [allowedTab, menuItems.length])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-outfit">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <Store className="absolute w-6 h-6 text-blue-400 animate-pulse" />
        </div>
        <p className="text-slate-400 text-sm tracking-wider uppercase font-bold animate-pulse">
          Verificando credenciales...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-center" richColors />
      </>
    )
  }

  const ActiveComponent = menuItems.find(item => item.id === allowedTab)?.component || Orders

  const getRoleLabelAndClass = (role: Role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return { label: "Admin", bg: "bg-violet-500/10 text-violet-600 border-violet-500/20" }
      case "ROLE_CASHIER":
        return { label: "Cajero", bg: "bg-blue-500/10 text-blue-600 border-blue-500/20" }
      case "ROLE_WAITER":
        return { label: "Mesero", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
      default:
        return { label: "Usuario", bg: "bg-slate-500/10 text-slate-600 border-slate-500/20" }
    }
  }

  const roleStyle = user ? getRoleLabelAndClass(user.role) : { label: "", bg: "" }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased font-outfit select-none">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-100 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl shadow-inner">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase text-slate-800">Restaurante </h1>
              <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Uniremington</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-6 py-5 border-b border-slate-100/80 bg-slate-50/20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 truncate uppercase leading-tight">
                {user?.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleStyle.bg} uppercase tracking-wider`}>
                  {roleStyle.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-2 p-6 bg-white">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = allowedTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  localStorage.setItem("activeTab", item.id)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${isActive
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

        {/* Logout Button */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/10">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2.5 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider rounded-2xl border border-rose-100/50 transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Cerrar Sesión</span>
          </button>
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
            <h1 className="text-md font-black tracking-tight uppercase text-slate-800">Restaurante </h1>
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
              {menuItems.find(item => item.id === allowedTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {roleStyle.label} Conectado
              </span>
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
