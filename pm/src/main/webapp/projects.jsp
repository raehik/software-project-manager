<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="header.html"%>

<br>
<br>
<div class="container">
	<div class="row">
		<div class="col-md-10 col-md-offset-1">

			<div class="panel panel-raunded panel-table">
				<div class="panel-heading">
					<div class="row">
						<div class="col col-xs-6">
							<h2 class="panel-title">
								<b>sPM Projects</b>
							</h2>
						</div>
						<div class="col col-xs-6 text-right">
							<button id="create-project-button" type="button" class="btn btn-sm btn-primary btn-create"
								data-toggle="modal" data-target="#create-modal">Create
								New</button>
						</div>
					</div>
				</div>
				<div class="panel-body">
					<table class="table table-striped table-bordered table-list" id="projects_table">
						<thead>
							<tr>
								<th class="col-md-2"><em class="fa fa-cog"></em></th>
								<th class="hidden-xs col-md-2">Project</th>
								<th class="hidden-xs col-md-2">Project Manager</th>
								<th class="hidden-xs col-md-4">Developers</th>
							</tr>
						</thead>
						<tbody>
							<tr>
							</tr>
						</tbody>
					</table>

				</div>
			</div>

		</div>
	</div>
</div>

<div class="modal fade" id="create-modal" tabindex="-1" role="dialog"
	aria-labelledby="myModalLabel" aria-hidden="true"
	style="display: none;">
	<div class="modal-dialog">
		<div class="createmodal-container">
			<form id="create_project_form">
				<fieldset>
					<legend>Project name</legend>
					<input id="project_name_create" class="form-control" name="project-name" type="text"
						required autofocus />
				</fieldset>
				
				<fieldset>
					<legend>Developer</legend>
					
					<div class="btn-group">
						<button type="button"
							class="btn btn-default dropdown-toggle form-control"
							data-toggle="dropdown">
							<span id="span-dropdown-developers" data-bind="label">Select
								type</span>&nbsp;<span class="caret"></span>
						</button>
						<ul id="dropdown-developers" class="dropdown-menu" role="menu">

						</ul>
					</div>
				</fieldset>

				<fieldset>
					<legend>Project status</legend>

					<label class="radio-inline"> <input type="radio" id="project_active_create"
						name="radio_create_project" val="active" required>Active
					</label> <label class="radio-inline"> <input type="radio"
						name="radio_create_project" val="completed">Completed
					</label>

				</fieldset>
				
				<button class="btn btn-lg btn-primary btn-block" type="submit">
					Create</button>
			</form>
		</div>
	</div>
</div>

<script src="js/projects.js"></script>
<%@include file="footer.html"%>