const isAdminLoggedin = require("../middlewares/isAdminLoggedin");
const isLogedin = require("../middlewares/isLogedin");

const checkLoggedIn = (req, res, next) => {
  isAdminLoggedin(req, res, () => {
    if (req.owner) {
      // Admin/Owner is authenticated, proceed
      return next();
    }

    // If not an admin, proceed to user authentication
    isLogedin(req, res, () => {
      if (req.user) {
        // User is authenticated, proceed
        return next();
      }

      // If both fail, send unauthorized response
      return res.status(401).json({
        message: "Not Authorized",
        status: 401,
      });
    });
  });
};

module.exports = checkLoggedIn;
