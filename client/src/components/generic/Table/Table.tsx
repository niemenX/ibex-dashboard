import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from '../GenericComponent';
import * as _ from 'lodash';
import * as moment from 'moment';
import utils from '../../../utils';

import { DataTable, TableHeader, TableBody, TableRow, TableColumn, TablePagination } from 'react-md/lib/DataTables';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Card from '../../Card';

const styles = {
  autoscroll: {
    overflow: 'auto'
  } as React.CSSProperties
};

const defaultPagination: number[] = [10, 50, 100];

export type ColType = 'text' | 'time' | 'icon' | 'button' | 'ago' | 'number';

export interface ITableColumnProps {
  header?: string;
  field?: string;
  secondaryHeader?: string;
  secondaryField?: string;
  value?: string;
  width?: string | number;
  type?: ColType;
  click?: string;
  color?: string;
  tooltip?: string;
  tooltipPosition?: string;
}

export interface ITableProps extends IGenericProps {
  props: {
    checkboxes?: boolean;
    rowClassNameField?: string;
    hideBorders?: boolean;
    compact?: boolean;
    cols: ITableColumnProps[],
    defaultRowsPerPage?: number;
  };
}

export interface ITableState extends IGenericState {
  values: Object[];
  rowIndex: number;
  rowsPerPage: number;
  currentPage: number;
}

export default class Table extends GenericComponent<ITableProps, ITableState> {

  state = {
    values: [],
    rowIndex: 0,
    rowsPerPage: this.props.props.defaultRowsPerPage || 10,
    rowsPerPageItems: defaultPagination,
    currentPage: 1,
  };

  constructor(props: ITableProps) {
    super(props);

    this.state.rowsPerPageItems = defaultPagination.find(n => n === this.state.rowsPerPage) ? defaultPagination
      : [...defaultPagination, this.state.rowsPerPage].sort((a, b) => a - b);

    this.onButtonClick = this.onButtonClick.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
  }

  onButtonClick = (col, value, event?: UIEvent) => {
    if (event) { event.stopPropagation(); }

    this.trigger(col.click, value);
  }

  onRowClick = (row, value, event?: UIEvent) => {
    if (event) { event.stopPropagation(); }

    let i = row.findIndex((col) => col.type === 'button');
    if (i === -1) {
      return;
    }
    this.onButtonClick(row[i], value);
  }

  fixClassName(value: string) {
    return (value && value.replace(/\./g, '-')) || null;
  }

  handlePagination(rowIndex: number, rowsPerPage: number, currentPage: number) {
    const { values } = this.state;
    const newPage = currentPage < Math.floor(values.length / rowsPerPage) ? currentPage : 1;
    this.setState({ rowIndex: rowIndex, rowsPerPage: rowsPerPage, currentPage: newPage });
  }

  render() {
    const { props, id, title } = this.props;
    const { checkboxes, cols, rowClassNameField, hideBorders, compact } = props;
    const { values, rowIndex, rowsPerPage, currentPage, rowsPerPageItems } = this.state;

    if (!values) {
      return <CircularProgress key="loading" id="spinner" />;
    }

    let totalRows = values.length;
    let pageValues = Array.isArray(values) && values.slice(rowIndex, rowIndex + rowsPerPage) || [];

    let renderColumn = (col: ITableColumnProps, value: any): JSX.Element => {
      let style = { color: col.color ? value[col.color] : null };
      switch (col.type) {

        case 'icon':
          return !col.tooltip ? <FontIcon style={style}>{col.value || value[col.field]}</FontIcon> : (
            <Button
              icon
              tooltipLabel={value[col.tooltip] || col.tooltip}
              tooltipPosition={col.tooltipPosition || 'top'}
              className={this.fixClassName(value[col.field]) + ' tooltip'}
            >
              {col.value || value[col.field]}
            </Button>
          );

        case 'button':
          return (
            <Button
              style={style}
              icon={true}
              onClick={this.onButtonClick.bind(this, col, value)}
            >
              {col.value || value[col.field]}
            </Button>
          );

        case 'time':
          return <span style={style}>{moment(value[col.field]).format('MMM-DD HH:mm:ss')}</span>;

        case 'number':
          return <span style={style}>{utils.kmNumber(value[col.field])}</span>;

        case 'ago':
          return <span style={style}>{utils.ago(value[col.field])}</span>;

        default:
          if (col.secondaryField !== undefined) {
            return (
              <div className="table" style={style}>
                <span className="primary">{value[col.field]}</span>
                <span className="secondary">{value[col.secondaryField]}</span>
              </div>
            );
          } else {
            return <span style={style}>{value[col.field]}</span>;
          }
      }
    };

    const rows = pageValues.map((value, ri) => (
      <TableRow
        key={ri}
        className={rowClassNameField ? this.fixClassName(value[rowClassNameField]) : null}
        onClick={this.onRowClick.bind(this, cols, value)}
      >
        {
          cols.map((col, ci) => (
            <TableColumn key={ci} className={this.fixClassName(col.field || col.value)}>
              <span className="indicator" />{renderColumn(col, value)}
            </TableColumn>
          ))
        }
      </TableRow>
    ));

    let className = 'pagination-table ';
    className += compact ? 'table-compact' : '';

    return (
      <Card id={id}
        title={title}
        hideTitle={false}
        className={hideBorders ? 'hide-borders' : ''}
        contentStyle={styles.autoscroll}>
        <div style={{ width: "95%" }}>
          <DataTable plain={!checkboxes} data={checkboxes} className={className} baseId="pagination" responsive={true}>
            <TableHeader>
              <TableRow autoAdjust={false}>
                {cols.map((col, i) => (
                  <TableColumn key={i}>{
                    col.secondaryHeader !== undefined ? (
                      <div className="table">
                        <span className="primary">{col.header}</span>
                        <span className="secondary">{col.secondaryHeader}</span>
                      </div>
                    ) : col.header
                  }</TableColumn>
                ))
                }
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows}
            </TableBody>
            {totalRows > rowsPerPage ? (
              <TablePagination
                onPagination={this.handlePagination}
                rows={totalRows}
                rowsPerPage={rowsPerPage}
                rowsPerPageItems={rowsPerPageItems}
                page={currentPage}
              />
            ) : null
            }
          </DataTable>
        </div>
      </Card>
    );
  }

  private styleColumnWidth(width?: string | number): React.CSSProperties {
    if (!width) {
      return {
        width: '100%'
      } as React.CSSProperties;
    }
    return {
      width: typeof (width) === 'string' ? width : width + 'px'
    } as React.CSSProperties;
  }
}