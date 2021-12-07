export function C3_sortIncRender(obj) {
  const { data, colors } = obj
  let sortIncChart = c3.generate({
    bindto: '.C3_chart__sort',
    data: {
      columns: data,
      type: 'pie',
      colors: colors
    },
  });
}

export function C3_allProdsIncRender(data, colors) {
  let allProdsIncChart = c3.generate({
    bindto: '.C3_chart__allProds',
    data: {
      columns: data,
      type: 'pie',
    },
    colors: colors
  });
}

// let allProdsIncChart = c3.generate({
//   bindto: '.C3_chart__allProds',
//   data: {
//     columns: [
//       ['data1', 60],
//       ['data2', 80],
//       ['data3', 0],
//     ],
//     type: 'pie',
//   }
// });