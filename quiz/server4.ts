import path from 'path';
import  { promises as fsPromises } from 'fs';
import express, { Response, NextFunction } from 'express';
import cors from 'cors';
import readUsers from './readUsers';
import writeUsers from './writeUsers';
import User, { UserRequest } from './types';

const app = express();
const port = 8000;
const dataFile = '../data/users.json';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
let users: User[];

// a synchronous function that reads the user data from the file
async function readUsersFile() {
  try {
    console.log('reading file ... ');
    const data = await fsPromises.readFile(path.resolve(__dirname, dataFile));
    users = JSON.parse(data.toString());
    console.log('File read successfully');
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

// a middleware function that adds the users data to the request object
const addMsgToRequest = async (req: UserRequest, res: Response, next: NextFunction) => {
  await readUsersFile();
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};
app.use(addMsgToRequest)
app.use('/read',readUsers);
app.use('/write',writeUsers);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
