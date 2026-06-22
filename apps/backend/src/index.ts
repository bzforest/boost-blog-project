import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import blogRoute from './modules/blog/blog.route';
import commentRoute from './modules/comment/comment.route';
import authRoute from './modules/auth/auth.route';
import siteContentRoutes from './modules/site-content/site-content.routes';
import { errorHandler } from './middlewares/error.middleware';
import { swaggerUi, specs } from './lib/swagger';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API Documentation (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/blogs', blogRoute);
app.use('/api/comments', commentRoute);
app.use('/api/auth', authRoute);
app.use('/api/content', siteContentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Boost Blog API is running!' });
});

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
