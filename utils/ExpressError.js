/**
 * A DIY class throws error.
 */
class ExpressError extends Error{
    constructor(msg, status){
        super();
        console.log(`Called in ExpressError class`);
        this.msg = msg;
        this.status = status;
    }
}

module.exports = ExpressError