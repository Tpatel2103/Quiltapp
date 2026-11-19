import { ObjectId } from "mongodb";
import { getDB } from "./connection.js";

const users = () => getDB().collection("users");

export async function findUserByUsername(username) {
  return users().findOne({ username: String(username).toLowerCase() });
}

// Ken Yong Code Review: Noticed that you are using MongoDB projection here to exclude the password hash
// and salt when retrieving a user.
// This helps prevent sensitive authentication data from being returned when it is not needed.
// Good job on thinking about the data privacy!

export async function findUserById(id) {
  if (!ObjectId.isValid(id)) return null;
  return users().findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0, salt: 0 } },
  );
}

export async function createUser({
  username,
  displayName,
  passwordHash,
  salt,
}) {
  const doc = {
    username: username.toLowerCase(),
    displayName,
    passwordHash,
    salt,
    createdAt: new Date(),
  };
  const result = await users().insertOne(doc);
  return {
    _id: result.insertedId,
    username: doc.username,
    displayName: doc.displayName,
  };
}
