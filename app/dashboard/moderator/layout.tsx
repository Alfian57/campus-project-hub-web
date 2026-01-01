"use client";

import { RoleGuard } from "@/components/auth/role-guard";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin", "moderator"]}>
      {children}
    </RoleGuard>
  );
}
