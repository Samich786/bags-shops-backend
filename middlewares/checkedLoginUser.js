const isAdminLoggedin = require("../middlewares/isAdminLoggedin");
const isLogedin = require("../middlewares/isLogedin");

const checkLoggedIn = (req, res, next) => {
  // First, try the owner middleware

  isAdminLoggedin(req, res, (ownerErr) => {
    if (!ownerErr && req.owner) {
      // If no error and owner is set, proceed
      return next();
    }

    // If not an owner, try the user middleware
    isLogedin(req, res, (userErr) => {
      if (!userErr && req.user) {
        // If no error and user is set, proceed
        return next();
      }

      // If both fail, send unauthorized response
      res.status(401).send({
        data: {
          message: "Not Authorized",
          status: 401,
          data: null,
        },
      });
    });
  });
};

module.exports = checkLoggedIn;
