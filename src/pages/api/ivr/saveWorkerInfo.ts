import { faker } from "@faker-js/faker";
import type { Worker } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

interface IVRData {
  nid: string;
  phone: string;
  postCode: string;
  prof1: string; // profession 1 digit code
  prof2: string; // profession 2 digit code
}

type WorkerData = Omit<Worker, "id" | "createdAt" | "updatedAt">;

const getAddressFromPostCode = async (postCode: string) => {
  const url = `https://app.zipcodebase.com/api/v1/search?apikey=${process.env.ZIPCODEBASE_API_KEY}&codes=${postCode}&country=bd`;
  const result = await fetch(url);
  const data = await result.json();

  // console.log(data.results[postCode]);
  const postOfficeName = data.results[postCode][0].city || "Unknown";
  // check if post code exists. Create one if not
  const postOfficeExists = await prisma.postOffice.findUnique({
    where: {
      postCode: postCode,
    },
  });
  if (postOfficeExists) {
    const address = await prisma.address.create({
      data: {
        postOfficeId: postOfficeExists.id,
      },
    });
    return address;
  }

  const postOffice = await prisma.postOffice.create({
    data: {
      name: postOfficeName,
      postCode: postCode,
    },
  });
  const address = await prisma.address.create({
    data: {
      postOfficeId: postOffice.id,
    },
  });
  return address;
};

const getInfoFromNID = async (ivrData: IVRData) => {
  // Get the address from the post code
  const address = await getAddressFromPostCode(ivrData.postCode);

  let workerData: WorkerData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number({ min: 18, max: 60 }),
    gender: "Male",
    phone: ivrData.phone,
    NID: ivrData.nid,
    addressId: address.id,
    imageUrl: faker.image.avatar(),
    verified: false,
  };

  return workerData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the data from josn from the request body
  const ivrData = req.body as IVRData;
  console.log("NID " + ivrData.nid);
  console.log("Phone " + ivrData.phone);
  console.log("PostCode " + ivrData.postCode);
  console.log("prof 1 " + ivrData.prof1);
  console.log("prof 2 " + ivrData.prof2);

  try {
    const worker = await getInfoFromNID(ivrData);

    await prisma.worker.create({
      data: worker,
    });
  } catch (error) {
    console.log("🚀 ~ file: saveWorkerInfo.ts:75 ~ error", error);
    res.status(500).json({ message: error });
    return;
  }

  res.status(200).json({ message: "Success" });
}
