import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar"; // We will create this next

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Security Check
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/"); // Kick out non-admins
  }

  // 2. Prepare user data to pass to the client sidebar
  const userData = {
    name: user.firstName || user.username || "Admin",
    imageUrl: user.imageUrl
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Client Component for interactive sidebar */}
      <AdminSidebar user={userData} />

      {/* Page content will be rendered here */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}