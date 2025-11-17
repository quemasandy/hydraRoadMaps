/**
 * AWS CDK (Cloud Development Kit) con TypeScript
 *
 * CDK permite definir infraestructura usando código TypeScript real
 * Es el más poderoso y flexible de las 3 opciones (SAM, Serverless, CDK)
 *
 * Comandos útiles:
 *   cdk init app --language typescript  # Inicializar proyecto
 *   cdk synth                          # Generar CloudFormation template
 *   cdk diff                           # Ver cambios antes de deploy
 *   cdk deploy                         # Desplegar stack
 *   cdk destroy                        # Eliminar todo
 *   cdk watch                          # Auto-deploy on changes (dev)
 *   cdk ls                             # Listar stacks
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

/**
 * ============================================================================
 * Stack Principal
 * ============================================================================
 */
export class ServerlessAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Obtener stage del context o usar 'dev'
    const stage = this.node.tryGetContext('stage') || 'dev';

    // --------------------------------------------------------------------------
    // 1. DynamoDB Table
    // --------------------------------------------------------------------------
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: `${stage}-users`,
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

      // Habilitar DynamoDB Streams
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,

      // Point-in-time recovery
      pointInTimeRecovery: true,

      // TTL attribute
      timeToLiveAttribute: 'ttl',

      // Removal policy (en producción usar RETAIN)
      removalPolicy:
        stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // GSI para buscar por email
    usersTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: {
        name: 'email',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // --------------------------------------------------------------------------
    // 2. Lambda Functions con NodejsFunction (bundling automático)
    // --------------------------------------------------------------------------

    // Lambda: Get All Users
    const getUsersFunction = new NodejsFunction(this, 'GetUsersFunction', {
      entry: 'src/handlers/users.ts',
      handler: 'getAll',
      functionName: `${stage}-getUsers`,
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        USERS_TABLE: usersTable.tableName,
        STAGE: stage,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'es2020',
        externalModules: ['@aws-sdk/*'], // AWS SDK v3 incluido en runtime
      },
      // Log retention
      logRetention: logs.RetentionDays.ONE_WEEK,
      // X-Ray tracing
      tracing: lambda.Tracing.ACTIVE,
    });

    // Otorgar permisos de lectura a DynamoDB
    usersTable.grantReadData(getUsersFunction);

    // Lambda: Create User
    const createUserFunction = new NodejsFunction(this, 'CreateUserFunction', {
      entry: 'src/handlers/users.ts',
      handler: 'create',
      functionName: `${stage}-createUser`,
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
      tracing: lambda.Tracing.ACTIVE,
    });

    // Otorgar permisos de escritura a DynamoDB
    usersTable.grantWriteData(createUserFunction);

    // --------------------------------------------------------------------------
    // 3. API Gateway REST API
    // --------------------------------------------------------------------------
    const api = new apigateway.RestApi(this, 'ServerlessApi', {
      restApiName: `${stage}-serverless-api`,
      description: 'Serverless API with CDK',

      // CORS configuration
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },

      // Deploy options
      deployOptions: {
        stageName: stage,
        // Throttling
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
        // Logging
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        // Metrics
        metricsEnabled: true,
      },

      // CloudWatch logs
      cloudWatchRole: true,
    });

    // Resource: /users
    const usersResource = api.root.addResource('users');

    // GET /users
    usersResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getUsersFunction),
    );

    // POST /users
    usersResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createUserFunction),
      {
        // Request validation
        requestValidatorOptions: {
          validateRequestBody: true,
          validateRequestParameters: false,
        },
        requestModels: {
          'application/json': new apigateway.Model(this, 'CreateUserModel', {
            restApi: api,
            contentType: 'application/json',
            schema: {
              type: apigateway.JsonSchemaType.OBJECT,
              required: ['name', 'email'],
              properties: {
                name: { type: apigateway.JsonSchemaType.STRING },
                email: {
                  type: apigateway.JsonSchemaType.STRING,
                  format: 'email',
                },
              },
            },
          }),
        },
      },
    );

    // Resource: /users/{id}
    const userResource = usersResource.addResource('{id}');

    const getUserFunction = new NodejsFunction(this, 'GetUserFunction', {
      entry: 'src/handlers/users.ts',
      handler: 'getOne',
      functionName: `${stage}-getUser`,
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
    });

    usersTable.grantReadData(getUserFunction);

    userResource.addMethod('GET', new apigateway.LambdaIntegration(getUserFunction));

    // --------------------------------------------------------------------------
    // 4. S3 Bucket con Lambda Trigger
    // --------------------------------------------------------------------------
    const imagesBucket = new s3.Bucket(this, 'ImagesBucket', {
      bucketName: `${stage}-images-${this.account}`,
      // Bloquear acceso público
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      // Versionamiento
      versioned: true,
      // Lifecycle rules
      lifecycleRules: [
        {
          id: 'DeleteOldVersions',
          noncurrentVersionExpiration: cdk.Duration.days(30),
          enabled: true,
        },
      ],
      // Removal policy
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: stage !== 'prod', // Auto-delete en dev/staging
    });

    // Lambda para procesar imágenes
    const imageProcessorFunction = new NodejsFunction(
      this,
      'ImageProcessorFunction',
      {
        entry: 'src/handlers/imageProcessor.ts',
        handler: 'handler',
        functionName: `${stage}-imageProcessor`,
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(60),
        memorySize: 1024, // Más memoria para procesamiento
      },
    );

    // Otorgar permisos al bucket
    imagesBucket.grantRead(imageProcessorFunction);

    // Trigger: S3 -> Lambda
    imagesBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new targets.LambdaFunction(imageProcessorFunction),
      {
        prefix: 'uploads/',
        suffix: '.jpg',
      },
    );

    // --------------------------------------------------------------------------
    // 5. SQS Queue con Lambda Consumer
    // --------------------------------------------------------------------------

    // Dead Letter Queue
    const ordersDLQ = new sqs.Queue(this, 'OrdersDLQ', {
      queueName: `${stage}-orders-dlq`,
      retentionPeriod: cdk.Duration.days(14),
    });

    // Main Queue
    const ordersQueue = new sqs.Queue(this, 'OrdersQueue', {
      queueName: `${stage}-orders-queue`,
      visibilityTimeout: cdk.Duration.seconds(180),
      retentionPeriod: cdk.Duration.days(14),
      deadLetterQueue: {
        queue: ordersDLQ,
        maxReceiveCount: 3,
      },
    });

    // Lambda consumer
    const orderProcessorFunction = new NodejsFunction(
      this,
      'OrderProcessorFunction',
      {
        entry: 'src/handlers/orderProcessor.ts',
        handler: 'handler',
        functionName: `${stage}-orderProcessor`,
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(60),
        environment: {
          ORDERS_TABLE: usersTable.tableName, // Reusar tabla (ejemplo)
        },
      },
    );

    // Otorgar permisos a la queue
    ordersQueue.grantConsumeMessages(orderProcessorFunction);

    // --------------------------------------------------------------------------
    // 6. EventBridge Scheduled Rule (Cron)
    // --------------------------------------------------------------------------
    const cleanupFunction = new NodejsFunction(this, 'CleanupFunction', {
      entry: 'src/handlers/cleanup.ts',
      handler: 'handler',
      functionName: `${stage}-cleanup`,
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
    });

    usersTable.grantReadWriteData(cleanupFunction);

    // Schedule: Cada día a las 2 AM UTC
    const cleanupRule = new events.Rule(this, 'CleanupRule', {
      schedule: events.Schedule.cron({
        minute: '0',
        hour: '2',
        day: '*',
        month: '*',
        year: '*',
      }),
      description: 'Daily cleanup of old records',
    });

    cleanupRule.addTarget(new targets.LambdaFunction(cleanupFunction));

    // --------------------------------------------------------------------------
    // 7. CloudWatch Alarms
    // --------------------------------------------------------------------------
    getUsersFunction
      .metricErrors({
        period: cdk.Duration.minutes(5),
      })
      .createAlarm(this, 'GetUsersErrorAlarm', {
        alarmName: `${stage}-getUsers-errors`,
        alarmDescription: 'Alert on Lambda errors',
        threshold: 5,
        evaluationPeriods: 1,
        comparisonOperator:
          cdk.aws_cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      });

    // --------------------------------------------------------------------------
    // 8. Outputs
    // --------------------------------------------------------------------------
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
      exportName: `${stage}-ApiUrl`,
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
      description: 'DynamoDB Users Table Name',
      exportName: `${stage}-UsersTable`,
    });

    new cdk.CfnOutput(this, 'ImagesBucketName', {
      value: imagesBucket.bucketName,
      description: 'S3 Images Bucket Name',
    });

    new cdk.CfnOutput(this, 'OrdersQueueUrl', {
      value: ordersQueue.queueUrl,
      description: 'SQS Orders Queue URL',
    });
  }
}

