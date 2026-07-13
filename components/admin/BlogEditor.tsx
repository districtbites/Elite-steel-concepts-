"use client";

import React, { useState, useRef } from "react";
import {
  Save,
  Image as ImageIcon,
  Type,
  Layout,
  List,
  Link as LinkIcon,
  CheckCircle,
  Info,
  Hash,
  Eye,
  Edit3,
  Bold,
  Italic,
  Minus,
  Quote,
  Table,
  ArrowLeft,
  Zap,
  FileText,
  AlertCircle,
} from "lucide-react";
import { quickUploadImage } from "@/app/actions/blog";
import Link from "next/link";

interface BlogEditorProps {
  action: (formData: FormData) => void;
  initialData?: any;
}

const BlogEditor = ({ action, initialData }: BlogEditorProps) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [title, setTitle] = useState(initialData?.title || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsert = (text: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = content.substring(0, start);
      const after = content.substring(end);
      const newContent = before + text + after;
      setContent(newContent);
      // Restore cursor position after insert
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    } else {
      setContent((prev: string) => prev + "\n" + text);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await quickUploadImage(formData);
    if (result.url) {
      setUploadedImages((prev) => [...prev, result.url!]);
      handleInsert(`\n![${file.name.replace(/\.[^.]+$/, "")}](${result.url})\n`);
    }
    setUploading(false);
    // Reset file input
    if (e.target) e.target.value = "";
  };

  const wordCount = content
    .split(/\s+/)
    .filter((w: string) => w.length > 0).length;
  const readTimeEstimate = Math.max(1, Math.ceil(wordCount / 200));

  // More advanced formatting templates
  const formatTools = [
    {
      name: "Heading (H2)",
      icon: <Type size={15} />,
      text: "\n## Your Heading Here\n",
      group: "structure",
    },
    {
      name: "Subheading (H3)",
      icon: <Layout size={15} />,
      text: "\n### Your Sub-heading Here\n",
      group: "structure",
    },
    {
      name: "Bold Text",
      icon: <Bold size={15} />,
      text: "**bold text**",
      group: "inline",
    },
    {
      name: "Italic Text",
      icon: <Italic size={15} />,
      text: "*italic text*",
      group: "inline",
    },
    {
      name: "Bulleted List",
      icon: <List size={15} />,
      text: "\n- Point one\n- Point two\n- Point three\n",
      group: "blocks",
    },
    {
      name: "Numbered List",
      icon: <Hash size={15} />,
      text: "\n1. First item\n2. Second item\n3. Third item\n",
      group: "blocks",
    },
    {
      name: "Blockquote",
      icon: <Quote size={15} />,
      text: '\n> "Your quote or callout text here."\n',
      group: "blocks",
    },
    {
      name: "Horizontal Rule",
      icon: <Minus size={15} />,
      text: "\n---\n",
      group: "blocks",
    },
    {
      name: "Internal Link",
      icon: <LinkIcon size={15} />,
      text: "[Link Text](/your-page)",
      group: "inline",
    },
    {
      name: "Simple Table",
      icon: <Table size={15} />,
      text: "\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |\n",
      group: "blocks",
    },
  ];

  // Markdown to simple HTML for preview
  const renderPreview = (md: string) => {
    let html = md
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-black uppercase text-secondary/80 mt-6 mb-2 tracking-tight">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-black uppercase text-secondary mt-8 mb-3 tracking-tighter">$1</h2>')
      // Bold & Italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-black text-secondary">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary font-bold underline hover:text-secondary">$1</a>')
      // Images
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-4 max-w-full shadow-md" />')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic text-gray-600 bg-primary/5 rounded-r-lg pr-4">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-8 border-gray-100" />')
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600 mb-1">• $1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-600 mb-1 list-decimal">$1</li>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p class="text-gray-600 leading-relaxed mb-4">')
      // Single newlines within paragraphs
      .replace(/\n/g, "<br />");

    return `<p class="text-gray-600 leading-relaxed mb-4">${html}</p>`;
  };

  return (
    <div className="space-y-6">
      {/* ═══════ Top Bar ═══════ */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors"
        >
          <ArrowLeft size={14} />
          Back to All Posts
        </Link>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <FileText size={12} className="text-primary" />
          {wordCount} Words · ~{readTimeEstimate} min read
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ═══════ MAIN EDITOR PANEL ═══════ */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Subtitle */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Type size={12} className="text-primary" />
                Article Title (H1)
              </label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Maintenance Tips for Your Food Truck"
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-2xl font-black text-secondary uppercase tracking-tight placeholder:text-gray-300 placeholder:normal-case placeholder:tracking-normal placeholder:font-medium"
              />
              {title && (
                <div className="text-[9px] font-mono text-gray-300 ml-1">
                  Slug: /{title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Intro / Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                defaultValue={initialData?.subtitle}
                placeholder="A compelling 1-2 line summary that hooks the reader and explains the value."
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-bold text-gray-600 placeholder:text-gray-300 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Editor / Preview Toggle + Content */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 bg-gray-50 border-b border-gray-100 gap-3">
              {/* Editor/Preview Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                    !previewMode
                      ? "bg-secondary text-white shadow-md"
                      : "text-gray-400 hover:text-secondary hover:bg-white"
                  }`}
                >
                  <Edit3 size={14} /> Editor
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                    previewMode
                      ? "bg-secondary text-white shadow-md"
                      : "text-gray-400 hover:text-secondary hover:bg-white"
                  }`}
                >
                  <Eye size={14} /> Preview
                </button>
              </div>

              {/* Format Tools */}
              <div className="flex gap-1.5 flex-wrap">
                {formatTools.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleInsert(t.text)}
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-primary hover:border-primary hover:shadow-sm transition-all"
                    title={t.name}
                  >
                    {t.icon}
                  </button>
                ))}
                <div className="w-px h-8 bg-gray-200 mx-1 self-center" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 border rounded-lg transition-all ${
                    uploading
                      ? "bg-primary/10 border-primary text-primary animate-pulse"
                      : "bg-white border-gray-200 text-gray-500 hover:text-primary hover:border-primary hover:shadow-sm"
                  }`}
                  title="Upload Image"
                >
                  <ImageIcon size={15} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative">
              {!previewMode ? (
                <textarea
                  ref={textareaRef}
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={30}
                  placeholder={`## Start with a strong heading\n\nWrite your introduction here. Hook the reader with a compelling opening that explains what they'll learn.\n\n## Break content into sections\n\nUse H2 headings for major sections and H3 for subsections. This helps both readers and search engines understand your content.\n\n### Use bullet points for lists\n\n- Make your content scannable\n- Highlight key takeaways\n- Keep paragraphs short\n\n## End with a call to action\n\n**Ready to get started?** [Contact our team](/contact) for a free consultation.`}
                  className="w-full p-8 outline-none text-gray-700 leading-loose font-mono text-sm bg-white resize-none min-h-[600px]"
                />
              ) : (
                <div className="w-full p-8 md:p-12 min-h-[600px] bg-white">
                  {content ? (
                    <div
                      className="prose prose-secondary max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: renderPreview(content),
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[400px] text-center">
                      <div>
                        <AlertCircle
                          size={40}
                          className="text-gray-200 mx-auto mb-3"
                        />
                        <p className="text-sm font-bold text-gray-400">
                          No content to preview yet.
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          Switch to Editor and start writing.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex items-center gap-3 bg-secondary text-white px-6 py-3 rounded-full shadow-xl">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">
                      Uploading Media...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/webp,image/jpeg,image/png,image/jpg"
            onChange={handleImageUpload}
          />

          {/* Uploaded Images Gallery */}
          {uploadedImages.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <ImageIcon size={12} className="text-primary" />
                Uploaded Media ({uploadedImages.length})
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {uploadedImages.map((url, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0 cursor-pointer hover:ring-2 ring-primary transition-all"
                    onClick={() =>
                      handleInsert(`\n![Image](${url})\n`)
                    }
                    title="Click to insert into content"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Upload ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-gray-300 font-bold mt-2">
                Click any image to insert it into your content
              </p>
            </div>
          )}
        </div>

        {/* ═══════ SIDEBAR ═══════ */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-tight flex items-center text-secondary gap-2">
              <CheckCircle size={16} className="text-primary" />
              Publishing
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Visibility
                </label>
                <select
                  name="status"
                  defaultValue={initialData?.status || "Draft"}
                  className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-bold text-secondary text-sm"
                >
                  <option value="Draft">◌ Save as Draft</option>
                  <option value="Published">● Publish Live</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={initialData?.category || "Maintenance"}
                  className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-bold text-secondary text-sm"
                >
                  <option value="Maintenance">🔧 Maintenance</option>
                  <option value="Regulation">📋 Regulation</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Advice">💡 Advice</option>
                  <option value="News">📰 News</option>
                  <option value="Business">📊 Business</option>
                  <option value="Guide">📖 Guide</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                    size={14}
                  />
                  <input
                    type="text"
                    name="tags"
                    defaultValue={initialData?.tags?.join(", ")}
                    placeholder="FoodTrucks, Fabrication, VA"
                    className="w-full bg-gray-50 border border-gray-100 pl-10 pr-3.5 py-3.5 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-bold placeholder:text-gray-300 placeholder:font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              formAction={(fd) => action(fd)}
              className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Save size={18} /> Save & Publish
            </button>
          </div>

          {/* Feature Media */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-tight flex items-center text-secondary gap-2">
              <ImageIcon size={16} className="text-primary" />
              Feature Media
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Feature Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    accept="image/webp,image/jpeg,image/png,image/jpg"
                    className="w-full bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-xl outline-none transition-all text-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary file:uppercase file:tracking-wider hover:border-primary/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Image ALT Text (SEO)
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  defaultValue={initialData?.imageAlt}
                  placeholder="e.g. Custom food truck interior in Virginia"
                  className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs font-bold placeholder:text-gray-300 placeholder:font-medium"
                />
              </div>
              {initialData?.image && (
                <div className="pt-4 border-t border-gray-50">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                    Current Image
                  </label>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={initialData.image}
                    alt="Preview"
                    className="rounded-xl aspect-video object-cover w-full shadow-md"
                  />
                  <input
                    type="hidden"
                    name="existingImage"
                    value={initialData.image}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content Quality Card */}
          <div className="bg-secondary p-8 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-3xl -mr-24 -mt-24 rounded-full" />
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                <Zap size={14} className="text-primary" />
                Content Score
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <div className="text-2xl font-black text-primary">
                    {wordCount}
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">
                    Words
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <div className="text-2xl font-black text-primary">
                    ~{readTimeEstimate}m
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">
                    Read Time
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <div className="text-2xl font-black text-primary">
                    {(content.match(/^##/gm) || []).length}
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">
                    Headings
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <div className="text-2xl font-black text-primary">
                    {(content.match(/!\[/g) || []).length}
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">
                    Images
                  </div>
                </div>
              </div>

              {/* Quality Tips */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                {wordCount < 300 && (
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                    <AlertCircle size={10} />
                    Aim for 500+ words for better SEO
                  </div>
                )}
                {(content.match(/^##/gm) || []).length < 2 && (
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                    <AlertCircle size={10} />
                    Add more H2 headings for structure
                  </div>
                )}
                {wordCount >= 500 &&
                  (content.match(/^##/gm) || []).length >= 3 && (
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-green-400">
                      <CheckCircle size={10} />
                      Content looks well-structured!
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Structure Guide */}
          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-tight flex items-center text-secondary gap-2">
              <Info size={16} className="text-primary" />
              Structure Guide
            </h3>
            <ul className="space-y-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              {[
                "Title (H1) — Set above",
                "Intro (2-3 compelling lines)",
                "Section Headings (H2)",
                "Subpoints (H3) with details",
                "Bullet lists for key points",
                "Images with ALT text",
                "Internal links to services",
                "Conclusion with CTA",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
