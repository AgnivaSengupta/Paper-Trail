const extractImages = (content: any) => {
  const urls: string[] = [];
  
  const traverse = (node: any) => {
    if (node.type === 'image' && node.attrs && node.attrs.src){
      urls.push(node.attrs.src);
    }
    
    if (node.content && Array.isArray(node.content)){
      node.content.forEach(traverse);
    }
  }
  
  if (content) traverse(content);
  return urls;
}

export default extractImages;