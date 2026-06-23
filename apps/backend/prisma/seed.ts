import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Create User
  const admin = await prisma.user.upsert({
    where: { email: 'adminblog@gmail.com' },
    update: {},
    create: {
      email: 'adminblog@gmail.com',
      username: 'Admin Boost',
      password: 'adminblog1123',
    },
  });
  console.log('Created Admin:', admin.username);

  // 2. Create Blogs and Comments
  const blog1 = await prisma.blog.upsert({
    where: { slug: 'travel-tokyo-japan' },
    update: {},
    create: {
      title: 'เที่ยวโตเกียวประเทศญี่ปุ่น สัมผัสวัฒนธรรมและเทคโนโลยี',
      slug: 'travel-tokyo-japan',
      excerpt: 'พาเที่ยวโตเกียวเมืองหลวงของญี่ปุ่น พร้อมแนะนำสถานที่เด็ดๆ ห้ามพลาด',
      content: 'โตเกียวเป็นเมืองที่ผสมผสานระหว่างความทันสมัยและวัฒนธรรมดั้งเดิมได้อย่างลงตัว เหมาะกับการไปเที่ยวมากๆ...',
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
        'https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=800&q=80',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=800&q=80',
      ],
      isPublished: true,
      views: 150,
      comments: {
        create: [
          {
            author: 'นักเดินทางสายชิล 1',
            content: 'รูปสวยมากเลยครับ อยากไปโตเกียวเลย',
            status: 'APPROVED',
          },
          {
            author: 'Sakura Lover 2',
            content: 'ขอบคุณสำหรับรีวิวดีๆ นะคะ ข้อมูลครบถ้วนมาก',
            status: 'APPROVED',
          },
          {
            author: 'ไม่ระบุชื่อ 3',
            content: 'มีที่พักแนะนำไหมครับ ย่านไหนดี',
            status: 'PENDING',
          }
        ]
      }
    },
  });
  console.log('Created Blog 1:', blog1.title);

  const blog2 = await prisma.blog.upsert({
    where: { slug: 'travel-europe-paris' },
    update: {},
    create: {
      title: 'เที่ยวยุโรปที่ปารีส เมืองแห่งความโรแมนติก',
      slug: 'travel-europe-paris',
      excerpt: 'ดื่มด่ำบรรยากาศสุดแสนโรแมนติกที่ปารีส ประเทศฝรั่งเศส',
      content: 'ปารีส เมืองที่หลายคนใฝ่ฝันอยากจะไปเยือนสักครั้งในชีวิต มีทั้งหอไอเฟลและพิพิธภัณฑ์ลูฟวร์...',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80',
        'https://images.unsplash.com/photo-1509302846320-81ed89d28d85?w=800&q=80',
        'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=800&q=80',
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
      ],
      isPublished: true,
      views: 240,
    },
  });
  console.log('Created Blog 2:', blog2.title);

  const blog3 = await prisma.blog.upsert({
    where: { slug: 'travel-thai-phuket' },
    update: {},
    create: {
      title: 'เที่ยวทะเลไทยที่ภูเก็ต สวรรค์เมืองใต้',
      slug: 'travel-thai-phuket',
      excerpt: 'พาชมทะเลสวย น้ำใส หาดทรายขาวที่จังหวัดภูเก็ต',
      content: 'ภูเก็ต เป็นจังหวัดที่เต็มไปด้วยธรรมชาติทางทะเลที่สวยงามระดับโลก อาหารอร่อย และผู้คนน่ารัก...',
      coverImage: 'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
        'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80',
        'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=800&q=80',
        'https://images.unsplash.com/photo-1560930950-5cc20e8cb3cc?w=800&q=80',
      ],
      isPublished: false,
      views: 0,
    },
  });
  console.log('Created Blog 3:', blog3.title);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
