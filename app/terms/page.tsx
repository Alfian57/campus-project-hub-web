import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      {/* Header */}
      <LandingHeader />

      {/* Content */}
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm border-blue-500/30 bg-blue-500/10 text-blue-400">
                Legal
            </Badge>
            <h1 className="text-4xl font-bold text-zinc-50 mb-6">Syarat & Ketentuan</h1>
            <p className="text-zinc-400">Terakhir diperbarui: 13 Desember 2024</p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">1. Ketentuan Umum</h2>
            <p className="text-zinc-300 leading-relaxed">
              Selamat datang di Campus Project Hub. Dengan mengakses dan menggunakan platform kami, 
              Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Platform ini disediakan 
              untuk mahasiswa dan profesional muda yang ingin menampilkan proyek akademik dan kreatif mereka.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Campus Project Hub berhak untuk mengubah, memodifikasi, atau memperbarui syarat dan ketentuan 
              ini kapan saja tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan atas platform setelah 
              perubahan tersebut merupakan persetujuan Anda terhadap syarat yang diperbarui.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">2. Hak dan Kewajiban Pengguna</h2>
            <p className="text-zinc-300 leading-relaxed">Sebagai pengguna Campus Project Hub, Anda berhak untuk:</p>
            <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
              <li>Membuat dan mengelola akun pribadi</li>
              <li>Mengunggah dan menampilkan proyek Anda</li>
              <li>Berinteraksi dengan konten pengguna lain melalui komentar dan like</li>
              <li>Membeli akses ke proyek premium dari pengguna lain</li>
              <li>Menjual akses ke proyek Anda (jika memenuhi syarat)</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">Anda berkewajiban untuk:</p>
            <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
              <li>Memberikan informasi yang akurat saat pendaftaran</li>
              <li>Menjaga kerahasiaan kredensial akun Anda</li>
              <li>Tidak menyalahgunakan platform untuk aktivitas ilegal</li>
              <li>Menghormati hak kekayaan intelektual pengguna lain</li>
              <li>Tidak mengunggah konten yang melanggar hukum atau norma</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">3. Konten dan Proyek</h2>
            <p className="text-zinc-300 leading-relaxed">
              Semua konten yang Anda unggah ke platform tetap menjadi milik Anda. Namun, dengan 
              mengunggah konten, Anda memberikan Campus Project Hub lisensi non-eksklusif untuk 
              menampilkan, mendistribusikan, dan mempromosikan konten tersebut di platform kami.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Kami berhak untuk menghapus konten yang melanggar ketentuan layanan kami, termasuk 
              namun tidak terbatas pada konten yang mengandung plagiarisme, materi ofensif, atau 
              konten yang melanggar hak cipta pihak ketiga.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">4. Transaksi dan Pembayaran</h2>
            <p className="text-zinc-300 leading-relaxed">
              Campus Project Hub menyediakan fitur pembelian akses ke proyek premium. Semua transaksi 
              diproses melalui gateway pembayaran pihak ketiga yang aman (Midtrans). Kami tidak 
              menyimpan informasi kartu kredit atau debit Anda di server kami.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Kebijakan pengembalian dana berlaku dalam kondisi tertentu, seperti ketika proyek yang 
              dibeli tidak sesuai dengan deskripsi atau terdapat masalah teknis yang signifikan. 
              Permintaan pengembalian dana harus diajukan dalam waktu 7 hari setelah pembelian.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">5. Hak Kekayaan Intelektual</h2>
            <p className="text-zinc-300 leading-relaxed">
              Platform Campus Project Hub, termasuk desain, logo, dan fitur-fiturnya, dilindungi 
              oleh hak cipta dan merupakan milik kami. Anda tidak diperkenankan untuk menyalin, 
              memodifikasi, atau mendistribusikan elemen-elemen platform tanpa izin tertulis.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Proyek yang diunggah oleh pengguna tetap menjadi kekayaan intelektual masing-masing 
              pembuat. Pembelian akses ke proyek tidak berarti transfer kepemilikan HKI, melainkan 
              hanya lisensi untuk menggunakan dan mempelajari konten tersebut.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">6. Batasan Tanggung Jawab</h2>
            <p className="text-zinc-300 leading-relaxed">
              Campus Project Hub disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apapun. Kami tidak 
              bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial 
              yang timbul dari penggunaan platform ini.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Kami tidak menjamin bahwa layanan akan selalu tersedia, bebas kesalahan, atau bebas 
              dari virus atau komponen berbahaya lainnya. Pengguna bertanggung jawab penuh atas 
              keputusan yang diambil berdasarkan informasi yang diperoleh dari platform.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">7. Perubahan Ketentuan</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami berhak untuk memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan 
              material akan diumumkan melalui email atau notifikasi di platform. Penggunaan 
              berkelanjutan setelah perubahan berlaku dianggap sebagai persetujuan Anda terhadap 
              ketentuan yang diperbarui.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">8. Hukum yang Berlaku</h2>
            <p className="text-zinc-300 leading-relaxed">
              Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik 
              Indonesia. Segala sengketa yang timbul dari atau terkait dengan ketentuan ini akan 
              diselesaikan melalui pengadilan yang berwenang di Indonesia.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-12">
            <h2 className="text-xl font-semibold text-zinc-100 mb-3">Hubungi Kami</h2>
            <p className="text-zinc-300">
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di:
            </p>
            <p className="text-blue-400 mt-2">support@campushub.com</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
