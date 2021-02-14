const express = require('express');
const egql = require('express-graphql');

const schema = require('./schema');

const app = express();
app.get('/schema.gql', (req, res) => {
    res.send(`<pre>${schema.s}</pre>`);
});
app.use(
    egql.graphqlHTTP({
        schema: schema.schema,
        graphiql: true,
    })
);

app.listen(5500, () => {
    console.log('listening on *:5500');
});
