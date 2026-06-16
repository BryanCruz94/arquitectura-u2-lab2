const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const sequelize = require('./database/database');

const Director = require('./models/Director');
const Pelicula = require('./models/Pelicula');
const Actor = require('./models/Actor');
const Elenco = require('./models/Elenco');

Director.hasMany(Pelicula);
Pelicula.belongsTo(Director);

Pelicula.belongsToMany(Actor, {
    through: Elenco,
    foreignKey: 'peliculaId',
    otherKey: 'actorId'
});

Actor.belongsToMany(Pelicula, {
    through: Elenco,
    foreignKey: 'actorId',
    otherKey: 'peliculaId'
});

const schema = require('./schema/schema');

const app = express();

app.use('/graphql',
    graphqlHTTP({
        schema,
        graphiql: true
    })
);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Servidor ejecutándose');
        });
    })
    .catch((error) => {
        console.log(error);
    });