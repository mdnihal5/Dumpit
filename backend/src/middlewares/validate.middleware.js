const { ErrorResponse } = require('./error.middleware')

const validate = (schema) => (req, res, next) => {
  try {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    }
    
    // Validate request parts (params, query, body) if they are defined in the schema
    if (schema.params) {
      const { error } = schema.params.validate(req.params, validationOptions)
      if (error) {
        throw error
      }
    }
    
    if (schema.query) {
      const { error } = schema.query.validate(req.query, validationOptions)
      if (error) {
        throw error
      }
    }
    
    if (schema.body) {
      const { error } = schema.body.validate(req.body, validationOptions)
      if (error) {
        throw error
      }
    }
    
    next()
  } catch (error) {
    // Handle Joi validation errors
    if (error.details) {
      const errors = error.details.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
      
      return next(new ErrorResponse(`Validation error: ${JSON.stringify(errors)}`, 400))
    }
    next(error)
  }
}

module.exports = { validate }
