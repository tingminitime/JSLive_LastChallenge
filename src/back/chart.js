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

export function C3_allProdsIncRender(data) {
  let allProdsIncChart = c3.generate({
    bindto: '.C3_chart__allProds',
    data: {
      columns: data,
      type: 'pie'
    },
  });
}