import React, { useState, useEffect } from "react";
import "../Styles/PromptTemplate.css";
import Dropdown from "../Dropdown/Dropdown";
import DropdownItem from "../DropdownItem/DropdownItem";
import templatesData from "../../../Data/PromptTemplates.json";
import parametersData from "../../../Data/PromptParameters.json";


export const PromptTemplate = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [selectedParameters, setSelectedParameters] = useState({});
  const [dynamicPromptText, setDynamicPromptText] = useState("");

  const [inputValues, setInputValues] = useState({});
  // Update input values state when template changes
  useEffect(() => {
    updatePromptText();
  }, [selectedParameters, inputValues]);

  const updatePromptText = () => {
    let text = selectedTemplate.prompt_text || "";

    // Replace parameters placeholders
    Object.entries(selectedParameters).forEach(([param, value]) => {
      text = text.replace(new RegExp(`{${param}}`, 'g'), value || `{${param}}`);
    });

    // Replace input fields placeholders
    Object.entries(inputValues).forEach(([key, value]) => {
      text = text.replace(new RegExp(`{${key}}`, 'g'), value || `{${key}}`);
    });

    setDynamicPromptText(text);
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedTemplate({});
    setSelectedParameters({});
  };

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    setSelectedParameters({});
    updatePromptText();
  };

  const handleParameterChange = (param, value) => {
    setSelectedParameters(prev => ({ ...prev, [param]: value }));
  };

  const categories = templatesData.categories;
  const templates = categories.find(cat => cat.name === selectedCategory)?.templates || [];
  const parameters = selectedTemplate.parameters || [];

  const getDropdownItems = (param) => {
    return parametersData[0][param] || [];
  };

  const updateGlobalInput = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
    updatePromptText();
};


  const InputTextbox = ({ name, label, placeholder, className, updateGlobalInput }) => {
    const [localValue, setLocalValue] = useState(inputValues[name] || '');

    const handleBlur = () => {
        updateGlobalInput(name, localValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            updateGlobalInput(name, localValue);
        }
    };

    return (
        <div className={`input-field ${className}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <input
                type="text"
                className="input-textbox"
                id={name}
                name={name}
                placeholder={placeholder}
                size="30"
                value={localValue}
                onChange={e => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

const InputTextarea = ({ name, label, placeholder, className, updateGlobalInput }) => {
    const [localValue, setLocalValue] = useState(inputValues[name] || '');

    const handleBlur = () => {
        updateGlobalInput(name, localValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            updateGlobalInput(name, localValue);
        }
    };

    return (
        <div className={`input-field ${className}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <textarea
                className="input-textarea"
                id={name}
                name={name}
                placeholder={placeholder}
                rows="4"
                cols="100"
                value={localValue}
                onChange={e => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};


  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(dynamicPromptText).then(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }, (err) => {
      console.error('Error copying prompt: ', err);
    });
  };

  return (
    <>
      <div className="Prompt-Template">
        <div className="Prompt-Template-params">
          {selectedTemplate.description && (
            <div className="template-description">
              <label>{selectedTemplate.description}</label>
            </div>
          )}
          <div className="content">
            <Dropdown buttonText={selectedCategory || "Category"} content={
              categories.map(cat => (
                <DropdownItem key={cat.name} onClick={() => handleCategoryChange(cat.name)}>
                  {cat.name}
                </DropdownItem>
              ))
            } />

            {selectedCategory && <Dropdown buttonText={selectedTemplate.name || "Template"} content={
              templates.map(temp => (
                <DropdownItem key={temp.name} onClick={() => handleTemplateChange(temp)}>
                  {temp.name}
                </DropdownItem>
              ))
            } />}

            {parameters.map(param => (
              <Dropdown key={param} buttonText={selectedParameters[param] || param} content={
                getDropdownItems(param).map((item, index) => (
                  <DropdownItem key={index} onClick={() => handleParameterChange(param, item)}>
                    {item}
                  </DropdownItem>
                ))
              } />
            ))}
          </div>

          {selectedTemplate.input_fields && (
            <>
              <div className="input-fields-textbox-container">
                {Object.entries(selectedTemplate.input_fields)
                  .filter(([key, field]) => field.type === "textbox")
                  .map(([key, field]) => (
                    <InputTextbox
                      key={key}
                      name={key}
                      label={field.label}
                      placeholder={field.placeholder}
                      className={`input-${field.size}`}
                      updateGlobalInput={updateGlobalInput}
                    />
                  ))}
              </div>
              <div className="input-fields-textarea-container">
                {Object.entries(selectedTemplate.input_fields)
                  .filter(([key, field]) => field.type === "textarea")
                  .map(([key, field]) => (
                    <InputTextarea
                      key={key}
                      name={key}
                      label={field.label}
                      placeholder={field.placeholder}
                      className={`input-${field.size}`}
                      updateGlobalInput={updateGlobalInput}
                    />
                  ))}
              </div>
            </>
          )}

          {selectedTemplate.prompt_text && (
            <div className="template-container">
              <label>Prompt Text</label>
              <textarea
                readOnly
                value={dynamicPromptText || selectedTemplate.prompt_text}
                className="template"
              />

              <button onClick={handleCopyToClipboard} className="copy-button">Copy Prompt</button>
              {showTooltip && <div class="tooltip">Copied to clipboard!</div>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
