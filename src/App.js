
import './App.css';

import React, { Component } from 'react'
import Navbar from './components/Navbar';
import News from './components/News';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      category: "general",
      query: "",
      darkMode: false,
    };
  }

  setCategory = (category) => {
    this.setState({ category });
  };

  setQuery = (query) => {
    this.setState({ query });
  };

  toggleDarkMode = () => {
    this.setState((s) => ({ darkMode: !s.darkMode }));
  };

  render() {
    return (
      <div className={this.state.darkMode ? "app app--dark" : "app"}>
        <Navbar
          category={this.state.category}
          onCategoryChange={this.setCategory}
          onSearch={this.setQuery}
          darkMode={this.state.darkMode}
          onToggleDarkMode={this.toggleDarkMode}
        />
        <News
          pageSize={9}
          category={this.state.category}
          query={this.state.query}
        />
      </div>
    )
  }
}
