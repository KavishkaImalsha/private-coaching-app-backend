const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/test', (req, res) => {
  res.json({ message: "API is working" });
});

module.exports = app
