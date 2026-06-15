import React from 'react';

function NewsCard({ newsItem }) {
  return (
    <div className="news-card">
      <h3>{newsItem.title}</h3>
      <p>{newsItem.date}</p>
      <p>{newsItem.text}</p>
    </div>
  );
}

export default NewsCard;