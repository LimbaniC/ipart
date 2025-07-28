import express from 'express';
import { postTaskHandler, getTaskHandler, updateTaskHandler } from './controllers/taskHandlers.js';


const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3001; 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/task/data', postTaskHandler);
router.get('/task/data', getTaskHandler); 
router.update('/task/data', updateTaskHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

