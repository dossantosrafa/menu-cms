import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { CategoriesPage } from '@/pages/categories-page'
import { ProductsPage } from '@/pages/products-page'
import { SpotsPage } from '@/pages/spots-page'
export default function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<Navigate to="/categorias" replace />} /><Route path="categorias" element={<CategoriesPage />} /><Route path="produtos" element={<ProductsPage />} /><Route path="mesas" element={<SpotsPage />} /></Route></Routes>
}
