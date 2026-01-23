// Original file: ../proto/analytics.proto

import type { Long } from '@grpc/proto-loader';

export interface TopPost {
  'postId'?: (string);
  'title'?: (string);
  'views'?: (number | string | Long);
}

export interface TopPost__Output {
  'postId': (string);
  'title': (string);
  'views': (string);
}
