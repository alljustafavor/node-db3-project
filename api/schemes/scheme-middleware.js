const Schemes = require('./scheme-model.js')

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const scheme = await Schemes.findById(req.params.scheme_id) ;
  
  console.log('Scheme ID:', req.params.scheme_id);
  if (scheme) {
    next();
  } else {
    next({ status: 404, message: `scheme with scheme_id ${req.params.scheme_id} not found` });
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;
  if (typeof scheme_name === 'string' && scheme_name.trim().length > 0) {
    next();
  } else {
    next({ status: 400, message: "invalid scheme_name" });
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;
  if (typeof instructions === 'string' && instructions.trim().length > 0 &&
      typeof step_number === 'number' && step_number > 0) {
    next();
  } else {
    next({ status: 400, message: "invalid step" });
  }
};


module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
