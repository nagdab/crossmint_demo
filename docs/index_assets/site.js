(/**
 * @param $
 * @param root
 * @param undefined
 */
function($, root, undefined) {

  $(function() {

    'use strict';
    
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

    if (app.isMobile.any()) {
      $('html').addClass("mobile-device");
    }
    if (app.isMobile.iOS()) {
      $('html').addClass("ios-device");
    }
    $('html').addClass(app.connectionSpeed());
    $('html').attr('data-useragent', navigator.userAgent);

    // fix hover menu isues on iOS
    $('nav li:has(ul)').doubleTapToGo();
    // drop down desktop menu on hover
    $("nav ul.dropdown").each(function() {
      var $thisNavDropdown = $(this);
      $("li:not(.no-hover-dropdown)", $thisNavDropdown).each(function() {
        var topLevelMenuLi = $(this);
        topLevelMenuLi.mouseover(function() {
          var $this = $(this);
          // remove hover from classes that has focus
          $thisNavDropdown.children("li:not(.no-hover-dropdown)").not($this).removeClass("hover");
          $this.addClass("hover");
          var isAlreadyAjusted = $this.hasClass("adjusted");
          if (!isAlreadyAjusted) {
            var $dropdown = $(".top-spacer", $this);
            if ($dropdown.length > 0) {
              $dropdown.css("left", "").css("right", "");
              var position = $dropdown[0].getBoundingClientRect();
              var vpLeft = position.left;
              var vpRight = position.right;
              if (vpLeft < 0) {
                $dropdown.css("left", "calc(50% + " + (-vpLeft) + "px)");
              } else if (vpRight > window.innerWidth) {
                var adjustment = window.innerWidth - vpRight;
                $dropdown.css("right", "calc(50% - " + adjustment + "px)");
              }
            }
            $this.addClass("adjusted");
          }
        }).mouseout(function() {
          var $this = $(this);
          $this.removeClass("hover");
        }).click(function() {
          var $this = $(this);
          $thisNavDropdown.children("li").not($this).removeClass("open");
          $this.toggleClass("open");
        }).keydown(function(event) {
          if (event.keyCode == 13) {
            event.stopPropagation();
            var $this = $(this);
            $thisNavDropdown.children("li").not($this).removeClass("open");
            $this.toggleClass("open");
          }
        });
      });
      $("li:not(.no-hover-dropdown):not(.cta)", $thisNavDropdown).on("tap", function() {
        var $this = $(this);
        $thisNavDropdown.children("li").not($this).removeClass("hover");
        $this.toggleClass("hover");
      });

      // open widget menu items when clicked or enter
      $("li.button-type:not(.cta)", $thisNavDropdown).click(function(event) {
        var $clickedButton = $(this);
        $thisNavDropdown.children('li.menu-item:not(.button-type)').not($clickedButton).removeClass("hover")
        $thisNavDropdown.children('li.menu-item').not($clickedButton).removeClass("open");
        $clickedButton.toggleClass("open");
      }).keydown(function(event) {
        if (event.keyCode == 13) {
          event.stopPropagation();
          var $clickedButton = $(this);
          $thisNavDropdown.children('li.menu-item:not(.button-type)').not($clickedButton).removeClass("hover")
          $thisNavDropdown.children('li.menu-item').not($clickedButton).removeClass("open");
          $clickedButton.toggleClass("open");
        }
      });
      $("li.button-type input", $thisNavDropdown).click(function(event) {
        event.stopPropagation();
      })
    });

    if (!app.isMobile.iOS()) {
      // hide mobile menu after clicking a real link in it
      $('nav li > span > a[href]:not([href="#"]:not([href=""])').click(function() {
        var $itemParents = $(this).parents();
        $itemParents.removeClass("hover").removeClass("open");
        $('.c-hamburger', $itemParents).removeClass("is-active");
      }).keydown(function(event) {
        if (event.keyCode == 13) {
          var $itemParents = $(this).parents();
          $itemParents.removeClass("hover").removeClass("open");
          $('.c-hamburger', $itemParents).removeClass("is-active");
        }
      });
    }

    $(".c-hamburger").click(function(e) {
      $(this).toggleClass("is-active");
      $(this).parent().toggleClass("hover");
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();
        $(this).toggleClass("is-active");
        $(this).parent().toggleClass("hover");
      }
    });

    
    $("section.choose-one").each(function() {
      var $section = $(this);
      var choiceCount = $('.choice', $section).length;
      var displayChoice;
      var foundUniqueOrUniqueNotNeeded = false;
      do {
        displayChoice = Math.floor(Math.random() * choiceCount);
        var $possibleChoice = $('.choice', $section).eq(displayChoice);
        if ($possibleChoice.hasClass('unique') && $possibleChoice.attr('data-unique')!="") {
          if (!app.homePeopleShown.includes($possibleChoice.attr('data-unique'))) {
            $possibleChoice.addClass("shown");
            app.homePeopleShown.push($possibleChoice.attr('data-unique'));
            foundUniqueOrUniqueNotNeeded = true;
          }
        } else {
          $possibleChoice.addClass("shown");
          foundUniqueOrUniqueNotNeeded = true;
        }
      } while (!foundUniqueOrUniqueNotNeeded);
    });
    
    $("section.choose-multiple").each(function() {
      var $section = $(this);
      var totalCount = Math.min($section.attr('data-total-count'), $('.choice', $section).length);
      var counts = $section.attr('data-min-counts').split(',');
      var maxs = {};
      counts.forEach(function(item, index, array) {
        maxs[item] = Math.min($section.attr('data-' + item + '-count'), $('.choice.' + item, $section).length);
      });
      var setToDisplayCount = 0;
      for(var key in maxs) {
        var setToDisplayOfType = 0
        var choiceCount = $('.choice.' + key, $section).length;
        while (setToDisplayCount<totalCount && setToDisplayOfType<maxs[key]) {
          var displayChoice = Math.floor(Math.random() * choiceCount);
          var $possibleChoice = $('.choice', $section).eq(displayChoice);
          if (!app.alreadyShow.includes($possibleChoice.attr('id'))) {
            $possibleChoice.addClass("shown");
            app.alreadyShow.push($possibleChoice.attr('id'));
            setToDisplayCount++;
            setToDisplayOfType++;
          }
        }
      }
      var totalChoicesRegardlessOfType = $('.choice:not(.shown)', $section).length;
      while (setToDisplayCount<totalCount) {
        displayChoice = Math.floor(Math.random() * totalChoicesRegardlessOfType);
        var $possibleChoice = $('.choice:not(.shown)', $section).eq(displayChoice);
        if (!app.alreadyShow.includes($possibleChoice.attr('id'))) {
          $possibleChoice.addClass("shown");
          app.alreadyShow.push($possibleChoice.attr('id'));
          setToDisplayCount++;
        }
      }
      $('.choice:not(.shown)', $section).remove();
      if ($('.content', $section).hasClass('flexslider')) {
        $('.content', $section).flexslider({
          selector: ".slides > li",
          slideshowSpeed: 5000,
          directionNav: false,
          pauseOnAction: false,
          pauseOnHover: true
        });
      }
    });
    
    $('main.home .flexslider').flexslider({
      selector: ".slides > li",
      slideshowSpeed: 5000,
      directionNav: false,
      pauseOnAction: false,
      pauseOnHover: true
    });

    $("a.close").click(function() {
      $(this).closest("section").addClass("closed");
    });
    
    $("div.banner a.close").click(function() {
      $(this).closest("header").removeClass("with-banner-form");
      $(this).closest("div").remove();
    });
    
    $("section.bio blockquote").lowFloat();
    window.setTimeout(function() {
      $(window).resize();
    }, 500);
    
    $(".click-to-open").click(function(e) {
      var $clickedElement = $(this);
      var $clickedElementParent = $clickedElement.parent();
      if (!$clickedElementParent.hasClass("open")) {
        $(".click-to-open").not($clickedElement).parent().addClass("closing-to-open-other");
      }
      $(".click-to-open").not($clickedElement).parent().removeClass("open");
      $clickedElement.parent().removeClass("closing-to-open-other").toggleClass("open");
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();
        var $clickedElement = $(this);
        var $clickedElementParent = $clickedElement.parent();
        if (!$clickedElementParent.hasClass("open")) {
          $(".click-to-open").not($clickedElement).parent().addClass("closing-to-open-other");
        }
        $(".click-to-open").not($clickedElement).parent().removeClass("open");
        $clickedElement.parent().removeClass("closing-to-open-other").toggleClass("open");
      }
    });
    
    $(".toggle-more").click(function(e) {
      var $clickedElement = $(this);
      $clickedElement.toggleClass("open");
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();
        var $clickedElement = $(this);
        $clickedElement.toggleClass("open");
      }
    });

    $(".toggle-less").click(function(e) {
      var $clickedElement = $(this);
      var $moreElement = $clickedElement.parent().prev(".toggle-more");
      $moreElement.toggleClass("open");
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();
        var $clickedElement = $(this);
        var $moreElement = $clickedElement.parent().prev(".toggle-more");
        $moreElement.toggleClass("open");
      }
    });
    
    $(".youtube.timestamp").click(function() {
      var $timestampLink = $(this);
      var sec = 0;
      var minSec = $timestampLink.attr('data-timestamp');
      var minSeparatorIndex = minSec.indexOf(':');
      if (minSeparatorIndex>=0) {
        var min = parseInt(minSec.substr(0, minSeparatorIndex));
        sec = parseInt(minSec.substr(minSeparatorIndex + 1)) + (min * 60);
      } else {
        sec = parseInt(minSec);
      }
      app.ytplayer.seekTo(sec, true);
      app.ytplayer.playVideo();
    });

    $("nav.respond-to-browser-controls").each(function() {
      var $nav = $(this);
      var controlledByClone = true;
      var $areasControlled = $($nav.attr('data-areas-controlled'));
      if ($areasControlled.length==0) {
        controlledByClone = false;
        $areasControlled = $($nav.attr('data-areas-controlled-by-hide'));
      }
      $("a[href^='#'], a.preview", $nav).click(function(event) {
        var $link = $(this);
        $("a[href^='#'], a.preview", $nav).removeClass('active');
        $link.addClass('active');
        var $typesToActivate = $($link.attr('data-activates'));
        if (controlledByClone) {
          $areasControlled.empty();
          $typesToActivate.clone(true, true).appendTo($areasControlled);
        } else {
          event.preventDefault();
          $areasControlled.removeClass('active');
          $typesToActivate.addClass('active');
        }
      }).keydown(function(event) {
        if (event.keyCode == 13) {
          event.stopPropagation();
          var $link = $(this);
          $("a[href^='#'], a.preview", $nav).removeClass('active');
          $link.addClass('active');
          var $typesToActivate = $($link.attr('data-activates'));
          if (controlledByClone) {
            $areasControlled.empty();
            $typesToActivate.clone(true, true).appendTo($areasControlled);
          } else {
            event.preventDefault();
            $areasControlled.removeClass('active');
            $typesToActivate.addClass('active');
          }
        }
      });
      var $activateTagLink = $("a.active", $nav);
      var $typesToActivate = $($activateTagLink.attr('data-activates'));
      if (controlledByClone) {
        $areasControlled.empty();
        $typesToActivate.clone(true, true).appendTo($areasControlled);
      } else {
        $areasControlled.removeClass('active');
        $typesToActivate.addClass('active');
      }
      
      var inPreview = $("a.preview", $nav).length > 0
      var hash = window.location.hash;
      if (hash && !inPreview) {
        $('a[href="' + hash + '"]', $nav).first().click();
      } else if (!$nav[0].hasAttribute('data-no-initial-response')) {
        $("a[href^='#'], a.preview", $nav).first().click();
      }
      if (!inPreview) {
        $(window).bind('hashchange', function(e) {
          var hash = window.location.hash;
          if (hash) {
            $('a[href="' + hash + '"]', $nav).first().click();
          } else if (!$nav[0].hasAttribute('data-no-initial-response')) {
            $("a[href^='#']", $nav).first().click();
          } else if ($nav[0].hasAttribute('data-no-initial-response')) {
            $("a[data-initial-active='true'], a.preview", $nav).first().click();
          } else {
            $("a[href^='#'], a.preview", $nav).removeClass('active');
            var defaultsToActivate = $nav.attr('data-default-activates');
            $(defaultsToActivate).clone(true, true).appendTo($areasControlled);
          }
        });
      }
    });

    $(".emulate-hover").mouseenter(function(e) {
      var $hoveredElement = $(this);
      var $emulatedHoverElement = $($hoveredElement.attr("data-emulate-on"));
      $emulatedHoverElement.addClass('hover');
    }).mouseleave(function(e) {
      var $hoveredElement = $(this);
      var $emulatedHoverElement = $($hoveredElement.attr("data-emulate-on"));
      $emulatedHoverElement.removeClass('hover');
    }).focusin(function(e) {
      var $hoveredElement = $(this);
      var $emulatedHoverElement = $($hoveredElement.attr("data-emulate-on"));
      $emulatedHoverElement.addClass('focus');
    }).focusout(function(e) {
      var $hoveredElement = $(this);
      var $emulatedHoverElement = $($hoveredElement.attr("data-emulate-on"));
      $emulatedHoverElement.removeClass('focus');
    });

    var prettyPhotoArgs = {
      ajaxcallback : function() {
        setTimeout(function() {
          $(window).resize();
          setTimeout(function() {
            var $firstFocusableElement = $('.light_square a, .light_square *[tabindex]').filter(function() {
              var $this = $(this);
              return ($this.is('a') && !!$this.attr('href')) || !$this.is('a');
            }).get(0);
            if ($firstFocusableElement) {
              $firstFocusableElement.focus();
            }
          }, 50);
        }, 400);
      },
      allow_resize : true,
      autoplay_slideshow : false,
      custom_markup: '',
      default_height : 480,
      default_width : 800,
      deeplinking: false,
      gallery_markup: '<div class="pp_gallery"> \
                          <a href="#" class="pp_arrow_previous">Previous</a> \
                          <div> \
                              <ul> \
                                  {gallery} \
                              </ul> \
                          </div> \
                          <a href="#" class="pp_arrow_next">Next</a> \
                      </div>',
      iframe_markup: '<div class="iframe-aspect"><iframe src ="{path}" frameborder="no" allowfullscreen="true" id="ytplayer"></iframe></div>', // width="{width}" height="{height}"
      image_markup: '<img id="fullResImage" src="{path}" />',
      inline_markup: '<div class="pp_inline">{content}</div>',
      opacity : 0.6,
      modal : false,
      markup : '<div class="pp_pic_holder"> \
                  <div class="ppt">&nbsp;</div> \
                  <div class="pp_top"> \
                      <div class="pp_left"></div> \
                      <div class="pp_middle"></div> \
                      <div class="pp_right"></div> \
                  </div> \
                  <div class="pp_content_container"> \
                      <div class="pp_left"> \
                      <div class="pp_right"> \
                          <div class="pp_content"> \
                              <div class="pp_loaderIcon"></div> \
                              <div class="pp_fade"> \
                                  <div id="pp_full_res"></div> \
                                  <div class="pp_details"> \
                                      <a class="pp_close" href="#">Close</a> \
                                  </div> \
                              </div> \
                          </div> \
                      </div> \
                      </div> \
                  </div> \
                  <div class="pp_bottom"> \
                      <div class="pp_left"></div> \
                      <div class="pp_middle"></div> \
                      <div class="pp_right"></div> \
                  </div> \
              </div> \
              <div class="pp_overlay"></div>',
        opencallback : function() {
          window.setTimeout(function() {jQuery('div.pp_content').scrollTop(0);}, 500);
        },
        show_title : false,
        theme : 'light_square' // light_rounded/dark_rounded/light_square/dark_square/facebook/pp_default
    };
    var prettyPhotoOtherHrefArgs = $.extend({}, prettyPhotoArgs);
    prettyPhotoOtherHrefArgs.hrefattr = 'data-lightbox-href';
    $("a:not(.dark)[rel^='prettyPhoto']:not([data-lightbox-href])").prettyPhoto(prettyPhotoArgs);
    $("a:not(.dark)[rel^='prettyPhoto'][data-lightbox-href]").prettyPhoto(prettyPhotoOtherHrefArgs);

    var prettyPhotoArgsDark = $.extend({}, prettyPhotoArgs);
    prettyPhotoArgsDark.theme = 'dark_square';
    var prettyPhotoOtherHrefArgsDark = $.extend({}, prettyPhotoOtherHrefArgs);
    prettyPhotoOtherHrefArgsDark.theme = 'dark_square';
    $("a.dark[rel^='prettyPhoto']:not([data-lightbox-href])").prettyPhoto(prettyPhotoArgsDark);
    $("a.dark[rel^='prettyPhoto'][data-lightbox-href]").prettyPhoto(prettyPhotoOtherHrefArgsDark);

    $("a.remove-href").removeAttr('href');
    
    $("form.subscribe, form.campaign").each(function() {
      var $form = $(this);
      var $submit = $("input[type=submit]", $form);
      $form.submit(function(event) {
        var $f = $(this);
        event.preventDefault();
        $("input[type='email']", $f).css({
          outline : ""
        }).attr("title", "");
        $.post({
          url : $f.attr("action"),
          data : $f.serialize(),
          dataType: 'jsonp'
        }).done(function(data, textStatus, jqXHR) {
          if (data.result && data.result==="error") {
            var $emailField = $("input[type='email']", $f);
            var $errorMsgDiv = $("div.error", $f);
            if (data.msg && /^[0-9]+\s*-\s*/.test(data.msg)) {
              if (data.msg.indexOf('email')!==false) {
                app.reportEmailValidityError(data, $emailField, $submit);
              }
            } else if ($errorMsgDiv.get(0)) {
              app.reportGeneralError(data, $errorMsgDiv, $emailField);
            } else {
              $emailField.val("").attr("placeholder", (data.msg ? data.msg.replace(/^[0-9]+\s*-\s*/, '') : 'Error: please try again'));
              window.setTimeout(function() {
                $emailField.attr("placeholder", "Email");
              }, 2500);
            }
            return;
          }
          
          var redirectTo = $form.attr("data-redirect-to");
          if (redirectTo) {
            window.open(redirectTo, "_blank");
          }
          if ($f.hasClass('close-modal-on-submit')) {
            $("input[type='email']", $f).val("");
            $('html').removeClass('modal-open');
          } else {
            $("input[type='email']", $f).val("").attr("placeholder", "Thank you");
            window.setTimeout(function() {
              $("input[type='email']", $f).attr("placeholder", "Email");
            }, 5000);
          }
        }).fail(function(jqXHR, textStatus, errorThrown) {
          var redirectTo = $form.attr("data-redirect-to");
          if (redirectTo) {
            window.open(redirectTo, "_blank");
          }
          if ($f.hasClass('close-modal-on-submit')) {
            $("input[type='email']", $f).val("");
            $('html').removeClass('modal-open');
          } else {
            $("input[type='email']", $f).val("").attr("placeholder", "Thank you");
            window.setTimeout(function() {
              $("input[type='email']", $f).attr("placeholder", "Email");
            }, 5000);
          }
        });
      });
    });
    
    $('.open-signup-form').click(function(event) {
      event.stopPropagation();
      event.preventDefault();
      var elementClicked = $(this);
      $('html').addClass('modal-open');
      $('#close-modal').data('prev-focus', elementClicked[0].id)
      window.setTimeout(function() {
        $("#modal-pane.signup-form input[type='email']").focus();
      }, 100);
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();
        event.preventDefault();
        var elementClicked = $(this);
        $('html').addClass('modal-open');
        $('#close-modal').data('prev-focus', elementClicked[0].id)
        window.setTimeout(function() {
          $("#modal-pane.signup-form input[type='email']").focus();
        }, 100);
      };
    });
    
    $('html').keydown(function(event) {
      if (event.keyCode == 27) { //Esc
        event.stopPropagation();
        event.preventDefault();
        $('#' + $('#close-modal').data('prev-focus')).focus();
        $('html').removeClass('modal-open');
      };
    });
    
    $('#close-modal').click(function(event) {
      event.stopPropagation();
      event.preventDefault();
      $('#' + $('#close-modal').data('prev-focus')).focus();
      $('html').removeClass('modal-open');
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();
        event.preventDefault();
        $('#' + $('#close-modal').data('prev-focus')).focus();
        $('html').removeClass('modal-open');
      };
    });
    
    $('#search-check').click(function() {
      $('#search-term').focus()
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        $('#search-term').focus()
      };
    });
    
    $('#search-term').keydown(function(event) {
      if (event.keyCode == 27) { //Esc
        $('#search-check').focus().prop("checked", false);
      };
    });
    
    if ($('#search-results').length) {
      app.populateSearchResults();
    }
    
    $('.consent-manager-link').click(function() {
      event.stopPropagation();
      event.preventDefault();
      $('#cookiescript_badgeimage').click();
      window.setTimeout(function() {
        var $showButton = $('#cookiescript_manageicon + span');
        if ($showButton.css('display')!='none') {
          $('#cookiescript_manage').click();
        }
      }, 200);
    }).keydown(function(event) {
      if (event.keyCode == 13) {
        event.stopPropagation();
        event.preventDefault();
        $('#cookiescript_badgeimage').click();
        window.setTimeout(function() {
          var $showButton = $('#cookiescript_manageicon + span');
          if ($showButton.css('display')!='none') {
            $('#cookiescript_manage').click();
          }
        }, 200);
      }
    });
    
    $('.slide-out-control').click(function() {
      $(this).parents('#subscribe-form').toggleClass('opened').toggleClass('closed');
    }).keydown(function(event) {
      if (event.keyCode == 13 || event.keyCode == 32) {
        event.stopPropagation();
        event.preventDefault();
        $(this).parents('#subscribe-form').toggleClass('opened').toggleClass('closed');
      }
    });

    app.getTooNarrowCheckContentWidths();
    
    var resizeTimeout = null;
    $(window).resize(function() {
      if (resizeTimeout != null) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        app.setTagTop();
        app.setMaxHeightFixed();
        app.setTooNarrow();
        if (app.constituentListResize) {
          app.constituentListResize();
        }
      }, 50);
    }).scroll(function() {
      if (resizeTimeout != null) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        app.setTagTop();
        app.setMaxHeightFixed();
      }, 5);
      app.setStickTop();
    });

    $(window).resize();
    $(window).scroll();

  });

})(jQuery, this);

