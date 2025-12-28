import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <LandingHeader />

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
             <div className="mb-12">
                 <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm border-purple-500/30 bg-purple-500/10 text-purple-400">
                    Komunitas
                </Badge>
                <h1 className="text-4xl font-bold text-zinc-50 mb-6">Panduan Komunitas</h1>
                <p className="text-xl text-zinc-400">
                    Membangun lingkungan yang aman, suportif, dan inspiratif untuk semua mahasiswa.
                </p>
            </div>

            <div className="space-y-12">
                {/* Do's */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <h2 className="text-2xl font-bold text-zinc-50">Yang Kami Dorong</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Berbagi proyek yang orisinal dan inovatif.",
                                "Memberikan umpan balik (feedback) yang konstruktif dan sopan.",
                                "Menghargai hak kekayaan intelektual orang lain.",
                                "Berkolaborasi dengan semangat saling membantu.",
                                "Melaporkan konten atau perilaku yang melanggar aturan."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Don'ts */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <XCircle className="w-8 h-8 text-red-500" />
                            <h2 className="text-2xl font-bold text-zinc-50">Yang Dilarang</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Memposting konten yang mengandung ujaran kebencian, pelecehan, atau diskriminasi.",
                                "Mengunggah proyek plagiat atau mengakui karya orang lain sebagai milik sendiri.",
                                "Spam, penipuan, atau promosi yang tidak relevan.",
                                "Membagikan konten berbahaya (malware, virus, script terlarang).",
                                "Melakukan doxing atau menyebarkan informasi pribadi orang lain tanpa izin."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                 {/* Enforcement */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-xl font-bold text-zinc-50">Penegakan Aturan</h3>
                    </div>
                    <p className="text-zinc-300 mb-4">
                        Kami menganggap serius pelanggaran terhadap panduan ini. Konsekuensi pelanggaran dapat mencakup:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                        <li>Peringatan formal</li>
                        <li>Penghapusan konten (proyek/komentar)</li>
                        <li>Penangguhan akun sementara</li>
                        <li>Pemblokiran akun permanen</li>
                    </ul>
                </div>

                 <p className="text-zinc-500 pt-8 text-sm">
                    Dengan menggunakan Campus Hub, Anda menyetujui untuk mematuhi panduan ini. Panduan ini dapat diperbarui sewaktu-waktu.
                </p>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
