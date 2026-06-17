import "./playercard.css";
function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <h3>{player.name}</h3>
      <p>№ {player.number}</p>
      <p>{player.position}</p>
    </div>
  );
}
export default PlayerCard;