/*
 * Site functionality that can be set up before the document is completely loaded
 */
var app = app || {};

app.detectMouse = function(event) {
  /*
   * event order: touchstart, touchmove, touchend, mouseover, mousemove, mousedown, mouseup, click
   * 
   * Detect first of these events on the body to determine how the user started interacting with the page
   */
  if (event.type === 'mousemove') {
    jQuery('html').addClass("using-mouse");
  } else if (event.type === 'touchstart') {
    jQuery('html').addClass("using-touch");
    jQuery('input.date').attr('readonly', 'readonly');
  }
  // only detect first event
  jQuery('body').off('mousemove touchstart', app.detectMouse);
};
jQuery(document).ready(function() {
  jQuery('body').on('mousemove touchstart', app.detectMouse);
});

app.reportEmailValidityError = function(data, $emailField, $submit) {
  var $ = jQuery;
  $emailField.get(0).setCustomValidity( data.msg.replace(/^[0-9]+\s*-\s*/, '') );
  $emailField.get(0).reportValidity();
  window.setTimeout(function() {
    $emailField.get(0).setCustomValidity('');
  }, 5000);
  $emailField.change(function() {
    this.setCustomValidity('');
  });
};

app.reportGeneralError = function(data, $errorMsgDiv, $emailField) {
  var $ = jQuery;
  $errorMsgDiv.html(data.msg).addClass('visible');
  window.setTimeout(function() {
    $errorMsgDiv.html('').removeClass('visible');
  }, 10000);
  $emailField.change(function() {
    $errorMsgDiv.html('').removeClass('visible');
  });
};

