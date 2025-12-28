import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <LandingHeader />

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
                 <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm border-blue-500/30 bg-blue-500/10 text-blue-400">
                    Legal
                </Badge>
                <h1 className="text-4xl font-bold text-zinc-50 mb-6">Kebijakan Cookie</h1>
                <p className="text-zinc-400">Terakhir diperbarui: 28 Desember 2025</p>
            </div>

             <div className="prose prose-invert prose-lg max-w-none text-zinc-300">
                <p>
                    Campus Hub ("kami") menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman Anda saat menggunakan platform kami. Kebijakan ini menjelaskan apa itu cookie, bagaimana kami menggunakannya, dan pilihan yang Anda miliki.
                </p>

                <h3>Apa itu Cookie?</h3>
                <p>
                    Cookie adalah file teks kecil yang disimpan di perangkat Anda (komputer, tablet, atau seluler) saat Anda mengunjungi situs web. Cookie memungkinkan situs web untuk mengingat tindakan dan preferensi Anda (seperti login, bahasa, ukuran font, dan preferensi tampilan lainnya) selama jangka waktu tertentu.
                </p>

                <h3>Jenis Cookie yang Kami Gunakan</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong className="text-zinc-100">Cookie Esensial:</strong> Cookie ini sangat penting agar situs web dapat berfungsi dengan baik. Mereka memungkinkan Anda untuk menavigasi situs dan menggunakan fitur-fiturnya, seperti mengakses area aman.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Cookie Kinerja & Analitik:</strong> Kami menggunakan cookie ini untuk memahami bagaimana pengunjung berinteraksi dengan situs web kami, halaman mana yang paling sering dikunjungi, dan jika mereka mendapatkan pesan kesalahan. Ini membantu kami meningkatkan kinerja situs.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Cookie Fungsional:</strong> Cookie ini memungkinkan situs web untuk mengingat pilihan yang telah Anda buat (seperti nama pengguna, bahasa, atau wilayah Anda) dan menyediakan fitur yang lebih ditingkatkan dan lebih pribadi.
                    </li>
                </ul>

                <h3>Mengelola Cookie</h3>
                <p>
                    Anda dapat mengontrol dan/atau menghapus cookie sesuai keinginan Anda - untuk detailnya, lihat <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">aboutcookies.org</a>. Anda dapat menghapus semua cookie yang sudah ada di komputer Anda dan Anda dapat mengatur sebagian besar browser untuk mencegahnya ditempatkan. Namun, jika Anda melakukan ini, Anda mungkin harus menyesuaikan beberapa preferensi secara manual setiap kali Anda mengunjungi situs, dan beberapa layanan serta fungsi mungkin tidak berfungsi.
                </p>

                <h3>Perubahan pada Kebijakan Ini</h3>
                <p>
                    Kami dapat memperbarui Kebijakan Cookie ini dari waktu ke waktu. Setiap perubahan akan diposting di halaman ini dengan tanggal revisi yang diperbarui.
                </p>
                
                <p className="border-t border-zinc-800 pt-8 mt-8">
                    Jika Anda memiliki pertanyaan tentang penggunaan cookie kami, silakan hubungi kami di <a href="mailto:privacy@campushub.id" className="text-blue-400 hover:text-blue-300">privacy@campushub.id</a>.
                </p>
             </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
