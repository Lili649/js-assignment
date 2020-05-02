//Пользователи
let allUsers = [
	/*{name: "admin", password: "1234", groups: ["admin", "manager", "basic"]},
	{name: "sobakajozhec", password: "ekh228", groups: ["basic", "manager"]},
	{name: "patriot007", password: "russiaFTW", groups: ["basic"]}*/
];


let allGroups = [
	/*{name:"admin", rights:[2]},
    {name:"manager", rights:[0]},
    {name:"basic", rights:[1,3]}*/
]

let allRights = [
    //"manage content", "play games", "delete users", "view site"
];

// Возвращает массив всех пользователей.
function users() { return allUsers; }


//Создает нового пользователя с указанным логином username и паролем password, возвращает созданного пользователя.
function createUser(name, password) {
    allUsers.push({ name: name, password: password, groups: [] });
    return allUsers[allUsers.length - 1];
}

function CheckBadData(value, array, name) {
    if (!value) {
        throw Error(name + " is bad value");
    }
    if (array === undefined) {
        return;
    }
    let indexValue = array.indexOf(value);
    if (indexValue < 0) {
        throw Error("This value of " + name + " has already been deleted");
    }
    return indexValue;
}

// Удаляет пользователя user
function deleteUser(user) {
    let userIndex = CheckBadData(user, allUsers, 'user');
    allUsers.splice(userIndex, 1);
}

// Возвращает массив групп, к которым принадлежит пользователь user
function userGroups(user) {
    let userIndex = CheckBadData(user, allUsers, 'user');
    return allUsers[userIndex].groups;
}

// Добавляет пользователя user в группу group
function addUserToGroup(user, group) {
    let userIndex = CheckBadData(user, allUsers, 'user');
    let groupIndex = CheckBadData(group, allGroups, 'group');
    allUsers[userIndex].groups.push(group);
}

// Удаляет пользователя user из группы group. Должна бросить исключение, если пользователя user нет в группе group
function removeUserFromGroup(user, group) {
    let userIndex = CheckBadData(user, allUsers, 'user');
    let groupIndex = CheckBadData(group, allGroups, 'group');
    groupIndex = allUsers[userIndex].groups.indexOf(group);
    if (groupIndex < 0) {
        throw Error('User doesnt exist in group');
    }
    allUsers[userIndex].groups.splice(groupIndex, 1);

}

// Возвращает массив прав
function rights() {
    return allRights;
}

// Создает новое право с именем name и возвращает его
function createRight(name) {
    allRights.push(name);
    return allRights[allRights.length - 1];
}

// Удаляет право right
function deleteRight(right) {
    let rightIndex = CheckBadData(right, allRights, 'right');
    for (i = 0; i < allGroups.length; i++) {
        var index = allGroups[i].rights.indexOf(right);
        if (index >= 0)
            allGroups[i].rights.splice(index, 1);
    }
    allRights.splice(rightIndex, 1);
}

// Возвращает массив групп
function groups() {
    return allGroups;
}

// Создает новую группу и возвращает её.
function createGroup(name) {
    allGroups.push({ name: name, rights: [] });
    return allGroups[allGroups.length - 1];
}

// Удаляет группу group
function deleteGroup(group) {
    let groupIndex = CheckBadData(group, allGroups, 'group');
    for (i = 0; i < allUsers.length; i++) {
        var index = allUsers[i].groups.indexOf(group);
        if (index >= 0)
            allUsers[i].groups.splice(index, 1);
    }
    allGroups.splice(groupIndex, 1);
}

// Возвращает массив прав, которые принадлежат группе group
function groupRights(group) {
    return allGroups[allGroups.indexOf(group)].rights;
}

// Добавляет право right к группе group
function addRightToGroup(right, group) {
    let rightIndex = CheckBadData(right, allRights, 'right');
    let groupIndex = CheckBadData(group, allGroups, 'group');
    allGroups[groupIndex].rights.push(right);
}

// Удаляет право right из группы group. Должна бросить исключение, если права right нет в группе group
function removeRightFromGroup(right, group) {
    let groupIndex = CheckBadData(group, allGroups, 'group');
    let rightIndex = CheckBadData(right, allRights, 'right');
    rightIndex = allGroups[groupIndex].rights.indexOf(right);
    if (rightIndex < 0) {
        throw Error('Right doesnt exist in group');
    }
    allGroups[groupIndex].rights.splice(rightIndex, 1);
}
let sessionUsers = [];
function login(username, password) {
    if (!!sessionUsers.length)
        return false;
    for (i = 0; i < allUsers.length; i++)
        if (allUsers[i].name === username && allUsers[i].password === password) 
        { 
            sessionUsers.push(allUsers[i]);
             return true;
        }
    return false;
}

