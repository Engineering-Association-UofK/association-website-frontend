import { useState } from "react";
import ReactMarkdown from "react-markdown";
import './Markdown.css';

function MDEdit({ markdown, setMarkdown }) {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="md-container">
            <div className="md-header">
                <h2 className="md-title">Markdown Editor</h2>

                <button className="md-btn" onClick={() => setShowPreview((p) => !p)}>
                    {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
            </div>

            <div className="md-editor">
                <textarea
                    className="md-textarea"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    rows={10}
                    placeholder="Type your markdown here..."
                />
                {showPreview &&
                    <div className="md-preview">
                        <h2 className="md-title mb-3">Preview</h2>
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                }
            </div>
        </div>
    );
}

export default MDEdit;
