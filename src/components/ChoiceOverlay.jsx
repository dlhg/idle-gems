const ChoiceOverlay = ({ cards, onPick, activePerks }) => {
  return (
    <div className="choice-overlay">
      <div className="choice-overlay__content">
        <h2 className="choice-overlay__title">Choose Your Reward</h2>
        <div className="choice-overlay__cards">
          {cards.map(card => {
            const stacks = activePerks[card.id] || 0;
            return (
              <button
                key={card.id}
                className="choice-card"
                style={{
                  borderColor: card.category.color,
                  boxShadow: `0 0 20px ${card.category.color}44`,
                }}
                onClick={() => onPick(card.id)}
              >
                <span className="choice-card__icon">{card.icon}</span>
                <span className="choice-card__name">{card.name}</span>
                <p className="choice-card__desc">{card.description}</p>
                <span
                  className="choice-card__category"
                  style={{
                    background: card.category.color + "33",
                    color: card.category.color,
                  }}
                >
                  {card.category.label}
                </span>
                {stacks > 0 && (
                  <span className="choice-card__stacks">x{stacks + 1}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChoiceOverlay;
