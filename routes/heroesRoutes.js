//Importando
const routes = require('express').Router();
const Hero = require('../models/Hero');

//Comando HTTP Post -> Adicionar um herói no banco
routes.post('/:codename', async (req, res) => {

    //Os atributos do herói serão recebidos pelo que for escrito no body (Postman)
    const { name, codename, disasters, cities, teamwork } = req.body;

    //Se um dos atributos não for preenchido, temos uma mensagem de erro
    if(!name || !codename || !cities || !disasters) {
        res.status(422).json({ msg: 'Insira as informações do herói.' });
        return;
    }

    //Checar se a cidade é válida
    const lista1 = cities.split(', ');
    const aux1 = [ 'New York', 'Tóquio', 'Rio de Janeiro' ];
    lista1.forEach(function(novalista1)
    {
        if(aux1.includes(novalista1) == false) {
                res.status(422).json({ msg: 'Insira uma cidade válida' });
                return;
            }
    });

    //Checar se a área de atuação é válida
    const lista2 = disasters.split(', ');
    const aux2 = [ 'Assalto a bancos', 'Desastres naturais', 'Monstros gigantes' ];
    lista2.forEach(function(novalista2)
    {
        if(aux2.includes(novalista2) == false) {
                res.status(422).json({ msg: 'Insira um desastre válido' });
                return;
            }
    });

    const hero = {
        name,
        codename,
        disasters,
        cities,
        teamwork,
    };

    //Se tentarem cadastrar um mesmo herói, exibirá uma mensagem de erro
    const codename_req = req.params.codename;
    const hero_aux = await Hero.findOne({ codename: codename_req });
    if(!hero_aux) {
        try {
            //Checar se o nome é diferente do codinome
            if(name != codename) {
                await Hero.create(hero);
                res.status(201).json({ msg: 'Herói adicionado!' });
            } else {
                res.status(422).json({ msg: 'O codinome deve ser diferente do nome' });
                return;
            }
        } catch(error) {
            res.status(500).json({ error: error });
        }
    }  else {
        res.status(422).json({ msg: 'O herói já está cadastrado.' });
        return;
    }
});

//Comando HTTP GET -> Visualizar as informações de todos os heróis que estão no banco
routes.get('/', async (req, res) => {
    try {
        const heroes = await Hero.find();
            res.status(200).send(heroes);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

//Comando HTTP GET -> Visualizar as informações de um herói (chave de busca: codename)
routes.get('/:codename', async (req, res) => {
    const codename_req = req.params.codename;
    try {
        const heroes = await Hero.findOne({ codename: codename_req });
        if(!heroes) {
            res.status(204).json({ msg: 'O herói não foi encontrado.' });
            return;
        } else {
            res.status(200).json(heroes);
        }
    } catch(error) {
        res.status(500).json({ error: error});
    }
});

//Comando HTTP GET -> Visualizar as informações de heróis com
//a mesma área de atuação (chave de busca: disasters)
routes.get('/disasters/:disasters', async (req, res) => {
    const disasters_req = req.params.disasters;
    try {
        const heroes = await Hero.find({ disasters: disasters_req });
        if(!heroes) {
            res.status(204).json({ msg: 'O herói não foi encontrado.' });
            return;
        } else {
            res.status(200).json(heroes);
        }
    } catch(error) {
        res.status(500).json({ error: error });
    }
});

//Comando HTTP DELETE -> Deletar um herói
routes.delete('/:codename', async (req, res) => {
    const codename_req = req.params.codename;
    const hero = await Hero.findOne({ codename: codename_req });
    if(!hero) {
        res.status(204).json({ msg: 'O herói não está cadastrado.' });
        return;
    }
    try {
        await Hero.deleteOne({ codename: codename_req })
        res.status(200).json({ msg: 'Herói removido.' })
    } catch(error) {
        res.status(500).json({ error: error });
    }
});

//Comando HTTP PUT -> Atualizar as informações de um herói (chave de busca: codename)
routes.put('/:codename', async (req, res) => {
    const { name, codename, disasters, cities, teamwork } = req.body;

    const codename_req = req.params.codename;
    const hero_aux = await Hero.findOne({ codename: codename_req });
    if(!hero_aux) {
        try {
            res.status(204).json({ msg: 'Herói não está cadastrado!' });
        } catch(error) {
            res.status(500).json({ error: error });
        }
    }  else {
                await Hero.updateOne({ name: name, cities: cities, disasters: disasters, codename: codename, teamwork: teamwork });
                res.status(201).json({ msg: 'As informações do herói foram atualizadas!' });
    }
});

module.exports = routes;