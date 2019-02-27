import React, { Component } from 'react';
import bambang from 'axios';
import { BASE_URL } from './constants';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      isLoading: false,
      title: '',
      content: ''
    }
    // this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  fetchBlogs() {
    bambang.get(`${BASE_URL}/blogs`)
      .then(res => {
        const { data } = res.data;
        this.setState({
          isLoading: false,
          blogs: data
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoading: false });
      })
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      this.fetchBlogs();
    })
  }

  renderLists() {
    return (
      <div className="feed" style={feedComponent}>
        {
          this.state.blogs.map((blog, index) => (
            <div key={index} className="card__blog" style={cardBlog}>
              <h2>{ blog.title }</h2>
              <p>{ blog.content }</p>
            </div>
          ))
        } 
      </div>
    )
  }

  onChangeText(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit(e) {
    const { title, content } = this.state;
    e.preventDefault();
    bambang.post(`${BASE_URL}/blogs`, {
      title,
      content
    })
    .then(res => {
      console.log('Resss ', res);
      const { title, content } = res.data.data
      let currentBlogs = this.state.blogs;
      this.setState({
        blogs: [ ...currentBlogs, { title, content } ]
      })
    })
  }
  
  render() {
    const { isLoading } = this.state;
    return (
      <div className="App">
        <h1>Face Blog</h1>
        {
          isLoading ?
          <h2>Loading bro....</h2>
          :
          this.renderLists()
        }

        <form 
          onSubmit={(e) => this.onSubmit(e)}
          className="form"
        >
          <div>
            <h3>Title</h3>
            <input onChange={this.onChangeText} name="title" placeholder="Input title anda" />
          </div>
          <div>
            <h3>Content</h3>
            <input onChange={this.onChangeText} name="content" placeholder="Input content anda" />
          </div>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

const feedComponent = {
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
  justifyContent: 'center',
  margin: '0 auto'
};

const cardBlog = {
  background: '#ccc',
  margin: '10px',
  padding: '10px',
  border: '1px solid #4a4a4a',
};

export default App;
