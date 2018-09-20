import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';

class App extends Component {

  constructor(props) {
    super(props);
    this.state= {
      spec : {
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
      },
      myData : [
        {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
        {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
        {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
      ]
    }
  }

  
  render() {
    return (
      <div className="App">

      <h1>Make your own vega visualizations!</h1>

       
        <textarea  onChange={(event)=>{this.setState({spec:event.target.value})}}name="inputJSON" id="inputJSON" cols="30" rows="10"></textarea>
        <br/>
        <input type="file" onChange={(event)=> console.log(event.target.value)}/>
        <br/>

       <button onClick = {()=>{

         const embed_opt = {"mode": "vega-lite"};    
         const el = this.viz;
         const view = vegaEmbed(this.viz, JSON.parse(this.state.spec), embed_opt)
         .catch(error => console.log(el, error))
         .then((res) =>  res.view.insert("myData", this.state.myData).run());
         
        }}>Render Viz!</button>

        <br/>

        <div ref={(div) => this.viz=div}></div>
      </div>
    );
  }
}

export default App;
