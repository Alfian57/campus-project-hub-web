"use client";

import { useEffect, useState } from "react";
import { Configuration, ConfigurationMap, configurationService } from "@/lib/services/configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { useConfiguration } from "@/components/providers/configuration-provider";

export default function SettingsPage() {
  const [configs, setConfigs] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ConfigurationMap>({});
  const { refreshConfigs } = useConfiguration();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await configurationService.getAllConfigurations();
      setConfigs(data);
      
      const initialData: ConfigurationMap = {};
      data.forEach(config => {
        initialData[config.key] = config.value;
      });
      setFormData(initialData);
    } catch (error) {
      toast.error("Gagal memuat konfigurasi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await configurationService.updateConfigurations(formData);
      await refreshConfigs(); // Refresh global context
      toast.success("Konfigurasi berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal menyimpan konfigurasi");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group configs by prefix (e.g. "site.") if needed, otherwise flat list
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Website</h1>
        <p className="text-muted-foreground">
          Kelola informasi global website seperti kontak dan sosial media.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
            <CardDescription>
              Informasi ini akan ditampilkan di footer dan halaman kontak.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {configs.map((config) => (
              <div key={config.key} className="grid w-full items-center gap-1.5">
                <Label htmlFor={config.key} className="capitalize mb-1">
                  {config.description || config.key}
                </Label>
                <Input
                  id={config.key}
                  value={formData[config.key] || ""}
                  onChange={(e) => handleInputChange(config.key, e.target.value)}
                  placeholder={`Masukkan ${config.description?.toLowerCase()}`}
                  className="max-w-xl"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                    Key: <code className="bg-muted px-1 py-0.5 rounded">{config.key}</code>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
                {saving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                    </>
                )}
            </Button>
        </div>
      </form>
    </div>
  );
}
