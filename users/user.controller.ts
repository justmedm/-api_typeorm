import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import validateRequest from '../_middleware/validate-request';
import { Role } from '../_helpers/role';
import { userService } from './user.service';

const router = express.Router();

// Define API routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

// Fetch all users
function getAll(req: Request, res: Response, next: NextFunction): void {
  userService.getAll()
    .then(users => res.json(users))
    .catch(next);
}

// Fetch a user by ID
function getById(req: Request, res: Response, next: NextFunction): void {
  userService.getById(parseInt(req.params.id))
    .then(user => res.json(user))
    .catch(next);
}

// Create a new user
function create(req: Request, res: Response, next: NextFunction): void {
  userService.create(req.body)
    .then(() => res.json({ message: 'User created' }))
    .catch(next);
}

// Update an existing user
function update(req: Request, res: Response, next: NextFunction): void {
  userService.update(parseInt(req.params.id), req.body)
    .then(() => res.json({ message: 'User updated' }))
    .catch(next);
}

// Delete a user
function _delete(req: Request, res: Response, next: NextFunction): void {
  userService.delete(parseInt(req.params.id))
    .then(() => res.json({ message: 'User deleted' }))
    .catch(next);
}

// Validation schema for creating a user
function createSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });
  validateRequest(req, next, schema);
}

// Validation schema for updating a user
function updateSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    title: Joi.string().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    role: Joi.string().valid(Role.Admin, Role.User).empty(''),
    email: Joi.string().email().empty(''),
    password: Joi.string().min(6).empty(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
  }).with('password', 'confirmPassword');
  validateRequest(req, next, schema);
}

export default router;