
import React, { Component } from 'react';  

// import ReactTable from "react-table";  
// import "react-table/react-table.css";  
import TableComponent from './TableComponent';
import { TextField ,Button, Box,SelectChangeEvent,Select,FormControl,InputLabel,MenuItem} from '@mui/material';
// import TextField from '@mui/material/TextField';
  
class App extends Component { 

  state = {
    query : " ",
    columns: null,
    rows: null,

    num_movies : null,
    columnsmovie: null,
    rowsmovie: null,

    num_tv : null,
    columnstv: null,
    rowstv: null,

    num_dir : null,
    columnsdirector: null,
    rowsdirector: null,

    genre : null,
    columnsgenre: null,
    rowsgenre: null,
}

handleChange = (e) => {
  this.setState({ query: e.target.value})
  console.log(this.state.query);
};


OnSubmitQuery = () => {

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: this.state.query })
  };
  fetch('http://34.229.0.41:5000/query', requestOptions)
      .then(response => response.json())
      .then(data => this.setState({ columns: data.columns, rows:data.rows}))
 
};

OnSubmitQueryClear = () => {
  this.setState({ columns: null, rows:null , query : ''})
  
 
};

MovieNum = (e) => {
  this.setState({ num_movies: e.target.value})
  console.log(this.state.num_movies);
};

OnMovieSubmit = () => {
  console.log("hello",this.state.num_movies)
  let moviequery = "select original_title,average_rating from project.titles, project.title_ratings where titles.title_id =  title_ratings.title_id and title_type = 'movie' and num_votes > 1000 order by average_rating desc limit "+this.state.num_movies;
  console.log("moviequery",moviequery)
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: moviequery})
  };
  fetch('http://34.229.0.41:5000/query', requestOptions)
      .then(response => response.json())
      .then(data => this.setState({ columnsmovie: data.columns, rowsmovie:data.rows}))
 
};

OnMovieSubmitClear = () => {
  this.setState({ columnsmovie: null, rowsmovie:null , num_movies : ''})
  
};

TVNum = (e) => {
  this.setState({ num_tv: e.target.value})
  console.log(this.state.num_tv);
};

OnTVSubmit = () => {
  let tvresult = "select original_title,average_rating from project.titles, project.title_ratings where titles.title_id =  title_ratings.title_id and title_type = 'tvSeries' and num_votes > 1000 order by average_rating desc limit "+this.state.num_tv;
  console.log("moviequery",tvresult)
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: tvresult})
  };
  fetch('http://34.229.0.41:5000/query', requestOptions)
      .then(response => response.json())
      .then(data => this.setState({ columnstv: data.columns, rowstv:data.rows}))
 
};

OnTVSubmitClear = () => {
  this.setState({ columnstv: null, rowstv:null ,num_tv : ''})
  
};

DirNum = (e) => {
  this.setState({ num_dir : e.target.value})
  console.log(this.state.num_dir);
};

OnDirSubmit = () => {
  let dirresult = "select full_name , t.average_rating from ( select name_id, AVG(title_ratings.average_rating) as average_rating from project.titles, project.title_ratings,project.directors where titles.title_id =  title_ratings.title_id and directors.title_id = titles.title_id group by directors.name_id ) as t , project.person_names where t.name_id = person_names.name_id order by t.average_rating desc limit "+this.state.num_dir;
  console.log("dirresult",dirresult)
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: dirresult})
  };
  fetch('http://34.229.0.41:5000/query', requestOptions)
      .then(response => response.json())
      .then(data => this.setState({ columnsdirector: data.columns, rowsdirector:data.rows}))
 
};

