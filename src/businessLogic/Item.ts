import { ItemAcess } from '../dataLayer/ItemAccess'
import { Item } from '../models/Item'
import { UpdateItem } from '../requests/item/UpdateItem'
import {v4 as uuidv4} from 'uuid'
import { Integer } from 'aws-sdk/clients/apigateway'
import { CreateItem } from '../requests/item/CreateItem'

const itemAcess = new ItemAcess()

export async function getAllItems(userId: string): Promise<Item[]> {
    return await itemAcess.getAllItems(userId)
}


export async function createItem(newItem: CreateItem, userId: string): Promise<Item> {
    
    const createdAt  = new Date().toISOString()
    const imageId = uuidv4()

    const item: Item = {
      userId,
      imageId,
      createdAt,
      name: newItem.name,
      description: newItem.description
    }

  return await itemAcess.createItem(item)
}


export async function updateItem(newItem: UpdateItem, userId: string, imageId: string) {
     await itemAcess.updateItem(newItem, userId, imageId)
}  

export async function checkItemExists(imageId: string): Promise<Integer> {
    return await itemAcess.checkIfItemExists(imageId)
}  

export async function createSignedUrl(imageId: string): string{
    return await itemAcess.createSignedUrl(imageId)
}

export async function getItem(imageId: string): Promise<Item[]>{
    return await itemAcess.getItem(imageId)
}

export async function deleteItem(userId: string, imageId: string){
    await itemAcess.deleteItem(userId, imageId)
    await itemAcess.deleteImageFromBucket(imageId)
}
  