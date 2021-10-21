import express from 'express';
import { Create } from '../controllers/crud.controller';
import { IVtiCodeDocument } from '../interfaces/models.interface';
import { VtiCodeModel } from '../models/vti_code.model';
import { createVtiCodeValidation } from '../validations/vti_code.validation';
const router = express.Router();

router.post('/create', Create<IVtiCodeDocument>(VtiCodeModel, createVtiCodeValidation));

export const VtiCodeRoute = { path: '/vtiCode', router };
