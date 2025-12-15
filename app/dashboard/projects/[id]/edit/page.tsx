"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { projectsService } from "@/lib/services/projects";
import { categoriesService } from "@/lib/services/categories";
import { uploadFile } from "@/lib/services/upload";
import { CategoryApiResponse } from "@/types/api";
import { ApiError } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";

import { getApiUrl, getAssetUrl } from "@/lib/env";

const API_BASE_URL = getApiUrl();

export default function EditProjectPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // File input refs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    type: "free" as "free" | "paid",
    price: "",
  });

  // Existing URLs
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // File states for new uploads
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch project data on mount
  useEffect(() => {
    async function fetchProject() {
      if (!projectId) return;
      
      try {
        const project = await projectsService.getProject(projectId);
        setFormData({
          title: project.title,
          description: project.description || "",
          categoryId: project.categoryId || "",
          techStack: project.techStack?.join(", ") || "",
          githubUrl: project.links?.github || "",
          demoUrl: project.links?.demo || "",
          type: project.type,
          price: project.price?.toString() || "",
        });
        
        if (project.thumbnailUrl) {
          setExistingThumbnailUrl(project.thumbnailUrl);
          setThumbnailPreview(project.thumbnailUrl);
        }
        
        if (project.images && project.images.length > 0) {
          setExistingImageUrls(project.images);
          setImagePreviews(project.images);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Gagal memuat proyek");
        router.push("/dashboard/projects");
      } finally {
        setIsLoadingProject(false);
      }
    }

    if (user) {
      fetchProject();
    }
  }, [projectId, user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const preview = URL.createObjectURL(file);
      setThumbnailPreview(preview);
      setExistingThumbnailUrl(null);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setExistingThumbnailUrl(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    // Check if it's an existing URL or a new file
    if (index < existingImageUrls.length) {
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newFileIndex = index - existingImageUrls.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Judul proyek harus diisi";
    }

    if (!formData.description.trim()) {
      errors.description = "Deskripsi harus diisi";
    }

    if (formData.type === "paid" && (!formData.price || parseInt(formData.price) <= 0)) {
      errors.price = "Harga harus diisi untuk proyek berbayar";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload new thumbnail if provided
      let thumbnailUrl: string | undefined = existingThumbnailUrl || undefined;
      if (thumbnailFile) {
        toast.loading("Mengunggah thumbnail...", { id: "upload-thumbnail" });
        const result = await uploadFile(thumbnailFile);
        thumbnailUrl = `${API_BASE_URL.replace('/api/v1', '')}${result.url}`;
        toast.dismiss("upload-thumbnail");
      }

      // Start with existing image URLs
      let imagesUrls: string[] = [...existingImageUrls];
      
      // Upload new images
      if (imageFiles.length > 0) {
        toast.loading("Mengunggah gambar...", { id: "upload-images" });
        for (const file of imageFiles) {
          const result = await uploadFile(file);
          imagesUrls.push(`${API_BASE_URL.replace('/api/v1', '')}${result.url}`);
        }
        toast.dismiss("upload-images");
      }

      const techStackArray = formData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      await projectsService.updateProject(projectId, {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId || undefined,
        thumbnailUrl: thumbnailUrl,
        images: imagesUrls,
        techStack: techStackArray,
        githubUrl: formData.githubUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        type: formData.type,
        price: formData.type === "paid" ? parseInt(formData.price) || 0 : 0,
      });

      toast.success("Proyek berhasil diperbarui!");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error updating project:", error);
      
      if (error instanceof ApiError) {
        toast.error(error.message);
        if (error.errors) {
          const newErrors: Record<string, string> = {};
          Object.entries(error.errors).forEach(([field, message]) => {
            newErrors[field] = message;
          });
          setFieldErrors(newErrors);
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user || isLoadingProject) {
    return (
      <div className="flex items-center justify-center py-20">
        <LucideIcons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="icon" className="shrink-0">
            <LucideIcons.ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-zinc-50">Edit Proyek</h1>
          <p className="text-zinc-400 mt-1">
            Perbarui detail proyek Anda
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.FileText className="w-5 h-5 text-zinc-400" />
            Informasi Dasar
          </h3>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Judul Proyek <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: E-Commerce Platform"
                className={`mt-1.5 bg-zinc-800/50 border-zinc-700 ${fieldErrors.title ? 'border-red-500' : ''}`}
                required
              />
              {fieldErrors.title && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Jelaskan tentang proyek Anda..."
                rows={4}
                required
                className={`w-full mt-1.5 px-3 py-2 bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none ${fieldErrors.description ? 'border-red-500' : 'border-zinc-700'}`}
              />
              {fieldErrors.description && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryId">Kategori</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full mt-1.5 h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB (pisahkan dengan koma)"
                  className="mt-1.5 bg-zinc-800/50 border-zinc-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media - File Upload */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.Image className="w-5 h-5 text-zinc-400" />
            Media
          </h3>

          <div className="grid gap-4">
            {/* Thumbnail Upload */}
            <div>
              <Label>Thumbnail</Label>
              <div className="mt-1.5">
                {thumbnailPreview ? (
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-zinc-700">
                    <img
                      src={getAssetUrl(thumbnailPreview)}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <LucideIcons.X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-48 h-32 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-zinc-800/50 transition-colors"
                  >
                    <LucideIcons.Upload className="w-6 h-6 text-zinc-500 mb-2" />
                    <span className="text-sm text-zinc-500">Upload Thumbnail</span>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Additional Images Upload */}
            <div>
              <Label>Gambar Tambahan</Label>
              <div className="mt-1.5 flex flex-wrap gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700">
                    <img
                      src={getAssetUrl(preview)}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <LucideIcons.X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => imagesInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-zinc-800/50 transition-colors"
                >
                  <LucideIcons.Plus className="w-5 h-5 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Tambah</span>
                </div>
                <input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.Link className="w-5 h-5 text-zinc-400" />
            Tautan
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="githubUrl">GitHub Repository</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={`mt-1.5 bg-zinc-800/50 border-zinc-700 ${fieldErrors.githubUrl ? 'border-red-500' : ''}`}
              />
              {fieldErrors.githubUrl && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.githubUrl}</p>
              )}
            </div>

            <div>
              <Label htmlFor="demoUrl">Live Demo</Label>
              <Input
                id="demoUrl"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={`mt-1.5 bg-zinc-800/50 border-zinc-700 ${fieldErrors.demoUrl ? 'border-red-500' : ''}`}
              />
              {fieldErrors.demoUrl && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.demoUrl}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.DollarSign className="w-5 h-5 text-zinc-400" />
            Harga
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipe Proyek</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full mt-1.5 h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="free">Gratis</option>
                <option value="paid">Berbayar</option>
              </select>
            </div>

            {formData.type === "paid" && (
              <div>
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50000"
                  className={`mt-1.5 bg-zinc-800/50 border-zinc-700 ${fieldErrors.price ? 'border-red-500' : ''}`}
                />
                {fieldErrors.price && (
                  <p className="text-sm text-red-500 mt-1">{fieldErrors.price}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            <span className="text-red-500">*</span> Wajib diisi
          </p>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/projects">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isSubmitting ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <LucideIcons.Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
