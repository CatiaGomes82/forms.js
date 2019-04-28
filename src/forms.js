window.forms = new function Forms() {
    function markup($elem, type) {
        $elem.wrap('<div class="' + type + '-field"></div>')
        $elem.parent().prepend('<span></span>');

        if (type === 'select') {
            var options = [];
            $elem.parent().append('<ul class="list"></ul>');
            $elem.children().each(function () {
                var $opt = $(this);
                options.push('<li data-value="' + $opt.val() + '">' + $opt.text() + '</li>');
            });
            $elem.next('.list').append(options.join(''));
            $elem.prev('span').text($elem.data('default-text') || '');
        }
    }

    function initElement($elem, type) {
        var $elem = $(this),
            type = $elem.attr('type') || $elem.prop('tagName').toLowerCase();

        // add markup for styling
        markup($elem, type);

        $elem.on({
            focus: function () {
                $(this).parent().addClass('focus');
            },
            blur: function () {
                $(this).parent().removeClass('focus');
            },
            change: function () {
                if (type === 'radio') {
                    $('[name=' + $elem.attr('name') + ']').parent().removeClass('checked');
                }

                if (type === 'checkbox' || type === 'radio') {
                    $elem.parent().toggleClass('checked', $elem.is(':checked'));
                }
            }
        });

        if (type === 'checkbox' || type === 'radio') {
            $elem.parent().toggleClass('checked', $elem.is(':checked'));
            $elem.prev('span').on('click', function () {
                $elem.parent().toggleClass('checked');
                $elem.prop('checked', $elem.parent().hasClass('checked')).trigger('change');
            });

        }

        if (type === 'select') {
            $elem.prev('span').on('click', function () {
                var $window = $(window);
                $elem.parent().toggleClass('open');
                $elem.next('.list').toggleClass('open-above', $window.height() + $window.scrollTop() - 50 < $elem.prev('span').offset().top + $elem.prev('span').height());
            
                if ($elem.parent().hasClass('open')) {
                    setTimeout(function () { // avoid document click event being triggered from the span initial event
                        $(document).on('click.select', function (e) {
                            if (!$elem.parent()[0].contains(e.target)) {
                                $elem.parent().removeClass('open');
                                $(document).off('click.select');
                            }
                        })
                    })

                } else {
                    $(document).off('click.select');
                }
            });
        }

    }

    function init() {
        var $form = $(this)

        $form.find('select, textarea, [type="text"], [type="radio"], [type="checkbox"], [type="email"], [type="password"], [type="number"]').each(initElement);

    }

    $('[data-form]').each(init);
}
