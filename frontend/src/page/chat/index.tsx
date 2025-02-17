import React from "react";
import { useState } from "react";
import axios from "axios";
// import badang from "../../../public/badang.png";
import doctor from "../../../public/doctor.png";
import ChatLoader from "../../components/chatLoader";
import styles from "./index.module.scss";

export default function Chat() {
  const [userInput, setUserInput] = useState("");
  const [convoHistory, setConvoHistory] = useState<
    { type: string; message: string }[]
  >([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAiLoading(true);
    try {
      setConvoHistory((prevItems) => [
        ...prevItems,
        { type: "user", message: userInput },
      ]);

      axios
        .post("https://ai-beige-eta.vercel.app/chat", { prompt: userInput })
        .then((response) => {
          setConvoHistory((prevItems) => [
            ...prevItems,
            { type: "ai", message: response.data.response },
          ]);
          setIsAiLoading(false);
        });
      setUserInput("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ul className={styles.popups}>
        <li>
          <img src={doctor} alt="####" />
        </li>
      </ul>
      <form onSubmit={handleFormSubmit} className={styles.chatBoxContainer}>
        <p className={styles.dodongName}>
          <span className={styles.dot}></span>
          <span>Dr. Smith</span>
        </p>
        <ul className={styles.conversationWrapper}>
          {convoHistory.length
            ? convoHistory.map((input) => (
                <li>
                  {input.type === "user" && (
                    <ul className={styles.userInput}>
                      <p>{input.message}</p>
                    </ul>
                  )}
                  {input.type === "ai" && (
                    <ul className={styles.aiSentence}>
                      <li>
                        <img src={doctor} alt="####" />
                      </li>
                      <p className={styles.aiInput}>{input.message}</p>
                    </ul>
                  )}
                </li>
              ))
            : ""}
          {isAiLoading && (
            <div className={styles.chatLoader}>
              <ChatLoader />
            </div>
          )}
        </ul>
        <div className={styles.absoluteWrapper}>
          <div className={styles.userInputFieldWrapper}>
            <input
              className={styles.userInputField}
              value={userInput}
              onChange={handleUserInputChange}
              placeholder="Aa"
            />
            <button className={styles.sendBtn}>Send</button>
          </div>
        </div>
      </form>
    </>
  );
}
