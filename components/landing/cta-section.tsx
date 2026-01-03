"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-8 p-2 shadow-xl"
          >
            <Image
              src="/logo.png"
              alt="Campus Project Hub Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Siap Tampilkan Karyamu?
          </h2>
          
          <p className="text-xl md:text-2xl text-black/80 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan mahasiswa yang membangun portofolio dan mendapatkan pengakuan untuk proyek-proyek luar biasa mereka
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-black hover:bg-black/90 text-white font-semibold px-8 py-6 text-lg group cursor-pointer"
              >
                Mulai Gratis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black bg-transparent hover:bg-black/10 text-white font-semibold px-8 py-6 text-lg cursor-pointer"
              >
                Masuk
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-8 text-black/70"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-black">1000+</div>
              <div className="text-sm">Mahasiswa</div>
            </div>
            <div className="w-px h-12 bg-black/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-black">500+</div>
              <div className="text-sm">Proyek</div>
            </div>
            <div className="w-px h-12 bg-black/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-black">50+</div>
              <div className="text-sm">Universitas</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
