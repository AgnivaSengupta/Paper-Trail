import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from '../proto/generated/analytics';

const PROTO_PATH = path.join(__dirname, '../../../proto/analytics.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
const analyticsPackage = protoDescriptor.analytics;

const GRPC_HOST = '127.0.0.1:50051'; // Force IPv4 to avoid IPv6 connection issues
export const analyticsClient = new analyticsPackage.AnalyticsService(
    GRPC_HOST,
    grpc.credentials.createInsecure()
);

console.log(`gRPC Client connected to ${GRPC_HOST}`);