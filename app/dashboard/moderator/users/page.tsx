"use client";

import { useState, useEffect, useCallback } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { usersService } from "@/lib/services/users";
import { UserApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlockReasonModal } from "@/components/moderator/block-reason-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Loader2, 
  Search, 
  ArrowLeft, 
  UserCheck, 
  UserX,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ModeratorUsersPage() {
  const [users, setUsers] = useState<UserApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserApiResponse | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await usersService.getUsers({
        page,
        perPage: 20,
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setUsers(data.items);
      setTotalPages(data.meta.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  const openBlockModal = (user: UserApiResponse) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleBlock = async (reason: string) => {
    if (!selectedUser) return;
    setActionLoading(selectedUser.id);
    try {
      await usersService.blockUser(selectedUser.id, reason);
      toast.success("Pengguna berhasil diblokir");
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Gagal memblokir pengguna");
    } finally {
      setActionLoading(null);
      setShowBlockModal(false);
      setSelectedUser(null);
    }
  };

  const handleUnblock = async (userId: string) => {
    setActionLoading(userId);
    try {
      await usersService.unblockUser(userId);
      toast.success("Pengguna berhasil dibuka blokirnya");
      fetchUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Gagal membuka blokir pengguna");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <RoleGuard allowedRoles={["moderator", "admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/moderator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Moderasi Pengguna</h1>
            <p className="text-zinc-400">Kelola dan moderasi akun pengguna</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Cari pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800/50 border-zinc-700"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100"
          >
            <option value="all" className="bg-zinc-900">Semua Status</option>
            <option value="active" className="bg-zinc-900">Aktif</option>
            <option value="blocked" className="bg-zinc-900">Diblokir</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : users.length > 0 ? (
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-zinc-800">
                  <TableHead className="text-zinc-400">Pengguna</TableHead>
                  <TableHead className="text-zinc-400">Email</TableHead>
                  <TableHead className="text-zinc-400">Role</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-zinc-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-zinc-100">{user.name}</p>
                          <p className="text-sm text-zinc-500">{user.university || "-"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }
                      >
                        {user.status === "active" ? "Aktif" : "Diblokir"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== "admin" && user.role !== "moderator" && (
                        <>
                          {user.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:text-red-400 border-red-500/30"
                              onClick={() => openBlockModal(user)}
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <UserX className="w-4 h-4 mr-1" />
                              )}
                              Blokir
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-500 hover:text-green-400 border-green-500/30"
                              onClick={() => handleUnblock(user.id)}
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <UserCheck className="w-4 h-4 mr-1" />
                              )}
                              Buka Blokir
                            </Button>
                          )}
                        </>
                      )}
                      {(user.role === "admin" || user.role === "moderator") && (
                        <span className="text-xs text-zinc-500">Tidak dapat diblokir</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <p className="text-zinc-500">Tidak ada pengguna ditemukan</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Block Reason Modal */}
      {selectedUser && (
        <BlockReasonModal
          isOpen={showBlockModal}
          onClose={() => {
            setShowBlockModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleBlock}
          title="Blokir Pengguna"
          itemName={selectedUser.name}
          itemType="pengguna"
          isLoading={actionLoading === selectedUser.id}
        />
      )}
    </RoleGuard>
  );
}
