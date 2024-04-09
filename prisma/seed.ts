import { PrismaClient } from "@prisma/client";
import axios from "axios";
import postOffices1 from "./postOffices/postOffices_1";
import postOffices2 from "./postOffices/postOffices_2";
import postOffices3 from "./postOffices/postOffices_3";
import postOffices4 from "./postOffices/postOffices_4";
const prisma = new PrismaClient();

async function getAllPostCodesByState(state: "Dhaka Division") {
  const stateInUrl = state.replace(" ", "%20").trim();
  const url = `https://app.zipcodebase.com/api/v1/code/state?apikey=cad75750-af65-11ed-afa9-05a2c8fb2bc1&state_name=${stateInUrl}&country=bd`;

  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error(`Something went wrong! Can't get post codes of ${state}`);
  }
  const data = response.data.results as string[];
  return data;
}

async function getAllPostOfficesByPostCode(postCodes: string[]) {
  if (postCodes.length === 0) return [];

  if (postCodes.length > 100) {
    const firstHalf = postCodes.slice(0, 100);
    const secondHalf = postCodes.slice(100);
    const firstHalfPostOffices = (await getAllPostOfficesByPostCode(
      firstHalf
    )) as PostCodeInfo[];
    const secondHalfPostOffices = (await getAllPostOfficesByPostCode(
      secondHalf
    )) as PostCodeInfo[];

    let output: PostCodeInfo[] = [];
    if (firstHalfPostOffices.length > 0)
      output = [...output, ...firstHalfPostOffices];
    if (secondHalfPostOffices.length > 0)
      output = [...output, ...secondHalfPostOffices];
    return output;
  }
  const postCodesInUrl = postCodes.join("%2C");
  const url = `https://app.zipcodebase.com/api/v1/search?apikey=cad75750-af65-11ed-afa9-05a2c8fb2bc1&codes=${postCodesInUrl}&country=bd`;
  console.log("🚀 ~ file: seed.ts:25 ~ getAllPostOfficesByPostCode ~ url", url);
  // const response = await axios.get(url);
  // if (response.status !== 200) {
  //   throw new Error("Something went wrong! Can't get post offices");
  // }
  // console.log(
  //   "🚀 ~ file: seed.ts:46 ~ getAllPostOfficesByPostCode ~ response.data.results",
  //   response.data.results
  // );
  return {}; //response.data.results as PostCodeInfo[];
}

async function main() {
  // Post Offices 1
  postOffices1.query?.codes?.forEach(async (code) => {
    postOffices1.results?.[code]?.forEach(async (postOffice) => {
      if (!postOffice.postal_code) return;
      const record = await prisma.postOffice.upsert({
        where: {
          postCode: postOffice.postal_code,
        },
        update: {},
        create: {
          name: postOffice.city || "Unknown",
          postCode: postOffice.postal_code,
          province: postOffice.province || "Unknown",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log("postOffice created... ", record);
    });
  });

  // Post Offices 2
  postOffices2.query?.codes?.forEach(async (code) => {
    postOffices2.results?.[code]?.forEach(async (postOffice) => {
      if (!postOffice.postal_code) return;
      const record = await prisma.postOffice.upsert({
        where: {
          postCode: postOffice.postal_code,
        },
        update: {},
        create: {
          name: postOffice.city || "Unknown",
          postCode: postOffice.postal_code,
          province: postOffice.province || "Unknown",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log("postOffice created... ", record);
    });
  });

  // Post Offices 3
  postOffices3.query?.codes?.forEach(async (code) => {
    postOffices3.results?.[code]?.forEach(async (postOffice) => {
      if (!postOffice.postal_code) return;
      const record = await prisma.postOffice.upsert({
        where: {
          postCode: postOffice.postal_code,
        },
        update: {},
        create: {
          name: postOffice.city || "Unknown",
          postCode: postOffice.postal_code,
          province: postOffice.province || "Unknown",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log("postOffice created... ", record);
    });
  });

  // Post Offices 4
  postOffices4.query?.codes?.forEach(async (code) => {
    postOffices4.results?.[code]?.forEach(async (postOffice) => {
      if (!postOffice.postal_code) return;
      const record = await prisma.postOffice.upsert({
        where: {
          postCode: postOffice.postal_code,
        },
        update: {},
        create: {
          name: postOffice.city || "Unknown",
          postCode: postOffice.postal_code,
          province: postOffice.province || "Unknown",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log("postOffice created... ", record);
    });
  });
}

main()
  .then(() => {
    console.log("seeded");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;

interface PostCodeInfo {
  postal_code?: string;
  country_code?: string;
  latitude?: string;
  longitude?: string;
  city?: string;
  state?: string;
  state_code?: string;
  province?: null;
  province_code?: null;
}
