

import Scatter from '../charts/Scatter';
import Demo from './Demo';

export default () => {

	window.scatterDemo = new Demo('app', Scatter, [
		{
			chart: {
				marginLeft: 280
			},
			title: {
				text: 'GO富集分析散点图'
			},
			colorAxis: {
				stops: [
					[0, '#ff0000'],
					[0.25, '#81fe3e'],
					[0.5, '#3bfaf3'],
					[1, '#8342ff']
				]
			},
			xAxis: {
				min: 0,
				max: 59,
				// categories: [
				// 	"Plant hormone signal transduction",
				// 	"Plant-pathogen interaction",
				// 	"Protein processing in endoplasmic reticulum",
				// 	"Pentose and glucuronate interconversions",
				// 	"MAPK signaling pathway - plant",
				// 	"Pyruvate metabolism",
				// 	"Amino sugar and nucleotide sugar metabolism",
				// 	"Glycerolipid metabolism",
				// 	"Arginine and proline metabolism",
				// 	"Phenylpropanoid biosynthesis",
				// 	"Ascorbate and aldarate metabolism",
				// 	"alpha-Linolenic acid metabolism",
				// 	"Carotenoid biosynthesis",
				// 	"Carbon metabolism",
				// 	"Endocytosis",
				// 	"Galactose metabolism",
				// 	"Circadian rhythm - plant",
				// 	"Pentose phosphate pathway",
				// 	"Pantothenate and CoA biosynthesis",
				// 	"Vitamin B6 metabolism"
				//  ],
				title: {
					text: 'Description',
					x: 15,
					style: {
						fontWeight: 'bold'
					}
				},
			},
			tooltip: {
				pointFormat: '({point.x}, {point.y}), Size: {point.z}, QValue: {point.qValue}'
			},
			yAxis: {
				
				title: {
					text: 'Rich Ratio',
					style: {
						fontWeight: 'bold'
					}
				}
			},
			plotOptions: {
				bub: {
					point: {
						events: {
							click: function () {
								console.log(this)
							}
						}
					}
				}
			},
			legend: {
				title: {
					text: 'Gene Number'
				}
			},
			"series":[
				{
						"data":[
								{
										"name":"calcium ion transmembrane transporter activity",
										"liandong":"GO:0015085",
										"qValue":3.2452602196155476,
										"y":0.06779661016949153,
										"z":"8.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000004026/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"calcium channel activity",
										"liandong":"GO:0005262",
										"qValue":2.915808667514414,
										"y":0.059322033898305086,
										"z":"7.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"metal ion transmembrane transporter activity",
										"liandong":"GO:0046873",
										"qValue":2.8979015421449597,
										"y":0.1016949152542373,
										"z":"12.0",
										"geneID":"ENSRNOG00000025639/ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000004026/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000018111/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"voltage-gated cation channel activity",
										"liandong":"GO:0022843",
										"qValue":2.6940498613584123,
										"y":0.059322033898305086,
										"z":"7.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000033893"
								},
								{
										"name":"cation channel activity",
										"liandong":"GO:0005261",
										"qValue":2.1223033013671566,
										"y":0.07627118644067797,
										"z":"9.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"voltage-gated ion channel activity",
										"liandong":"GO:0005244",
										"qValue":2.1223033013671566,
										"y":0.059322033898305086,
										"z":"7.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000033893"
								},
								{
										"name":"ion gated channel activity",
										"liandong":"GO:0022839",
										"qValue":2.1223033013671566,
										"y":0.07627118644067797,
										"z":"9.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000033893"
								},
								{
										"name":"voltage-gated channel activity",
										"liandong":"GO:0022832",
										"qValue":2.1223033013671566,
										"y":0.059322033898305086,
										"z":"7.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000033893"
								},
								{
										"name":"gated channel activity",
										"liandong":"GO:0022836",
										"qValue":2.1029456519497733,
										"y":0.07627118644067797,
										"z":"9.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000033893"
								},
								{
										"name":"ion channel activity",
										"liandong":"GO:0005216",
										"qValue":2.1029456519497733,
										"y":0.0847457627118644,
										"z":"10.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"substrate-specific channel activity",
										"liandong":"GO:0022838",
										"qValue":2.0738328664278254,
										"y":0.0847457627118644,
										"z":"10.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"ligand-gated calcium channel activity",
										"liandong":"GO:0099604",
										"qValue":1.8986301042942713,
										"y":0.025423728813559324,
										"z":"3.0",
										"geneID":"ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000008766"
								},
								{
										"name":"channel activity",
										"liandong":"GO:0015267",
										"qValue":1.8134562179223135,
										"y":0.0847457627118644,
										"z":"10.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"passive transmembrane transporter activity",
										"liandong":"GO:0022803",
										"qValue":1.8134562179223135,
										"y":0.0847457627118644,
										"z":"10.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000007104/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000007528/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"neurotransmitter receptor activity",
										"liandong":"GO:0030594",
										"qValue":1.7212751263102168,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000002549/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000008766"
								},
								{
										"name":"glutamate receptor activity",
										"liandong":"GO:0008066",
										"qValue":1.7212751263102168,
										"y":0.025423728813559324,
										"z":"3.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000008766"
								},
								{
										"name":"steroid hormone receptor binding",
										"liandong":"GO:0035258",
										"qValue":1.4843960170908628,
										"y":0.03389830508474576,
										"z":"4.0",
										"geneID":"ENSRNOG00000007607/ENSRNOG00000001585/ENSRNOG00000012061/ENSRNOG00000060496"
								},
								{
										"name":"nuclear hormone receptor binding",
										"liandong":"GO:0035257",
										"qValue":1.4094315676705123,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000007607/ENSRNOG00000001585/ENSRNOG00000012061/ENSRNOG00000060496/ENSRNOG00000003694"
								},
								{
										"name":"PDZ domain binding",
										"liandong":"GO:0030165",
										"qValue":1.3776459606058677,
										"y":0.03389830508474576,
										"z":"4.0",
										"geneID":"ENSRNOG00000004208/ENSRNOG00000004026/ENSRNOG00000007346/ENSRNOG00000038365"
								},
								{
										"name":"voltage-gated calcium channel activity",
										"liandong":"GO:0005245",
										"qValue":1.3776459606058677,
										"y":0.025423728813559324,
										"z":"3.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000002863/ENSRNOG00000033893"
								},
								{
										"name":"synaptic membrane",
										"liandong":"GO:0097060",
										"qValue":3.516898463126935,
										"y":0.0975609756097561,
										"z":"12.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000013042/ENSRNOG00000007014/ENSRNOG00000004026/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000026705/ENSRNOG00000008766/ENSRNOG00000007346/ENSRNOG00000026432/ENSRNOG00000058975/ENSRNOG00000031232"
								},
								{
										"name":"glutamatergic synapse",
										"liandong":"GO:0098978",
										"qValue":2.9600356176185283,
										"y":0.08943089430894309,
										"z":"11.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000058842/ENSRNOG00000007014/ENSRNOG00000004026/ENSRNOG00000047014/ENSRNOG00000026705/ENSRNOG00000007346/ENSRNOG00000026432/ENSRNOG00000058975/ENSRNOG00000004353/ENSRNOG00000031232"
								},
								{
										"name":"postsynaptic membrane",
										"liandong":"GO:0045211",
										"qValue":2.9600356176185283,
										"y":0.07317073170731707,
										"z":"9.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000007014/ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000026705/ENSRNOG00000008766/ENSRNOG00000007346/ENSRNOG00000058975/ENSRNOG00000031232"
								},
								{
										"name":"postsynaptic density",
										"liandong":"GO:0014069",
										"qValue":2.897771913128682,
										"y":0.08130081300813008,
										"z":"10.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000007104/ENSRNOG00000007014/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000026705/ENSRNOG00000007346/ENSRNOG00000018712/ENSRNOG00000058975/ENSRNOG00000047516"
								},
								{
										"name":"asymmetric synapse",
										"liandong":"GO:0032279",
										"qValue":2.897771913128682,
										"y":0.08130081300813008,
										"z":"10.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000007104/ENSRNOG00000007014/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000026705/ENSRNOG00000007346/ENSRNOG00000018712/ENSRNOG00000058975/ENSRNOG00000047516"
								},
								{
										"name":"neuron to neuron synapse",
										"liandong":"GO:0098984",
										"qValue":2.7718938014313856,
										"y":0.08130081300813008,
										"z":"10.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000007104/ENSRNOG00000007014/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000026705/ENSRNOG00000007346/ENSRNOG00000018712/ENSRNOG00000058975/ENSRNOG00000047516"
								},
								{
										"name":"postsynaptic specialization",
										"liandong":"GO:0099572",
										"qValue":2.7718938014313856,
										"y":0.08130081300813008,
										"z":"10.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000007104/ENSRNOG00000007014/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000026705/ENSRNOG00000007346/ENSRNOG00000018712/ENSRNOG00000058975/ENSRNOG00000047516"
								},
								{
										"name":"presynapse",
										"liandong":"GO:0098793",
										"qValue":2.5404208977512877,
										"y":0.0975609756097561,
										"z":"12.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000058842/ENSRNOG00000004026/ENSRNOG00000033942/ENSRNOG00000048248/ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000058975/ENSRNOG00000004353/ENSRNOG00000036661/ENSRNOG00000008203"
								},
								{
										"name":"dendritic spine",
										"liandong":"GO:0043197",
										"qValue":2.5375518318928245,
										"y":0.056910569105691054,
										"z":"7.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000004026/ENSRNOG00000047014/ENSRNOG00000026705/ENSRNOG00000018712/ENSRNOG00000004353/ENSRNOG00000028404"
								},
								{
										"name":"neuron spine",
										"liandong":"GO:0044309",
										"qValue":2.5347140729392574,
										"y":0.056910569105691054,
										"z":"7.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000004026/ENSRNOG00000047014/ENSRNOG00000026705/ENSRNOG00000018712/ENSRNOG00000004353/ENSRNOG00000028404"
								},
								{
										"name":"exocytic vesicle",
										"liandong":"GO:0070382",
										"qValue":2.0487837723730125,
										"y":0.056910569105691054,
										"z":"7.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000048248/ENSRNOG00000026705/ENSRNOG00000026432/ENSRNOG00000036661/ENSRNOG00000018321/ENSRNOG00000008203"
								},
								{
										"name":"postsynaptic density membrane",
										"liandong":"GO:0098839",
										"qValue":1.7465593214251212,
										"y":0.032520325203252036,
										"z":"4.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000033942/ENSRNOG00000026705/ENSRNOG00000058975"
								},
								{
										"name":"presynaptic active zone",
										"liandong":"GO:0048786",
										"qValue":1.7317067261286447,
										"y":0.032520325203252036,
										"z":"4.0",
										"geneID":"ENSRNOG00000004026/ENSRNOG00000026705/ENSRNOG00000058975/ENSRNOG00000004353"
								},
								{
										"name":"Schaffer collateral - CA1 synapse",
										"liandong":"GO:0098685",
										"qValue":1.5807266058309293,
										"y":0.032520325203252036,
										"z":"4.0",
										"geneID":"ENSRNOG00000026705/ENSRNOG00000007346/ENSRNOG00000018712/ENSRNOG00000058975"
								},
								{
										"name":"synaptic vesicle",
										"liandong":"GO:0008021",
										"qValue":1.5794667040835586,
										"y":0.04878048780487805,
										"z":"6.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000048248/ENSRNOG00000026705/ENSRNOG00000026432/ENSRNOG00000036661/ENSRNOG00000008203"
								},
								{
										"name":"ion channel complex",
										"liandong":"GO:0034702",
										"qValue":1.5794667040835586,
										"y":0.056910569105691054,
										"z":"7.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"cation channel complex",
										"liandong":"GO:0034703",
										"qValue":1.5789777989741391,
										"y":0.04878048780487805,
										"z":"6.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"NMDA selective glutamate receptor complex",
										"liandong":"GO:0017146",
										"qValue":1.5789777989741391,
										"y":0.016260162601626018,
										"z":"2.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000008766"
								},
								{
										"name":"transmembrane transporter complex",
										"liandong":"GO:1902495",
										"qValue":1.4922149429569682,
										"y":0.056910569105691054,
										"z":"7.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"transporter complex",
										"liandong":"GO:1990351",
										"qValue":1.4486760778240542,
										"y":0.056910569105691054,
										"z":"7.0",
										"geneID":"ENSRNOG00000033942/ENSRNOG00000061182/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000011369/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"modulation of chemical synaptic transmission",
										"liandong":"GO:0050804",
										"qValue":1.7709297420186718,
										"y":0.1016949152542373,
										"z":"12.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000013042/ENSRNOG00000011951/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000058975/ENSRNOG00000004353"
								},
								{
										"name":"regulation of trans-synaptic signaling",
										"liandong":"GO:0099177",
										"qValue":1.7709297420186718,
										"y":0.1016949152542373,
										"z":"12.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000013042/ENSRNOG00000011951/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000058975/ENSRNOG00000004353"
								},
								{
										"name":"glutamate receptor signaling pathway",
										"liandong":"GO:0007215",
										"qValue":1.7709297420186718,
										"y":0.05084745762711865,
										"z":"6.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000008766/ENSRNOG00000043103"
								},
								{
										"name":"regulation of synaptic plasticity",
										"liandong":"GO:0048167",
										"qValue":1.7709297420186718,
										"y":0.06779661016949153,
										"z":"8.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000011951/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000026705/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000058975"
								},
								{
										"name":"long term synaptic depression",
										"liandong":"GO:0060292",
										"qValue":1.7709297420186718,
										"y":0.03389830508474576,
										"z":"4.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000011951/ENSRNOG00000026705/ENSRNOG00000058975"
								},
								{
										"name":"learning",
										"liandong":"GO:0007612",
										"qValue":1.6605963330561835,
										"y":0.059322033898305086,
										"z":"7.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000026705/ENSRNOG00000018111/ENSRNOG00000028404/ENSRNOG00000008312"
								},
								{
										"name":"negative regulation of synaptic transmission",
										"liandong":"GO:0050805",
										"qValue":1.6605963330561835,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000013042/ENSRNOG00000011951/ENSRNOG00000026705/ENSRNOG00000058975"
								},
								{
										"name":"regulation of synaptic vesicle exocytosis",
										"liandong":"GO:2000300",
										"qValue":1.6605963330561835,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000004353"
								},
								{
										"name":"regulation of long term synaptic depression",
										"liandong":"GO:1900452",
										"qValue":1.6605963330561835,
										"y":0.025423728813559324,
										"z":"3.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000026705/ENSRNOG00000058975"
								},
								{
										"name":"regulation of synaptic vesicle transport",
										"liandong":"GO:1902803",
										"qValue":1.6399473501541735,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000004353"
								},
								{
										"name":"divalent metal ion transport",
										"liandong":"GO:0070838",
										"qValue":1.5628785108271634,
										"y":0.09322033898305085,
										"z":"11.0",
										"geneID":"ENSRNOG00000025639/ENSRNOG00000007104/ENSRNOG00000004026/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000012061/ENSRNOG00000018712/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"divalent inorganic cation transport",
										"liandong":"GO:0072511",
										"qValue":1.5585470778353603,
										"y":0.09322033898305085,
										"z":"11.0",
										"geneID":"ENSRNOG00000025639/ENSRNOG00000007104/ENSRNOG00000004026/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000012061/ENSRNOG00000018712/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"cognition",
										"liandong":"GO:0050890",
										"qValue":1.5496318027846063,
										"y":0.07627118644067797,
										"z":"9.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000011951/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000026705/ENSRNOG00000018111/ENSRNOG00000014008/ENSRNOG00000028404/ENSRNOG00000008312"
								},
								{
										"name":"regulation of neurotransmitter transport",
										"liandong":"GO:0051588",
										"qValue":1.4501087657343905,
										"y":0.05084745762711865,
										"z":"6.0",
										"geneID":"ENSRNOG00000013042/ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000004353"
								},
								{
										"name":"calcium ion transport",
										"liandong":"GO:0006816",
										"qValue":1.4501087657343905,
										"y":0.0847457627118644,
										"z":"10.0",
										"geneID":"ENSRNOG00000007104/ENSRNOG00000004026/ENSRNOG00000047014/ENSRNOG00000033942/ENSRNOG00000008766/ENSRNOG00000002863/ENSRNOG00000012061/ENSRNOG00000018712/ENSRNOG00000006324/ENSRNOG00000033893"
								},
								{
										"name":"regulation of calcium ion-dependent exocytosis",
										"liandong":"GO:0017158",
										"qValue":1.328705855954597,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000004353"
								},
								{
										"name":"regulation of neurotransmitter secretion",
										"liandong":"GO:0046928",
										"qValue":1.328705855954597,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000004353"
								},
								{
										"name":"learning or memory",
										"liandong":"GO:0007611",
										"qValue":1.328705855954597,
										"y":0.06779661016949153,
										"z":"8.0",
										"geneID":"ENSRNOG00000043465/ENSRNOG00000011951/ENSRNOG00000033942/ENSRNOG00000016429/ENSRNOG00000026705/ENSRNOG00000018111/ENSRNOG00000028404/ENSRNOG00000008312"
								},
								{
										"name":"synaptic vesicle exocytosis",
										"liandong":"GO:0016079",
										"qValue":1.2631203157355835,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000004353"
								},
								{
										"name":"regulation of synaptic vesicle cycle",
										"liandong":"GO:0098693",
										"qValue":1.2631203157355835,
										"y":0.0423728813559322,
										"z":"5.0",
										"geneID":"ENSRNOG00000026705/ENSRNOG00000012061/ENSRNOG00000026432/ENSRNOG00000018712/ENSRNOG00000004353"
								}
						],
						"colorKey":"qValue",
						"type":"bub",
				}
		]
		}
	], [{
		name: '图表配置',
		code: 'common',
		items: [{
			key: 'chart.marginLeft',
			name: '左轴标签宽度',
			type: 'number',
			getValue: function (value) {
				console.log(value);
				return value === 0 ? undefined : value
			}
		}]
	}, {
		name: '标题及样式',
		code: 'common',
		items: [{
			key: 'title.text',
			name: '标题内容',
			type: 'text'
		},
		{
			key: 'title.style',
			type: 'font',
			name: '标题样式'
		}, {
			key: 'yAxis.title.text',
			name: 'X 轴标题',
			type: 'text'
		}, {
			key: 'yAxis.title.style',
			name: 'X 轴标题样式',
			type: 'font'
		}, {
			key: 'yAxis.labels.style',
			name: 'X 轴标签样式',
			type: 'font'
		}, {
			key: 'xAxis.title.text',
			name: 'Y 轴标题',
			type: 'text'
		}, {
			key: 'xAxis.title.style',
			name: 'Y 轴标题样式',
			type: 'font'
		}, {
			key: 'xAxis.labels.style',
			name: 'Y 轴标签样式',
			type: 'font'
		}]
	}, {
		name: '图例',
		code: 'legend',
		items: [{
			key: 'legend',
			name: '位置',
			type: 'select',
			options: {
				value: 1,
				items: [{
					name: '左上角',
					value: 0
				}, {
					name: '右上角',
					value: 1
				}, {
					name: '右下角',
					value: 2
				}, {
					name: '左下角',
					value: 3
				}],

			},
			getValue: function (value) {
				let result = {
					align: value === 0 || value === 3 ? 'left' : 'right',
					verticalAlign: value === 0 || value === 1 ? 'top' : 'bottom'
				};
				console.log(value, result);
				return result
			}
		}, {
			key: 'legend',
			name: '偏移',
			type: 'size',
			options: {
				value: {
					w: 0,
					h: 0,
					suffix: 'px'
				},

			},
			getValue: function (value) {
				return {
					x: value.w,
					y: value.h
				}
			}
		}, {
			key: 'colorAxis.stops',
			type: 'color',
			name: '颜色',
			options: {
				values: [
					'#ff0000',
					'#81fe3e',
					'#3bfaf3',
					'#8342ff'
				],
				limit: {
					min: 2,
					max: 10
				}
			},
			getValue: function (value) {
				let result = [],
					length = value.length - 1,
					step = 1 / length;

				value.forEach((v, i) => {
					result.push([
						i * step,
						v
					])
				});

				return result;
			}
		}]
	}, {
		name: '尺寸及位置',
		code: 'size-position',
		items: [{
			type: 'size',
			key: 'size',
			name: '尺寸',
			options: {
				value: {
					w: 600,
					h: 700,
					suffix: 'px'
				}
			}
		}, {
			type: 'size',
			key: 'position',
			name: '位置',
			options: {
				value: {
					w: 0,
					h: 0,
					suffix: 'px'
				}
			},
			getValue: value => {
				value.x = value.w;
				value.y = value.h;
				delete value.w;
				delete value.h;
				return value;
			}
		}]
	}, {
		name: '下载图片',
		code: 'export',
		items: [{
			name: '格式',
			key: 'type',
			type: 'select',
			options: {
				items: [{
					name: 'SVG'
				}, {
					name: 'PNG'
				}, {
					name: 'JPG'
				}, {
					name: 'PDF'
				}],
				value: 0
			}
		}, {
			name: '文件名',
			key: 'filename',
			type: 'text',
			options: {
				value: 'scatter'
			}
		}]
	}], {
		filename: 'venn',
		size: {
			w: 600,
			h: 700
		}
	}
	);
}