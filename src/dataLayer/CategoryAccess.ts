import * as AWS from 'aws-sdk'
import { Category } from '../models/Category';
import { Integer } from 'aws-sdk/clients/apigateway';
import { UpdateCategory } from '../requests/category/UpdateCategory';

// const XAWS = AWSXRay.captureAWS(AWS)

export class CategoryAcess{

    constructor(
        private readonly doClient = new AWS.DynamoDB.DocumentClient(),
        private readonly categoriesTable = process.env.CATEGORIES_TABLE,
    ){}

    async getAllCategories(): Promise<Category[]>{
        console.log("Get all categories")
        const result = await this.doClient.scan({
            TableName: this.categoriesTable,
        }).promise()
        
        return result.Items as Category[]
    }

    async createCategory(category: Category): Promise<Category>{
        
        console.log("Category added to db: ", category)

        await this.doClient.put({
            TableName: this.categoriesTable,
            Item: category
        }).promise()
        
        return category
    }

    async updateCategory(category: UpdateCategory, categoryId: string){
        console.log("Update category with Updatecategory: {}, imageId: {}", category, categoryId)
        const result = await this.doClient.update({
            TableName: this.categoriesTable,
            Key: {
                categoryId
            },
            UpdateExpression: 'SET description = :description, heading = :heading, subHeading = :subHeading',
            ExpressionAttributeValues: {
                ':description' : category.description,
                ':heading' : category.heading,
                ':subheading' : category.subHeading
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        console.log("Update category result: ", result)
        return result
    }

    async checkIfCategoryExists(categoryId: string): Promise<Integer>{
        const result = await this.doClient.query({
            TableName: this.categoriesTable,
            KeyConditionExpression: 'categoryId = :categoryId',
            ExpressionAttributeValues: {
              ':categoryId' : categoryId
            }
          }).promise()  
          console.log("Checking category exists, categoryId: ", categoryId, ", result: ", result)
          return result.Count
    }


    async getCategory(categoryId: string): Promise<Category[]>{
        const item = await this.doClient.query({
            TableName: this.categoriesTable,
            KeyConditionExpression: 'categoryId = :categoryId',
            ExpressionAttributeValues: {
                ':categoryId' : categoryId,
            }
        }).promise()
        // will return a list of a single item
        console.log("Get Category result: ", item)
        return item.Items as Category[]
    }

    async deleteCategory(categoryId:string){
        await this.doClient.delete({
            TableName: this.categoriesTable,
            Key:{
                categoryId
            }
        }).promise()
    }

}