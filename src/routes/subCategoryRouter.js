import express from 'express';
import { createSubCategory, getSubCategories } from '../controllers/SubCategoryController.js';
const subCategoryRouter=express.Router();

subCategoryRouter.post('/', createSubCategory);
subCategoryRouter.get('/:id', getSubCategories);

export {subCategoryRouter};