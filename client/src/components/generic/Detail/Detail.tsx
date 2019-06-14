import * as React from 'react';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GenericComponent, IGenericProps, IGenericState } from '../GenericComponent';
import Card from '../../Card';
import {
  FontIcon,
  List,
  ListItem,
  Button,
  Divider,
  CircularProgress
} from 'react-md';

const styles = {
  autoscroll: {
    overflow: 'auto',
  } as React.CSSProperties
};

export interface IDetailProps extends IGenericProps {
  props: {
    cols: {
      header?: string,
      field?: string,
      value?: string,
      type?: 'text' | 'time' | 'icon' | 'button',
    }[]
    hideBorders?: boolean;
  };
}

export interface IDetailState extends IGenericState {
  values: Object[];
}

export default class Detail extends GenericComponent<IDetailProps, IDetailState> {

  state = {
    values: []
  };

  constructor(props: IDetailProps) {
    super(props);
  }

  render() {
    const { props, id, title } = this.props;
    const { cols, hideBorders } = props;
    const { values } = this.state;

    if (!values) {
      return <CircularProgress key="loading" id="spinner" />;
    }

    var results = values.slice(0);

    const lists = results.map((value, ri) => {
      const items = cols.map((col, ci) => {
        const header = cols[ci].header;
        const field = cols[ci].field;
        const data = value[field];
        const key = ri + '-' + ci;
        const content = this.renderData(data);

        return (
          <ListItem key={key} primaryText={header} secondaryText={content}>
          </ListItem>
        );
      });

      return (
        <List  key={ri} className="details">
          {items}
          <Divider />
        </List >
      );
    });

    return (
      <Card 
        id={id} 
        title={title} 
        hideTitle={true} 
        className={hideBorders ? 'hide-borders' : ''} 
        contentStyle={styles.autoscroll}>
        {lists}
      </Card>
    );
  }

  private renderData(data: any): any {
    if (data && data.length > 1 && data.substr(0, 1) === '[' && data.substr(-1) === ']') {
      const obj = JSON.parse(data);
      if (Array.isArray(obj)) {
        return this.renderArray(obj);
      }
    } else if (data && data.length > 1 && data.substr(0, 1) === '{' && data.substr(-1) === '}') {
      const obj = JSON.parse(data);
      if (typeof obj === 'object') {
        return this.renderObject(obj);
      }
    }
    return <p>{data}</p>;
  }

  private renderArray(data: any[]): any {
    const contents = data.map((obj) => this.renderObject(obj));
    return (
      <ul>
        {contents}
      </ul>
    );
  }

  private renderObject(data: any): any {
    let items = [];
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (Array.isArray(value)) {
        const nested = this.renderArray(value);
        items.push(
          <li key={key}>
            <h6>{key}</h6>
            {nested}
          </li>
        );
      } else {
        const stringValue = JSON.stringify(value);
        items.push(
          <li key={key}>
            <h6>{key}</h6>
            <p>{stringValue}</p>
          </li>
        );
      }
    });
    return items;
  }
}