function currentUser() {
    if (!!sessionUsers.length)
        return sessionUsers[sessionUsers.length - 1];
    else return undefined;
}

function logout() {
    if (!!sessionUsers.length) {
        sessionUsers.splice(sessionUsers.length - 1, 1);
    }
    else throw Error("Can't logout: current user undefined")
}

function isAuthorized(user, right) {
    var indexUser = CheckBadData(user, allUsers, 'user');
    var indexRight = CheckBadData(right, allRights, 'right');
    for (i = 0; i < user.groups.length; i++)
        if (user.groups[i].rights.indexOf(right) >= 0)
            return true;
    return false;
}
//Вызов функции loginAs должен эмулировать аутентификацию от имени другого пользователя. 
//Доступ к функии loginAs должны иметь только члены привелигированной группы (например: администраторы и тестировщики). 
//После вызова функии loginAs вызов функции logout должен прекратить эмуляцию (вместо закрытия текущей сессии).
function loginAs(user) {
    let userIndex = CheckBadData(user, allUsers, "user");
    if (!currentUser()) throw Error("Can't loginAS: current user undefined")
    var loginAsRight = allRights[allRights.indexOf("loginAs")];
    if (isAuthorized(currentUser(), loginAsRight))
        sessionUsers.push(user);
    else throw Error("User haven't got  rights for loginAs");
}

function securityWrapper(action,right)
{
    allListeners.forEach(listener => {
            listener(currentUser(),action);
    });
if (!currentUser()) return undefined;
    if (isAuthorized(currentUser(),right)) {
        return action;
    }
    return function(){};
}

allListeners = [];
function addActionListener(listener)
{
    allListeners.push(listener);
}

addActionListener(function(user, action) { 
    console.log("Пользователь " + user.name + " только что сделал " + action.name); 
});
addActionListener(function(user, action) { 
    alert("Пользователь " + user.name + " только что сделал " + action.name); 
});

//действия в системе

let rightC = createRight("create");
let rightR = createRight("read");
let rightU = createRight("update");
let rightD = createRight("delete");


let groupAdmins =  createGroup("admins");

addRightToGroup(rightC,groupAdmins);
addRightToGroup(rightR,groupAdmins);
addRightToGroup(rightU,groupAdmins);
addRightToGroup(rightD,groupAdmins);

console.log(groupRights(groupAdmins));

removeRightFromGroup(rightU,groupAdmins);

console.log(groupRights(groupAdmins));

groupTesters = createGroup("testers");

addRightToGroup(rightR,groupTesters);
addRightToGroup(rightU,groupTesters);
addRightToGroup(rightD,groupTesters);

deleteRight(rightD);

console.log(groupRights(groupAdmins));
console.log(groupRights(groupTesters));

let user1 = createUser("user1","password1");
console.log(user1)
let group1 = createGroup("group1");
let group2 = createGroup("group2");
addUserToGroup(user1,group1);
addUserToGroup(user1,group2);
console.log(user1);
removeUserFromGroup(user1,group1);
console.log(user1);
deleteUser(user1);
deleteGroup(group1);
deleteGroup(group2);

let rightLoginAs = createRight("loginAs");
addRightToGroup(rightLoginAs,groupAdmins);
addRightToGroup(rightLoginAs,groupTesters);

let groupGuest = createGroup("guests");
addRightToGroup(rightR,groupGuest);

let userAdmin = createUser("admin","admin")
addUserToGroup(userAdmin,groupAdmins);

let userTestes = createUser("test","test")
addUserToGroup(userTestes,groupTesters);

let userGuest = createUser("guest");
addUserToGroup(userGuest,groupGuest);


login("guest");
console.log(currentUser()) //guest
//loginAs(userTestes); //User haven't got  rights for loginAs
console.log(login("admin","admin")) //false
console.log(currentUser()) //guest
logout();
console.log(currentUser()) //undefined

var counter = 0;
function increaseCounter(amount) { counter += amount };



login("test")
console.log(currentUser()) //undefined

login("test","test")
console.log(currentUser()) //test
loginAs(userAdmin);
console.log(currentUser()) //admin
let secureIncreaseCounter = securityWrapper(increaseCounter, rightC);
secureIncreaseCounter(1);
console.log(counter);//1
console.log(isAuthorized(currentUser(),rightC)); //true
console.log(isAuthorized(currentUser(),rightU)); //false
logout();

console.log(currentUser()) 
secureIncreaseCounter = securityWrapper(increaseCounter, rightC);
secureIncreaseCounter(1);
console.log(counter);//1
console.log(isAuthorized(currentUser(),rightU)); //true
logout();
//logout //Can't logout: current user undefined
