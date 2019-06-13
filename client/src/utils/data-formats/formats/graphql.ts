import * as _ from 'lodash';
import { resolve } from '../common';

export function graphql(
  format: any,
  state: any) {

  if (!state) { return null; }

  return { values: resolve(format.values, state.data) };
}