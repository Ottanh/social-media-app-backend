import express from 'express';
import userService from '../services/userService';

const router = express.Router();

router.get('/', (_req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  res.json(userService.getUsers());
});

export default router;