(function($){})



var Synchronisation = {

    isReseauActif:function(){
        var status = navigator.onLine;
        if(status)
            return true;
        else
            return false;
    },

    getAdresses : function(matricule,uuid){
        return $.ajax({
            url:'http://constats.dev/api/v1/sync/adresses',
            data:{matricule:matricule,uuid:uuid}
        });

    },
    getAgents: function(matricule,uuid){
        return $.ajax({
            url:'http://constats.dev/api/v1/sync/users',
            data:{matricule:matricule,uuid:uuid}
        });
    },
    getAppareils:function(matricule,uuid){
        return $.ajax({
            url:'http://constats.dev/api/v1/sync/devices',
            data:{matricule:matricule,uuid:uuid}
        });
    },

    addConstat:function(formData){
        $.ajax({
            url:'http://constats.dev/api/v1/constat',
            method:'post',
            data:formData,
            success:function(data){
                console.log(data);
            },
            error:function(error){
                console.log(error);
            }
        })
    }
};

var allAgent;


// Synchronisation des adresses, des agents
// function Sync(){
//     Synchronisation.getAdresses(matAgent1,uuidApp1).done(function(data) {
//         allAdresses = $.parseJSON(data);
//         console.log(allAdresses);
//     }),
//     Synchronisation.getAgents(matAgent1,uuidApp1).done(function(data) {
//         allAgent = $.parseJSON(data);
//         console.log(allAgent);
//
//     })
// }
