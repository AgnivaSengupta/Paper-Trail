// Original file: ../proto/analytics.proto

import type { TopPost as _analytics_TopPost, TopPost__Output as _analytics_TopPost__Output } from '../analytics/TopPost';
import type { Long } from '@grpc/proto-loader';

export interface AuthorStatsResponse {
  'totalViews'?: (number | string | Long);
  'totalVisitors'?: (number | string | Long);
  'overallAvgReadTime'?: (number | string);
  'topPosts'?: (_analytics_TopPost)[];
}

export interface AuthorStatsResponse__Output {
  'totalViews': (string);
  'totalVisitors': (string);
  'overallAvgReadTime': (number);
  'topPosts': (_analytics_TopPost__Output)[];
}
