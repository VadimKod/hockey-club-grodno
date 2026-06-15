import React from 'react';

function MatchCard({ match }) {
  return (
    <div>
      <h3>Соперник: {match.opponent}</h3>
      <p>Дата: {match.date}</p>
      <p>Результат: {match.result}</p>
    </div>
  );
}

export default MatchCard;