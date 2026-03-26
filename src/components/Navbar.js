import React, { Component } from 'react'

export class Navbar extends Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    this.state = { searchText: "" };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSearch?.(this.state.searchText.trim());
  };

  render() {
    const categories = [
      { id: "general", label: "Top" },
      { id: "business", label: "Business" },
      { id: "technology", label: "Tech" },
      { id: "sports", label: "Sports" },
      { id: "entertainment", label: "Entertainment" },
      { id: "health", label: "Health" },
      { id: "science", label: "Science" },
    ];
    return (
      <>
      <nav className={"navbar navbar-expand-lg sticky-top " + (this.props.darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light")}>
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">ThunderNews</span>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {categories.map((c) => (
                <li className="nav-item" key={c.id}>
                  <button
                    type="button"
                    className={"nav-link btn btn-link " + (this.props.category === c.id ? "active fw-semibold" : "")}
                    onClick={() => this.props.onCategoryChange?.(c.id)}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="d-flex gap-2 align-items-center">
              <form className="d-flex" onSubmit={this.handleSubmit} role="search">
                <input
                  className="form-control form-control-sm"
                  type="search"
                  placeholder="Search..."
                  value={this.state.searchText}
                  onChange={(e) => this.setState({ searchText: e.target.value })}
                  style={{ width: 220 }}
                />
              </form>

              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="darkModeSwitch"
                  checked={!!this.props.darkMode}
                  onChange={() => this.props.onToggleDarkMode?.()}
                />
                <label className="form-check-label" htmlFor="darkModeSwitch">
                  Dark
                </label>
              </div>
            </div>
          </div>
        </div>
      </nav>
      </>
    )
  }
}

export default Navbar