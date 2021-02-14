const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { schema, s } = require('./schema');

const app = express();
app.get('/schema.gql', (req, res) => {
    res.send(`<pre>${s}</pre>`);
});
app.use(
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.listen(5500, () => {
    console.log('listening on *:5500');
});
