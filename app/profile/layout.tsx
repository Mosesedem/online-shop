import type React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileSidebar } from "@/components/profile-sidebar"

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  return (
    <main className="container-max py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <ProfileSidebar />
        <div className="md:col-span-3">{children}</div>
      </div>
    </main>
  )
}
