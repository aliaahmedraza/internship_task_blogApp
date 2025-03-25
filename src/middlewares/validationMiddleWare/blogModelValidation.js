import Joi from 'joi';

export const createPostSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        'string.empty': 'Title is required.'
    }),
    content: Joi.string().min(1).required().messages({
        'string.empty': 'Content is required.'
    }),
    // author: Joi.string().min(1).required().messages({
    //     'string.empty': 'Author is required.'
    // })
});

export const updatePostSchema = Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().min(1),
    author: Joi.string().min(1)
}).min(1).messages({
    'object.min': 'At least one field (title, content, or author) is required for update.'
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
