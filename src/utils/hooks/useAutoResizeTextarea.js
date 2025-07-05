import { useCallback, useEffect, useRef, useState } from "react";

export default function useAutoResizeTextarea(
  initialValue,
  placeholderText,
  condition = () => true
) {
  const textareaRef = useRef(null);
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const updateHeight = useCallback(() => {
    if (!textareaRef.current) return;

    const currentValue = textareaRef.current.value;

    if (currentValue === "" && condition()) {
      textareaRef.current.value = placeholderText;
    }

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

    if (currentValue === "" && condition()) {
      textareaRef.current.value = "";
    }
  }, [placeholderText, condition]);

  useEffect(() => {
    updateHeight();
  }, [value, updateHeight]);

  return {
    textareaRef,
    value,
    setValue,
    updateHeight,
    valueRef,
  };
}