app.detectKeyboardNavigation = function(event) {
  if (event.type === 'keydown' || event.type === 'keyup') {
    var target = jQuery(event.target);
    if (!target.is('input') || target.is('input:nth-last-of-type(2)')) {
      jQuery('html').addClass("using-keyboard-navigation");
    }
  } else if (event.type === 'click') {
    jQuery('html').removeClass("using-keyboard-navigation");
  }
};
jQuery(document).ready(function() {
  jQuery('html').on('keydown click', app.detectKeyboardNavigation);
});

app.isMobile = {
    Android : function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry : function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS : function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera : function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows : function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any : function() {
      return (app.isMobile.Android() || app.isMobile.BlackBerry() || app.isMobile.iOS() || app.isMobile.Opera() || app.isMobile.Windows());
    }
};

app.connectionSpeed = function() {
  var connection = navigator.connection || {
    'type' : '0'
  };
  switch (connection.type) {
    case connection.CELL_3G:
      return 'bandwidth-medium';
    case connection.CELL_2G:
      return 'bandwidth-low';
    case connection.UNKNOWN:
      return 'bandwidth-unknown';
    default:
      return 'bandwidth-high';
  }
};

app.resizeWideMenu = function() {
  var menuWidth = jQuery(window).width() - jQuery("div.logo").outerWidth() - 40 - jQuery("ul.wide + div.login-widget").outerWidth() - 20;
  jQuery("nav ul.dropdown.wide").width(menuWidth + "px");
  jQuery("nav ul.dropdown li").removeClass("adjusted");
};

