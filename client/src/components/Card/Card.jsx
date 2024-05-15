import React, { useState } from "react";
import "./Card.css";

export const Card = ({
  title,
  description,
  prompt_text
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt_text).then(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000); 
    }, (err) => {
      console.error('Error copying prompt: ', err);
    });
  };
  return (
    <div className="card-container" onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
      {showTooltip && (<div className="tool-tip">Prompt copied!</div>)}
      {title && <h1 className="card-title">{title}</h1>}
      {description && <p className="card-description">{description}</p>}
      {prompt_text && <p className="card-prompt-text">{prompt_text}</p>}
    </div>
  );
};