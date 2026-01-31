// Original file: proto/analytics.proto

import type { TopPost as _analytics_TopPost, TopPost__Output as _analytics_TopPost__Output } from '../analytics/TopPost';
import type { Long } from '@grpc/proto-loader';

export interface AuthorStatsResponse {
  'total_views'?: (number | string | Long);
  'total_visitors'?: (number | string | Long);
  'overall_avg_read_time'?: (number | string);
  'top_posts'?: (_analytics_TopPost)[];
}

export interface AuthorStatsResponse__Output {
  'total_views': (string);
  'total_visitors': (string);
  'overall_avg_read_time': (number);
  'top_posts': (_analytics_TopPost__Output)[];
}
