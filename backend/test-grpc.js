const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/analytics.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const analyticsPackage = protoDescriptor.analytics;

const client = new analyticsPackage.AnalyticsService(
    '127.0.0.1:50051',
    grpc.credentials.createInsecure()
);

console.log('Testing gRPC connection...');

// Test GetAuthorStats
const testAuthorId = '507f1f77bcf86cd799439011'; // Example MongoDB ObjectId
const testRequest = {
    authorId: testAuthorId,
    timeRange: '24h'
};

console.log('Calling GetAuthorStats with request:', testRequest);

client.GetAuthorStats(testRequest, (err, response) => {
    if (err) {
        console.error('❌ gRPC Error:', err);
        return;
    }
    
    console.log('✅ gRPC Response:', response);
    
    // Close the connection
    grpc.closeClient(client);
});