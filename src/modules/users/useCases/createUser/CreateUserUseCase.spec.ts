import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe ("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  });

  it("should be able to create new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email:  "username@email.com",
      password: "UserPassword",
    });

    expect(user).toHaveProperty("id")
  });

  it("should not be able to create a user with same email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User1",
        email: "user@email.com",
        password: "Password"
      });
      await createUserUseCase.execute({
        name: "User1",
        email: "user@email.com",
        password: "Password"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
