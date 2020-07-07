import {withPluginApi} from 'discourse/lib/plugin-api';
import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";
import { iconNode } from "discourse-common/lib/icon-library";
import { default as Composer } from 'discourse/models/composer';

export default {
  name: 'npn-dropdown-menu-edits',

  initialize (container) {
    withPluginApi ('0.8.24', function (api) {

        api.decorateWidget('home-logo:after', helper => {
            const showExtraInfo = helper.attrs.minimized;
            const currentUser = api.getCurrentUser();
            const mobileView = helper.widget.site.mobileView;

            const menuClickHandler = () =>  {
            let $navLinkContainer = $('#nav-link-container');
            if ($navLinkContainer.css('visibility') === 'visible') {
                $navLinkContainer.css('visibility', 'hidden');
            } else if ($navLinkContainer.css('visibility') === 'hidden') {
                $navLinkContainer.css('visibility', 'visible');
            }
            };

            const subMenuClickHandler = () =>  {
            if ($('ul.nav-link-submenu').is(':visible')) {
                $('ul.nav-link-submenu').removeAttr('style');
                $('#header-menu-toggle').removeClass('toggled');
            } else if ($('ul.nav-link-submenu').is(':hidden')) {
                $('ul.nav-link-submenu').show();
                $('#header-menu-toggle').addClass('toggled');
            }
            };

            const openComposerClickHandler = () => {
              const container = Discourse.__container__;
              const controller = container.lookup("controller:navigation/category");
              const composerController = container.lookup("controller:composer");

              if (!Discourse.currentUser) {
                DiscourseURL.routeTo('/login');
                return;
              }

              composerController.open({
                action: Composer.CREATE_TOPIC,
                draftKey: Composer.DRAFT,
              });
            };

            var menu_links_buffer = [];
            var menu_links  = settings.npn_dropdown_menu_links.split('|');

            if (menu_links !== null) {
              if (menu_links.length > 0) {
                menu_links.forEach(link => {
                  const attributes = link.split(',');
                  menu_links_buffer.push (
                    h('li', [ h('a.nav-submenu-link', {
                        href: attributes[2]
                        }, [iconNode(attributes[0]),`${attributes[1]}`])
                    ])
                  )
                })
              }
            };

            menu_links_buffer.push (
                h('li', [h('a.submenu-open-composer',
                { onclick: openComposerClickHandler }, [iconNode("plus"), 'Classic Composer'])
                ])
            );

            let menu_buffer = mobileView ? [h('a.nav-link.submenu',
                                               h('span.menu-title', iconNode("plus")))] :
                                             [h('a.nav-link.submenu',
                                               h('span.menu-title', [
                                                iconNode("image"),
                                                iconNode("comments"),
                                                h('span.menu-title-text', 'New Photo/Discussion')]
                                             )),
                                              h('button.dropdown-toggle#header-menu-toggle',
                                                { onclick: subMenuClickHandler },
                                                iconNode("chevron-down", { class: "chevron-down" }))];

            menu_buffer.push(h('ul.nav-link-submenu', menu_links_buffer));

            if (!showExtraInfo) {
              return h('ul#nav-link-container', h('li.dropdown', menu_buffer))
            }
          })
        })
    }
}