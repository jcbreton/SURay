if("undefined"==typeof SketchUpTemplates)var SketchUpTemplates={};SketchUpTemplates.modelTitleInput=function(a,b){return'<div class="model-title-input-container"><input class="model-title-input" placeholder="Enter a model name here"/></div>'};goog.DEBUG&&(SketchUpTemplates.modelTitleInput.soyTemplateName="SketchUpTemplates.modelTitleInput");SketchUpTemplates.progressDialog=function(a,b){return'<div class="progress-dialog-div"><progress class="progress-dialog-progress-bar" max="100" value="0"/></div>'};
goog.DEBUG&&(SketchUpTemplates.progressDialog.soyTemplateName="SketchUpTemplates.progressDialog");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});SketchUpTemplates.leftSidebar=function(a,b){return'<div class="left-sidebar"><div class="left-tab close-tab"><img src="images/tb_left_arrow.svg" title="\u9690\u85cf\u4fa7\u8fb9\u680f (Esc)" /></div><div class="hidden-while-not-expanded"><div class="left-tab user-account-tab" title="\u7528\u6237\u4fe1\u606f"><img src="images/tb_user_default.svg" /></div><div class="left-tab new-model-tab" title="\u4ece\u6a21\u677f\u65b0\u5efa\u6a21\u578b"><img src="images/tb_new_web.svg" /></div><div class="left-tab connect-tab selected-left-tab" title="\u4ece Trimble Connect \u6253\u5f00\u6a21\u578b"><img src="images/tb_ConnectIconMono.svg" /></div><div class="left-tab geolocation-tab" title="\u6dfb\u52a0\u4f4d\u7f6e"><img src="images/tb_geolocation.svg" /></div><div class="left-tab modelinfo-tab" title="\u6a21\u578b\u4fe1\u606f"><img src="images/tb_modelinfo.svg" /></div></div><div id="left-sidebar-toolbar"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebar.soyTemplateName="SketchUpTemplates.leftSidebar");SketchUpTemplates.leftSidebarConnectTab=function(a,b){return'<div class="left-sidebar-container"><div class="trimble-connect-header"><img src="images/trimble_connect_logo_and_text.png" /><div class="upgrade-account-link invisible">\u5347\u7ea7\u8d26\u6237</div></div><div class="trimble-connect-content"></div><div class="save-new-model-container invisible"><div class="name-label">\u540d\u79f0:</div><input class="save-new-model-input" placeholder="Enter a model name here"/><div class="save-here-button disabled-button">\u53d1\u5e03\u6a21\u578b</div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarConnectTab.soyTemplateName="SketchUpTemplates.leftSidebarConnectTab");
SketchUpTemplates.leftSidebarUserAccountTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="user-account-content"><div class="login-content"><div class="login-picture-container">'+(a.loginInfo.image?'<img class="login-picture" src="'+soy.$$escapeHtml(a.loginInfo.image)+'" />':'<img class="login-picture blank-profile-image" src="images/tb_generic_user_picture.svg" />')+'</div><div class="login-name-container"><div class="login-firstname">'+soy.$$escapeHtml(a.loginInfo.firstname)+
" "+soy.$$escapeHtml(a.loginInfo.lastname)+'</div><div class="login-email">'+soy.$$escapeHtml(a.loginInfo.email)+'</div><div class="logout-button">\u9000\u51fa</div></div></div></div></div>'};goog.DEBUG&&(SketchUpTemplates.leftSidebarUserAccountTab.soyTemplateName="SketchUpTemplates.leftSidebarUserAccountTab");SketchUpTemplates.leftSidebarNewModelTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="new-model-content"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarNewModelTab.soyTemplateName="SketchUpTemplates.leftSidebarNewModelTab");SketchUpTemplates.leftSidebarGeolocationTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="geolocation-content">'+SketchUpTemplates.loadingGif(null)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.leftSidebarGeolocationTab.soyTemplateName="SketchUpTemplates.leftSidebarGeolocationTab");SketchUpTemplates.leftSidebarModelInfoTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="modelinfo-content"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarModelInfoTab.soyTemplateName="SketchUpTemplates.leftSidebarModelInfoTab");
SketchUpTemplates.projectInstance=function(a,b){return'<li data-projectName="'+soy.$$escapeHtml(a.project.name)+'" data-projectId="'+soy.$$escapeHtml(a.project.id)+'" data-projectRegion="'+soy.$$escapeHtml(a.project.region)+'" data-projectFolder="'+soy.$$escapeHtml(a.project.rootFolderId)+'"><div class="project-view"><div class="project-thumbnail">'+SketchUpTemplates.thumbnailImage(a.project)+'</div><div class="project-description"><div class="project-title"><span>'+soy.$$escapeHtml(a.project.name)+
"</span></div></div></div></li>"};goog.DEBUG&&(SketchUpTemplates.projectInstance.soyTemplateName="SketchUpTemplates.projectInstance");SketchUpTemplates.projectsView=function(a,b){return'<div class="projects-view"><div class="connect-section-title"><span class="projects-link">\u9879\u76ee</span></div><div class="actions-bar"><div class="create-project-button invisible">\u521b\u5efa\u9879\u76ee</div><div class="right-aligned-actions">'+SketchUpTemplates.syncButton(null)+'</div></div><div class="connect-scrollable-content"><div class="projects-section"><ul></ul></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.projectsView.soyTemplateName="SketchUpTemplates.projectsView");
SketchUpTemplates.fileEntry=function(a,b){return'<li data-id="'+soy.$$escapeHtml(a.fileEntry.remoteId)+'"><div class="connect-file-entry"><div class="connect-file-thumbnail">'+SketchUpTemplates.thumbnailImage(a.fileEntry)+"</div>"+(a.isFolder?'<div class="connect-foldername">':'<div class="connect-filename">')+soy.$$escapeHtml(a.fileEntry.name)+'</div><div class="file-sync-widgets-container"><div class="file-sync-progress-div invisible"><progress class="file-sync-progress" max="100" value="0"/></div><div class="file-sync-actions-div invisible">'+SketchUpTemplates.downloadCloud(a.hasConflict)+
'<img class="upload-cloud" src="images/tb_UploadCloud.svg" title="'+(a.hasConflict?"\u6b64\u6a21\u578b\u6240\u5305\u542b\u66f4\u6539\u4e0e Trimble Connect \u4e0a\u7684\u7248\u672c\u51b2\u7a81\uff0c\u70b9\u51fb\u6b64\u5904\u4e0a\u4f20\u672c\u5730\u66f4\u6539\u3002":"\u70b9\u51fb\u6b64\u5904\u4e0a\u4f20\u672c\u5730\u66f4\u6539\u3002")+'" /></div><a class="tooltip below left"><img class="close-button visibility-none" title="" src="images/wi_close.svg" /><span>\u70b9\u51fb\u6b64\u5904\u5220\u9664\u8be5\u9879</span></a></div></div></li>'};
goog.DEBUG&&(SketchUpTemplates.fileEntry.soyTemplateName="SketchUpTemplates.fileEntry");SketchUpTemplates.downloadCloud=function(a,b){return'<img class="download-cloud" src="images/tb_DownloadCloud.svg" title="" />'};goog.DEBUG&&(SketchUpTemplates.downloadCloud.soyTemplateName="SketchUpTemplates.downloadCloud");
SketchUpTemplates.projectFileView=function(a,b){for(var c='<div class="file-view"><div class="connect-section-title"><span class="projects-link">\u9879\u76ee</span>&nbsp; > &nbsp;',f=a.ancestorList,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<span class="folder-link" data-folderId="'+soy.$$escapeHtml(e.id)+'">'+soy.$$escapeHtml(e.name)+"</span>"+(d!=g-1?"&nbsp; > &nbsp;":""));return c+('</div><div class="actions-bar"><div class="add-file-button invisible" title="\u5728\u6b64\u6587\u4ef6\u5939\u4e2d\u6dfb\u52a0\u65b0\u6a21\u578b"><img src="images/tb_add_model.svg" />\u6dfb\u52a0\u6a21\u578b</div><a class="tooltip below right"><div class="add-folder-button" title=""><img src="images/tb_add_folder.svg" />\u6dfb\u52a0\u6587\u4ef6\u5939</div><span>\u5728\u6b64\u5904\u65b0\u5efa\u6587\u4ef6\u5939</span></a><div class="right-aligned-actions">'+
SketchUpTemplates.syncButton(null)+'</div></div><div class="connect-scrollable-content"><div class="file-tree"><ul></ul></div></div></div>')};goog.DEBUG&&(SketchUpTemplates.projectFileView.soyTemplateName="SketchUpTemplates.projectFileView");SketchUpTemplates.syncButton=function(a,b){return'<div class="sync-button visibility-none" title="\u4f7f\u7528 Trimble Connect \u540c\u6b65\u6240\u6709\u6a21\u578b" ><img class="static-image" src="images/tb_syncing_cloud.svg" /><img class="spinny-image invisible" src="images/loading.gif" />\u5168\u90e8\u540c\u6b65</div>'};
goog.DEBUG&&(SketchUpTemplates.syncButton.soyTemplateName="SketchUpTemplates.syncButton");SketchUpTemplates.importPage=function(a,b){return'<div class="left-details-content"></div>'};goog.DEBUG&&(SketchUpTemplates.importPage.soyTemplateName="SketchUpTemplates.importPage");
SketchUpTemplates.fileDetailsPage=function(a,b){return'<div class="left-file-details-header"><div class="header-title">\u8be6\u7ec6\u4fe1\u606f</div></div><div class="left-details-content">'+SketchUpTemplates.fileDetails(a)+'</div><div class="left-details-bottom-action-bar"><div class="bottom-button">'+soy.$$escapeHtml(a.buttonName)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.fileDetailsPage.soyTemplateName="SketchUpTemplates.fileDetailsPage");SketchUpTemplates.detailsView=function(a,b){return'<div class="left-details-view"></div>'};
goog.DEBUG&&(SketchUpTemplates.detailsView.soyTemplateName="SketchUpTemplates.detailsView");
SketchUpTemplates.importTemplates=function(a,b){for(var c='<div class="import-templates-container"><ul>',f=a.skpFiles,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<li data-filepath="'+soy.$$escapeHtml(e.path)+'"><div class="thumbnail"><img src="data:image/bmp;base64,'+soy.$$escapeHtml(e.thumbnail)+'"></div><div class="file-description"><div class="name">'+soy.$$escapeHtml(e.name)+'</div><div class="units">Units: '+soy.$$escapeHtml(e.units)+'</div><div class="description">'+soy.$$escapeHtml(e.description)+
"</div></div></li>");return c+"</ul></div>"};goog.DEBUG&&(SketchUpTemplates.importTemplates.soyTemplateName="SketchUpTemplates.importTemplates");SketchUpTemplates.importLocal=function(a,b){return'<div class="import-local-container"><div class="import-text-container"><div class="preview-thumbnail"></div><div class="import-text">\u5728\u5c4f\u5e55\u4efb\u610f\u4f4d\u7f6e\u62d6\u52a8\u6a21\u578b\u6216\u70b9\u51fb\u6d4f\u89c8</div><div class="upload-button-container"><div class="upload-button">\u6d4f\u89c8<input type="file" id="system-file-browser" onclick="event.stopPropagation(); "/></div></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.importLocal.soyTemplateName="SketchUpTemplates.importLocal");SketchUpTemplates.thumbnailImage=function(a,b){return""+(a.thumbnailData?'<img src="data:image/bmp;base64,'+soy.$$escapeHtml(a.thumbnailData)+'" />':'<img src="'+soy.$$escapeHtml(a.thumbnailURL)+'" />')};goog.DEBUG&&(SketchUpTemplates.thumbnailImage.soyTemplateName="SketchUpTemplates.thumbnailImage");SketchUpTemplates.dragArea=function(a,b){return'<div class="dragarea visibility-none">\u5c06\u6587\u4ef6\u62d6\u653e\u81f3\u6b64\u5904</div>'};
goog.DEBUG&&(SketchUpTemplates.dragArea.soyTemplateName="SketchUpTemplates.dragArea");
SketchUpTemplates.fileDetails=function(a,b){return'<div class="connect-file-details"><div class="connect-file-thumbnail">'+SketchUpTemplates.thumbnailImage(a.fileEntry)+'</div><div class="details-container"><div class="details-filename-label">\u540d\u79f0:</div><div class="details-filename">'+soy.$$escapeHtml(a.fileEntry.name)+"</div>"+(null!=a.fileEntry.createdByFirstName?'<div class="created-by-label">\u521b\u5efa\u4eba\uff1a</div><div class="created-by">'+soy.$$escapeHtml(a.fileEntry.createdByFirstName)+
" "+soy.$$escapeHtml(a.fileEntry.createdByLastName)+"<br/>"+soy.$$escapeHtml(a.fileEntry.createdByEmail)+"<br/>"+soy.$$escapeHtml(a.fileEntry.createdOn)+"</div>":"")+'<div class="file-size-label">\u5c3a\u5bf8:</div><div class="file-size">'+soy.$$escapeHtml(Math.round(a.fileEntry.sizeInKB))+" KB</div>"+(null!=a.fileEntry.modifiedByFirstName?'<div class="modified-by-label">\u4fee\u6539\u4eba\uff1a</div><div class="modified-by">'+soy.$$escapeHtml(a.fileEntry.modifiedByFirstName)+" "+soy.$$escapeHtml(a.fileEntry.modifiedByLastName)+
"<br/>"+soy.$$escapeHtml(a.fileEntry.modifiedByEmail)+"<br/>"+soy.$$escapeHtml(a.fileEntry.modifiedOn)+"</div>":"")+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.fileDetails.soyTemplateName="SketchUpTemplates.fileDetails");SketchUpTemplates.loadingGif=function(a,b){return'<div class="loading-gif"><img src="images/loading.gif" /></div>'};goog.DEBUG&&(SketchUpTemplates.loadingGif.soyTemplateName="SketchUpTemplates.loadingGif");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});
SketchUpTemplates.taskTab=function(a,b){return'<div class="trimble-connect-tasks"></div>'};goog.DEBUG&&(SketchUpTemplates.taskTab.soyTemplateName="SketchUpTemplates.taskTab");SketchUpTemplates.topActionsBar=function(a,b){return'<div class="actions-bar"><div class="actions-button-container task-button selected" title=""><a class="tooltip below right"><img class="action-bar-button" src="images/dlg_task.svg" /><span>\u67e5\u770b\u6b64\u6a21\u578b\u7684\u5f85\u529e\u4e8b\u9879</span></a></div><div class="actions-button-container comments-button" title=""><a class="tooltip below right"><img class="action-bar-button" src="images/dlg_chat.svg" /><span>\u67e5\u770b\u6b64\u6a21\u578b\u7684\u6ce8\u91ca</span></a></div><div class="actions-button-container references-button" title=""><a class="tooltip below left"><img class="action-bar-button" src="images/dlg_reference.svg" /><span>\u7ba1\u7406\u53c2\u8003\u6a21\u578b</span></a></div><div class="actions-button-container connect-button" title=""><a class="tooltip below left"><img class="action-bar-button" src="images/tb_ConnectIconMono.svg" /><span>\u6253\u5f00 Trimble Connect</span></a></div></div>'};
goog.DEBUG&&(SketchUpTemplates.topActionsBar.soyTemplateName="SketchUpTemplates.topActionsBar");SketchUpTemplates.taskContent=function(a,b){return'<div class="tasks-content-wrapper"></div>'};goog.DEBUG&&(SketchUpTemplates.taskContent.soyTemplateName="SketchUpTemplates.taskContent");SketchUpTemplates.tasksList=function(a,b){return'<div class="task-list-container"><div class="task-list-top-bar top-bar"><div class="list-label">\u5f85\u529e\u4e8b\u9879</div><div class="actions-button-container filter-task-button invisible"><a class="tooltip below left"><img class="action-bar-button" src="images/tb_filter.svg" /><span>\u7b5b\u9009\u5f85\u529e\u4e8b\u9879\u5217\u8868</span></a></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.tasksList.soyTemplateName="SketchUpTemplates.tasksList");SketchUpTemplates.list=function(a,b){return"<ul></ul>"};goog.DEBUG&&(SketchUpTemplates.list.soyTemplateName="SketchUpTemplates.list");
SketchUpTemplates.taskEntry=function(a,b){var c='<li data-id="'+soy.$$escapeHtml(a.task.id)+'"><div class="task-list-item '+("CLOSED"==a.task.status?"closed-status":"")+'"><div class="task-list-user-icon-container">'+SketchUpTemplates.userThumbnail(a)+'</div><div class="task-list-item-name">'+soy.$$escapeHtml(a.task.description)+'</div><div class="task-list-priority-icon">';if("RESOLVED"==a.task.status)switch(a.task.priority){case "LOW":c+='<img class="priority-icon" src="images/tb_done_low.svg" />';
break;case "NORMAL":c+='<img class="priority-icon" src="images/tb_done_normal.svg" />';break;case "HIGH":c+='<img class="priority-icon" src="images/tb_done_high.svg" />';break;case "CRITICAL":c+='<img class="priority-icon" src="images/tb_done_critical.svg" />'}else switch(a.task.priority){case "LOW":c+='<img class="priority-icon" src="images/dlg_priority_low.svg" />';break;case "NORMAL":c+='<img class="priority-icon" src="images/dlg_priority_normal.svg" />';break;case "HIGH":c+='<img class="priority-icon" src="images/dlg_priority_high.svg" />';
break;case "CRITICAL":c+='<img class="priority-icon" src="images/dlg_priority_critical.svg" />'}return c+"</div></div></li>"};goog.DEBUG&&(SketchUpTemplates.taskEntry.soyTemplateName="SketchUpTemplates.taskEntry");SketchUpTemplates.emptyList=function(a,b){return'<li class="empty-list-message">'+soy.$$escapeHtml(a.message)+"</li>"};goog.DEBUG&&(SketchUpTemplates.emptyList.soyTemplateName="SketchUpTemplates.emptyList");
SketchUpTemplates.taskDetails=function(a,b){return'<div class="task-details-container"><div class="task-details-top-bar top-bar"><div class="list-label">'+("CREATE"==a.mode?"\u521b\u5efa\u5f85\u529e\u4e8b\u9879":"EDIT"==a.mode?"\u5f85\u529e\u4e8b\u9879":"")+'</div></div><div class="task-details"><div class="task-view-image-container"><img class="task-view-image invisible" src="images/tb_file.svg" /><div class="task-view-image-refresh-button actions-button-container invisible" title=""><a class="tooltip above left"><img class="refresh-image" src="images/tb_refresh.svg" /><span>\u66f4\u65b0\u6b64\u5f85\u529e\u4e8b\u9879\u89c6\u56fe</span></a></div></div><div class="task-name-and-description-container">'+
(a.task.label?'<div class="task-name-label">'+soy.$$escapeHtml(a.task.label)+'</div><input class="task-name-input" type="hidden" value="'+soy.$$escapeHtml(a.task.label)+'"/>':'<input class="task-name-input task-input" value="'+soy.$$escapeHtml(a.task.label)+'" placeholder="\u540d\u5b57\uff08\u9009\u586b\uff09:" />')+'<textarea class="task-description-input task-input" placeholder="\u8bf4\u660e\uff08\u5fc5\u586b\uff09\uff1a" />'+soy.$$escapeHtml(a.task.description)+'</textarea></div><div class="due-date-container"><div class="due-date-label">\u622a\u6b62\u65e5\u671f\uff1a</div><div class="due-date-input-container"><input type="date" '+
(a.task.displayDueDate?' value="'+soy.$$escapeHtml(a.task.displayDueDate)+'" ':"")+' class="due-date-input task-input"/></div></div>'+SketchUpTemplates.priorityInput({priority:a.task.priority})+SketchUpTemplates.statusInput({status:a.task.status})+'<div class="break-line"></div><div class="assign-container"><div class="assign-task-label">\u5206\u914d\u5230\uff1a</div><div class="assign-task-input-container"><input class="assign-task-input task-input" value="'+soy.$$escapeHtml(a.task.assigneesCSV)+
'" placeholder="\u5f00\u59cb\u952e\u5165\uff0c\u8fdb\u884c\u641c\u7d22..." /></div></div></div></div>'};goog.DEBUG&&(SketchUpTemplates.taskDetails.soyTemplateName="SketchUpTemplates.taskDetails");
SketchUpTemplates.priorityInput=function(a,b){return'<div class="priority-container"><div class="priority-label">\u4f18\u5148\u7ea7\uff1a</div><div class="priority-input-container"><select class="priority-input task-input"/><option value="CRITICAL"'+("CRITICAL"==a.priority?" selected ":"")+'>\u91cd\u8981</option><option value="HIGH"'+("HIGH"==a.priority?" selected ":"")+'>\u9ad8</option><option value="NORMAL"'+("NORMAL"==a.priority?" selected ":"")+'>\u666e\u901a</option><option value="LOW"'+("LOW"==
a.priority?" selected ":"")+">\u4f4e</option></select></div></div>"};goog.DEBUG&&(SketchUpTemplates.priorityInput.soyTemplateName="SketchUpTemplates.priorityInput");
SketchUpTemplates.statusInput=function(a,b){return'<div class="status-container"><div class="status-label">\u72b6\u6001:</div><div class="status-input-container"><select class="status-input task-input"/><option value="NEW"'+("NEW"==a.status?" selected ":"")+'>\u65b0\u5efa</option><option value="IN_PROGRESS"'+("IN_PROGRESS"==a.status?" selected ":"")+'>\u6b63\u5728\u8fdb\u884c</option><option value="BLOCKED"'+("BLOCKED"==a.status?" selected ":"")+'>\u6b63\u5728\u7b49\u5f85</option><option value="RESOLVED"'+
("RESOLVED"==a.status?" selected ":"")+'>\u5b8c\u6210</option><option value="CLOSED"'+("CLOSED"==a.status?" selected ":"")+">\u5173\u95ed</option></select></div></div>"};goog.DEBUG&&(SketchUpTemplates.statusInput.soyTemplateName="SketchUpTemplates.statusInput");
SketchUpTemplates.userSelect=function(a,b){for(var c='<div class="user-filter-container"><div class="user-label">\u7528\u6237\uff1a</div><div class="user-filter-input-container"><select class="user-filter-input task-input"/><option class="placeholder" value="" disabled selected>\u9009\u62e9\u7528\u6237</option><option value="None">\u672a\u6307\u5b9a</option>',f=a.users,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<option value="'+soy.$$escapeHtml(e)+'"'+(e==a.selectedUser?" selected ":"")+">"+soy.$$escapeHtml(e)+
"</option>");return c+"</select></div></div>"};goog.DEBUG&&(SketchUpTemplates.userSelect.soyTemplateName="SketchUpTemplates.userSelect");
SketchUpTemplates.taskFilterView=function(a,b){return'<div class="filter-view-container invisible"><div class="filter-view-top-bar"><div class="filter-view-label">\u8fc7\u6ee4\u5668</div><div class="filter-view-collapse-button action-button-container"><a class="tooltip below left"><img class="up-arrow-image" src="images/tb_more_arrow.svg" /><span>\u79fb\u9664\u7b5b\u9009\u5668</span></a></div></div>'+SketchUpTemplates.userSelect(a)+SketchUpTemplates.priorityInput(a)+SketchUpTemplates.statusInput(a)+
'<div class="sort-view-top-bar"><div class="sort-view-label">\u6392\u5e8f</div></div><div class="sort-input-container"><div class="sort-by-name-button actions-button-container"><a class="tooltip above right"><img class="sort-name-normal" src="images/tb_sort_name_decending.svg" /><img class="sort-name-reverse invisible" src="images/tb_sort_name_acending.svg" /><span>\u6309\u540d\u79f0\u6392\u5e8f</span></a></div><div class="sort-by-date-button actions-button-container"><a class="tooltip above right"><img class="sort-date-normal" src="images/tb_sort_date_decending.svg" /><img class="sort-date-reverse invisible" src="images/tb_sort_date_acending.svg" /><span>\u6309\u65e5\u671f\u6392\u5e8f</span></a></div><div class="sort-by-user-button actions-button-container"><a class="tooltip above left"><img class="sort-user-normal" src="images/tb_sort_user_decending.svg" /><img class="sort-user-reverse invisible" src="images/tb_sort_user_acending.svg" /><span>\u6309\u7528\u6237\u6392\u5e8f</span></a></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.taskFilterView.soyTemplateName="SketchUpTemplates.taskFilterView");SketchUpTemplates.captureView=function(a,b){return'<div class="capture-view-button-container"><div class="capture-view-button">\u6355\u6349\u89c6\u56fe</div></div>'};goog.DEBUG&&(SketchUpTemplates.captureView.soyTemplateName="SketchUpTemplates.captureView");
SketchUpTemplates.commitOrCancel=function(a,b){return'<div class="commit-cancel-container"><div class="cancel-button" title="'+soy.$$escapeHtml(a.cancelTooltip)+'"><div class="cancel-button-text">'+soy.$$escapeHtml(a.cancelText)+'</div></div><div class="commit-button" title="'+soy.$$escapeHtml(a.commitTooltip)+'"><div class="commit-button-text">'+soy.$$escapeHtml(a.commitText)+"</div></div></div>"};goog.DEBUG&&(SketchUpTemplates.commitOrCancel.soyTemplateName="SketchUpTemplates.commitOrCancel");
SketchUpTemplates.commentList=function(a,b){return'<div class="comment-list-container"><div class="comment-list-top-bar top-bar"><div class="list-label">\u6ce8\u91ca</div></div><ul></ul></div>'};goog.DEBUG&&(SketchUpTemplates.commentList.soyTemplateName="SketchUpTemplates.commentList");
SketchUpTemplates.taskCommentList=function(a,b){return'<div class="embedded-comment-list-container invisible"><div class="break-line"></div><div class="comment-list-label">\u8bc4\u8bba\u5f85\u529e\u4e8b\u9879\uff1a</div>'+SketchUpTemplates.commentInputField(a)+"<ul></ul>"+SketchUpTemplates.showMorePrompt(null)+"</div>"};goog.DEBUG&&(SketchUpTemplates.taskCommentList.soyTemplateName="SketchUpTemplates.taskCommentList");SketchUpTemplates.showMorePrompt=function(a,b){return'<div class="show-more invisible">\u66f4\u591a<img class="more-arrow" src="images/tb_more_arrow.svg" /></div>'};
goog.DEBUG&&(SketchUpTemplates.showMorePrompt.soyTemplateName="SketchUpTemplates.showMorePrompt");SketchUpTemplates.activeUserComment=function(a,b){return'<li class="active-user-comment-container"><div class="active-user-comment-bubble"><div class="active-user-comment-text">'+soy.$$escapeHtml(a.comment.description)+'</div><div class="active-user-comment-arrow"></div>'+SketchUpTemplates.commentDate(a)+"</div>"+SketchUpTemplates.userThumbnail(a)+"</li>"};
goog.DEBUG&&(SketchUpTemplates.activeUserComment.soyTemplateName="SketchUpTemplates.activeUserComment");SketchUpTemplates.userComment=function(a,b){return'<li class="user-comment-container">'+SketchUpTemplates.userThumbnail(a)+'<div class="user-comment-bubble"><div class="user-comment-arrow"></div><div class="user-comment-text">'+soy.$$escapeHtml(a.comment.description)+"</div>"+SketchUpTemplates.commentDate(a)+"</div></li>"};goog.DEBUG&&(SketchUpTemplates.userComment.soyTemplateName="SketchUpTemplates.userComment");
SketchUpTemplates.commentDate=function(a,b){return'<div class="comment-date">'+soy.$$escapeHtml(a.date)+"</div>"};goog.DEBUG&&(SketchUpTemplates.commentDate.soyTemplateName="SketchUpTemplates.commentDate");SketchUpTemplates.userThumbnail=function(a,b){return'<div class="user-icon" title="">'+(a.thumbnail?'<img src="'+soy.$$escapeHtml(a.thumbnail)+'" />':soy.$$escapeHtml(a.initials))+"</div>"};goog.DEBUG&&(SketchUpTemplates.userThumbnail.soyTemplateName="SketchUpTemplates.userThumbnail");
SketchUpTemplates.referenceList=function(a,b){return'<div class="ref-list-container"><div class="ref-list-top-bar top-bar"><div class="list-label">\u5f15\u7528</div></div><ul></ul></div>'};goog.DEBUG&&(SketchUpTemplates.referenceList.soyTemplateName="SketchUpTemplates.referenceList");
SketchUpTemplates.referenceEntry=function(a,b){return'<li id="'+soy.$$escapeHtml(a.reference.id)+'"><div class="ref-list-item"><div class="ref-list-icon-container">'+SketchUpTemplates.refThumbnail(a)+'</div><a class="tooltip below right"><div class="ref-list-item-name">'+soy.$$escapeHtml(a.reference.name)+'</div><span>\u5df2\u4ece Trimble Connect \u79fb\u9664\u6b64\u53c2\u8003\u6a21\u578b</span></a><div class="ref-update-button actions-button-container invisible"><a class="tooltip below left">'+SketchUpTemplates.downloadCloud(a)+
'<span>\u70b9\u51fb\u6b64\u5904\u4e0b\u8f7d\u8be5\u6a21\u578b\u7684\u6700\u65b0\u7248\u672c</span></a></div><div class="accordian-chevron"><img class="chevron-icon" src="images/dlg_chevron.svg" /></div></div></li>'};goog.DEBUG&&(SketchUpTemplates.referenceEntry.soyTemplateName="SketchUpTemplates.referenceEntry");SketchUpTemplates.refThumbnail=function(a,b){return""+(a.thumbnail?'<img class="ref-icon" src="'+soy.$$escapeHtml(a.thumbnail)+'" />':'<img class="ref-icon" src="images/tb_file.svg" />')};
goog.DEBUG&&(SketchUpTemplates.refThumbnail.soyTemplateName="SketchUpTemplates.refThumbnail");
SketchUpTemplates.refActionsBar=function(a,b){return'<div class="ref-actions-bar"><div class="ref-add-button actions-button-container"><a class="tooltip above right"><img src="images/tb_add_reference.svg" /><span>\u6dfb\u52a0\u65b0\u53c2\u8003\u6a21\u578b</span></a></div><div class="ref-delete-button actions-button-container"><a class="tooltip above left"><img src="images/tb_delete.svg" /><span>\u79fb\u9664\u9009\u5b9a\u53c2\u8003\u6a21\u578b</span></a></div><div class="ref-update-button actions-button-container"><a class="tooltip above left">'+SketchUpTemplates.downloadCloud(a)+
"<span>\u4e0b\u8f7d\u6240\u6709\u53c2\u8003\u6a21\u578b\u7684\u6700\u65b0\u7248\u672c</span></a></div><div>"};goog.DEBUG&&(SketchUpTemplates.refActionsBar.soyTemplateName="SketchUpTemplates.refActionsBar");SketchUpTemplates.taskActionsBar=function(a,b){return'<div class="task-actions-bar"><div class="actions-button-container create-task-button"><a class="tooltip above right"><img src="images/dlg_task_create.svg" /><span>\u4e3a\u6b64\u6a21\u578b\u65b0\u5efa\u5f85\u529e\u4e8b\u9879</span></a></div><div class="task-delete-button actions-button-container"><a class="tooltip above left"><img src="images/tb_delete.svg" /><span>\u5220\u9664\u9009\u5b9a\u7684\u5f85\u529e\u4e8b\u9879</span></a></div><div>'};
goog.DEBUG&&(SketchUpTemplates.taskActionsBar.soyTemplateName="SketchUpTemplates.taskActionsBar");SketchUpTemplates.commentInputBar=function(a,b){return'<div class="comment-input-bar">'+SketchUpTemplates.commentInputField(a)+"</div>"};goog.DEBUG&&(SketchUpTemplates.commentInputBar.soyTemplateName="SketchUpTemplates.commentInputBar");
SketchUpTemplates.commentInputField=function(a,b){return'<div class="comment-input-container"><textarea class="comment-input-field" placeholder="'+soy.$$escapeHtml(a.placeholder)+'" /></textarea><div class="actions-button-container publish-comment"><a class="tooltip above left"><img src="images/dlg_chat.svg" /><span>\u70b9\u51fb\u4ee5\u53d1\u5e03\u6ce8\u91ca</span></a></div></div>'};goog.DEBUG&&(SketchUpTemplates.commentInputField.soyTemplateName="SketchUpTemplates.commentInputField");
SketchUpTemplates.editAlignment=function(a,b){return'<div class="edit-alignment-container"><div class="alignment-editor-margins"><div class="align-button-container"><div class="align-button">\u4ea4\u4e92\u5f0f\u5bf9\u9f50</div></div><div class="alignment-label">\u4f4d\u7f6e</div>'+SketchUpTemplates.alignmentInput({color:"red",label:a.lengthUnit,value:a.position.x,className:"pos-x-input"})+SketchUpTemplates.alignmentInput({color:"green",label:a.lengthUnit,value:a.position.y,className:"pos-y-input"})+
SketchUpTemplates.alignmentInput({color:"blue",label:a.lengthUnit,value:a.position.z,className:"pos-z-input"})+'<div class="alignment-label">\u65cb\u8f6c</div>'+SketchUpTemplates.alignmentInput({color:"red",label:a.angleUnit,value:a.rotation.x,className:"rot-x-input"})+SketchUpTemplates.alignmentInput({color:"green",label:a.angleUnit,value:a.rotation.y,className:"rot-y-input"})+SketchUpTemplates.alignmentInput({color:"blue",label:a.angleUnit,value:a.rotation.z,className:"rot-z-input"})+'<div class="break-line"></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.editAlignment.soyTemplateName="SketchUpTemplates.editAlignment");SketchUpTemplates.alignmentInput=function(a,b){return'<div class="alignment-input-container"><input type="number" class="alignment-input '+soy.$$escapeHtml(a.className)+" "+soy.$$escapeHtml(a.color)+'" value="'+soy.$$escapeHtml(a.value)+'"/><div class="alignment-input-label-container">'+soy.$$escapeHtml(a.label)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.alignmentInput.soyTemplateName="SketchUpTemplates.alignmentInput");
SketchUpTemplates.authorDetails=function(a,b){return'<div class="author-details-container"><div class="author-label">'+soy.$$escapeHtml(a.data.label)+'</div><div class="author-user-icon-container">'+SketchUpTemplates.userThumbnail({thumbnail:a.data.thumbnail,initials:a.data.initials})+'</div><div class="author-name-time-wrapper"><p class="author-name">'+soy.$$escapeHtml(a.data.name)+'</p><p class="timestamp">'+soy.$$escapeHtml(a.data.timestamp)+"</p></div></div>"};
goog.DEBUG&&(SketchUpTemplates.authorDetails.soyTemplateName="SketchUpTemplates.authorDetails");SketchUpTemplates.listItemProgress=function(a,b){return'<div class="progress-div"><progress class="progress-bar" max="100" value="0"/></div>'};goog.DEBUG&&(SketchUpTemplates.listItemProgress.soyTemplateName="SketchUpTemplates.listItemProgress");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});SketchUpTemplates.tcViewer=function(a,b){return'<div class="trimble-connect-viewer"></div>'};
goog.DEBUG&&(SketchUpTemplates.tcViewer.soyTemplateName="SketchUpTemplates.tcViewer");