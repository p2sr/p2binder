let g_current_selected = null;
let g_set_binds = {
	"w":      [ "+forward",      "+forward"      ],
	"a":      [ "+moveleft",     "+moveleft"     ],
	"s":      [ "+back",         "+back"         ],
	"d":      [ "+moveright",    "+moveright"    ],
	"e":      [ "+use",          "+use"          ],
	"ctrl":   [ "+duck",         "+duck"         ],
	"`":      [ "toggleconsole", "toggleconsole" ],
	"mouse1": [ "+attack",       "+attack"       ],
	"mouse2": [ "+attack2",      "+attack2"      ],
};
const BindMode = {
	ALL: 0,
	CM: 1,
	NON_CM: 2,
};
let g_bind_mode = BindMode.ALL; // Fuck you JS for not having proper enums

function getBinding(key) {
	if (key === null) return [ null, null ];
	if (g_set_binds.hasOwnProperty(key)) {
		return g_set_binds[key];
	} else {
		return [ null, null ];
	}
}

function setModeBinding(key, val) {
	if (key === null) return;
	if (!g_set_binds.hasOwnProperty(key)) g_set_binds[key] = [ null, null ];

	if (g_bind_mode === BindMode.ALL || g_bind_mode === BindMode.CM) {
		g_set_binds[key][0] = val;
	}

	if (g_bind_mode === BindMode.ALL || g_bind_mode === BindMode.NON_CM) {
		g_set_binds[key][1] = val;
	}
}

let keys = document.getElementsByClassName("key");
for (let i = 0; i < keys.length; ++i) {
	let key_attr = keys[i].attributes.getNamedItem("p2key");
	if (key_attr !== null) {
		keys[i].classList.add("bindable");
		keys[i].addEventListener("click", function() {
			if (g_current_selected !== null) {
				g_current_selected.classList.remove("selected");
			}
			g_current_selected = this;
			this.classList.add("selected");
			updateSelected();
		});
	}
}

updateBound();

g_bind_mode = BindMode.ALL;
updateSelected();

let actions = document.getElementsByName("key_action");
for (let i = 0; i < actions.length; ++i) {
	actions[i].checked = false;
	actions[i].addEventListener("change", function() {
		if (this.checked) updateBind();
	});
}

document.getElementById("bind_saveload_name").addEventListener("keydown", function(e) {
	if (e.isComposing || e.keyCode == 229) return;
	if (e.key == ' ' || e.key == '"' || e.key == ':' || e.key == '{' || e.key == '}' || e.key == ';') e.preventDefault();
});

document.getElementById("bind_saveload_name").addEventListener("input", function() {
	updateBind();
});

document.getElementById("bindmode_all").addEventListener("change", function() {
	if (this.checked) {
		g_bind_mode = BindMode.ALL;
		updateSelected();
	}
});

document.getElementById("bindmode_cm").addEventListener("change", function() {
	if (this.checked) {
		g_bind_mode = BindMode.CM;
		updateSelected();
	}
});

document.getElementById("bindmode_non_cm").addEventListener("change", function() {
	if (this.checked) {
		g_bind_mode = BindMode.NON_CM;
		updateSelected();
	}
});

function updateSelected() {
	document.getElementById("bindmode_all").checked = g_bind_mode === BindMode.ALL;
	document.getElementById("bindmode_cm").checked = g_bind_mode === BindMode.CM;
	document.getElementById("bindmode_non_cm").checked = g_bind_mode === BindMode.NON_CM;

	let key_name =
		g_current_selected === null ?
		null :
		g_current_selected.attributes.getNamedItem("p2key").value;

	let active_bind_full = null;
	switch (g_bind_mode) {
		case BindMode.ALL:
			if (getBinding(key_name)[0] === getBinding(key_name)[1]) {
				active_bind_full = getBinding(key_name)[0];
			}
			break;

		case BindMode.CM:
			active_bind_full = getBinding(key_name)[0];
			break;

		case BindMode.NON_CM:
			active_bind_full = getBinding(key_name)[1];
			break;
	}

	let active_bind =
		active_bind_full === null ?
		null :
		active_bind_full.split(" ")[0];
	
	if (active_bind === "save" || active_bind === "load" || active_bind === "saveload") {
		document.getElementById("bind_saveload_name").disabled = false
		document.getElementById("bind_saveload_name").value = active_bind_full.split(" ")[1];
	} else {
		document.getElementById("bind_saveload_name").disabled = true;
		document.getElementById("bind_saveload_name").value = "quick";
		active_bind = active_bind_full;
	}

	let actions = document.getElementsByName("key_action");
	for (let i = 0; i < actions.length; ++i) {
		actions[i].disabled = key_name === null;
		actions[i].checked = actions[i].value == active_bind;
	}
}

function updateBind() {
	let active_bind = null;

	let actions = document.getElementsByName("key_action");
	for (let i = 0; i < actions.length; ++i) {
		if (actions[i].checked) {
			active_bind = actions[i].value;
			break;
		}
	}

	let active_bind_full = null;

	if (active_bind == "save" || active_bind == "load" || active_bind === "saveload") {
		let save_name = document.getElementById("bind_saveload_name").value;
		if (save_name === "") save_name = "quick";
		active_bind_full = `${active_bind} ${save_name}`;
	} else {
		active_bind_full = active_bind;
	}

	if (active_bind === "save" || active_bind === "load" || active_bind === "saveload") {
		document.getElementById("bind_saveload_name").disabled = false
	} else {
		document.getElementById("bind_saveload_name").disabled = true;
		document.getElementById("bind_saveload_name").value = "quick";
	}

	let key_name =
		g_current_selected === null ?
		null :
		g_current_selected.attributes.getNamedItem("p2key").value;

	setModeBinding(key_name, active_bind_full);

	updateBound();
}

function updateBound() {
	for (let i = 0; i < keys.length; ++i) {
		keys[i].classList.remove("bound");
		let key_attr = keys[i].attributes.getNamedItem("p2key");
		if (key_attr !== null) {
			let binding = getBinding(key_attr.value);
			if (binding[0] !== null || binding[1] !== null) keys[i].classList.add("bound");
		}
	}
}

document.getElementById("reset_bind").addEventListener("click", function() {
	let key_name =
		g_current_selected === null ?
		null :
		g_current_selected.attributes.getNamedItem("p2key").value;

	setModeBinding(key_name, null);

	updateBound();
	updateSelected();
});

document.getElementById("gen_cfg").addEventListener("click", function() {
	let file_str = 'bind "mwheelup" "+scrollup"\nbind "mwheeldown" "+scrolldown"\n';

	for (const ent of Object.entries(g_set_binds)) {
		const key = ent[0];
		const cm = ent[1][0];
		const non_cm = ent[1][1];

		let cmd =
			cm === non_cm ?
			cm :
			cm !== null && non_cm !== null ?
			`cm_only ${cm}; non_cm_only ${non_cm}` :
			cm !== null ?
			`cm_only ${cm}` :
			non_cm !== null ?
			`non_cm_only ${non_cm}` :
			null;

		file_str += `bind "${key}" "${cmd}"\n`;
	}

	file_str += "host_writeconfig\n";
	file_str += "echo \"Binds configured! Have fun!\"";

	const blob = new Blob([file_str]);
	const data = window.URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = data;
	a.download = "init_binds.cfg";

	a.click();

	setTimeout(() => {
		window.URL.revokeObjectURL(data);
		a.remove();
	}, 0);
});
