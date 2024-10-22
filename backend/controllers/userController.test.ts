// userController.test.ts
import { app } from "../src/server"; // Import your express app
import request from "supertest";
import { getXataClient } from "../src/xata";
import bcrypt from "bcrypt";
import * as xata from "../src/xata";

// registerUser
jest.mock("../src/xata");
jest.mock("bcrypt");

describe("Auth Controller - Register User", () => {
  it("should register a user successfully", async () => {
    const fakeUser = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };
    const hashedPassword = await bcrypt.hash(fakeUser.password, 10);
    (getXataClient as jest.Mock).mockReturnValue({
      db: {
        users: {
          filter: jest.fn().mockResolvedValueOnce(null),
          create: jest.fn().mockResolvedValue({
            ...fakeUser,
            password: hashedPassword,
            userId: 12345,
          }),
        },
      },
    });

    const response = await request(app).post("/register").send(fakeUser);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("userId");
  });
});

//loginUser

describe("Auth Controller - Login User", () => {
  it("should log in a user successfully", async () => {
    const fakeUser = { email: "test@example.com", password: "password123" };
    const hashedPassword = await bcrypt.hash(fakeUser.password, 10);
    (getXataClient as jest.Mock).mockReturnValue({
      db: {
        users: {
          filter: jest.fn().mockResolvedValueOnce({
            ...fakeUser,
            password: hashedPassword,
          }),
        },
      },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const response = await request(app).post("/login").send(fakeUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
function newFunction() {
  jest.mock("../src/xata");
}
