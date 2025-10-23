"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SlashIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbItems = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/")
    const isLast = idx === segments.length - 1
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

    return (
      <BreadcrumbItem key={href}>
        <BreadcrumbLink asChild>
          {isLast ? (
            <span>{label}</span>
          ) : (
            <Link href={href}>{label}</Link>
          )}
        </BreadcrumbLink>
      </BreadcrumbItem>
    )
  })

  // Insert separators
  const itemsWithSeparators: React.ReactNode[] = []
  breadcrumbItems.forEach((item, idx) => {
    itemsWithSeparators.push(item)
    if (idx < breadcrumbItems.length - 1) {
      itemsWithSeparators.push(
        <BreadcrumbSeparator key={`sep-${idx}`}>
          <SlashIcon />
        </BreadcrumbSeparator>
      )
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {itemsWithSeparators}
      </BreadcrumbList>
    </Breadcrumb>
  )
}