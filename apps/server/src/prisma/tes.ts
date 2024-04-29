import prisma from "./client";

async function fetch() {
  await prisma.user.create({
    data: {
      email: "a@a.com",
      name: "Muhammad Ali",
      passwordHash: "aaa",
    },
  });
}

fetch();
