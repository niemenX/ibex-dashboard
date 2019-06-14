return {
  id: "basic_sample",
  name: "Basic Sample",
  icon: "extension",
  url: "basic_sample",
  description: "A basic sample to understand a basic dashboard",
  preview: "/images/sample.png",
  category: "Samples",
  html: `<div>
      This is a basic sample dashboard, with JSON based sample data source, to show how data from different data sources
      can be manipulated and connected to visual components.
    </div>`,
  config: {
    connections: {
      "application-insights": { appId: "a", apiKey: "a" },
      graphql: { serviceUrl: "http://localhost:3005/graphql" }
    },
    layout: {
      isDraggable: true,
      isResizable: true,
      rowHeight: 30,
      verticalCompact: false,
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
    }
  },
  dataSources: [
    {
      id: "samples",
      type: "Sample",
      params: {
        samples: {
          data_for_pie: [{ name: "value1", value: 60 }, { name: "value2", value: 10 }, { name: "value3", value: 30 }],
          scorecard_data_value: 3000000,
          scorecard_data_subvalue: 4000,
          timeline: [
            { timestamp: "2015-01-01 00:00:01", line: "red", value: 40 },
            { timestamp: "2015-01-02 00:00:01", line: "red", value: 50 },
            { timestamp: "2015-01-03 00:00:01", line: "red", value: 60 },
            { timestamp: "2015-01-01 00:00:01", line: "blue", value: 10 },
            { timestamp: "2015-01-02 00:00:01", line: "blue", value: 77 },
            { timestamp: "2015-01-03 00:00:01", line: "blue", value: 30 }
          ]
        }
      }
    },
    {
      id: "timeline",
      type: "Sample",
      params: {
        samples: {
          timeline: [
            { timestamp: "2015-01-01 00:00:01", line: "red", value: 40 },
            { timestamp: "2015-01-02 00:00:01", line: "red", value: 50 },
            { timestamp: "2015-01-03 00:00:01", line: "red", value: 60 },
            { timestamp: "2015-01-04 00:00:01", line: "red", value: 60 },
            { timestamp: "2015-01-05 00:00:01", line: "red", value: 35 },
            { timestamp: "2015-01-01 00:00:01", line: "blue", value: 10 },
            { timestamp: "2015-01-02 00:00:01", line: "blue", value: 77 },
            { timestamp: "2015-01-03 00:00:01", line: "blue", value: 30 },
            { timestamp: "2015-01-04 00:00:01", line: "blue", value: 30 },
            { timestamp: "2015-01-05 00:00:01", line: "blue", value: 35 },
            { timestamp: "2015-01-01 00:00:01", line: "green", value: 75 },
            { timestamp: "2015-01-02 00:00:01", line: "green", value: 65 },
            { timestamp: "2015-01-03 00:00:01", line: "green", value: 55 },
            { timestamp: "2015-01-04 00:00:01", line: "green", value: 45 },
            { timestamp: "2015-01-05 00:00:01", line: "green", value: 35 }
          ]
        }
      },
      format: {
        type: "timeline",
        args: { data: "timeline", timeField: "timestamp", lineField: "line", valueField: "value" }
      }
    },
    {
      id: "bar",
      type: "Sample",
      params: {
        samples: {
          bar: [
            { count: 10, barField: "bar 1", seriesField: "series1Value" },
            { count: 15, barField: "bar 2", seriesField: "series1Value" },
            { count: 20, barField: "bar 1", seriesField: "series2Value" },
            { count: 44, barField: "bar 3", seriesField: "series2Value" }
          ]
        }
      },
      format: {
        type: "bars",
        args: { data: "bar", barsField: "barField", seriesField: "seriesField", valueField: "count", threshold: 10 }
      }
    },
    {
      id: "scorecard-sample1",
      type: "Sample",
      params: { samples: { values: [{ count: 10 }] } },
      format: {
        type: "scorecard",
        args: {
          thresholds: [
            { value: 10, color: "#AEEA00", heading: "Errors", icon: "done", subheading: "Avg" },
            { value: 1, color: "#D50000", heading: "Errors", icon: "bug_report", subheading: "Avg" }
          ]
        }
      }
    },
    {
      id: "scorecard-sample2",
      type: "Sample",
      params: { samples: { values: [{ count: 25 }] } },
      format: {
        type: "scorecard",
        args: {
          thresholds: [
            { value: 25, color: "#FF5733", heading: "Warnings", icon: "warning", subheading: "Avg" },
            { value: 1, color: "#FF5733", heading: "Warnings", icon: "warning", subheading: "Avg" }
          ]
        }
      }
    },
    {
      id: "timespan",
      type: "Constant",
      params: { selectedValue: "2019-06-10T00:00:00.000Z/2019-06-10T23:59:59.999Z" },
      calculated: (state, dependencies) => {
        var queryTimespan = state.selectedValue;
        var dateRangeArray = state.selectedValue.split('/');

        var initDate = new Date(dateRangeArray[0]);
        var endDate = new Date(dateRangeArray[1]);
        var diffTime = endDate.getTime() - initDate.getTime();
        var diffDays = diffTime / (3600 * 1000 * 24);

        var timeFormat = (diffDays > 3) ? 'date' : 'hour';

        return {
          queryTimespan: state.selectedValue,
          startTimespan: dateRangeArray[0],
          endTimespan: dateRangeArray[1],
          'timeline-timeFormat': timeFormat,
        };
      }
    },
    {
      id: "gdata",
      type: "GraphQL",
      dependencies: { timespan: "timespan" },
      params: {
        query: () => `
        {
          medicalDocuments(pageSize: 100, afterId: 0, direction: 0, sortBy: "") {
            values {
              id
              firstName
              lastName
            }
          }
        }
              `
      },
      format: { type: "graphql", values: "medicalDocuments.values" }
    },
    {
      id: "gdata1",
      type: "GraphQL",
      dependencies: { timespan: "timespan" },
      params: {
        query: () => `
      {
        medicalDocuments(pageSize: 10, afterId: 0, direction: 0, sortBy: "") {
          totalCount
        }
      }
      ` },
      format: {
        type: "scorecard",
        args: {
          data: "data.medicalDocuments",
          countField: "totalCount",
          thresholds: [{ color: "#FF5733", heading: "Records", icon: "list", value: 1778493 }]
        }
      }
    }
  ],
  filters: [],
  elements: [
    {
      id: "table",
      type: "Table",
      title: "GraphQL test",
      subtitle: "GraphQL test data",
      size: { w: 5, h: 8 },
      dependencies: { values: "gdata:values" },
      props: {
        cols: [
          { header: "#", field: "id" },
          { header: "First Name", field: "firstName" },
          { header: "Last Name", field: "lastName" }
        ],
        defaultRowsPerPage: 10
      }
    },
    {
      id: "pie_sample1",
      type: "PieData",
      title: "Pie Sample 1",
      subtitle: "Description of pie sample 1",
      size: { w: 5, h: 8 },
      dependencies: { values: "samples:data_for_pie" },
      props: { showLegend: true, compact: true }
    },
    {
      id: "timeline",
      type: "Timeline",
      title: "Timeline sample",
      subtitle: "timeline chart sample",
      size: { w: 5, h: 8 },
      source: "timeline"
    },
    {
      id: "timeline-area",
      type: "Area",
      title: "Area demo",
      subtitle: "Area",
      size: { w: 4, h: 8 },
      source: "timeline",
      props: { isStacked: true, showLegend: false }
    },
    {
      id: "bar",
      type: "BarData",
      title: "Bar data demo",
      subtitle: "bar data desc",
      size: { w: 6, h: 8 },
      source: "bar"
    },
    {
      id: "scores",
      type: "Scorecard",
      size: { w: 4, h: 3 },
      source: { records: "gdata1", warnings: "scorecard-sample2" },
      dependencies: {
        card_records_tooltip: "::Total rows",
        card_records_onClick: "::onRecordsClick",
        card_warnings_tooltip: "::Total warnings"
      },
      actions: {
        onRecordsClick: {
          action: "dialog:records",
          params: {
            title: "args:heading",
            type: "args:type",
            innermostMessage: "args:innermostMessage",
            queryspan: "timespan:queryTimespan"
          }
        }
      }
    }
  ],
  dialogs: [
    {
      id: "records",
      width: "90%",
      params: ["title", "queryspan"],
      dataSources: [
        {
          id: "records",
          type: "Sample",
          params: {
            samples: {
              groups: [{ firstName: "first", lastName: "last", id: 1 }, { firstName: "asdasd", lastName: "asdasd", id: 2 }],
              values: []
            }
          }
        },
        {
          id: "record-selection",
          type: "GraphQL",
          dependencies: { id: "args:id" },
          params: {
            query: ({ id }) => `{
              medicalDocumentResults(medicalDocumentId: ${id}, pageSize: 10, sortBy: "MedicalDocumentId") {
                totalCount
                values {
                  validationEmployeeName
                  medicalDocumentId
                  serviceCode
                  serviceName
                  operator
                  resultValue
                  numericValue
                  normalRange
                }
              }
            }`
          },
          format: { type: "graphql", values: "medicalDocumentResults.values" }
        },
        {
          id: "records-groups",
          type: "GraphQL",
          dependencies: { timespan: "timespan" },
          params: {
            query: () => `{
              medicalDocuments(pageSize: 10, afterId: 0, direction: 0, sortBy: \"date\") {
                values {
                  id
                  firstName
                  lastName
                }
              }
            }
            `
          },
          format: { type: "graphql", values: "medicalDocuments.values" }
        }
      ],
      elements: [
        {
          id: "record-list",
          type: "SplitPanel",
          title: "Records",
          size: { w: 12, h: 16 },
          dependencies: { groups: "records-groups:values", values: "record-selection:values" },
          props: {
            cols: [
              { header: "Name", field: "validationEmployeeName" },
              { header: "Service Code", field: "serviceCode" },
              { header: "Service Name", field: "serviceName" },
              { header: "Operator", field: "operator" },
              { header: "Value", field: "resultValue" },
              { header: "Numeric Value", field: "numericValue" },
              { header: "Range", field: "normalRange" },
              { type: "button", value: "more", click: "openDetail" }
            ],
            group: { field: "firstName", secondaryField: "lastName" }
          },
          actions: {
            select: { action: "record-selection:updateDependencies", params: { id: "args:id" } },
            openDetail: { action: "dialog:details", params: { id: "args:id", title: "args:validationEmployeeName" } }
          }
        }
      ]
    },
    {
      id: "details",
      width: "50%",
      params: ["title"],
      dataSources: [
        {
          id: "detail",
          type: "GraphQL",
          dependencies: { id: "args:id" },
          params: {
            query: ({ id }) => {
              if (id) return
              `{
              medicalDocumentResults(medicalDocumentId: ${id}, pageSize: 10, sortBy: "MedicalDocumentId") {
                totalCount
                values {
                  validationEmployeeName
                  medicalDocumentId
                  serviceCode
                  serviceName
                  operator
                  resultValue
                  numericValue
                  normalRange
                }
              }
            }`;
            }
          },
          format: { type: "graphql", values: "detail:values" }
        }
      ],
      elements: [
        {
          id: "detail-item",
          type: "Detail",
          title: "Detail item",
          size: { w: 12, h: 16 },
          dependencies: { values: "record-selection:values" },
          props: {
            cols: [
              { header: "Name", field: "validationEmployeeName" },
              { header: "Service Code", field: "serviceCode" },
              { header: "Service Name", field: "serviceName" }
            ]
          }
        }
      ]
    }
  ],
  layouts: {
    lg: [
      {
        w: 4,
        h: 7,
        x: 2,
        y: 9,
        i: "table",
        minW: undefined,
        maxW: undefined,
        minH: undefined,
        maxH: undefined,
        moved: false,
        static: false,
        isDraggable: undefined,
        isResizable: undefined
      },
      {
        w: 3,
        h: 8,
        x: 0,
        y: 0,
        i: "pie_sample1",
        minW: undefined,
        maxW: undefined,
        minH: undefined,
        maxH: undefined,
        moved: false,
        static: false,
        isDraggable: undefined,
        isResizable: undefined
      },
      {
        w: 3,
        h: 8,
        x: 3,
        y: 0,
        i: "timeline",
        minW: undefined,
        maxW: undefined,
        minH: undefined,
        maxH: undefined,
        moved: false,
        static: false,
        isDraggable: undefined,
        isResizable: undefined
      },
      {
        w: 3,
        h: 8,
        x: 6,
        y: 0,
        i: "timeline-area",
        minW: undefined,
        maxW: undefined,
        minH: undefined,
        maxH: undefined,
        moved: false,
        static: false,
        isDraggable: undefined,
        isResizable: undefined
      },
      {
        w: 3,
        h: 8,
        x: 9,
        y: 0,
        i: "bar",
        minW: undefined,
        maxW: undefined,
        minH: undefined,
        maxH: undefined,
        moved: false,
        static: false,
        isDraggable: undefined,
        isResizable: undefined
      },
      {
        w: 2,
        h: 3,
        x: 0,
        y: 9,
        i: "scores",
        minW: undefined,
        maxW: undefined,
        minH: undefined,
        maxH: undefined,
        moved: false,
        static: false,
        isDraggable: undefined,
        isResizable: undefined
      }
    ]
  }
}