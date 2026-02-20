import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
// import { useFileUpload } from '../../hooks/useFileUpload';
import { MDImagePanel } from './MDImagePanel';
import './Markdown.css';

// SVG Icon components
const IconBold = () => <img src={new URL('./../assets/bold.svg', import.meta.url).href} alt="Bold" className="md-icon" />;
const IconItalic = () => <img src={new URL('./../assets/italic.svg', import.meta.url).href} alt="Italic" className="md-icon" />;
const IconLink = () => <img src={new URL('./../assets/link.svg', import.meta.url).href} alt="Link" className="md-icon" />;
const IconImage = () => <img src={new URL('./../assets/image.svg', import.meta.url).href} alt="Image" className="md-icon" />;
const IconCode = () => <img src={new URL('./../assets/code.svg', import.meta.url).href} alt="Code" className="md-icon" />;
const IconList = () => <img src={new URL('./../assets/unordered-list.svg', import.meta.url).href} alt="List" className="md-icon" />;
const IconHeader1 = () => <img src={new URL('./../assets/header-1.svg', import.meta.url).href} alt="List" className="md-icon" />;
const IconHeader2 = () => <img src={new URL('./../assets/header-2.svg', import.meta.url).href} alt="List" className="md-icon" />;
const IconHeader3 = () => <img src={new URL('./../assets/header-3.svg', import.meta.url).href} alt="List" className="md-icon" />;
const IconOrderedList = () => <img src={new URL('./../assets/ordered-list.svg', import.meta.url).href} alt="Ordered List" className="md-icon" />;
const IconQuote = () => <img src={new URL('./../assets/quote-up.svg', import.meta.url).href} alt="Quote" className="md-icon" />;
const IconHR = () => <img src={new URL('./../assets/horizontal-line.svg', import.meta.url).href} alt="Horizontal Rule" className="md-icon" />;

