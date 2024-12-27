const generateSiteMap = ({
  masterclasses,
  bootcamps,
}: {
  masterclasses: any[];
  bootcamps: any[];
}) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>https://www.tradewiseapp.com</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>1.0</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/masterclasses</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.9</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/bootcamps</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.9</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/chatgpt-product</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.9</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/swing-trading-kit</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.9</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/teachers</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.8</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/gold</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.8</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/become-instructor</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.5</priority>
       </url>
        <url>
         <loc>https://www.tradewiseapp.com/contact-us</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.3</priority>
       </url>
        <url>
         <loc>https://www.tradewiseapp.com/about-us</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.1</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/terms-and-conditions</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.1</priority>
       </url>
       <url>
         <loc>https://www.tradewiseapp.com/privacy-policy</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.1</priority>
       </url>
        <url>
         <loc>https://www.tradewiseapp.com/refund-policy</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <priority>0.1</priority>
       </url>
       ${bootcamps
         .map((bootcamp) => {
           if (bootcamp.slug) {
             return `
            <url>
                <loc>${`https://www.tradewiseapp.com/bootcamps/${bootcamp.slug.replace(
                  /&/g,
                  "&amp;"
                )}`}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <priority>0.7</priority>
            </url>
          `;
           }
         })
         .join("")}
        ${masterclasses
          .map((masterclass) => {
            if (masterclass.slug) {
              return `
            <url>
                <loc>${`https://www.tradewiseapp.com/masterclasses/${masterclass.slug.replace(
                  /&/g,
                  "&amp;"
                )}`}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <priority>0.7</priority>
            </url>
          `;
            }
          })
          .join("")}
     </urlset>
   `;
};

export default generateSiteMap;
