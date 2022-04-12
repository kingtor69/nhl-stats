
const express = require('express');
const app = express();
const ExpressError = require('./helpers/expressError');

app.use(express.json());

// const userRoutes = require('./routes/users');
// const statsRoutes = require('./routes/stats');

// app.use('/users', userRoutes);
// app.use('/stats', statsRoutes);

// 404 handler
app.use ((req, res, next) => {
    const err = new ExpressError("Not Found", 404);

    return next(err);
});

// general error handler
app.use((err, req,res,next) => {
    res.status(err.status || 500);

    return req.json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;
