let sortChart = c3.generate({
  bindto: '.C3_chart__sort',
  data: {
    columns: [
      ['data1', 30],
      ['data2', 120],
    ],
    type: 'pie',
  }
});

let allProdsChart = c3.generate({
  bindto: '.C3_chart__allProds',
  data: {
    columns: [
      ['data1', 60],
      ['data2', 80],
    ],
    type: 'pie',
  }
});