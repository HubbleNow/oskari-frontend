/**
 * @class Oskari.framework.bundle.admin-layerrights.Flyout
 *
 * Renders the layer rights management flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.peltodata.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.peltodata.AdminLayerRightsBundleInstance}
     *        instance reference to component that created the tile
     */
    function (instance) {
        console.log('constructor');
        var me = this;
        me.instance = instance;
        me.container = null;
        me.state = null;
        me.template = null;
        me.cleanData = null;
        me.activeRole = null;
        me.fields = [];
        me.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me._templates = {
            table: jQuery('<table class="layer-rights-table"><thead></thead><tbody></tbody></table>'),
            cellTh: jQuery('<th></th>'),
            cellTd: jQuery('<td></td>'),
            row: jQuery('<tr></tr>'),
            checkboxCtrl: jQuery('<input id="checkboxCtrl" type="checkbox" />'),
            checkBox: jQuery('<input type="checkbox" />'),
            name: jQuery('<span class="layer-name"></span>')
        };
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.framework.bundle.peltodata.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl(el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('peltodata')) {
                jQuery(this.container).addClass('peltodata');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin() {
            console.log('startPlugin');
            this.loadFields();

        },

        loadFields() {
            // jQuery.ajax({
            //     type: 'GET',
            //     dataType: 'json',
            //     data: queryData,
            //     url: Oskari.urls.getRoute('GetHierarchicalMapLayerGroups'),
            //     success: function (pResp) {
            //         me._loadAllLayerGroupsAjaxCallBack(pResp, callbackSuccess);
            //     },
            //     error: function (jqXHR, textStatus) {
            //         if (callbackFailure && jqXHR.status !== 0) {
            //             callbackFailure();
            //         }
            //     }
            // });
            var fields = [
                {
                    id: 1,
                    description: 'Pelto #1',
                    sowingDate: new Date(),
                    cropType: 'oat',
                }, {
                    id: 2,
                    description: 'Pelto #2',
                    sowingDate: new Date(),
                    cropType: 'wheat',
                },
            ];

            fields.push({
                id: -1,
                description: this.instance.getLocalization('new-field'),
                sowingDate: null,
                cropType: ''
            });

            this.fields = fields;
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },

        /**
         * @method setState
         * @param {Object} state
         */
        setState: function (state) {
            console.log('setState', state);
            this.state = state;
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState: function () {
            console.log('getState', state);
            if (!this.state) {
                return {};
            }
            return this.state;
        },
        /**
         * @method doSave
         * Save layer rights
         */
        doSave: function () {
            console.log('doSave', state);
            var me = this,
                changedPermissions = me.extractSelections();

            me.progressSpinner.start();
            var chunks = this._createChunks(changedPermissions, 100);
            this._savePermissions(chunks, function (errors) {
                me.progressSpinner.stop();
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var rightsLoc = me.instance._localization.rights;

                var changedLayers = me._collectResponseMessages(changedPermissions);

                if (errors.length) {
                    var errorLayers = me._collectResponseMessages(errors);
                    // TODO: append layers that couldn't be updated to dialog message
                    dialog.show(rightsLoc.error.title, rightsLoc.error.message + ' ' + errorLayers);
                }

                dialog.show(rightsLoc.success.title, rightsLoc.success.message + '</br>' + changedLayers);
                dialog.fadeout(3000);
                me.updatePermissionsTable(me.activeRole, 'ROLE');
            }, []);
        },
        _collectResponseMessages: function (responseItems) {
            var responseArray = [];
            jQuery.each(responseItems, function (index) {
                if (!_.contains(responseArray, responseItems[index].name)) {
                    responseArray.push(responseItems[index].name);
                }
            });
            return responseArray;
        },
        /**
         * Split list into chunks of given size
         * @param  {Array} list
         * @param  {Number} size
         * @return {Array} array containing list as chunks
         */
        _createChunks: function (list, size) {
            var result = [];
            var chunksCount = Math.ceil(list.length / size);
            for (var i = 0; i < chunksCount; ++i) {
                var end = i + size;
                if (end >= list.length) {
                    end = list.length;
                }
                var chunk = list.slice(i, end);
                result.push(chunk);
            }
            return result;
        },
        _savePermissions: function (chunks, done, errors) {
            if (!chunks.length) {
                done(errors);
                return;
            }
            var me = this;
            var currentChunk = chunks.shift();
            var saveData = {
                'resource': JSON.stringify(currentChunk)
            };
            jQuery.ajax({
                type: 'POST',
                url: Oskari.urls.getRoute('SaveLayerPermission'),
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                data: saveData,
                success: function () {
                    me._savePermissions(chunks, done, errors);
                },
                error: function () {
                    errors.push(currentChunk);
                    me._savePermissions(chunks, done, errors);
                }
            });
        },

        addTextInput(id, value, placeHolder, groupPanel) {
            const field1 = Oskari.clazz.create(
                'Oskari.userinterface.component.TextInput');
            field1.setTitle(placeHolder);
            field1.setValue(value);
            // field1.setId(id);
            jQuery(groupPanel.getContainer()).append(field1.getElement());
        },
        addCropSelect(id, value, placeHolder, groupPanel) {
            const field1 = Oskari.clazz.create(
                'Oskari.userinterface.component.Select');
            field1.setTitle(placeHolder);

            const options = [{
                value: 'wheat',
                title: 'Wheat',
            }, {
                value: 'oat',
                title: 'Oat',
            }];
            field1.setOptions(options);
            field1.setValue(value);
            // field1.setId(id);
            jQuery(groupPanel.getContainer()).append(field1.getElement());
        },
        setContent(content) {
            console.log('setContent', content);
            var template = jQuery(
                `<div class="peltodata-fields">
                   <div class="peltodata-farmfields">       
                   </div>       
               </div>`
            );

            var flyout = jQuery(this.container);
            flyout.append(template);

            const accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            var fieldsDiv = flyout.find('div.peltodata-farmfields');
            accordion.insertTo(fieldsDiv);

            this.fields.forEach(field => {
                const groupPanel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );
                groupPanel.setTitle(field.description);
                groupPanel.setId(`oskari_layerselector2_accordionPanel_${field.id}`);

                this.addTextInput(`${field.id}-descr`, field.description, 'Kuvaus', groupPanel);
                this.addCropSelect(`${field.id}-crop`, field.cropType,'Viljelykasvi', groupPanel);
                // this.addInput(`${field.id}-sowing-date`, field.sowingDate, 'Kylvöpäivä', groupPanel);
                // this.addInput(`${field.id}-crop`, field.cropType,'Viljelykasvi', groupPanel);

                accordion.addPanel(groupPanel);
            });
        },

        handleRoleChange: function (role, operation) {
            var select = jQuery(this.container).find('select.peltodata-role'),
                option = select.find('option[value=' + role.id + ']');

            if (operation == 'remove') {
                option.remove();
            }
            if (operation == 'update') {
                option.text(role.name);
            }
            if (operation == 'add') {
                select.append('<option value=' + role.id + '>' + role.name + '</option>');
            }
        },

        /**
         * @method createLayerRightGrid
         * Creates the permissions table as a String
         * @param {Object} layerRightsJSON
         * @return {String} Permissions table
         */
        createLayerRightGrid: function (layerRightsJSON) {
            var me = this,
                table = me._templates.table.clone(),
                thead = table.find('thead'),
                tbody = table.find('tbody'),
                headerRow = me._templates.row.clone(),
                controlRow = me._templates.row.clone(),
                columnsLoc = this.instance.getLocalization('rights');

            controlRow.addClass('control');

            // Create headers
            var thCell = me._templates.cellTh.clone();
            thCell.html(columnsLoc.name);
            headerRow.append(thCell);

            jQuery.each(layerRightsJSON[0].permissions, function (index, header) {
                var thCell = me._templates.cellTh.clone();
                var tdCell = me._templates.cellTd.clone();
                var checkboxCtrl = me._templates.checkboxCtrl.clone();
                var headerName = header.name;
                if (typeof columnsLoc[header.name] !== 'undefined') {
                    headerName = columnsLoc[header.name];
                }
                checkboxCtrl.addClass(header.name);
                tdCell.append(checkboxCtrl);
                thCell.html(headerName);
                controlRow.append(tdCell);
                headerRow.append(thCell);
            });
            thead.append(headerRow);
            thead.append(controlRow);

            // Create rows
            jQuery.each(layerRightsJSON, function (index, layerRight) {
                var dataRow = me._templates.row.clone(),
                    cell = null,
                    dataCell = me._templates.cellTd.clone();

                cell = me._templates.name.clone();
                cell.attr('data-resource', layerRight.resourceName);
                cell.attr('data-namespace', layerRight.namespace);
                cell.text(Oskari.util.sanitize(layerRight.name));
                dataCell.append(cell);
                dataRow.append(dataCell);

                // lets loop through permissions
                jQuery.each(layerRight.permissions, function (index, permission) {
                    var allow = permission.allow,
                        tooltip = permission.name,
                        dataCell = me._templates.cellTd.clone();

                    cell = me._templates.checkBox.clone();
                    cell.attr('data-right', permission.id);
                    cell.addClass(permission.name);
                    cell.prop('checked', !!allow);
                    cell.attr('title', tooltip);

                    dataCell.append(cell);
                    dataRow.append(dataCell);
                });
                tbody.append(dataRow);
            });
            me.togglePermissionsColumn(thead, tbody);

            return table;
        },
        togglePermissionsColumn: function (thead, tbody) {
            var controlCell = thead.find('#checkboxCtrl');
            controlCell.on('change', function () {
                var checkboxes = tbody.find('input.' + this.className);
                checkboxes.prop('checked', !checkboxes.prop('checked'));
            });
        },

        /**
         * @method extractSelections
         * Returns dirty table rows as JSON
         * @return {Object} Dirty table rows
         */
        extractSelections: function () {
            var me = this,
                data = [],
                container = jQuery(me.container),
                trs = container.find('tbody tr'),
                i = 0,
                j = 0,
                dataObj = null,
                cleanDataObj = null,
                tr = null,
                tdName = null,
                tds = null,
                td = null,
                right = null,
                value = null,
                dirty = false;
            for (i = 0; i < trs.length; i += 1) {
                // TODO check if data has changed on this row before adding to output
                dirty = false;
                cleanDataObj = me.cleanData[i];
                dataObj = {};
                tr = jQuery(trs[i]);
                tdName = tr.find('td span');
                tds = tr.find('td input').not('input.checkboxCtrl');
                dataObj.name = tdName.text();
                dataObj.resourceName = tdName.attr('data-resource');
                dataObj.namespace = tdName.attr('data-namespace');
                dataObj.roleId = me.activeRole;
                dataObj.permissions = [];

                for (j = 0; j < tds.length; j += 1) {
                    td = jQuery(tds[j]);
                    right = td.attr('data-right');
                    value = td.prop('checked');

                    if (cleanDataObj[right] !== value) {
                        dirty = true;
                    }
                    dataObj.permissions.push({
                        key: right,
                        value: value
                    });
                }

                if (cleanDataObj.resourceName !== dataObj.resourceName) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                }

                if (cleanDataObj.namespace !== dataObj.namespace) {
                    // Don't save stuff in the wrong place...
                    dirty = false;
                }

                if (dirty) {
                    data.push(dataObj);
                }
            }
            var changedData = this.getChangedValues(me.cleanData, data);

            return changedData;
        },
        getChangedValues: function (arrayClean, arrayDirty) {
            var changedvalues = [];
            for (var i = 0; i < arrayClean.length; i++) {
                for (var j = 0; j < arrayClean[0].permissions.length; j++) {
                    if (arrayClean[i].permissions[j].allow !== arrayDirty[i].permissions[j].value) {
                        if (!_.contains(changedvalues, arrayDirty[i])) {
                            changedvalues.push(arrayDirty[i]);
                        }
                    }
                }
            }
            return changedvalues;
        },
        /**
         * @method updatePermissionsTable
         * Refreshes the permissions table with the given role and type
         * @param {String} activeRole
         * @param {String} externalType
         */
        updatePermissionsTable: function (activeRole, externalType) {
            var me = this;
            me.progressSpinner.start();

            jQuery.getJSON(Oskari.urls.getRoute('GetPermissionsLayerHandlers'), {
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                externalId: activeRole,
                // resourceType: "WMS_LAYER",
                externalType: externalType
            }, function (result) {
                me.progressSpinner.stop();
                var mappedResult = me.mapResult(result);
                // store unaltered data so we can do a dirty check on save
                me.cleanData = mappedResult;
                var table = me.createLayerRightGrid(mappedResult);
                jQuery(me.container).find('.peltodata-layers').empty().append(table);
            });
        },
        /**
         * Maps names for permissions
         * @param  {Object} result response from GetPermissionsLayerHandlers
         * @return {Object[]}    resource array of response with populated permission names
         */
        mapResult: function (result) {
            // result.names = [id : VIEW_LAYER, name : 'ui name'];
            // result.resource = [{permissions : [{id : VIEW_LAYER, name : "populate"}]}]
            var nameMapper = {};
            result.names.forEach(function (item) {
                // for whatever reason...
                if (item.id === 'VIEW_LAYER') {
                    item.name = 'rightToView';
                } else if (item.id === 'VIEW_PUBLISHED') {
                    item.name = 'rightToPublishView';
                } else if (item.id === 'PUBLISH') {
                    item.name = 'rightToPublish';
                } else if (item.id === 'DOWNLOAD') {
                    item.name = 'rightToDownload';
                }
                nameMapper[item.id] = item.name;
            });

            var mapped = [];
            result.resource.forEach(function (resource) {
                resource.permissions.forEach(function (permission) {
                    if (permission.name) {
                        return;
                    }
                    permission['name'] = nameMapper[permission.id] || permission.id;
                });
                mapped.push(resource);
            });
            return mapped;
        },

        /**
         * @method getExternalIdsAjaxRequest
         * Retrieves permissions data for the given type and role
         * @param {String} externalType
         * @param {String} selectedId
         */
        getExternalIdsAjaxRequest: function (externalType) {
            var me = this;

            // ajaxRequestGoing = true;
            // TODO add error handling
            jQuery.getJSON(Oskari.urls.getRoute('GetAllRoles'), {
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                getExternalIds: externalType
            }, function (result) {
                me.makeExternalIdsSelect(result);
            });
        },

        /**
         * @param (Object) result
         * @param {String} externalType
         * @param {String} selectedId
         */
        makeExternalIdsSelect: function (result) {
            var externalIdSelect = jQuery(this.container).find('select.peltodata-role');
            var rightsLoc = this.instance._localization.rights;

            externalIdSelect.html('');
            var optionEl = document.createElement('option');
            optionEl.value = '0';
            optionEl.textContent = '-- ' + rightsLoc.selectValue + ' --';
            optionEl.setAttribute('selected', 'selected');
            externalIdSelect.append(optionEl);
            for (var d = 0; d < result.external.length; d += 1) {
                optionEl = document.createElement('option');
                optionEl.value = result.external[d].id;
                optionEl.textContent = result.external[d].name;
                externalIdSelect.append(optionEl);
            }
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