function MDEdit({ markdown, setMarkdown }) {
    const [showPreview, setShowPreview] = useState(false);
    const [showImagePanel, setShowImagePanel] = useState(false);
    const [imgUrl, setImgUrl] = useState("");
    const [imgAlt, setImgAlt] = useState("");
    const [imgWidth, setImgWidth] = useState("");
    const [imgAlign, setImgAlign] = useState("center");
    const [uploadedFile, setUploadedFile] = useState(null);
    // const { upload, isUploading } = useFileUpload();
    const textareaRef = useRef(null);

    function insertAtCursor(text) {
        const ta = textareaRef.current;
        if (!ta) {
            setMarkdown((m) => m + text);
            return;
        }
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = markdown.slice(0, start);
        const after = markdown.slice(end);
        const newText = before + text + after;
        setMarkdown(newText);
        requestAnimationFrame(() => {
            ta.focus();
            const pos = start + text.length;
            ta.selectionStart = ta.selectionEnd = pos;
        });
    }

    function wrapSelection(prefix, suffix = prefix) {
        const ta = textareaRef.current;
        if (!ta) {
            setMarkdown((m) => m + prefix + suffix);
            return;
        }
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = markdown.slice(start, end) || "text";
        const newSel = prefix + selected + suffix;
        const newMarkdown = markdown.slice(0, start) + newSel + markdown.slice(end);
        setMarkdown(newMarkdown);
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = start + prefix.length;
            ta.selectionEnd = start + prefix.length + selected.length;
        });
    }

    function prefixLines(prefix) {
        const ta = textareaRef.current;
        if (!ta) {
            setMarkdown((m) => prefix + m);
            return;
        }
        let selStart = ta.selectionStart;
        let selEnd = ta.selectionEnd;
        
        // If no selection, select the entire line the cursor is on
        if (selStart === selEnd) {
            while (selStart > 0 && markdown[selStart - 1] !== '\n') {
                selStart--;
            }
            while (selEnd < markdown.length && markdown[selEnd] !== '\n') {
                selEnd++;
            }
        }
        
        const selected = markdown.slice(selStart, selEnd);
        const lines = selected.split('\n');
        const prefixed = lines.map((l) => (l.trim() ? prefix + l : l)).join('\n');
        const newMarkdown = markdown.slice(0, selStart) + prefixed + markdown.slice(selEnd);
        setMarkdown(newMarkdown);
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = selStart;
            ta.selectionEnd = selStart + prefixed.length;
        });
    }

    function handleBold() { wrapSelection('**', '**'); }
    function handleItalic() { wrapSelection('*', '*'); }
    function handleCode() { wrapSelection('```\n', '\n```'); }
    function handleH1() { prefixLines('# '); }
    function handleH2() { prefixLines('## '); }
    function handleH3() { prefixLines('### '); }
    function handleUL() { prefixLines('- '); }
    function handleOL() { prefixLines('1. '); }
    function handleQuote() { prefixLines('> '); }
    function handleHR() { insertAtCursor('\n---\n'); }

    function handleLink() {
        const ta = textareaRef.current;
        const start = ta ? ta.selectionStart : 0;
        const end = ta ? ta.selectionEnd : 0;
        const selected = markdown.slice(start, end) || 'link text';
        const url = window.prompt('Enter URL', 'https://');
        if (!url) return;
        const md = `[${selected}](${url})`;
        insertAtCursor(md);
    }

    function openImagePanel() {
        setImgUrl('');
        setImgAlt('');
        setImgWidth('');
        setImgAlign('center');
        setUploadedFile(null);
        setShowImagePanel(true);
    }

    async function insertImage() {
        let finalUrl = imgUrl;

        // If a file was uploaded, upload it first
        // if (uploadedFile) {
        //     try {
        //         finalUrl = await upload(uploadedFile);
        //     } catch (error) {
        //         console.error('Image upload failed:', error);
        //         return;
        //     }
        // }

        if (!finalUrl) return;
        const metaParts = [];
        if (imgWidth) metaParts.push(`w=${imgWidth}`);
        if (imgAlign) metaParts.push(`align=${imgAlign}`);
        const meta = metaParts.length ? '|' + metaParts.join('|') : '';
        const altWithMeta = (imgAlt || 'image') + meta;
        const mdClean = `![${altWithMeta}](${finalUrl})`;
        insertAtCursor(mdClean);
        setShowImagePanel(false);
    }

    const imageComponents = {
        img: ({node, ...props}) => {
            const rawAlt = props.alt || '';
            const parts = rawAlt.split('|');
            const realAlt = parts[0] || '';
            const meta = parts.slice(1);
            const style = {};
            let className = 'md-rendered-img';
            meta.forEach((m) => {
                const [k, v] = m.split('=');
                if (!k || !v) return;
                if (k === 'w') style.width = v;
                if (k === 'align') {
                    if (v === 'left') style.cssFloat = 'left';
                    else if (v === 'right') style.cssFloat = 'right';
                    else if (v === 'center') { style.display = 'block'; style.margin = '0 auto'; }
                }
            });
            return <img src={props.src} alt={realAlt} style={style} className={className} />;
        }
    };

    return (
        <div className="md-container">
            <div className="md-header">
                <h2 className="md-title">Markdown Editor</h2>
                <div className="md-header-actions">
                    <button className="md-btn" onClick={() => setShowPreview((p) => !p)}>
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                </div>
            </div>

            <div className="md-editor-wrapper">
                <div className="md-toolbar">
                    {/* Text Formatting Section */}
                    <button onClick={handleBold} title="Bold" className="md-toolbar-btn">
                        <IconBold />
                    </button>
                    <button onClick={handleItalic} title="Italic" className="md-toolbar-btn">
                        <IconItalic />
                    </button>

                    <div className="md-toolbar-divider">|</div>

                    {/* Headings Section */}
                    <button onClick={handleH1} title="Heading 1" className="md-toolbar-btn">
                        <IconHeader1 />
                    </button>
                    <button onClick={handleH2} title="Heading 2" className="md-toolbar-btn">
                        <IconHeader2 />
                    </button>
                    <button onClick={handleH3} title="Heading 2" className="md-toolbar-btn">
                        <IconHeader3 />
                    </button>

                    <div className="md-toolbar-divider">|</div>

                    {/* Links & Media Section */}
                    <button onClick={handleLink} title="Insert Link" className="md-toolbar-btn">
                        <IconLink />
                    </button>
                    <button onClick={openImagePanel} title="Insert Image" className="md-toolbar-btn">
                        <IconImage />
                    </button>

                    <div className="md-toolbar-divider">|</div>

                    {/* Code Section */}
                    <button onClick={handleCode} title="Code Block" className="md-toolbar-btn">
                        <IconCode />
                    </button>

                    <div className="md-toolbar-divider">|</div>

                    {/* Lists Section */}
                    <button onClick={handleUL} title="Unordered List" className="md-toolbar-btn">
                        <IconList />
                    </button>
                    <button onClick={handleOL} title="Ordered List" className="md-toolbar-btn">
                        <IconOrderedList />
                    </button>

                    <div className="md-toolbar-divider">|</div>

                    {/* Blocks Section */}
                    <button onClick={handleQuote} title="Block Quote" className="md-toolbar-btn">
                        <IconQuote />
                    </button>
                    <button onClick={handleHR} title="Horizontal Rule" className="md-toolbar-btn">
                        <IconHR />
                    </button>
                </div>

                <div className="md-editor">
                    <textarea
                        ref={textareaRef}
                        className="md-textarea"
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        rows={10}
                        placeholder="Type your markdown here..."
                    />
                    {showPreview &&
                        <div className="md-preview">
                            <h2 className="md-title mb-3">Preview</h2>
                            <ReactMarkdown components={imageComponents}>{markdown}</ReactMarkdown>
                        </div>
                    }
                </div>
            </div>

            <MDImagePanel
                isOpen={showImagePanel}
                onClose={() => setShowImagePanel(false)}
                imgUrl={imgUrl}
                setImgUrl={setImgUrl}
                imgAlt={imgAlt}
                setImgAlt={setImgAlt}
                imgWidth={imgWidth}
                setImgWidth={setImgWidth}
                imgAlign={imgAlign}
                setImgAlign={setImgAlign}
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                onInsert={insertImage}
                // isUploading={isUploading}
            />
        </div>
    );
}


export default MDEdit;
