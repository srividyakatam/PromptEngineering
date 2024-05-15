import React, { useState } from "react";

import "./Styles/Navbar.css";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <Link to="/PromptLibrary" className="title">
        Prompt Engineering Toolkit
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        {/* <li>
          <NavLink to="/About">About</NavLink>
        </li> */}
        <li>
          <NavLink to="/PromptLibrary">PromptLibrary</NavLink>
        </li>
        <li>
          <NavLink to="/PromptTemplate">PromptTemplate</NavLink>
        </li>
        <li>
          <NavLink to="/PromptAnalyzer">PromptAnalyzer</NavLink>
        </li>
      </ul>
    </nav>
  );
};