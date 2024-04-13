import { useState, useEffect, useMemo } from "react";
import "./App.css";
import holeImage from "./assets/hole-2.png";
import moleImage from "./assets/mole-2.png";

const MOLE_APPEARANCE_INTERVAL = 1001;
const MOLE_DISPLAY_TIME = 999;
const MOLE_COUNT = 9;

if (MOLE_DISPLAY_TIME >= MOLE_APPEARANCE_INTERVAL) {
  throw new Error(
    "MOLE_DISPLAY_TIME must be less than MOLE_APPEARANCE_INTERVAL"
  );
}

function App() {
  const [score, setScore] = useState(0);
  const [moles, setMoles] = useState<boolean[]>(
    new Array(MOLE_COUNT).fill(false)
  );
  const [lastAppearanceTime, setLastAppearanceTime] = useState<number>(0);

  const wackMole = (index: number) => {
    if (moles[index]) {
      setMoles((prevMoles) => {
        const newMoles = [...prevMoles];
        newMoles[index] = false;
        return newMoles;
      });
      setScore((prevScore) => prevScore + 1);
    }
  };

  const setMoleVisibility = (index: number, isVisible: boolean) => {
    setMoles((prevMoles) => {
      const newMoles = [...prevMoles];
      newMoles[index] = isVisible;
      return newMoles;
    });
  };

  const handleMoleAppearance = useMemo(() => {
    return () => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      setMoleVisibility(randomIndex, true);
      setTimeout(() => {
        setMoleVisibility(randomIndex, false);
        setLastAppearanceTime(Date.now());
      }, MOLE_DISPLAY_TIME);
    };
  }, [moles]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastAppearanceTime >= MOLE_APPEARANCE_INTERVAL) {
        handleMoleAppearance();
      }
    }, MOLE_APPEARANCE_INTERVAL);
    return () => clearInterval(interval);
  }, [handleMoleAppearance, lastAppearanceTime]);

  return (
    <>
      <h1>Score {score}</h1>
      <div className="grid">
        {moles.map((isMole, index) => (
          <img
            key={index}
            src={isMole ? moleImage : holeImage}
            alt="segment"
            onClick={() => wackMole(index)}
          />
        ))}
      </div>
    </>
  );
}

export default App;
