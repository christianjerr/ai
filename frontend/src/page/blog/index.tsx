import React from "react";

function Blog() {
  return (
    <>
      <div className="inputWrapper">
        <input
          placeholder="What's on your mind"
          className="whats-on-your-mind"
        />
      </div>
      <ul className="userPost">
        <li>Christian Jerr Buarao</li>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
          vitae laborum deserunt reprehenderit. Suscipit quibusdam alias eaque
          dignissimos maiores consectetur?
        </p>
      </ul>
      <ul className="userPost">
        <li>Second account</li>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
          vitae laborum deserunt reprehenderit. Suscipit quibusdam alias eaque
          dignissimos maiores consectetur?
        </p>
      </ul>
    </>
  );
}

export default Blog;
