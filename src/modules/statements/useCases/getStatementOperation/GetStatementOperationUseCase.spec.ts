import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email:  "username@email.com",
      password: "UserPassword",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 4321,
      description: "Deposit"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 4321,
      description: "Withdraw"
    })

    const balance = await getStatementOperationUseCase.execute({ statement_id: deposit.id as string, user_id: user.id as string});

    console.log(balance)
    expect(balance).toHaveProperty("id");
  });

  it("Should not be able to get statement to a non existent user", () => {
    expect(async() => {
      await getStatementOperationUseCase.execute({
        user_id: "false_id",
        statement_id: "any_id"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("Should not be able to get statement to a non existent statement", () => {
    expect(async() => {

      const user = await createUserUseCase.execute({
        name: "User Name",
        email:  "username@email.com",
        password: "UserPassword",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "false_id"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
});
