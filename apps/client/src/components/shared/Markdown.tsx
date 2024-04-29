import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const MarkdownRenderer = ({ content, role }: { content: any; role: string }) => {
  return (
    <ReactMarkdown
      className={`text-${role == "user" ? "white" : "black"} `}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
