import { arrayToQuery, safeEncodeData, sendRequest } from '@/utils/request';

import * as files from './files';
import * as folders from './folders';

export const MAX_PROGRESS_VALUE = 99;

const quota = () => sendRequest('storage/quota');

export const download = (foldersIds, filesIds) => sendRequest([
  'storage/download', safeEncodeData({
    ...arrayToQuery(foldersIds, 'foldersIds'),
    ...arrayToQuery(filesIds, 'filesIds'),
  }),
].join('?'));

export default {
  files,
  folders,
  quota,
  download,
};
