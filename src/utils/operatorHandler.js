export const operatorHandler = {
  null: () => { return null },

  contains: {
    text: 'contain',
    query: (query, field, val) => query.contains(field, val),
    evaluate: (actual, val) => actual.includes(val?.[0] || val)
  },

  notLike: {
    text: 'not matching',
    query: (query, field, val) => query.not(field, 'ilike', `%${val}%`),
    evaluate: (actual, val) => actual.indexOf(val) === -1
  },      

  in: {
    text: 'in',
    query: (query, field, val) => query.in(field, val),
    evaluate: (actual, val) => val.indexOf(actual) !== -1
  },

  eq: {
    text: 'equal to',
    query: (query, field, val) => query.eq(field, val),
    evaluate: (actual, val) => actual === val
  },

  gte: {
    text: '>=',
    query: (query, field, val) => query.gte(field, val),
    evaluate: (actual, val) => actual >= val
  },

  lte: { 
    text: '<=',
    query: (query, field, val) => query.lte(field, val),
    evaluate: (actual, val) => actual <= val
  },

  order: {
    text: '',
    query: (query, field, val) => query.order(field, { ascending: val }),
    evaluate: null
  }
};