/**
 * ============================================================================
 * Stack con Cognito User Pool
 * ============================================================================
 */
export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stage = this.node.tryGetContext('stage') || 'dev';

    // Cognito User Pool
    const userPool = new cdk.aws_cognito.UserPool(this, 'UserPool', {
      userPoolName: `${stage}-users`,
      // Sign in con email
      signInAliases: {
        email: true,
      },
      // Self sign up
      selfSignUpEnabled: true,
      // Verificación de email
      autoVerify: {
        email: true,
      },
      // Password policy
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      // Account recovery
      accountRecovery: cdk.aws_cognito.AccountRecovery.EMAIL_ONLY,
      // Removal policy
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // App Client
    const userPoolClient = userPool.addClient('AppClient', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      // Token validity
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(30),
    });

    // Outputs
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      exportName: `${stage}-UserPoolId`,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      exportName: `${stage}-UserPoolClientId`,
    });
  }
}

/**
 * ============================================================================
 * CDK App Entry Point
 * ============================================================================
 * Archivo: bin/app.ts
 */

/*
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessAppStack, AuthStack } from '../lib/stacks';

const app = new cdk.App();

const stage = app.node.tryGetContext('stage') || 'dev';

// Main application stack
new ServerlessAppStack(app, `ServerlessApp-${stage}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  tags: {
    Environment: stage,
    Project: 'ServerlessApp',
  },
});

// Auth stack (puede desplegarse independientemente)
new AuthStack(app, `Auth-${stage}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  tags: {
    Environment: stage,
    Project: 'ServerlessApp',
  },
});

app.synth();
*/

/**
 * ============================================================================
 * Comandos de Deploy
 * ============================================================================
 *
 * Deploy a dev:
 * cdk deploy --all -c stage=dev
 *
 * Deploy a prod:
 * cdk deploy --all -c stage=prod --require-approval never
 *
 * Deploy solo el stack principal:
 * cdk deploy ServerlessApp-dev
 *
 * Ver diferencias antes de deploy:
 * cdk diff -c stage=dev
 *
 * Destruir todo:
 * cdk destroy --all -c stage=dev
 */

/**
 * ============================================================================
 * Ventajas de CDK vs SAM/Serverless
 * ============================================================================
 *
 * ✅ Código TypeScript real (no YAML)
 * ✅ Autocompletado y type checking
 * ✅ Reutilización con clases y funciones
 * ✅ Abstracciones de alto nivel (L2/L3 constructs)
 * ✅ Más flexible para infraestructura compleja
 * ✅ Testing de infraestructura con Jest
 * ✅ Genera CloudFormation optimizado
 *
 * ❌ Curva de aprendizaje más alta
 * ❌ Más verbose para casos simples
 * ❌ Requiere más configuración inicial
 */
