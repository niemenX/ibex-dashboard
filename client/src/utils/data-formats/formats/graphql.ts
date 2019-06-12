import * as _ from 'lodash';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

export function graphql(
  format: any,
  state: any) {

  if (!state) { return null; }

  return { values: resolve(format.values, state.data) };
}

function resolve(path: string, obj: any = self, separator: string = '.') {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}