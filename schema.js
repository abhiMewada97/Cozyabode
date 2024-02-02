const Joi = require("joi");

// const listingSchema = Joi.object({
// joi ke pass ek object ani chahiya suppost that is called listing

// listing : Joi.object().require()
// schema validation ke according ek object honi chahiye or ye required honi chahiye means
// jabh bhi hamare pass koi request aye to ushke ander listing name ki object honi hi chahiye

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
        
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});