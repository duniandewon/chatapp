let users = [];

const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users = [...users, user];

  return user;
};

const getCurrentUser = (id) => users.find((user) => user.id === id);

const userLeave = (id) => {
  users = users.filter((user) => user.id !== id);
};

const getRoomUsers = (room) => users.filter((user) => user.room === room);

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
