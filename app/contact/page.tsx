"use client";

import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useConfiguration } from "@/components/providers/configuration-provider";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { get } = useConfiguration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast.success("Pesan terkirim!", {
            description: "Terima kasih telah menghubungi kami. Kami akan membalas secepatnya."
        });
        (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <LandingHeader activePage="contact" />

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-blue-500/30 bg-blue-500/10 text-blue-400">
                Hubungi Kami
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
                Mari Terhubung
            </h1>
            <p className="text-xl text-zinc-400 max-w-xl mx-auto">
                Punya pertanyaan, saran, atau sekadar ingin menyapa? Kami siap mendengarkan.
            </p>
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                     <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-8 space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-50 mb-4">Informasi Kontak</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">Email</p>
                                            <a href={`mailto:${get("site.email", "hello@campushub.id")}`} className="text-zinc-400 hover:text-blue-400 transition-colors">
                                                {get("site.email", "hello@campushub.id")}
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">Lokasi</p>
                                            <p className="text-zinc-400">
                                                {get("site.address", "Digital Valley, Yogyakarta, Indonesia")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">Telepon</p>
                                            <p className="text-zinc-400">
                                                {get("site.phone", "+62 812-3456-7890")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                     </Card>
                </div>

                {/* Contact Form */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-zinc-300">Nama Lengkap</label>
                                <Input id="name" required placeholder="John Doe" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</label>
                                <Input id="email" type="email" required placeholder="john@university.ac.id" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-zinc-300">Pesan</label>
                                <Textarea id="message" required placeholder="Ceritakan yang ingin Anda sampaikan..." className="min-h-[150px] bg-zinc-800 border-zinc-700 text-zinc-100" />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                                {isSubmitting ? (
                                    <>Mengirim...</>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Kirim Pesan
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
