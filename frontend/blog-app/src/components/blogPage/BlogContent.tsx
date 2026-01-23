import CodeBlock from "./CodeBlock";
import InlineCode from "./InlineCode";
import Callout from "./Callout";
import MathBlock from "./MathBlock";
import Highlight from "./Highlight";

const BlogContent = () => {
  return (
    <article className="prose-docs">
      <h2 id="introduction">Introduction</h2>
      <p>
        In modern web development, handling <Highlight>cross-origin resource sharing (CORS)</Highlight> correctly 
        is essential for secure API communication. This guide covers best practices for configuring CORS 
        policies in your backend services.
      </p>

      <Callout type="info" title="Prerequisites">
        <p>Before proceeding, ensure you have a basic understanding of HTTP headers and have access to your server configuration.</p>
      </Callout>

      <h2 id="cors-policy">CORS "Read" Policy</h2>
      <p>
        You set up CORS for <InlineCode>PUT</InlineCode> (writing), but if you are using a different domain 
        for your images than your frontend, you might need to ensure <InlineCode>GET</InlineCode> is also 
        allowed so the browser can display the image.
      </p>

      <p>
        Update your CORS policy to include <InlineCode>GET</InlineCode> requests:
      </p>

      <CodeBlock
        filename="cors-config.ts"
        language="typescript"
        code={`const corsOptions = {
  origin: ['https://your-frontend.com'],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));`}
      />

      <h3 id="implementation">Implementation Details</h3>
      <p>
        The <InlineCode>Access-Control-Allow-Origin</InlineCode> header specifies which origins can access 
        the resource. For security, avoid using the wildcard <InlineCode>*</InlineCode> in production.
      </p>

      <Callout type="warning" title="Security Warning">
        <p>Never use <InlineCode>*</InlineCode> for <InlineCode>Access-Control-Allow-Origin</InlineCode> when 
        <InlineCode>credentials: true</InlineCode> is set. This creates a security vulnerability.</p>
      </Callout>

      <p>When implementing CORS policies, consider the following:</p>
      <ul>
        <li>Set appropriate headers in your server configuration</li>
        <li>Use environment-specific CORS rules for development and production</li>
        <li>Test thoroughly across different browsers and devices</li>
        <li>Monitor CORS-related errors in your application logs</li>
      </ul>

      <h2 id="math-example">Mathematical Notation</h2>
      <p>
        When calculating request timing, the total latency can be expressed as:
      </p>

      <MathBlock>
        T_total = T_dns + T_tcp + T_tls + T_request + T_response
      </MathBlock>

      <p>
        Where <MathBlock inline>T_dns</MathBlock> represents DNS lookup time 
        and <MathBlock inline>T_tcp</MathBlock> is the TCP handshake duration.
      </p>

      <h2 id="best-practices">Best Practices</h2>
      
      <Callout type="tip" title="Pro Tip">
        <p>Use a CORS middleware library instead of manually setting headers. This reduces the chance of misconfiguration.</p>
      </Callout>

      <p>Follow these numbered steps for a secure setup:</p>
      <ol>
        <li>Audit all origins that need access to your API</li>
        <li>Create an allowlist of trusted domains</li>
        <li>Configure preflight caching with <InlineCode>maxAge</InlineCode></li>
        <li>Test with browser DevTools Network tab</li>
      </ol>

      <p>
        Here's an example of handling preflight requests in Express:
      </p>

      <CodeBlock
        filename="preflight.ts"
        language="typescript"
        code={`app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(204);
});`}
      />

      <h2 id="conclusion">Conclusion</h2>
      <p>
        Proper CORS configuration is <Highlight color="green">critical for security</Highlight> while 
        enabling legitimate cross-origin requests. Always test your configuration thoroughly and 
        keep your origin allowlist as restrictive as possible.
      </p>

      <Callout type="note">
        <p>For more information, refer to the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">MDN CORS documentation</a>.</p>
      </Callout>
    </article>
  );
};

export default BlogContent;
