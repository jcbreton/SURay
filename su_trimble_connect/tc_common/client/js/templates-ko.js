if("undefined"==typeof SketchUpTemplates)var SketchUpTemplates={};SketchUpTemplates.modelTitleInput=function(a,b){return'<div class="model-title-input-container"><input class="model-title-input" placeholder="Enter a model name here"/></div>'};goog.DEBUG&&(SketchUpTemplates.modelTitleInput.soyTemplateName="SketchUpTemplates.modelTitleInput");SketchUpTemplates.progressDialog=function(a,b){return'<div class="progress-dialog-div"><progress class="progress-dialog-progress-bar" max="100" value="0"/></div>'};
goog.DEBUG&&(SketchUpTemplates.progressDialog.soyTemplateName="SketchUpTemplates.progressDialog");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});SketchUpTemplates.leftSidebar=function(a,b){return'<div class="left-sidebar"><div class="left-tab close-tab"><img src="images/tb_left_arrow.svg" title="\uce21\uba74 \ub9c9\ub300 \uc228\uae30\uae30 (Esc)" /></div><div class="hidden-while-not-expanded"><div class="left-tab user-account-tab" title="\uc0ac\uc6a9\uc790 \uc815\ubcf4"><img src="images/tb_user_default.svg" /></div><div class="left-tab new-model-tab" title="\ud15c\ud50c\ub9bf\uc5d0\uc11c \uc0c8 \ubaa8\ub378 \ub9cc\ub4e4\uae30"><img src="images/tb_new_web.svg" /></div><div class="left-tab connect-tab selected-left-tab" title="Trimble Connect\uc5d0\uc11c \ubaa8\ub378 \uc5f4\uae30"><img src="images/tb_ConnectIconMono.svg" /></div><div class="left-tab geolocation-tab" title="\uc704\uce58 \ucd94\uac00"><img src="images/tb_geolocation.svg" /></div><div class="left-tab modelinfo-tab" title="\ubaa8\ub378 \uc815\ubcf4"><img src="images/tb_modelinfo.svg" /></div></div><div id="left-sidebar-toolbar"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebar.soyTemplateName="SketchUpTemplates.leftSidebar");SketchUpTemplates.leftSidebarConnectTab=function(a,b){return'<div class="left-sidebar-container"><div class="trimble-connect-header"><img src="images/trimble_connect_logo_and_text.png" /><div class="upgrade-account-link invisible">\uacc4\uc815 \uc5c5\uadf8\ub808\uc774\ub4dc</div></div><div class="trimble-connect-content"></div><div class="save-new-model-container invisible"><div class="name-label">\uc774\ub984:</div><input class="save-new-model-input" placeholder="Enter a model name here"/><div class="save-here-button disabled-button">\ubaa8\ub378 \uac8c\uc2dc</div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarConnectTab.soyTemplateName="SketchUpTemplates.leftSidebarConnectTab");
SketchUpTemplates.leftSidebarUserAccountTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="user-account-content"><div class="login-content"><div class="login-picture-container">'+(a.loginInfo.image?'<img class="login-picture" src="'+soy.$$escapeHtml(a.loginInfo.image)+'" />':'<img class="login-picture blank-profile-image" src="images/tb_generic_user_picture.svg" />')+'</div><div class="login-name-container"><div class="login-firstname">'+soy.$$escapeHtml(a.loginInfo.firstname)+
" "+soy.$$escapeHtml(a.loginInfo.lastname)+'</div><div class="login-email">'+soy.$$escapeHtml(a.loginInfo.email)+'</div><div class="logout-button">\ub85c\uadf8\uc544\uc6c3</div></div></div></div></div>'};goog.DEBUG&&(SketchUpTemplates.leftSidebarUserAccountTab.soyTemplateName="SketchUpTemplates.leftSidebarUserAccountTab");SketchUpTemplates.leftSidebarNewModelTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="new-model-content"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarNewModelTab.soyTemplateName="SketchUpTemplates.leftSidebarNewModelTab");SketchUpTemplates.leftSidebarGeolocationTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="geolocation-content">'+SketchUpTemplates.loadingGif(null)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.leftSidebarGeolocationTab.soyTemplateName="SketchUpTemplates.leftSidebarGeolocationTab");SketchUpTemplates.leftSidebarModelInfoTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="modelinfo-content"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarModelInfoTab.soyTemplateName="SketchUpTemplates.leftSidebarModelInfoTab");
SketchUpTemplates.projectInstance=function(a,b){return'<li data-projectName="'+soy.$$escapeHtml(a.project.name)+'" data-projectId="'+soy.$$escapeHtml(a.project.id)+'" data-projectRegion="'+soy.$$escapeHtml(a.project.region)+'" data-projectFolder="'+soy.$$escapeHtml(a.project.rootFolderId)+'"><div class="project-view"><div class="project-thumbnail">'+SketchUpTemplates.thumbnailImage(a.project)+'</div><div class="project-description"><div class="project-title"><span>'+soy.$$escapeHtml(a.project.name)+
"</span></div></div></div></li>"};goog.DEBUG&&(SketchUpTemplates.projectInstance.soyTemplateName="SketchUpTemplates.projectInstance");SketchUpTemplates.projectsView=function(a,b){return'<div class="projects-view"><div class="connect-section-title"><span class="projects-link">\ud504\ub85c\uc81d\ud2b8</span></div><div class="actions-bar"><div class="create-project-button invisible">\ud504\ub85c\uc81d\ud2b8 \uc0dd\uc131</div><div class="right-aligned-actions">'+SketchUpTemplates.syncButton(null)+'</div></div><div class="connect-scrollable-content"><div class="projects-section"><ul></ul></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.projectsView.soyTemplateName="SketchUpTemplates.projectsView");
SketchUpTemplates.fileEntry=function(a,b){return'<li data-id="'+soy.$$escapeHtml(a.fileEntry.remoteId)+'"><div class="connect-file-entry"><div class="connect-file-thumbnail">'+SketchUpTemplates.thumbnailImage(a.fileEntry)+"</div>"+(a.isFolder?'<div class="connect-foldername">':'<div class="connect-filename">')+soy.$$escapeHtml(a.fileEntry.name)+'</div><div class="file-sync-widgets-container"><div class="file-sync-progress-div invisible"><progress class="file-sync-progress" max="100" value="0"/></div><div class="file-sync-actions-div invisible">'+SketchUpTemplates.downloadCloud(a.hasConflict)+
'<img class="upload-cloud" src="images/tb_UploadCloud.svg" title="'+(a.hasConflict?"\uc774 \ubaa8\ub378\uc740 Trimble Connect\uc758 \ubc84\uc804\uacfc \ucda9\ub3cc\ud558\ub294 \ubcc0\uacbd \uc0ac\ud56d\uc744 \ud3ec\ud568\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \uc5ec\uae30\ub97c \ud074\ub9ad\ud574\uc11c \ub85c\uceec \ubcc0\uacbd \uc0ac\ud56d\uc744 \uc5c5\ub85c\ub4dc\ud574\uc8fc\uc2ed\uc2dc\uc624.":"\uc5ec\uae30\ub97c \ud074\ub9ad\ud574\uc11c \ub85c\uceec \ubcc0\uacbd \uc0ac\ud56d\uc744 \uc5c5\ub85c\ub4dc\ud574\uc8fc\uc2ed\uc2dc\uc624.")+
'" /></div><a class="tooltip below left"><img class="close-button visibility-none" title="" src="images/wi_close.svg" /><span>\uc774 \ud56d\ubaa9\uc744 \uc0ad\uc81c\ud558\ub824\uba74 \uc5ec\uae30\ub97c \ud074\ub9ad\ud558\uc2ed\uc2dc\uc624</span></a></div></div></li>'};goog.DEBUG&&(SketchUpTemplates.fileEntry.soyTemplateName="SketchUpTemplates.fileEntry");SketchUpTemplates.downloadCloud=function(a,b){return'<img class="download-cloud" src="images/tb_DownloadCloud.svg" title="" />'};
goog.DEBUG&&(SketchUpTemplates.downloadCloud.soyTemplateName="SketchUpTemplates.downloadCloud");
SketchUpTemplates.projectFileView=function(a,b){for(var c='<div class="file-view"><div class="connect-section-title"><span class="projects-link">\ud504\ub85c\uc81d\ud2b8</span>&nbsp; > &nbsp;',f=a.ancestorList,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<span class="folder-link" data-folderId="'+soy.$$escapeHtml(e.id)+'">'+soy.$$escapeHtml(e.name)+"</span>"+(d!=g-1?"&nbsp; > &nbsp;":""));return c+('</div><div class="actions-bar"><div class="add-file-button invisible" title="\uc774 \ud3f4\ub354\uc5d0 \uc0c8 \ubaa8\ub378 \ucd94\uac00"><img src="images/tb_add_model.svg" />\ubaa8\ub378 \ucd94\uac00</div><a class="tooltip below right"><div class="add-folder-button" title=""><img src="images/tb_add_folder.svg" />\ud3f4\ub354 \ucd94\uac00</div><span>\uc5ec\uae30\uc5d0 \uc0c8 \ud3f4\ub354\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4</span></a><div class="right-aligned-actions">'+SketchUpTemplates.syncButton(null)+
'</div></div><div class="connect-scrollable-content"><div class="file-tree"><ul></ul></div></div></div>')};goog.DEBUG&&(SketchUpTemplates.projectFileView.soyTemplateName="SketchUpTemplates.projectFileView");SketchUpTemplates.syncButton=function(a,b){return'<div class="sync-button visibility-none" title="\ubaa8\ub4e0 \ubaa8\ub378\uc744 Trimble Connect\uc640 \ub3d9\uae30\ud654" ><img class="static-image" src="images/tb_syncing_cloud.svg" /><img class="spinny-image invisible" src="images/loading.gif" />\ubaa8\ub450 \ub3d9\uae30\ud654</div>'};
goog.DEBUG&&(SketchUpTemplates.syncButton.soyTemplateName="SketchUpTemplates.syncButton");SketchUpTemplates.importPage=function(a,b){return'<div class="left-details-content"></div>'};goog.DEBUG&&(SketchUpTemplates.importPage.soyTemplateName="SketchUpTemplates.importPage");
SketchUpTemplates.fileDetailsPage=function(a,b){return'<div class="left-file-details-header"><div class="header-title">\uc0c1\uc138 \uc815\ubcf4</div></div><div class="left-details-content">'+SketchUpTemplates.fileDetails(a)+'</div><div class="left-details-bottom-action-bar"><div class="bottom-button">'+soy.$$escapeHtml(a.buttonName)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.fileDetailsPage.soyTemplateName="SketchUpTemplates.fileDetailsPage");SketchUpTemplates.detailsView=function(a,b){return'<div class="left-details-view"></div>'};
goog.DEBUG&&(SketchUpTemplates.detailsView.soyTemplateName="SketchUpTemplates.detailsView");
SketchUpTemplates.importTemplates=function(a,b){for(var c='<div class="import-templates-container"><ul>',f=a.skpFiles,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<li data-filepath="'+soy.$$escapeHtml(e.path)+'"><div class="thumbnail"><img src="data:image/bmp;base64,'+soy.$$escapeHtml(e.thumbnail)+'"></div><div class="file-description"><div class="name">'+soy.$$escapeHtml(e.name)+'</div><div class="units">Units: '+soy.$$escapeHtml(e.units)+'</div><div class="description">'+soy.$$escapeHtml(e.description)+
"</div></div></li>");return c+"</ul></div>"};goog.DEBUG&&(SketchUpTemplates.importTemplates.soyTemplateName="SketchUpTemplates.importTemplates");SketchUpTemplates.importLocal=function(a,b){return'<div class="import-local-container"><div class="import-text-container"><div class="preview-thumbnail"></div><div class="import-text">\ubaa8\ub378\uc744 \ud654\uba74\uc758 \uc544\ubb34 \uacf3\uc774\ub098 \ub4dc\ub798\uadf8\ud558\uac70\ub098 \ucc3e\uc544\ubcf4\uae30\ub97c \ud074\ub9ad\ud558\uc2ed\uc2dc\uc624</div><div class="upload-button-container"><div class="upload-button">\ucc3e\uc544\ubcf4\uae30<input type="file" id="system-file-browser" onclick="event.stopPropagation(); "/></div></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.importLocal.soyTemplateName="SketchUpTemplates.importLocal");SketchUpTemplates.thumbnailImage=function(a,b){return""+(a.thumbnailData?'<img src="data:image/bmp;base64,'+soy.$$escapeHtml(a.thumbnailData)+'" />':'<img src="'+soy.$$escapeHtml(a.thumbnailURL)+'" />')};goog.DEBUG&&(SketchUpTemplates.thumbnailImage.soyTemplateName="SketchUpTemplates.thumbnailImage");SketchUpTemplates.dragArea=function(a,b){return'<div class="dragarea visibility-none">\uc5ec\uae30\ub85c \ud30c\uc77c\uc744 \ub4dc\ub798\uadf8\ud569\ub2c8\ub2e4</div>'};
goog.DEBUG&&(SketchUpTemplates.dragArea.soyTemplateName="SketchUpTemplates.dragArea");
SketchUpTemplates.fileDetails=function(a,b){return'<div class="connect-file-details"><div class="connect-file-thumbnail">'+SketchUpTemplates.thumbnailImage(a.fileEntry)+'</div><div class="details-container"><div class="details-filename-label">\uc774\ub984:</div><div class="details-filename">'+soy.$$escapeHtml(a.fileEntry.name)+"</div>"+(null!=a.fileEntry.createdByFirstName?'<div class="created-by-label">\uc0dd\uc131\uc790:</div><div class="created-by">'+soy.$$escapeHtml(a.fileEntry.createdByFirstName)+
" "+soy.$$escapeHtml(a.fileEntry.createdByLastName)+"<br/>"+soy.$$escapeHtml(a.fileEntry.createdByEmail)+"<br/>"+soy.$$escapeHtml(a.fileEntry.createdOn)+"</div>":"")+'<div class="file-size-label">\ud06c\uae30:</div><div class="file-size">'+soy.$$escapeHtml(Math.round(a.fileEntry.sizeInKB))+" KB</div>"+(null!=a.fileEntry.modifiedByFirstName?'<div class="modified-by-label">\uc218\uc815\uc790:</div><div class="modified-by">'+soy.$$escapeHtml(a.fileEntry.modifiedByFirstName)+" "+soy.$$escapeHtml(a.fileEntry.modifiedByLastName)+
"<br/>"+soy.$$escapeHtml(a.fileEntry.modifiedByEmail)+"<br/>"+soy.$$escapeHtml(a.fileEntry.modifiedOn)+"</div>":"")+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.fileDetails.soyTemplateName="SketchUpTemplates.fileDetails");SketchUpTemplates.loadingGif=function(a,b){return'<div class="loading-gif"><img src="images/loading.gif" /></div>'};goog.DEBUG&&(SketchUpTemplates.loadingGif.soyTemplateName="SketchUpTemplates.loadingGif");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});
SketchUpTemplates.taskTab=function(a,b){return'<div class="trimble-connect-tasks"></div>'};goog.DEBUG&&(SketchUpTemplates.taskTab.soyTemplateName="SketchUpTemplates.taskTab");SketchUpTemplates.topActionsBar=function(a,b){return'<div class="actions-bar"><div class="actions-button-container task-button selected" title=""><a class="tooltip below right"><img class="action-bar-button" src="images/dlg_task.svg" /><span>\uc774 \ubaa8\ub378\uc5d0 \ub300\ud55c \uc791\uc5c5\uad00\ub9ac\ub97c \ubd05\ub2c8\ub2e4</span></a></div><div class="actions-button-container comments-button" title=""><a class="tooltip below right"><img class="action-bar-button" src="images/dlg_chat.svg" /><span>\uc774 \ubaa8\ub378\uc5d0 \ub300\ud55c \ub313\uae00\uc744 \ubd05\ub2c8\ub2e4</span></a></div><div class="actions-button-container references-button" title=""><a class="tooltip below left"><img class="action-bar-button" src="images/dlg_reference.svg" /><span>\ucc38\uc870 \ubaa8\ub378 \uad00\ub9ac</span></a></div><div class="actions-button-container connect-button" title=""><a class="tooltip below left"><img class="action-bar-button" src="images/tb_ConnectIconMono.svg" /><span>Trimble Connect \uc5f4\uae30</span></a></div></div>'};
goog.DEBUG&&(SketchUpTemplates.topActionsBar.soyTemplateName="SketchUpTemplates.topActionsBar");SketchUpTemplates.taskContent=function(a,b){return'<div class="tasks-content-wrapper"></div>'};goog.DEBUG&&(SketchUpTemplates.taskContent.soyTemplateName="SketchUpTemplates.taskContent");SketchUpTemplates.tasksList=function(a,b){return'<div class="task-list-container"><div class="task-list-top-bar top-bar"><div class="list-label">\uc791\uc5c5\uad00\ub9ac</div><div class="actions-button-container filter-task-button invisible"><a class="tooltip below left"><img class="action-bar-button" src="images/tb_filter.svg" /><span>\uc791\uc5c5\uad00\ub9ac \ubaa9\ub85d \ud544\ud130\ub9c1</span></a></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.tasksList.soyTemplateName="SketchUpTemplates.tasksList");SketchUpTemplates.list=function(a,b){return"<ul></ul>"};goog.DEBUG&&(SketchUpTemplates.list.soyTemplateName="SketchUpTemplates.list");
SketchUpTemplates.taskEntry=function(a,b){var c='<li data-id="'+soy.$$escapeHtml(a.task.id)+'"><div class="task-list-item '+("CLOSED"==a.task.status?"closed-status":"")+'"><div class="task-list-user-icon-container">'+SketchUpTemplates.userThumbnail(a)+'</div><div class="task-list-item-name">'+soy.$$escapeHtml(a.task.description)+'</div><div class="task-list-priority-icon">';if("RESOLVED"==a.task.status)switch(a.task.priority){case "LOW":c+='<img class="priority-icon" src="images/tb_done_low.svg" />';
break;case "NORMAL":c+='<img class="priority-icon" src="images/tb_done_normal.svg" />';break;case "HIGH":c+='<img class="priority-icon" src="images/tb_done_high.svg" />';break;case "CRITICAL":c+='<img class="priority-icon" src="images/tb_done_critical.svg" />'}else switch(a.task.priority){case "LOW":c+='<img class="priority-icon" src="images/dlg_priority_low.svg" />';break;case "NORMAL":c+='<img class="priority-icon" src="images/dlg_priority_normal.svg" />';break;case "HIGH":c+='<img class="priority-icon" src="images/dlg_priority_high.svg" />';
break;case "CRITICAL":c+='<img class="priority-icon" src="images/dlg_priority_critical.svg" />'}return c+"</div></div></li>"};goog.DEBUG&&(SketchUpTemplates.taskEntry.soyTemplateName="SketchUpTemplates.taskEntry");SketchUpTemplates.emptyList=function(a,b){return'<li class="empty-list-message">'+soy.$$escapeHtml(a.message)+"</li>"};goog.DEBUG&&(SketchUpTemplates.emptyList.soyTemplateName="SketchUpTemplates.emptyList");
SketchUpTemplates.taskDetails=function(a,b){return'<div class="task-details-container"><div class="task-details-top-bar top-bar"><div class="list-label">'+("CREATE"==a.mode?"\uc791\uc5c5\uad00\ub9ac \uc0dd\uc131":"EDIT"==a.mode?"\uc791\uc5c5\uad00\ub9ac":"")+'</div></div><div class="task-details"><div class="task-view-image-container"><img class="task-view-image invisible" src="images/tb_file.svg" /><div class="task-view-image-refresh-button actions-button-container invisible" title=""><a class="tooltip above left"><img class="refresh-image" src="images/tb_refresh.svg" /><span>\uc774 \uc791\uc5c5\uad00\ub9ac\uc5d0 \ub300\ud55c \ubcf4\uae30 \uc5c5\ub370\uc774\ud2b8</span></a></div></div><div class="task-name-and-description-container">'+
(a.task.label?'<div class="task-name-label">'+soy.$$escapeHtml(a.task.label)+'</div><input class="task-name-input" type="hidden" value="'+soy.$$escapeHtml(a.task.label)+'"/>':'<input class="task-name-input task-input" value="'+soy.$$escapeHtml(a.task.label)+'" placeholder="\uc774\ub984(\uc120\ud0dd \uc0ac\ud56d):" />')+'<textarea class="task-description-input task-input" placeholder="\uc124\uba85 (\ud544\uc218):" />'+soy.$$escapeHtml(a.task.description)+'</textarea></div><div class="due-date-container"><div class="due-date-label">\uae30\ud55c:</div><div class="due-date-input-container"><input type="date" '+
(a.task.displayDueDate?' value="'+soy.$$escapeHtml(a.task.displayDueDate)+'" ':"")+' class="due-date-input task-input"/></div></div>'+SketchUpTemplates.priorityInput({priority:a.task.priority})+SketchUpTemplates.statusInput({status:a.task.status})+'<div class="break-line"></div><div class="assign-container"><div class="assign-task-label">\ud560\ub2f9 \ub300\uc0c1:</div><div class="assign-task-input-container"><input class="assign-task-input task-input" value="'+soy.$$escapeHtml(a.task.assigneesCSV)+
'" placeholder="\uac80\uc0c9\ud560 \ub0b4\uc6a9\uc744 \uc785\ub825\ud558\uc2ed\uc2dc\uc624..." /></div></div></div></div>'};goog.DEBUG&&(SketchUpTemplates.taskDetails.soyTemplateName="SketchUpTemplates.taskDetails");
SketchUpTemplates.priorityInput=function(a,b){return'<div class="priority-container"><div class="priority-label">\uc6b0\uc120 \uc21c\uc704:</div><div class="priority-input-container"><select class="priority-input task-input"/><option value="CRITICAL"'+("CRITICAL"==a.priority?" selected ":"")+'>\ub9e4\uc6b0 \uc911\uc694</option><option value="HIGH"'+("HIGH"==a.priority?" selected ":"")+'>\ub192\uc74c</option><option value="NORMAL"'+("NORMAL"==a.priority?" selected ":"")+'>Normal</option><option value="LOW"'+
("LOW"==a.priority?" selected ":"")+">\ub0ae\uc74c</option></select></div></div>"};goog.DEBUG&&(SketchUpTemplates.priorityInput.soyTemplateName="SketchUpTemplates.priorityInput");
SketchUpTemplates.statusInput=function(a,b){return'<div class="status-container"><div class="status-label">\uc0c1\ud0dc:</div><div class="status-input-container"><select class="status-input task-input"/><option value="NEW"'+("NEW"==a.status?" selected ":"")+'>\uc0c8\ub85c \ub9cc\ub4e4\uae30</option><option value="IN_PROGRESS"'+("IN_PROGRESS"==a.status?" selected ":"")+'>\uc9c4\ud589 \uc911</option><option value="BLOCKED"'+("BLOCKED"==a.status?" selected ":"")+'>\ub300\uae30 \uc911</option><option value="RESOLVED"'+
("RESOLVED"==a.status?" selected ":"")+'>\uc644\ub8cc</option><option value="CLOSED"'+("CLOSED"==a.status?" selected ":"")+">\ub2eb\ud798</option></select></div></div>"};goog.DEBUG&&(SketchUpTemplates.statusInput.soyTemplateName="SketchUpTemplates.statusInput");
SketchUpTemplates.userSelect=function(a,b){for(var c='<div class="user-filter-container"><div class="user-label">\uc0ac\uc6a9\uc790:</div><div class="user-filter-input-container"><select class="user-filter-input task-input"/><option class="placeholder" value="" disabled selected>\uc0ac\uc6a9\uc790 \uc120\ud0dd</option><option value="None">\ud560\ub2f9\ub418\uc9c0 \uc54a\uc74c</option>',f=a.users,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<option value="'+soy.$$escapeHtml(e)+'"'+(e==a.selectedUser?" selected ":
"")+">"+soy.$$escapeHtml(e)+"</option>");return c+"</select></div></div>"};goog.DEBUG&&(SketchUpTemplates.userSelect.soyTemplateName="SketchUpTemplates.userSelect");
SketchUpTemplates.taskFilterView=function(a,b){return'<div class="filter-view-container invisible"><div class="filter-view-top-bar"><div class="filter-view-label">\ud544\ud130</div><div class="filter-view-collapse-button action-button-container"><a class="tooltip below left"><img class="up-arrow-image" src="images/tb_more_arrow.svg" /><span>\ud544\ud130 \uc81c\uac70</span></a></div></div>'+SketchUpTemplates.userSelect(a)+SketchUpTemplates.priorityInput(a)+SketchUpTemplates.statusInput(a)+'<div class="sort-view-top-bar"><div class="sort-view-label">\uc815\ub82c</div></div><div class="sort-input-container"><div class="sort-by-name-button actions-button-container"><a class="tooltip above right"><img class="sort-name-normal" src="images/tb_sort_name_decending.svg" /><img class="sort-name-reverse invisible" src="images/tb_sort_name_acending.svg" /><span>\uc774\ub984\uc21c\uc73c\ub85c \uc815\ub82c</span></a></div><div class="sort-by-date-button actions-button-container"><a class="tooltip above right"><img class="sort-date-normal" src="images/tb_sort_date_decending.svg" /><img class="sort-date-reverse invisible" src="images/tb_sort_date_acending.svg" /><span>\ub0a0\uc9dc\uc21c\uc73c\ub85c \uc815\ub82c</span></a></div><div class="sort-by-user-button actions-button-container"><a class="tooltip above left"><img class="sort-user-normal" src="images/tb_sort_user_decending.svg" /><img class="sort-user-reverse invisible" src="images/tb_sort_user_acending.svg" /><span>\uc0ac\uc6a9\uc790\uc21c\uc73c\ub85c \uc815\ub82c</span></a></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.taskFilterView.soyTemplateName="SketchUpTemplates.taskFilterView");SketchUpTemplates.captureView=function(a,b){return'<div class="capture-view-button-container"><div class="capture-view-button">\ucea1\ucc98 \ubcf4\uae30</div></div>'};goog.DEBUG&&(SketchUpTemplates.captureView.soyTemplateName="SketchUpTemplates.captureView");
SketchUpTemplates.commitOrCancel=function(a,b){return'<div class="commit-cancel-container"><div class="cancel-button" title="'+soy.$$escapeHtml(a.cancelTooltip)+'"><div class="cancel-button-text">'+soy.$$escapeHtml(a.cancelText)+'</div></div><div class="commit-button" title="'+soy.$$escapeHtml(a.commitTooltip)+'"><div class="commit-button-text">'+soy.$$escapeHtml(a.commitText)+"</div></div></div>"};goog.DEBUG&&(SketchUpTemplates.commitOrCancel.soyTemplateName="SketchUpTemplates.commitOrCancel");
SketchUpTemplates.commentList=function(a,b){return'<div class="comment-list-container"><div class="comment-list-top-bar top-bar"><div class="list-label">\uc758\uacac</div></div><ul></ul></div>'};goog.DEBUG&&(SketchUpTemplates.commentList.soyTemplateName="SketchUpTemplates.commentList");
SketchUpTemplates.taskCommentList=function(a,b){return'<div class="embedded-comment-list-container invisible"><div class="break-line"></div><div class="comment-list-label">\uc791\uc5c5\uad00\ub9ac\uc5d0 \ub300\ud55c \ub313\uae00 \uc791\uc131:</div>'+SketchUpTemplates.commentInputField(a)+"<ul></ul>"+SketchUpTemplates.showMorePrompt(null)+"</div>"};goog.DEBUG&&(SketchUpTemplates.taskCommentList.soyTemplateName="SketchUpTemplates.taskCommentList");SketchUpTemplates.showMorePrompt=function(a,b){return'<div class="show-more invisible">\ub9ce\uac8c<img class="more-arrow" src="images/tb_more_arrow.svg" /></div>'};
goog.DEBUG&&(SketchUpTemplates.showMorePrompt.soyTemplateName="SketchUpTemplates.showMorePrompt");SketchUpTemplates.activeUserComment=function(a,b){return'<li class="active-user-comment-container"><div class="active-user-comment-bubble"><div class="active-user-comment-text">'+soy.$$escapeHtml(a.comment.description)+'</div><div class="active-user-comment-arrow"></div>'+SketchUpTemplates.commentDate(a)+"</div>"+SketchUpTemplates.userThumbnail(a)+"</li>"};
goog.DEBUG&&(SketchUpTemplates.activeUserComment.soyTemplateName="SketchUpTemplates.activeUserComment");SketchUpTemplates.userComment=function(a,b){return'<li class="user-comment-container">'+SketchUpTemplates.userThumbnail(a)+'<div class="user-comment-bubble"><div class="user-comment-arrow"></div><div class="user-comment-text">'+soy.$$escapeHtml(a.comment.description)+"</div>"+SketchUpTemplates.commentDate(a)+"</div></li>"};goog.DEBUG&&(SketchUpTemplates.userComment.soyTemplateName="SketchUpTemplates.userComment");
SketchUpTemplates.commentDate=function(a,b){return'<div class="comment-date">'+soy.$$escapeHtml(a.date)+"</div>"};goog.DEBUG&&(SketchUpTemplates.commentDate.soyTemplateName="SketchUpTemplates.commentDate");SketchUpTemplates.userThumbnail=function(a,b){return'<div class="user-icon" title="">'+(a.thumbnail?'<img src="'+soy.$$escapeHtml(a.thumbnail)+'" />':soy.$$escapeHtml(a.initials))+"</div>"};goog.DEBUG&&(SketchUpTemplates.userThumbnail.soyTemplateName="SketchUpTemplates.userThumbnail");
SketchUpTemplates.referenceList=function(a,b){return'<div class="ref-list-container"><div class="ref-list-top-bar top-bar"><div class="list-label">\ucc38\uc870</div></div><ul></ul></div>'};goog.DEBUG&&(SketchUpTemplates.referenceList.soyTemplateName="SketchUpTemplates.referenceList");
SketchUpTemplates.referenceEntry=function(a,b){return'<li id="'+soy.$$escapeHtml(a.reference.id)+'"><div class="ref-list-item"><div class="ref-list-icon-container">'+SketchUpTemplates.refThumbnail(a)+'</div><a class="tooltip below right"><div class="ref-list-item-name">'+soy.$$escapeHtml(a.reference.name)+'</div><span>\uc774 \ucc38\uc870 \ubaa8\ub378\uc740 Trimble Connect\uc5d0\uc11c \uc81c\uac70\ub418\uc5c8\uc2b5\ub2c8\ub2e4</span></a><div class="ref-update-button actions-button-container invisible"><a class="tooltip below left">'+
SketchUpTemplates.downloadCloud(a)+'<span>\uc5ec\uae30\ub97c \ud074\ub9ad\ud574\uc11c \uc774 \ubaa8\ub378\uc758 \ucd5c\uc2e0 \ubc84\uc804\uc744 \ub2e4\uc6b4\ub85c\ub4dc\ud558\uc2ed\uc2dc\uc624</span></a></div><div class="accordian-chevron"><img class="chevron-icon" src="images/dlg_chevron.svg" /></div></div></li>'};goog.DEBUG&&(SketchUpTemplates.referenceEntry.soyTemplateName="SketchUpTemplates.referenceEntry");
SketchUpTemplates.refThumbnail=function(a,b){return""+(a.thumbnail?'<img class="ref-icon" src="'+soy.$$escapeHtml(a.thumbnail)+'" />':'<img class="ref-icon" src="images/tb_file.svg" />')};goog.DEBUG&&(SketchUpTemplates.refThumbnail.soyTemplateName="SketchUpTemplates.refThumbnail");
SketchUpTemplates.refActionsBar=function(a,b){return'<div class="ref-actions-bar"><div class="ref-add-button actions-button-container"><a class="tooltip above right"><img src="images/tb_add_reference.svg" /><span>\uc0c8 \ucc38\uc870 \ubaa8\ub378 \ucd94\uac00</span></a></div><div class="ref-delete-button actions-button-container"><a class="tooltip above left"><img src="images/tb_delete.svg" /><span>\uc120\ud0dd\ub41c \ucc38\uc870 \ubaa8\ub378\uc744 \uc81c\uac70\ud569\ub2c8\ub2e4</span></a></div><div class="ref-update-button actions-button-container"><a class="tooltip above left">'+SketchUpTemplates.downloadCloud(a)+
"<span>\ubaa8\ub4e0 \ucc38\uc870 \ubaa8\ub378\uc5d0 \ub300\ud574 \ucd5c\uc2e0 \ubc84\uc804 \ub2e4\uc6b4\ub85c\ub4dc</span></a></div><div>"};goog.DEBUG&&(SketchUpTemplates.refActionsBar.soyTemplateName="SketchUpTemplates.refActionsBar");SketchUpTemplates.taskActionsBar=function(a,b){return'<div class="task-actions-bar"><div class="actions-button-container create-task-button"><a class="tooltip above right"><img src="images/dlg_task_create.svg" /><span>\uc774 \ubaa8\ub378\uc5d0 \ub300\ud55c \uc0c8 \uc791\uc5c5\uad00\ub9ac\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4</span></a></div><div class="task-delete-button actions-button-container"><a class="tooltip above left"><img src="images/tb_delete.svg" /><span>\uc120\ud0dd\ud55c \uc791\uc5c5\uad00\ub9ac \uc0ad\uc81c</span></a></div><div>'};
goog.DEBUG&&(SketchUpTemplates.taskActionsBar.soyTemplateName="SketchUpTemplates.taskActionsBar");SketchUpTemplates.commentInputBar=function(a,b){return'<div class="comment-input-bar">'+SketchUpTemplates.commentInputField(a)+"</div>"};goog.DEBUG&&(SketchUpTemplates.commentInputBar.soyTemplateName="SketchUpTemplates.commentInputBar");
SketchUpTemplates.commentInputField=function(a,b){return'<div class="comment-input-container"><textarea class="comment-input-field" placeholder="'+soy.$$escapeHtml(a.placeholder)+'" /></textarea><div class="actions-button-container publish-comment"><a class="tooltip above left"><img src="images/dlg_chat.svg" /><span>\ud074\ub9ad\ud574\uc11c \ub313\uae00\uc744 \uac8c\uc2dc\ud569\ub2c8\ub2e4</span></a></div></div>'};goog.DEBUG&&(SketchUpTemplates.commentInputField.soyTemplateName="SketchUpTemplates.commentInputField");
SketchUpTemplates.editAlignment=function(a,b){return'<div class="edit-alignment-container"><div class="alignment-editor-margins"><div class="align-button-container"><div class="align-button">\uc0c1\ud638\uc791\uc6a9\uc2dd \uc815\ub82c</div></div><div class="alignment-label">\uc704\uce58</div>'+SketchUpTemplates.alignmentInput({color:"red",label:a.lengthUnit,value:a.position.x,className:"pos-x-input"})+SketchUpTemplates.alignmentInput({color:"green",label:a.lengthUnit,value:a.position.y,className:"pos-y-input"})+
SketchUpTemplates.alignmentInput({color:"blue",label:a.lengthUnit,value:a.position.z,className:"pos-z-input"})+'<div class="alignment-label">\ud68c\uc804</div>'+SketchUpTemplates.alignmentInput({color:"red",label:a.angleUnit,value:a.rotation.x,className:"rot-x-input"})+SketchUpTemplates.alignmentInput({color:"green",label:a.angleUnit,value:a.rotation.y,className:"rot-y-input"})+SketchUpTemplates.alignmentInput({color:"blue",label:a.angleUnit,value:a.rotation.z,className:"rot-z-input"})+'<div class="break-line"></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.editAlignment.soyTemplateName="SketchUpTemplates.editAlignment");SketchUpTemplates.alignmentInput=function(a,b){return'<div class="alignment-input-container"><input type="number" class="alignment-input '+soy.$$escapeHtml(a.className)+" "+soy.$$escapeHtml(a.color)+'" value="'+soy.$$escapeHtml(a.value)+'"/><div class="alignment-input-label-container">'+soy.$$escapeHtml(a.label)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.alignmentInput.soyTemplateName="SketchUpTemplates.alignmentInput");
SketchUpTemplates.authorDetails=function(a,b){return'<div class="author-details-container"><div class="author-label">'+soy.$$escapeHtml(a.data.label)+'</div><div class="author-user-icon-container">'+SketchUpTemplates.userThumbnail({thumbnail:a.data.thumbnail,initials:a.data.initials})+'</div><div class="author-name-time-wrapper"><p class="author-name">'+soy.$$escapeHtml(a.data.name)+'</p><p class="timestamp">'+soy.$$escapeHtml(a.data.timestamp)+"</p></div></div>"};
goog.DEBUG&&(SketchUpTemplates.authorDetails.soyTemplateName="SketchUpTemplates.authorDetails");SketchUpTemplates.listItemProgress=function(a,b){return'<div class="progress-div"><progress class="progress-bar" max="100" value="0"/></div>'};goog.DEBUG&&(SketchUpTemplates.listItemProgress.soyTemplateName="SketchUpTemplates.listItemProgress");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});SketchUpTemplates.tcViewer=function(a,b){return'<div class="trimble-connect-viewer"></div>'};
goog.DEBUG&&(SketchUpTemplates.tcViewer.soyTemplateName="SketchUpTemplates.tcViewer");
