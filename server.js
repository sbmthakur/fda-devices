const express = require('express')
const app = express()

app.use(express.static('app/build'))
app.use(express.json())

app.get('/devices', async (req, res) => {

  const url = `https://api.fda.gov/device/udi.json?search=radiology&limit=5`

  const data = await fetch(url)
    .then(r => r.json())

  res.send(data.results) 
})

app.post('/classification', async (req, res) => {
  const { product_code } = req.body
  const url = `https://api.fda.gov/device/classification.json?search=product_code:${product_code}`

  const data = await fetch(url)
    .then(r => r.json())

  res.send(data.results[0])
})

app.post('/locations', async (req, res) => {
  const { product_code } = req.body
  //const url = `https://api.fda.gov/device/classification.json?search=product_code:${product_code}`
  const url = `https://api.fda.gov/device/registrationlisting.json?search=products.product_code:${product_code}`
  const data = await fetch(url)
    .then(r => r.json())

  if(!data.results) {
    return res.sendStatus(404)
  }

  res.send(data.results[0])
})

app.post('/recalls', async (req, res) => {
  const { product_code } = req.body
  const url = `https://api.fda.gov/device/recall.json?search=product_code:${product_code}`
  const data = await fetch(url)
    .then(r => r.json())

  if(!data.results) {
    return res.sendStatus(404)
  }

  res.send(data.results[0])
})


//app.get('/)

app.listen(3000, () => {
  console.log('app started!')
})
