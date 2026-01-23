// Original file: ../proto/analytics.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AuthorStatsRequest as _analytics_AuthorStatsRequest, AuthorStatsRequest__Output as _analytics_AuthorStatsRequest__Output } from '../analytics/AuthorStatsRequest';
import type { AuthorStatsResponse as _analytics_AuthorStatsResponse, AuthorStatsResponse__Output as _analytics_AuthorStatsResponse__Output } from '../analytics/AuthorStatsResponse';
import type { PostStatsRequest as _analytics_PostStatsRequest, PostStatsRequest__Output as _analytics_PostStatsRequest__Output } from '../analytics/PostStatsRequest';
import type { PostStatsResponse as _analytics_PostStatsResponse, PostStatsResponse__Output as _analytics_PostStatsResponse__Output } from '../analytics/PostStatsResponse';

export interface AnalyticsServiceClient extends grpc.Client {
  GetAuthorStats(argument: _analytics_AuthorStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  GetAuthorStats(argument: _analytics_AuthorStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  GetAuthorStats(argument: _analytics_AuthorStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  GetAuthorStats(argument: _analytics_AuthorStatsRequest, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  getAuthorStats(argument: _analytics_AuthorStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  getAuthorStats(argument: _analytics_AuthorStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  getAuthorStats(argument: _analytics_AuthorStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  getAuthorStats(argument: _analytics_AuthorStatsRequest, callback: grpc.requestCallback<_analytics_AuthorStatsResponse__Output>): grpc.ClientUnaryCall;
  
  GetPostStats(argument: _analytics_PostStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  GetPostStats(argument: _analytics_PostStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  GetPostStats(argument: _analytics_PostStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  GetPostStats(argument: _analytics_PostStatsRequest, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  getPostStats(argument: _analytics_PostStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  getPostStats(argument: _analytics_PostStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  getPostStats(argument: _analytics_PostStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  getPostStats(argument: _analytics_PostStatsRequest, callback: grpc.requestCallback<_analytics_PostStatsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AnalyticsServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAuthorStats: grpc.handleUnaryCall<_analytics_AuthorStatsRequest__Output, _analytics_AuthorStatsResponse>;
  
  GetPostStats: grpc.handleUnaryCall<_analytics_PostStatsRequest__Output, _analytics_PostStatsResponse>;
  
}

export interface AnalyticsServiceDefinition extends grpc.ServiceDefinition {
  GetAuthorStats: MethodDefinition<_analytics_AuthorStatsRequest, _analytics_AuthorStatsResponse, _analytics_AuthorStatsRequest__Output, _analytics_AuthorStatsResponse__Output>
  GetPostStats: MethodDefinition<_analytics_PostStatsRequest, _analytics_PostStatsResponse, _analytics_PostStatsRequest__Output, _analytics_PostStatsResponse__Output>
}
