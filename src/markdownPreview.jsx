import ReactMarkdown from "react-markdown";

function MarkdownPreview({ markdown }) {
  return (
    <div className="preview">
      <h2>Preview</h2>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}

export default MarkdownPreview;
