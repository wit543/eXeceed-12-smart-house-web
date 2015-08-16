/**
 * Created by Mayke on 14/03/2015.
 */

(function(window, $) {

    var FullBackground, plugin = 'fullBackground';

    FullBackground = function(el, options) {

        this.options = $.extend({
            inherit_width_from: window,
            inherit_height_from: window
        }, options);

        var self = this;


        this.$el = $(el);

        // Private Methods
        var initialize = function() {

            $(window).on('resize', function() {
                setTimeout(function() {

                    self.width  = self._findWidth();
                    self.height = self._findHeight();

                    css.children();
                    css.containers();
                    css.images();

                }, 10);
            });

            return self;
        };

        var css = {
            containers: function() {
                if (self.init) {
                    self.$el.css({
                        height: self.height
                    });
                } else {
                    $('body').css({
                        margin: 0
                    });

                    self.$el.css({
                        margin: '0',
                        padding: '0',
                        position: "fixed",
                        "z-index": "-1",
                        width: self._findWidth(),
                        height: self._findHeight()
                    });
                }

            },
            images: function() {
                var $images = self.$el.find('img');

                $images.removeAttr('width').removeAttr('height')
                    .css({
                        "-webkit-backface-visibility": 'hidden',
                        "-ms-interpolation-mode": 'bicubic',
                        "maring-left": '0',
                        "maring-top": '0',
                        "max-width": 'none'
                    });

                $images.each(function() {
                    var image_aspect_ratio = self.image._aspectRatio(this),
                        image = this;

                    if (!$.data(this, 'processed')) {
                        var img = new Image();
                        img.onload = function() {
                            self.image._scale(image, image_aspect_ratio);
                            self.image._center(image, image_aspect_ratio);
                            $.data(image, 'processed', true);
                        };
                        img.src = this.src;

                    } else {
                        self.image._scale(image, image_aspect_ratio);
                        self.image._center(image, image_aspect_ratio);
                    }
                });
            },
            children: function() {
                var $children = self.$el.find("img");

                $children.css({
                    overflow: 'hidden',
                    height: '100%',
                    width: self.width,
                    top: 0,
                    zIndex: 0
                });

            }
        };


        var image = {
            _centerY: function(image) {
                var $img = $(image);

                $img.css({
                    marginTop: (self.height - $img.height()) / 2
                });
            },
            _centerX: function(image) {
                var $img = $(image);

                $img.css({
                    marginLeft: (self.width - $img.width()) / 2
                });
            },
            _center: function(image) {
                self.image._centerX(image);
                self.image._centerY(image);
            },
            _aspectRatio: function(image) {
                if (!image.naturalHeight && !image.naturalWidth) {
                    var img = new Image();
                    img.src = image.src;
                    image.naturalHeight = img.height;
                    image.naturalWidth = img.width;
                }

                return image.naturalHeight / image.naturalWidth;
            },
            _scale: function(image, image_aspect_ratio) {
                image_aspect_ratio = image_aspect_ratio || self.image._aspectRatio(image);

                var container_aspect_ratio = self.height / self.width,
                    $img = $(image);

                if (container_aspect_ratio > image_aspect_ratio) {
                    $img.css({
                        height: self.height,
                        width: self.height / image_aspect_ratio
                    });

                } else {
                    $img.css({
                        height: self.width * image_aspect_ratio,
                        width: self.width
                    });
                }
            }
        };

        this.css = css;
        this.image = image;

        self.width  = self._findWidth();
        self.height = self._findHeight();

        this.css.children();
        this.css.containers();
        this.css.images();

        return initialize();
    };

    FullBackground.prototype = {
        _findWidth: function() {
            return $(this.options.inherit_width_from).width();
        },
        _findHeight: function() {
            return $(this.options.inherit_width_from).height();
        },

        size: function() {
            return this.$el.find("img").length;
        },

        destroy: function() {
            return this.$el.removeData();
        },

        update: function() {
            this.css.children();
            this.css.containers();
            this.css.images();
        }
    };

// jQuery plugin definition

    $.fn[plugin] = function(option, args) {
        var result = [];

        this.each(function() {
            var $this, data, options;

            $this = $(this);
            data = $this.data(plugin);
            options = typeof option === 'object' && option;

            if (!data) {
                result = $this.data(plugin, (data = new FullBackground(this, options)));
            }

            if (typeof option === "string") {
                result = data[option];
                if (typeof result === 'function') {
                    return result = result.call(data, args);
                }
            }
        });

        return result;
    };

    $.fn[plugin].fx = {};

})(this, jQuery);

/**
 * Created by Mayke on 14/03/2015.
 */

