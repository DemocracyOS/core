const timeago = require('timeago.js')

const es_AR = function es_AR(number, index, total_sec) {
  return [
    ['hace poco tiempo', 'dentro de poco tiempo'],
    ['hace poco tiempo', 'dentro de poco tiempo'],
    ['hace unos momentos', 'dentro de unos momentos'],
    ['hace unos momentos', 'dentro de unos momentos'],
    ['hace 1 hora', 'en 1 hora'],
    ['hace %s horas', 'en %s horas'],
    ['hace 1 día', 'en 1 día'],
    ['hace %s días', 'en %s días'],
    ['hace 1 semana', 'en 1 semana'],
    ['hace %s semanas', 'en %s semanas'],
    ['hace 1 mes', 'en 1 mes'],
    ['hace %s meses', 'en %s meses'],
    ['hace 1 año', 'en 1 año'],
    ['hace %s años', 'en %s años']
  ][index];
}

timeago.register('es_AR', es_AR)

module.exports = timeago