import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to deposit a amount", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email:  "username@email.com",
      password: "UserPassword",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 4321,
      description: "Payment"
    });

    expect(deposit).toHaveProperty("id");
  });

  it("Should be able do withdraw a amount", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email:  "username@email.com",
      password: "UserPassword",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 4321,
      description: "Deposit"
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 4000,
      description: "Withdraw"
    });

    expect(withdraw).toHaveProperty("id")
  });

  it("Should not be able to deposit a amount to non existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "False User",
        type: OperationType.DEPOSIT,
        amount: 4321,
        description: "Payment"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to withdraw a amount with insufficient funds", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User Name",
        email:  "username@email.com",
        password: "UserPassword",
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 4321,
        description: "Withdraw"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
});
