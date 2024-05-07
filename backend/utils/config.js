require('dotenv').config()

const PORT = process.env.PORT
const password = process.env.ATLAS_PASS
const user = process.env.ATLAS_USER
const dbname = process.env.NODE_ENV === 'test' ? 'eventi-api-test' : 'eventi-api'
const DB_URI = `mongodb+srv://${user}:${password}@cluster0.g9pvvju.mongodb.net/${dbname}?retryWrites=true&w=majority`

module.exports = {PORT, DB_URI}
