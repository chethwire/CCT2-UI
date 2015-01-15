angular.extend(angular, {
    isArrayLikeObject: isArrayLikeObject
});


/**
 * Checks if a value as array like object
 * @param value {*}
 * @returns {boolean}
 */
function isArrayLikeObject(value) {
    if (angular.isObject(value)) {
        return 'length' in value;
    } else {
        return false;
    }
}


angular
    .module('files', [])
    .service('$fileUploader', [ '$compile', '$rootScope', function ($compile, $rootScope) {

        function Uploader(params) {
            angular.extend(this, {
                url: '/',
                uploaderId:'id',
                alias: 'file',
                uploaderId: 'uploader',
                queue: [],
                headers: {},
                progress: null,
                autoUpload: false,
                removeAfterUpload: false,
                filters: [],
                isUploading: false,
                _uploadNext: false,
                _scope: $rootScope.$new(true)
            }, params);

            // add the base filter
            this.filters.unshift(this._filter);

            $rootScope.$on('csvfile:add', function (event, items) {
                if (this.uploaderId.substring(0,3) == 'csv') {
                    this.addToQueue(items);
                }

            }.bind(this));

            $rootScope.$on('featureimage:add', function (event, items) {
                if (this.uploaderId.substring(0,12) == 'featureimage') {
                    this.addToQueue(items);
                }

            }.bind(this));

            $rootScope.$on('headerimage:add',function (event, items) {
                if (this.uploaderId.substring(0,11) == 'headerimage') {
                    this.addToQueue(items);
                }
            }.bind(this));

            this._scope.$on('beforeupload'+this.uploaderId, Item.prototype._beforeupload);
            this._scope.$on('in:progress'+this.uploaderId, Item.prototype._progress);
            this._scope.$on('in:success'+this.uploaderId, Item.prototype._success);
            this._scope.$on('in:error'+this.uploaderId, Item.prototype._error);
            this._scope.$on('in:complete'+this.uploaderId, Item.prototype._complete);

            this._scope.$on('changedqueue'+this.uploaderId, this._changedQueue.bind(this));
            this._scope.$on('in:progress'+this.uploaderId, this._progress.bind(this));
            this._scope.$on('in:complete'+this.uploaderId, this._complete.bind(this));
        }

        Uploader.prototype = {

            /**
             * The base filter. If returns "true" an item will be added to the queue
             * @param {Object} item
             * @returns {boolean}
             */
            _filter: function (item) {
                return angular.isElement(item) ? true : !!item.size;
            },

            bind: function (event, handler) {
                this._scope.$on(event, handler.bind(this));
            },

            hasHTML5: function () {
                return window.File && window.FormData;
            },

            addToQueue: function (items) {
                var length = this.queue.length;

                angular.forEach(angular.isArrayLikeObject(items) ? items : [ items ], function (item) {
                    var isValid = !this.filters.length ? true : !!this.filters.filter(function (filter) {
                        return filter.apply(this, [ item ]);
                    }, this).length;

                    if (isValid) {
                        item = new Item({
                            url: this.url,
                            alias: this.alias,
                            headers: angular.extend({}, this.headers),
                            removeAfterUpload: this.removeAfterUpload,
                            uploader: this,
                            file: item
                        });

                        this.queue.push(item);
                        this._scope.$emit('afteraddingfile'+this.uploaderId, item);
                    }
                }, this);

                if (this.queue.length !== length) {
                    this._scope.$emit('afteraddingall'+this.uploaderId, this.queue);
                    this._scope.$emit('changedqueue'+this.uploaderId, this.queue);
                }
                if (this.autoUpload) {
                    this.uploadAll();
                }
            },

            /**
             * Remove items from the queue. Remove last: index = -1
             * @param {Object|Number} value
             */
            removeFromQueue: function (value) {
                var index = angular.isObject(value) ? this.getIndexOfItem(value) : value;
                var item = this.queue.splice(index, 1)[ 0 ];
                if (item.file._form) {
                    item.file._form.remove();

                }
                this._scope.$emit('changedqueue'+this.uploaderId, item);
            },

            clearQueue: function () {
                angular.forEach(this.queue, function (item) {
                    if (item.file._form) {
                        item.file._form.remove();
                    }
                }, this);
                this.queue.length = 0;
                this._scope.$emit('changedqueue'+this.uploaderId, this.queue);
            },

            /**
             * Returns a index of item from the queue
             * @param item
             * @returns {Number}
             */
            getIndexOfItem: function (item) {
                return this.queue.indexOf(item);
            },

            /**
             * Returns not uploaded items
             * @returns {Array}
             */
            getNotUploadedItems: function () {
                return this.queue.filter(function (item) {
                    return !item.isUploaded;
                });
            },

            /**
             * Upload a item from the queue
             * @param {Item|Number} value
             */
            uploadItem: function (value) {
                if (this.isUploading) {
                    return;
                }

                var index = angular.isObject(value) ? this.getIndexOfItem(value) : value;
                var item = this.queue[ index ];
                var transport = item.file._form ? '_iframeTransport' : '_xhrTransport';
                this.isUploading = true;
                this[ transport ](item);
            },

            uploadAll: function () {
                var item = this.getNotUploadedItems()[ 0 ];
                this._uploadNext = !!item;
                if (this._uploadNext) {

                    this.uploadItem(item);
                }
            },

            /**
             * Returns the total progress
             * @param {Number} [value]
             * @returns {Number}
             */
            _getTotalProgress: function (value) {
                if (this.removeAfterUpload) {
                    return value || 0;
                }

                var notUploaded = this.getNotUploadedItems().length;
                var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
                var ratio = 100 / this.queue.length;
                var current = ( value || 0 ) * ratio / 100;

                return Math.round(uploaded * ratio + current);
            },

            _progress: function (event, item, progress) {
                var result = this._getTotalProgress(progress);
                this.progress = result;
                this._scope.$emit('progressall'+this.uploaderId, result);
            },

            _complete: function () {
                this.isUploading = false;
                if (this._uploadNext) {
                    this.uploadAll();
                }
                var dummy = this._uploadNext || this._scope.$emit('completeall'+this.uploaderId, this.queue);

                //TODO: HACK -- desperately trying to prevent duplicate uploads from firing. Seems to work...
                if (this.uploaderId.substring(0,3) == 'csv') {
                $rootScope.$$listeners['csvfile:add'] = null;
                }
                if (this.uploaderId.substring(0,12) == 'featureimage') {
                    $rootScope.$$listeners['featureimagefile:add'] = null;
                }

                if (this.uploaderId.substring(0,11) == 'headerimage') {
                    $rootScope.$$listeners['headerimagefile:add'] = null;
                }
            },

            _changedQueue: function () {
                this.progress = this._getTotalProgress();
            },

            _xhrTransport: function (item) {
                var xhr = new XMLHttpRequest();
                var form = new FormData();
                var that = this;

                form.append(item.alias, item.file);

                angular.forEach(item.headers, function (value, name) {
                    xhr.setRequestHeader(name, value);
                });

                xhr.upload.addEventListener('progress', function (event) {
                    var progress = event.lengthComputable ? event.loaded * 100 / event.total : 0;
                    that._scope.$emit('in:progress'+that.uploaderId, item, Math.round(progress));
                }, false);

                xhr.addEventListener('load', function () {
                    var dummy = xhr.status === 200 && that._scope.$emit('in:success'+this.uploaderId, xhr, item);
                    dummy = xhr.status !== 200 && that._scope.$emit('in:error'+this.uploaderId, xhr, item);
                    that._scope.$emit('in:complete'+that.uploaderId, xhr, item);
                }, false);

                xhr.addEventListener('error', function () {
                    that._scope.$emit('in:error'+this.uploaderId, xhr, item);
                    that._scope.$emit('in:complete'+that.uploaderId, xhr, item);
                }, false);

                xhr.addEventListener('abort', function () {
                    that._scope.$emit('in:complete'+that.uploaderId, xhr, item);
                }, false);

                this._scope.$emit('beforeupload'+that.uploaderId, item);

                xhr.open('POST', item.url, true);
                xhr.send(form);
            },

            _iframeTransport: function (item) {
                var form = item.file._form;
                var iframe = form.find('iframe');
                var input = form.find('input');
                var that = this;

                input.prop('name', item.alias);

                form.prop({
                    action: item.url,
                    method: 'post',
                    target: iframe.prop('name'),
                    enctype: 'multipart/form-data',
                    encoding: 'multipart/form-data' // old IE
                });

                iframe.bind('load', function () {
                    var xhr = { response: iframe.contents(), status: 200, dummy: true };
                    that._scope.$emit('in:complete'+this.uploaderId, xhr, item);
                });

                this._scope.$emit('beforeupload'+this.uploaderId, item);

                form[ 0 ].submit();
            }
        };


        // item of queue
        function Item(params) {
            // fix for old browsers
            if (angular.isElement(params.file)) {
                var input = angular.element(params.file);
                var clone = $compile(input.clone())($rootScope.$new(true));
                var form = angular.element('<form style="display: none;" />');
                var iframe = angular.element('<iframe name="iframeTransport' + new Date() + '">');
                var value = input.val();

                params.file = {
                    lastModifiedDate: null,
                    size: null,
                    type: 'like/' + value.replace(/^.+\.(?!\.)|.*/, ''),
                    name: value.match(/[^\\]+$/)[ 0 ],
                    _form: form
                };

                input.after(clone).after(form);
                form.append(input).append(iframe);
            }

            angular.extend(this, {
                progress: null,
                isUploading: false,
                isUploaded: false
            }, params);
        }

        Item.prototype = {
            remove: function () {
                this.uploader.removeFromQueue(this);
            },
            upload: function () {
                this.uploader.uploadItem(this);
            },
            _beforeupload: function (event, item) {
                item.isUploaded = false;
                item.isUploading = true;
                item.progress = null;
            },
            _progress: function (event, item, progress) {
                item.progress = progress;
                item.uploader._scope.$emit('progress'+item.uploader.uploaderId, item, progress);
            },
            _success: function (event, xhr, item) {
                item.isUploaded = true;
                item.isUploading = false;
                item.uploader._scope.$emit('success'+item.uploader.uploaderId, xhr, item);
            },
            _error: function (event, xhr, item) {
                item.isUploading = false;
                item.uploader._scope.$emit('error'+item.uploader.uploaderId, xhr, item);
            },
            _complete: function (event, xhr, item) {
                item.isUploaded = xhr.status === 200;
                item.uploader._scope.$emit('complete'+item.uploader.uploaderId, xhr, item);
                var dummy = item.removeAfterUpload && item.remove();
            }
        };

        return {
            create: function (params) {
                return new Uploader(params);
            }
        };
    }]);


