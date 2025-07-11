export const slugify = (val) => {
  if (!val) return "";
  return String(val)
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};


export const getNow = () => {
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString()
}