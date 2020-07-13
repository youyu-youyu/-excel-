<template>
  <div class="Echarts">
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
  export default {
    name: 'Echarts',
    data() {
      return {
        projectList: []
      }
    },
    methods: {
      myEcharts() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: 'ECharts'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            // data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            data: this.projectList[0]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    },
    mounted() {
      this.projectList = this.$route.query.projectList
      this.myEcharts();
      console.log(this.projectList)
    }
  }
</script>


<style scoped>

</style>
