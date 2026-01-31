// Original file: proto/analytics.proto

import type { TimeSeriesPoint as _analytics_TimeSeriesPoint, TimeSeriesPoint__Output as _analytics_TimeSeriesPoint__Output } from '../analytics/TimeSeriesPoint';
import type { Long } from '@grpc/proto-loader';

export interface PostStatsResponse {
  'views'?: (number | string | Long);
  'unique_visitors'?: (number | string | Long);
  'avg_read_time_sec'?: (number | string);
  'chart_data'?: (_analytics_TimeSeriesPoint)[];
}

export interface PostStatsResponse__Output {
  'views': (string);
  'unique_visitors': (string);
  'avg_read_time_sec': (number);
  'chart_data': (_analytics_TimeSeriesPoint__Output)[];
}
