import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define interfaces
interface Vote {
  choice: string;
  state: string;
  email: string;
}

// Define schema
const voteSchema = new mongoose.Schema<Vote>({
  choice: String,
  state: String,
  email: { type: String, unique: true }
});

// Create model
const VoteModel = mongoose.model<Vote>('Vote', voteSchema);

// Routes
app.post('/vote', async (req: Request, res: Response) => {
  try {
    const { choice, state, email } = req.body as Vote;
    const newVote = new VoteModel({ choice, state, email });
    await newVote.save();
    res.status(201).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Invalid data' });
    } else if ((error as any).code === 11000) {
      res.status(409).json({ message: 'Email has already voted' });
    } else {
      console.error('Error recording vote:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.get('/api/hand-dominance', async (_req: Request, res: Response) => {
  try {
    const votes = await VoteModel.find();
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});