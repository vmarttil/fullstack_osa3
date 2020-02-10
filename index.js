const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json()) 
app.use(morgan('tiny'))

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
    ]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.reduce((acc, person) => acc + 1, 0)} people</p>
                 <p>${new Date()}</p>`)
    
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name) {
        return response.status(400).json({ 
            error: 'name missing' 
          })
    } else if (!person.number) {
        return response.status(400).json({ 
            error: 'number missing' 
          })
    } else if (persons.some(p => p.name === person.name)) {
        return response.status(400).json({ 
            error: 'name already in phonebook' 
          })
    } else {
    person.id = Math.round(Math.random() * 10000)
    persons.push(person)
    response.json(person)
    }
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)