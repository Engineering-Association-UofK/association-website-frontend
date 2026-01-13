import { useState } from "react";
import { Link } from "react-router-dom";
import MarkdownPreview from "./markdownPreview.jsx";

function EditorPage({ markdown, setMarkdown }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <h2>Markdown Editor</h2>

      <Link to="/preview">
        <button>Preview Only</button>
      </Link>

      <button onClick={() => setShowPreview((p) => !p)}>
        {showPreview ? "Hide Preview" : "Show Preview"}
      </button>

      <div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={10}
          cols={50}
        />
      </div>

      {showPreview && <MarkdownPreview markdown={markdown} />}
    </div>
  );
}

export default EditorPage;
