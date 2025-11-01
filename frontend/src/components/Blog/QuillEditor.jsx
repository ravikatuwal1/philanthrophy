import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import "./QuillEditor.css";

// optional resize feature
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

export default function QuillEditor({
  value = "",
  onChange,
  placeholder = "Write here…",
}) {
  const containerRef = useRef(null); // editor container
  const quillRef = useRef(null);     // Quill instance
  const toolbarRef = useRef(null);   // toolbar node

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const el = containerRef.current;

    const q = new Quill(el, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link", "image"],
            [{ align: [] }, { color: [] }, { background: [] }],
            ["clean"],
          ],
          handlers: {
            image: imageHandler,
          },
        },
        imageResize: {
          modules: ["Resize", "DisplaySize", "Toolbar"],
        },
      },
    });

    // --- custom image handler
    function imageHandler() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file); // the field name must match backend router

        try {
          // upload to your dedicated blog upload endpoint
          const { data } = await axios.post("/api/upload/blog", formData);
          const range = q.getSelection(true);
          const imageUrl = `http://localhost:5000${data.url}`;
          q.insertEmbed(range.index, "image", imageUrl, "user");
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      };
    }

    quillRef.current = q;

    // store toolbar node
    const maybeToolbar = el.previousSibling;
    if (maybeToolbar?.classList?.contains("ql-toolbar")) {
      toolbarRef.current = maybeToolbar;
    }

    // set initial content
    if (value) q.clipboard.dangerouslyPasteHTML(value);

    // setup text-change listener
    const handler = () => onChange?.(q.root.innerHTML);
    q.on("text-change", handler);

    return () => {
      q.off("text-change", handler);
      if (toolbarRef.current?.parentNode) {
        toolbarRef.current.parentNode.removeChild(toolbarRef.current);
      }
      el.innerHTML = "";
      quillRef.current = null;
      toolbarRef.current = null;
    };
  }, [placeholder, onChange]);

  // keep external → internal sync
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const current = q.root.innerHTML;
    if (value !== current) q.clipboard.dangerouslyPasteHTML(value || "");
  }, [value]);

  return <div ref={containerRef} className="quill-wrapper" />;
}