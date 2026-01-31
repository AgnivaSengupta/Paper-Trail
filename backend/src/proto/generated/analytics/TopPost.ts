// Original file: proto/analytics.proto

import type { Long } from '@grpc/proto-loader';

export interface TopPost {
  'post_id'?: (string);
  'title'?: (string);
  'views'?: (number | string | Long);
}

export interface TopPost__Output {
  'post_id': (string);
  'title': (string);
  'views': (string);
}
