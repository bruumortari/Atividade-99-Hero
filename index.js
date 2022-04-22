//Configuração Inicial
const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Ler JSON - middleware
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

//Rotas da API
const heroesRoutes = require('./routes/heroesRoutes');
app.use('/hero', heroesRoutes);

//Conectando ao banco
const DB_USER = 'bruna';
const DB_PASSWORD = encodeURIComponent('Q5G8hoV2syQq2A54');

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@clusterapi99hero.z5byv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
.then(() => {
    console.log('Conectamos ao MongoDB');
    app.listen(27017);
})
.catch((err) => console.log(err));



