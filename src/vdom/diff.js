// When the state of a component changes, React updates the virtual DOM tree. Once the virtual DOM has been updated, React then compares the current version of the virtual DOM with the previous version of the virtual DOM. This process is called “diffing”

import render from './render';

const zip = (xs, ys) => {
  const zipped = [];
  // loop through shorter array and zip elements of both arrays
  for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

const diffAttrs = (oldAttrs, newAttrs) => {
  //  how ? --> loop through old attr and if they are not in new attr then push the new patch to remove them

  // array of patches - (array of functions to diff attr at that index)
  const patches = [];

  // set new attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  // remove old attributes by looping through old attr
  for (const k in oldAttrs) {
    // if k is not in new attr add patch to remove them
    if (!(k in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  // patch wrapper - to execute all patchers
  return $node => {
    for (const patch of patches) {
      // executing all patches from the array one by one
      patch($node);
    }
  };
};

const diffChildren = (oldVChildren, newVChildren) => {
  // array for patches (fn) for children
  const childPatches = [];
  // loop through all the old children and push the pach to the array
  oldVChildren.forEach((oldVChild, i) => {
    // using recursion to handle children - ie. calling diff fn for children
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  // additional patches - in case newVNode is bigger than oldVNode - for eg. to add new node
  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push($node => {
      // no need to call diff here because we are adding new node (of newVDOM) no need to compare with old node as all these are new node i.e not present in old node as old node is shorter
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return $parent => {
    // zip fn - take two arrays and zip them together (eg both child at 0 idx in both arrays are zipped together)
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      // executing the patches
      patch(child);
    }

    // executing patches for new nodes (that are not in old node but are in new node)
    for (const patch of additionalPatches) {
      patch($parent);
    }

    return $parent;
  };
};

const diff = (vOldNode, vNewNode) => {
  // if new node is undefined that means there is nothing there so remove everything
  if (vNewNode === undefined) {
    return $node => {
      // remove everything
      $node.remove();
      return undefined;
    };
  }

  // if either node is a string
  if (typeof vOldNode === 'string' ||
    typeof vNewNode === 'string') {
      // if they are not equal - replace old node with new node
    if (vOldNode !== vNewNode) {
      return $node => {
        // new root node
        const $newNode = render(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      // if they are string and are same -> do nothing
      return $node => undefined;
    }
  }

  // if two tagnames are not equal then returna a patch(a function) that takes a node and it'll replace the node
  // here is what shows in many virtual dom videos - instead of re rendering everything just replace the changes node and its children(i.e all nodes below the new node)
  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      // new root node
      // rending the changes of the dom using the render function (done here not in main.js)
      const $newNode = render(vNewNode);
      // replace old with new node and return new node
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  // upto here we have handle the tag name now we need to check for attributes and children
  // if tag names are equal we have to check for attr and children

  // diff the children and attributes of the node
  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children);
  
  // returning the patch - here $node is the root element passed to the patch fn in main.js
  return $node => {
    // checking for attr and children for that $node
    // executing the patches for children and attributes
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
};

export default diff;
