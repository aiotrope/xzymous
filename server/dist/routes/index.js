"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
const router = _express.default.Router();
router.get('/', (req, res) => {
  const pong = 'Hello World! From Xzymous.';
  res.status(200).json({
    ping: pong
  });
});
var _default = router;
exports.default = _default;