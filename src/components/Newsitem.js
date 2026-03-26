import React, { Component } from 'react'

export class Newsitem extends Component {


  render() {
      let {title,description,imageUrl,newsurl,author,publishedAt,source}=this.props;
      const fallbackImage = "https://via.placeholder.com/640x360.png?text=ThunderNews";
      const dateText = publishedAt ? new Date(publishedAt).toLocaleString() : null;
    return (
      <div>
            <div className="card h-100 news-card">
                <img
                  src={imageUrl || fallbackImage}
                  className="card-img-top news-card__img"
                  alt={title || "news"}
                  loading="lazy"
                  onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                />
                <div className="card-body d-flex flex-column">
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {source ? <span className="badge text-bg-secondary">{source}</span> : null}
                      {author ? <span className="badge text-bg-light text-dark">By {author}</span> : null}
                    </div>
                    <h5 className="card-title news-card__title">{title}{title ? "…" : ""}</h5>
                    <p className="card-text text-muted news-card__desc">{description}{description ? "…" : ""}</p>
                    {dateText ? <div className="small text-muted mb-2">{dateText}</div> : null}
                    <div className="mt-auto">
                      <a href={newsurl} target="_blank" rel="noreferrer" className="btn btn-primary w-100">Read More</a>
                    </div>
                </div>
           </div>
    </div>
    )
  }
}

export default Newsitem