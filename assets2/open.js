/**
 * http://openjs.com
 * Version : 2.01.B
 * By Binny V A
 * License : BSD license
 */
var shortcut = {
    'all_shortcuts': {}, // Menyimpan semua shortcut yang didaftarkan

    'add': function(shortcut_combination, callback, opt) {
        // Konfigurasi default
        var default_options = {
            'type': 'keydown',
            'propagate': false,
            'disable_in_input': false,
            'target': document,
            'keycode': false
        };
        
        if (!opt) opt = default_options;
        else {
            for (var key in default_options) {
                if (typeof opt[key] == 'undefined') opt[key] = default_options[key];
            }
        }

        var ele = opt.target;
        if (typeof opt.target == 'string') ele = document.getElementById(opt.target);
        shortcut_combination = shortcut_combination.toLowerCase();

        // Fungsi handler saat tombol ditekan
        var func = function(e) {
            e = e || window.event;
            
            // Proteksi agar shortcut tidak jalan saat pengguna mengetik di form/input
            if (opt['disable_in_input']) {
                var element;
                if (e.target) element = e.target;
                else if (e.srcElement) element = e.srcElement;
                if (element.nodeType == 3) element = element.parentNode;

                if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
            }

            // Mencari keycode tombol
            var code;
            if (e.keyCode) code = e.keyCode;
            else if (e.which) code = e.which;
            
            var character = String.fromCharCode(code).toLowerCase();
            
            if (code == 188) character = ","; // Spesial karakter koma
            if (code == 190) character = "."; // Spesial karakter titik

            var keys = shortcut_combination.split("+");
            var kp = 0;
            
            // Pemetaan tombol spesial/modifier
            var shift_nums = {
                "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", 
                "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", 
                "=": "+", ";": ":", "'": "\"", ",": "<", ".": ">", "/": "?", "\\": "|"
            };
            
            var special_keys = {
                'esc': 27, 'escape': 27, 'tab': 9, 'space': 32, 'return': 13, 'enter': 13, 
                'backspace': 8, 'scrolllock': 145, 'scroll_lock': 145, 'scroll': 145, 
                'capslock': 20, 'caps_lock': 20, 'caps': 20, 'numlock': 144, 'num_lock': 144, 
                'num': 144, 'pause': 19, 'break': 19, 'insert': 45, 'home': 36, 'delete': 46, 
                'end': 35, 'pageup': 33, 'page_up': 33, 'pu': 33, 'pagedown': 34, 'page_down': 34, 
                'pd': 34, 'left': 37, 'up': 38, 'right': 39, 'down': 40,
                'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115, 'f5': 116, 'f6': 117, 
                'f7': 118, 'f8': 119, 'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123
            };

            var mix_ctrl = false, mix_shift = false, mix_alt = false, mix_meta = false;
            if (e.ctrlKey) mix_ctrl = true;
            if (e.shiftKey) mix_shift = true;
            if (e.altKey) mix_alt = true;
            if (e.metaKey) mix_meta = true;

            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                
                // Cek kecocokan modifier keys
                if (k == 'ctrl' || k == 'control') { kp++; mix_ctrl = true; } 
                else if (k == 'shift') { kp++; mix_shift = true; } 
                else if (k == 'alt') { kp++; mix_alt = true; } 
                else if (k == 'meta') { kp++; mix_meta = true; } 
                else if (k.length > 1) { 
                    if (special_keys[k] == code) kp++;
                } else if (opt['keycode']) {
                    if (opt['keycode'] == code) kp++;
                } else { 
                    if (character == k) kp++;
                    else if (shift_nums[character] && e.shiftKey) {
                        character = shift_nums[character]; 
                        if (character == k) kp++;
                    }
                }
            }

            // Jika semua kombinasi tombol cocok, eksekusi fungsi callback
            if (kp == keys.length && e.ctrlKey == mix_ctrl && e.shiftKey == mix_shift && e.altKey == mix_alt && e.metaKey == mix_meta) {
                callback(e);

                // Stop propagasi event ke browser jika diatur false
                if (!opt['propagate']) {
                    e.cancelBubble = true;
                    e.returnValue = false;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                }
            }
        };

        // Simpan referensi event ke state agar bisa dihapus nanti
        this.all_shortcuts[shortcut_combination] = {
            'callback': func,
            'target': ele,
            'event': opt['type']
        };

        // Pasang event listener ke elemen target
        if (ele.addEventListener) ele.addEventListener(opt['type'], func, false);
        else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func);
        else ele['on' + opt['type']] = func;
    },

    'remove': function(shortcut_combination) {
        shortcut_combination = shortcut_combination.toLowerCase();
        var binding = this.all_shortcuts[shortcut_combination];
        delete(this.all_shortcuts[shortcut_combination]);

        if (binding) {
            var type = binding['event'];
            var ele = binding['target'];
            var callback = binding['callback'];

            // Lepas event listener dari elemen
            if (ele.detachEvent) ele.detachEvent('on' + type, callback);
            else if (ele.removeEventListener) ele.removeEventListener(type, callback, false);
            else ele['on' + type] = false;
        }
    }
};
