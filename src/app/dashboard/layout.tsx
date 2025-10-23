import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { AppBreadcrumb } from "./components/AppBreadcrumb"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-6 w-full h-full overflow-auto">
        <div className="mb-2 flex items-center gap-3">
          <SidebarTrigger />
          <AppBreadcrumb />
        </div>
        <div>
          {children}
        </div>
      </main>
      <Toaster position="top-right" />
    </SidebarProvider>
  )
}