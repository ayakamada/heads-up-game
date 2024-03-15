import React, { useState, useEffect } from "react";
import "./App.css";
// import endSound from "./end-sound.mp3"; // 終了音のファイルをインポート
import originalWords from "./words.json"; // オリジナルのワード配列をインポート

// 配列をシャッフルする関数（Fisher-Yatesシャッフルアルゴリズム）
function shuffleArray(array) {
  const shuffledArray = array.slice(); // 配列をコピー
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function App() {
  const TIMER_SECONDS = 20;
  const [words, setWords] = useState(shuffleArray(originalWords)); // シャッフルされたワード配列
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS); // 20秒でデモ
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isAllWordsShown, setIsAllWordsShown] = useState(false);

  useEffect(() => {
    let countdown;
    if (isRunning && timer > 0) {
      // タイマーを開始
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      // タイマーが0になったら停止
      setIsRunning(false);
      setIsEnded(true);

      // 終了音を再生
      // new Audio(endSound).play();
    }

    // コンポーネントのアンマウント時にタイマーをクリア
    return () => clearInterval(countdown);
  }, [timer, isRunning]);

  useEffect(() => {
    // Enterキーでタイマーをスタート/ストップまたはワードを切り替えるイベントリスナーを追加
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
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
            {/* ここに終了画面の内容を追加 */}
          </div>
        ) : (
          <div>
            {isRunning && <h1>{words[currentWordIndex]}</h1>}
            <p>{!isRunning && startComponent}</p>
            {formatTime()}
            {/* {isAllWordsShown && <p>*全てのワードを表示しました！</p>} */}
          </div>
        )}
      </header>
    </div>
  );
}

const startComponent = <span>Just Press the Enter key</span>;

export default App;
