const db = require('../../data/db-config');

async function find() {
  const rows = await db('schemes as sc')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id', 'ASC')

  return rows
}

async function findById(scheme_id) {
  let rows = await db('schemes as sc')
    .select('sc.scheme_name', 'st.*')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'ASC')

  let result = rows.reduce((acc, row) => {
    if (row.step_id) {
      acc.steps.push({ step_id: row.step_id, step_number: row.step_number, instructions: row.instructions })
    }
    return acc
    
  }, { scheme_id: rows[0].scheme_id, scheme_name: rows[0].scheme_name, steps: [] })

  return result
}


function findSteps(scheme_id) {
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
