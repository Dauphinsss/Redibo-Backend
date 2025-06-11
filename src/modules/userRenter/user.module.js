const userRenterService = require('./user.service');
const userRenterController = require('./user.controller');  

module.exports = {
    controller: userRenterController,
    service: userRenterService
};