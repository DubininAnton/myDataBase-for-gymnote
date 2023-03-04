const cors = require('cors')

module.exports = cors({
  credentials: true,
  origin: 'http://localhost:3000',
})
