import React from "react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

interface AboutSectionProps {
  imageUrl?: string;
}

export const AboutSection = ({ imageUrl }: AboutSectionProps) => {
  return (
    <section id="about" className="py-24 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <FadeIn>
            <div className="relative z-10">
              <div className="relative z-10 aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80"}
                  alt="นักเดินทางถ่ายภาพท่ามกลางแสงยามเย็น"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              {/* Decorative border frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/40 rounded-2xl max-w-md mx-auto hidden md:block z-[-1]" />
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn delay={0.15}>
            <div className="space-y-6">
              <p className="text-primary font-medium tracking-[0.2em] text-sm">
                WHO WE ARE
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-text-main leading-tight"
                style={{ textWrap: "balance" }}
              >
                แบ่งปันประสบการณ์การเดินทาง
                <br className="hidden lg:block" />
                จากการเยือนกว่า 40 ประเทศ
              </h2>
              <p className="text-text-muted leading-relaxed text-base md:text-lg font-light max-w-lg">
                เราเชื่อว่าตัวเองเป็นพลเมืองของโลกใบนี้ ร่วมเดินทางไปกับเรา
                ผ่านเรื่องราวที่จะพาคุณสำรวจวัฒนธรรม ธรรมชาติ
                และผู้คนจากทุกมุมโลก เพื่อค้นพบตัวคุณเอง
                ผ่านการค้นพบสิ่งใหม่ๆ ที่รออยู่ข้างหน้า
              </p>
              <p className="text-text-muted/70 text-sm leading-relaxed font-light max-w-lg">
                ทุกบทความถูกเขียนจากประสบการณ์จริง พร้อมภาพถ่ายต้นฉบับ
                และเคล็ดลับที่ช่วยให้การเดินทางของคุณสมบูรณ์แบบยิ่งขึ้น
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
