'use strict'

function createQuery (query) {
  const { name, type, isArray } = query

  const args = query.arguments.map(arg => arg.name)

  const queryArgs = args.length ? `const { ${args.join(', ')} } = args` : ''

  const databaseName = `${type.toLowerCase()}s`
  const databseRef = `firebase.database().ref('${databaseName}')`

  let response

  if (name === `get${type}ByKey`) {
    response = `
      const ref = firebase.database().ref(\`/${databaseName}/$\{key}\`)
      const result = (await ref.once('value')).val()
      const data = Object.assign({ key }, result)

      return data
    `
  } else if (isArray) {
    response = `
      const ref = ${databseRef}
      const result = []
      await ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          
          const data = Object.assign({ key: childKey }, childData)
          result.push(data)
        });
      });
      return result
    `
  } else {
    response = `
      const ref = ${databseRef}
      const result = await new Promise(resolve => {
        ref.orderByChild('${args[0]}').equalTo(${args[0]}).on('child_added', function(snapshot) {
          const key = snapshot.key;
          const data = snapshot.val();
            
          resolve(Object.assign({ key }, data))
        })
      });
      return result
    `
  }

  const createdQuery = `
    const ${name} = async (obj, args, { firebase }) => {
      ${queryArgs}
      ${response}
    }
  `

  return createdQuery
}

function createMutation (mutation) {
  const { name, type } = mutation

  const databaseName = `${type.toLowerCase()}s`
  const databseRef = `firebase.database().ref().child('${databaseName}').push({ ...input })`

  const createdMutation = `
    const ${name} = async (obj, { input }, { firebase }) => {
      const ref = ${databseRef}

      const result = Object.assign({ key: ref.key }, input)
      return result
    }
  `

  return createdMutation
}

module.exports = { createQuery, createMutation }
