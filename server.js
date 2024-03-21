const db = require('./db')
const app = require('./api')

const port = process.env.PORT || 4000

db.connect()

app.listen(port, () => console.log(`We are listening to port: ${port}`))