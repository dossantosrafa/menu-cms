import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { CategoriesPage } from '@/pages/categories-page'
import { ProductsPage } from '@/pages/products-page'
import { SpotsPage } from '@/pages/spots-page'
import { GuestChecksPage } from '@/pages/guest-checks-page'
import { GuestCheckDetailPage } from '@/pages/guest-check-detail-page'
import { OrdersPage } from '@/pages/orders-page'

export default function App() {
  return <Routes><Route element={<AppLayout />}>
    <Route index element={<Navigate to="/comandas" replace />} />
    <Route path="categorias" element={<CategoriesPage />} />
    <Route path="produtos" element={<ProductsPage />} />
    <Route path="mesas" element={<SpotsPage />} />
    <Route path="comandas" element={<GuestChecksPage />} />
    <Route path="comandas/:id" element={<GuestCheckDetailPage />} />
    <Route path="pedidos" element={<OrdersPage />} />
    <Route path="*" element={<div className="py-16 text-center"><h1 className="text-2xl font-semibold">Página não encontrada</h1><Link to="/comandas" className="mt-4 inline-block text-primary underline">Ir para comandas</Link></div>} />
  </Route></Routes>
}
