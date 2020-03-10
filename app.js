const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql')
const app = express();
const mongoose = require("mongoose")
//const events = []
const isAuth = require('./middleware/is-auth')
const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')
app.use(bodyParser.json())
app.use(isAuth)



app.use('/graphql',graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true  


} ));





mongoose
    .connect(`mongodb+srv://test:1234@cluster1-xoyq5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
        .then(()=>{
            app.listen(3000)
        })
        .catch(err => {
            console.log(err)
        });
/*`mongodb+srv://${process.env.MONGO_USER}:${
            process.env.MONGO_PASSWORD
        }@cluster1-xoyq5.mongodb.net/test?retryWrites=true&w=majority` */
