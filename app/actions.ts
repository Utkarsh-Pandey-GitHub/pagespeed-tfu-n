import axios from "axios";

export async function fetchMasterClass(
  id: string,
  testType?: string
) {
  if (testType) {
    try {
      console.log("attempting to fetch masterclass data");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}masterclasses/${id}?abtest=true&abtesttype=${testType}`,
        {
          headers: {
            "Accept-Encoding": "gzip",
          },
        }
      );
      console.log("masterclass data fetched",data);
      return {
        masterclassData: data.data,
        abTestCounter: data.abTestCounter,
      };
      
    } catch (err) {
      return {
        
          masterclassData: {},
          abTestCounter: 0,
        
      };
    }
  }
}
