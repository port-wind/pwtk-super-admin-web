const count = (top: any, bool?: false) => {
  let height = window.innerHeight - 145
  if (bool) {
    height = height - 55
  }
  // header 80.8;
  if (top) {
    height = height - top?.getBoundingClientRect().height
  }
  return height
}
export default count
