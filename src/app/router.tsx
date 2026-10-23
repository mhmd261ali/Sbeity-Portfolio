import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { RootLayout, RouteError } from '@/components/layout/RootLayout'

const HomePage = lazy(() => import('@/pages/Home/HomePage').then((module) => ({ default: module.HomePage })))
const ProductsPage = lazy(() => import('@/pages/Products/ProductsPage').then((module) => ({ default: module.ProductsPage })))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })))
const OurWorkPage = lazy(() => import('@/pages/OurWork/OurWorkPage').then((module) => ({ default: module.OurWorkPage })))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetail/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })))
const AboutPage = lazy(() => import('@/pages/About/AboutPage').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => import('@/pages/Contact/ContactPage').then((module) => ({ default: module.ContactPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const StudioPage = lazy(() => import('@/pages/Studio/StudioPage').then((module) => ({ default: module.StudioPage })))

export const router = createBrowserRouter([
  { path: '/studio/*', Component: StudioPage, errorElement: <RouteError /> },
  { path: '/studio', Component: StudioPage, errorElement: <RouteError /> },
  {
    path: '/',
    Component: RootLayout,
    errorElement: <RouteError />,
    children: [
      { index: true, Component: HomePage },
      { path: 'products', Component: ProductsPage },
      { path: 'products/:slug', Component: ProductDetailPage },
      { path: 'our-work', Component: OurWorkPage },
      { path: 'our-work/:slug', Component: ProjectDetailPage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
