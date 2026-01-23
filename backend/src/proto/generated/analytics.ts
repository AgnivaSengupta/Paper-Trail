import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AnalyticsServiceClient as _analytics_AnalyticsServiceClient, AnalyticsServiceDefinition as _analytics_AnalyticsServiceDefinition } from './analytics/AnalyticsService';
import type { AuthorStatsRequest as _analytics_AuthorStatsRequest, AuthorStatsRequest__Output as _analytics_AuthorStatsRequest__Output } from './analytics/AuthorStatsRequest';
import type { AuthorStatsResponse as _analytics_AuthorStatsResponse, AuthorStatsResponse__Output as _analytics_AuthorStatsResponse__Output } from './analytics/AuthorStatsResponse';
import type { PostStatsRequest as _analytics_PostStatsRequest, PostStatsRequest__Output as _analytics_PostStatsRequest__Output } from './analytics/PostStatsRequest';
import type { PostStatsResponse as _analytics_PostStatsResponse, PostStatsResponse__Output as _analytics_PostStatsResponse__Output } from './analytics/PostStatsResponse';
import type { TimeSeriesPoint as _analytics_TimeSeriesPoint, TimeSeriesPoint__Output as _analytics_TimeSeriesPoint__Output } from './analytics/TimeSeriesPoint';
import type { TopPost as _analytics_TopPost, TopPost__Output as _analytics_TopPost__Output } from './analytics/TopPost';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  analytics: {
    AnalyticsService: SubtypeConstructor<typeof grpc.Client, _analytics_AnalyticsServiceClient> & { service: _analytics_AnalyticsServiceDefinition }
    AuthorStatsRequest: MessageTypeDefinition<_analytics_AuthorStatsRequest, _analytics_AuthorStatsRequest__Output>
    AuthorStatsResponse: MessageTypeDefinition<_analytics_AuthorStatsResponse, _analytics_AuthorStatsResponse__Output>
    PostStatsRequest: MessageTypeDefinition<_analytics_PostStatsRequest, _analytics_PostStatsRequest__Output>
    PostStatsResponse: MessageTypeDefinition<_analytics_PostStatsResponse, _analytics_PostStatsResponse__Output>
    TimeSeriesPoint: MessageTypeDefinition<_analytics_TimeSeriesPoint, _analytics_TimeSeriesPoint__Output>
    TopPost: MessageTypeDefinition<_analytics_TopPost, _analytics_TopPost__Output>
  }
}

