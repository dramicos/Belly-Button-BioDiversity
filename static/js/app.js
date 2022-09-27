
let bbData = "./samples.json";

function init() {
    populateSelect();
    //Initializes the page with a default bar plot
    bugBarPlot();
    //Initializes the page with a default bubble plot
    bugBubblePlot();
    
}

init();
function bugBarPlot(index = 0) {
    d3.json(bbData).then(function(data) {
        // Setting the initial plot parameters
        //console.log(data);
        let dataO = data.samples[index];
        let slicedIds = dataO.otu_ids.slice(0,10);
        let slicedLabels = dataO.otu_labels.slice(0,10);
        let slicedValues = dataO.sample_values.slice(0,10);
        slicedIds = slicedIds.map(i => 'OTU ' + i);

        let plotData = [{
            type : 'bar',
            x: slicedValues.reverse(),
            y: slicedIds.reverse(),
            orientation: 'h',
            text: slicedLabels.reverse()      
        }];

        let layout = {
            font: {size: 14}
        };

        let config = {responsive: true}
      
        Plotly.newPlot("bar", plotData, layout, config);
    });
}


function bugBubblePlot(index = 0) {
    d3.json(bbData).then(function(data) {
        // Setting the initial plot parameters
        let dataO = data.samples[index];
        let Ids = dataO.otu_ids;
        let Labels = dataO.otu_labels;
        let Values = dataO.sample_values;   

        let plotData = [{
            type : 'bubble',
            x: Ids,
            y: Values,
            mode: 'markers',
            marker: {
                color: Ids,
                size: Values
            },
            text: Labels     
        }];

        let layout = {
            xaxis: {
                title: {
                    text: 'OTU ID'
                }
            }
        }
      
        Plotly.newPlot("bubble", plotData, layout);
    });
}

async function getDemographics(testSample = 0) {
    d3.json(bbData).then(function(data){
        let 
    });
}


//d3.selectAll("#selDataset").on("change", updatePlotly);

function populateSelect(){
    d3.json(bbData).then(function(data){
        let subjects = data.names;
        let ele = document.getElementById("selDataset");
        for (let i=0; i < data.names.length; i++){
            ele.innerHTML = ele.innerHTML + '<option value="' + subjects[i] + '">' + subjects[i] + '</option>'
        }
    });
}


// This function is called when a dropdown menu item is selected
function updatePlotly(index = 0) {
    d3.json(bbData).then(function(data){
        let sample = data.samples[index];
        let Ids = sample.otu_ids;
        let Labels = sample.otu_labels;
        let Values = sample.sample_values;
        let slicedIds = sample.otu_ids.slice(0,10);
        let slicedLabels = sample.otu_labels.slice(0,10);
        let slicedValues = sample.sample_values.slice(0,10);
        slicedIds = slicedIds.map(i => 'OTU ' + i);

        let barUpdate = [{
            x: slicedValues,
            y: slicedIds,
            text: slicedLabels     
        }];
        let bubbleUpdate = [{
            x: Ids,
            y: Values,
            marker: {
                color: Ids,
                size: Values
            },
            text: Labels     
        }];
        
        Plotly.restyle("bar",barUpdate);
        Plotly.restyle("bubble", bubbleUpdate);
    
    });
    


    // Note the extra brackets around 'x' and 'y'
   // Plotly.restyle("plot", "x", [x]);
   // Plotly.restyle("plot", "y", [y]);
}
function optionChanged(selection){
    d3.json(bbData).then(function(data){
        let index = data.names.findIndex(function(d) { return d == selection});
        bugBarPlot(index);
        bugBubblePlot(index);
        // updatePlotly(index);
    });
}

//updatePlotly(2);

