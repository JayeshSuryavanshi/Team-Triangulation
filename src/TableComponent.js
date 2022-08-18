import React, { Component } from "react";
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" 
  

class TableComponent extends Component{

    render(){
        const data = this.props.rows;
         const columns = this.props.columns;

         console.log("In table",this.props.rows);
         console.log("In  table col",this.props.columns);

        return(
            <div style={{padding:50}}>  
            <ReactTable  
                data={data}  
                columns={columns}  
                
                defaultPageSize = {10}  
                pageSizeOptions = {[2,4, 6,10]}  
            />  
            </div>   
          );
    }  
}

export default TableComponent;   