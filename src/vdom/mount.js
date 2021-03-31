export default ($node, $target) => {
  // The ChildNode.replaceWith() method replaces this ChildNode (i.e $target in our case) in the children list of its parent with a set of Node or DOMString objects (i.e $node in our case).
  $target.replaceWith($node);
  return $node;
};
