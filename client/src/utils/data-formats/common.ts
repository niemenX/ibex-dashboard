import { ToastActions } from '../../components/Toast';
import { IDataSourcePlugin } from '../../data-sources/plugins/DataSourcePlugin';

export enum DataFormatTypes {
  none,
  timespan,
  flags,
  retention,
  timeline
}

export interface IDataFormat {
  type: string;
  args: any;
}

export function formatWarn(text: string, format: string, plugin: IDataSourcePlugin) {
  ToastActions.addToast({ text: `[format:${format}] text [data source:${plugin._props.id}]` });
}

export function getPrefix(format: string | IDataFormat) {
  return (format && typeof format !== 'string' && format.args && format.args.prefix) || '';
}

export function resolve(path: string, obj: any = self, separator: string = '.') {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}