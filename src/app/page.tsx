"use client";

import Image from "next/image";
import { useState } from "react";

type DominoCard = [number, number];

export default function Home() {
  const defaultData: DominoCard[] = [
    [6, 1],
    [4, 3],
    [5, 1],
    [3, 4],
    [1, 1],
    [3, 4],
    [1, 2],
  ];

  const [dominoCards, setDominoCards] = useState(defaultData);
  const [removeInput, setRemoveInput] = useState<string>("");

  const countDouble = (cards: DominoCard[]): number => {
    return cards.filter((card) => card[0] === card[1]).length;
  };

  const calculateTotal = (card: DominoCard): number => {
    return card[0] + card[1];
  };

  const sortCards = (direction: "asc" | "desc"): void => {
    const sortedCards = [...dominoCards].sort((a, b) => {
      const totalA = calculateTotal(a);
      const totalB = calculateTotal(b);

      if (totalA !== totalB) {
        return direction === "asc" ? totalA - totalB : totalB - totalA;
      }

      const minA = Math.min(a[0], a[1]);
      const minB = Math.min(b[0], b[1]);

      return direction === "asc" ? minA - minB : minB - minA;
    });

    setDominoCards(sortedCards);
  };

  const removeDuplicates = (): void => {
    const uniqueCards: DominoCard[] = [];
    const seen = new Set<string>();

    dominoCards.forEach((card) => {
      const sorted = [Math.min(card[0], card[1]), Math.max(card[0], card[1])];
      const key = sorted.join(",");

      if (!seen.has(key)) {
        seen.add(key);
        uniqueCards.push(card);
      }
    });

    setDominoCards(uniqueCards);
  };

  const flipCards = (): void => {
    const flippedCards = dominoCards.map(
      (card) => [card[1], card[0]] as DominoCard
    );
    setDominoCards(flippedCards);
  };

  const handleRemove = (): void => {
    if (!removeInput.trim()) return;

    if (removeInput.includes(",")) {
      const [num1Str, num2Str] = removeInput.split(",");
      const num1 = parseInt(num1Str.trim());
      const num2 = parseInt(num2Str.trim());
      if (!isNaN(num1) && !isNaN(num2)) {
        setDominoCards(
          dominoCards.filter((card) => {
            return !(card[0] === num1 && card[1] === num2);
          })
        );
      }
    } else {
      const total = parseInt(removeInput.trim());
      if (!isNaN(total)) {
        setDominoCards(
          dominoCards.filter((card) => calculateTotal(card) !== total)
        );
      }
    }
    setRemoveInput("");
  };

  const resetData = (): void => {
    setDominoCards(defaultData);
    setRemoveInput("");
  };

  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold">Dominoes</h1>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between h-20 bg-slate-50 border-2 border-slate-100 p-2 rounded-md">
          <strong>Source</strong>
          <p>{JSON.stringify(defaultData)}</p>
        </div>
        <div className="flex flex-col justify-between h-20 bg-slate-50 border-2 border-slate-100 p-2 rounded-md">
          <strong>Double Numbers</strong>
          <p>{countDouble(dominoCards)}</p>
        </div>
      </div>
      <div className="flex gap-2 py-4">
        {dominoCards.map((card, index) => (
          <div
            key={index}
            className="border-2 border-gray-800 flex flex-col justify-between p-1 w-fit h-24"
          >
            <div>{card[0]}</div>
            <div className="border-t-2 border-gray-800 my-1" />
            <div>{card[1]}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => sortCards("asc")}
          className="bg-blue-500 text-white p-2 rounded-md border-none"
        >
          Sort (ASC)
        </button>
        <button
          onClick={() => sortCards("desc")}
          className="bg-blue-500 text-white p-2 rounded-md border-none"
        >
          Sort (DESC)
        </button>
        <button
          onClick={flipCards}
          className="bg-blue-500 text-white p-2 rounded-md border-none"
        >
          Flip
        </button>
        <button
          onClick={removeDuplicates}
          className="bg-blue-500 text-white p-2 rounded-md border-none"
        >
          Remove Dup
        </button>
        <button
          onClick={resetData}
          className="bg-blue-500 text-white p-2 rounded-md border-none"
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col py-2">
        <input
          type="text"
          value={removeInput}
          onChange={(e) => setRemoveInput(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Input Number"
        />
      </div>
      <button
        onClick={handleRemove}
        className="bg-blue-500 text-white p-2 rounded-md border-none"
      >
        Remove
      </button>
    </div>
  );
}
