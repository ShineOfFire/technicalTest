import express from 'express';
import bodyParser from 'body-parser';
let app = express();

app.use(bodyParser.json());

let todos = [{ id: 'jkhsdjkf', content: 'review this code' }];

/**
 * - cette route devrait etre appeler en premiere et jamais en derniere
 * - envoyer un status plutot qu'envoyer une string en dure
 */
app.get('/', (req, res) => {
  res.sendStatus(200);
});

/**
 * - destructuré le body dans todos alors que nous le verifion pas n'est pas du tout bon. un personne pourrais injecté des valeurs en plus voir peut etre meme faire une injection xss..
 * - il faut aussi verifier si content est bien une string et renvoyer une string
 * - le cas d'erreur n'est pas geré avec un code erreur
 */
app.post('/todos', (req, res) => {
  if ('content' in req.body) {
    todos.push({
      ...req.body,
      id: (Math.random() * Math.pow(2, 54)).toString(36)
    });
    res.sendStatus(201);
  } else {
    res.status(400).send({ error: 'Arguments error' });
  }
});

/**
 * - ici ont perd l'immutabilité de todos en l'ecrasant par req.body sans verifier au prealable si la valeur existe et qu'elle valeur ont souhaite modifier
 * - apres verification de l'id et que content est bien present dans l'objet, nous l'injecton dans todos
 */
app.put('/todos/:id', (req, res) => {
  const ifIdExist = todos.find(o => o.id === req.params.id)

  if (ifIdExist && 'content' in req.body) {
    ifIdExist.content = req.body.content;
    res.sendStatus(200);
  } else {
    res.status(400).send({ error: 'Id isn\'t updatable, because isn\'t exist' });
  }
});

/**
 * - nous avons 2 routes equivalentes :id en get et all en get il faudrait les modifier
 * - le probleme ici est que l'id est pas recuperer depuis req.params donc impossible de recuperer le bon element du tableau todos
 * - todos[req.params.id] n'existe pas il faudrait plutot find dans le tableau par l'id pour recuperer le bon element du tableau
 * - renvoyer un code erreur si l'id n'existe pas
 */
app.get('/todos/:id', (req, res) => {
  const elementFinded = todos.find(o => o.id === req.params.id)
  if (elementFinded) {
    res.send(elementFinded);
  } else {
    res.status(400).send({ error: 'Id not exist' });
  }
});

/**
 * - cette route passe en priorité sur celle au dessus en get :id donc change la route par todos/all par todos qui n'existe pas
 */
app.get('/todos', (req, res) => {
  res.send(todos);
});

app.listen(8080, () => {
  console.log('Listening on port 8080...\n');
});