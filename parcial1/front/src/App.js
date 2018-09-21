import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';
import Papa from 'papaparse';

class App extends Component {

  constructor(props) {
    super(props);
    this.state= {
      spec : this.defaultSpec,
      data : []
    }

    this.setData = this.setData.bind(this);
  }

  defaultSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "description": "A simple bar chart with embedded data.",
    "data": {
      "name": "myData" 
    },
    "mark": "bar",
    "encoding": {
      "y": {"field": "a", "type": "ordinal"},
      "x": {"field": "b", "type": "quantitative"}
    }
  };

  setData(results){
    const data = results.data;
    this.setState({data:data});
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

            const data = Papa.parse(event.target.files[0], {
              header: true,
              dynamicTyping: true,
              delimiter : ",",
              complete: this.setData

            });
          }
        }/>
        <br/>

       <button onClick = {()=>{
        console.log(this.state.data[0]);
        console.log(this.state.data);
        const embed_opt = {"mode": "vega-lite"};           
        let specJSON = null;

        try{
          specJSON = JSON.parse(this.state.spec);
        }
        catch(error){
          alert("Invalid JSON format")
        }

        if(specJSON!==null){
          vegaEmbed(this.viz, specJSON, embed_opt)
          .then((res) =>  res.view.insert("data", this.state.data).run())
          .catch(error=>{
            console.log(error);
            alert("Invalid JSON format for vega-lite spec");

          });
        }

        
        }}>Render Viz!</button>

        <br/>

        <div ref={(div) => this.viz=div}></div>
      </div>
    );
  }
}

export default App;
