import React from "react";
import Callout from "./Callout";
import CodeBlock from "./CodeBlock";
// import MathBlock from "./MathBlock";
import slugify from "slugify";

type TipTapNode = {
    type: string;
    attrs?: Record<string, any>;
    content?: TipTapNode[];
    marks?: { type: string, attrs?: Record<string, any> }[];
    text?: string;
}

interface RenderProps {
    content: { type: string; content: TipTapNode[] } | null;
}

const TiptapRenderer = ({ content }: RenderProps) => {
    if (!content || !content.content) return null;

    return <div className="prose-docs">{content.content.map((node, index) => renderNode(node, index))}</div>
}


const renderNode = (node: TipTapNode, index: number) => {
    if (node.type === 'text') {
        let textElement: React.ReactNode = node.text;

        if (node.marks) {
            node.marks.forEach((mark) => {
                switch (mark.type) {
                    case "bold":
                        textElement = <strong key={mark.type}>{textElement}</strong>;
                        break;

                    case "italic":
                        textElement = <em key={mark.type}>{textElement}</em>;
                        break;

                }
            })
        }
        return <React.Fragment key={index}>{textElement}</React.Fragment>
    } else if (node.type === 'image') {
        return (
            <img 
                key={index} // Don't forget the key!
                src={node.attrs?.src} 
                alt={node.attrs?.alt || ''} 
                title={node.attrs?.title}
                className="my-6 rounded-lg max-w-full h-auto" // meaningful styles
            />
        );
    }

    switch (node.type) {
        case "paragraph":
            return (
                <p key={index} className="mb-4">
                    {node.content ? node.content.map((child, i) => renderNode(child, i)) : <br />}
                </p>
            );

        case "heading":
            const Level = `h${node.attrs?.level || 2}` as React.ElementType;
            // Generate an ID for anchor links if needed
            const text = node.content?.[0]?.text || "";
            const id = slugify(text);
            // const id = node.content?.[0]?.text?.toLowerCase().replace(/\s+/g, "-");
            return (
                <Level key={index} id={id} className="font-bold my-4 scroll-mt-24">
                    {node.content?.map((child, i) => renderNode(child, i))}
                </Level>
            );

        case "codeBlock": // Tiptap standard node name
            return (
                <CodeBlock
                    key={index}
                    language={node.attrs?.language || "text"}
                    filename={node.attrs?.filename} // You must add a filename attr to your Tiptap extension to support this
                    code={node.content?.[0]?.text || ""}
                />
            );

        case "callout": // Assumes you created a custom Node in Tiptap named 'callout'
            return (
                <Callout key={index} type={node.attrs?.type || "info"} title={node.attrs?.title}>
                    {node.content?.map((child, i) => renderNode(child, i))}
                </Callout>
            );

        // case "mathBlock": // Assumes you created a custom Node in Tiptap named 'mathBlock'
        //     return (
        //         <MathBlock key={index} inline={node.attrs?.inline}>
        //             {node.content?.[0]?.text}
        //         </MathBlock>
        //     );

        case "bulletList":
            return (
                <ul key={index} className="list-disc pl-5 mb-4">
                    {node.content?.map((child, i) => renderNode(child, i))}
                </ul>
            );

        case "orderedList":
            return (
                <ol key={index} className="list-decimal pl-5 mb-4">
                    {node.content?.map((child, i) => renderNode(child, i))}
                </ol>
            );

        case "listItem":
            return (
                <li key={index}>
                    {node.content?.map((child, i) => renderNode(child, i))}
                </li>
            );

        case "image":
            return (
                <img src={node.attrs?.scr} alt="" />
            )

        default:
            console.warn(`Unknown node type: ${node.type}`);
            return null;
    }


}



export default TiptapRenderer;