const WebSocket = require('ws')
const cors = require('cors')
const path = require('path')

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })

const { readJson, writeJson } = require('./readJson')

const host = 'localhost'
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', express.static(path.join(__dirname, '../dist')))

let file = null

const handleData = (data) => {
  const allElements = []
  if (!data.params) return null
  const filteredParams = data.params.filter((item) => {
    if (item?.groupId && item.groupId.findIndex((el) => el === 1) >= 0 ) return true       
    return false
  })
  const result = filteredParams.map(item => {
    if (item?.relations) {
      const newRelations = item.relations.map(relation => {
        const newItem = data.params.find(elem => elem.name === relation)
        
        if (newItem) return { name: relation, value: newItem.value, measureUnit: newItem.measureUnit, possibleValues: newItem.possibleValues }
        return {name: relation, value: null, measureUnit: null, possibleValues: null}
      })
      item.relations = newRelations      
    }
    return item
  })
  return result
}

readJson(path.join(__dirname, '../params14.json'), (data) => {
  file = handleData(data)
})

wss.on('connection', function(ws) {
  console.log('new connection')
  ws.send(JSON.stringify(file), () => {})

  const id = setInterval(function() {
    ws.send(JSON.stringify(file), () => {})    
  }, 10000)

  ws.on('message', (message) => {
    if (!message) return
    const data = JSON.parse(message)
    writeJson(path.join(__dirname, '../params14.json'), data)
  })

  ws.on('close', () => {
    console.log('stopping client interval')
    clearInterval(id)
  })
})

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})