app.viewportWidth = function(){
  var vpw;
  if (!(window.webkitConvertPointFromNodeToPage == null)) { // Webkit
    var vpwtest = document.createElement( "div" );
    // Sets test div to width 100%, !important overrides any other misc. box model styles that may be set in the CSS
    vpwtest.style.cssText = "width:100% !important; margin:0 !important; padding:0 !important; border:none !important;";
    document.documentElement.insertBefore( vpwtest, document.documentElement.firstChild );
    vpw = vpwtest.offsetWidth;
    document.documentElement.removeChild( vpwtest );
  } else if (window.innerWidth === undefined) { // IE 6-8:
    vpw = document.documentElement.clientWidth; 
  } else { // Other:
    vpw =  window.innerWidth;
  }
  return (vpw);
};

app.getScrollbarWidth = function() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
  document.body.appendChild(outer);
  var widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";
  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);
  var widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return widthNoScroll - widthWithScroll;
}

app.isMsBrowser = function(){
  var rv = false;
  if (navigator.appName == 'Microsoft Internet Explorer'){
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
    if (re.exec(ua) !== null){
      rv = parseFloat( RegExp.$1 );
    }
  } else if(navigator.appName == "Netscape"){
    if (navigator.appVersion.indexOf('Edge') >= 0) {
      rv = "Edge";
    } else if (navigator.appVersion.indexOf('Trident') >= 0) {
      rv = 11;
    }
  }
  return rv;
};

