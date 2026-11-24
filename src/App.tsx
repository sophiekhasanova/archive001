import { createPortal } from 'react-dom'
import { CartDrawer } from './components/CartDrawer'
import { Cursor, Footer, Nav, Shutter } from './components/Chrome'
import { ObjectOverlay } from './components/ObjectOverlay'
import { RouterProvider, useRouter } from './lib/router'
import Archive from './pages/Archive'
import Home from './pages/Home'
import { StoreProvider } from './store/store'

function Shell() {
  const { path } = useRouter()
  return (
    <>
      <Nav />
      {createPortal(
        <>
          <main key={path}>{path === '/archive' ? <Archive /> : <Home />}</main>
          <Footer />
        </>,
        document.getElementById('smooth-content')!,
      )}
      <ObjectOverlay />
      <CartDrawer />
      <Cursor />
      <Shutter />
    </>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </RouterProvider>
  )
}
