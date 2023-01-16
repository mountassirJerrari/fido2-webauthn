require('dotenv').config();
const  base64 = require("base64-arraybuffer")
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


//creating a session store
try {
  var isSessionStore = true
  var sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URl,
    collection: 'sessions'
  });
} catch (error) {
  isSessionStore = false ;
  console.log("session will not be stored IN the DB");
}

// middleware
app.use(express.static('public'));
app.use(express.json());
if (isSessionStore) {
  app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: false,
    proxy: true,
    store : sessionStore,
    cookie:{
      httpOnly: true,
      secure: false,
      sameSite: 'none'
    }
  }));
} else {
  app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: false,
    proxy: true,
    cookie:{
      httpOnly: true,
      secure: false,
      sameSite: 'none'
    }
  }));
}

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', './views');

// routes
app.use('/user',userRouter)
app.get('/', (req, res) => {
  res.render('index.html');
});
app.use('/auth', authRouter);
//testing route
app.get('/test',(req, res) => {

  const useragent =req.get('host');
  console.log(useragent);
  res.json(useragent);
});




// starting the server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URl);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();