app.setTagTop = function() {
  jQuery('.fixed-at-top-on-scroll').each(function() {
    var $toBeFixedAtTop = jQuery(this);
    var toBeFixedAtTop = this;
    var $prevSibling = $toBeFixedAtTop.prev();
    if (($prevSibling.offset().top + $prevSibling.height()) <= jQuery(window).scrollTop()) {
      $toBeFixedAtTop.addClass('fixed-at-top');
      $toBeFixedAtTop.closest('section').addClass('contains-fixed-at-top');
    } else {
      $toBeFixedAtTop.removeClass('fixed-at-top');
      $toBeFixedAtTop.closest('section').removeClass('contains-fixed-at-top');
    }
  });
};

app.setStickTop = function() {
  jQuery('.stick-to-top').each(function() {
    var $toStick = jQuery(this);
    $toStick.css('margin-top', Math.max($toStick.attr('data-offset') - jQuery(window).scrollTop(), $toStick.attr('data-offset-min')) + "px");
    if (Math.max($toStick.attr('data-offset') - jQuery(window).scrollTop(), $toStick.attr('data-offset-min')) == $toStick.attr('data-offset-min')) {
      $toStick.addClass('at-top');
    } else {
      $toStick.removeClass('at-top');
    }
  });
};

app.getTooNarrowCheckContentWidths = function() {
  app.tooNarrowAreas = {};
  jQuery('.check-for-width-fit').each(function() {
    var $container = jQuery(this);
    var totalChildrenWidth = 0;
    var childrenOfType = $container.attr('data-check-selection');
    var reservedSpace = $container.attr('data-reserved-space');
    reservedSpace = reservedSpace || 0;
    $container.find(childrenOfType).each(function() {
      var marLeft = parseInt(app.getStyle(this, 'margin-left'));
      var marRight = parseInt(app.getStyle(this, 'margin-right'));
      totalChildrenWidth += this.offsetWidth + marLeft + marRight;
    });
    app.tooNarrowAreas[$container.attr('id')] = [totalChildrenWidth, parseInt(reservedSpace)];
  });
};

