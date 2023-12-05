import express from 'express'
import Hello from "./hello.js"
import Lab5 from "./Lab5.js";
import CourseRoutes from "./courses/routes.js";
import ModuleRoutes from "./modules/routes.js";
import mongoose from 'mongoose';
import UserRoutes from './Users/routes.js';
import session from 'express-session';

import cors from "cors";
import "dotenv/config";

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://a6--stirring-bombolone-0215ed.netlify.app'];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

const sessionOptions = {
  secret: 'any string',
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== 'development') {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: 'none',
    secure: true,
  };
}

app.use(session(sessionOptions));

app.use(express.json());

const CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kanbas';
mongoose.connect(CONNECTION_STRING);
UserRoutes(app);

ModuleRoutes(app);
CourseRoutes(app);
Hello(app)
Lab5(app);
app.listen(process.env.PORT || 4000);