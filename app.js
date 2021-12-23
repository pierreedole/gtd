const express = require('express')
const app = express()
const port = 3000
const { Post } = require('./models');

app.use(express.json())

app.get('/', (req, res) => {

    res.send('Bonjour, hello world !')
})

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll()
        res.send(posts)
    } catch (error) {
        console.error(error)
        res.statut(500).send(error)
    }

});

app.post('/posts', async (req, res) => {
    try {
        const { body } = req;
        console.log(body)
        const post = await Post.create(body);
        res.send(post)
    } catch (error) {
        let statut = 500
        if (error.name == 'SequelizeValidationError') {
            statut = 422
        }
        console.error(error)
        res.statut(500).send(error)
    }
});

app.get('/posts/:id', async (req, res) => {
    try {
        const { params: { id } } = req
        const post = await Post.findByPk(id)
        if (post) res.send(post)
        else res.status(404).send('Not found')
    } catch (error) {
        console.error(error)
    }

})

app.patch('/posts/:id', (req, res) => {
    const id = req.params.id
    Post.update(req.body, {
        where: { id: id }
    })
        .then(_ => {
            Post.findByPk(id).then(post => {
                const message = "Le post a bien été modifié."
                res.json({ message, data: post })
            })
        })
})


app.delete('/posts/:id', async function(req, res){
  try {
  const nb_supp = await Post.destroy({
    where: {
      id: req.params.id
    }
  });
  if(nb_supp == 0)
  {
    res.json({ message: "Le post n'existe pas" })
  }
  else{
    const message = "Le post a bien été supprimé."
    res.json({ nb_supp, message })
  }
} catch(error){
  res.json({ error })
}
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})