OnDirSubmitClear = () => {
  this.setState({ columnsdirector: null, rowsdirector:null , num_dir:''})
  
};
  

  HandleGenres = (event) => {
    this.setState({ genre : event.target.value})
    console.log(this.state.genre);
  };

  OnGenreSubmit = () => {
    let genrequery = "select original_title,title_type,genre from project.titles, project.title_genres where titles.title_id =  title_genres.title_id and genre = '"+this.state.genre+"' order by original_title desc limit 100 ";
    console.log("genrequery",genrequery)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: genrequery})
    };
    fetch('http://34.229.0.41:5000/query', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ columnsgenre: data.columns, rowsgenre:data.rows}))
   
  };
  
  OnGenreSubmitClear = () => {
    this.setState({ columnsgenre: null, rowsgenre:null , genre : ''})
    
  };

  render() {  

    console.log("num movies",this.state.num_movies)
    let Queryresult = <p> </p>
    // console.log("col and rows",this.state.columns)
    if(this.state.columns != null && this.state.rows != null){
      Queryresult = <TableComponent columns = {this.state.columns} rows = {this.state.rows}/>
    }

    let movieresult = <p> </p>
    // console.log("col and rows",this.state.columnsmovie)
    if(this.state.columnsmovie != null && this.state.rowsmovie != null){
      movieresult = <TableComponent columns = {this.state.columnsmovie} rows = {this.state.rowsmovie}/>
    }

    let tvresult = <p> </p>

    if(this.state.columnstv != null && this.state.rowstv != null){
      tvresult = <TableComponent columns = {this.state.columnstv} rows = {this.state.rowstv}/>
    }

    let dirresult = <p> </p>

    if(this.state.columnsdirector != null && this.state.rowsdirector != null){
      dirresult = <TableComponent columns = {this.state.columnsdirector} rows = {this.state.rowsdirector}/>
    }


    let genrequery = <p> </p>
    if(this.state.columnsgenre != null && this.state.rowsgenre != null){
      genrequery = <TableComponent columns = {this.state.columnsgenre} rows = {this.state.rowsgenre}/>
    }

    return (  
          <div>
            <p>Enter the Query! </p>
            <TextField
          id="outlined-multiline-static"
          label="Enter the Query"
          value={this.state.query}
          onChange={this.handleChange}
          multiline
          // fullWidth
          sx={{
            width: 850}}
          rows={3}
          // defaultValue="Default Value"
        />
        <p> </p>
        <Button
          variant="contained"
          onClick={this.OnSubmitQuery}
        >
          Submit
        </Button>
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          variant="contained"
          onClick={this.OnSubmitQueryClear}
        >
          Clear
        </Button>
        {Queryresult}
        <p> </p>
          <Box component="form"
          sx={{
            width: 400,
            height: 50,
            backgroundColor: 'aliceblue',
            '&:hover': {
              backgroundColor: 'aliceblue',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
          noValidate
          style={{ justifyContent:'center', alignItems:'center'}}
          autoComplete="off">
            <p > No.of top <TextField
          label="Number"
          id="outlined-size-small"
          size="small"
          value={this.state.num_movies}
          onChange={this.MovieNum}
        /> Movies in 2022</p>
        </Box>
        <p> </p>
        <Button
          variant="contained"
          onClick={this.OnMovieSubmit}
        >
          Submit
        </Button>
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          variant="contained"
          onClick={this.OnMovieSubmitClear}
        >
          Clear
        </Button>
        
          {movieresult}

          <p> </p>
          <Box component="form"
          sx={{
            width: 400,
            height: 50,
            backgroundColor: 'aliceblue',
            '&:hover': {
              backgroundColor: 'aliceblue',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
          noValidate
          style={{ justifyContent:'center', alignItems:'center'}}
          autoComplete="off">
            <p > No.of top <TextField
          label="Number"
          id="outlined-size-small"
          size="small"
          value={this.state.num_tv}
          onChange={this.TVNum}
        /> TV Series in 2022</p>
        </Box>
        <p> </p>
        <Button
          variant="contained"
          onClick={this.OnTVSubmit}
        >
          Submit
        </Button>
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          variant="contained"
          onClick={this.OnTVSubmitClear}
        >
          Clear
        </Button>
        
          {tvresult}

          <p> </p>
          <Box component="form"
          sx={{
            width: 400,
            height: 50,
            backgroundColor: 'aliceblue',
            '&:hover': {
              backgroundColor: 'aliceblue',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
          noValidate
          style={{ justifyContent:'center', alignItems:'center'}}
          autoComplete="off">
            <p > No.of top <TextField
          label="Number"
          id="outlined-size-small"
          size="small"
          value={this.state.num_dir}
          onChange={this.DirNum}
        /> Directors in 2022 </p>
        </Box>
        <p> </p>
        <Button
          variant="contained"
          onClick={this.OnDirSubmit}
        >
          Submit
        </Button>
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          variant="contained"
          onClick={this.OnDirSubmitClear}
        >
          Clear
        </Button>
        
          {dirresult}

        <p></p>

          <Box component="form"
          sx={{
            width: 400,
            height: 80,
            backgroundColor: 'aliceblue',
            '&:hover': {
              backgroundColor: 'aliceblue',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
          noValidate
          style={{ justifyContent:'center', alignItems:'center'}}
          autoComplete="off">
            <p > <FormControl  sx={{ m: 1, minWidth: 120 }} >
        <InputLabel id="demo-simple-select-label">Genres</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Genres"
          onChange={this.HandleGenres}
        >
          <MenuItem value={"Action"}>Action</MenuItem>
          <MenuItem value={"Adventure"}>Adventure</MenuItem>
          <MenuItem value={"Animation"}>Animation</MenuItem>
          <MenuItem value={"Biography"}>Biography</MenuItem>
          <MenuItem value={"Comedy"}>Comedy</MenuItem>
          <MenuItem value={"Crime"}>Crime</MenuItem>
          <MenuItem value={"Documentary"}>Documentary</MenuItem>
          <MenuItem value={"Drama"}>Drama</MenuItem>
          <MenuItem value={"Family"}>Family</MenuItem>
          <MenuItem value={"Fantasy"}>Fantasy</MenuItem>
          <MenuItem value={"Game-Show"}>Game-Show</MenuItem>
          <MenuItem value={"History"}>History</MenuItem>
          <MenuItem value={"Horror"}>Horror</MenuItem>
          <MenuItem value={"Music"}>Music</MenuItem>
          <MenuItem value={"Musical"}>Musical</MenuItem>
          <MenuItem value={"Mystery"}>Mystery</MenuItem>
          <MenuItem value={"News"}>News</MenuItem>
          <MenuItem value={"Reality-TV"}>Reality-TV</MenuItem>
          <MenuItem value={"Romance"}>Romance</MenuItem>
          <MenuItem value={"Sci-Fi"}>Sci-Fi</MenuItem>
          <MenuItem value={"Short"}>Short</MenuItem>
          <MenuItem value={"Sport"}>Sport</MenuItem>
          <MenuItem value={"Talk-Show"}>Talk-Show</MenuItem>
          <MenuItem value={"Thriller"}>Thriller</MenuItem>
          <MenuItem value={"War"}>War</MenuItem>
          <MenuItem value={"Western"}>Western</MenuItem>

        </Select>
      </FormControl> Movies </p>
        </Box>

        <p> </p>
        <Button
          variant="contained"
          onClick={this.OnGenreSubmit}
        >
          Submit
        </Button>
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          variant="contained"
          onClick={this.OnGenreSubmitClear}
        >
          Clear
        </Button>

         {genrequery}
          </div>        
    );  
  }  
}  
export default App;  