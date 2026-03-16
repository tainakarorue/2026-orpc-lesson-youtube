import { MainSidebarProvider } from '@/components/features/sidebars/main/main-sidebar-provider'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <MainSidebarProvider>
      <main className="w-full h-full p-6 md:p-8">{children}</main>
    </MainSidebarProvider>
  )
}

export default Layout
