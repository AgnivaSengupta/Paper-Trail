const extractImages = (content) => {
  const urls: string[] = [];
  
  const traverse = (node) => {
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