import { useState, useEffect, useRef } from "react";

const TOTAL_LIVES = 10;

function createShuffledDeck() {
  const numbers = [];
  for (let n = 1; n <= 10; n++) {
    numbers.push(n, n);
  }
  // Fisher-Yates shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryMatchingGame() {
  const [cards, setCards] = useState(() => createShuffledDeck());
  const [selected, setSelected] = useState([]); // array of card ids currently flipped (max 2)
  const [match, setMatch] = useState(0);
  const [live, setLive] = useState(TOTAL_LIVES);
  const [locked, setLocked] = useState(false); // true when 2 mismatched cards are shown, waiting for next click
  const clickCountRef = useRef(0);

  const gameWon = match === 10;
  const gameLost = live <= 0 && !gameWon;
  const gameOver = gameWon || gameLost;

  // Check for match whenever 2 cards are selected
  useEffect(() => {
    if (selected.length === 2) {
      const [firstId, secondId] = selected;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first && second && first.value === second.value) {
        // Matched
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          )
        );
        setMatch((m) => m + 1);
        setSelected([]);
      } else {
        // Not matched
        setLive((l) => Math.max(0, l - 1));
        setLocked(true);
      }
    }
  }, [selected, cards]);

  const resetGame = () => {
    setCards(createShuffledDeck());
    setSelected([]);
    setMatch(0);
    setLive(TOTAL_LIVES);
    setLocked(false);
    clickCountRef.current = 0;
  };

  const hideUnmatched = () => {
    setCards((prev) =>
      prev.map((c) => (c.isMatched ? c : { ...c, isFlipped: false }))
    );
    setSelected([]);
    setLocked(false);
  };

  const handleCardClick = (card) => {
    clickCountRef.current += 1;

    if (gameOver) return;

    // If two mismatched cards are currently shown, any click hides them first
    if (locked) {
      hideUnmatched();
      // If the click was on a card (not blank area), and it's a valid new selection,
      // allow it to also flip that card (unless it's one of the ones just hidden or matched)
      if (!card.isMatched) {
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
        );
        setSelected([card.id]);
      }
      return;
    }

    // Ignore clicks on already flipped/matched cards, or if 2 are already selected
    if (card.isFlipped || card.isMatched || selected.length >= 2) return;

    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );
    setSelected((prev) => [...prev, card.id]);
  };

  const handleBoardClick = () => {
    if (locked) {
      hideUnmatched();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        background: "#ffffff",
        fontFamily:
          "'Söhne', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={handleBoardClick}
      >
        <div
          style={{
            padding: "24px 24px 4px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 500,
              color: "#8a8578",
              letterSpacing: "0.02em",
            }}
          >
            Memory Matching
          </h1>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(5, 1fr)",
            gap: "3% 20%",
            padding: "24px 10%",
            minHeight: 0,
          }}
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} onClick={() => handleCardClick(card)} />
          ))}
        </div>


        <div
          style={{
            borderTop: "1px solid #eeece7",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
            fontSize: "15px",
            color: "#8a8578",
            flexShrink: 0,
          }}
        >
          <span>Match: {match}</span>
          <span>Live: {live}</span>
          {gameWon && (
            <span style={{ color: "#4a9d6f", fontWeight: 600 }}>You WIN</span>
          )}
          {gameLost && (
            <span style={{ color: "#c0604f", fontWeight: 600 }}>You LOST</span>
          )}
          {gameOver && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetGame();
              }}
              style={{
                marginLeft: "auto",
                border: "1px solid #d8d5cf",
                background: "#faf9f7",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "13px",
                color: "#5c584f",
                cursor: "pointer",
              }}
            >
              Play again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ card, onClick }) {
  const revealed = card.isFlipped || card.isMatched;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        width: "100%",
        height: "100%",
        border: card.isMatched
          ? "1px solid #b9ddc7"
          : revealed
          ? "1px solid #9b93e0"
          : "1px solid #cfcbc3",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: card.isMatched ? "default" : "pointer",
        background: card.isMatched ? "#f5faf7" : "#ffffff",
        fontSize: "18px",
        color: "#7c7768",
        userSelect: "none",
        transition: "border-color 0.15s ease, transform 0.1s ease",
      }}
    >
      {revealed ? card.value : ""}
    </div>
  );
}
