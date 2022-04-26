// user routes

const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { authUser, requireLogin, requireAdmin } = require('../middleware/auth');

router.get('/', authUser, requireLogin, async function(req, res, next) {
  try {
    let users = await User.getAll();
    return res.json({ users });
  } catch {
    try {
      let users = await User.getList();
      return res.json({ users });
    } catch (err) {
      return next(err);
    };
  };
});

router.get('/:username', authUser, requireLogin, async function(
  req,
  res,
  next
) {
  try {
    if (!req.curr_admin && req.curr_username !== req.params.username) {
      throw new ExpressError('Only  that user or admin can edit a user.', 401);
    }

    let user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  };
});

router.patch('/:username', authUser, requireLogin, requireAdmin, async function(
  req,
  res,
  next
) {
  try {
    if (!req.curr_admin && req.curr_username !== req.params.username) {
      throw new ExpressError('Only  that user or admin can edit a user.', 401);
    }

    // get fields to change; remove token so we don't try to change it
    let fields = { ...req.body };
    delete fields._token;

    let user = await User.update(req.params.username, fields);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:username', authUser, requireAdmin, async function(
  req,
  res,
  next
) {
  try {
    User.delete(req.params.username);
    return res.json({ message: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;  
