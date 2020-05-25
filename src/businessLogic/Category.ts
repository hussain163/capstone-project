import {v4 as uuidv4} from 'uuid'
import { Integer } from 'aws-sdk/clients/apigateway'
import { CategoryAcess } from '../dataLayer/CategoryAccess'
import { Category } from '../models/Category'
import { CreateCategory } from '../requests/category/CreateCategory'
import { UpdateCategory } from '../requests/category/UpdateCategory'

const categoryAccess = new CategoryAcess()

export async function getAllCategories(): Promise<Category[]> {
    return await categoryAccess.getAllCategories()
}


export async function createCategory(newCategory: CreateCategory): Promise<Category> {
    
    const createdAt  = new Date().toISOString()
    const categoryId = uuidv4()

    const category: Category = {
      categoryId,
      createdAt,
      name: newCategory.name,
      description: newCategory.description,
      heading: newCategory.heading,
      subHeading: newCategory.subHeading
    }

  return await categoryAccess.createCategory(category)
}


export async function updateCategory(newCategory: UpdateCategory, categoryId: string) {
     await categoryAccess.updateCategory(newCategory, categoryId)
}  

export async function checkCategoryExists(categoryId: string): Promise<Integer> {
    return await categoryAccess.checkIfCategoryExists(categoryId)
}  

export async function getCategory(categoryId: string): Promise<Category[]>{
    return await categoryAccess.getCategory(categoryId)
}

export async function deleteCategory(categoryId: string){
    await categoryAccess.deleteCategory(categoryId)
}
  