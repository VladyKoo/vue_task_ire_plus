const fs = require('fs')

exports.readJson = (path, callBack) => {
  fs.watchFile(path, (curr, prev) => {
    console.log('file change')

    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return console.log('error file read: ', err)
      if (!data) return console.log('file invalid')
  
      const parseData = JSON.parse(data)
  
      if (
        parseData !== null &&
        parseData.constructor !== Array &&
        typeof parseData === 'object' &&
        Object.keys(parseData).length > 0
      )
        callBack(parseData)
      else console.log('file invalid')
    })
  })

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return console.log('error file read: ', err)
    if (!data) return console.log('file invalid')

    const parseData = JSON.parse(data)

    if (
      parseData !== null &&
      parseData.constructor !== Array &&
      typeof parseData === 'object' &&
      Object.keys(parseData).length > 0
    )
      callBack(parseData)
    else console.log('file invalid')
  })
}

exports.writeJson = (path, param) => {

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return console.log('error file read: ', err)
    if (!data) return console.log('file invalid')

    const parseData = JSON.parse(data)

    if (
      parseData !== null &&
      parseData.constructor !== Array &&
      typeof parseData === 'object' &&
      Object.keys(parseData).length > 0
    ){
      const changeParams = parseData.params.map(elem => {
        if (elem.name === param.name) return {...elem, value: param.value}
        return elem
      })

      parseData.params = changeParams

      fs.writeFile(path, JSON.stringify(parseData), (err) => {
        console.log('file write')
        if (err) return console.log('error----------------')  
      })

    } else console.log('file invalid')
  })

  
}
