import React from "react";
import "./DescriptionBox.css";

export default function DescriptionBox() {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et omnis,
            adipisci odit repellat sapiente, nisi nesciunt nemo eligendi maxime
            excepturi in aperiam nam ad, sit itaque beatae a laboriosam dicta?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
            sint, alias quas sapiente ex blanditiis, fuga a ipsa tempore impedit
            repudiandae corporis ab. Consequuntur quia earum debitis quos qui
            veritatis.
          </p>
        </div>
    </div>
  );
}
