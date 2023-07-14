"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _config = _interopRequireDefault(require("./config"));
var _express = _interopRequireDefault(require("express"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _http = _interopRequireDefault(require("http"));
var _cors = _interopRequireDefault(require("cors"));
var _expressMongoSanitize = _interopRequireDefault(require("express-mongo-sanitize"));
var _helmet = _interopRequireDefault(require("helmet"));
var _nocache = _interopRequireDefault(require("nocache"));
var _mongo = _interopRequireDefault(require("./utils/mongo"));
var _logging = _interopRequireDefault(require("./middlewares/logging"));
var _error = _interopRequireDefault(require("./middlewares/error"));
var _cors2 = _interopRequireDefault(require("./middlewares/cors"));
var _user = _interopRequireDefault(require("./routes/user"));
var _index = _interopRequireDefault(require("./routes/index"));
var _post = _interopRequireDefault(require("./routes/post"));
var _logger = _interopRequireDefault(require("./utils/logger"));
require('express-async-errors');
var port = _config.default.port;
var app = (0, _express.default)();
var httpServer = _http.default.createServer(app);
(0, _mongo.default)();
app.use((0, _cookieParser.default)());
app.use((0, _cors.default)({
  origin: [_config.default.frontend_url, _config.default.backend_url],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(_cors2.default.cors);
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.disable('x-powered-by');
app.use((0, _expressMongoSanitize.default)());
app.use((0, _helmet.default)());
app.use(_logging.default.logging);
app.use((0, _nocache.default)());
app.use('/', _index.default);
app.use('/api/user', _user.default);
app.use('/api/post', _post.default);
app.use(_error.default.endPoint404);
app.use(_error.default.errorHandler);
httpServer.listen(port, function () {
  _logger.default.http("Server is running on port ".concat(port));
});