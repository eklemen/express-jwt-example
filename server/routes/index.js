import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('Hello from Generate-Express');
});

router.post('/login', (req, res, next) => {
  const {username} = req.body;
  const userId = '123'; // lookup from db
  const token = jwt.sign({username, userId}, 'shhh')
  console.log('token', token)
  res
    .cookie('token', token, {httpOnly: true})
    .send('You are logged in...');
});

router.get('/protected/dashboard', (req, res, next) => {
    console.log('req.user', req.user)
    res.send('Here is the dashboard (protected)')
});

export default router;
