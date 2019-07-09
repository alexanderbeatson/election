function renderText() {
  d3.select('.intro')
    .append('p')
    .style('margin','5%')
    .text(text['intro'][lang]);
}
