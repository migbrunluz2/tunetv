var _____WB$wombat$assign$function_____ = function(name) {
    return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name)) || globalThis[name];
};
if (!globalThis.__WB_pmw) {
    globalThis.__WB_pmw = function(obj) {
        this.__WB_source = obj;
        return this;
    }
} {
    let window = _____WB$wombat$assign$function_____("window");
    let self = _____WB$wombat$assign$function_____("self");
    let document = _____WB$wombat$assign$function_____("document");
    let location = _____WB$wombat$assign$function_____("location");
    let top = _____WB$wombat$assign$function_____("top");
    let parent = _____WB$wombat$assign$function_____("parent");
    let frames = _____WB$wombat$assign$function_____("frames");
    let opener = _____WB$wombat$assign$function_____("opener");
    /**
     * ui.js -- user interface implementation
     * 
     * 
     * @author alex
     */
    RadioTime.localStrings = {
        /*	Stream statuses	*/
        "buffering": "Buffering...",
        "connecting": "Connecting...",
        "playing": "Playing",
        "stopped": "Stopped",
        "paused": "Paused",
        "starting": "Starting playback...",
        "stopping": "Stopping playback...",

        /*	API statuses	*/
        "status_loading": "Loading...",
        "status_loading_menu": "Loading menu...",
        "status_loading_schedule": "Loading schedule...",
        "status_searching": "Searching...",
        "status_adding_preset": "Adding preset...",
        "status_removing_preset": "Removing preset...",
        "status_checking_account": "Checking account...",
        "status_finding_stations": "Looking for stations...",
        "status_sync_time": "Synchronizing time...",
        "status_loading_configuration": "Loading configuration...",

        /*	Error statuses	*/
        "error_empty_playlist": "Empty or invalid playlist",
        "error_stream_error": "Stream error",
        "error_show_not_available": "The show is not available",
        "error_fetching_playlist": "Error fetching playlist",
        "error_fetching_listening_options": "Error fetching playlist",

        /*	Home screen		*/
        "account": "Account",
        "search": "Search",
        "settings": "Settings",
        "failed_to_load_root": "Can't access RadioTime guide. Please try again later.",
        "retry_page_load": "Reload the page now",
        "last_played": "Last played",
        "featured": "Featured",
        "preset": "Preset",

        /*	Browse screen	*/
        "home": "Home",
        "back": "Back",
        "browse_no_content": "No content is available.",
        "page_of": "Page %(current)%",
        "exit_wizard": "Exit wizard",

        /*	Search screen	*/
        "reset": "Reset",
        "search_instructions": "Search by program, station or genre.",
        "search_hint": "Enter at least 3 characters to start the search.",

        /*	Account screen	*/
        "pc_setup_configured": "RadioTime account is configured.",
        "pc_setup_username": "Username: ",
        "pc_setup_steps": "Follow these steps to associate your RadioTime account:",
        "pc_setup_instructions_1": "1. From www.radiotime.com logon with your account.",
        "pc_setup_instructions_2": "2. Go to My Info > Devices or <span>radiotime.com/mydevice</span>.",
        "pc_setup_instructions_3": "3. Enter the code displayed below.",
        "pc_setup_apply": "I entered the code",
        "pc_setup_privacy": "Privacy Policy",

        /* Feedback screen */
        "submit_feedback": "Submit feedback",
        "feedback_instructions": "We welcome any feedback or suggestions you might have:",
        "feedback_email.colon": "Your e-mail address (to let us reply):",
        "submit": "Send message",
        "sending_message": "Sending message...",
        "feedback_thanks_title": "Your message was sent",
        "feedback_thanks_text": "Thank you for helping us improving the service!",
        "back_to_station": "Return to the station",
        "feedback_error": "Error",
        "close": "Close",

        /*	Info screen		*/
        "play": "Play",
        "stop": "Stop",
        "add_to_presets": "Add to Presets",
        "remove_from_presets": "Remove from Presets",
        "options": "More Info",
        "options_hint": "Listening suggestions, alternative streams, report a problem",
        "on_now": "On now:",
        "next_on": "Next on",

        "lineup_tab": "Lineup",
        "about_tab": "About",
        "onnow_tab": "On now",
        "topics_tab": "Topics",
        "twitter_tab": "Twitter",
        "related_tab": "Related",

        "programming_gap": "Waiting for now playing information",
        "all_times_in": "All times are in",
        "recent_topics": 'Recent topics:',
        "related": 'Related stations:',
        "adding": "Adding...",
        "removing": 'Removing...',
        "report_problem": "Report a problem",
        "posted_at": "Posted at",
        "today": "today",
        "yesterday": "yesterday"
    }

    RadioTime.UI = {
        targetHeight: 720, //1280x720 px
        currentCategory: 0,
        isPlayPauseCombined: false,
        init: function() {
            this.args = this.parseUrlString(document.location.href);
            var env = this.args["s"] == "dev" ? "beta" : "stable";

            var isGoogleTV = /(fishtank|googletv)/i.test(navigator.userAgent) || this.args["p"] == "tv";
            var isChromeOS = /chrome\.tunein/i.test(document.location.href) || this.args["p"] == "chrome";
            var isBoxee = /boxee/i.test(navigator.userAgent) || this.args["p"] == "boxee";
            var isPlaybook = /playbook/i.test(navigator.userAgent);

            var partnerId = isChromeOS ? "wlcFfPTe" :
                isGoogleTV ? "Q0BhEfia" :
                isBoxee ? "4cJcz1b1" : "HyzqumNX";
            var history = isChromeOS ? "hash" : "internal";

            RadioTime.init(partnerId, 'basement', "rt-tools/", {
                'env': env,
                'includePlaylists': !/CE-HTML/.test(navigator.userAgent) && !isPlaybook,
                'onHistoryChange': this.onHistoryChange,
                'history': history,
                'verbose': true,
                'noPlayer': /iPhone/.test(navigator.userAgent),
                'useCache': true,
                'serial': this.args["serial"]
            });
            if (isPlaybook) {
                document.ontouchmove = function(event) {
                    event.preventDefault();
                }
            }

            // Trick for Google TV
            if (isGoogleTV) {
                this.loadCSS("css/1280x720.css");
                // doesn't look like Pause works in Flash player so commented out the line below
                // RadioTime.UI.isPlayPauseCombined = false; 
                //re-map keys
                window["VK_PLAY"] = 179;
                window["VK_STOP"] = 178;
            }
            this.fullPageScroll = isChromeOS || this.args["p"] == "n";
            if (this.fullPageScroll) {
                this.loadCSS("css/scrollable.css");
            }
            // Remove box-shadow from highlight
            if (RadioTime.agent.isPhilips()) {
                this.loadCSS("css/philips.css");
            }
            if (this.args["debug"]) {
                var logEl = document.createElement("div");
                logEl.id = "radiotime_log";
                logEl.innerHTML = "Log: ";
                document.body.appendChild(logEl);
                RadioTime.event.subscribe("flashEvent", function(obj) {
                    if (obj.command == "progress" || obj.command == "position") return;
                    document.getElementById("radiotime_log").innerHTML += obj.command + ": " + obj.arg + "<br/>";
                    document.getElementById("radiotime_log").scrollTop = 60000;
                });
            }
            // Make "tick" even fire every 3 seconds
            setInterval(function() {
                RadioTime.event.raise("tick");
            }, 3000);
            this.setupEventHandlers();
            this.setupViews();
            this.player.init();

            var _this = this;

            function onReady() {
                _this.renderView("home", {
                    URL: 0
                });
            }
            RadioTime.API.getConfig(onReady, onReady);
        },
        parseUrlString: function(url) {
            url += "&";
            if (url.indexOf("?") > -1)
                url = url.split("?")[1];
            var out = {};
            var re = /([^=&]+)=([^&]+)&/ig;
            var matches = re.exec(url);
            while (matches) {
                out[matches[1]] = matches[2];
                matches = re.exec(url);
            }
            return out;
        },
        preprocess: function(data) {
            data = RadioTime.UI.formatMetadata(data);
            var out = {
                data: {
                    "other": {
                        key: "other",
                        text: RadioTime.L("Other"),
                        children: []
                    }
                },
                length: 1
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].children) {
                    out.data[out.length - 1] = data[i];
                    out.length++;
                } else {
                    out.data["other"].children.push(data[i]);
                }
            }
            return out;
        },
        launch: function(url) {
            window.open(url, 'external');
        },
        parseProgramListeningOptions: function(data) {
            var out = {
                "stations": [],
                "topics": []
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].key == "topics" && data[i].children && data[i].children.length) {
                    out.topics = data[i].children;
                }
                if (data[i].key == "stations" && data[i].children && data[i].children.length) {
                    out.stations = data[i].children;
                }
            }
            out.has_stations = out.stations.length > 0;
            out.has_topics = out.topics.length > 0;
            return out;
        },
        subs: function(str, pairs) {
            /*
            |Name|Value|
            |--|--|
            |str|A template string|
            |pairs|An object mapping from placeholders to values|
            
            Implements a small template system which is useful for localizing and substituting HTML fragments for use with e.g. innerHTML.
            
            If a string contains %(x)%, it is substituted with:
            
            * pairs[x]
            
            If not found, and x starts with "label_", then it is replaced with:
             
            * RadioTime.L(x)
            
            If not found, and the string contains %(a ? b : c)% is replaced with:
              
            * b if pairs[a] is true, otherwise c
            */

            pairs = pairs || {};
            // substitute vars
            var out = str.replace(/%\((\w+)\)%/ig, function(match, p1) {
                if (typeof pairs[p1] != 'undefined') {
                    return pairs[p1];
                } else {
                    if (p1.indexOf("label_") == 0) {
                        return RadioTime.L(p1);
                    } else {
                        return "";
                    }
                }
            });
            // handle contitional statements %<condition>?<value if true>:<value if false>
            out = out.replace(/%\((\w+)\?([^:]*)\:(.*?)\)%/ig, function(match, p1, p2, p3) {
                if (pairs[p1])
                    return p2;
                else
                    return p3;
            });
            return out;
        },
        formatMetadata: function(data) {
            var out = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].text) {
                    var m = /([^\(\)]*)\((.*)\)/.exec(data[i].text);
                    if (m) {
                        data[i].text = RadioTime._trim(m[1]);
                        data[i].textEx = RadioTime._trim(m[2]);
                    }
                }
                if (data[i].children) {
                    if (data[i].key) { // copy "key" to children
                        for (var j in data[i].children) {
                            if (!data[i].children[j].key)
                                data[i].children[j].key = data[i].key;
                        }
                    }
                    data[i].children = this.formatMetadata(data[i].children);
                }
                out.push(data[i]);
            }
            return out;
        },
        truncateSentence: function(s, maxChars) {
            if (!s) return "";
            var el = "...";
            var words = s.split(" ");
            var out = '';
            var i = 0;
            while ((out + words[i] + el).length < maxChars && i < words.length) {
                out += words[i] + " ";
                i++;
            }
            if (!out) {
                out = s.substr(0, maxChars - el.length);
            }
            out = out.replace(/(!|\?|,|\.|\s)*$/i, '');
            if (i < words.length) {
                out += el;
            }
            return out;
        },
        $hide: function(name) {
            var el = RadioTime.$(name);
            if (el && el.style)
                el.style.display = "none";
        },
        $show: function(name) {
            var el = RadioTime.$(name);
            if (el && el.style)
                el.style.display = "block";
        },
        loadCSS: function(url, callback) {
            var head = document.getElementsByTagName('head')[0];
            var css = document.createElement('link');
            css.setAttribute('rel', 'stylesheet');
            css.setAttribute('type', 'text/css');
            css.setAttribute('href', url);
            css.onload = function() {
                if (callback) {
                    callback();
                }
            }
            head.appendChild(css);
        },
        inArray: function(what, where) {
            for (var i in where) {
                if (where[i] == what) {
                    return true;
                }
            }
            return false;
        },
        setupEventHandlers: function() {
            var handleKeyPress = function(e) {
                e = e || window.event;
                switch (e.keyCode) {
                    case VK_UP:
                    case VK_DOWN:
                    case VK_LEFT:
                    case VK_RIGHT:
                        if (e.preventDefault) e.preventDefault();
                        return false;
                        break;
                }
                return true;
            };

            // Disable browser from handling nav -- CE-HTML specific workaround
            if (/CE-HTML/.test(navigator.userAgent)) {
                if (document.addEventListener) {
                    document.addEventListener("keypress", handleKeyPress, true);
                } else if (document.attachEvent) {
                    document.attachEvent("keypress", handleKeyPress, true);
                }
            }
            if (!RadioTime.UI.fullPageScroll) {
                var handleMouseWheel = function(e) {
                    e = e || window.event;
                    var delta = 0;
                    if (e.wheelDelta) {
                        /* IE/Opera. */
                        delta = e.wheelDelta / 120;
                        if (window.detail) {
                            delta = -delta;
                        }
                    } else
                    if (e.detail) {
                        /** Mozilla case. */
                        delta = -e.detail / 3;
                    }

                    if (delta > 0) {
                        RadioTime.UI.navigator.processKey(VK_UP);
                    } else
                    if (delta < 0) {
                        RadioTime.UI.navigator.processKey(VK_DOWN);
                    }

                    if (e.preventDefault)
                        e.preventDefault();
                    e.returnValue = false;
                }
                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', handleMouseWheel, false);
                    window.addEventListener('mousewheel', handleMouseWheel, false);
                } else {
                    window.onmousewheel = handleMouseWheel;
                    document.onmousewheel = handleMouseWheel;
                }
            }
            RadioTime.event.subscribe("loading", function(message) {
                RadioTime.UI.waitIndicator.on(RadioTime.L(message));
            });
            RadioTime.event.subscribe("loaded", function(message) {
                RadioTime.UI.waitIndicator.off();

            });
            RadioTime.event.subscribe("failed", function(message) {
                RadioTime.debug("network error occured, while loading " + message);
                RadioTime.UI.waitIndicator.off();

            });

            RadioTime.$("cmd_back").onclick = function() {
                RadioTime.UI.goBack();
                return false;
            }

            RadioTime.$("cmd_home").onclick = function() {
                if (RadioTime.UI.viewName == 'home') {
                    window.location.reload();
                } else {
                    RadioTime.history.reset();
                    RadioTime.history.back();
                }
                return false;
            }
        },
        /*
         * Default keyboard handler
         */
        handleKeys: function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case VK_BACK:
                    // Workaround for Philips issue with BACK key on search field
                    if (RadioTime.agent.isPhilips()) {
                        // Consider instead testing for
                        // e.target.tagName == "INPUT" && e.target.type == "text"
                        if (e.target && e.target.id == "search_field") {
                            return true;
                        }
                    }
                    if (!RadioTime.UI.goBack()) {
                        RadioTime.UI.showPresets();
                    }
                    break;
                case VK_PLAY: // this should be usually overridden
                    if (RadioTime.UI.isPlayPauseCombined) {
                        RadioTime.UI.player.playOrPause();
                    } else {
                        RadioTime.UI.player.play();
                    }
                    break;
                case VK_STOP:
                    RadioTime.UI.player.stop();
                    break;
                case VK_PAUSE:
                    RadioTime.UI.player.pause();
                    break;
                case VK_UP:
                case VK_DOWN:
                case VK_LEFT:
                case VK_RIGHT:
                    return RadioTime.UI.navigator.processKey(e.keyCode);
                    break;
                default:
                    RadioTime.debug(e);
                    return true;
            }
            if (e.preventDefault) e.preventDefault();
            return false;
        },
        /*
         * TODO: 
         * 1. Handle case when the element having focus becomes invisible in real time
         */
        navigator: {
            modules: {},
            currentMid: '',
            previousMid: '',
            processKey: function(keyCode) {
                switch (keyCode) {
                    case VK_UP:
                        return this.up();
                    case VK_DOWN:
                        return this.down();
                    case VK_LEFT:
                        return this.left();
                    case VK_RIGHT:
                        return this.right();
                    default:
                        break;
                }
                return true;
            },
            up: function() {
                RadioTime.debug("up");
                return !this.walk(-1, "up");
            },
            down: function() {
                RadioTime.debug("down");
                return !this.walk(1, "down");
            },
            left: function() {
                RadioTime.debug("left");
                return !this.walk(-1, "left");
            },
            right: function() {
                RadioTime.debug("right");
                return !this.walk(1, "right");
            },
            /*
             * Walk within the current module
             * step is typically +1 or -1
             */
            walk: function(step, dir) {
                var m = this.modules[this.currentMid];
                if (!m) {
                    return false;
                }

                var jump = false;
                // target element
                var tel = this.currentElement;

                if (m.type == "matrix") {
                    // 2D module case
                    var row = Math.floor(this.currentElement / m.cols);
                    var column = this.currentElement % m.cols;
                    RadioTime.debug("From: " + row + ":" + column);
                    if (dir == "up" || dir == "down") {
                        row += step;
                        if (row < 0 || row > m.rows - 1) {
                            //jump = true;
                            // the code below allows going between columns using only Up and Down buttons
                            if (row < 0 && column == 0 || row > m.rows - 1 && column == m.cols - 1) {
                                jump = true;
                            } else {
                                if (row < 0) {
                                    tel = (m.rows - 1) * m.cols + column - 1;
                                } else {
                                    tel = column + 1;
                                }
                            }

                        } else {
                            tel = row * m.cols + column;
                        }
                    } else {
                        column += step;
                        if (column < 0 || column > m.cols - 1) {
                            jump = true;
                        } else {
                            tel = row * m.cols + column;
                        }
                    }

                    if (tel > m.elements.length - 1) {
                        jump = true;
                    }
                    if (!jump) {
                        RadioTime.debug("To: " + row + ":" + column);
                    }
                } else {
                    // 1D module case
                    if ((m.type == "vertical" && (dir == "left" || dir == "right")) ||
                        (m.type == "horizontal" && (dir == "up" || dir == "down"))) {

                        jump = true;
                    } else {
                        tel += step;
                        if (tel > m.elements.length - 1 || tel < 0) {
                            jump = true;
                        }
                    }
                }

                if (jump) {
                    if ((dir == "left" || dir == "right") && m.currentElement != undefined && m.elements[m.currentElement].el &&
                        (m.elements[m.currentElement].el.nodeName == "INPUT" ||
                            m.elements[m.currentElement].el.nodeName == "TEXTAREA") &&
                        "search_field" != m.elements[m.currentElement].el.id) { // very dirty hack to keep Right arrow working in search
                        RadioTime.debug("Don't jump out of INPUT");
                        return false;
                    }
                    this.jump(dir);
                } else {
                    if (this.canFocus(m.elements[tel].el)) {
                        this.currentElement = tel;
                        m.currentElement = tel;
                        m.elements[tel].el.focus();
                    } else { // can't focus the item, try next
                        this.walk(step + (step > 0 ? 1 : -1), dir);
                    }
                }
                return true;
            },
            /*
             * See if there is any module in the provided direction and jump there if there is one
             */
            jump: function(dir) {
                RadioTime.debug("do jump: " + dir);
                //neighbours
                var m = this.modules[this.currentMid];
                if (!m.neighbours || !m.neighbours[dir]) {
                    RadioTime.debug("Nothing there");
                    return;
                }
                var tmids = m.neighbours[dir];
                // Prefer previous module
                RadioTime.debug("previous: " + this.previousMid);
                RadioTime.debug(tmids);
                if (RadioTime.UI.inArray(this.previousMid, tmids)) {
                    this.activateModule(this.previousMid);
                } else {
                    this.activateModule(tmids[0]);
                }

            },
            activateModule: function(mid) {
                var m = this.modules[mid];
                if (!m) {
                    return false;
                }

                var tel = m.currentElement | 0;

                // If module provides custom onActivate use it
                if (m.onActivate) {
                    tel = m.onActivate(tel);
                }
                var temp = this.currentMid;
                if (m.elements[tel] && this.tryFocus(m.elements[tel].el, m)) {
                    this.previousMid = temp;
                }
            },
            tryFocus: function(el, m) {
                if (el && this.canFocus(el)) {
                    el.focus();
                    return true;
                } else {
                    for (var i = 0; i < m.elements.length; i++) {
                        if (this.canFocus(m.elements[i].el)) {
                            m.elements[i].el.focus();
                            return true;
                        }
                    }
                }
                return false;
            },
            canFocus: function(el) {
                return (el.offsetWidth > 0 && el.offsetHeight > 0) && !/hidden/.test(el.className); // does this really work?
            },
            /*
             * "mid": Module id
             * "root": Root HTML element if not provided "elements" must be populated
             * "elements": An array of ids of the elements to include in the module
             * "type": Module type -- "vertical", "horizontal" or "matrix"
             * "neighbours": map of the modules around
             * "focus": element to put initial focus on (optional)
             * 
             */
            registerModule: function(module) {
                if (!module.mid) {
                    module.mid = RadioTime.makeId();
                }
                if (this.modules[module.mid]) {
                    RadioTime.debug("Rewriting existing module: " + module.mid);
                    this.unregisterModule(module.mid);
                }
                var i = 0;
                var links = [];
                if (module.root) {
                    links = module.root.getElementsByTagName("a"); // CE
                    if (!links.length) {
                        links = module.root.getElementsByTagName("A"); // "Normal" browser
                    }
                } else {
                    for (i = 0; i < module.elements.length; i++) {
                        links.push(RadioTime.$(module.elements[i]));
                    }
                }
                if (module.type == "matrix") {
                    module.rows = Math.floor(links.length / module.cols - 0.01) + 1;
                }
                var _this = this;
                var elements = [];
                var order = 0;
                var offsetX = 0;
                var offsetY = 0;
                for (i = 0; i < links.length; i++) {
                    /*
                    offsetX = links[i].offsetLeft;
                    offsetY = links[i].offsetTop;
                    switch (module.type) {
                    case "matrix":
                    order = i;
                    break;
                    case "horizontal":
                    order = offsetX;
                    break;
                    case "vertical":
                    default:
                    order = offsetY;
                    break;
                    }
                    RadioTime.debug("Order: " + order);
                    */
                    elements.push({
                        "el": links[i],
                        "order": order
                    });
                }
                /*
                elements.sort(function(a, b) {
                return (a.order - b.order);
                });
                */
                for (i = 0; i < elements.length; i++) {
                    elements[i].index = i;
                    (function(m) {
                        m.onfocus_s = m.el.onfocus;
                        m.el.onfocus = function() {
                            _this._onLinkFocus(m, module.mid);
                        }
                        /* Not used now
                        m.onblur_s = m.el.onblur;
                        m.el.onblur = function(){
                        _this._onLinkBlur(m, module.mid);
                        }
                        */
                        // Little hook for devices with mouse-like pointer
                        m.el.onmouseover = function() {
                            m.el.focus();
                        }
                    })(elements[i]);
                }

                module.elements = elements;

                this.modules[module.mid] = module;

                if (module.focus && !this.isModal) {
                    this.tryFocus(module.focus, module);
                }
                this.isModal = this.isModal || module.isModal;

                return module.mid;
            },
            _onLinkFocus: function(el, mid) {
                RadioTime.debug(el, mid);
                this.currentMid = mid;
                this.currentElement = el.index;
                this.modules[this.currentMid].currentElement = el.index;
                if (el.onfocus_s) {
                    el.onfocus_s.call(el.el);
                }
            },
            _onLinkBlur: function(el, mid) {
                //RadioTime.debug(el, mid);
            },
            unregisterModule: function(mid) {
                if (!this.modules[mid]) {
                    return;
                }
                if (mid == this.currentMid) {
                    //this.currentMid = '';
                    RadioTime.debug("Unregistering current module: " + mid);
                }
                var els = this.modules[mid].elements;
                for (i = 0; i < els.length; i++) {
                    els[i].el.onfocus = els[i].onfocus_s;
                    els[i].onfocus_s = null;
                    els[i].el.onblur = null;
                    delete els[i];
                }
                if (this.modules[mid].isModal) {
                    this.isModal = false;
                }
                delete els;
                delete this.modules[mid];
            },
            unregisterAll: function() {
                for (var mid in this.modules) {
                    this.unregisterModule(mid);
                }
            }
        },
        lastPlayed: {
            _outline: null,
            save: function(outline) {

                this._outline = outline;
                if (outline.parent_id) {
                    this._outline.guide_id = outline.parent_id;
                }
                this._outline.oType = RadioTime._getIdType(this._outline.guide_id);
                var logo_id = this._outline.image
    ? (this._outline.image.match(/\/(\w\d*)q?\.png/) || [null, "s0"])[1] + (this._outline.image.match(/\/(\w\d*)q?\.png/) ? "q" : "")
    : "s0";
                this._outline.image = RadioTime.getLogoUrl(logo_id, "square");
                RadioTime.cookie.save("lpid", outline.guide_id, 365);
                RadioTime.cookie.save("lpnm", outline.text, 365);
                RadioTime.cookie.save("lpii", logo_id, 365);
            },    get: function() {
                if (this._outline) {
                    return this._outline;
                }
                var guide_id = RadioTime.cookie.read("lpid");
                var text = RadioTime.cookie.read("lpnm");
                var logo_id = RadioTime.cookie.read("lpii");

                if (guide_id && text && logo_id) {
                    var oType = RadioTime._getIdType(guide_id);
                    this._outline = {
                        "guide_id": guide_id,
                        "text": text,
                        "subtext": "",
                        "textEx": "",
                        "type": (oType == "program") ? "link" : "audio",
                        "image": RadioTime.getLogoUrl(logo_id, "square"),
                        "URL": RadioTime.getTuneUrl(guide_id).replace("http://", "https://"),

                        "oType": oType
                    }
                    return this._outline;
                } else {
                    return null;
                }
            }
        },
        player: {
            init: function() {
                // Setup event handlers
                var _this = this;
                RadioTime.$("mini-player-info").onclick = function() {
                    _this.showNowPlaying();
                    return false;
                }
                RadioTime.$("mini-player-play").onclick = function() {
                    _this.playOrStop();
                    return false;
                }
                RadioTime.event.subscribe("playbackFailed", function(message) {
                    if ("error_stream_error" == message && RadioTime.player.next()) {
                        return;
                    }
                    RadioTime.$("mini-player-subtitle").innerHTML = RadioTime.L(message);
                    RadioTime.$("mini-player-display").className = "error";
                    setTimeout(function() {
                        if (RadioTime.$("mini-player-display").className == "error") {
                            RadioTime.$("mini-player-display").className = "";
                        }
                    }, 10000); // hide in 10 seconds

                });
                RadioTime.event.subscribe("playstateChanged", function(state) {
                    _this.updateDisplay(state);
                });
                RadioTime.event.subscribe("scheduleProgress", function(np) {
                    if (_this.elementPlaying && _this.elementPlaying.guide_id == np.guide_id) {
                        _this.updateTimebar(np.item);
                    }
                });
                //Setup a scheduler object
                this.nowPlayingText = "";
                this.schedule = {};
                RadioTime.merge(this.schedule, RadioTime.schedule);

            },
            updateTimebar: function(np) {
                if (np.text != this.nowPlayingText) {
                    this.nowPlayingText = np.text;
                    this.updateDisplay("");
                }
                RadioTime.UI.$show("mini-player-visual");
                RadioTime.UI.$show("mini-player-time");
                RadioTime.$("mini-player-time").innerHTML = RadioTime.formatTime(np.end);
                var width = RadioTime.$("mini-player-visual").offsetWidth *
                    ((RadioTime.now().getTime() - np.start) / (np.end - np.start));
                RadioTime.$("mini-player-visual-progress").style.width = width + "px";
            },
            resetTimebar: function() {
                RadioTime.UI.$hide("mini-player-visual");
                RadioTime.UI.$hide("mini-player-time");
                this.nowPlayingText = "";
            },
            updateDisplay: function(state) {
                state = state || RadioTime.player.currentState;
                if (this.elementPlaying) {
                    var title = this.elementPlaying.name || this.elementPlaying.text;
                    if (this.elementPlaying.current_artist && this.elementPlaying.current_song) {
                        this.elementPlaying.current_track = this.elementPlaying.current_song + " (" + this.elementPlaying.current_artist + ")";
                    }
                    var subtitle = this.nowPlayingText || this.elementPlaying.current_track || this.elementPlaying.subtext;
                    if (subtitle) {
                        title += ' &mdash; ' + subtitle;
                    }
                    RadioTime.$("mini-player-title").innerHTML = title;

                    if (this.elementPlaying.image) {
                        RadioTime.$("mini-player-display-image").src = this.elementPlaying.image.replace(/(q|s)?\.png/, "q.png");

                    }
                }
                if (RadioTime.player.isBusy) {
                    RadioTime.$("mini-player-play").className = "button playing";
                } else {
                    RadioTime.$("mini-player-play").className = "button";
                }
                switch (state) {
                    case "error":
                        RadioTime.event.raise("playbackFailed", "error_stream_error");
                        break;
                    case "playing":
                    case "buffering":
                    case "connecting":
                    case "starting":
                    case "stopping":
                        if (this.elementPlaying) {
                            RadioTime.$("mini-player-subtitle").innerHTML = RadioTime.L(state);
                            if (state == "playing") {
                                RadioTime.$("mini-player-display").className = "playing";
                            } else {
                                RadioTime.$("mini-player-display").className = "loading";
                            }

                        } else {
                            RadioTime.$("mini-player-display").className = "";
                            RadioTime.$("mini-player-subtitle").innerHTML = "Browse or search, then play.";
                        }
                        break;
                    case "stopped":
                        RadioTime.$("mini-player-display").className = "stopped";
                        if (this.elementPlaying) {
                            RadioTime.$("mini-player-play").className = "button";
                            RadioTime.$("mini-player-subtitle").innerHTML = RadioTime.L("stopped");
                        } else {
                            RadioTime.$("mini-player-display").className = "";
                            RadioTime.$("mini-player-subtitle").innerHTML = "Browse or search, then play.";
                        }
                        break;
                    default:
                        RadioTime.$("mini-player-display").className = "stopped";
                        RadioTime.$("mini-player-play").className = "button";
                        RadioTime.$("mini-player-subtitle").innerHTML = RadioTime.L("stopped");
                }
            },
            play: function(object) {
                // Stop whatever plays now
                if (RadioTime.player.isBusy) {
                    this.stop();
                }
                if (!object) {
                    RadioTime.player.play();
                    return false;
                }

                this.elementPlaying = object;

                RadioTime.event.raise("playstateChanged", "starting");

                this.resetTimebar();
                var _this = this;

                this.schedule.stopUpdates();

                if (object.has_schedule) {
                    // Delay a bit to avoid duplicate schedule requests
                    setTimeout(function() {
                        _this.schedule.init(object.guide_id);
                    }, 1000);
                }

                if (object && object.type == "audio") {
                    RadioTime.loadJSON(object.URL, function(data) {
                        RadioTime.debug("playlist:");
                        RadioTime.debug(data);
                        if (data && data.length) {
                            _this.elementPlaying = object;
                            RadioTime.UI.lastPlayed.save(object);
                            RadioTime.event.raise("playlistAvailable", data);
                            if (!RadioTime.player.isSupported()) {
                                return true;
                            }
                            RadioTime.player.startPlaylist(data);
                        } else {
                            RadioTime.event.raise("playbackFailed", "error_empty_playlist");
                        }
                    }, function() { // handle error
                        RadioTime.event.raise("playbackFailed", "error_fetching_playlist");
                    });
                }
                if (object && object.type == "link" && object.oType == "program") {
                    if (object.listeningOptions) {
                        this.elementPlaying = object;
                        this.play(object.listeningOptions[0]);
                    } else {

                        RadioTime.API.getProgramListeningOptions(function(data) {
                                data = RadioTime.UI.parseProgramListeningOptions(data);
                                if (data.has_stations || data.has_topics) {
                                    _this.elementPlaying = object;
                                    _this.play(data.has_stations ? data.stations[0] : data.topics[0]);
                                } else {
                                    RadioTime.event.raise("playbackFailed", "error_show_not_available");
                                }
                            }, function() {
                                RadioTime.event.raise("playbackFailed", "error_fetching_listening_options");
                            },
                            object.guide_id);
                    }
                }
                return !RadioTime.player.isSupported();
            },
            playOrStop: function() {
                if (!RadioTime.player.isBusy) {
                    return this.play();
                } else {
                    return this.stop();
                }
            },
            playOrPause: function() {
                if (!RadioTime.player.isBusy) {
                    return this.play();
                } else {
                    return this.pause();
                }
            },
            showNowPlaying: function() {
                if (this.elementPlaying) {
                    RadioTime.UI.renderView('info', this.elementPlaying);
                }
                return false;
            },
            stop: function() {
                RadioTime.event.raise("playstateChanged", "stopping");
                RadioTime.player.stop();
                return false;
            },
            pause: function() {
                RadioTime.event.raise("playstateChanged", "stopping");
                RadioTime.player.pause();
                return false;
            }
        },
        setupViews: function() {
            for (var vi in this.views) {
                RadioTime.merge(this.views[vi], this.viewPrototype, true);
                this.views[vi].viewName = vi;
            }
        },
        renderView: function(name, outline, fromHistory) {
            if (typeof this.views[name] == "undefined") {
                return;
            }

            if (this.currentView && this.currentView.teardown) {
                this.currentView.teardown();
            }

            this.viewName = name;
            outline.viewName = name;
            this.currentView = this.views[this.viewName];

            if (this.currentView.init) {
                this.currentView.init(outline);
            }
            var previous = RadioTime.history.last();
            RadioTime.debug("prev " + (previous && previous.current && previous.current.text));
            var previousText = (previous && previous.current && previous.current.text) ?
                previous.current.text :
                RadioTime.L('home');
            if (this.currentView.outline && !fromHistory) {
                RadioTime.history.add({
                    'previous': previousText,
                    'current': this.currentView.outline
                });
                if (name == "home") {
                    RadioTime.history.createRestorePoint();
                }
            }
            RadioTime.$("back-button-caption").innerHTML = previousText;
        },
        selectMenu: function(index) {
            RadioTime.UI.renderView('browse', RadioTime.UI._menu[index]);
            RadioTime.history.reset();
            RadioTime.UI.currentCategory = index;

            return false;
        },
        showPresets: function() {
            if (!this.presetsOutline) {
                return false;
            }
            RadioTime.UI.renderView('browse', this.presetsOutline);
            return false;
        },
        onHistoryChange: function(historyData) {
            if (!(historyData && historyData.previous && historyData.current)) {

                RadioTime.UI.renderView("home", {
                    URL: 0
                }, false)
            } else {
                RadioTime.UI.renderView(historyData.current.viewName, historyData.current, true);
            }
            if (historyData && historyData.previous) {
                RadioTime.$("back-button-caption").innerHTML = historyData.previous
            }
        },
        goBack: function() {
            return RadioTime.history.back();
        },
        /*
         * Common functions for all views
         */
        viewPrototype: {
            browseTo: function(index) {
                // Handle special case of submit report action
                if (this._outlines[index].key == "submitReport") {

                    var params = RadioTime.UI.parseUrlString(this._outlines[index].URL);

                    RadioTime.UI.renderView('feedback', {
                        "text": RadioTime.L('submit_feedback'),
                        "id": params['id'],
                        "subtext": this._outlines[index].subtext
                    });
                    return false;
                }
                RadioTime.UI.renderView('browse', this._outlines[index]);
                return false;
            },
            infoById: function(id) {
                RadioTime.UI.renderView('info', {
                    "text": "",
                    "guide_id": id,
                    "oType": RadioTime._getIdType(id),
                    "image": RadioTime.getLogoUrl(id, "square"),
                    "URL": RadioTime.getTuneUrl(id).replace("http://", "https://")

                });
                return false;
            },
            info: function(index) {
                RadioTime.UI.renderView('info', this._outlines[index]);
                return false;
            },
            search: function(query) {
                RadioTime.UI.renderView('search', {
                    "text": RadioTime.L('search')
                });
                return false;
            },
            account: function(query) {
                RadioTime.UI.renderView('account', {
                    "text": RadioTime.L('account')
                });
                return false;
            },
            privacy: function() {
                RadioTime.UI.renderView('privacy', {
                    "text": RadioTime.L('pc_setup_privacy')
                });
                return false;
            },
            play: function(index) {
                if (this._outlines && this._outlines[index]) {
                    return RadioTime.UI.player.play(this._outlines[index]);
                } else if (this.outline) {
                    return RadioTime.UI.player.play(this.outline);
                }
            },
            loadingFailed: function(reason) {
                var msg = '<div class="message error">' +
                    RadioTime.L('failed_to_load_root') +
                    '</div>';
                msg += '<div class="message error-details">';
                if (reason) {
                    msg += reason;
                }
                if (RadioTime.UI.lastError) {
                    msg += '<br/>' + RadioTime.UI.lastError;
                }
                msg += '</div>';

                RadioTime.UI.popup.show({
                    html: msg,
                    buttons: [{
                        text: RadioTime.L('retry_page_load'),
                        action: function() {
                            this.close();
                            RadioTime.UI.currentView.init();
                            return false;
                        }
                    }, {
                        text: RadioTime.L('back'),
                        action: function() {
                            this.close();
                            RadioTime.UI.goBack();
                            return false;
                        }
                    }]
                });

            },
            setupHandlers: function() {
                document.onkeydown = function(e) {
                    return RadioTime.UI.handleKeys(e);
                }
            },
            teardown: function() {
                RadioTime.debug("Unloading view: " + RadioTime.UI.viewName);
                RadioTime.UI.$hide("play-onnow");
                // Restore #listing-stations-header, changed by search view
                $("#listing-stations-header").html('<h1 id="nav-title"></h1><span id="nav-subtitle"></span><span id="pagination-caption"></span>');
                // Unsubscribe from all events and delete handlers
                for (var hid in this.hids) {
                    RadioTime.event.unsubscribe(hid);
                    delete this.hids[hid];
                }
                document.onkeydown = null;
                RadioTime.schedule.stopUpdates();
                this.scroller.reset();
                RadioTime.UI.navigator.unregisterAll();
            },
            hids: {},
            addEventHandler: function(name, handler) {
                var hid = RadioTime.event.subscribe(name, handler);
                this.hids[hid] = handler;
            },
            scroller: {
                init: function(container, paginator, tH /*target height*/ , indicator, maxPages, textBlock) {
                    this._container = container;
                    this._paginator = paginator;
                    this._indicator = indicator;
                    this._maxPages = maxPages;
                    this._currentPage = -1;

                    RadioTime.debug("container.offsetHeight: " + container.offsetHeight);
                    RadioTime.debug("target height: " + tH);
                    this._moving = container.firstChild;
                    if (this._moving && textBlock) {
                        var overlap = 50;
                        var adjustedHeight = tH - overlap; // overlap allows partially obscured lines to be fully visible on subsequent pages
                        this._pagesCount = Math.ceil(container.scrollHeight / adjustedHeight);
                        this._rowsCount = this._pagesCount;
                        this._rowsPerPage = 1;
                        this._rowHeight = adjustedHeight;
                    } else if (this._moving && this._moving.firstChild && this._moving.firstChild.nextSibling) {
                        this._rowHeight = this._moving.firstChild.nextSibling.offsetTop - 1; // why -1? who knows, it works
                        RadioTime.debug("calculated row height: " + this._rowHeight);
                        RadioTime.debug("offset height: " + this._moving.firstChild.offsetHeight);
                        this._rowsCount = container.firstChild.childNodes.length;
                        if (RadioTime.UI.fullPageScroll) { // No pagination?
                            this._rowsPerPage = this._rowsCount;
                        } else {
                            this._rowsPerPage = Math.floor(tH / this._rowHeight);
                        }
                        this._pagesCount = Math.ceil(this._rowsCount / this._rowsPerPage);
                        container.style.height = this._rowsPerPage * this._rowHeight + "px";
                    } else {
                        this._pagesCount = 1;
                        this._rowsCount = container.firstChild.childNodes.length;
                        this._rowsPerPage = this._rowsCount;
                        this._rowHeight = 53; // shouldn't matter as long as it's set
                        container.style.height = tH + "px";
                    }
                    if (this._pagesCount > 1) {
                        this.renderPaginator();
                        this.selectPage(0, true);
                        RadioTime.event.raise("multiPage", true);
                    } else {
                        this.reset();
                        RadioTime.event.raise("multiPage", false);
                    }
                    RadioTime.debug("pages:" + this._pagesCount);

                    this._pos = 0;
                    this.scrollTo(0);
                    // that's crazy but normal browser and CE need different case here
                    var links = this._moving.getElementsByTagName("a"); // CE
                    if (!links.length) {
                        links = this._moving.getElementsByTagName("A"); // "Normal" browser
                    }
                    var _this = this;
                    for (var i = 0; i < links.length; i++) {
                        links[i].onfocus = function() {
                            _this._onfocus(this);
                        }
                        links[i].onblur = function() {
                            _this._onblur(this);
                        }
                    }
                },
                reset: function() {
                    if (this._paginator) {
                        this._paginator.innerHTML = "";
                        this._paginator.style.height = "auto";
                        this._currentPage = -1;
                    }
                },
                renderPaginator: function() {
                    if (!this._paginator) return;
                    var out = [];
                    for (var i = 0; i < this._pagesCount; i++) {
                        out.push('<li><a id="page_selector_' + i + '" href="#" ');
                        out.push('onfocus="return RadioTime.UI.currentView.scroller.selectPage(' + i + ');" ');
                        out.push('>' + (i + 1) + '</a></li>');
                    }
                    this._paginator.innerHTML = out.join("");
                    var dH = RadioTime.$("page_selector_1").offsetHeight + 3;
                    this._paginator.style.height = this._maxPages * dH + "px";
                },
                selectPage: function(num, automatic) {
                    if (num < 0) {
                        num = 0;
                    }
                    if (num > this._pagesCount - 1) {
                        num = this._pagesCount - 1;
                    }
                    if (num == this._currentPage) {
                        return false;
                    }
                    RadioTime.debug("selectPage " + num);
                    this.scrollTo(-num * this._rowHeight * this._rowsPerPage);
                    this._currentPage = num;
                    for (var i = 0; i < this._pagesCount; i++) {
                        if (!RadioTime.$('page_selector_' + i)) {
                            continue;
                        }
                        if (i == this._currentPage) {
                            RadioTime.$('page_selector_' + i).className = "current";
                        } else {
                            RadioTime.$('page_selector_' + i).className = "";
                        }
                    }
                    if (this._indicator) {
                        this._indicator.innerHTML = RadioTime.UI.subs(
                            RadioTime.L('page_of'), {
                                "current": this._currentPage + 1,
                                "total": this._pagesCount
                            }
                        );
                    }

                    this.scrollPageSelectors();

                    RadioTime.event.raise("pageChanged", num);
                    if (!automatic) {
                        RadioTime.event.raise("pageReset", num * this._rowsPerPage);
                    }
                    return false;
                },
                scrollPageSelectors: function() {
                    var currentPageSelector = $('#page_selector_' + this._currentPage);
                    if (currentPageSelector.length > 0) {
                        var scrollTop = this._paginator.scrollTop;
                        var scrollBottom = scrollTop + this._paginator.offsetHeight;
                        var elementTop = currentPageSelector.attr('offsetTop');
                        var elementBottom = elementTop + currentPageSelector.attr('offsetHeight');
                        if ((elementTop < scrollTop) || (elementBottom > scrollBottom)) { // if element is partially or wholly hidden by scrolling
                            // this will vertically center the current page selector
                            $('#page_selector_' + Math.max(0, this._currentPage - Math.floor(this._maxPages / 2))).each(function(index, el) {
                                if (el.scrollIntoView) {
                                    el.scrollIntoView();
                                }
                            });
                        }
                    }
                },
                _onfocus: function(elem) {
                    var top = elem.parentNode.offsetTop;
                    var bottom = top + elem.parentNode.offsetHeight;
                    var height = this._container.offsetHeight;
                    /*
                    if (bottom + this._pos > height) {
                    this.scrollTo(-(bottom - height));
                    } 
                    if (top + this._pos < 0) {
                    this.scrollTo(-top);
                    }*/

                    // We used to scroll but now we page
                    var targetPage = Math.floor(top / (this._rowHeight * this._rowsPerPage));
                    if (this._currentPage != targetPage) {
                        this.selectPage(targetPage, true);
                    }
                    RadioTime.event.raise("elementFocused", elem);
                },
                _onblur: function(elem) {
                    RadioTime.event.raise("elementBlurred", elem);
                },
                scrollTo: function(offset) {
                    if (!this._moving) {
                        RadioTime.debug("Scrolling uninialized view. Probably a bug!")
                        return;
                    }
                    RadioTime.debug("Scroll to " + offset + " px");
                    this._moving.style.top = offset + "px";
                    this._pos = offset;
                }
            }
        },
        views: {
            "home": {
                maxFeatured: 6,
                filterCategories: ["settings"],
                init: function(outline) {
                    this.outline = outline;
                    this.setupLayout();
                    this.setupHandlers();
                    var _this = this;
                    RadioTime.API.getHomeScreen(function(data) {
                        _this.onData(data);
                    }, function() {
                        _this.loadingFailed('RadioTime.API.getHomeScreen');
                    });
                },
                setupLayout: function() {
                    document.body.className = "home";
                    RadioTime.$("control-actions").innerHTML = "";
                    RadioTime.$("control-actions-dynamic").innerHTML = "";
                    RadioTime.$("nav-title").innerHTML = "";
                    RadioTime.$("pagination-caption").innerHTML = "";
                    RadioTime.UI.$hide("listing-image");
                    RadioTime.UI.$hide("back-button");
                    RadioTime.UI.$hide("play-progress");
                    RadioTime.UI.$hide("play-metainfo");
                    RadioTime.UI.$hide("pagination-footer");
                    RadioTime.UI.$hide("listing-stations-header");
                    RadioTime.UI.$show("listing-stations");

                    RadioTime.$("main").style.height = "auto";
                    RadioTime.$("main").innerHTML = '<div class="message loading">' + RadioTime.L('status_loading') + '</div>';

                    RadioTime.$("control-actions-dynamic").innerHTML = '<li><a id="cmd_account" class="button" href="#">Account</a></li>';

                    RadioTime.$("cmd_account").innerHTML = RadioTime.L('account');

                },
                setupHandlers: function() {
                    var _this = this;

                    document.onkeydown = function(e) {
                        return RadioTime.UI.handleKeys(e);
                    }

                    RadioTime.$("cmd_account").onclick = function() {
                        RadioTime.UI.currentView.account();
                        return false;
                    }
                },
                onData: function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].key == "content") {
                            this.renderContent(data[i].children);
                        } else if (data[i].key == "navigation") {
                            data[i] = this.filterMenu(data[i].children);
                            this.renderMenu(data[i]);
                            RadioTime.UI._menu = data[i];
                        }
                    }
                },
                filterMenu: function(data) {
                    var out = [];
                    for (var i = 0; i < data.length; i++) {
                        data[i].index = i;
                        if (data[i].key && RadioTime.UI.inArray(data[i].key, this.filterCategories)) {
                            continue;
                        }
                        if (!data[i].key) {
                            data[i].key = RadioTime.makeId();
                        }
                        if (data[i].key == "presets") {
                            RadioTime.UI.presetsOutline = data[i];
                        }
                        out.push(data[i]);
                    }
                    return out;
                },
                renderMenu: function(data) {
                    var out = [];
                    out.push('<div class="row"><a id="menu_search" href="#" class="button menu">' + RadioTime.L('search') + '</a></div>');
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].key != "language") {
                            out.push(RadioTime.UI.subs('<div class="row"><a id="menu_%(key)%" href="%(URL)%" class="button menu" onclick="return RadioTime.UI.selectMenu(%(index)%);">%(text)%</a></div>', data[i]));
                        }
                    }
                    RadioTime.$("control-actions").innerHTML = out.join("");

                    $("#menu_search").click(function() {
                        RadioTime.UI.currentView.search();
                        return false;
                    });

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-actions"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"],
                            "right": ["main-featured"],
                            "down": ["search-settings"]
                        }
                    });
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-actions-dynamic"),
                        "type": "horizontal",
                        "mid": "search-settings",
                        "neighbours": {
                            "left": ["main-menu"],
                            "up": ["main-menu"],
                            "right": ["main-featured"],
                            "down": ["main-featured"]
                        }
                    });
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("header"),
                        "type": "horizontal",
                        "mid": "header",
                        "neighbours": {
                            "down": ["main-menu", "main-featured"]
                        }
                    });
                },
                renderContent: function(data) {
                    var outlines = [];
                    var out = [];
                    var index = 0;
                    var last = RadioTime.UI.lastPlayed.get();
                    var ids = []; // remeber ids of what's included to avoid repeatitions
                    if (last) {
                        ids.push(last.guide_id);
                        last.index = 0;
                        last.label = RadioTime.L("last_played");
                        last.subtext = RadioTime.UI.truncateSentence(last.subtext, 40);
                        outlines.push(last);
                        index++;
                        out.push(RadioTime.UI.subs('<div class="feature"><a class="button" href="#" onclick="return RadioTime.UI.currentView.info(%(index)%);" id="outlines_%(index)%"><span class="logo"><img src="%(image)%"/></span><div class="recent label">%(label)%</div><div class="title">%(text)%</div><div class="description">%(subtext)%</div><div class="location">%(textEx)%</div></a></div>', last));
                    }
                    for (var pi in data) {
                        if (data[pi].type == "audio" && !RadioTime.UI.inArray(data[pi].guide_id, ids)) {
                            if (index > this.maxFeatured - 1) break;
                            ids.push(data[pi].guide_id);
                            data[pi].index = index;
                            data[pi].label = data[pi].is_preset ? RadioTime.L("preset") : RadioTime.L("featured");
                            data[pi].labelClass = data[pi].is_preset ? "preset" : "featured";
                            data[pi].subtext = RadioTime.UI.truncateSentence(data[pi].subtext, 40);
                            outlines.push(data[pi]);
                            index++;
                            out.push(RadioTime.UI.subs('<div class="feature"><a class="button" href="#" onclick="return RadioTime.UI.currentView.info(%(index)%);" id="outlines_%(index)%"><span class="logo"><img src="%(image)%"/></span><div class="%(labelClass)% label">%(label)%</div><div class="title">%(text)%</div><div class="description">%(subtext)%</div><div class="location">%(textEx)%</div></a></div>', data[pi]));
                        }
                    }
                    this._outlines = outlines;
                    RadioTime.$("main").innerHTML = out.join("");

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("main"),
                        "type": "matrix",
                        "cols": 2,
                        "mid": "main-featured",
                        "focus": RadioTime.$("outlines_0"),
                        "neighbours": {
                            "up": ["main-menu", "search-settings"],
                            "left": ["main-menu", "search-settings"]
                        }
                    });
                }
            },
            "feedback": {
                init: function(outline) {
                    this._id = outline.id;
                    this.outline = outline;
                    this.setupLayout();
                    this.setupHandlers();
                    var _this = this;
                },
                setupLayout: function() {
                    RadioTime.$("nav-title").innerHTML = RadioTime.L("submit_feedback");
                    RadioTime.UI.$show("back-button");
                    RadioTime.UI.$hide("play-progress");
                    RadioTime.UI.$hide("play-metainfo");
                    RadioTime.UI.$show("listing-stations");
                    RadioTime.UI.$show("listing-stations-header");

                    var html = '<div class="message">' + RadioTime.L('feedback_instructions') + '</div>'
                    html += '<div class="message text-input"><textarea id="text"></textarea></div>';
                    html += '<div class="message">' + RadioTime.L('feedback_email.colon') + '</div>'
                    html += '<div class="message text-input"><input type="text" id="email"/></div>';
                    html += '<div class="message"><a id="submit_btn" href="#" class="button submit" onclick="RadioTime.UI.currentView.submit(); return false;" >' + RadioTime.L("submit") + '</a></div>'

                    RadioTime.$("main").innerHTML = html;

                    if (this.outline.subtext) {
                        RadioTime.$("text").innerHTML = this.outline.subtext + "\n";
                    }

                    RadioTime.$("control-actions").innerHTML = '';
                    RadioTime.$("control-actions-dynamic").innerHTML = '';

                    RadioTime.UI.navigator.registerModule({
                        "elements": ["text", "email", "submit_btn"],
                        "type": "vertical",
                        "mid": "main",
                        "neighbours": {
                            "up": ["main-menu"],
                            "left": ["main-menu"]
                        }
                    });
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-browse"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"],
                            "down": ["main"],
                            "right": ["main"]
                        },
                        "focus": RadioTime.$("cmd_back")
                    });
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("header"),
                        "type": "horizontal",
                        "mid": "header",
                        "neighbours": {
                            "down": ["main-menu"]
                        }
                    });
                },
                submit: function() {
                    RadioTime.API.submitFeedback(function() {
                        var text = '<span class="feedback-popup-title">' +
                            RadioTime.L("feedback_thanks_title") +
                            '</span>';
                        text += '<span class="feedback-popup-text">' +
                            RadioTime.L("feedback_thanks_text") +
                            '</span>';
                        RadioTime.UI.popup.show({
                            html: text,
                            buttons: [{
                                text: RadioTime.L('back_to_station'),
                                action: function() {
                                    this.close();
                                    RadioTime.UI.currentView.backToInfo();
                                    return false;
                                }
                            }]
                        });
                    }, function(data) {

                        var text = '<span class="feedback-popup-title">' +
                            RadioTime.L("feedback_error") +
                            '</span>';
                        text += '<span class="feedback-popup-text">' +
                            data.fault +
                            '</span>';

                        RadioTime.UI.popup.show({
                            html: text,
                            buttons: [{
                                text: RadioTime.L('close'),
                                action: function() {
                                    this.close();
                                    RadioTime.$("cmd_back").focus();
                                    return false;
                                }
                            }]
                        });
                    }, RadioTime.$("text").value, RadioTime.$("email").value, this._id);
                },
                backToInfo: function() {
                    RadioTime.history.restore();
                    //this.infoById(this._id);
                }
            },
            "account": {
                init: function(outline, opts) {
                    this.outline = outline;
                    this.setupLayout();
                    this.setupHandlers();
                    var _this = this;
                    RadioTime.API.getAccountStatus(function(data) {
                        if (opts && opts.invalidateCache) {
                            RadioTime.cache.clear();
                        }
                        _this.renderAccount(data);
                    }, function() {
                        _this.loadingFailed('RadioTime.API.getAccountStatus');
                    });
                },
                setupLayout: function() {
                    document.body.className = "browse";
                    RadioTime.$("nav-title").innerHTML = RadioTime.L("account");
                    RadioTime.UI.$show("back-button");
                    RadioTime.UI.$hide("play-progress");
                    RadioTime.UI.$hide("play-metainfo");
                    RadioTime.UI.$show("listing-stations");
                    RadioTime.UI.$show("listing-stations-header");

                    RadioTime.$("main").innerHTML = '<div class="message loading">' + RadioTime.L('status_loading') + '</div>';
                    RadioTime.$("control-actions").innerHTML = '';
                    RadioTime.$("control-actions-dynamic").innerHTML = '';

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-browse"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"]
                        },
                        "focus": RadioTime.$("cmd_back")
                    });
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("header"),
                        "type": "horizontal",
                        "mid": "header",
                        "neighbours": {
                            "down": ["main-menu"]
                        }
                    });
                },
                renderAccount: function(data) {
                    var out = '';
                    var actions = '';
                    if (data.hasAccount) {
                        out += '<div class="message">' + RadioTime.L('pc_setup_configured') + '</div>';
                        out += '<div class="message code">' + RadioTime.L('pc_setup_username') + data.text + '</div>';
                    } else {
                        out += '<div class="message">' + RadioTime.L('pc_setup_steps') + '</div>';
                        out += '<div class="message">' + RadioTime.L('pc_setup_instructions_1') + '</div>';
                        out += '<div class="message">' + RadioTime.L('pc_setup_instructions_2') + '</div>';
                        out += '<div class="message">' + RadioTime.L('pc_setup_instructions_3') + '</div>';
                        out += '<div class="message code">' + data.text + '</div>';
                        actions = '<a href="#" class="button ok" onclick="RadioTime.UI.currentView.init(null, {invalidateCache: true}); return false;" >' + RadioTime.L("pc_setup_apply") + '</a>';
                    }
                    actions += '<a href="#" class="button ok" onclick="RadioTime.UI.currentView.privacy(); return false;" >' + RadioTime.L("pc_setup_privacy") + '</a>';
                    RadioTime.$("control-actions").innerHTML = actions;
                    RadioTime.$("main").innerHTML = out;

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-browse"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"]
                        },
                        "focus": RadioTime.$("cmd_back")
                    });

                }
            },
            "privacy": {
                browseHeight: 464,
                browseMaxPages: 5,
                init: function(outline) {
                    this.outline = outline;
                    this.setupLayout();
                    this.setupHandlers();
                    var _this = this;
                    RadioTime.API.getPrivacyPolicy(function(data) {
                        _this.renderPrivacy(data);
                    }, function() {
                        _this.loadingFailed('RadioTime.API.getPrivacyPolicy');
                    });
                },
                setupPagination: function() {
                    var _this = this;
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-browse"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"],
                            "right": ["pagination"],
                            "down": ["main"],
                            "left": ["pagination"]
                        }
                    })
                    this.addEventHandler("multiPage", function(is_multipage) {
                        if (is_multipage) {
                            RadioTime.UI.$show("pagination-caption");
                            RadioTime.UI.$show("pagination-footer");;
                            RadioTime.UI.navigator.registerModule({
                                "root": RadioTime.$("pagination-side"),
                                "type": "vertical",
                                "mid": "pagination",
                                "neighbours": {
                                    "up": ["header"],
                                    "right": ["main-menu"],
                                    "left": ["main-menu"]
                                }
                            });
                        } else {
                            RadioTime.UI.$hide("pagination-caption");
                            RadioTime.UI.$hide("pagination-footer");
                            RadioTime.UI.navigator.unregisterModule("pagination");
                        }
                    });
                    this.scroller.init(RadioTime.$("main"), RadioTime.$("pagination-side"), this.browseHeight, null, this.browseMaxPages, true);
                },
                setupLayout: function() {
                    document.body.className = "browse";
                    RadioTime.$("nav-title").innerHTML = RadioTime.L("pc_setup_privacy");
                    RadioTime.UI.$show("back-button");
                    RadioTime.UI.$hide("play-progress");
                    RadioTime.UI.$hide("play-metainfo");
                    RadioTime.UI.$show("listing-stations");
                    RadioTime.UI.$show("listing-stations-header");

                    RadioTime.$("main").style.height = this.browseHeight + "px";
                    RadioTime.$("main").innerHTML = '<div class="message loading">' + RadioTime.L('status_loading') + '</div>';
                    RadioTime.$("control-actions").innerHTML = '';
                    RadioTime.$("control-actions-dynamic").innerHTML = '';

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-browse"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"]
                        },
                        "focus": RadioTime.$("cmd_back")
                    });
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("header"),
                        "type": "horizontal",
                        "mid": "header",
                        "neighbours": {
                            "down": ["main-menu"]
                        }
                    });
                },
                renderPrivacy: function(data) {
                    var out = '';
                    var actions = '';

                    out += '<div id="moving" class="listing"><div id="policy">';
                    out += data.content;
                    out += '</div></div>';

                    RadioTime.$("control-actions").innerHTML = actions;
                    RadioTime.$("main").innerHTML = out;
                    this.setupPagination();
                }
            },
            "search": {
                triggerDelay: 300, // ms
                browseHeight: 464, //465,
                browseMaxPages: 10,
                init: function(outline) {
                    this.outline = outline;
                    this.setupLayout();
                    this.renderSearchPane();
                    this.setupHandlers();
                    RadioTime.debug("q:" + this.outline.query);
                    this.hasResults = false;
                    if (this.outline.query) {
                        this.doSearch(this.outline.query, true);

                    }
                },
                timeFilter: {
                    _timeout: 400, // ms
                    _timer: false,
                    run: function(callback) {
                        if (this._timer !== false) {
                            clearTimeout(this._timer);
                            this._timer = false;
                        }
                        var _this = this;
                        this._timer = setTimeout(function() {
                            callback.call();
                            _this._timer = false;
                        }, this._timeout);
                    }
                },
                setupLayout: function() {
                    document.body.className = "browse";
                    RadioTime.$("nav-title").innerHTML = RadioTime.L("search");
                    RadioTime.$("nav-subtitle").innerHTML = "";
                    RadioTime.UI.$show("back-button");
                    RadioTime.UI.$hide("play-progress");
                    RadioTime.UI.$hide("play-metainfo");
                    RadioTime.UI.$show("listing-stations");
                    RadioTime.UI.$show("listing-stations-header");
                    RadioTime.$("control-actions-dynamic").innerHTML = "";

                    RadioTime.$("main").innerHTML = '<div class="message">' + RadioTime.L("search_instructions") + '</div>';
                },
                setupHandlers: function() {
                    var _this = this;

                    RadioTime.UI.views.browse.setupHandlers.call(this);

                    RadioTime.$("reset_button").onclick = function() {
                        _this.doReset();
                        return false;
                    }
                    RadioTime.$("search_field").onkeypress = function() {
                        _this.timeFilter.run(function() {
                            _this.doSearch(RadioTime.$("search_field").value);
                        });
                    }
                    if (!RadioTime.agent.isPhilips()) {
                        RadioTime.$("search_field").onkeyup = function(e) {
                            e = e || window.event;
                            // Handle only backspace -- doesn't seem to fire onkeypress
                            if (e.keyCode == 8) {
                                _this.timeFilter.run(function() {
                                    _this.doSearch(RadioTime.$("search_field").value);
                                });
                            }
                        }
                    }
                },
                doSearch: function(text, auto) {
                    if (text == this.outline.query && this.hasResults) {
                        return;
                    }
                    if (text.length < 3) {
                        if (text.length) {
                            RadioTime.$("main").innerHTML = '<div class="message">' + RadioTime.L("search_hint") + '</div>';
                            RadioTime.$("listing-image").src = "s0q.png";
                            RadioTime.UI.$hide("listing-image");
                            RadioTime.$("pagination-side").innerHTML = "";
                        }
                        return;
                    }
                    this.outline.query = text;

                    var _this = this;
                    RadioTime.API.search(function(data) {
                        _this.showResults(data, auto);
                    }, function() {
                        _this.loadingFailed('RadioTime.API.search: ' + text);
                    }, text, "");
                },
                doReset: function() {
                    this.outline.query = '';
                    this.outline.currentOutline = 0;
                    RadioTime.$("search_field").value = '';
                    RadioTime.$("main").innerHTML = '<div class="message">' + RadioTime.L("search_instructions") + '</div>';
                    RadioTime.$("listing-image").src = "s0q.png";
                    RadioTime.UI.$hide("listing-image");
                    RadioTime.$("pagination-side").innerHTML = "";
                    RadioTime.$("search_field").focus();
                },
                showResults: function(data, auto) {
                    this.hasResults = true;
                    this.renderFilteredData(RadioTime.response.outline(data, ["audio", "link"]));
                    if (auto) {
                        RadioTime.$("search_field").value = this.outline.query;
                        RadioTime.UI.views.browse.focusCurrentOutline.call(this);
                    } else {
                        this.outline.currentOutline = 0;
                    }
                },
                renderSearchPane: function() {
                    var out = '';
                    out += '<a id="reset_button" href="#" class="button">' + RadioTime.L('reset') + '</a>';
                    RadioTime.$("control-actions").innerHTML = out;
                    // need to restored innerHTML of #listing-stations-header
                    $("#listing-stations-header").html('<div class="button search_box"><input id="search_field" size="22" /></div>');

                    RadioTime.UI.navigator.registerModule({
                        "elements": ["cmd_back", "reset_button"],
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"],
                            "right": ["search"],
                            "down": ["search"]
                        }
                    });
                    RadioTime.UI.navigator.registerModule({
                        "elements": ["search_field"],
                        "type": "vertical",
                        "mid": "search",
                        "neighbours": {
                            "up": ["header"],
                            "down": ["main"],
                            "left": ["main-menu"]
                        }
                    });
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("header"),
                        "type": "horizontal",
                        "mid": "header",
                        "neighbours": {
                            "down": ["main-menu", "search"]
                        }
                    });
                    RadioTime.$("search_field").focus();
                },
                renderFilteredData: function(data) {
                    var renderedData = RadioTime.UI.views.browse.renderFilteredData.call(this, data);
                    RadioTime.UI.views.browse.showFilteredData.call(this, renderedData);
                },
                registerMainModule: function() {
                    var _this = this;
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("main"),
                        "type": "vertical",
                        "mid": "main",
                        "neighbours": {
                            "up": ["search"],
                            "right": ["pagination"],
                            "left": ["main-menu"]
                        },
                        "onActivate": function(index) {
                            return _this.outline.currentOutline;
                        }
                    });
                }
            },
            "browse": {
                browseHeight: 464, //465,
                browseMaxPages: 5,
                cacheTTL: 30 * 1000,
                isProblemWizard: false, // a special mode
                init: function(outline) {
                    if (outline) {
                        this.outline = outline;
                    }
                    this.isProblemWizard = /c=wizard/.test(this.outline.URL);
                    if (this.isProblemWizard && !/options=flatten/.test(this.outline.URL)) {
                        this.outline.URL += "&options=flatten";
                    }

                    this.setupLayout();
                    this.setupHandlers();

                    var _this = this;
                    RadioTime.event.raise("loading", 'status_loading');
                    RadioTime.loadJSON(this.outline.URL, function(data, head) {
                        _this.renderOutlines(data);
                        // Use OPML title for local
                        if (head.title && _this.outline.key == "local") {
                            RadioTime.$("nav-title").innerHTML = head.title;
                        }
                    }, function() {
                        _this.loadingFailed('RadioTime.loadJSON: ' + _this.outline.URL);
                    }, this.cacheTTL);
                },
                setupLayout: function() {
                    document.body.className = "browse";

                    RadioTime.$("nav-title").innerHTML = this.outline.text;
                    RadioTime.$("nav-subtitle").innerHTML = "";
                    RadioTime.UI.$show("back-button");
                    RadioTime.UI.$hide("play-progress");
                    RadioTime.UI.$hide("play-metainfo");
                    RadioTime.UI.$show("listing-stations");
                    RadioTime.UI.$show("listing-stations-header");
                    RadioTime.UI.$hide("pagination-caption");
                    RadioTime.UI.$hide("pagination-footer");

                    RadioTime.$("control-actions").innerHTML = "";
                    if (!this.isProblemWizard) {
                        RadioTime.$("control-actions-dynamic").innerHTML = "";
                    } else {
                        RadioTime.$("control-actions-dynamic").innerHTML = '<a href="#" class="button" onclick="RadioTime.UI.currentView.historyRestore();return false;">' +
                            RadioTime.L('exit_wizard') + '</a>';
                    }
                    RadioTime.$("main").innerHTML = '<div class="message loading">' + RadioTime.L('status_loading') + '</div>';

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("header"),
                        "type": "horizontal",
                        "mid": "header",
                        "neighbours": {
                            "down": ["main-menu", "main"]
                        }
                    });
                },
                setupHandlers: function() {
                    var _this = this;
                    document.onkeydown = function(e) {
                        e = e || window.event;
                        switch (e.keyCode) {
                            /*
                            // Let's use default handler here to avoid confusion
                            case VK_PLAY:
                            RadioTime.UI.currentView.play(_this.outline.currentOutline);
                            break;
                            */
                            default:
                                return RadioTime.UI.handleKeys(e);
                        }
                        return false;
                    }
                    this.addEventHandler("elementFocused", function(elem) {
                        if (!elem.title) {
                            return;
                        }
                        _this.outline.currentOutline = parseInt(elem.title);
                        var focusedOutline = _this._outlines[_this.outline.currentOutline];
                        if (focusedOutline) {
                            if (focusedOutline.image) {
                                RadioTime.$("listing-image").src = focusedOutline.image;
                                RadioTime.UI.$show("listing-image");
                            } else {
                                RadioTime.UI.$hide("listing-image");
                                RadioTime.$("listing-image").src = "s0q.png";
                            }
                        }
                    });
                    this.addEventHandler("elementBlurred", function(elem) {
                        if (!elem.title) {
                            return;
                        }
                        RadioTime.$("listing-image").src = "s0q.png";
                        RadioTime.UI.$hide("listing-image");
                    });
                    this.addEventHandler("pageChanged", function(page) {
                        _this.outline.currentPage = parseInt(page);
                    });
                    this.addEventHandler("pageReset", function(item) {
                        _this.outline.currentOutline = parseInt(item);
                    });
                    this.addEventHandler("multiPage", function(is_multipage) {
                        if (is_multipage) {
                            RadioTime.UI.$show("pagination-caption");
                            RadioTime.UI.$show("pagination-footer");
                            RadioTime.UI.navigator.registerModule({
                                "root": RadioTime.$("pagination-side"),
                                "type": "vertical",
                                "mid": "pagination",
                                "neighbours": {
                                    "up": ["header"],
                                    "right": ["main-menu"],
                                    "left": ["main"]
                                },
                                "onActivate": function(index) {
                                    return _this.outline.currentPage;
                                }
                            });
                        } else {
                            RadioTime.UI.$hide("pagination-caption");
                            RadioTime.UI.$hide("pagination-footer");
                            RadioTime.UI.navigator.unregisterModule("pagination");
                        }
                    });
                },
                historyRestore: function() {
                    RadioTime.history.restore();
                },
                renderFilters: function(data) {
                    var out = "";
                    var filtersCount = 0;
                    this._filters = data;
                    for (var i in data) {
                        if (data[i].children && data[i].children.length) {
                            filtersCount++;
                            data[i].index = i;
                            // Collect children
                            var hint = [],
                                len = 0;
                            for (var j = 0; j < data[i].children.length; j++) {
                                hint.push(data[i].children[j].text);
                                len += data[i].children[j].text.length;
                                if (len > 60) {
                                    break;
                                }
                            }
                            data[i].textEx = hint.join(", ");
                            out += RadioTime.UI.subs('<li><a class="button" href="#" onfocus="return RadioTime.UI.currentView.applyFilter(\'%(index)%\');" id="filters_%(index)%">%(text)%<span class="sub">%(textEx)%</span></a></li>', data[i]);
                            // pre-render data for each filter
                            if (typeof this._filters[i].renderedData == "undefined") {
                                this._filters[i].renderedData = this.renderFilteredData(data[i].children);
                            }
                        }
                    }


                    // Don't show filters unless more than one
                    RadioTime.$("control-actions").innerHTML = (filtersCount > 1) ? out : "";
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-browse"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"],
                            "right": ["main"],
                            "down": ["main"],
                            "left": ["pagination"]
                        }
                    });
                },
                applyFilter: function(index, skipReset) {
                    if (this.outline.currentFilterIndex === index && !skipReset) {
                        return false;
                    }
                    this.outline.currentFilterIndex = index;
                    var currentFilter = this._filters[index].text;
                    var filterClass = 'filter-' + index;

                    if (!skipReset) {
                        this.outline.currentOutline = 0;
                        this.outline.currentPage = 0;
                    }
                    if (this._filters && this._filters[index]) {
                        //
                        //	Handle case when Other only inludes one item
                        //	The code below is disabled because it doesn't work well with onfocus content switch approach
                        //
                        if (false && index == "other" && this._filters[index].children.length == 1) {
                            var el = this._filters[index].children[0];
                            el.oType = RadioTime._getIdType(el.guide_id);
                            if (el.type == "link") {
                                RadioTime.UI.currentView.browseTo(0);
                                return;
                            } else if (el.type == "audio" || el.oType == "program") {
                                RadioTime.UI.currentView.info(0);
                                return;
                            }

                        }
                        this._outlines = this._filters[index].children;
                        if (typeof this._filters[index].renderedData == "undefined") {
                            this._filters[index].renderedData = this.renderFilteredData(this._filters[index].children);
                        }
                        this.showFilteredData(this._filters[index].renderedData);
                        if (skipReset) {
                            this.focusCurrentOutline();
                        }
                    }
                    for (var fi in this._filters) {
                        if (!RadioTime.$("filters_" + fi)) {
                            continue;
                        }
                        if (index == fi) {
                            RadioTime.$("filters_" + fi).className = "button filter current " + filterClass;
                            if (!skipReset) {
                                RadioTime.$("filters_" + fi).focus();
                            }
                        } else {
                            RadioTime.$("filters_" + fi).className = "button filter";
                        }
                    }
                    // RadioTime.$("nav-title").innerHTML = this._filters[index].text + ":";
                    RadioTime.$("moving").className = "listing " + filterClass;


                    return false;
                },
                renderFilteredData: function(data) {
                    this._outlines = data;

                    // detect heterogenous data
                    var hasImages = false;
                    var hasLinks = false;
                    for (var i = 0; i < data.length; i++) {
                        data[i].index = i;
                        data[i].oType = RadioTime._getIdType(data[i].guide_id);
                        switch (true) {
                            case data[i].type == "audio":
                            case data[i].oType == "program":
                                hasImages = true;
                                break;
                            case data[i].type == "link":
                                hasLinks = true;
                                break;
                        }
                    }
                    var hetero = hasImages && hasLinks;

                    var out = "",
                        firstIndex = -1;

                    for (i = 0; i < data.length; i++) {

                        switch (true) {
                            case data[i].type == "audio":
                            case data[i].oType == "program":
                                if (data[i].image) {
                                    data[i].sImage = data[i].image.replace(/q?\.png/, "q.png");
                                }
                                if (RadioTime.UI.fullPageScroll) {
                                    out += RadioTime.UI.subs('<li><a class="button %(image?withimage:alongimage)%" href="#" onclick="return RadioTime.UI.currentView.info(%(index)%);" title="%(index)%">' + (data[i].image ? '<img src="%(sImage)%" alt="" width="70" height="50"/>' : '') + '%(text)%%(subtext?<span class="description">%(subtext)%</span>:)% %(is_local?<div class="local-label">local</div>:)%</a></li>', data[i]);
                                } else {
                                    out += RadioTime.UI.subs('<li><a class="button %(image?withimage:alongimage)%" href="#" onclick="return RadioTime.UI.currentView.info(%(index)%);" title="%(index)%">' + (data[i].image ? '<img src="%(sImage)%" alt="" width="70" height="50"/>' : '') + '%(text)%%(subtext? <span class="description">&mdash; %(subtext)%</span>:)% %(is_local?<div class="local-label">local</div>:)%</a></li>', data[i]);
                                }
                                if (firstIndex < 0) {
                                    firstIndex = i;
                                }
                                break;
                            case data[i].type == "link":
                                out += RadioTime.UI.subs('<li><a class="button' + (hetero ? ' alongimage' : '') + '" href="#" onclick="return RadioTime.UI.currentView.browseTo(%(index)%);" title="%(index)%">%(text)%%(subtext? <span class="description">%(subtext)%</span>:)%</a>', data[i]);
                                if (firstIndex < 0) {
                                    firstIndex = i;
                                }
                                break;
                            default:
                                out += RadioTime.UI.subs('<li><div class="caption browse">%(text)%</div></li>', data[i]);
                                break;
                        }
                    }
                    if (!out) {
                        out = '<div class="message">' + RadioTime.L('browse_no_content') + '</div>';
                    }
                    return {
                        "html": out,
                        "firstIndex": firstIndex
                    };
                },
                showFilteredData: function(data) {
                    RadioTime.$("main").innerHTML = '<ol id="moving" class="listing">' + data.html + '</ol>';

                    // Restore state of the navigation, when popping from history
                    if (typeof this.outline.currentOutline == "undefined") {
                        this.outline.currentOutline = data.firstIndex;
                    }

                    if (typeof this.outline.currentPage == "undefined") {
                        this.outline.currentPage = 0;
                    }
                    if (data.firstIndex != -1) {
                        this.scroller.init(RadioTime.$("main"), RadioTime.$("pagination-side"), this.browseHeight, /*RadioTime.$("pagination-caption")*/ null, this.browseMaxPages);
                        this.scroller.selectPage(this.outline.currentPage);
                        this.registerMainModule();
                    }
                },
                registerMainModule: function() {
                    var _this = this;
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("main"),
                        "type": "vertical",
                        "mid": "main",
                        "neighbours": {
                            "up": ["main-menu"],
                            "right": ["pagination"],
                            "left": ["main-menu"]
                        },
                        "onActivate": function(index) {
                            return _this.outline.currentOutline;
                        }
                    });
                },
                focusCurrentOutline: function() {
                    var selector = "#main a[title='" + this.outline.currentOutline + "']";
                    if (jQuery(selector).length) {
                        jQuery(selector).focus();
                    } else {
                        RadioTime.$("cmd_back").focus();
                    }
                },
                renderOutlines: function(data) {
                    data = RadioTime.UI.preprocess(data);
                    RadioTime.debug(data);
                    //data = RadioTime.response.flatten(data, true);
                    if (data.length == 1) {
                        this.renderFilters({});
                        var renderedData = this.renderFilteredData(data.data["other"].children);
                        this.showFilteredData(renderedData);
                        this.focusCurrentOutline();
                    } else {
                        this.renderFilters(data.data);
                        var currentFilter = 0;
                        if (typeof this.outline.currentFilterIndex != "undefined") {
                            currentFilter = this.outline.currentFilterIndex;
                        }
                        this.applyFilter(currentFilter, true);
                    }

                }
            },
            "info": {
                songInfoTimeout: 120, // seconds
                browseHeight: 300,
                browseMaxPages: 5,
                tweetsPerPage: 2,
                hideOptions: ["nowplaying", "schedule"],
                isPaused: false,
                init: function(outline) {
                    if (!outline && this.outline) {
                        outline = this.outline;
                    }
                    // We are changing the stream
                    if (outline.oType == "stream") {
                        this.outline.URL = outline.URL;
                        this.outline.type = "audio";
                        this.outline.guide_id = "s" + outline.station_id;
                        RadioTime.UI.player.stop();
                    } else {
                        this.outline = outline;
                    }
                    this.scheduleData = null;
                    this.relatedData = null;
                    this.onNowElement = null;
                    this.onNowDisplayed = null;
                    this.currentTab = "onnow";
                    if (RadioTime.UI.fullPageScroll) {
                        this.tweetsPerPage = 10;
                    }
                    //RadioTime.history.restore();
                    this.setupLayout();
                    this.setupHandlers();
                    RadioTime.debug(this.outline);

                    var _this = this;
                    if (this.outline.oType == "program") {
                        RadioTime.API.getProgramListeningOptions(function(data) {
                            _this.programListeningOptionsAvailable(data);
                        }, function() {
                            _this.fetchDescription();
                        }, this.outline.guide_id);
                    } else {
                        this.fetchDescription();
                    }
                },
                setupLayout: function() {
                    document.body.className = "play";
                    RadioTime.$("meta-title").innerHTML = this.outline.text;
                    RadioTime.UI.$show("back-button");
                    RadioTime.UI.$show("listing-stations-header");
                    RadioTime.UI.$hide("play-progress");
                    RadioTime.UI.$hide("listing-stations");
                    RadioTime.UI.$hide("listing-image");
                    RadioTime.UI.$hide("play-metainfo");
                    RadioTime.UI.$hide("play-onnow");

                    RadioTime.$("main").innerHTML = '';
                    RadioTime.$("main").style.height = this.browseHeight + "px";
                    RadioTime.$("nav-title").innerHTML = '';
                    RadioTime.$("nav-subtitle").innerHTML = '';

                    RadioTime.$("meta-title").innerHTML = this.outline.text || '';
                    RadioTime.$("meta-text").innerHTML = this.outline.subtext || '';
                    RadioTime.$("meta-subtext").innerHTML = '';
                    RadioTime.$("meta-image").src = this.outline.image || 's0q.png';

                    var actions = '';
                    actions += '<li><a id="cmd_play" class="button current play" href="#"><span>Play</span></a></li>';
                    actions += '<li><a id="cmd_preset" href="#" class="button">' + RadioTime.L('add_to_presets') + '</a></li>';
                    actions += '<li><a id="cmd_report" href="#" class="button">' + RadioTime.L('report_problem') + '</a></li>';

                    RadioTime.$("control-actions").innerHTML = actions;
                    RadioTime.$("control-actions-dynamic").innerHTML = "";

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("header"),
                        "type": "horizontal",
                        "mid": "header",
                        "neighbours": {
                            "down": ["main-menu", "main"]
                        }
                    });

                },
                renderTabs: function(outline) {
                    if (!this.isActive()) return;
                    RadioTime.debug(outline);
                    var _this = this;
                    var data = [];
                    var topicsAdded = false;
                    var addTopics = function(outline) {
                        if (outline.has_topics && _this.topicsData && _this.topicsData.length) {
                            data.push({
                                "id": "topics",
                                "name": RadioTime.L("topics_tab"),
                                "moduleId": "listing-stations",
                                "action": function() {
                                    if (_this.topicsData)
                                        _this.renderTopics(_this.topicsData);
                                }
                            });
                            topicsAdded = true;
                        }
                    }

                    if (!(outline.has_onnow && this.onNowElement)) {
                        addTopics(outline);
                        this.currentTab = "topics";
                    }

                    if ((outline.has_onnow && this.onNowElement) || outline.has_song || outline.description) {
                        data.push({
                            "id": "onnow",
                            "name": (outline.has_onnow || outline.has_song) ? RadioTime.L("onnow_tab") : RadioTime.L("about_tab"),
                            "moduleId": "play-onnow",
                            "action": function(refresh) {
                                _this.renderOnNow(refresh);
                            }
                        });
                    }

                    if (outline.has_schedule && this.scheduleData && this.scheduleData.length) {
                        data.push({
                            "id": "lineup",
                            "name": RadioTime.L("lineup_tab"),
                            "moduleId": "listing-stations",
                            "action": function() {
                                if (_this.scheduleData)
                                    _this.renderSchedule(_this.scheduleData);
                            }
                        });
                    }

                    if (!topicsAdded) {
                        addTopics(outline);
                    }

                    if (outline.twitter_id && this.twitterData && this.twitterData.length) {
                        data.push({
                            "id": "twitter",
                            "name": RadioTime.L("twitter_tab"),
                            "moduleId": "play-onnow",
                            "action": function() {
                                if (_this.twitterData)
                                    _this.renderTwitter(_this.twitterData);
                            }
                        });
                    }
                    if (this.relatedData && this.relatedData.length) {
                        data.push({
                            "id": "related",
                            "name": RadioTime.L("related_tab"),
                            "moduleId": "listing-stations",
                            "action": function() {
                                if (_this.relatedData)
                                    _this.renderRelated(_this.relatedData);
                            }
                        });
                    }
                    var out = '';
                    for (var i in data) {
                        data[i].index = i;
                        out += RadioTime.UI.subs('<li><a id="cmd_tabs_%(index)%" href="#" class="button filter" onclick="return RadioTime.UI.currentView.showTab(\'%(id)%\', true);" onfocus="return RadioTime.UI.currentView.showTab(\'%(id)%\');">%(name)%</a></li>', data[i]);
                    }
                    this.tabs = data;
                    RadioTime.$("control-actions-dynamic").innerHTML = out;

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("control-browse"),
                        "type": "vertical",
                        "mid": "main-menu",
                        "neighbours": {
                            "up": ["header"],
                            "right": ["main"],
                            "left": ["pagination"]
                        },
                        "focus": RadioTime.$("cmd_play")
                    });
                    if (this.tabs.length) {
                        this.showTab(this.currentTab) || this.showTab(0);
                    }
                },
                showTab: function(index, refresh) {
                    var displayed = false;
                    RadioTime.debug("show tab " + index + " t: " + typeof index);
                    if (typeof index == "string") {
                        index = this.tabById(index);
                        if (index === false) {
                            return false;
                        }
                    }
                    for (var i in this.tabs) {
                        if (this.tabs[i] && i == index) {
                            if (RadioTime.$("cmd_tabs_" + i)) {
                                RadioTime.$("cmd_tabs_" + i).className = "button filter current";
                            }
                            RadioTime.UI.$show(this.tabs[i].moduleId);
                            this.currentTab = this.tabs[i].id;
                            if (this.tabs[i].action) {
                                this.tabs[i].action(refresh);
                            }
                            displayed = true;
                        } else {
                            if (RadioTime.$("cmd_tabs_" + i)) {
                                RadioTime.$("cmd_tabs_" + i).className = "button filter";
                            }
                            if (this.tabs[i] && (!this.tabs[index] || this.tabs[i].moduleId != this.tabs[index].moduleId)) {
                                RadioTime.UI.$hide(this.tabs[i].moduleId);
                            }
                        }
                    }
                    return displayed;
                },
                /*
                 * Since number of tabs may change dynamically we use ids to identify them
                 */
                tabById: function(id) {
                    for (var i in this.tabs) {
                        if (this.tabs[i].id === id) {
                            return i;
                        }
                    }
                    return false;
                },
                isActive: function() {
                    if (RadioTime.UI.currentView != this) {
                        RadioTime.debug("Too late to render this, user already navigated away");
                        return false;
                    }
                    return true;
                },
                setupHandlers: function() {
                    var _this = this;
                    document.onkeydown = function(e) {
                        e = e || window.event;
                        switch (e.keyCode) {
                            case VK_PLAY:
                                RadioTime.debug("VK_PLAY");
                                if (RadioTime.UI.isPlayPauseCombined) {

                                    if (_this.isPlaying) {
                                        RadioTime.debug("put on pause");
                                        _this.isPaused = true;
                                        RadioTime.UI.player.pause();
                                    } else {
                                        if (_this.isPaused) {
                                            RadioTime.debug("resume");
                                            RadioTime.UI.player.play();
                                            _this.isPaused = false;
                                        } else {
                                            RadioTime.debug("play fresh");
                                            RadioTime.UI.currentView.play();
                                        }
                                    }
                                } else {
                                    RadioTime.UI.currentView.play();
                                }
                                break;
                            default:
                                return RadioTime.UI.handleKeys(e);
                        }
                        return false;
                    }

                    this.addEventHandler("tick", function() {
                        // Check if we need to dim now playing artwork
                        if (_this.isSongInfoExpired() &&
                            RadioTime.$("onnow-content").className != "expired") {
                            RadioTime.$("onnow-content").className = "expired";
                        }
                        if (!_this.isSongInfoExpired() &&
                            RadioTime.$("onnow-content").className != "") {
                            RadioTime.$("onnow-content").className = "";
                        }

                    });
                    this.addEventHandler("schedule", function(data) {
                        if (!_this.outline.has_schedule) {
                            return;
                        }
                        _this.scheduleData = data;
                        var now = RadioTime.now();
                        _this.onNowElement = null;
                        var index = 0;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].end < now.getTime())
                                continue;
                            data[i].sindex = i;
                            index++;
                            data[i].index = index;
                            if (data[i].is_playing) {
                                _this.onNowElement = data[i];
                                continue;
                            }
                        }
                        _this.outline.has_onnow = index > 0;
                        _this.outline.has_schedule = index > 1;
                        _this.renderTabs(_this.outline);

                    });
                    this.addEventHandler("playstateChanged", function(state) {
                        _this.renderPlayOrStop(state);
                    });
                    this.addEventHandler("playlistAvailable", function(playlist) {
                        if (!RadioTime.player.isSupported()) {
                            RadioTime.UI.$show("qt_embed");
                            RadioTime.$("qt_embed").innerHTML = '<embed type="audio/mpeg" src="' + playlist[0].url + '"></embed>';
                        } else {
                            RadioTime.UI.$hide("qt_embed");
                        }
                    });

                    this.addEventHandler("elementFocused", function(elem) {
                        if (!elem.title) {
                            return;
                        }
                        _this.outline.currentOutline = parseInt(elem.title);
                    });
                    this.addEventHandler("pageChanged", function(page) {
                        _this.outline.currentPage = parseInt(page);
                    });
                    this.addEventHandler("pageReset", function(item) {
                        _this.outline.currentOutline = parseInt(item);
                    });
                    this.addEventHandler("multiPage", function(is_multipage) {
                        if (is_multipage) {
                            RadioTime.UI.$show("pagination-caption");
                            RadioTime.UI.$show("pagination-footer");
                            RadioTime.UI.navigator.registerModule({
                                "root": RadioTime.$("pagination-side"),
                                "type": "vertical",
                                "mid": "pagination",
                                "neighbours": {
                                    "up": ["main-menu"],
                                    "right": ["main-menu"],
                                    "left": ["main"]
                                },
                                "onActivate": function(index) {
                                    return _this.outline.currentPage;
                                }
                            });
                        } else {
                            RadioTime.UI.$hide("pagination-caption");
                            RadioTime.UI.$hide("pagination-footer");
                            RadioTime.UI.navigator.unregisterModule("pagination");
                        }
                    });
                    this.addEventHandler("scheduleProgress", function(np) {
                        if (_this.outline.guide_id == np.guide_id) {
                            _this.updateTimebar(np.item);
                        }
                    });
                    RadioTime.$("cmd_play").onclick = function() {
                        return _this.playOrStop();
                    }
                    RadioTime.$("cmd_preset").onclick = function() {
                        _this.togglePreset();
                        return false;
                    }
                    RadioTime.$("cmd_report").onclick = function() {
                        return _this.reportProblem();
                    }
                },
                updateTimebar: function(np) {
                    /*
                    RadioTime.debug(np);
                    RadioTime.UI.$show("elapsed-visual");
                    RadioTime.UI.$show("elapsed-time");
                    RadioTime.$("elapsed-time").innerHTML = RadioTime.formatTime(np.start);
                    var width = RadioTime.$("elapsed-visual").offsetWidth *
                    ((RadioTime.now().getTime() - np.start) / (np.end - np.start));
                    RadioTime.$("elapsed-visual-progress").style.width = width + "px";
                    RadioTime.$("status-details").style.display = "inline";
                    */
                },
                getPlayableId: function() {
                    if (!this.outline) {
                        return 0;
                    }
                    if (this.outline.type == "link" && this.outline.oType == "program" &&
                        this.outline.listeningOptions && this.outline.listeningOptions.length) {
                        return this.outline.listeningOptions[0].guide_id;
                    }
                    return this.outline.guide_id;
                },
                renderPlayOrStop: function(state) {
                    if (!this.isActive()) return;
                    if (typeof state == "undefined") {
                        var state = RadioTime.player.currentState;
                    }
                    switch (state) {
                        case "playing":
                        case "buffering":
                        case "connecting":
                        case "starting":
                        case "stopping":
                            if (RadioTime.UI.player.elementPlaying &&
                                (RadioTime.UI.player.elementPlaying.guide_id == this.getPlayableId())) {
                                RadioTime.$("cmd_play").innerHTML = '<span>' + RadioTime.L('stop') + '</span>';
                                RadioTime.$("cmd_play").className = "button stop";

                                this.isPlaying = true;
                                break;
                            }
                        default:
                            RadioTime.$("cmd_play").innerHTML = '<span>' + RadioTime.L('play') + '</span>';
                            RadioTime.$("cmd_play").className = "button play";
                            this.isPlaying = false;
                    }
                },
                playOrStop: function() {
                    if (this.isPlaying) {
                        return RadioTime.UI.player.stop();
                    } else {
                        return this.play(-1);
                    }
                },
                reportProblem: function() {
                    if (this.outline.guide_id) {
                        RadioTime.history.createRestorePoint();
                        RadioTime.UI.renderView('browse', {
                            "text": RadioTime.L("report_problem"),
                            "URL": RadioTime.getReportProblemUrl(this.outline.guide_id)
                        });
                    }
                    return false;
                },
                togglePreset: function() {
                    var _this = this;
                    if (this.outline.is_preset) {
                        RadioTime.$("cmd_preset").innerHTML = RadioTime.L('removing');
                        RadioTime.API.removePreset(function() {
                            _this.outline.is_preset = false;
                            RadioTime.$("cmd_preset").innerHTML = RadioTime.L('add_to_presets');
                            RadioTime.$("cmd_preset").className = "button add_preset";
                        }, null, this.outline.guide_id);
                    } else {
                        RadioTime.$("cmd_preset").innerHTML = RadioTime.L('adding');
                        RadioTime.API.addPreset(function() {
                            _this.outline.is_preset = true;
                            RadioTime.$("cmd_preset").innerHTML = RadioTime.L('remove_from_presets');
                            RadioTime.$("cmd_preset").className = "button remove_preset";
                        }, null, this.outline.guide_id);
                    }
                },
                fetchDescription: function() {
                    if (this.outline.guide_id) {
                        var _this = this;
                        RadioTime.API.describeComposite(function(data) {
                            _this.relatedData = null;
                            for (var i = 0; i < data.length; i++) {
                                switch (data[i].key) {
                                    case "recommendations":
                                        _this.relatedData = data[i].children;
                                        break;
                                    case "listing":
                                        RadioTime.merge(_this.outline, data[i].children[0]);
                                        // if live, start  ASAP unless something else is playing
                                        // iPad doesn't support auto playback start
                                        if (_this.outline.is_available && !RadioTime.player.isBusy &&
                                            !/iPad/i.test(navigator.userAgent)) {
                                            _this.play(-1);
                                        }
                                        _this.renderPlayOrStop();
                                        if (_this.outline.has_song) {
                                            _this.lastSongUpdate = +new Date();
                                        }
                                        _this.display(_this.outline);
                                        break;
                                    case "schedules":
                                        RadioTime.schedule.init(
                                            _this.outline.guide_id,
                                            RadioTime.processSchedule(data[i].children)
                                        );
                                        break;
                                }
                            }
                            _this.renderTabs(_this.outline);
                        }, function() {
                            RadioTime.UI.$show("play-metainfo");
                            RadioTime.UI.$show("listing-stations");
                            _this.loadingFailed('RadioTime.API.describeComposite: ' + _this.outline.guide_id);
                        }, this.outline.guide_id, "listing,recommendations,schedules");
                    }
                },
                fetchTwitter: function(twitter_id) {
                    if (typeof twitter_id != "string") return;
                    var _this = this;
                    var twitter_ids = twitter_id.split(",");
                    var queryLength = 0; // can't be more than 140 chars so have to cut it before that limit
                    for (var i = 0; i < twitter_ids.length; i++) {
                        twitter_ids[i] = "from%3A" + twitter_ids[i] + "+OR+%40" + twitter_ids[i];
                        queryLength += twitter_ids[i].length + 4; // extra chars for "+OR+"
                        if (queryLength > RadioTime.UI.API.twitter.maxChars) {
                            delete twitter_ids[i];
                            break;
                        }
                    }
                    RadioTime.UI.API.twitter.search(twitter_ids.join("+OR+"), function(data) {
                        RadioTime.debug("twitter");
                        RadioTime.debug(data.results);
                        _this.twitterData = data.results;
                        _this.renderTabs(_this.outline);
                    });
                    /*
                    var req = "https://search.chirppp.ing/search.json?q=" + twitter_ids.join("+OR+");
                    // TODO -- use last_tweet_id to avoid getting the same data twice
                    RadioTime.loader.sendRequest(req, function(data){
                    data = JSON.parse(data.text);
                    _this._twitterTimelineAvailable(data);
                    });
                    */
                },
                programListeningOptionsAvailable: function(data) {
                    data = RadioTime.UI.parseProgramListeningOptions(data);
                    RadioTime.debug("Listening options");
                    RadioTime.debug(data);
                    RadioTime.debug("Outline image:");
                    RadioTime.debug(this.outline.image);
                    this.outline.is_available = (data.has_stations || data.has_topics);

                    if (this.outline.is_available) {
                        if (data.has_topics) {
                            for (var i = 0; i < data.topics.length; i++) {
                                data.topics[i].parent_id = this.outline.guide_id;
                                data.topics[i].image = this.outline.image;
                            }
                        }
                        this.outline.listeningOptions = data.has_stations ? data.stations : [data.topics[0]];
                        RadioTime.$("cmd_play").href = this.outline.listeningOptions[0].URL;
                    }
                    this.fetchDescription();
                    this.outline.has_topics = data.has_topics;
                    if (this.outline.has_topics) {
                        this.outline.topics = data.topics;
                    }
                },
                display: function(data) {
                    if (!this.isActive()) return;
                    // Re-format hosts list into readable format
                    if (data.hosts) {
                        data.hosts = data.hosts.split(";").join(", ");
                    }
                    this.renderDetails(data);
                    if (this.outline.has_topics) { //data.has_topics
                        this.has_topics = true;
                        this.topicsData = this.outline.topics;
                    } else {
                        this.has_topics = false;
                    }
                    if (data.twitter_id) {
                        this.fetchTwitter(data.twitter_id);
                    }
                },
                renderTopics: function(data) {
                    if (!this.isActive()) return;
                    data = RadioTime.response.flatten(data, true);
                    this._outlines = data;
                    var out = [];
                    for (var i = 0; i < data.length; i++) {
                        data[i].index = i;
                        data[i].oType = RadioTime._getIdType(data[i].guide_id);

                        out.push(RadioTime.UI.subs('<li>\
					<a class="button" href="#" onclick="return RadioTime.UI.currentView.play(%(index)%);" id="outlines_%(index)%" title="%(index)%">%(text)%</a>\
					</li>', data[i]));
                    }
                    if (out.length) {
                        this.outline.currentOutline = 0
                        this.renderListingModule(out.join(""), "&nbsp;" /*RadioTime.L('recent_topics')*/ , "");
                    } else {
                        RadioTime.UI.$hide("listing-stations");
                    }
                },
                renderRelated: function(data) {
                    if (!this.isActive()) return;
                    data = RadioTime.response.flatten(data, true);
                    var dataf = [];
                    for (var i = 0; i < data.length; i++) {
                        data[i].oType = RadioTime._getIdType(data[i].guide_id);
                        if (data[i].oType != "station" && data[i].oType != "program") {
                            continue;
                        }
                        dataf.push(data[i]);
                    }
                    this._outlines = dataf;
                    var out = [];
                    for (var i = 0; i < dataf.length; i++) {
                        dataf[i].index = i;
                        dataf[i].simage = dataf[i].image.replace(/(s|q)?\.png/, "q.png");
                        out.push(RadioTime.UI.subs('<li>\
					<a class="button withimage" href="#" onclick="return RadioTime.UI.currentView.info(%(index)%);" id="outlines_%(index)%" title="%(index)%"><img src="%(simage)%" alt="logo" width="70" height="50"/>%(text)%%(subtext? <span class="description">&mdash; %(subtext)%</span>:)%</a>\
					</li>', dataf[i]));
                    }
                    if (out.length) {
                        this.outline.currentOutline = 0
                        this.renderListingModule(out.join(""), "" /*RadioTime.L('related')*/ , "");
                    } else {
                        RadioTime.UI.$hide("listing-stations");
                        this.relatedData = null;
                        this.renderTabs(this.outline);
                    }
                },
                isSongInfoExpired: function() {
                    var now = +new Date();
                    return (this.outline.has_song && now > this.lastSongUpdate + this.songInfoTimeout * 1000);
                },
                renderOnNow: function(refresh) {
                    if (!this.isActive()) return;
                    var out = '';
                    if (this.outline.has_song && refresh) {
                        this.outline.has_song = null;
                        this.outline.current_song = null;
                        this.outline.current_artist = null;
                        this.fetchDescription();
                        return;
                    }
                    //RadioTime.debug(this.outline);
                    if (this.outline.has_song) {
                        out += RadioTime.UI.subs('<div id="album_art"></div><div class="song">%(current_song)%</div>\
					<div class="artist">%(current_artist)%</div>\
					', this.outline);

                    } else if (this.onNowElement) {
                        this.onNowDisplayed = this.onNowElement;
                        if (this.onNowElement.image == RadioTime.$("meta-image").src) {
                            out += RadioTime.UI.subs('<div>\
					<a class="button" href="#" onclick="return RadioTime.UI.currentView.showScheduleItemInfo(%(sindex)%);" id="schedule_outlines_%(index)%"><div class="time">%(timeSpanString)%</div><div>%(text)%</div><div class="clear"></div></a>\
					</div>', this.onNowElement);
                        } else {
                            out += RadioTime.UI.subs('<div>\
					<a class="button" href="#" onclick="return RadioTime.UI.currentView.showScheduleItemInfo(%(sindex)%);" id="schedule_outlines_%(index)%"><img src="%(image)%" alt=""/><div class="time">%(timeSpanString)%</div>%(text)%<div class="clear"></div></a>\
					</div>', this.onNowElement);
                        }
                    } else if (this.outline.description) {
                        if (this.outline.hosts) {
                            out += '<div>' + this.outline.hosts + '</div>';
                        }
                        out += '<div class="description">' + RadioTime.UI.truncateSentence(this.outline.description, 300) + '</div>';
                    } else {
                        out += '<div>' + RadioTime.L('programming_gap') + '</div>';
                    }

                    RadioTime.$("onnow-content").innerHTML = out;

                    if (this.outline.has_song) {
                        RadioTime.UI.API.lastfm.getAlbumArt(
                            function(data) {
                                RadioTime.$("album_art").innerHTML = '<img src="' + data[3]["#text"] + '" alt=""/><img class="attribution" src="images/lastfm_black_small.gif" alt="last.fm"/><div class="clear"></div>';
                            },
                            function() {},
                            this.outline.current_artist,
                            this.outline.current_song
                        );
                    }

                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("onnow-content"),
                        "type": "vertical",
                        "mid": "main",
                        "neighbours": {
                            "up": ["main-menu"],
                            "right": ["pagination"],
                            "left": ["main-menu"]
                        }
                    });

                },
                formatTwitterTimestamp: function(t) {
                    var n = new Date();
                    var y = new Date(n.getTime() - 3600 * 24 * 1000);
                    var out = RadioTime.L('posted_at') + ' ' + t.toLocaleTimeString() + ', ';
                    switch (true) {
                        case n.getDate() == t.getDate():
                            out += RadioTime.L('today');
                            break;
                        case y.getDate() == t.getDate():
                            out += RadioTime.L('yesterday');
                            break;
                        default:
                            out += t.toLocaleDateString();
                    }
                    return out;
                },
                renderTwitter: function(data) {
                    if (!this.isActive()) return;
                    var res = data;
                    var out = '';
                    for (var i = 0; i < Math.min(res.length, this.tweetsPerPage); i++) {
                        res[i].time = this.formatTwitterTimestamp(new Date(res[i].created_at));
                        res[i].txt = res[i].text.replace(/(http:\/\/(\S)*\b)/ig, '<a href="$1">link</a>');
                        out += RadioTime.UI.subs('<div class="tweet"><img src="%(profile_image_url)%"/><div class="tweet-inner"><span class="user">%(from_user)%</span> %(txt)%<div class="clear"></div><div class="ts">%(time)%</div></div></div>', res[i]);
                    }
                    if (out) {
                        RadioTime.$("onnow-content").innerHTML = out;

                        RadioTime.UI.navigator.registerModule({
                            "root": RadioTime.$("onnow-content"),
                            "type": "vertical",
                            "mid": "main",
                            "neighbours": {
                                "up": ["main-menu"],
                                "right": ["pagination"],
                                "left": ["main-menu"]
                            }
                        });
                    } else {
                        RadioTime.$("onnow-content").innerHTML = "";
                        this.outline.twitter_id = "";
                        this.renderTabs(this.outline);
                    }
                },
                renderSchedule: function(data) {
                    if (!this.isActive()) return;
                    this.onNowElement = null;
                    if (!data.length) {
                        return;
                    }
                    var out = [];
                    var index = 0;
                    var now = RadioTime.now();

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].end < now.getTime())
                            continue;

                        data[i].sindex = i;
                        data[i].index = index;
                        index++;

                        if (data[i].is_playing) {
                            this.onNowElement = data[i];
                            continue;
                        }
                        // Make small image URL
                        data[i].simage = data[i].image.replace(/(s|q)?\.png/, "q.png");
                        out.push(RadioTime.UI.subs('<li>\
					<a class="button withimage schedule" href="#" onclick="return RadioTime.UI.currentView.showScheduleItemInfo(%(sindex)%);" id="schedule_outlines_%(index)%" title="%(text)%"><img src="%(simage)%" alt="logo" width="70" height="50"/><span class="time">%(timeSpanString)%</span>%(text)%</a>\
					</li>', data[i]));
                    }
                    if (out.length) {
                        this.outline.currentOutline = 0
                        // TODO: Use RadioTime.tzName here instead
                        this.renderListingModule(out.join(""), RadioTime.L('all_times_in') + ' ' + data[0].tz, '');
                    } else {
                        RadioTime.UI.$hide("listing-stations");
                    }
                },
                renderListingModule: function(html, title, subtitle) {
                    if (typeof this.outline.currentOutline == "undefined") {
                        this.outline.currentOutline = 0;
                    }
                    if (typeof this.outline.currentPage == "undefined") {
                        this.outline.currentPage = 0;
                    }
                    RadioTime.$("main").innerHTML = '<ol id="moving">' + html + '</ol>';
                    RadioTime.$("nav-title").innerHTML = subtitle;
                    RadioTime.$("nav-subtitle").innerHTML = title;
                    RadioTime.UI.$show("listing-stations");
                    this.scroller.init(RadioTime.$("main"), null /*RadioTime.$("pagination-side")*/ , this.browseHeight, /*RadioTime.$("pagination-caption")*/ null, this.browseMaxPages);

                    var _this = this;
                    RadioTime.UI.navigator.registerModule({
                        "root": RadioTime.$("main"),
                        "type": "vertical",
                        "mid": "main",
                        "neighbours": {
                            "up": ["main-menu"],
                            "right": ["pagination"],
                            "left": ["main-menu"]
                        },
                        "onActivate": function(index) {
                            return _this.outline.currentOutline;
                        }
                    });
                },

                showScheduleItemInfo: function(index) {
                    if (RadioTime.schedule.schedule && RadioTime.schedule.schedule[index]) {
                        RadioTime.UI.renderView('info', RadioTime.schedule.schedule[index]);
                    }
                    return false;
                },
                renderDetails: function(data) {
                    if (!this.isActive()) return;
                    RadioTime.debug(data);
                    data.name = data.name || data.title || "";

                    data.is_station = (data.oType == "station") || (data.element == "station");

                    RadioTime.$("meta-title").innerHTML = data.name + '';

                    if (data.frequency) {
                        RadioTime.$("meta-subtext").innerHTML = "<span>" + data.frequency + "</span>  " + data.band + ", ";
                    } else {
                        RadioTime.$("meta-subtext").innerHTML = "";
                    }
                    RadioTime.$("meta-subtext").innerHTML += data.location || "";


                    if (data.slogan) {
                        RadioTime.$("meta-text").innerHTML = data.slogan;
                    } else if (data.genre_name) {
                        RadioTime.$("meta-text").innerHTML = data.genre_name;
                    }

                    RadioTime.$("meta-image").src = data.logo.replace(/(s|q)?\.png/, "q.png");

                    RadioTime.UI.$show("play-metainfo");

                    if (data.is_preset) {
                        RadioTime.$("cmd_preset").innerHTML = RadioTime.L('remove_from_presets');
                        RadioTime.$("cmd_preset").className = "button remove_preset";
                    } else {
                        RadioTime.$("cmd_preset").innerHTML = RadioTime.L('add_to_presets');
                        RadioTime.$("cmd_preset").className = "button add_preset";
                    }
                    if (data.is_available && RadioTime.player.isSupported()) {
                        RadioTime.UI.$show("cmd_play");
                    } else {
                        RadioTime.UI.$hide("cmd_play");
                        RadioTime.$("cmd_preset").focus();
                    }
                }
            }
        },
        popup: {
            id: '',
            show: function(options) {
                this.close();
                this.id = RadioTime.makeId();
                var cover = document.createElement("div");
                cover.className = "cover";
                cover.id = "cover_" + this.id;
                document.body.appendChild(cover);
                var popup = document.createElement("div");
                popup.className = "popup";
                popup.id = "popup_" + this.id;
                document.body.appendChild(popup);
                if (options.html) {
                    popup.innerHTML = options.html;
                }
                var _this = this;
                options.buttons = options.buttons || [{
                    "text": RadioTime.L("Close"),
                    "action": function() {
                        this.close();
                        return false;
                    }
                }];

                for (var i in options.buttons) {
                    (function(btn) {
                        var b = document.createElement("a");
                        b.href = "#";
                        b.innerHTML = btn.text;
                        b.className = btn.className || "button";
                        b.onclick = function() {
                            return btn.action.call(_this);
                        };
                        popup.appendChild(b);
                    })(options.buttons[i]);
                }

                RadioTime.UI.navigator.registerModule({
                    "root": popup,
                    "type": "vertical",
                    "mid": "popup",
                    "neighbours": {},
                    "isModal": true,
                    "focus": popup.lastChild
                });
            },
            close: function() {
                RadioTime.UI.navigator.unregisterModule("popup");
                if (RadioTime.$("popup_" + this.id)) {
                    document.body.removeChild(RadioTime.$("popup_" + this.id));
                }
                if (RadioTime.$("cover_" + this.id)) {
                    document.body.removeChild(RadioTime.$("cover_" + this.id));
                }
            }
        },
        waitIndicator: {
            _refCount: 0,
            _history: [],
            on: function(message) {
                RadioTime.$("status-text").style.display = "inline";

                if (message) {
                    RadioTime.$("status-text").innerHTML = message;
                }
                this._refCount++;
                this._history.push(message);
            },
            off: function(force) {
                this._refCount--;
                this._history.pop();
                if (this._refCount <= 0 || force) {
                    RadioTime.UI.$hide("status-text");
                    this._refCount = 0;
                    this._history = [];
                } else {
                    RadioTime.$("status-text").innerHTML = this._history[this._history.length - 1];
                }
            }
        },
        /*
         * Extra API's used
         */
        API: {
            lastfm: {
                apiKey: "947c1d26e35af6fc9119a7092065e58e",
                baseUrl: "https://ws.audioscrobbler.com/2.0/",
                _cache: {},
                getAlbumArt: function(success, failure, artist, track) {
                    var url = this.baseUrl;
                    url += "?method=track.getInfo";
                    url += "&api_key=" + this.apiKey;
                    if (artist) {
                        url += "&artist=" + encodeURIComponent(artist);
                    }
                    if (track) {
                        url += "&track=" + encodeURIComponent(track);
                    }
                    url += "&format=json&";
                    if (typeof this._cache[url] != "undefined") {
                        if (success && this._cache[url]) {
                            success.call(this, this._cache[url]);
                        }
                        return;
                    }
                    this._cache[url] = false;
                    url = {
                        "url": url
                    };
                    var _this = this;
                    RadioTime._loader.sendRequest(url, function(data) {
                        if (data && data.track && data.track.album && data.track.album.image) {
                            _this._cache[url.url] = data.track.album.image;
                            if (success) {
                                success.call(this, data.track.album.image);
                            }
                        } else {
                            _this._cache[url.url] = false;
                            if (failure) {
                                failure.call(this);
                            }
                        }
                    }, failure);
                }
            },
            twitter: {
                maxChars: 140,
                baseUrl: "https://search.chirppp.ing/search.json",
                search: function(what, success, failure) {
                    var url = this.baseUrl + "?q=" + what + "&";

                    url = {
                        "url": url
                    };
                    var _this = this;
                    RadioTime._loader.sendRequest(url, function(data) {
                            if (data && success) {
                                _this.refershUrl = data.refresh_url;
                                success.call(this, data);
                            }
                        },
                        failure);
                }
            }
        }
    }


}

/*
     FILE ARCHIVED ON 02:11:44 Sep 13, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:44:30 Nov 09, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  capture_cache.get: 0.466
  load_resource: 63.251
  PetaboxLoader3.resolve: 25.563
  PetaboxLoader3.datanode: 18.382
*/