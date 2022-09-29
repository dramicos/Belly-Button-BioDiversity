
const bbData = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


function init() {
    // Create the dropdown menu
    fillDropdown();
    // Initializes the page with a default bar plot
    bugBarPlot();
    // Initializes the page with a default bubble plot
    bugBubblePlot();
    // Initializes the default demographics
    getDemographics();

    // Initializes the page with a default gauge plot
    cleanGauge()
    
}

// Call the initialization
init();

// Create function to populate dropdown menu based on the JSON
function fillDropdown(){
    d3.json(bbData).then(function(data){
        let subjects = data.names;
        let row = document.getElementById("selDataset");
        for (let i=0; i < data.names.length; i++){
            row.innerHTML = row.innerHTML + '<option value="' + subjects[i] + '">' + subjects[i] + '</option>'
        }
    });
}

// Use plotly maps with JSON data to make a horizontal bar graph of top 10 cultures
function bugBarPlot(index = 0) {
    d3.json(bbData).then(function(data) {
        // Setting the initial plot parameters
        console.log(data);
        let dataSamp = data.samples[index];
        
        let Ids = dataSamp.otu_ids.slice(0,10).map(i => 'OTU ' + i);
        let Labels = dataSamp.otu_labels.slice(0,10);
        let Values = dataSamp.sample_values.slice(0,10);

        let plotData = [{
            type : 'bar',
            x: Values.reverse(),
            y: Ids.reverse(),
            orientation: 'h',
            text: Labels.reverse()      
        }];

        let layout = {
            title : "Top 10 Bacteria Cultures",
            margin: {t: 50, l: 140}
        };

        let config = {responsive: true};
      
        Plotly.newPlot("bar", plotData, layout, config);
    });
}

// Use plotly maps with JSON data to make a bubble graph of all bacteria cultures
function bugBubblePlot(index = 0) {
    d3.json(bbData).then(function(data) {
        // Setting the initial plot parameters
        let dataSamp = data.samples[index];
        let Ids = dataSamp.otu_ids;
        let Labels = dataSamp.otu_labels;
        let Values = dataSamp.sample_values;   

        let plotData = [{
            type : 'bubble',
            x: Ids,
            y: Values,
            mode: 'markers',
            marker: {
                color: Ids,
                size: Values,
                colorscale : "Earth"
            },
            text: Labels     
        }];

        let layout = {
            xaxis: { title: 'OTU ID' },
            hovermode :"closest",
            title : "Sampled Bacteria"
        }
        
        let config = {responsive: true};
        Plotly.newPlot("bubble", plotData, layout, config);
    });
}

// Make a information card to display the current sample's demograpics
function getDemographics(index = 0) {
    d3.json(bbData).then(function(data){
        let dataSamp = data.metadata[index];
        console.log("demo datasamp: ",dataSamp);

        let row = document.getElementById("sample-metadata");
        row.innerHTML = '<h4>' + 'id: ' + dataSamp.id + '</h4>';
        row.innerHTML = row.innerHTML + '<h6>' + 'ethnicity: ' + dataSamp.ethnicity + '</h6>';
        row.innerHTML = row.innerHTML + '<h6>' + 'gender: ' + dataSamp.gender + '</h6>';
        row.innerHTML = row.innerHTML + '<h6>' + 'age: ' + dataSamp.age + '</h6>';
        row.innerHTML = row.innerHTML + '<h6>' + 'location: ' + dataSamp.location + '</h6>';
        row.innerHTML = row.innerHTML + '<h6>' + 'bbtype: ' + dataSamp.bbtype + '</h6>';
        row.innerHTML = row.innerHTML + '<h6>' + 'wfreq: ' + dataSamp.wfreq + '</h6>';
    });
}

// BONUS: Use plotly maps with JSON data to make a gauge plot of the samples wash frequency
function cleanGauge(index = 0){
    console.log("wash frequency");
    d3.json(bbData).then(function(data){
        let dataSamp = data.metadata[index];
        let washFreq = dataSamp.wfreq;
        if (washFreq === 'null'){
            washFreq = 0;
        };
        // plot devised between https://plotly.com/javascript/gauge-charts/ and https://stackoverflow.com/questions/67529286/how-to-add-a-needle-or-dial-to-gauge-indicator-in-plotly-js
        // https://observablehq.com/@arronhunt/building-a-gauge-meter-with-plotly and https://coolors.co/gradient-palette/fff7d9-0d8c02?number=9
        // and some tinkering
        gaugeData = [{
            
            type: 'pie',
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: [20, 20, 20, 20, 20, 20, 20, 20, 20, 180],
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: ['#fff7d9','#e1eabe','#c3dca3','#a4cf88','#86c26e','#68b453','#4aa738','#2b991d','#0d8c02','white'],
                labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''],
                hoverinfo: "label"
                    },
            hoverinfo: "skip"
        }];

        let theta = (180 - 20*washFreq); 
        
        let r = .5
        let x_head =  r*Math.cos(Math.PI/180*theta)
        let y_head =  r*Math.sin(Math.PI/180*theta)

        let layout = {
            title: "<b>Belly Button Wash Freqency</b><br>Scrubs per Week",
            xaxis: {range: [-1, 1], showgrid: false, 'zeroline': false, 'visible': false},
            yaxis: {range: [-1, 1], showgrid: false, 'zeroline': false, 'visible': false},
            showlegend: false,
            annotations: [
                {
                    ax: 0,
                    ay: 0,
                    axref: 'x',
                    ayref: 'y',
                    x:  x_head,
                    y:  y_head,
                    xref: 'x',
                    yref: 'y',
                    showarrow: true,
                    arrowhead: 2
                }
            ]
        };
        Plotly.newPlot("gauge", gaugeData, layout);
    });
}


//  A function to update all the graphs and info based on the menu selection
function optionChanged(selection){
    d3.json(bbData).then(function(data){
        let index = data.names.findIndex(function(d) { return d == selection});
        bugBarPlot(index);
        bugBubblePlot(index);
        getDemographics(index);
        cleanGauge(index);
    });
}

