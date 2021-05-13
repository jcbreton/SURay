if("undefined"==typeof SketchUpTemplates)var SketchUpTemplates={};SketchUpTemplates.modelTitleInput=function(a,b){return'<div class="model-title-input-container"><input class="model-title-input" placeholder="Enter a model name here"/></div>'};goog.DEBUG&&(SketchUpTemplates.modelTitleInput.soyTemplateName="SketchUpTemplates.modelTitleInput");SketchUpTemplates.progressDialog=function(a,b){return'<div class="progress-dialog-div"><progress class="progress-dialog-progress-bar" max="100" value="0"/></div>'};
goog.DEBUG&&(SketchUpTemplates.progressDialog.soyTemplateName="SketchUpTemplates.progressDialog");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});SketchUpTemplates.leftSidebar=function(a,b){return'<div class="left-sidebar"><div class="left-tab close-tab"><img src="images/tb_left_arrow.svg" title="Sz\u00e9ls\u0151 men\u00fc elrejt\u00e9se (Esc)" /></div><div class="hidden-while-not-expanded"><div class="left-tab user-account-tab" title="Felhaszn\u00e1l\u00f3i adatok"><img src="images/tb_user_default.svg" /></div><div class="left-tab new-model-tab" title="\u00daj modell l\u00e9trehoz\u00e1sa sablonb\u00f3l"><img src="images/tb_new_web.svg" /></div><div class="left-tab connect-tab selected-left-tab" title="Nyissa meg a modellt a Trimble Connect-b\u00f3l"><img src="images/tb_ConnectIconMono.svg" /></div><div class="left-tab geolocation-tab" title="Hely hozz\u00e1ad\u00e1sa"><img src="images/tb_geolocation.svg" /></div><div class="left-tab modelinfo-tab" title="Modell Info"><img src="images/tb_modelinfo.svg" /></div></div><div id="left-sidebar-toolbar"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebar.soyTemplateName="SketchUpTemplates.leftSidebar");SketchUpTemplates.leftSidebarConnectTab=function(a,b){return'<div class="left-sidebar-container"><div class="trimble-connect-header"><img src="images/trimble_connect_logo_and_text.png" /><div class="upgrade-account-link invisible">Account friss\u00edt\u00e9se</div></div><div class="trimble-connect-content"></div><div class="save-new-model-container invisible"><div class="name-label">N\u00e9v:</div><input class="save-new-model-input" placeholder="Enter a model name here"/><div class="save-here-button disabled-button">Tegye k\u00f6zz\u00e9 a modellt</div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarConnectTab.soyTemplateName="SketchUpTemplates.leftSidebarConnectTab");
SketchUpTemplates.leftSidebarUserAccountTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="user-account-content"><div class="login-content"><div class="login-picture-container">'+(a.loginInfo.image?'<img class="login-picture" src="'+soy.$$escapeHtml(a.loginInfo.image)+'" />':'<img class="login-picture blank-profile-image" src="images/tb_generic_user_picture.svg" />')+'</div><div class="login-name-container"><div class="login-firstname">'+soy.$$escapeHtml(a.loginInfo.firstname)+
" "+soy.$$escapeHtml(a.loginInfo.lastname)+'</div><div class="login-email">'+soy.$$escapeHtml(a.loginInfo.email)+'</div><div class="logout-button">Kijelentkez\u00e9s</div></div></div></div></div>'};goog.DEBUG&&(SketchUpTemplates.leftSidebarUserAccountTab.soyTemplateName="SketchUpTemplates.leftSidebarUserAccountTab");SketchUpTemplates.leftSidebarNewModelTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="new-model-content"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarNewModelTab.soyTemplateName="SketchUpTemplates.leftSidebarNewModelTab");SketchUpTemplates.leftSidebarGeolocationTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="geolocation-content">'+SketchUpTemplates.loadingGif(null)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.leftSidebarGeolocationTab.soyTemplateName="SketchUpTemplates.leftSidebarGeolocationTab");SketchUpTemplates.leftSidebarModelInfoTab=function(a,b){return'<div class="left-sidebar-container left-sidebar-hidden"><div class="modelinfo-content"></div></div>'};
goog.DEBUG&&(SketchUpTemplates.leftSidebarModelInfoTab.soyTemplateName="SketchUpTemplates.leftSidebarModelInfoTab");
SketchUpTemplates.projectInstance=function(a,b){return'<li data-projectName="'+soy.$$escapeHtml(a.project.name)+'" data-projectId="'+soy.$$escapeHtml(a.project.id)+'" data-projectRegion="'+soy.$$escapeHtml(a.project.region)+'" data-projectFolder="'+soy.$$escapeHtml(a.project.rootFolderId)+'"><div class="project-view"><div class="project-thumbnail">'+SketchUpTemplates.thumbnailImage(a.project)+'</div><div class="project-description"><div class="project-title"><span>'+soy.$$escapeHtml(a.project.name)+
"</span></div></div></div></li>"};goog.DEBUG&&(SketchUpTemplates.projectInstance.soyTemplateName="SketchUpTemplates.projectInstance");SketchUpTemplates.projectsView=function(a,b){return'<div class="projects-view"><div class="connect-section-title"><span class="projects-link">Projektek</span></div><div class="actions-bar"><div class="create-project-button invisible">Projekt l\u00e9trehoz\u00e1sa</div><div class="right-aligned-actions">'+SketchUpTemplates.syncButton(null)+'</div></div><div class="connect-scrollable-content"><div class="projects-section"><ul></ul></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.projectsView.soyTemplateName="SketchUpTemplates.projectsView");
SketchUpTemplates.fileEntry=function(a,b){return'<li data-id="'+soy.$$escapeHtml(a.fileEntry.remoteId)+'"><div class="connect-file-entry"><div class="connect-file-thumbnail">'+SketchUpTemplates.thumbnailImage(a.fileEntry)+"</div>"+(a.isFolder?'<div class="connect-foldername">':'<div class="connect-filename">')+soy.$$escapeHtml(a.fileEntry.name)+'</div><div class="file-sync-widgets-container"><div class="file-sync-progress-div invisible"><progress class="file-sync-progress" max="100" value="0"/></div><div class="file-sync-actions-div invisible">'+SketchUpTemplates.downloadCloud(a.hasConflict)+
'<img class="upload-cloud" src="images/tb_UploadCloud.svg" title="'+(a.hasConflict?"Ez a modell olyan m\u00f3dos\u00edt\u00e1sokat tartalmaz, amik ellent mondanak a Trimble Connecten l\u00e9v\u0151 verzi\u00f3val. Kattintson ide, hogy felt\u00f6ltse a helyi m\u00f3dos\u00edt\u00e1sokat.":"Kattintson ide, hogy felt\u00f6ltse a helyi m\u00f3dos\u00edt\u00e1sokat.")+'" /></div><a class="tooltip below left"><img class="close-button visibility-none" title="" src="images/wi_close.svg" /><span>Kattintson ide, hogy t\u00f6r\u00f6lje ezt az elemet</span></a></div></div></li>'};
goog.DEBUG&&(SketchUpTemplates.fileEntry.soyTemplateName="SketchUpTemplates.fileEntry");SketchUpTemplates.downloadCloud=function(a,b){return'<img class="download-cloud" src="images/tb_DownloadCloud.svg" title="" />'};goog.DEBUG&&(SketchUpTemplates.downloadCloud.soyTemplateName="SketchUpTemplates.downloadCloud");
SketchUpTemplates.projectFileView=function(a,b){for(var c='<div class="file-view"><div class="connect-section-title"><span class="projects-link">Projektek</span>&nbsp; > &nbsp;',f=a.ancestorList,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<span class="folder-link" data-folderId="'+soy.$$escapeHtml(e.id)+'">'+soy.$$escapeHtml(e.name)+"</span>"+(d!=g-1?"&nbsp; > &nbsp;":""));return c+('</div><div class="actions-bar"><div class="add-file-button invisible" title="Adjunk hozz\u00e1 egy \u00faj modellt ebben a mapp\u00e1ban"><img src="images/tb_add_model.svg" />Modell hozz\u00e1ad\u00e1sa</div><a class="tooltip below right"><div class="add-folder-button" title=""><img src="images/tb_add_folder.svg" />\u00daj Mappa</div><span>Hozzon l\u00e9tre egy \u00faj mapp\u00e1t itt</span></a><div class="right-aligned-actions">'+
SketchUpTemplates.syncButton(null)+'</div></div><div class="connect-scrollable-content"><div class="file-tree"><ul></ul></div></div></div>')};goog.DEBUG&&(SketchUpTemplates.projectFileView.soyTemplateName="SketchUpTemplates.projectFileView");SketchUpTemplates.syncButton=function(a,b){return'<div class="sync-button visibility-none" title="Az \u00f6sszes modell szinkroniz\u00e1l\u00e1sa a Trimble Connect-tel" ><img class="static-image" src="images/tb_syncing_cloud.svg" /><img class="spinny-image invisible" src="images/loading.gif" />\u00d6sszes szinkroniz\u00e1l\u00e1sa</div>'};
goog.DEBUG&&(SketchUpTemplates.syncButton.soyTemplateName="SketchUpTemplates.syncButton");SketchUpTemplates.importPage=function(a,b){return'<div class="left-details-content"></div>'};goog.DEBUG&&(SketchUpTemplates.importPage.soyTemplateName="SketchUpTemplates.importPage");
SketchUpTemplates.fileDetailsPage=function(a,b){return'<div class="left-file-details-header"><div class="header-title">R\u00e9szletek</div></div><div class="left-details-content">'+SketchUpTemplates.fileDetails(a)+'</div><div class="left-details-bottom-action-bar"><div class="bottom-button">'+soy.$$escapeHtml(a.buttonName)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.fileDetailsPage.soyTemplateName="SketchUpTemplates.fileDetailsPage");SketchUpTemplates.detailsView=function(a,b){return'<div class="left-details-view"></div>'};
goog.DEBUG&&(SketchUpTemplates.detailsView.soyTemplateName="SketchUpTemplates.detailsView");
SketchUpTemplates.importTemplates=function(a,b){for(var c='<div class="import-templates-container"><ul>',f=a.skpFiles,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<li data-filepath="'+soy.$$escapeHtml(e.path)+'"><div class="thumbnail"><img src="data:image/bmp;base64,'+soy.$$escapeHtml(e.thumbnail)+'"></div><div class="file-description"><div class="name">'+soy.$$escapeHtml(e.name)+'</div><div class="units">Units: '+soy.$$escapeHtml(e.units)+'</div><div class="description">'+soy.$$escapeHtml(e.description)+
"</div></div></li>");return c+"</ul></div>"};goog.DEBUG&&(SketchUpTemplates.importTemplates.soyTemplateName="SketchUpTemplates.importTemplates");SketchUpTemplates.importLocal=function(a,b){return'<div class="import-local-container"><div class="import-text-container"><div class="preview-thumbnail"></div><div class="import-text">H\u00fazza a modellt tetsz\u0151leges hely\u00e9re a k\u00e9perny\u0151n, vagy kattintson a Tall\u00f3z\u00e1s gombra</div><div class="upload-button-container"><div class="upload-button">B\u00f6ng\u00e9sz\u00e9s<input type="file" id="system-file-browser" onclick="event.stopPropagation(); "/></div></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.importLocal.soyTemplateName="SketchUpTemplates.importLocal");SketchUpTemplates.thumbnailImage=function(a,b){return""+(a.thumbnailData?'<img src="data:image/bmp;base64,'+soy.$$escapeHtml(a.thumbnailData)+'" />':'<img src="'+soy.$$escapeHtml(a.thumbnailURL)+'" />')};goog.DEBUG&&(SketchUpTemplates.thumbnailImage.soyTemplateName="SketchUpTemplates.thumbnailImage");SketchUpTemplates.dragArea=function(a,b){return'<div class="dragarea visibility-none">Tedd ide a f\u00e1jlokat</div>'};
goog.DEBUG&&(SketchUpTemplates.dragArea.soyTemplateName="SketchUpTemplates.dragArea");
SketchUpTemplates.fileDetails=function(a,b){return'<div class="connect-file-details"><div class="connect-file-thumbnail">'+SketchUpTemplates.thumbnailImage(a.fileEntry)+'</div><div class="details-container"><div class="details-filename-label">N\u00e9v:</div><div class="details-filename">'+soy.$$escapeHtml(a.fileEntry.name)+"</div>"+(null!=a.fileEntry.createdByFirstName?'<div class="created-by-label">L\u00e9trehozva, n\u00e9v:</div><div class="created-by">'+soy.$$escapeHtml(a.fileEntry.createdByFirstName)+
" "+soy.$$escapeHtml(a.fileEntry.createdByLastName)+"<br/>"+soy.$$escapeHtml(a.fileEntry.createdByEmail)+"<br/>"+soy.$$escapeHtml(a.fileEntry.createdOn)+"</div>":"")+'<div class="file-size-label">M\u00e9ret:</div><div class="file-size">'+soy.$$escapeHtml(Math.round(a.fileEntry.sizeInKB))+" KB</div>"+(null!=a.fileEntry.modifiedByFirstName?'<div class="modified-by-label">M\u00f3dos\u00edtotta:</div><div class="modified-by">'+soy.$$escapeHtml(a.fileEntry.modifiedByFirstName)+" "+soy.$$escapeHtml(a.fileEntry.modifiedByLastName)+
"<br/>"+soy.$$escapeHtml(a.fileEntry.modifiedByEmail)+"<br/>"+soy.$$escapeHtml(a.fileEntry.modifiedOn)+"</div>":"")+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.fileDetails.soyTemplateName="SketchUpTemplates.fileDetails");SketchUpTemplates.loadingGif=function(a,b){return'<div class="loading-gif"><img src="images/loading.gif" /></div>'};goog.DEBUG&&(SketchUpTemplates.loadingGif.soyTemplateName="SketchUpTemplates.loadingGif");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});
SketchUpTemplates.taskTab=function(a,b){return'<div class="trimble-connect-tasks"></div>'};goog.DEBUG&&(SketchUpTemplates.taskTab.soyTemplateName="SketchUpTemplates.taskTab");SketchUpTemplates.topActionsBar=function(a,b){return'<div class="actions-bar"><div class="actions-button-container task-button selected" title=""><a class="tooltip below right"><img class="action-bar-button" src="images/dlg_task.svg" /><span>ToDo-k megtekint\u00e9se ehhez a modellhez</span></a></div><div class="actions-button-container comments-button" title=""><a class="tooltip below right"><img class="action-bar-button" src="images/dlg_chat.svg" /><span>Hozz\u00e1sz\u00f3l\u00e1sok megtekint\u00e9se erre a modellre</span></a></div><div class="actions-button-container references-button" title=""><a class="tooltip below left"><img class="action-bar-button" src="images/dlg_reference.svg" /><span>Referencia modellek haszn\u00e1lata</span></a></div><div class="actions-button-container connect-button" title=""><a class="tooltip below left"><img class="action-bar-button" src="images/tb_ConnectIconMono.svg" /><span>Nyissa meg a Trimble Connect-et</span></a></div></div>'};
goog.DEBUG&&(SketchUpTemplates.topActionsBar.soyTemplateName="SketchUpTemplates.topActionsBar");SketchUpTemplates.taskContent=function(a,b){return'<div class="tasks-content-wrapper"></div>'};goog.DEBUG&&(SketchUpTemplates.taskContent.soyTemplateName="SketchUpTemplates.taskContent");SketchUpTemplates.tasksList=function(a,b){return'<div class="task-list-container"><div class="task-list-top-bar top-bar"><div class="list-label">ToDo-k</div><div class="actions-button-container filter-task-button invisible"><a class="tooltip below left"><img class="action-bar-button" src="images/tb_filter.svg" /><span>Sz\u0171r\u0151 ToDo lista</span></a></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.tasksList.soyTemplateName="SketchUpTemplates.tasksList");SketchUpTemplates.list=function(a,b){return"<ul></ul>"};goog.DEBUG&&(SketchUpTemplates.list.soyTemplateName="SketchUpTemplates.list");
SketchUpTemplates.taskEntry=function(a,b){var c='<li data-id="'+soy.$$escapeHtml(a.task.id)+'"><div class="task-list-item '+("CLOSED"==a.task.status?"closed-status":"")+'"><div class="task-list-user-icon-container">'+SketchUpTemplates.userThumbnail(a)+'</div><div class="task-list-item-name">'+soy.$$escapeHtml(a.task.description)+'</div><div class="task-list-priority-icon">';if("RESOLVED"==a.task.status)switch(a.task.priority){case "LOW":c+='<img class="priority-icon" src="images/tb_done_low.svg" />';
break;case "NORMAL":c+='<img class="priority-icon" src="images/tb_done_normal.svg" />';break;case "HIGH":c+='<img class="priority-icon" src="images/tb_done_high.svg" />';break;case "CRITICAL":c+='<img class="priority-icon" src="images/tb_done_critical.svg" />'}else switch(a.task.priority){case "LOW":c+='<img class="priority-icon" src="images/dlg_priority_low.svg" />';break;case "NORMAL":c+='<img class="priority-icon" src="images/dlg_priority_normal.svg" />';break;case "HIGH":c+='<img class="priority-icon" src="images/dlg_priority_high.svg" />';
break;case "CRITICAL":c+='<img class="priority-icon" src="images/dlg_priority_critical.svg" />'}return c+"</div></div></li>"};goog.DEBUG&&(SketchUpTemplates.taskEntry.soyTemplateName="SketchUpTemplates.taskEntry");SketchUpTemplates.emptyList=function(a,b){return'<li class="empty-list-message">'+soy.$$escapeHtml(a.message)+"</li>"};goog.DEBUG&&(SketchUpTemplates.emptyList.soyTemplateName="SketchUpTemplates.emptyList");
SketchUpTemplates.taskDetails=function(a,b){return'<div class="task-details-container"><div class="task-details-top-bar top-bar"><div class="list-label">'+("CREATE"==a.mode?"ToDo k\u00e9sz\u00edt\u00e9s":"EDIT"==a.mode?"ToDo":"")+'</div></div><div class="task-details"><div class="task-view-image-container"><img class="task-view-image invisible" src="images/tb_file.svg" /><div class="task-view-image-refresh-button actions-button-container invisible" title=""><a class="tooltip above left"><img class="refresh-image" src="images/tb_refresh.svg" /><span>N\u00e9zet friss\u00edt\u00e9se ennek a ToDo-nak</span></a></div></div><div class="task-name-and-description-container">'+
(a.task.label?'<div class="task-name-label">'+soy.$$escapeHtml(a.task.label)+'</div><input class="task-name-input" type="hidden" value="'+soy.$$escapeHtml(a.task.label)+'"/>':'<input class="task-name-input task-input" value="'+soy.$$escapeHtml(a.task.label)+'" placeholder="N\u00e9v (opcion\u00e1lis):" />')+'<textarea class="task-description-input task-input" placeholder="Le\u00edr\u00e1s (k\u00f6telez\u0151):" />'+soy.$$escapeHtml(a.task.description)+'</textarea></div><div class="due-date-container"><div class="due-date-label">Hat\u00e1rid\u0151:</div><div class="due-date-input-container"><input type="date" '+
(a.task.displayDueDate?' value="'+soy.$$escapeHtml(a.task.displayDueDate)+'" ':"")+' class="due-date-input task-input"/></div></div>'+SketchUpTemplates.priorityInput({priority:a.task.priority})+SketchUpTemplates.statusInput({status:a.task.status})+'<div class="break-line"></div><div class="assign-container"><div class="assign-task-label">Hozz\u00e1rendel\u00e9s:</div><div class="assign-task-input-container"><input class="assign-task-input task-input" value="'+soy.$$escapeHtml(a.task.assigneesCSV)+
'" placeholder="Kezdj g\u00e9pelni a keres\u00e9shez..." /></div></div></div></div>'};goog.DEBUG&&(SketchUpTemplates.taskDetails.soyTemplateName="SketchUpTemplates.taskDetails");
SketchUpTemplates.priorityInput=function(a,b){return'<div class="priority-container"><div class="priority-label">Priorit\u00e1s:</div><div class="priority-input-container"><select class="priority-input task-input"/><option value="CRITICAL"'+("CRITICAL"==a.priority?" selected ":"")+'>Kritikus</option><option value="HIGH"'+("HIGH"==a.priority?" selected ":"")+'>Magas</option><option value="NORMAL"'+("NORMAL"==a.priority?" selected ":"")+'>Normal</option><option value="LOW"'+("LOW"==a.priority?" selected ":
"")+">Alacsony</option></select></div></div>"};goog.DEBUG&&(SketchUpTemplates.priorityInput.soyTemplateName="SketchUpTemplates.priorityInput");
SketchUpTemplates.statusInput=function(a,b){return'<div class="status-container"><div class="status-label">St\u00e1tusz:</div><div class="status-input-container"><select class="status-input task-input"/><option value="NEW"'+("NEW"==a.status?" selected ":"")+'>\u00daj</option><option value="IN_PROGRESS"'+("IN_PROGRESS"==a.status?" selected ":"")+'>Folyamatban l\u00e9v\u0151</option><option value="BLOCKED"'+("BLOCKED"==a.status?" selected ":"")+'>V\u00e1r</option><option value="RESOLVED"'+("RESOLVED"==
a.status?" selected ":"")+'>K\u00e9sz</option><option value="CLOSED"'+("CLOSED"==a.status?" selected ":"")+">Bez\u00e1rt</option></select></div></div>"};goog.DEBUG&&(SketchUpTemplates.statusInput.soyTemplateName="SketchUpTemplates.statusInput");
SketchUpTemplates.userSelect=function(a,b){for(var c='<div class="user-filter-container"><div class="user-label">Felhaszn\u00e1l\u00f3:</div><div class="user-filter-input-container"><select class="user-filter-input task-input"/><option class="placeholder" value="" disabled selected>V\u00e1lassza ki a felhaszn\u00e1l\u00f3t</option><option value="None">Unassigned</option>',f=a.users,g=f.length,d=0;d<g;d++)var e=f[d],c=c+('<option value="'+soy.$$escapeHtml(e)+'"'+(e==a.selectedUser?" selected ":"")+
">"+soy.$$escapeHtml(e)+"</option>");return c+"</select></div></div>"};goog.DEBUG&&(SketchUpTemplates.userSelect.soyTemplateName="SketchUpTemplates.userSelect");
SketchUpTemplates.taskFilterView=function(a,b){return'<div class="filter-view-container invisible"><div class="filter-view-top-bar"><div class="filter-view-label">Sz\u0171r\u0151</div><div class="filter-view-collapse-button action-button-container"><a class="tooltip below left"><img class="up-arrow-image" src="images/tb_more_arrow.svg" /><span>T\u00e1vol\u00edtsa el a sz\u0171r\u0151ket</span></a></div></div>'+SketchUpTemplates.userSelect(a)+SketchUpTemplates.priorityInput(a)+SketchUpTemplates.statusInput(a)+
'<div class="sort-view-top-bar"><div class="sort-view-label">Rendez\u00e9s</div></div><div class="sort-input-container"><div class="sort-by-name-button actions-button-container"><a class="tooltip above right"><img class="sort-name-normal" src="images/tb_sort_name_decending.svg" /><img class="sort-name-reverse invisible" src="images/tb_sort_name_acending.svg" /><span>N\u00e9v szerinti rendez\u00e9s</span></a></div><div class="sort-by-date-button actions-button-container"><a class="tooltip above right"><img class="sort-date-normal" src="images/tb_sort_date_decending.svg" /><img class="sort-date-reverse invisible" src="images/tb_sort_date_acending.svg" /><span>D\u00e1tum szerinti rendez\u00e9s</span></a></div><div class="sort-by-user-button actions-button-container"><a class="tooltip above left"><img class="sort-user-normal" src="images/tb_sort_user_decending.svg" /><img class="sort-user-reverse invisible" src="images/tb_sort_user_acending.svg" /><span>Rendez\u00e9s felhaszn\u00e1l\u00f3k szerint</span></a></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.taskFilterView.soyTemplateName="SketchUpTemplates.taskFilterView");SketchUpTemplates.captureView=function(a,b){return'<div class="capture-view-button-container"><div class="capture-view-button">L\u00e1tv\u00e1ny fot\u00f3z\u00e1sa</div></div>'};goog.DEBUG&&(SketchUpTemplates.captureView.soyTemplateName="SketchUpTemplates.captureView");
SketchUpTemplates.commitOrCancel=function(a,b){return'<div class="commit-cancel-container"><div class="cancel-button" title="'+soy.$$escapeHtml(a.cancelTooltip)+'"><div class="cancel-button-text">'+soy.$$escapeHtml(a.cancelText)+'</div></div><div class="commit-button" title="'+soy.$$escapeHtml(a.commitTooltip)+'"><div class="commit-button-text">'+soy.$$escapeHtml(a.commitText)+"</div></div></div>"};goog.DEBUG&&(SketchUpTemplates.commitOrCancel.soyTemplateName="SketchUpTemplates.commitOrCancel");
SketchUpTemplates.commentList=function(a,b){return'<div class="comment-list-container"><div class="comment-list-top-bar top-bar"><div class="list-label">Megjegyz\u00e9s</div></div><ul></ul></div>'};goog.DEBUG&&(SketchUpTemplates.commentList.soyTemplateName="SketchUpTemplates.commentList");
SketchUpTemplates.taskCommentList=function(a,b){return'<div class="embedded-comment-list-container invisible"><div class="break-line"></div><div class="comment-list-label">Megjegyz\u00e9s a ToDo-ra:</div>'+SketchUpTemplates.commentInputField(a)+"<ul></ul>"+SketchUpTemplates.showMorePrompt(null)+"</div>"};goog.DEBUG&&(SketchUpTemplates.taskCommentList.soyTemplateName="SketchUpTemplates.taskCommentList");SketchUpTemplates.showMorePrompt=function(a,b){return'<div class="show-more invisible">T\u00f6bb<img class="more-arrow" src="images/tb_more_arrow.svg" /></div>'};
goog.DEBUG&&(SketchUpTemplates.showMorePrompt.soyTemplateName="SketchUpTemplates.showMorePrompt");SketchUpTemplates.activeUserComment=function(a,b){return'<li class="active-user-comment-container"><div class="active-user-comment-bubble"><div class="active-user-comment-text">'+soy.$$escapeHtml(a.comment.description)+'</div><div class="active-user-comment-arrow"></div>'+SketchUpTemplates.commentDate(a)+"</div>"+SketchUpTemplates.userThumbnail(a)+"</li>"};
goog.DEBUG&&(SketchUpTemplates.activeUserComment.soyTemplateName="SketchUpTemplates.activeUserComment");SketchUpTemplates.userComment=function(a,b){return'<li class="user-comment-container">'+SketchUpTemplates.userThumbnail(a)+'<div class="user-comment-bubble"><div class="user-comment-arrow"></div><div class="user-comment-text">'+soy.$$escapeHtml(a.comment.description)+"</div>"+SketchUpTemplates.commentDate(a)+"</div></li>"};goog.DEBUG&&(SketchUpTemplates.userComment.soyTemplateName="SketchUpTemplates.userComment");
SketchUpTemplates.commentDate=function(a,b){return'<div class="comment-date">'+soy.$$escapeHtml(a.date)+"</div>"};goog.DEBUG&&(SketchUpTemplates.commentDate.soyTemplateName="SketchUpTemplates.commentDate");SketchUpTemplates.userThumbnail=function(a,b){return'<div class="user-icon" title="">'+(a.thumbnail?'<img src="'+soy.$$escapeHtml(a.thumbnail)+'" />':soy.$$escapeHtml(a.initials))+"</div>"};goog.DEBUG&&(SketchUpTemplates.userThumbnail.soyTemplateName="SketchUpTemplates.userThumbnail");
SketchUpTemplates.referenceList=function(a,b){return'<div class="ref-list-container"><div class="ref-list-top-bar top-bar"><div class="list-label">Referencia</div></div><ul></ul></div>'};goog.DEBUG&&(SketchUpTemplates.referenceList.soyTemplateName="SketchUpTemplates.referenceList");
SketchUpTemplates.referenceEntry=function(a,b){return'<li id="'+soy.$$escapeHtml(a.reference.id)+'"><div class="ref-list-item"><div class="ref-list-icon-container">'+SketchUpTemplates.refThumbnail(a)+'</div><a class="tooltip below right"><div class="ref-list-item-name">'+soy.$$escapeHtml(a.reference.name)+'</div><span>A referenciamodell t\u00f6r\u00f6lve lett a Trimble Connect-b\u0151l</span></a><div class="ref-update-button actions-button-container invisible"><a class="tooltip below left">'+SketchUpTemplates.downloadCloud(a)+
'<span>Ide kattintva let\u00f6ltheti a modell leg\u00fajabb verzi\u00f3j\u00e1t</span></a></div><div class="accordian-chevron"><img class="chevron-icon" src="images/dlg_chevron.svg" /></div></div></li>'};goog.DEBUG&&(SketchUpTemplates.referenceEntry.soyTemplateName="SketchUpTemplates.referenceEntry");SketchUpTemplates.refThumbnail=function(a,b){return""+(a.thumbnail?'<img class="ref-icon" src="'+soy.$$escapeHtml(a.thumbnail)+'" />':'<img class="ref-icon" src="images/tb_file.svg" />')};
goog.DEBUG&&(SketchUpTemplates.refThumbnail.soyTemplateName="SketchUpTemplates.refThumbnail");
SketchUpTemplates.refActionsBar=function(a,b){return'<div class="ref-actions-bar"><div class="ref-add-button actions-button-container"><a class="tooltip above right"><img src="images/tb_add_reference.svg" /><span>Adjunk hozz\u00e1 egy \u00faj referenciamodellt</span></a></div><div class="ref-delete-button actions-button-container"><a class="tooltip above left"><img src="images/tb_delete.svg" /><span>T\u00e1vol\u00edtsa el a kiv\u00e1lasztott referencia modellt</span></a></div><div class="ref-update-button actions-button-container"><a class="tooltip above left">'+SketchUpTemplates.downloadCloud(a)+
"<span>T\u00f6ltse le a leg\u00fajabb v\u00e1ltozatot az \u00f6sszes referencia modellhez</span></a></div><div>"};goog.DEBUG&&(SketchUpTemplates.refActionsBar.soyTemplateName="SketchUpTemplates.refActionsBar");SketchUpTemplates.taskActionsBar=function(a,b){return'<div class="task-actions-bar"><div class="actions-button-container create-task-button"><a class="tooltip above right"><img src="images/dlg_task_create.svg" /><span>Hozzon l\u00e9tre egy \u00faj ToDo-t ehhez a modellhez</span></a></div><div class="task-delete-button actions-button-container"><a class="tooltip above left"><img src="images/tb_delete.svg" /><span>Kiv\u00e1lasztott ToDo-k t\u00f6rl\u00e9se</span></a></div><div>'};
goog.DEBUG&&(SketchUpTemplates.taskActionsBar.soyTemplateName="SketchUpTemplates.taskActionsBar");SketchUpTemplates.commentInputBar=function(a,b){return'<div class="comment-input-bar">'+SketchUpTemplates.commentInputField(a)+"</div>"};goog.DEBUG&&(SketchUpTemplates.commentInputBar.soyTemplateName="SketchUpTemplates.commentInputBar");
SketchUpTemplates.commentInputField=function(a,b){return'<div class="comment-input-container"><textarea class="comment-input-field" placeholder="'+soy.$$escapeHtml(a.placeholder)+'" /></textarea><div class="actions-button-container publish-comment"><a class="tooltip above left"><img src="images/dlg_chat.svg" /><span>Kattintson a gombra, hogy tegye k\u00f6zz\u00e9 a hozz\u00e1sz\u00f3l\u00e1st</span></a></div></div>'};goog.DEBUG&&(SketchUpTemplates.commentInputField.soyTemplateName="SketchUpTemplates.commentInputField");
SketchUpTemplates.editAlignment=function(a,b){return'<div class="edit-alignment-container"><div class="alignment-editor-margins"><div class="align-button-container"><div class="align-button">Interakt\u00edv igaz\u00edt\u00e1sa</div></div><div class="alignment-label">Poz\u00edci\u00f3</div>'+SketchUpTemplates.alignmentInput({color:"red",label:a.lengthUnit,value:a.position.x,className:"pos-x-input"})+SketchUpTemplates.alignmentInput({color:"green",label:a.lengthUnit,value:a.position.y,className:"pos-y-input"})+
SketchUpTemplates.alignmentInput({color:"blue",label:a.lengthUnit,value:a.position.z,className:"pos-z-input"})+'<div class="alignment-label">Forgat\u00e1s</div>'+SketchUpTemplates.alignmentInput({color:"red",label:a.angleUnit,value:a.rotation.x,className:"rot-x-input"})+SketchUpTemplates.alignmentInput({color:"green",label:a.angleUnit,value:a.rotation.y,className:"rot-y-input"})+SketchUpTemplates.alignmentInput({color:"blue",label:a.angleUnit,value:a.rotation.z,className:"rot-z-input"})+'<div class="break-line"></div></div></div>'};
goog.DEBUG&&(SketchUpTemplates.editAlignment.soyTemplateName="SketchUpTemplates.editAlignment");SketchUpTemplates.alignmentInput=function(a,b){return'<div class="alignment-input-container"><input type="number" class="alignment-input '+soy.$$escapeHtml(a.className)+" "+soy.$$escapeHtml(a.color)+'" value="'+soy.$$escapeHtml(a.value)+'"/><div class="alignment-input-label-container">'+soy.$$escapeHtml(a.label)+"</div></div>"};goog.DEBUG&&(SketchUpTemplates.alignmentInput.soyTemplateName="SketchUpTemplates.alignmentInput");
SketchUpTemplates.authorDetails=function(a,b){return'<div class="author-details-container"><div class="author-label">'+soy.$$escapeHtml(a.data.label)+'</div><div class="author-user-icon-container">'+SketchUpTemplates.userThumbnail({thumbnail:a.data.thumbnail,initials:a.data.initials})+'</div><div class="author-name-time-wrapper"><p class="author-name">'+soy.$$escapeHtml(a.data.name)+'</p><p class="timestamp">'+soy.$$escapeHtml(a.data.timestamp)+"</p></div></div>"};
goog.DEBUG&&(SketchUpTemplates.authorDetails.soyTemplateName="SketchUpTemplates.authorDetails");SketchUpTemplates.listItemProgress=function(a,b){return'<div class="progress-div"><progress class="progress-bar" max="100" value="0"/></div>'};goog.DEBUG&&(SketchUpTemplates.listItemProgress.soyTemplateName="SketchUpTemplates.listItemProgress");"undefined"==typeof SketchUpTemplates&&(SketchUpTemplates={});SketchUpTemplates.tcViewer=function(a,b){return'<div class="trimble-connect-viewer"></div>'};
goog.DEBUG&&(SketchUpTemplates.tcViewer.soyTemplateName="SketchUpTemplates.tcViewer");
