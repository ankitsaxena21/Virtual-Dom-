// this function will take a tag name and some option and react a virtaul dom (which is just a plain object).

export default (tagName, { attrs = {}, children = [] } = {}) => {
  return {
    tagName,
    attrs,
    children,
  };
};
