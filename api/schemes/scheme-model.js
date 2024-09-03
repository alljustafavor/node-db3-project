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
  console.log('Received scheme_id:', scheme_id);
  let rows = await db('schemes as sc')
    .select('sc.scheme_id', 'sc.scheme_name', 'st.step_id', 'st.step_number', 'st.instructions')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'ASC');

  if (rows.length === 0) {
    return null;
  }

  let result = rows.reduce((acc, row) => {
    if (!acc.scheme_id) {
      acc.scheme_id = row.scheme_id;
      acc.scheme_name = row.scheme_name;
      acc.steps = [];
    }
    if (row.step_id) {
      acc.steps.push({ step_id: row.step_id, step_number: row.step_number, instructions: row.instructions });
    }
    return acc;
  }, {});

  return result;
}




async function findSteps(scheme_id) {
  let rows = await db('schemes as sc')
    .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'ASC')

  if (!rows[0].step_id) {
    return []
  } else {
    return rows 
  } 
}


async function add(scheme) {
    return db('schemes').insert(scheme)
      .then(([id]) => {
        return findById(id)
    });
}


async function addStep(scheme_id, step) {
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to all the steps belonging to the given `scheme_id`,
    including the newly created one.
  */

  // Insert the new step into the 'steps' table
  let row = await db('steps').insert({
    scheme_id: scheme_id,
    instructions: step.instructions,
    step_number: step.step_number
  });

  // Fetch all steps for the given scheme_id, ordered by step_number
  const result = await findSteps(scheme_id) // Ensure steps are ordered by step_number

  return result;
}



module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
