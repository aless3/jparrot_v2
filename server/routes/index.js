const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     description: get the index.html file
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: req
 *         description: request object from the client.
 *         required: true
 *       - name: res
 *         description: response object from the server.
 *         required: true
 *     responses:
 *       200:
 *         description: page served
 */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
