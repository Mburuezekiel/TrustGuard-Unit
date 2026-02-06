const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { SageMakerRuntimeClient, InvokeEndpointCommand } = require('@aws-sdk/client-sagemaker-runtime');

// Initialize AWS clients
const snsClient = new SNSClient({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const sagemakerClient = new SageMakerRuntimeClient({ region: process.env.AWS_REGION });


/**
 * Publish alert to SNS topic
 */
const publishAlert = async (alertData) => {
  try {
    const command = new PublishCommand({
      TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      Message: JSON.stringify(alertData),
      Subject: `ScamAlert: ${alertData.threatLevel} Risk Detected`
    });

    const response = await snsClient.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error('SNS Publish Error:', error);
    throw new Error('Failed to publish alert');
  }
};

/**
 * Store reputation data in DynamoDB
 */
const storeReputation = async (phoneNumber, reputationData) => {
  try {
    const command = new PutItemCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Item: {
        phoneNumber: { S: phoneNumber },
        riskScore: { N: reputationData.riskScore.toString() },
        threatLevel: { S: reputationData.threatLevel },
        totalReports: { N: reputationData.totalReports.toString() },
        categories: { SS: reputationData.categories || ['unknown'] },
        lastUpdated: { S: new Date().toISOString() },
        data: { S: JSON.stringify(reputationData) }
      }
    });

    await dynamoClient.send(command);
    return { success: true };
  } catch (error) {
    console.error('DynamoDB Store Error:', error);
    throw new Error('Failed to store reputation data');
  }
};

/**
 * Get reputation data from DynamoDB
 */
const getReputation = async (phoneNumber) => {
  try {
    const command = new GetItemCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Key: {
        phoneNumber: { S: phoneNumber }
      }
    });

    const response = await dynamoClient.send(command);
    
    if (!response.Item) {
      return null;
    }

    return {
      phoneNumber: response.Item.phoneNumber.S,
      riskScore: parseInt(response.Item.riskScore.N),
      threatLevel: response.Item.threatLevel.S,
      totalReports: parseInt(response.Item.totalReports.N),
      categories: response.Item.categories.SS,
      lastUpdated: response.Item.lastUpdated.S,
      data: JSON.parse(response.Item.data.S)
    };
  } catch (error) {
    console.error('DynamoDB Get Error:', error);
    throw new Error('Failed to get reputation data');
  }
};

/**
 * Store evidence in S3 (encrypted)
 */
const storeEvidence = async (reportId, evidenceData) => {
  try {
    const key = `evidence/${reportId}/${Date.now()}.json`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: JSON.stringify(evidenceData),
      ContentType: 'application/json',
      ServerSideEncryption: 'AES256',
      Metadata: {
        reportId,
        uploadedAt: new Date().toISOString()
      }
    });

    await s3Client.send(command);
    return { success: true, key };
  } catch (error) {
    console.error('S3 Store Error:', error);
    throw new Error('Failed to store evidence');
  }
};

/**
 * Invoke SageMaker fraud detection model
 */
const invokeFraudModel = async (features) => {
  try {
    const command = new InvokeEndpointCommand({
      EndpointName: process.env.AWS_SAGEMAKER_ENDPOINT,
      ContentType: 'application/json',
      Body: JSON.stringify({ instances: [features] })
    });

    const response = await sagemakerClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.Body));
    
    return {
      predictions: result.predictions,
      confidence: result.predictions[0] * 100
    };
  } catch (error) {
    console.error('SageMaker Invoke Error:', error);
    // Fallback to default risk assessment
    return { predictions: [0.5], confidence: 50 };
  }
};

module.exports = {
  sendSMSNotification,
  publishAlert,
  storeReputation,
  getReputation,
  storeEvidence,
  invokeFraudModel
};
