const idToUser = new Map();

async function setUser(id,user){
    idToUser.set(id,user);
}

async function getUser(id) {
    return idToUser.get(id);
}

module.exports = {setUser , getUser};