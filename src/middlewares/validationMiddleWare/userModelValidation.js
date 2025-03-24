import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name should have a minimum length of {#limit} characters.'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email address.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required.',
        'string.min': 'Password should have a minimum length of {#limit} characters.'
    }),
    profileImage: Joi.string().uri().optional().messages({
        'string.uri': 'Profile image must be a valid URL.'
    }),
    bio: Joi.string().max(300).optional().messages({
        'string.max': 'Bio must be at most {#limit} characters.'
    }),
    role: Joi.string().valid('user', 'admin').optional().default('user').messages({
        'any.only': 'Role must be either user or admin.'
    }),
    socialLinks: Joi.object().pattern(Joi.string(), Joi.string()).optional().messages({
        'object.base': 'Social links must be an object with string key-value pairs.'
    })
});

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
