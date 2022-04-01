/**
 * Function returns a function that executes another function with
 * the name of the first function(func) and the params of the returned function
 * then catch the error and calling the next() middleware of Express.
 * 给方法套上后, 方法直接带catch.并执行next(处理error的Middleware)
 * @param {*} func
 * @returns
 */
module.exports = (func) => {
  return (req, res, next) => {
    // console.log("error Catch");
    func(req, res, next).catch(next);
  };
};
