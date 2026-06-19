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

