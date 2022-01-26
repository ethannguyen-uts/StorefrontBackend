import { User, UserStore } from "../../models/user";

const store = new UserStore();
let user: User;
describe("User Model", () => {
  it("create user should create a new user", async () => {
    const result = await store.create({
      id: 20,
      first_name: "ethan",
      last_name: "nguyen",
      password: "123456",
    });
    //Assign result to user to determine user id
    user = result;
    expect({
      first_name: result.first_name,
      last_name: result.last_name,
    }).toEqual({ first_name: "ethan", last_name: "nguyen" });
  });

  it("show should get the user that was created:", async () => {
    const id = user.id as unknown as number;
    const result = await store.show(id);
    expect(result).toEqual({ id, first_name: "ethan", last_name: "nguyen" });
  });

  it("index should get a list of user", async () => {
    const listUser = [];
    const result = await store.index();
    expect(result).toEqual([
      { id: user.id, first_name: "ethan", last_name: "nguyen" },
    ]);
  });

  it("update should the user data based on user id with provided parameters", async () => {
    const currentUserId = user.id as unknown as number;
    const result = await store.update({
      id: currentUserId,
      first_name: "Angie",
      last_name: "Tran",
      password: "123456",
    });
    expect({
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
    }).toEqual({
      id: currentUserId,
      first_name: "Angie",
      last_name: "Tran",
    });
  });

  it("authenticate should return user id when succeed to authenticate", async () => {
    const id = user.id as unknown as number;
    const result = await store.authenticate("Angie", "Tran", "123456");
    expect(result?.id).toEqual(id);
  });

  it("authenticate should return null when failed to authenticate", async () => {
    const id = user.id as unknown as number;
    const result = await store.authenticate(
      //id,
      "Angie",
      "Tran",
      "randompassword"
    );
    expect(result).toEqual(null);
  });

  it("checkExistUser should get the user that exist in the database", async () => {
    const result = await store.checkExistUser("Angie", "Tran");
    expect(result).toEqual(true);
  });
  it("checkExistUser should get the user that does not exist in the database", async () => {
    //user name was changed to Angie Tran
    const result = await store.checkExistUser("ethan", "nguyen");
    expect(result).toEqual(false);
  });
});
