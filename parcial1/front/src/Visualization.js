import React, { Component } from "react";
import vegaEmbed from "vega-embed";
import PropTypes from "prop-types";

export default class Visualization extends Component {
  constructor(props) {
    super(props);
        
    this.state = {
      data:undefined,
      ratingUsername:undefined,
      ownRating:undefined
    };
    this.getSum = this.getSum.bind(this);
  }
    
  getSum(total, elem) {
    return total + elem.rating;
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
        <p><b>Rating: </b>{this.props.visdata.ratings.reduce(this.getSum,0)/this.props.visdata.ratings.length}</p>
        <p><b>Timestamp: </b> {(new Date(this.props.visdata.timestamp * 1000)).toString()}</p>

        {/* <h3>Rate the Viz</h3>
        <label >Rating:</label>
        <input type="number" 
          placeholder="1-5"
          min="1" max="5" pattern="[1-5]" onChange={(event)=>this.setState({ownRating:event.target.value})}/>
        <br/>
        <label >Username:</label>
        <input type="text" onChange={(event)=>this.setState({ratingUsername:event.target.value})}/> */}
        
      </div>
    );
  }
}

Visualization.propTypes = {
  visdata: PropTypes.object,
};

