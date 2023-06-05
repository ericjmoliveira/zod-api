import express from 'express';

import { playerRoutes } from './routes/player';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(playerRoutes);

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello world!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
