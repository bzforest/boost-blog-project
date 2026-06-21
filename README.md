\## 🛠 Tech Stack \& System Architecture



This project follows a decoupled client-server architecture, separating the frontend interface from the backend API services. This approach ensures scalability, easier maintainability, and strictly follows modern software development practices.



\*\*Frontend \& UI\*\*

\* \*\*\[Tailwind CSS](https://tailwindcss.com/):\*\* For rapid, utility-first styling.

\* \*\*\[shadcn/ui](https://ui.shadcn.com/):\*\* Reusable component system for a clean and accessible UI.

\* \*\*\[Framer Motion](https://www.framer.com/motion/):\*\* Implemented for fluid, highly polished UI animations and page transitions to enhance user experience.

\* \*\*\[Zustand](https://docs.pmnd.rs/zustand/):\*\* A small, fast, and scalable bearbones state-management solution, specifically utilized within the Admin Panel for complex state handling without boilerplate.

\*\*Backend API Service (Node.js + Express.js)\*\*

\* \*\*\[Node.js](https://nodejs.org/) \& \[Express.js](https://expressjs.com/):\*\* Lightweight and robust framework for building RESTful APIs to handle core business logic.

\* \*\*\[Prisma ORM](https://www.prisma.io/):\*\* Type-safe database client used within the Express application to interact securely with the PostgreSQL database.

\* \*\*\[Zod](https://zod.dev/):\*\* Server-side data validation to ensure data integrity before executing database transactions.



\*\*Database \& Storage\*\*

\* \*\*\[PostgreSQL (via Supabase)](https://supabase.com/):\*\* Primary relational database for storing blogs, users, and comments.

\* \*\*Supabase Storage:\*\* For handling image uploads and media management.


ทำไมถึงเลือกใช้ NextAuth.js (Auth.js) แทนที่จะใช้ Firebase/Supabase Auth?
"ในการแก้ปัญหาระบบ Admin Login ผมได้พิจารณา Trade-off ระหว่างความเร็วในการพัฒนา (BaaS อย่าง Supabase) กับ ความยืดหยุ่นในระยะยาว (NextAuth)
ผมตัดสินใจเลือก NextAuth.js ร่วมกับ Credentials Provider (Custom Backend JWT) เพราะช่วยลดปัญหา Vendor Lock-in ทำให้โค้ด Frontend สามารถนำไป Reuse กับโปรเจกต์อื่นที่อาจใช้ Database/Backend Technology ที่แตกต่างกันได้ นอกจากนี้ยังรองรับการขยายตัว (Scalability) หากในอนาคต Product Owner ต้องการเพิ่มระบบ Social Login ให้กับผู้ใช้งานทั่วไป ก็สามารถทำได้ทันทีโดยไม่ต้องรื้อ Architecture ใหม่"


สำหรับระบบรักษาความปลอดภัย ผมเลือกใช้สถาปัตยกรรม BFF (Backend-For-Frontend) Proxy ผ่าน Next.js API Routes แทนการส่ง Token จาก Browser ตรงๆ เพื่อซ่อน Backend URL และป้องกันการถูกขโมย Token ผ่าน XSS >
ส่วนระบบ Refresh Token ผมได้พิจารณา Trade-off แล้วเห็นว่าระบบนี้มีเพียง Admin ใช้งานเป็นหลัก การตั้งค่า JWT Access Token ให้อายุ 1 วัน ควบคู่กับ BFF Proxy ก็เพียงพอและเหมาะสมกับสเกลของโปรเจกต์โดยไม่ทำให้ระบบซับซ้อนเกินความจำเป็น (Over-engineering)