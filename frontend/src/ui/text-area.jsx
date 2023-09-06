import styles from "./input.css";
import { useState } from "react";

export const TextArea = ({ onChange, onEnter, ...props }) => {
  const [value, setValue] = useState("");

  const onInputChange = (event) => {
    const { value } = event.target;
    setValue(value);
    onChange && onChange(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      onEnter && onEnter(value);
    }
  };

  return (
    <textarea
      onChange={onInputChange}
      value={value}
      className={styles.inputItem}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};
