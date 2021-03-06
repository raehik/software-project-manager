$(document).ready(function() {
    "use strict";
    
    var ENDPOINT_TASKS = "http://localhost:8080/pm/rest/tasks";
    var ENDPOINT_COMMENTS = "http://localhost:8080/pm/rest/comments";
    var DETAIL_PROJECT_URL = "detailProjectDisplay";
    var PROJECT_ID = null;
    
    var tasks_table = $("#tasks-table");
    
    function endpointTask(id){
    	return ENDPOINT_TASKS + "/" + id;
    }
    
    function endpointTasksByProject(id){
    	return ENDPOINT_TASKS + "/project/" + id
    }
    
    
    function createTask(){
    	var projectId = Number(PROJECT_ID);
    	var name = $("#task-name-create").val();
    	var type = $('#span-dropdown-create').text();
    	var date_created = $("#date-created-create").val();
    	var date_assigned = $("#date-assigned-create").val();
    	var date_submitted = $("#date-submitted-create").val();
    	var date_completed = $("#date-completed-create").val();
    	var deadline = $("#deadline-create").val();
    	
    	var developerId = $("#span-dropdown-developers-create").attr("data-developer-id");
    	developerId = Number(developerId);
    	
    	var task = {name: name, type: type, dateCreated: date_created, 
    			dateAssigned: date_assigned, dateSubmitted: date_submitted, dateCompleted: date_completed, deadline: deadline};
    	
    	addTask(task, projectId, developerId);
    	
    	$("#task-name-create").val("");
    	$('#span-dropdown-create').text("");
    	$("#date-created-create").val("");
    	$("#date-assigned-create").val("");
    	$("#date-submitted-create").val("");
    	$("#date-completed-create").val("");
    	$("#deadline-create").val("");
    	$("#dropdown-developers-create").empty();
    }

    function addTask(task, projectId, developerId){
    	var createPromise = $.ajax(ENDPOINT_TASKS + "/" + projectId + "/" + developerId, {
    		method: "POST",
    		contentType: "application/json; charset=utf-8",
    		data: JSON.stringify(task),
    		dataType: "json"
    	}).then(function(response) {
    		displayTasks(PROJECT_ID);
    		return response;
    	});
    }
	
	function getTask(id){
		return $.ajax(endpointTask(id), {
			method: "GET",
			dataType: "json"
		});
	}
	
    function listTasks(project_id) {  
        return $.ajax(endpointTasksByProject(project_id), {
			method: "GET",
			data: {
				projectId: project_id
			},
			dataType: "json"
		});
    }
	
	function clearTable(){
    	tasks_table.children('tbody').empty();
    }

	function addTaskToTable(task){
		var action_column = $("<td align='center'></td>");
		
		var comments_button = $("<button id='comments-task-button' data-toggle='modal' data-target='#comments-modal' class='btn btn-default'></button>");
		comments_button.attr("data-task-id", task.id);
		var em_comment_icon = $("<em class='fa fa-commenting'></em>");
		comments_button.append(em_comment_icon);
		action_column.append(comments_button);
		
		var edit_button = $("<button id='edit-task-button' data-toggle='modal' data-target='#edit-task-modal' class='btn btn-default'></button>");
		var em_edit_icon = $("<em class='fa fa-pencil'></em>");
		edit_button.attr("data-task-id", task.id);
		edit_button.append(em_edit_icon);
		action_column.append(edit_button);
		
		var delete_button = $("<button id='delete-task-button' class='btn btn-danger'></button>");
		delete_button.attr("data-task-id", task.id);
		var em_delete_icon = $("<em class='fa fa-trash'></em>");
		delete_button.append(em_delete_icon);
		action_column.append(delete_button);
		
		tasks_table.children('tbody')
		.append($("<tr></tr>")
		.append(action_column)
		.append($("<td></td>").text(task.name))
		.append($("<td></td>").text(task.type))
		.append($("<td></td>").text(task.developer.user.username))
		.append($("<td></td>").text(task.dateCreated))
		.append($("<td></td>").text(task.dateAssigned))
		.append($("<td></td>").text(task.dateSubmitted))
		.append($("<td></td>").text(task.dateCompleted))
		.append($("<td></td>").text(task.deadline)));
		
	}
	
	function displayTasks(project_id){
	    listTasks(project_id).then(function(response){
	    	clearTable();
	    	
	    	$(response).each(function(index, obj){
	    		addTaskToTable(obj);
	    	});
	    });
	}

    $("#create-task-form").submit(function(e){
    	e.preventDefault();
    	createTask();
    	$("#create-task-modal").modal('hide');
    })
    
    $("#create-task").click(function(){
    	var list_developers = $("#dropdown-developers-create");
        
    	getDevelopers().then(function(response){
    		function addDeveloperToList(developer){
    			var li = $("<li></li>");
    			li.attr("data-developer-id", developer.id);
    				
    			var anchor =$("<a href='#'></a>");
    			anchor.text(developer.user.username);
    			li.append(anchor);

    			list_developers.append(li);
    		}
    		
    		$(response).each(function(index, obj){
	    		addDeveloperToList(obj);
	    	});
    		
    	});
    });
    
    function deleteTask(id){
    	return $.ajax(endpointTask(id), {
            method: "DELETE"
        });
    }

    $(document).on("click", "#delete-task-button", function(){
    	deleteTask($(this).attr("data-task-id")).then(function(response){
    		displayTasks(PROJECT_ID);
    	})
	});
    
    function updateTask(task){
    	getProject(PROJECT_ID).then(function(project){
    		$.ajax(endpointTask(task.id), {
        		method: "PUT",
        		contentType: "application/json; charset=utf-8",
        		data: JSON.stringify({
        			name: task.name,
        			type: task.type,
        			dateCreated: task.dateCreated,
        			dateAssigned: task.dateAssigned,
        			dateSubmitted: task.dateSubmitted,
        			dateCompleted: task.dateCompleted,
        			deadline: task.deadline,
        			developer: task.developer,
        			project: project
        		}),
        		dataType: "json"
        	}).then(function(response) {
        		displayTasks(PROJECT_ID);
        	});
    	})
    }
    
    function getEditedTask(){
    	var name = $("#task-name-edit").val();
    	
    	var type = $('#span-dropdown-edit').text();
    	var date_created = $("#date-created-edit").val();
    	var date_assigned = $("#date-assigned-edit").val();
    	var date_submitted = $("#date-submitted-edit").val();
    	var date_completed = $("#date-completed-edit").val();
    	var deadline = $("#deadline-edit").val();
    	var developer = $("#span-dropdown-developers-edit").attr("data-developer-id");

    	var task = {name: name, type: type, developersId: developer, dateCreated: date_created, dateAssigned: date_assigned, dateSubmitted: date_submitted, dateCompleted: date_completed, deadline: deadline};

    	return task;
    }
    
    function editTask(task){
    	//TODO Developer should be dropdown, not text input field
    	$("#task-name-edit").val(task.name);
    	$('#span-dropdown-edit').text(task.type);
    	$("#date-created-edit").val(task.dateCreated);
    	$("#date-assigned-edit").val(task.dateAssigned);
        $("#date-submitted-edit").val(task.dateSubmitted);
    	$("#date-completed-edit").val(task.dateCompleted);
    	$("#deadline-edit").val(task.deadline);
    	
		var list_developers = $("#dropdown-developers-edit");
		var li = $("<li></li>");
		li.attr("data-developer-id", task.developer.id);
		var anchor =$("<a href='#'></a>");
		anchor.text(task.developer.user.username);
		li.append(anchor);
		list_developers.append(li);
		
		$("#span-dropdown-developers-edit").attr("data-developer-id", task.developer.id);
		$("#span-dropdown-developers-edit").text(task.developer.user.username);
		
    }
    
    $("#edit-task-form").submit(function(e){
		e.preventDefault();
		var new_task = getEditedTask();
		new_task.id = $("#edit-task-button").attr("data-task-id");
		updateTask(new_task);
		
    	$("#task-name-edit").val("");
    	$('#span-dropdown-edit').text("Select type");
    	$("#date-created-edit").val("");
    	$("#date-assigned-edit").val("");
        $("#date-submitted-edit").val("");
    	$("#date-completed-edit").val("");
    	$("#deadline-edit").val("");
    	$("#developer-edit").text("Select dev");
    	$("#dropdown-developers-create").empty();
    	
    	$("#edit-task-modal").modal('hide');
	})
    
    $(document).on("click", "#edit-task-button", function(e){
    	e.preventDefault();
    	var taskId = $(this).attr("data-task-id");
    	getTask(taskId).then(function(response){
    		editTask(response);
    	});
	});
    
    function listTaskComments(task_id) {       
        return $.ajax(ENDPOINT_COMMENTS + '/task/' + task_id, {
			method: "GET",
			dataType: "json"
		});
    }
    
    $(document).on("click", "#comments-task-button", function(e){
    	var taskId = $(this).attr("data-task-id");
    	fillCommentsForTask(taskId);
    })
    
    function fillCommentsForTask(taskId){
    	listTaskComments(taskId).then(function(response){
    		clearComments();
    		
    		$("#comments-modal").attr("data-task-id", taskId);
	    	
	    	$(response).each(function(index, obj){
	    		addCommentToModal(obj);
	    	});
    	})
    }
    
    function clearComments(){
    	$("#comments-row").empty();
    	$("#new-comment-content").val("");
    }
    
    function addCommentToModal(comment){
    	getUser(comment.user.id).then(function(response){
    		
    		$("#comments-row").append("<div class='col-sm-10'> <div class='panel panel-default'> <div class='panel-heading'> <strong>"+comment.user.username+"</strong> <span class='text-muted'>commented on "+comment.date+"</span> </div> <div class='panel-body'>"+comment.content+"</div> </div> </div>")
    	})
    	
    }
    
    function postRequestComment(new_comment){
    	return $.ajax(ENDPOINT_COMMENTS, {
    		method: "POST",
    		contentType: "application/json; charset=utf-8",
    		data: JSON.stringify(new_comment),
    		dataType: "json"
    	})
    }
    
    function addComment(comment_content, taskId){
    	
    	function getCurrentDate(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
            } 
            var today = dd+'/'+mm+'/'+yyyy;
            
            return today;
    	}
    	

    	getTask(taskId).then(function(task){
    		getUser(1).then(function(returned_user){
    			//TODO Get current user posting the comment
    	    	var new_comment = {date: getCurrentDate(), content:comment_content, task: task, user: returned_user};
    	    	postRequestComment(new_comment).then(function(response){
    	    		fillCommentsForTask(task.id)
    	    	});
    		});
    	});
    	
    	
    }
    
    $(document).on("click", "#new-comment-button", function(e){
    	e.preventDefault();
    	
    	var comment_content = $("#new-comment-content").val();
    	var taskId = $("#comments-modal").attr("data-task-id");
    	/*addComment(comment_content, taskId).then(function(){
    		fillCommentsForTask(taskId);
    	});*/
    	
    	addComment(comment_content, taskId);
    	
    });
    
    function getProjectIdFromURL(){
    	
    	if(window.location.href.indexOf(DETAIL_PROJECT_URL) != -1)
    		return window.location.href.substr(window.location.href.indexOf(DETAIL_PROJECT_URL)+DETAIL_PROJECT_URL.length +1)
    	return null
    }
    
    function handleDetailedProject(){
    	PROJECT_ID = getProjectIdFromURL();
    	if(PROJECT_ID != null)
    		displayTasks(PROJECT_ID);
    }
    
    handleDetailedProject();
    
    /* DROPDOWN */
    
    $(document.body).on('click', '#dropdown-create li', function(event) {

        var $target = $(event.currentTarget);

        $target.closest('.btn-group')
           .find('[data-bind="label"]').text($target.text())
           .end()
           .children('.dropdown-toggle').dropdown('toggle');

        return false;

     });
    
    /* DROPDOWN */
    
    $(document.body).on('click', '#dropdown-edit li', function(event) {

        var $target = $(event.currentTarget);

        $target.closest('.btn-group')
           .find('[data-bind="label"]').text($target.text())
           .end()
           .children('.dropdown-toggle').dropdown('toggle');

        return false;

     });

    /* DROPDOWN */
    
    $(document.body).on('click', '#dropdown-developers-create li', function(event) {

        var $target = $(event.currentTarget);
        $target.closest('.btn-group')
           .find('[data-bind="label"]').text($target.text())
           .attr("data-developer-id", $target.attr("data-developer-id"))
           .end()
           .children('.dropdown-toggle').dropdown('toggle');

        return false;

     });
    
    /* DROPDOWN */
    
    $(document.body).on('click', '#dropdown-developers-edit li', function(event) {

        var $target = $(event.currentTarget);
        $target.closest('.btn-group')
           .find('[data-bind="label"]').text($target.text())
           .attr("data-developer-id", $target.attr("data-developer-id"))
           .end()
           .children('.dropdown-toggle').dropdown('toggle');

        return false;

     });
});