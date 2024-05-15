import React from "react";
import "../Styles/PromptLibrary.css";
import { Card } from "../Card/Card";
import promptLibrary from "../../../Data/PromptLibrary.json";

export const PromptLibrary = () => {
  const promptsData = promptLibrary.prompts;

  const listItem = promptsData.map( (item) =>{
    return (
        <Card 
        title = {item.title}
        description={item.description} 
        prompt_text={item.prompt_text} 
        />
        
    )
  })
  return (
    <>
      <div className="prompt-library">
      <div className="col">
        {listItem}
      </div>
      </div>
    </>
  );
};