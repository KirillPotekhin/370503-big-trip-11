import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ChartConfiguration, TYPES, ChartTypeLabelsMap} from "../const.js";
import Moment from "moment";

const createStatisticTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  show() {
    super.show();
    this._destroyCharts();
    this._renderCharts();
  }

  hide() {
    super.hide();
    this._destroyCharts();
  }

  _getTripEventsTypes() {
    let routeTypes = this._tripEvents.map((event) => {
      return event.type;
    });
    routeTypes = Array.from(new Set([...routeTypes]));
    return routeTypes;
  }

  _routeTypesObjectList() {
    const routeTypesObjectList = [];
    this._getTripEventsTypes().map((routeType) => {
      routeTypesObjectList.push({
        type: routeType,
      });
      return routeTypesObjectList;
    });
    return routeTypesObjectList;
  }

  _routeTypesDataList() {
    const filteredEvents = [];
    const routeTypesObjectList = this._routeTypesObjectList();
    this._getTripEventsTypes().forEach((routeTypeActive, i) => {
      filteredEvents.push(this._tripEvents.slice().filter((tripEvent) => tripEvent.type === routeTypeActive));
      routeTypesObjectList[i].money = filteredEvents[i].reduce((acc, it) => acc + it.price, 0);
      routeTypesObjectList[i].amount = filteredEvents[i].length;
      routeTypesObjectList[i].timeSpend = new Moment(filteredEvents[i].reduce((acc, it) => {
        const startTimeValue = new Moment(it.startTime);
        const endTimeValue = new Moment(it.endTime);
        acc = acc + Moment.duration(endTimeValue.diff(startTimeValue));
        return acc;
      }, 0)).hours();
      return routeTypesObjectList;
    });
    return routeTypesObjectList;
  }

  _getTransportEvents() {
    const transportEvents = [];
    TYPES.slice(0, 7).forEach((type) => {
      this._routeTypesDataList().forEach((tripEventType) => {
        if (tripEventType.type === type) {
          transportEvents.push(tripEventType);
        }
      });
    });

    return transportEvents;
  }

  _renderCharts() {
    const moneyCtxElement = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtxElement = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtxElement = this.getElement().querySelector(`.statistics__chart--time`);

    this._tripEvents = this._pointsModel.getEventsAll();

    this._tripEventsTypes = this._getTripEventsTypes();
    this._transportEvents = this._getTransportEvents();

    this._moneyChart = this._renderMoneyChart(moneyCtxElement);
    this._transportChart = this._renderTransportChart(transportCtxElement);
    this._timeSpendChart = this._renderTimeSpendChart(timeSpendCtxElement);
  }

  _renderMoneyChart(moneyCtxElement) {
    moneyCtxElement.height = ChartConfiguration.BAR_HEIGHT * this._tripEventsTypes.length;

    return new Chart(moneyCtxElement, {
      plugins: [ChartDataLabels],
      type: ChartConfiguration.CHART_TYPE,
      data: {
        labels: this._routeTypesDataList().map((item) => ChartTypeLabelsMap[item.type]),
        datasets: [{
          data: this._routeTypesDataList().map((item) => item.money),
          backgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          hoverBackgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartConfiguration.FONT_SIZE
            },
            color: ChartConfiguration.FONT_COLOR,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: ChartConfiguration.MONEY_CHART_TEXT,
          fontColor: ChartConfiguration.FONT_COLOR,
          fontSize: ChartConfiguration.TITLE_FONT_SIZE,
          position: `left`,
        },
        layout: {
          padding: {
            left: ChartConfiguration.CHART_PADDING_LEFT
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartConfiguration.FONT_COLOR,
              padding: ChartConfiguration.SCALE_Y_AXES_TICKS_PADDING,
              fontSize: ChartConfiguration.FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: ChartConfiguration.BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: ChartConfiguration.MIN_BAR_LENGTH
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _renderTransportChart(transportCtxElement) {
    transportCtxElement.height = ChartConfiguration.BAR_HEIGHT * this._transportEvents.length;

    return new Chart(transportCtxElement, {
      plugins: [ChartDataLabels],
      type: ChartConfiguration.CHART_TYPE,
      data: {
        labels: this._transportEvents.map((transportEvent) => ChartTypeLabelsMap[transportEvent.type]),
        datasets: [{
          data: this._transportEvents.map((transportEvent) => transportEvent.amount),
          backgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          hoverBackgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartConfiguration.FONT_SIZE
            },
            color: ChartConfiguration.FONT_COLOR,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: ChartConfiguration.TRANSPORT_CHART_TEXT,
          fontColor: ChartConfiguration.FONT_COLOR,
          fontSize: ChartConfiguration.TITLE_FONT_SIZE,
          position: `left`,
        },
        layout: {
          padding: {
            left: ChartConfiguration.CHART_PADDING_LEFT
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartConfiguration.FONT_COLOR,
              padding: ChartConfiguration.SCALE_Y_AXES_TICKS_PADDING,
              fontSize: ChartConfiguration.FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: ChartConfiguration.BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: ChartConfiguration.MIN_BAR_LENGTH
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _renderTimeSpendChart(timeSpendCtxElement) {
    timeSpendCtxElement.height = ChartConfiguration.BAR_HEIGHT * this._tripEventsTypes.length;

    return new Chart(timeSpendCtxElement, {
      plugins: [ChartDataLabels],
      type: ChartConfiguration.CHART_TYPE,
      data: {
        labels: this._routeTypesDataList().map((item) => ChartTypeLabelsMap[item.type]),
        datasets: [{
          data: this._routeTypesDataList().map((item) => item.timeSpend),
          backgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          hoverBackgroundColor: ChartConfiguration.BACKGROUND_COLOR,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartConfiguration.FONT_SIZE
            },
            color: ChartConfiguration.FONT_COLOR,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`
          }
        },
        title: {
          display: true,
          text: ChartConfiguration.TIME_SPEND_TEXT,
          fontColor: ChartConfiguration.FONT_COLOR,
          fontSize: ChartConfiguration.TITLE_FONT_SIZE,
          position: `left`,
        },
        layout: {
          padding: {
            left: ChartConfiguration.CHART_PADDING_LEFT
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartConfiguration.FONT_COLOR,
              padding: ChartConfiguration.SCALE_Y_AXES_TICKS_PADDING,
              fontSize: ChartConfiguration.FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: ChartConfiguration.BAR_THICKNESS,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: ChartConfiguration.MIN_BAR_LENGTH
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _destroyCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
