// Original file: ../proto/analytics.proto

import type { TimeSeriesPoint as _analytics_TimeSeriesPoint, TimeSeriesPoint__Output as _analytics_TimeSeriesPoint__Output } from '../analytics/TimeSeriesPoint';
import type { Long } from '@grpc/proto-loader';

export interface PostStatsResponse {
  'views'?: (number | string | Long);
  'uniqueVisitors'?: (number | string | Long);
  'avgReadTimeSec'?: (number | string);
  'chartData'?: (_analytics_TimeSeriesPoint)[];
}

export interface PostStatsResponse__Output {
  'views': (string);
  'uniqueVisitors': (string);
  'avgReadTimeSec': (number);
  'chartData': (_analytics_TimeSeriesPoint__Output)[];
}
