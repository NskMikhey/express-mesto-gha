const usersRouter = require('express').Router();
const {
  getUsers,
  getUser,
  getUserMe,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUser);
usersRouter.get('/users/me', getUserMe);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = usersRouter;
