import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import blogRoute from './modules/blog/blog.route';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blogs', blogRoute);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Boost Blog API is running!' });
});


const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
