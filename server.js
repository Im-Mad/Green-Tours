const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  // ERROR LIKE CONSOLE.LOG(X);
  console.log(err.name, err.message);
  console.log('Shutting down...');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to DB successfully'));

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`Running on port ${port}... `);
});

//LISTENER FOR UNHANDLED PROMISE REJECTION ( asynch code )

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  //give the server time to finish processing request then exist
  server.close(() => {
    process.exit(1);
  });
});
