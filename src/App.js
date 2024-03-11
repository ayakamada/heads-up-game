import React, { useState, useEffect } from "react";
import "./App.css";

// 任意のワードのJSON配列
const words = [
  "リンゴ",
  "ビルディング",
  "コンピュータ",
  "プログラミング",
  "旅行",
  // 他のワードを追加...
];

function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timer, setTimer] = useState(180); // 3分 = 180秒

  useEffect(() => {
    // タイマーを開始
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // タイマーが0になったら停止
    if (timer === 0) {
      clearInterval(countdown);
    }

    // コンポーネントのアンマウント時にタイマーをクリア
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    // Enterキーで次のワードに切り替えるイベントリスナーを追加
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // イベントリスナーをクリーンアップ
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // タイマーを分:秒の形式に変換
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{words[currentWordIndex]}</h1>
        <p>タイマー: {formatTime()}</p>
        {timer === 0 && <p>時間切れです！</p>}
      </header>
    </div>
  );
}

export default App;
