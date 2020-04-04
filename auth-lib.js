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

// Удаляет пользователя user
function deleteUser(user) {
     //throw new Error('Message'); 
    //!! - хорошее значение
    //! - плохое значение
    if(!user)
    {
        throw Error('Передано неверное значение');     
    }

    if(allUsers.indexOf(user)<0) //===-1
    {
        throw Error('Такой пользователь уже удален');    
    }
    allUsers.splice(allUsers.indexOf(user),1);
}

// Возвращает массив групп, к которым принадлежит пользователь user
function userGroups(user) {
    if(!user)
    {
        throw Error('Передано неверное значение');     
    }
    let index = allUsers.indexOf(user);
    if(index<0) //===-1
    {
        throw Error('Такой пользователь уже удален');    
    }
    return allUsers[index].groups;
}

// Добавляет пользователя user в группу group
function addUserToGroup(user, group) {
    //debugger;
    //console.log(user);
    //console.log(group);
    if(!user)
    {
        throw Error('Передано неверное значение пользователя');     
    }
    
    if(!group)
    {
        throw Error('Передано неверное значение группы');     
    }
    if(allGroups.indexOf(group)<0)
    {
        throw Error('Такой группы не существует');
    }
    let indexes = [];
    if(Array.isArray(user))
    {
        //user.forEach(u=> allUsers[allUsers.indexOf(user)].groups.push(group));
        user.forEach(u=>{
            indexes.push(allUsers.indexOf(u));
        if (indexes[indexes.length-1] < 0) //===-1
        {
            throw Error('Такого пользователя не существует');
        }
        }
         );
         indexes.forEach(index=>allUsers[index].groups.push(group));
    }   
    else
    {
        let index = allUsers.indexOf(user);
        if (index < 0) //===-1
        {
            throw Error('Такого пользователя не существует');
        }
        allUsers[index].groups.push(group);
    }
}

// Удаляет пользователя user из группы group. Должна бросить исключение, если пользователя user нет в группе group
function removeUserFromGroup(user, group) {
    if(!user)
    {
        throw Error('Передано неверное значение пользователя');     
    }
    let indexUser = allUsers.indexOf(user);
    if(indexUser<0) //===-1
    {
        throw Error('Такой пользователь уже удален');    
    }
    if(!group)
    {
        throw Error('Передано неверное значение группы');     
    }
    let indexGroup = allGroups.indexOf(group);
    if(indexGroup<0)
    {
        throw Error('Такой группы не существует');
    }
    indexGroup = allUsers[indexUser].groups.indexOf(group);
    if(indexGroup<0)
    {
        throw Error('Такого пользователя нет в данной группе');
    }
    allUsers[indexUser].groups.splice(indexGroup,1);
   
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
    if(!right)
    {
        throw Error('Передано неверное значение права');     
    }
    if(allRights.indexOf(right)<0)
    {
        throw Error('Такого права не существует');
    }
    allGroups.forEach(group=>group.rights.indexOf(right)<0? {} : group.rights.splice(group.rights.indexOf(right),1));
    allRights.splice(allRights.indexOf(right),1);
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
    if(!group)
    {
        throw Error('Передано неверное значение группы');     
    }
    if(allGroups.indexOf(group)<0)
    {
        throw Error('Такой группы не существует');
    }
    allUsers.forEach(user=>user.groups.indexOf(group)<0?{ } : user.groups.splice(user.groups.indexOf(group),1));
    allGroups.splice(allGroups.indexOf(group),1);
}

// Возвращает массив прав, которые принадлежат группе group
function groupRights(group) {
    return allGroups[allGroups.indexOf(group)].rights;
}

// Добавляет право right к группе group
function addRightToGroup(right,group) {
    if(!right)
    {
        throw Error('Передано неверное значение права');     
    }
    if(allRights.indexOf(right)<0)
    {
        throw Error('Такого права не существует');
    }
    if(!group)
    {
        throw Error('Передано неверное значение группы');     
    }
    if(allGroups.indexOf(group)<0)
    {
        throw Error('Такой группы не существует');
    }
    allGroups[allGroups.indexOf(group)].rights.push(right);
}

// Удаляет право right из группы group. Должна бросить исключение, если права right нет в группе group
function removeRightFromGroup(right, group) {
    if(!group)
    {
        throw Error('Передано неверное значение группы');     
    }
    let indexGroup = allGroups.indexOf(group);
    if(indexGroup<0)
    {
        throw Error('Такой группы не существует');
    }
    if(!right)
    {
        throw Error('Передано неверное значение права');     
    }
    let indexRight = allRights.indexOf(right);
    if(indexRight<0)
    {
        throw Error('Такого права не существует');
    }
    indexRight = allGroups[indexGroup].rights.indexOf(right);
    if(indexRight<0)
    {
        throw Error('Такого права не существует в данной группе');
    }
    allGroups[indexGroup].rights.splice(indexRight,1);
}

function login(username, password) {}

function currentUser() {}

function logout() {}

function isAuthorized(user, right) {}
