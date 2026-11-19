// helpRequests collection — owned by Heta Vimaleshkumar Patel
import { ObjectId } from "mongodb";
import { getDB } from "./connection.js";
import { PAGE_SIZE } from "../utils/constants.js";
import { escapeRegex } from "../utils/query.js";

const requests = () => getDB().collection("helpRequests");
const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// Contact notes are only shared with the requester and the helper.
const PUBLIC_PROJECTION = { contactNote: 0 };

const SORTS = {
  urgency: { urgencyRank: -1, neededBy: 1 },
  neededBy: { neededBy: 1 },
  newest: { createdAt: -1 },
};

export async function listOpenRequests({ search, category, area, sort, page }) {
  const filter = { status: "open" };
  if (category) filter.category = category;
  if (area) filter.area = area;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  const [items, total] = await Promise.all([
    requests()
      .find(filter, { projection: PUBLIC_PROJECTION })
      .sort(SORTS[sort] || SORTS.urgency)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    requests().countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function listRequestsByRequester(userId, statuses) {
  return requests()
    .find({ "requester._id": userId, status: { $in: statuses } })
    .sort({ updatedAt: -1 })
    .limit(200)
    .toArray();
}

export async function listRequestsByHelper(userId) {
  return requests()
    .find({ "helper._id": userId })
    .sort({ updatedAt: -1 })
    .limit(200)
    .toArray();
}

export async function getRequestById(id) {
  const _id = toObjectId(id);
  return _id ? requests().findOne({ _id }) : null;
}

export async function createRequest(data, user) {
  const now = new Date();
  const doc = {
    ...data,
    status: "open",
    requester: { _id: user._id, displayName: user.displayName },
    helper: null,
    rating: null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await requests().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function updateRequest(id, data) {
  return requests().findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function deleteRequest(id) {
  const result = await requests().deleteOne({ _id: toObjectId(id) });
  return result.deletedCount === 1;
}

// Ken Yong Code Review:
// This is awesome! I like that the helper assignment checks status: "open" and helper: null as part of the findOneAndUpdate query.
// This makes the claim operation atomic and helps prevent two users from claiming the same request at the same time.

// Atomic: only succeeds while the request is still open and has no helper,
// so two people can't both claim the same request.
export async function assignHelper(id, user) {
  return requests().findOneAndUpdate(
    {
      _id: toObjectId(id),
      status: "open",
      helper: null,
      "requester._id": { $ne: user._id },
    },
    {
      $set: {
        helper: { _id: user._id, displayName: user.displayName },
        status: "in progress",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
}

export async function updateStatus(id, status) {
  const update = { status, updatedAt: new Date() };
  // Reopening a request releases the current helper.
  if (status === "open") update.helper = null;
  return requests().findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: update },
    { returnDocument: "after" },
  );
}

export async function addRating(id, rating) {
  return requests().findOneAndUpdate(
    {
      _id: toObjectId(id),
      status: "completed",
      helper: { $ne: null },
      rating: null,
    },
    { $set: { rating, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}
