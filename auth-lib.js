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
    allUsers.push({name: name, password: password,groups:[]});
    return allUsers[allUsers.length-1];
}

function CheckBadData(value,array,name)
{
    if(!value)
    {
        throw Error(name+" is bad value");     
    }
    if(array===undefined)
    {
        return;
    }
    let indexValue = array.indexOf(value);
    if(indexValue<0)
    {
        throw Error("This value of "+name+" has already been deleted"); 
    }
    return indexValue;
}

// Удаляет пользователя user
function deleteUser(user) {
    let userIndex = CheckBadData(user,allUsers,'user');
    allUsers.splice(userIndex,1);
}

// Возвращает массив групп, к которым принадлежит пользователь user
function userGroups(user) {
    let userIndex = CheckBadData(user,allUsers,'user');
    return allUsers[userIndex].groups;
}

// Добавляет пользователя user в группу group
function addUserToGroup(user, group) {
    let userIndex = CheckBadData(user,allUsers,'user');    
    let groupIndex = CheckBadData(group,allGroups,'group');
    allUsers[userIndex].groups.push(group);
}

// Удаляет пользователя user из группы group. Должна бросить исключение, если пользователя user нет в группе group
function removeUserFromGroup(user, group) {
    let userIndex = CheckBadData(user,allUsers,'user');    
    let groupIndex = CheckBadData(group,allGroups,'group');
    groupIndex = allUsers[userIndex].groups.indexOf(group);
    if(groupIndex<0)
    {
        throw Error('User doesnt exist in group');
    }
    allUsers[userIndex].groups.splice(groupIndex,1);

}

// Возвращает массив прав
function rights() { 
    return allRights;
}

// Создает новое право с именем name и возвращает его
function createRight(name) {
    allRights.push(name);
    return allRights[allRights.length-1];
}

// Удаляет право right
function deleteRight(right) {
    let rightIndex = CheckBadData(right,allRights,'right');  
    for(i=0;i<allGroups.length;i++)
    {
        var index = allGroups[i].rights.indexOf(right);
        if(index>=0)
        allGroups[i].rights.splice(index,1);
    }  
    //allGroups.forEach(group=>group.rights.indexOf(right)<0? {} : group.rights.splice(group.rights.indexOf(right),1));
    allRights.splice(rightIndex,1);
}

// Возвращает массив групп
function groups() {
    return allGroups;
}

// Создает новую группу и возвращает её.
function createGroup(name) {
    allGroups.push({name: name, rights:[]});
    return allGroups[allGroups.length-1];
}

// Удаляет группу group
function deleteGroup(group) {
    let groupIndex = CheckBadData(group,allGroups,'group');
    for(i=0;i<allUsers.length;i++)
    {
        var index = allUsers[i].groups.indexOf(group);
        if(index>=0)
            allUsers[i].groups.splice(index,1);
    }  
    //allUsers.forEach(user=>user.groups.indexOf(group)<0?{ } : user.groups.splice(user.groups.indexOf(group),1));
    allGroups.splice(groupIndex,1);
}

// Возвращает массив прав, которые принадлежат группе group
function groupRights(group) {
    return allGroups[allGroups.indexOf(group)].rights;
}

// Добавляет право right к группе group
function addRightToGroup(right,group) {
    let rightIndex = CheckBadData(right,allRights,'right');    
    let groupIndex = CheckBadData(group,allGroups,'group');
    allGroups[groupIndex].rights.push(right);
}

// Удаляет право right из группы group. Должна бросить исключение, если права right нет в группе group
function removeRightFromGroup(right, group) {
    let groupIndex = CheckBadData(group,allGroups,'group');
    let rightIndex = CheckBadData(right,allRights,'right');    
    rightIndex = allGroups[groupIndex].rights.indexOf(right);
    if(rightIndex<0)
    {
        throw Error('Right doesnt exist in group');
    }
    allGroups[groupIndex].rights.splice(rightIndex,1);
}
let sessionUser;
function login(username, password) {
    if(sessionUser)
    return false;
CheckBadData(username,undefined,'username');
CheckBadData(password,undefined,'password');
for(i=0;i<allUsers.length;i++)
    if(allUsers[i].name===username && allUsers[i].password===password) {sessionUser = allUsers[i]; return true;}
sessionUser = undefined;
return false;
}

function currentUser() {
    return sessionUser;
}

function logout() {
    sessionUser=undefined;
}

function isAuthorized(user, right) {
    var indexUser = CheckBadData(user,allUsers,'user');
    var indexRight = CheckBadData(right,allRights,'right');
    let UserRight=false;
   for(i=0;i<user.groups.length;i++)
        if(user.groups[i].rights.indexOf(right)>=0)
            return true;
    return false;
}
