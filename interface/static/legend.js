function createLegend(projectNodes, nodesData, nodesType='None') {
	var colorDic = {
		'Convolution': "#20C6FE",
		'Deconvolution': "#4dd2fe",
		'Max Pooling': "#0F7BA3",
		'Average Pooling': "#0b5875",
		//
		'LSTM': "#D48E9C",
		'GRU': "#C46677",
		'BiRNN': "#bf596c",
		'RNN': "#B43F56",
		'CRF': "#97293E",
		'Attention': "#6E202F",
		//
		'Input': "#D8C28E",
		'Dense': "#C9AB66",
		'Flatten': "#179D3E",
		'Dropout': "#aa883c",
		//
		'Embedding': "#ff1a1f",
		'Normalization': "#DD0005",
		'Optimizer': "#e60005",
		//					
		'ReLu': "#FFFF17",
		'Sigmoid': "#FFFF6D",
		'Softmax': "#DFE509",
		'Linear': "#f7fa84",
		'tanh': "#f1f622",
		//
		'Cross Entropy': "#FC20FF",
		'CTC': "#fc1aff",
		'L2': "#e200e6",
		'MSE': "#b000b3"
	};
	var typeDic = {
		'Convolution': "CNN",
		'Deconvolution': "CNN",
		'Max Pooling': "CNN",
		'Average Pooling': "CNN",
		'LSTM': "RNN",
		'GRU': "RNN",
		'BiRNN': "RNN",
		'RNN': "RNN",
		'CRF': "RNN",
		'Attention': "RNN",
		'Input': "DNN",
		'Dense': "DNN",
		'Flatten': "DNN",
		'Dropout': "DNN",
		'Embedding': "Other",
		'Normalization': "Other",
		'Optimizer': "Other",					
		'ReLu': "Activate",
		'Sigmoid': "Activate",
		'Softmax': "Activate",
		'Linear': "Activate",
		'tanh': "Activate",
		'Cross Entropy': "Loss",
		'CTC': "Loss",
		'L2': "Loss",
		'MSE': "Loss"
	}
	if (nodesType !== "None") {
		click_2(nodesType, typeDic);
	}
	/*
	var legendArr = [];
	// {"name": "relu", "color": "rgba(255, 166, 1, 0.65)", "number": 65}
	for (const key in typeDic) {
		if (nodesType !== "None") {
			if (typeDic[key] !== nodesType) {
				continue;
			}
		}
		var nodeLengend = {"name": key, "color": colorDic[key], "number": 0};
		for (const proId in projectNodes) {
			for (var i=0; i<projectNodes[proId].length; i++) {
				var flag = 0;
				var nodeName = projectNodes[proId][i].split("-")[0];
				if (nodeName == key) {
					nodeLengend["number"] += 1;
				}
			}
		}
		legendArr.push(nodeLengend);
	}	
	*/
	var legendArr = [];
	// {"name": "relu", "color": "rgba(255, 166, 1, 0.65)", "number": 1}
	for (const key in typeDic) {
		if (nodesType !== "None") {
			if (typeDic[key] !== nodesType) {
				continue;
			}
		}
		var nodeLengend = {"name": key, "color": colorDic[key], "number": 0};
		for (const proId in projectNodes) {
			for (var i=0; i<projectNodes[proId].length; i++) {
				var nodeName = projectNodes[proId][i].split("-")[0];
				if (nodeName == key) {
					nodeLengend["number"] += 1;
					break;
				}
			}
		}
		legendArr.push(nodeLengend);
	}
	d3.selectAll("#legendSvg").remove();
	var margin = {top: 30, right: 10, bottom: 10, left: 70},
		width = 2500 - margin.left - margin.right,
		height = 280 - margin.top - margin.bottom;

	var svg = d3.select('#chart_table').append("svg")
		.attr('width', width+margin.left+margin.right)
		.attr('height', height+margin.top+margin.bottom)
		.attr("id", "legendSvg")
		
	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1);

	var y = d3.scaleLinear()
		.domain([0, d3.max(legendArr, function (d) {return Number(d.number);})])
		.range([height, 0]);

	x.domain(legendArr.map(function (d) {return d.name;}));
	let yAxisGenerator = d3.axisLeft(y);
	yAxisGenerator.ticks(5, ".3");
	
	g.append("g")
		.attr("transform", "translate(0," + (-30) + ")")
		.call(yAxisGenerator);

	let xAxisGenerator = d3.axisBottom(x);
	g.append("g")
		.attr("transform", "translate(0," + (height-30) + ")")
		.call(xAxisGenerator)
		.selectAll("text")
		.attr("fill", "#ffffff");

	var barG = g.append("g")
		.attr("transform", "translate(" + 0 + "," + (-30) + ")");
	barG.selectAll(".typeBar")
		.data(legendArr)
		.enter()
		.append("rect")
			.attr("class", "typeBar")
			.attr("x", d => x(d.name))
			.attr("y", d => (y(d.number) || 0))
			.attr("width", x.bandwidth())
			.attr("height", function(d) {
				var he = y(Number(d.number));
				if (Number.isNaN(he)) {
					return 0;
				} else {
					return height - he;
				}
				
			})
			.attr("fill", d => d.color)
			.on("click", function (d, i) {
				click_3(d.name.replace(" ", "_"), nodesData, projectNodes);
			});

	if (nodesType == "None") {
		g.append("line")
			.attr("class", "catLine")
			.attr("id", "cnnLine")
			.attr("x1", 385)  
			.attr("y1", -30)
			.attr("x2", 385) 
			.attr("y2", 250)
			.style("stroke-width", 2)
			.style("stroke", "red")
			.style("stroke-dasharray", ("3, 3"))
			.style("fill", "none");

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", 0)
			.attr("x", 190)
			.text("CNN")
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.attr("font-weight", "100")
				.attr("fill", "black");	

		g.append("line")
			.attr("class", "catLine")
			.attr("id", "rnnLine")
			.attr("x1", 937)  
			.attr("y1", -30)
			.attr("x2", 937) 
			.attr("y2", 250)
			.style("stroke-width", 2)
			.style("stroke", "red")
			.style("stroke-dasharray", ("3, 3"))
			.style("fill", "none");

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", 0)
			.attr("x", 677)
			.text("RNN")
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.attr("font-weight", "100")
				.attr("fill", "black");	

		g.append("line")
			.attr("class", "catLine")
			.attr("id", "rnnLine")
			.attr("x1", 1305)  
			.attr("y1", -30)
			.attr("x2", 1305) 
			.attr("y2", 250)
			.style("stroke-width", 2)
			.style("stroke", "red")
			.style("stroke-dasharray", ("3, 3"))
			.style("fill", "none");

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", 0)
			.attr("x", 1143)
			.text("DNN")
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.attr("font-weight", "100")
				.attr("fill", "black");	

		g.append("line")
			.attr("class", "catLine")
			.attr("id", "rnnLine")
			.attr("x1", 1582)  
			.attr("y1", -30)
			.attr("x2", 1582) 
			.attr("y2", 250)
			.style("stroke-width", 2)
			.style("stroke", "red")
			.style("stroke-dasharray", ("3, 3"))
			.style("fill", "none");

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", 0)
			.attr("x", 1443)
			.text("Other Layers")
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.attr("font-weight", "100")
				.attr("fill", "black");	

		g.append("line")
			.attr("class", "catLine")
			.attr("id", "rnnLine")
			.attr("x1", 2040)  
			.attr("y1", -30)
			.attr("x2", 2040) 
			.attr("y2", 250)
			.style("stroke-width", 2)
			.style("stroke", "red")
			.style("stroke-dasharray", ("3, 3"))
			.style("fill", "none");

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", 0)
			.attr("x", 1811)
			.text("Activate Functions")
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.attr("font-weight", "100")
				.attr("fill", "black");	

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("y", 0)
			.attr("x", 2270)
			.text("Loss Functions")
				.attr("font-family", "sans-serif")
				.attr("font-size", "14px")
				.attr("font-weight", "100")
				.attr("fill", "black");
	}	

	for (var ind=0; ind<legendArr.length; ind++) {
		var leName = legendArr[ind]['name'];
		var leNum = legendArr[ind]["number"];
		if (leNum == 0) {
			var leC = legendArr[ind]['color'].replace("0.65", "0.15");
		} else {
			var leC = legendArr[ind]['color'];
		}
		
		g.append("rect")
			.attr("id", "leName-"+leName)
			.attr("class", "typeBar")
			.attr("x", x(leName))
			.attr("y", height-20)
			.attr("width", x.bandwidth()+5)
			.attr("height", 40)
			.attr("fill", leC)
			.on("click", function() {
				click_3(this.id.split("-")[1].replace(" ", "_"), nodesData, projectNodes);
			});

		g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", height)
		.attr("x", x(leName)+x.bandwidth()/2)
		.text(leName)
			.attr("font-family", "sans-serif")
			.attr("font-size", "14px")
			.attr("font-weight", "100")
			.attr("fill", function() {
				if (leName=='ReLu' || leName=='Sigmoid' || leName=='Linear' || leName=='tanh') {
					return "#d2dfde"
				} else {
					return "#ffffff"
				}
			});

		g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", y(leNum))
		.attr("x", x(leName)+x.bandwidth()/2)
		.text(function() {
			if (leNum==0) {
				return ""
			} else {
				return leNum
			}
		})
			.attr("font-family", "sans-serif")
			.attr("font-size", "16px")
			.attr("font-weight", "100")
			.attr("fill", function() {
				if (leName=='ReLu' || leName=='Sigmoid' || leName=='Linear' || leName=='tanh') {
					return "#d2dfde"
				} else {
					return "#ffffff"
				}
			});
	}
}