
export default (obj, keys) => (Object as any).fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));;
