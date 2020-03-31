// Step 1: Use D3 to read in JSON
 // Importing data from local json file
    // Use d3.json() to fetch data from JSON file
    // Incoming data is internally referred to as incomingData
   
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;
        // Searching "names" through json file. "names" in the JSON file are the Test Subject ID numbers
        var names = data["names"];
       
        // Use map() method to create an array with the results of calling a function for every array element.
        names.map(function (testSubjectId) {

// Step 2: Drop down Menu

            // Use the d3.select() function in D3.js to select the first element that matches the specified 
            // selector string

            // Use D3 to select the dropdown menu
            var dropdownMenu = d3.select("#selDataset")
            // Append dropdown menu options
            dropdownMenu.append("option")
                // Test Subject ID Number
                .text(testSubjectId);
                
                // .property("value", testSubjectId);
        });
        // Display ID number 940
        var Id = names[0];
        // Caling functions for display
        metaData(Id);
        bar(Id);
        bubble(Id);
    });
// Function for Demographic info. 
function metaData(select) {
   // Importing data from local json file
    // Use d3.json() to fetch data from JSON file
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;
        // Define metaData variable
        
        var metaData = data["metadata"];
        //filter() to pass selection
        
        var filterSelect = metaData.filter(data => data.id == select);
        //  Check filtering
        console.log(filterSelect);
        // Get the id of the metadata
        var sampleMetaData = d3.selectAll("#sample-metadata");
        // Clear any data
        sampleMetaData.html("");
        // Grab keys and values
        Object.entries(filterSelect[0]).forEach(([key, val]) => {
            var option = sampleMetaData.append("p");
            option.text(`${key}: ${val}`);
        })
    })
};
// Create horizontal bar chart
// Importing data from local json file

function bar(select) {
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;
        
        var samples = data["samples"];
        // Use filter 
        var filterSelect = samples.filter(data => data.id == select);
        // Define the variables
        var id = filterSelect[0].otu_ids;
        var value = filterSelect[0].sample_values;
        var label = filterSelect[0].otu_labels;
        // Build the variables for the bar graph
        var barId = id;
        var barValue = value;
        var barLabel = label;
        // Sort the data array
        
        barValue.sort(function (a, b) {
            return parseFloat(b.sample_values) - parseFloat(a.sample_values);
        });
        // Slice the objects for plotting the top 10 UT0's
        
        barId = barId.slice(0, 10);
        barValue = barValue.slice(0, 10);
        barLabel = barLabel.slice(0, 10);
        // Reverse the array 
        barId = barId.reverse();
        barValue = barValue.reverse();
        barLabel = barLabel.reverse();
        //Create empty array
        y0 = [];
        // Iterate and store in array
     
        Object.entries(barId).forEach(([k, v]) => {
            // Push values for OTU's into array
            y0.push(`OTU ${v}`);
        });
        // Create a trace object with the data in `y0`
       
        var trace1 = {
            x: barValue, 
            y: y0,
            text: barLabel,
            type: "bar",
            orientation: "h"
        };
        // Create variable for graph data
        var graphData = [trace1];
        // Create layout for top 10 UTO's
        var layout = {
            title: `Top 10 UTO's for ID: ${select}`
        };
        // Render the plot
        // Reference Class Exercise 15.2 #1
        Plotly.newPlot("bar", graphData, layout);
    });
};
// Create function for the Bubble chart

function bubble(select) {
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;
        var samples = data["samples"];
        // Use filter() 
        var filterSelect = samples.filter(data => data.id == select);
        // Define the variables
        var id = filterSelect[0].otu_ids;
        var value = filterSelect[0].sample_values;
        var label = filterSelect[0].otu_labels;
        // Build the variables  
        var xBubble = id;
        var yBubble = value;
        var bubbleLabel = label;
        // Bubble size and shade determined by value
        var bubbleSize = value
        var bubbleColor = value;
        // Define variable trace1 for the Bubble chart data
        var trace1 = {
            x: xBubble,
            y: yBubble,
            text: bubbleLabel,
            mode: 'markers',
            marker: {
                size: bubbleSize,
                color: bubbleColor
            }
        };
        // Define variable for data
        var data = [trace1];
        // Apply layout to bubble chart
        var layout = {
            title: `Different microbial “species” (technically operational taxonomic units, OTUs) across the belly button, for sample ID: ${select}`
        };
        // Render the bubble chart
        Plotly.newPlot("bubble", data, layout)
    });
};
// Function onchange is initiated when drop down menu selection is made
// Reference line 25 in index.html: <select id="selDataset" onchange="optionChanged(this.value)"></select>
function optionChanged(select) {
    metaData(select);
    bar(select);
    bubble(select);
};
// Initialize function
selectInit();