import express from 'express';
import { postTaskHandler, getTaskHandler, updateTaskHandler, deleteTaskHandler } from './controllers/taskHandlers.js';

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3001; 

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Test endpoint to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'iPart API is running!', timestamp: new Date().toISOString() });
});

app.use(express.json());
app.use('/', router);

router.post('/task', postTaskHandler);
router.get('/task', getTaskHandler); 
router.put('/task', updateTaskHandler);
router.delete('/task/:id', deleteTaskHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/`);
  console.log(`Tasks endpoint: http://localhost:${PORT}/task`);
});

