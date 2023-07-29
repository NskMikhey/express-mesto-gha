const usersRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.post('/users', createUser);
usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUser);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = usersRouter;
