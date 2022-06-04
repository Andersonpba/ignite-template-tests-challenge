import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;

let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show a user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Name",
      email:  "username@email.com",
      password: "UserPassword",
    });

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result).toBe(user)
  });

  it("Should not be able to show a non existent user", async () => {
    await expect(
      showUserProfileUseCase.execute("False_Id")
    ).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
