const sqlliteOptions = {
    client: 'sqlite3',
    connection: {
        filename: './db/ecommerce.sqlite'
    }
}

module.exports = {
    sqlliteOptions
}