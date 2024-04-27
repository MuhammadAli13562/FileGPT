import prisma from "./client";

async function fetch() {
  const users = await prisma.user.create({
    data: {
      email: "a@a.com",
      name: "Ali",
      passwordHash: "asa",
    },
  });

  console.log(users);
}

fetch();
