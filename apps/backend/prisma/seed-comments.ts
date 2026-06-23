import 'dotenv/config';
import { PrismaClient, CommentStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ชุดคำสำหรับคอมเมนต์หลัก (Parent)
const mockStarters = [
  { author: "นักเดินทางสายชิล", text: "ภาพสวยมากเลยครับ เห็นแล้วอยากเก็บกระเป๋าตามไปเดี๋ยวนี้เลย!" },
  { author: "TravelLover", text: "ที่นี่ช่วงหน้าฝนเดินทางลำบากไหมครับ รถเก๋งเข้าถึงหรือเปล่า?" },
  { author: "CafeHopper", text: "มุมถ่ายรูปเยอะมาก กาแฟรสชาติดีไหมครับร้านที่แนะนำ?" },
  { author: "SpamBot99", text: "คลิกที่นี่เพื่อรับเครดิตฟรี!! โปรโมชั่นแจกจริงคลิกเลย http://spam...", defaultStatus: "REJECTED" },
  { author: "คนรักป่า", text: "ช่วยกันรักษาความสะอาดด้วยนะครับ ธรรมชาติจะได้สวยงามไปนานๆ" },
  { author: "Anonymous", text: "อ่านเพลินมากครับ บรรยายซะเห็นภาพเลย" },
];

// ชุดคำสำหรับตอบกลับ (Reply)
const mockReplies = [
  { author: "แอดมินใจดี", text: "ขอบคุณที่แวะมาอ่านและคอมเมนต์นะครับ! เตรียมกระเป๋าแล้วลุยเลยครับ" },
  { author: "สายลุย", text: "หน้าฝนทางจะลื่นนิดนึงครับ แนะนำเป็นกระบะหรือ 4x4 จะชัวร์กว่าครับ ผมเพิ่งไปมา" },
  { author: "CoffeeMaster", text: "กาแฟดริปที่นี่คั่วเอง หอมมากครับ ยืนยันอีกเสียง" },
  { author: "คนรักป่า", text: "เห็นด้วยมากๆ ครับ เราต้องช่วยกันดูแล" },
  { author: "SystemGuard", text: "ระวังลิงก์สแปมด้านบนด้วยนะครับทุกคน อย่าเผลอกดนะ", defaultStatus: "PENDING" }
];

async function main() {
  const blogs = await prisma.blog.findMany({ select: { id: true } });

  if (blogs.length === 0) {
    console.log("No blogs found. Please seed blogs first.");
    return;
  }

  console.log("Seeding comprehensive comments (with replies)...");

  for (const blog of blogs) {
    const parentIds: string[] = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 14)); // สุ่มวันที่ย้อนหลัง

    // 1. สร้าง Parent Comments (3 คอมเมนต์ต่อโพสต์)
    for (let i = 0; i < 3; i++) {
      const randomMock = mockStarters[Math.floor(Math.random() * mockStarters.length)];
      const status = randomMock.defaultStatus || (Math.random() > 0.3 ? "APPROVED" : "PENDING");
      
      const parentComment = await prisma.comment.create({
        data: {
          blogId: blog.id,
          author: randomMock.author,
          content: randomMock.text,
          status: status as CommentStatus,
          createdAt: new Date(baseDate.getTime() - Math.random() * 86400000), // สุ่มเวลาให้เหลื่อมกันเล็กน้อย
        }
      });
      parentIds.push(parentComment.id);
    }

    // 2. สร้าง Reply Comments (2 คอมเมนต์ต่อโพสต์)
    for (let i = 0; i < 2; i++) {
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      const randomParentId = parentIds[Math.floor(Math.random() * parentIds.length)]; // สุ่มตอบกลับคอมเมนต์หลัก
      const status = randomReply.defaultStatus || (Math.random() > 0.2 ? "APPROVED" : "PENDING");

      await prisma.comment.create({
        data: {
          blogId: blog.id,
          parentId: randomParentId, // เชื่อมความสัมพันธ์ Reply
          author: randomReply.author,
          content: randomReply.text,
          status: status as CommentStatus,
          createdAt: new Date(baseDate.getTime() + Math.random() * 3600000), // เวลาตอบกลับต้องหลังเวลาคอมเมนต์หลัก
        }
      });
    }
  }

  console.log("Comments seeded successfully! (Total: 5 comments per blog)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });