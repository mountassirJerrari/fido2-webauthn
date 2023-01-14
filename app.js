require('dotenv').config();
const  base64 = require("base64-arraybuffer")
const base64url =require('base64url')
const crypto = require('crypto');
const express = require('express');
const app = express();
const hbs = require('hbs');
const session = require ('express-session')
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const connectMongoDBSession = require('connect-mongodb-session');
const userRouter = require('./routes/user');
const MongoDBStore = connectMongoDBSession(session);

var sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017/pfe',
  collection: 'sessions'
});
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  secret: 'secret', // You should specify a real secret here
  resave: false,
  saveUninitialized: true,
  store:sessionStore,
  cookie:{
    maxAge : 12121212
  }
}));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', './views');

// routes
app.use('/user',userRouter)
app.get('/', (req, res) => {
  res.render('index.html');
});
app.use('/auth', authRouter);
app.get('/test',(req, res) => {

  const origin =crypto.randomBytes(32)
  const encoded = base64.encode(origin)
  const decoded = base64.decode(encoded)
  const encoded1 = base64.encode(decoded)
  const decoded1 = base64.decode(encoded)
  console.log({origin , encoded ,decoded , encoded1 , decoded1});
  res.json({origin , encoded ,decoded});
});





const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URl);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();