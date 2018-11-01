const timeago = require('timeago.js')

const es_AR = function es_AR (number, index, total_sec) {
  return [
    ['poco tiempo', 'dentro de poco tiempo'],
    ['poco tiempo', 'dentro de poco tiempo'],
    ['unos momentos', 'dentro de unos momentos'],
    ['unos momentos', 'dentro de unos momentos'],
    ['1 hora', 'en 1 hora'],
    ['%s horas', 'en %s horas'],
    ['1 día', 'en 1 día'],
    ['%s días', 'en %s días'],
    ['1 semana', 'en 1 semana'],
    ['%s semanas', 'en %s semanas'],
    ['1 mes', 'en 1 mes'],
    ['%s meses', 'en %s meses'],
    ['1 año', 'en 1 año'],
    ['%s años', 'en %s años']
  ][index]
}

timeago.register('es_AR', es_AR)

module.exports = timeago
