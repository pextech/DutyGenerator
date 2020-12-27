/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import {} from 'dotenv/config';
import routes from './routes/index';

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.json({ extended: false }));
app.use('/', routes);
app.listen(port || 5000, () => {
  console.log(`server is running on port ${port}`);
});

export default app;
