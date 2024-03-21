import React, { useState, useEffect } from "react";
import "./App.css";
import endSound from "./end-sound.mp3"; // Importing end sound files.
import originalWords from "./words.json"; // Import original word sequences.

// Functions for shuffling arrays（Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  const shuffledArray = array.slice(); // Copy array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function App() {
  const TIMER_SECONDS = 300;
  const [words, setWords] = useState(shuffleArray(originalWords)); // Shuffled word sequence
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isAllWordsShown, setIsAllWordsShown] = useState(false);

  useEffect(() => {
    let countdown;
    if (isRunning && timer > 0) {
      // start the timer
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      // Stops when the timer is zero.
      setIsRunning(false);
      setIsEnded(true);

      new Audio(endSound).play();
    }

    // コンポーネントのアンマウント時にタイマーをクリア
    return () => clearInterval(countdown);
  }, [timer, isRunning]);

  useEffect(() => {
    // Enterキーでタイマーをスタート/ストップまたはワードを切り替えるイベントリスナーを追加
    const handleKeyDown = (event) => {
      // Spaceキーでタイマーをスタート/ストップ
      if (event.key === "s") {
        setIsRunning((prevIsRunning) => !prevIsRunning);
      }

      if (event.key === " ") {
        if (!isRunning && !isEnded) {
          setIsRunning(true);
          setTimer(TIMER_SECONDS); // タイマーをリセット
        } else if (isRunning) {
          if (currentWordIndex < words.length - 1 && !isAllWordsShown) {
            setCurrentWordIndex(currentWordIndex + 1);
          } else {
            setIsAllWordsShown(true);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // イベントリスナーをクリーンアップ
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRunning, isEnded, currentWordIndex, words.length, isAllWordsShown]);

  // タイマーを分:秒の形式に変換
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        {isEnded ? (
          <div>
            <h2>時間切れです！</h2>
          </div>
        ) : (
          <div>
            {isRunning && !isAllWordsShown && <h1>{words[currentWordIndex]}</h1>}
            <p>{!isRunning && startComponent}</p>
            <h3>{formatTime()}</h3>
            {isAllWordsShown && <p>* All words are displayed...</p>}
          </div>
        )}
      </header>
    </div>
  );
}

const startComponent = (
  <span>
    Press "SPACE" key. <br /> Timer srart/stop by "S" key
  </span>
);

export default App;
