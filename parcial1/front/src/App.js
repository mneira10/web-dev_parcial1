import React, { Component } from "react";
import "./App.css";
import vegaEmbed from "vega-embed";
import Papa from "papaparse";
import Visualization from "./Visualization";
class App extends Component {

  constructor(props) {
    super(props);
    this.state= {
      spec : this.defaultSpec,
      data : undefined,
      color : "#1177BB",
      visList : [],
      username : undefined,
      titleViz : undefined,
    };

    this.setData = this.setData.bind(this);
    this.getListViz = this.getListViz.bind(this);
  }

  // defaultSpec={
  //   "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc6.json",
  //   "description": "A simple bar chart with embedded data.",
  //   "data": {
  //     "name": "data" 
  //   },
  //   "mark": "bar",
  //   "encoding": {
  //     "y": {"field": "a", "type": "ordinal"},
  //     "x": {"field": "b", "type": "quantitative"}
  //   }
  // };

  setData(results){
    const data = results.data;
    this.setState({data:data});
  }

  componentDidMount(){
    this.getListViz();
  }

  getListViz(){

    fetch("/viz")
      .then((response)=> {
        // console.log(response);
        return response.json();
      })
      .then((json)=>{
        this.setState({visList:json.sort((a,b)=> {return b.timestamp-a.timestamp;})});
        // this.setState({visList:json});
      })
      .catch((err)=>console.log(err));
  }

  renderVisualizations(){
    return this.state.visList.map((indViz)=>
      <div key = {indViz._id}><Visualization visdata={indViz}/></div>
    );
  }

  
  render() {
    return (
      <div className="App">

        <h1>Make your own vega visualizations!</h1>

       
        <textarea  onChange={
          (event)=>{

            this.setState({spec:event.target.value});
          
          } } name="inputJSON" id="inputJSON" cols="100" rows="20" >
        
        </textarea>
        <br/>
        <input type="file" onChange={(event)=> {

          Papa.parse(event.target.files[0], {
            header: true,
            dynamicTyping: true,
            delimiter : ",",
            complete: this.setData

          });
        }
        }/>
        <br/>

        <button onClick = {()=>{
               
          const embed_opt = {"mode": "vega-lite"};           
          let specJSON = null;

          try{
            specJSON = JSON.parse(this.state.spec);

            specJSON.encoding["color"] = {value:this.state.color};

            this.setState({spec : JSON.stringify(specJSON)});
          }
          catch(error){
            console.log(error);
            alert("Invalid JSON format");
          }

          if(specJSON!==null){
            if(this.state.data!==undefined){
              // create vega-lite visualization
              vegaEmbed(this.viz, specJSON, embed_opt)
                .then((res) =>  res.view.insert("data", this.state.data).run())
                .catch(error=>{
                  console.log(error);
                  alert("Invalid JSON format for vega-lite spec");
  
                });
            }
            else{
              alert("No data selected. Please select a .csv file.");
            }
          }

        
        }}>Render Viz!</button>

        <br/>

        <h3>Save your viz:</h3>

        Username: <input type="text" onChange={(event)=>
          this.setState({username:event.target.value})
        }/><br/>
        Title of viz: <input type="text" onChange={(event)=>
          this.setState({titleViz:event.target.value})
        }/><br/>

        <button onClick = {()=>{
               
          const embed_opt = {"mode": "vega-lite"};           
          let specJSON = null;
     
          try{
            specJSON = JSON.parse(this.state.spec);
     
            specJSON.encoding["color"] = {value:this.state.color};
     
            this.setState({spec : JSON.stringify(specJSON)});
          }
          catch(error){
            console.log(error);
            alert("Invalid JSON format");
          }
     
          if(specJSON!==null){
            if(this.state.data!==undefined){

                  
              vegaEmbed(this.viz, specJSON, embed_opt)
                .then((res) =>  res.view.insert("data", this.state.data).run())
                .catch(error=>{
                  console.log(error);
                  alert("Invalid JSON format for vega-lite spec");
       
                });

              
              if(this.state.username && this.state.titleViz){
                const aMandar = {};
                aMandar.timestamp = new Date().getTime();
                aMandar.data = this.state.data;
                aMandar.username = this.state.username;
                aMandar.title = this.state.titleViz;

                let tempSpec = JSON.parse(this.state.spec);
                // console.log("tempSpec.$Schema: ",tempSpec.$schema);
                tempSpec["schema"] = tempSpec["$schema"];
                delete tempSpec["$schema"];
                aMandar.spec = tempSpec;

                aMandar.spec.encoding["color"] = {value:this.state.color};
                // console.log(tempSpec);
                // console.log(aMandar);
                console.log(JSON.stringify(aMandar));

                fetch("/viz", {
                  method: "post",
                  headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(aMandar)
                }).then(function(response) {
                  return response;
                }).then(function(data) {
                  console.log("POST exitosoL ", data);
                  // render again to show viz in viz history
                
                  alert("Viz saved correctly");
                }).catch((error)=>{
                  console.log("something went wrong trying to POST...:/");
                  console.log(error);
                  alert("something went wrong trying to save, please try again");
                });
              }
              else{
                alert("Username and Title of viz must have values.");
              }
            }
            else{
              alert("No data selected. Please select a .csv file.");
            }
          }
     
             
        }}>Save viz!</button>



        <br/>



        <h3>Want to get creative? Choose your color!</h3>
        <input type="color" name="chooseColor" id="colorChooser" placeholder="#1177BB" onChange={(event)=>
          this.setState({color:event.target.value})
        } />

        <div ref={(div) => this.viz=div}></div>
        


        <div className="visualizationList">
          <h1>History of visualizations!</h1>
          <div>
            {this.renderVisualizations()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
