
class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    if(process.env.NODE_ENV !== "test") {
      console.error(this.stack);
    }
  }
}

module.exports = ExpressError;
