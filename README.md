# p2binder

p2binder is a simple web app for setting up keybinds for speedrunning Portal 2,
and mods based on it. It is intended for new players who want to get into
speedrunning with minimal setup.

p2binder assumes that the user already has [SAR] and [srconfigs] installed.

[SAR]: https://sar.portal2.sr/
[srconfigs]: https://portal2.sr/srconfigs

## Usage

Go to the [website] and select a key, then select which action that key should
perform.

> Note: The scroll wheel cannot be rebound on the website, as it is set to the
> srconfigs aliases `+scrollup` and `+scrolldown`. This performs a jump action
> by default, and can perform use and shoot actions in combination with the
> "Use-swap" and "Supershoot" binds. Refer to the [srconfigs README] for more
> information.

Once your keybinds are configured as you would like, click "Generate" to
download your `init_binds.cfg` file. Place this file in your
`Portal 2/portal2/cfg/` directory, then run `exec init_binds` in the in-game
console to load your keybinds. The file can now be deleted, or you can execute
it again later to reset your keybinds to the same configuration.

[website]: https://binder.portal2.sr/
[srconfigs README]: https://github.com/p2sr/srconfigs?tab=readme-ov-file#binds
