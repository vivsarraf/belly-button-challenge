// Assign the url to a constant variable
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Use D3 library to read the JSON file from the URL
d3.json(url).then(function(data){
    console.log(data);
}); 

// Initialize the dashboard  
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let samplenames = data.names;

        // Add  samples to dropdown menu
        samplenames.forEach((id) => {

            // print the value of the variables during the entire loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_first = samplenames[0];

        // Print the value of sample_one
        console.log(sample_first);

        // Build the initial plots
        populateMetadata(sample_first);
        populateBarChart(sample_first);
        populateBubbleChart(sample_first);
        populateGaugeChart(sample_first);
       
    });
};

// Function to populate metadata info
function populateMetadata(sample) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let Retrievemetadata = data.metadata;

        // Filter based on the value of the sample
        let value = Retrievemetadata.filter(result => result.id == sample);

        // Print the array of metadata objects
        console.log(value)

        // Get the first index from the array
        let valData = value[0];

        // Clear metadata content to make it ready for user input
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valData).forEach(([key,value]) => {

            // Print the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function to populate the bar chart
function populateBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let RetrievesampleInfo = data.samples;

        //Find the selected sample
        //let selectedSample = sampleInfo.find(result => r //

        // Filter based on the value of the sample
        let value = RetrievesampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valData.otu_ids;
        let otu_labels = valData.otu_labels;
        let sample_values = valData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: 'bar',
            orientation: 'h',
            //marker:{
                //color:'blue'
            //}   
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function to populate the bubble chart
function populateBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let RetrievesampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = RetrievesampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valData.otu_ids;
        let otu_labels = valData.otu_labels;
        let sample_values = valData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};
//Function to populate the Gauge Chart
function populateGaugeChart(sample) {
    d3.json(url).then((data) => {
      var metadata = data.metadata;
      var result = metadata.find(sampleObj => sampleObj.id == sample);
      var wfreq = result.wfreq;
  
      // Calculate angle for needle
      var degrees = 180 - (wfreq * 20),
        radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
  
      // Path for the needle
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
      var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
      var data = [
        {
          type: 'scatter',
          x: [0], y: [0],
          marker: { size: 28, color: '850000' },
          showlegend: false,
          name: 'frequency',
          text: wfreq,
          hoverinfo: 'text+name'
        },
        {
          type: 'pie',
          showlegend: false,
          hole: 0.5,
          rotation: 90,
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
          direction: 'clockwise',
          textinfo: 'text',
          textposition: 'inside',
          marker: {
            colors: [
              'rgba(247, 242, 236, .5)', 'rgba(244, 241, 229, .5)',
              'rgba(232, 226, 202, .5)', 'rgba(210, 206, 145, .5)',
              'rgba(202, 209, 95, .5)', 'rgba(170, 202, 42, .5)',
              'rgba(110, 154, 22, .5)', 'rgba(14, 127, 0, .5)',
              'rgba(0, 105, 11, .5)', 'rgba(255, 255, 255, 0)' // The last color is for the center (invisible)
            ]
          },
          labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
          hoverinfo: 'label'
        }
      ];
  
      var layout = {
        shapes: [{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
        height: 500,
        width: 500,
        xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
        yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] }
      };
  
      Plotly.newPlot('gauge', data, layout);
    });
  }
  
// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    populateMetadata(value);
    populateBarChart(value);
    populateBubbleChart(value);
    populateGaugeChart(value);
    };

// Initialize function
init();