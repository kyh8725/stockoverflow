import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewsCard(props) {
  const renderNews = props.news.map((news) => {
    return (
      <a
        href={news.url}
        key={uuidv4()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="card">
          <img src={news.image} className="card-img-top" alt="newsImg" />
          <div className="card-body">
            <h5 className="card-title">{news.headline}</h5>
            <p className="card-text">{news.summary}</p>
          </div>
        </div>
      </a>
    );
  });
  return <div className="news">{renderNews}</div>;
}
