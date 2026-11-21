import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, ChefHat, ClipboardList, Columns3, LayoutGrid, SquareMenu, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { to: '/comandas', label: 'Comandas', icon: ClipboardList },
  { to: '/pedidos', label: 'Pedidos · Kanban', icon: Columns3 },
  { to: '/categorias', label: 'Categorias', icon: LayoutGrid },
  { to: '/produtos', label: 'Produtos', icon: BookOpen },
  { to: '/mesas', label: 'Mesas', icon: SquareMenu },
]

export function AppLayout() {
  return <div className="min-h-screen">
    <a href="#conteudo" className="sr-only z-50 rounded bg-primary p-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Pular para o conteúdo</a>
    <aside className="border-b bg-card lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex h-24 items-center gap-3 px-6"><div className="flex size-11 items-center justify-center rounded-xl bg-primary text-white"><UtensilsCrossed className="size-6" /></div>
        <div><span className="text-2xl font-bold tracking-tight">menu<span className="text-orange-600">.</span></span><p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Painel de gestão</p></div></div>
      <div className="hidden px-6 pt-6 pb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase lg:block">Restaurante</div>
      <nav aria-label="Navegação principal" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-4">
        {navigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => cn('flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors', isActive ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
          <Icon className="size-[18px]" />{label}</NavLink>)}
      </nav>
      <div className="mt-auto hidden p-5 lg:block"><div className="rounded-xl border bg-muted/50 p-4"><ChefHat className="mb-3 size-6 text-primary" />
        <p className="text-sm font-semibold">Tudo pronto para servir.</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Cardápio e operação em um só lugar.</p></div>
        <p className="mt-5 text-center text-xs text-muted-foreground">Menu CMS · Administração</p></div>
    </aside>
    <div className="lg:pl-64"><header className="flex h-18 items-center justify-between border-b bg-card px-5 md:px-9"><span className="text-sm font-medium text-muted-foreground">Gestão do restaurante</span>
      <div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:block">Área administrativa</span><span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary"><ChefHat className="size-5" /></span></div></header>
      <main id="conteudo" className="mx-auto max-w-400 p-5 py-7 md:p-9"><Outlet /></main>
    </div>
  </div>
}
