import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlogCard } from '@/components/shared/BlogCard';
import { CommentCard } from '@/components/shared/CommentCard';
import { BlogCardSkeleton } from '@/components/shared/BlogCardSkeleton';
import { CommentCardSkeleton } from '@/components/shared/CommentCardSkeleton';
import { Button } from '@/components/ui/Button';
import { FlipButton } from '@/components/ui/FlipButton';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen p-10 md:p-20 lg:p-32 max-w-7xl mx-auto space-y-24">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-primary">Design System</h1>
        <p className="text-xl text-text-muted">Boost Blog</p>
      </div>

      {/* Typography */}
      <section className="space-y-8">
        <h2 className="text-3xl font-medium border-b border-surface pb-4">Typography (Kanit)</h2>
        <div className="space-y-6 bg-surface/50 p-8 rounded-2xl border border-white/5">
          <div>
            <span className="text-text-muted text-sm mb-2 block">H1 - 5xl (48px)</span>
            <h1 className="text-5xl font-semibold">การเดินทางเริ่มต้นที่นี่</h1>
          </div>
          <div>
            <span className="text-text-muted text-sm mb-2 block">H2 - 4xl (36px)</span>
            <h2 className="text-4xl font-semibold">สถานที่เที่ยวยอดฮิต</h2>
          </div>
          <div>
            <span className="text-text-muted text-sm mb-2 block">H3 - 3xl (30px)</span>
            <h3 className="text-3xl font-medium">แนะนำที่พัก</h3>
          </div>
          <div>
            <span className="text-text-muted text-sm mb-2 block">H4 - 2xl (24px)</span>
            <h4 className="text-2xl font-medium">รีวิวร้านอาหาร</h4>
          </div>
          <div>
            <span className="text-text-muted text-sm mb-2 block">H5 - xl (20px)</span>
            <h5 className="text-xl font-medium">ความคิดเห็นล่าสุด</h5>
          </div>
          <div>
            <span className="text-text-muted text-sm mb-2 block">H6 - lg (18px)</span>
            <h6 className="text-lg font-medium">แชร์ประสบการณ์</h6>
          </div>
          <div>
            <span className="text-text-muted text-sm mb-2 block">Body - base (16px)</span>
            <p className="text-base text-text-muted leading-relaxed">
              การท่องเที่ยวเปิดโลกกว้างให้เราได้เห็นมุมมองใหม่ๆ มากมาย 
              พบปะผู้คนต่างวัฒนธรรม และสร้างความทรงจำที่ไม่มีวันลืม
            </p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-8">
        <h2 className="text-3xl font-medium border-b border-surface pb-4">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Primary */}
          <div className="space-y-6 bg-surface/50 p-8 rounded-2xl border border-white/5">
            <h3 className="text-lg font-medium text-text-muted">Primary</h3>
            <div className="flex flex-col gap-4 items-center">
              <Button size="sm">Small Primary</Button>
              <Button size="md">Medium Primary</Button>
              <Button size="lg">Large Primary</Button>
              <Button disabled>Disabled Primary</Button>
            </div>
          </div>
          
          {/* Outline */}
          <div className="space-y-6 bg-surface/50 p-8 rounded-2xl border border-white/5">
            <h3 className="text-lg font-medium text-text-muted">Outline</h3>
            <div className="flex flex-col gap-4 items-center">
              <Button variant="outline" size="sm">Small Outline</Button>
              <Button variant="outline" size="md">Medium Outline</Button>
              <Button variant="outline" size="lg">Large Outline</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>

          {/* Ghost */}
          <div className="space-y-6 bg-surface/50 p-8 rounded-2xl border border-white/5">
            <h3 className="text-lg font-medium text-text-muted">Ghost</h3>
            <div className="flex flex-col gap-4 items-center">
              <Button variant="ghost" size="sm">Small Ghost</Button>
              <Button variant="ghost" size="md">Medium Ghost</Button>
              <Button variant="ghost" size="lg">Large Ghost</Button>
              <Button variant="ghost" disabled>Disabled Ghost</Button>
            </div>
          </div>
        </div>

        {/* Animated Buttons */}
        <div className="mt-8 space-y-6 bg-surface/50 p-8 rounded-2xl border border-white/5">
          <h3 className="text-lg font-medium text-text-muted">Animated (Flip)</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <FlipButton frontText="Hover Me" backText="Let's Go !" />
            <FlipButton frontText="อ่านต่อ" backText="คลิกเลย !" className="w-32 h-10" />
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-8">
        <h2 className="text-3xl font-medium border-b border-surface pb-4">Inputs & Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-surface/50 p-8 rounded-2xl border border-white/5">
            <Input label="Default Input" placeholder="พิมพ์บางอย่าง..." />
            <Input label="With Value" defaultValue="กรุงเทพมหานคร" />
            <Input label="Disabled Input" placeholder="ไม่สามารถแก้ไขได้" disabled />
          </div>
          <div className="space-y-6 bg-surface/50 p-8 rounded-2xl border border-white/5">
            <Input 
              label="Error State" 
              placeholder="กรุณากรอกข้อมูล" 
              error="คุณจำเป็นต้องกรอกช่องนี้" 
            />
            <Textarea 
              label="Comment" 
              placeholder="แสดงความคิดเห็นของคุณ..." 
            />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-8">
        <h2 className="text-3xl font-medium border-b border-surface pb-4">Badges</h2>
        <div className="flex gap-4 bg-surface/50 p-8 rounded-2xl border border-white/5">
          <Badge>ท่องเที่ยว</Badge>
          <Badge>รีวิวที่พัก</Badge>
          <Badge>ยอดฮิต</Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20">มาใหม่</Badge>
        </div>
      </section>

      {/* Domain Components */}
      <section className="space-y-8">
        <h2 className="text-3xl font-medium border-b border-surface pb-4">Domain Components</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-muted">BlogCard (3D Flip)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <BlogCard 
              title="สัมผัสอากาศหนาวที่เชียงใหม่ พร้อมที่เที่ยวใหม่ๆ"
              excerpt="หนาวนี้ที่เชียงใหม่ไม่ได้มีแค่ดอยอินทนนท์ เราจะพาคุณไปค้นพบสถานที่ลับที่น้อยคนนักจะรู้จัก พร้อมคาเฟ่สุดชิคที่ต้องแวะ"
              coverImage="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80"
              slug="chiang-mai-winter"
              createdAt="12 DEC 2026"
            />
            <BlogCard 
              title="รีวิวร้านกาแฟมินิมอลกลางกรุง ถ่ายรูปมุมไหนก็ปัง"
              excerpt="สาย Cafe Hopper ห้ามพลาด! คัดมาให้แล้วกับร้านกาแฟสไตล์เกาหลีย่านสุขุมวิท ที่แสงสวย มุมถ่ายรูปเพียบ"
              coverImage="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80"
              slug="bkk-minimal-cafe"
              createdAt="08 DEC 2026"
            />
            <BlogCard 
              title="แบกเป้เที่ยวญี่ปุ่นด้วยตัวเองฉบับมือใหม่"
              excerpt="ไม่ต้องกลัวหลง! ไกด์บุ๊คฉบับย่อสำหรับการเดินทางในโตเกียวด้วยรถไฟ JR และ Subway แบบเข้าใจง่ายสุดๆ"
              coverImage="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"
              slug="japan-solo-guide"
              createdAt="01 DEC 2026"
            />
          </div>
        </div>

        {/* Comment Cards */}
        <div className="space-y-4 pt-8">
          <h3 className="text-lg font-medium text-text-muted">CommentCard (Public vs Admin)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Public Variant */}
            <div className="space-y-4">
              <h4 className="text-sm text-text-muted">Public Variant (No Status)</h4>
              <CommentCard 
                author="John Doe"
                createdAt="15 DEC 2026, 14:30"
                content="บทความดีมากเลยครับ รูปสวยมากและให้ข้อมูลที่เป็นประโยชน์สำหรับการเตรียมตัวไปเที่ยวช่วงหน้าหนาวได้ดีทีเดียว ขอบคุณที่นำมาแบ่งปันครับ!"
                repliesCount={3}
              />
              <CommentCard 
                author="Alice Wonderland"
                createdAt="14 DEC 2026, 09:15"
                content="ที่พักที่แนะนำมีโปรโมชั่นไหมคะ สนใจมากเลย"
              />
            </div>

            {/* Admin Variants */}
            <div className="space-y-4">
              <h4 className="text-sm text-text-muted">Admin Variants (With Status)</h4>
              <CommentCard 
                author="Spam Bot 99"
                createdAt="15 DEC 2026, 15:00"
                content="คลิกที่นี่เพื่อรับเครดิตฟรี!! โปรโมชั่นแจกจริงคลิกเลย http://spam-link.com"
                status="rejected"
              />
              <CommentCard 
                author="TravelLover_TH"
                createdAt="15 DEC 2026, 15:45"
                content="คาเฟ่นี้อยู่ที่ไหนหรอครับ มีที่จอดรถไหม?"
                status="pending"
              />
            </div>
            
          </div>
        </div>

        {/* Skeletons */}
        <div className="space-y-4 pt-8">
          <h3 className="text-lg font-medium text-text-muted">Loading States (Skeletons)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <BlogCardSkeleton />
            </div>
            <div className="md:col-span-2 space-y-4">
              <CommentCardSkeleton />
              <CommentCardSkeleton />
            </div>
          </div>
        </div>
      </section>

      {/* Layouts */}
      <section className="space-y-8 pb-20">
        <h2 className="text-3xl font-medium border-b border-surface pb-4">Layouts (Organisms)</h2>
        
        {/* Navbar Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-muted">Navbar</h3>
          <div className="border border-white/5 rounded-2xl overflow-hidden bg-black relative">
            <Navbar />
            <div className="h-32 bg-surface/30 flex items-center justify-center text-text-muted/50 text-sm">
              (Page Content Area)
            </div>
          </div>
        </div>

        {/* Footer Preview */}
        <div className="space-y-4 mt-12">
          <h3 className="text-lg font-medium text-text-muted">Footer</h3>
          <div className="border border-white/5 rounded-2xl overflow-hidden bg-black">
            <div className="h-32 bg-surface/30 flex items-center justify-center text-text-muted/50 text-sm border-b border-white/5">
              (Page Content Area)
            </div>
            <Footer />
          </div>
        </div>
      </section>

    </div>
  );
}
