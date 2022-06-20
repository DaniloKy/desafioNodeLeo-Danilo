class Groups{
    name;
    
    #admin;
    members = [];
    MAX_MEMBERS = 10;

    constructor(con, name){
        this.members.length = this.MAX_MEMBERS;
        this.#admin = con;
        this.name = name;
        this.attachMember(con);
    }

    attachMember(con){
        if(this.verivyAdmin(con) && this.validateUsers()){
            this.members.push(con);
            console.log(con.name+" joined the group.");
        }
    }

    detachMember(con){
        if(this.validateUsers()){
            this.members.splice(this.members.indexOf(con),1);
            console.log(con.name+" left the group.");
        }
    }

    quit(con){
        if(verivyAdmin(con) && this.validateUsers()){
            this.detachMember(con);
            console.log("Member "+con.name+" was kicked out.");
            return;
        }
        return;
    }

    validateUsers(){
        if(!this.members.length > 0 && !this.members.length <= this.MAX_MEMBERS)
            return false;
        return true;
    }

    verivyAdmin(con){
        if(con != this.#admin)
            return false;
        return true;
    }

    gName(name){
        this.name = name;
    }

}