import express from 'express'
import routes from './routes/index.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', routes )

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log('>>> Servidor escuchando en el puerto: ' + PORT + ' <<<')
})