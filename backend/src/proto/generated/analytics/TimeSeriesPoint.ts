// Original file: ../proto/analytics.proto

import type { Long } from '@grpc/proto-loader';

export interface TimeSeriesPoint {
  'timestamp'?: (string);
  'views'?: (number | string | Long);
}

export interface TimeSeriesPoint__Output {
  'timestamp': (string);
  'views': (string);
}