app.setTooNarrow = function() {
  jQuery('.check-for-width-fit').each(function() {
    var $container = jQuery(this);
    var totalChildWidth = app.tooNarrowAreas[$container.attr('id')][0];
    var reservedSpace = app.tooNarrowAreas[$container.attr('id')][1];
    if ((this.offsetWidth-reservedSpace) < totalChildWidth) {
      $container.addClass('too-narrow');
    } else {
      $container.removeClass('too-narrow');
    }
  });
};

app.getStyle = function (e, styleName) {
  var styleValue = "";
  if(document.defaultView && document.defaultView.getComputedStyle) {
    styleValue = document.defaultView.getComputedStyle(e, "").getPropertyValue(styleName);
  }
  else if(e.currentStyle) {
    styleName = styleName.replace(/\-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase();
    });
    styleValue = e.currentStyle[styleName];
  }
  return styleValue;
}

app.populateSearchResults = function() {
  var searchString = app.getUrlParameter('s');
  var searchStringLCase = searchString.toLowerCase();
  var resultTemplateContent = jQuery('template#results')[0].content;
  if (!searchString) {
    jQuery('#search-results').empty();
    var $searchSection = jQuery('article.no-search-terms', jQuery(resultTemplateContent));
    document.importNode($searchSection[0], true);
    jQuery('#search-results').append($searchSection);
    return;
  }
  jQuery('.search-terms').text(searchString);
  window.setTimeout(function() {
    app.cachedFetch(app.searchPath, {cacheStorage: sessionStorage, expiry: app.searchCacheSeconds}).then(r => r.json()).then(app.parseSearchAndCreatePageContent);
  }, 20);
};

