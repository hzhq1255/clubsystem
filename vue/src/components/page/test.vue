<template>

	<div id="a3827e4825314c6d901325273c252b11" class="chart-container" style="width:900px; height:500px;"></div>
	
</template>

<script>
	import {china} from 'https://assets.pyecharts.org/assets/maps/china.js'
	import {echarts} from 'https://assets.pyecharts.org/assets/echarts.min.js'
	
	    export default {
			created(){
				this.getData()
			},
			
			methods:{
				method1(){
					china()
				},
				method2(){
					echarts()
				},
				getData(){
					var chart_a3827e4825314c6d901325273c252b11 = echarts.init(
					            document.getElementById('a3827e4825314c6d901325273c252b11'), 'white', {renderer: 'canvas'});
					        var option_a3827e4825314c6d901325273c252b11 = {
					    "animation": true,
					    "animationThreshold": 2000,
					    "animationDuration": 1000,
					    "animationEasing": "cubicOut",
					    "animationDelay": 0,
					    "animationDurationUpdate": 300,
					    "animationEasingUpdate": "cubicOut",
					    "animationDelayUpdate": 0,
					    "color": [
					        "#c23531",
					        "#2f4554",
					        "#61a0a8",
					        "#d48265",
					        "#749f83",
					        "#ca8622",
					        "#bda29a",
					        "#6e7074",
					        "#546570",
					        "#c4ccd3",
					        "#f05b72",
					        "#ef5b9c",
					        "#f47920",
					        "#905a3d",
					        "#fab27b",
					        "#2a5caa",
					        "#444693",
					        "#726930",
					        "#b2d235",
					        "#6d8346",
					        "#ac6767",
					        "#1d953f",
					        "#6950a1",
					        "#918597"
					    ],
					    "series": [
					        {
					            "type": "map",
					            "name": "\u7528\u6237\u5206\u5e03",
					            "label": {
					                "show": true,
					                "position": "top",
					                "margin": 8
					            },
					            "mapType": "china",
					            "data": [
					                {
					                    "name": "\u5e7f\u4e1c",
					                    "value": 19053
					                },
					                {
					                    "name": "\u5317\u4eac",
					                    "value": 1704
					                },
					                {
					                    "name": "\u6e56\u5357",
					                    "value": 2218
					                },
					                {
					                    "name": "\u4e0a\u6d77",
					                    "value": 1367
					                },
					                {
					                    "name": "\u798f\u5efa",
					                    "value": 1512
					                },
					                {
					                    "name": "\u5b89\u5fbd",
					                    "value": 1529
					                },
					                {
					                    "name": "\u56db\u5ddd",
					                    "value": 3951
					                },
					                {
					                    "name": "\u6c5f\u82cf",
					                    "value": 2942
					                },
					                {
					                    "name": "\u6cb3\u5317",
					                    "value": 1097
					                },
					                {
					                    "name": "\u4e91\u5357",
					                    "value": 1301
					                },
					                {
					                    "name": "\u6cb3\u5357",
					                    "value": 2078
					                },
					                {
					                    "name": "\u6d59\u6c5f",
					                    "value": 2349
					                },
					                {
					                    "name": "\u91cd\u5e86\u5e02",
					                    "value": 1625
					                },
					                {
					                    "name": "\u9655\u897f",
					                    "value": 1397
					                },
					                {
					                    "name": "\u5929\u6d25\u5e02",
					                    "value": 465
					                },
					                {
					                    "name": "\u6e56\u5317",
					                    "value": 2339
					                },
					                {
					                    "name": "\u65b0\u7586\u7ef4\u543e\u5c14\u81ea\u6cbb",
					                    "value": 391
					                },
					                {
					                    "name": "\u8fbd\u5b81",
					                    "value": 889
					                },
					                {
					                    "name": "\u5c71\u4e1c",
					                    "value": 2137
					                },
					                {
					                    "name": "\u7518\u8083",
					                    "value": 457
					                },
					                {
					                    "name": "\u6d77\u5357",
					                    "value": 415
					                },
					                {
					                    "name": "\u6c5f\u897f",
					                    "value": 1336
					                },
					                {
					                    "name": "\u9ed1\u9f99\u6c5f",
					                    "value": 592
					                },
					                {
					                    "name": "\u5c71\u897f",
					                    "value": 596
					                },
					                {
					                    "name": "\u8d35\u5dde",
					                    "value": 1158
					                },
					                {
					                    "name": "\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb",
					                    "value": 2380
					                },
					                {
					                    "name": "\u5409\u6797",
					                    "value": 468
					                },
					                {
					                    "name": "\u53f0\u6e7e",
					                    "value": 139
					                },
					                {
					                    "name": "\u5185\u8499\u53e4\u81ea\u6cbb",
					                    "value": 358
					                },
					                {
					                    "name": "\u897f\u85cf\u81ea\u6cbb",
					                    "value": 108
					                },
					                {
					                    "name": "\u5b81\u590f\u56de\u65cf\u81ea\u6cbb",
					                    "value": 151
					                },
					                {
					                    "name": "\u9752\u6d77",
					                    "value": 128
					                }
					            ],
					            "roam": true,
					            "zoom": 1,
					            "showLegendSymbol": true,
					            "emphasis": {}
					        }
					    ],
					    "legend": [
					        {
					            "data": [
					                "\u7528\u6237\u5206\u5e03"
					            ],
					            "selected": {
					                "\u7528\u6237\u5206\u5e03": true
					            },
					            "show": true
					        }
					    ],
					    "tooltip": {
					        "show": true,
					        "trigger": "item",
					        "triggerOn": "mousemove|click",
					        "axisPointer": {
					            "type": "line"
					        },
					        "textStyle": {
					            "fontSize": 14
					        },
					        "borderWidth": 0
					    },
					    "title": [
					        {
					            "text": "\u7528\u6237\u5206\u5e03\u793a\u4f8b"
					        }
					    ]
					};
					        chart_a3827e4825314c6d901325273c252b11.setOption(option_a3827e4825314c6d901325273c252b11);
				}
			}
			}

</script>

<style>
</style>
