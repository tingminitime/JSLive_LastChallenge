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

export function C3_allProdsIncRender(obj) {
  const { C3_filterData, C3_colorsData } = obj
  let allProdsIncChart = c3.generate({
    bindto: '.C3_chart__allProds',
    data: {
      columns: C3_filterData,
      type: 'pie',
      colors: C3_colorsData
    },
  });
}