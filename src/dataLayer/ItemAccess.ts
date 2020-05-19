import * as AWS from 'aws-sdk'
import { Item } from '../models/Item';
import { UpdateItem } from '../requests/item/UpdateItem';
import { Integer } from 'aws-sdk/clients/apigateway';

export class ItemAcess{

    constructor(
        private readonly doClient = new AWS.DynamoDB.DocumentClient(),
        private readonly s3 = new AWS.S3({signatureVersion: 'v4'}),
        private readonly imagesTable = process.env.IMAGES_TABLE,
        private readonly imagesIndex = process.env.IMAGES_INDEX,
        private readonly bucketName = process.env.IMAGES_BUCKET
    ){}

    async getAllItems(userId: string): Promise<Item[]>{
        console.log("Get all images with userId: ", userId)
        const result = await this.doClient.query({
            TableName: this.imagesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        
        return result.Items as Item[]
    }

    async createItem(item: Item): Promise<Item>{
        item.url = `https://${this.bucketName}.s3.amazonaws.com/${item.imageId}`
        console.log("Item added to db: ", item)

        await this.doClient.put({
            TableName: this.imagesTable,
            Item: item
        }).promise()
        
        return item
    }

    async updateItem(item: UpdateItem, userId: string, imageId: string){
        console.log("Update item with updateItem: {}, userId: {}, imageId: {}", item, userId, imageId)
        const result = await this.doClient.update({
            TableName: this.imagesTable,
            Key: {
                userId,
                imageId
            },
            UpdateExpression: 'SET #name = :name, description = :description',
            ExpressionAttributeNames: {
                '#name':'name' 
            },
            ExpressionAttributeValues: {
                ':name' : item.name,
                ':description' : item.description
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        console.log("Update item result: ", result)
        return result
    }

    async checkIfItemExists(imageId: string): Promise<Integer>{
        const result = await this.doClient.query({
            TableName: this.imagesTable,
            IndexName: this.imagesIndex,
            KeyConditionExpression: 'imageId = :imageId',
            ExpressionAttributeValues: {
              ':imageId': imageId
            }
          }).promise()  
          console.log("Checking item exists, imageId: ", imageId, ", result: ", result)
          return result.Count
    }

    async createSignedUrl(imageId: string): Promise<string>{
        return await this.s3.getSignedUrl('putObject',{
            Bucket: this.bucketName,
            Key: imageId,
            Expires: 3000
        })
    }

    async getItem(imageId: string): Promise<Item[]>{
        const item = await this.doClient.query({
            TableName: this.imagesTable,
            IndexName: this.imagesIndex,
            KeyConditionExpression: 'imageId = :imageId',
            ExpressionAttributeValues: {
                ':imageId' : imageId,
            }
        }).promise()
        // will return a list of a single item
        console.log("Get item result: ", item)
        return item.Items as Item[]
    }

    async deleteItem(userId:string, imageId: string){
        await this.doClient.delete({
            TableName: this.imagesTable,
            Key:{
                userId,
                imageId
            }
        }).promise()
    }

    async deleteImageFromBucket(imageId: string){
        await this.s3.deleteObject({
            Bucket: this.bucketName,
            Key: imageId
        }).promise()
        
    }

}