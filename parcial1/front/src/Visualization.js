import React, { Component } from "react";
import vegaEmbed from "vega-embed";
import PropTypes from "prop-types";

export default class Visualization extends Component {
  constructor(props) {
    super(props);
        
    this.state = {
      data:undefined,
      totalRating : 0
    };
  }
    

  componentDidMount(){
    let localSpec=  this.props.visdata.spec;
    console.log("localSpec: ",localSpec.schema);
    localSpec["$schema"] = localSpec.schema;
    delete localSpec.schema;
    this.setState({data:this.props.visdata.data});
    vegaEmbed(this.viz, localSpec, {"mode": "vega-lite"})
      .then((res) =>  {
        console.log(this.state.data);
        res.view.insert("data", this.state.data).run();
      })
      .catch(error=>{
        console.log(error);
        alert("Invalid JSON format for vega-lite spec");

      });
  }
    
  render() {
    return (
      <div>
        <h3>{this.props.visdata.title}</h3>
        <p><b>By: </b>{this.props.visdata.username}</p>
        <div ref={(div) => this.viz=div}></div>
        <p><b>Timestamp: </b> {this.props.visdata.timestamp}</p>
      </div>
    );
  }
}

Visualization.propTypes = {
  visdata: PropTypes.object,
};

