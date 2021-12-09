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
  const { C3_prodsIncTopData, C3_prodsColorsData } = obj
  let allProdsIncChart = c3.generate({
    bindto: '.C3_chart__allProds',
    data: {
      columns: C3_prodsIncTopData,
      type: 'pie',
      colors: C3_prodsColorsData
    },
  });
}