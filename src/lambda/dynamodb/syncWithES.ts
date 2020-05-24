import 'source-map-support/register'
import { DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda'
import * as elasticsearch from 'elasticsearch'
import * as httpEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {

  console.log('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record))
    try{

    
    if(record.eventName == 'REMOVE'){
      console.log('Removing record', JSON.stringify(record.dynamodb.Keys.imageId.S))
      await es.delete({
        index: 'image-index',
        type: 'image',
        id: record.dynamodb.Keys.imageId.S,
      })
    }

    if(record.eventName == 'MODIFY'){
      continue
    }


    if (record.eventName == 'INSERT') {
      const newItem = record.dynamodb.NewImage

    const imageId = newItem.imageId.S

    const body = {
      imageId: newItem.imageId.S,
      userId: newItem.userId.S,
      name: newItem.name.S,
      createdAt: newItem.createdAt.S,
      description: newItem.description.S
    }

    await es.index({
      index: 'image-index',
      type: 'image',
      id: imageId,
      body
    })
    }

    }catch (e){
      console.log("Error while syncing with elastic search: ", e);
    }
    
  }

}