app.cachedFetch = function(url, options) {
  useCacheMechanism = (fetch && typeof fetch == 'function') && (sessionStorage && typeof sessionStorage == 'object');
  if (useCacheMechanism) {
    var expiry = 60 * 60; // default 60-minute cache
    var cacheStorage = sessionStorage;
    if (typeof options === 'number') {
      expiry = options;
      options = undefined;
    } else if (typeof options === 'object') {
      expiry = options.expiry || expiry;
      cacheStorage = options.cacheStorage || cacheStorage;
    }
    var cacheKey = url;
    // can use sessionStorage instead of localStorage, so that cache is cleared between sessions,
    // but store timestamp no matter what so that even within a session things are re-checked every so often
    var cachedData = cacheStorage.getItem(cacheKey);
    var whenCached = cacheStorage.getItem(cacheKey + ':ts');
    if (cachedData !== null  && whenCached !== null) {
      var age = (Date.now() - whenCached) / 1000;
      if (age < expiry) {
        var response = new Response(new Blob([cachedData]));
        return Promise.resolve(response);
      } else if (cachedData.removeItem && typeof cachedData.removeItem == 'function') {
        // We need to clean up this old key in localStorage (no such capability in sessionStorage)
        cachedData.removeItem(cacheKey)
        cachedData.removeItem(cacheKey + ':ts')
      }
    }
    return fetch(url, options).then(response => {
      if (response.status === 200) {
        // store in cache if the content-type is JSON or something non-binary
        var contentType = response.headers.get('Content-Type')
        if (contentType && (contentType.match(/application\/json/i) || contentType.match(/text\//i))) {
          // store in sessionStorage as a string (not json) and
          // clone the response, so that it's not consumed by the time it's returned
          response.clone().text().then(content => {
            cacheStorage.setItem(cacheKey, content);
            cacheStorage.setItem(cacheKey+':ts', Date.now());
          });
        } else {
          console.log("not caching fetch response - not json or text");
        }
      } else {
        console.log("error retrieving search json via fetch API: response staus=" + response.status);
      }
      return response;
    }).catch(function(error) {
      console.log('error retrieving search json via fetch API', error);
    });
  } else {
    // for browsers without the fetch API which we use above for caching
    $.getJSON(app.searchPath, function() {
      window.setTimeout(app.parseSearchAndCreatePageContent, 20);
    }).fail(function() {
      console.log("error retrieving search json via jquery getJSON (XMLHttpRequest)");
    });
  }
};

app.parseSearchAndCreatePageContent = function(data) {
  var searchString = app.getUrlParameter('s');
  var searchStringLCase = searchString.toLowerCase();
  var resultTemplateContent = jQuery('template#results')[0].content;
  var records = {};
  for(var i=0; i<data.length; i++) {
    var record = data[i];
    if (!records[record.layout]) {
      records[record.layout] = new Array();
    }
    records[record.layout].push(record);
  }
  var searchResultCount = 0;
  for(var section in records) {
    // get all search fields
    records[section] = records[section].filter(function(postObject, index, arr) {
      var titleToSearch = postObject.title.toLowerCase();
      var contentToSearch = app.markdown.toHTML(postObject.content.replace(/<[^>]*>?/gm, '')).replace(/<[^>]*>?/gm, '').toLowerCase();
      var partnersToSearch = '';
      if (postObject.investment_partners) {
        for (var i=0; i<postObject.investment_partners.length; i++) {
          partnersToSearch += postObject.investment_partners[i]['name'] ? postObject.investment_partners[i]['name'].toLowerCase() + ';' : '';
        }
      }
      var investmentsToSearch = '';
      if (postObject.featured_investments) {
        for (var i=0; i<postObject.featured_investments.length; i++) {
          investmentsToSearch += postObject.featured_investments[i]['company'] ? postObject.featured_investments[i]['company'].toLowerCase() + ';' : '';
        }
      }
      if (postObject.investments) {
        for (var i=0; i<postObject.investments.length; i++) {
          investmentsToSearch += postObject.investments[i]['company'] ? postObject.investments[i]['company'].toLowerCase() + ';' : '';
        }
      }
      var tagsToSearch = '';
      if (postObject.tags) {
        for (var i=0; i<postObject.tags.length; i++) {
          tagsToSearch += postObject.tags[i] ? postObject.tags[i].toLowerCase() + ';' : '';
        }
      }
      // filter out all non-matching entries
      return titleToSearch.includes(searchStringLCase) || contentToSearch.includes(searchStringLCase) || partnersToSearch.includes(searchStringLCase) || investmentsToSearch.includes(searchStringLCase) || tagsToSearch.includes(searchStringLCase);
    });
    // count items found
    searchResultCount += records[section].length;
  }
  if (searchResultCount > 0) {
    var sortedBySectionRecords = {};
    ['post','news','company','bio','memo'].forEach(function(section) {
      if (records[section] && records[section].length>0) {
        sortedBySectionRecords[section] = records[section];
        if (section=='post' || section=='news') {
          // sort by date in decreasing order (latest first)
          sortedBySectionRecords[section].sort(function(a,b) {
            return b.date.localeCompare(a.date);
          });
        } else if (section=='bio') {
          var bioSectionSortedRecords = [];
          ['partner','investor','platform_advisor','*'].forEach(function(bioType) {
            var typeRecords = sortedBySectionRecords[section].filter(function(bio) {
              if (bioType=="*") {
                return !['partner','investor','platform_advisor'].includes(bio.type);
              }
              return (bio.type == bioType);
            });
            typeRecords.sort(function(a,b) {
              return app.compareBiosByName(a,b);
            });
            bioSectionSortedRecords = bioSectionSortedRecords.concat(typeRecords);
          });
          sortedBySectionRecords[section] = bioSectionSortedRecords;
        } else {
          // sort by title
          sortedBySectionRecords[section].sort(function(a,b) {
            return a.title.localeCompare(b.title);
          });
        }
      }
    });
    var postTemplateContent = jQuery('template#result-post')[0].content;
    var bioTemplateContent = jQuery('template#result-bio')[0].content;
    var regExpCaseInsensitive = new RegExp(searchString, "ig");
    jQuery('#search-results').empty();
    for(var section in sortedBySectionRecords) {
      var $searchSection = jQuery('article.' + section, jQuery(resultTemplateContent));
      document.importNode($searchSection[0], true);
      $searchSection.addClass('has-results').attr('data-count', records[section].length);
      jQuery('#search-results').append($searchSection);
      var lastType = '';
      for(var i in sortedBySectionRecords[section]) {
        var result=sortedBySectionRecords[section][i];
        
        // format title to get rid of all HTML
        var title = result.title.replace(/<[^>]*>?/gm, '');
        
        // format title to replace found instance of search term with a highlighted version:
        //   - get all matches and store them for use later
        title = title.replace(regExpCaseInsensitive, function(match) {
          return '<span class="search-string">' + match + '</span>';
        });
        
        // format content to get rid of all HTML and Mardown
        var content = app.markdown.toHTML(result.content.replace(/<[^>]*>?/gm, '')).replace(/<[^>]*>?/gm, '');
        
        // cut down content to five words before and five (or more) words after
        var contentIndexOfSearchStr = content.toLowerCase().indexOf(searchStringLCase);
        var startOfContentToDisplay = contentIndexOfSearchStr;
        for (var i=0; i<5 && startOfContentToDisplay>=0; i++) {
          startOfContentToDisplay = content.lastIndexOf(' ', startOfContentToDisplay-1);
        }
        var endOfContentToDisplay = contentIndexOfSearchStr;
        for (var j=0; j<5+5-i && endOfContentToDisplay<content.length; i++) {
          endOfContentToDisplay = content.indexOf(' ', endOfContentToDisplay+1);
          if (endOfContentToDisplay<0) {
            endOfContentToDisplay = content.length;
          }
        }
        
        // save original content length to determine if ellipsis are needed after the shortened content
        var originalContentLength = content.length;
        content = content.substring(startOfContentToDisplay,endOfContentToDisplay);
        
        // format content to replace found instance of search term with a highlighted version
        content = content.replace(regExpCaseInsensitive, function(match) {
          return '<span class="search-string">' + match + '</span>';
        });
        content = (startOfContentToDisplay>0 ? "&hellip;" : "") + content + (endOfContentToDisplay<originalContentLength-1 ? "&hellip;" : "");
        
        // use HTML template to add the result to the page
        if (section=='post' || section=='news') {
          var thisPostResultContent = postTemplateContent.cloneNode(true);
          thisPostResultContent = document.importNode(thisPostResultContent, true);
          var $thisPostResultContent = jQuery(thisPostResultContent);
          var articleDate = result.date ? result.date.substring(0, result.date.indexOf('T')) : '';
          jQuery('a', $thisPostResultContent).attr('href', result.url).attr('data-date', articleDate).attr('data-author', result.author ? result.author.trim() : '');
          jQuery('h3', $thisPostResultContent).html(title);
          jQuery('.content', $thisPostResultContent).html(content);
          jQuery('div.list', $searchSection).append($thisPostResultContent);
        } else if (section=='bio') {
          var thisPostResultContent = bioTemplateContent.cloneNode(true);
          thisPostResultContent = document.importNode(thisPostResultContent, true);
          var $thisPostResultContent = jQuery(thisPostResultContent);
          jQuery('a', $thisPostResultContent).attr('href', result.url).attr('data-type', result.type);
          jQuery('h3', $thisPostResultContent).html(title);
          jQuery('div.list', $searchSection).append($thisPostResultContent);
          jQuery('div.list', $searchSection).children().last().attr('data-type', result.type);
          if (lastType!=result.type.toLowerCase()) {
            jQuery('div.list', $searchSection).children().last().addClass('new-type')
            lastType = result.type.toLowerCase();
          }
        } else {
          var thisPostResultContent = bioTemplateContent.cloneNode(true);
          thisPostResultContent = document.importNode(thisPostResultContent, true);
          var $thisPostResultContent = jQuery(thisPostResultContent);
          jQuery('a', $thisPostResultContent).attr('href', result.url);
          jQuery('h3', $thisPostResultContent).html(title);
          jQuery('div.list', $searchSection).append($thisPostResultContent);
        }
      }
    }
  } else {
    jQuery('#search-results').empty();
    var $searchSection = jQuery('article.no-results', jQuery(resultTemplateContent));
    document.importNode($searchSection[0], true);
    jQuery('#search-results').append($searchSection);
  }
};

app.compareBiosByName = function(a,b) {
  if (a.sort_order && b.sort_order) {
    return a.sort_order.localeCompare(b.sort_order);
  }
  return a.title.localeCompare(b.title);
};

app.setMaxHeightFixed = function() {
  jQuery('.max-fixed-height').each(function() {
    var headerHeight = jQuery('header')[0].offsetHeight;
    var footerHeight = jQuery('footer')[0].offsetHeight;
    //var scrollBottom = jQuery(window).scrollTop() + jQuery(window).height();
    var scrollBottom = jQuery(document).height() - jQuery(window).height() - jQuery(window).scrollTop();
    if (scrollBottom <= footerHeight) {
      var addlReduction = footerHeight - scrollBottom;
      jQuery(this).css('max-height', 'calc(100vh - ' + headerHeight + 'px - ' + addlReduction + 'px)');
    } else {
      jQuery(this).css('max-height', '');
    }
  });
};

app.getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1].replace(/\+/g, '%20'));
    }
  }
};

jQuery.fn.outerHTML = function(s) {
  return s
      ? this.before(s).remove()
      : jQuery("<p>").append(this.eq(0).clone()).html();
};

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    enumerable: false,
    value: function(obj) {
        var newArr = this.filter(function(el) {
          return el == obj;
        });
        return newArr.length > 0;
      }
  });
};

/* initialize YouTube player for control via page links */
var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function onYouTubeIframeAPIReady() {
  app.ytplayer = new YT.Player('ytplayer', {
  });
}

app.homePeopleShown = new Array();
app.alreadyShow = new Array();
app.tooNarrowAreas = {};
app.ytplayer = null;
app.searchPath = app.searchPath || '/search.json';
app.searchCacheSeconds = app.searchCacheSeconds || 3600;
