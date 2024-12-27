function getBucketFromIp(ip: string): "A" | "B" {
  let hash = 0;

  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash |= 0;
  }
  return hash % 2 === 0 ? "A" : "B";
}

export default getBucketFromIp;
