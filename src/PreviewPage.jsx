import MarkdownPreview from "./markdownPreview.jsx";

function PreviewPage(props) {
  const markdown = props.markdown || "No markdown available yet.";

  return <MarkdownPreview markdown={markdown} />;
}

export default PreviewPage;
