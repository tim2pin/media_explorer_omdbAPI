const omdb = function omdb(query) {
  return $.ajax({
    url: "http://www.omdbapi.com/",

    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell YQL what we want and that we want JSON
    data: Object.assign({}, { r: "json" }, query)
    
  })
};

class MediaItem extends React.Component {
  render() {
    return (
      <div>
        <div> Title: {this.props.title} </div>
        <div> Media Type: {this.props.type} </div>
        <div>--------------------------</div>
      </div>
    )
  }
}

class MediaList extends React.Component {
  render() {
    return (
             <div>
               {this.props.media.map(function(item) {
                 return (
                  <MediaItem title={item.Title} type={item.Type} />
                 )
               })}
             </div>
    )
  }
}

class MediaFetcher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      media: []
    };
  this.getMedia(this.props.query);
}   
getMedia(query) {
  omdb({s: query}).then((response) => {
  if (response && response.Response === "True") {
    this.setState({media: response.Search});
    // console.log(this.state);
  } else if (response && response.Response === "False") {
    // No media was found
  } else {
    console.error('Unknown error connecting to omdbapi.');
  }
});
}
  //will only get new data if new search is entered --dirty checking--
componentWillReceiveProps(nextProps) {
  if(this.props.query !== nextProps.query){
    this.getMedia(nextProps.query);
  }
}
  render() {
    this.getMedia();
    return (
      <div>
         <h3>Media List:</h3>
        <MediaList media={this.state.media} />
      </div>
    )
  }
}

class MediaSearchInput extends React.Component {
  render() {
    return (
      <label>Media Search:
        <input type="text" placeholder="search movie title" onChange={this.props.OnSearchInputChange} />
      </label>
    )
  }
}

class MediaSubmitButton extends React.Component {
  render() {
    return (
      <input type="button" value="Search" onClick={this.props.OnSubmitButtonClick}  />
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchQueryValue:''
    };
  }
  handleSubmitButtonClick(e) {
    console.log('searchqueryvalue is', this.state.searchQueryValue);
    this.setState({query: this.state.searchQueryValue});
  }
  handleSearchInputChange(e) {
    console.log('searchqueryvalue is',this.state.searchQueryValue);
    this.setState({ searchQueryValue: e.target.value });
  }
  render() {
    return (
      <div className="container">
        <h1>Search Results for {this.state.query} </h1>
        <MediaSearchInput OnSearchInputChange={this.handleSearchInputChange.bind(this)} />
        <MediaSubmitButton OnSubmitButtonClick={this.handleSubmitButtonClick.bind(this)} />
        <MediaFetcher query={this.state.query} />
      </div>
    )
  }
}

ReactDOM.render(
<App />,
document.getElementById('container')
);