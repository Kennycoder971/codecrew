import Joi from "joi";

export const userValidationSchema = Joi.object({
  name: Joi.string().max(50).required().label("Nom"),
  image: Joi.string().optional(),
  email: Joi.string().email().required().label("E-mail"),
  password: Joi.string().min(6).required().label("Mot de passe"),
}).messages({
  "any.required": 'Le champ "{#label}" est obligatoire',
  "string.empty": 'Le champ "{#label}" ne doit pas être vide',
  "string.email": 'Le champ "{#label}" doit être une adresse e-mail valide',
  "string.min":
    'Le champ "{#label}" doit contenir au moins {#limit} caractères',
  "number.integer": 'Le champ "{#label}" doit être un entier',
  "number.min": 'Le champ "{#label}" doit être supérieur ou égal à {#limit}',
  "number.max": 'Le champ "{#label}" doit être inférieur ou égal à {#limit}',
});
