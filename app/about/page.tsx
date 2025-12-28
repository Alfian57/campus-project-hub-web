import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Zap, Heart } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <LandingHeader activePage="about" />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-blue-500/30 bg-blue-500/10 text-blue-400">
                Tentang Kami
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500">
                Memberdayakan Inovator Kampus
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
                Campus Hub adalah platform yang menghubungkan mahasiswa berbakat dengan peluang untuk memamerkan, berbagi, dan mengembangkan karya mereka.
            </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-zinc-900/30">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400">
                        <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-50">Misi Kami</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Misi kami adalah menjembatani kesenjangan antara proyek akademik dan dunia nyata. Kami percaya setiap baris kode, setiap desain, dan setiap inovasi yang dibuat oleh mahasiswa layak untuk dilihat dan diapresiasi oleh dunia.
                    </p>
                    <ul className="space-y-4 pt-4">
                        {[
                            "Memberikan eksposur untuk proyek mahasiswa",
                            "Memfasilitasi kolaborasi antar kampus",
                            "Membangun portofolio yang kredibel",
                            "Menghubungkan talenta dengan industri"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-zinc-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative h-[400px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-8">
                             <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                             <h3 className="text-2xl font-bold text-white mb-2">Inspirasi Tanpa Batas</h3>
                             <p className="text-zinc-400">Dari mahasiswa, untuk masa depan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Nilai Inti Kami</h2>
                <p className="text-zinc-400">Prinsip yang membimbing setiap langkah kami</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: <Users className="w-6 h-6" />,
                        title: "Komunitas",
                        desc: "Kami membangun ekosistem yang saling mendukung, di mana senior membimbing junior dan kolaborasi tumbuh subur."
                    },
                    {
                        icon: <Zap className="w-6 h-6" />,
                        title: "Inovasi",
                        desc: "Kami merayakan ide-ide baru dan pendekatan kreatif dalam memecahkan masalah melalui teknologi."
                    },
                    {
                        icon: <Heart className="w-6 h-6" />,
                        title: "Dampak",
                        desc: "Kami berfokus pada proyek yang memberikan nilai nyata dan solusi bermanfaat bagi masyarakat."
                    }
                ].map((val, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-100 mb-6">
                                {val.icon}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-50 mb-3">{val.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {val.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
