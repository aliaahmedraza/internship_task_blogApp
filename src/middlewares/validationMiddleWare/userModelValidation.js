import Joi from 'joi';

export const createUserSchema = Joi.object({
    // User's full name is required with a minimum length of 3 characters.
    name: Joi.string().min(3).required().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name should have a minimum length of {#limit} characters.'
    }),
    // Email must be valid and is required.
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address.'
    }),
    // Password is required and must be at least 6 characters long.
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required.',
        'string.min': 'Password should have a minimum length of {#limit} characters.'
    }),
    // Profile image URL is optional but must be a valid URI if provided.
    profileImage: Joi.string().uri().optional().messages({
        'string.uri': 'Profile image must be a valid URL.'
    }),
    // Bio is optional with a maximum length of 300 characters.
    bio: Joi.string().max(300).optional().messages({
        'string.max': 'Bio must be at most {#limit} characters.'
    }),
    // Role is optional and must be either 'user' or 'admin'. Defaults to 'user'.
    role: Joi.string().valid('user', 'admin').optional().default('user').messages({
        'any.only': 'Role must be either user or admin.'
    }),
    // Social links is an optional object where both keys and values are strings.
    socialLinks: Joi.object().pattern(Joi.string(), Joi.string()).optional().messages({
        'object.base': 'Social links must be an object with string key-value pairs.'
    })
});

// Generic middleware for validating user requests using the provided schema.
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    };
};
